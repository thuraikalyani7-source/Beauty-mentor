const BEAUTY_FACTS = "https://world.openbeautyfacts.org";
const SEARCH_FIELDS = "code,product_name,brands,categories,categories_tags,ingredients_text,ingredients_text_en,image_front_url,image_front_small_url";
const CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_LIMIT = 40;
const searchCache = new Map();
const inFlightSearches = new Map();

function asText(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeProduct(product = {}) {
  const barcode = asText(product.code || product._id);
  const name = asText(product.product_name || product.product_name_en);
  const brand = asText(product.brands);
  const categoryTags = Array.isArray(product.categories_tags)
    ? product.categories_tags.filter((tag) => typeof tag === "string")
    : [];
  const price = typeof product.price === "number" && Number.isFinite(product.price)
    ? { value: product.price, currency: asText(product.currency) }
    : null;
  return {
    id: barcode || `${name || "product"}-${brand || "unknown"}`,
    name: name || "Name not provided",
    brand: brand || "Brand not provided",
    barcode: barcode || "Barcode not provided",
    category: asText(product.categories) || categoryTags.join(", ") || "Category not provided",
    categoryTags,
    ingredients: asText(product.ingredients_text || product.ingredients_text_en),
    image: asText(product.image_front_url || product.image_front_small_url),
    price,
    sourceUrl: barcode ? `${BEAUTY_FACTS}/product/${encodeURIComponent(barcode)}` : BEAUTY_FACTS,
  };
}

function apiError(response, action) {
  if (response.status === 429) return new Error("Open Beauty Facts is receiving too many requests. Please wait a little and try again.");
  if (response.status >= 500) return new Error("Open Beauty Facts is temporarily unavailable. Please try again later.");
  return new Error(`${action} failed with HTTP ${response.status}. Please try again later.`);
}

async function getJson(url, action) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw apiError(response, action);
    try {
      return await response.json();
    } catch {
      throw new Error(`Open Beauty Facts returned an unreadable ${action.toLowerCase()} response. Please try again later.`);
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

function waitForAbort(promise, signal) {
  if (!signal) return promise;
  if (signal.aborted) return Promise.reject(new DOMException("The request was aborted.", "AbortError"));
  return new Promise((resolve, reject) => {
    const onAbort = () => reject(new DOMException("The request was aborted.", "AbortError"));
    signal.addEventListener("abort", onAbort, { once: true });
    promise.then(resolve, reject).finally(() => signal.removeEventListener("abort", onAbort));
  });
}

function rememberSearch(key, products) {
  searchCache.delete(key);
  searchCache.set(key, { savedAt: Date.now(), products });
  while (searchCache.size > CACHE_LIMIT) searchCache.delete(searchCache.keys().next().value);
}

async function requestSearch(query) {
  const params = new URLSearchParams({
    search_terms: query,
    search_simple: "1",
    action: "process",
    json: "1",
    page_size: "16",
    fields: SEARCH_FIELDS,
  });
  const payload = await getJson(`${BEAUTY_FACTS}/cgi/search.pl?${params.toString()}`, "Product search");
  if (!payload || typeof payload !== "object" || Array.isArray(payload) || !Array.isArray(payload.products)) {
    throw new Error("Open Beauty Facts returned an unexpected search response. Please try again later.");
  }
  return payload.products.filter((product) => product && typeof product === "object" && !Array.isArray(product)).map(normalizeProduct);
}

export function searchProducts(query, { signal } = {}) {
  const value = asText(query);
  if (!value) return Promise.reject(new Error("Enter a product name, brand, or barcode first."));
  const key = value.toLocaleLowerCase();
  const cached = searchCache.get(key);
  if (cached && Date.now() - cached.savedAt < CACHE_TTL_MS) {
    searchCache.delete(key);
    searchCache.set(key, cached);
    return waitForAbort(Promise.resolve(cached.products), signal);
  }
  const pending = inFlightSearches.get(key);
  if (pending) return waitForAbort(pending, signal);
  const request = requestSearch(value).then((products) => {
    rememberSearch(key, products);
    return products;
  }).finally(() => inFlightSearches.delete(key));
  inFlightSearches.set(key, request);
  return waitForAbort(request, signal);
}

export async function lookupProductByBarcode(value) {
  const barcode = String(value ?? "").trim().replace(/\s+/g, "");
  if (!/^\d{8,14}$/.test(barcode)) {
    throw new Error("Enter an 8–14 digit barcode. Spaces are ignored; all digits, including leading zeros, are kept.");
  }
  const payload = await getJson(`${BEAUTY_FACTS}/api/v2/product/${encodeURIComponent(barcode)}.json?fields=${SEARCH_FIELDS}`, "Barcode lookup");
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Open Beauty Facts returned an unexpected response. Please try again later.");
  }
  if (payload.status === 0 || payload.status === "0") return { found: false, product: null };
  if ((payload.status === 1 || payload.status === "1") && payload.product && typeof payload.product === "object" && !Array.isArray(payload.product)) {
    const product = normalizeProduct(payload.product);
    return { found: true, product };
  }
  throw new Error("Open Beauty Facts could not confirm whether this product exists. Please try again later.");
}

const CATEGORY_SEARCHES = [
  { query: "cleanser", terms: ["cleanser", "cleansing", "face wash", "body wash"] },
  { query: "moisturizer", terms: ["moistur", "moisturis", "body lotion", "face cream"] },
  { query: "hand cream", terms: ["hand cream", "hand lotion", "moistur"] },
  { query: "sunscreen", terms: ["sunscreen", "sun protection", "sun care"] },
  { query: "shampoo", terms: ["shampoo"] },
  { query: "leave-in conditioner", terms: ["leave-in conditioner", "leave in conditioner"] },
  { query: "conditioner", terms: ["conditioner"] },
  { query: "lip balm", terms: ["lip balm"] },
  { query: "deodorant", terms: ["deodorant", "antiperspirant"] },
  { query: "shaving gel", terms: ["shaving gel", "shaving cream"] },
  { query: "brow pencil", terms: ["brow pencil", "eyebrow pencil", "brow cosmetic"] },
  { query: "eye makeup", terms: ["eye makeup", "eye cosmetics", "eye-area cosmetic"] },
];

export function getCategorySearchSpec(categoryLabel) {
  const label = asText(categoryLabel).toLocaleLowerCase();
  return CATEGORY_SEARCHES.find((spec) => spec.terms.some((term) => label.includes(term))) || null;
}

function normalizeCategoryText(product) {
  return [product.category, ...(product.categoryTags || [])]
    .join(" ")
    .toLocaleLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ");
}

export function matchProductsToCategory(products, spec, { sensitive = false, budget = "" } = {}) {
  if (!spec) return [];
  const unique = new Map();
  for (const product of products) {
    if (!product || product.name === "Name not provided" || product.category === "Category not provided") continue;
    const categories = normalizeCategoryText(product);
    if (!spec.terms.some((term) => categories.includes(term.replace(/[^a-z0-9]+/g, " ").trim()))) continue;
    // With a sensitivity preference, avoid surfacing records that provide no
    // ingredient text to review. Available lists are still not proof of safety.
    if (sensitive && !product.ingredients) continue;
    const key = product.barcode !== "Barcode not provided" ? product.barcode : product.id;
    if (unique.has(key)) continue;
    unique.set(key, product);
  }
  return [...unique.values()].sort((a, b) => {
    const aCompleteness = Number(Boolean(a.ingredients)) + Number(Boolean(a.image)) + Number(a.brand !== "Brand not provided");
    const bCompleteness = Number(Boolean(b.ingredients)) + Number(Boolean(b.image)) + Number(b.brand !== "Brand not provided");
    if (sensitive && Boolean(a.ingredients) !== Boolean(b.ingredients)) return Number(Boolean(b.ingredients)) - Number(Boolean(a.ingredients));
    if (budget === "Budget-friendly" && a.price && b.price && a.price.currency === b.price.currency) return a.price.value - b.price.value;
    return bCompleteness - aCompleteness;
  }).slice(0, 3);
}

export { BEAUTY_FACTS };
