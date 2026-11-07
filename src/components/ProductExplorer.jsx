import { useEffect, useMemo, useState } from "react";
import BarcodeScanner from "./BarcodeScanner.jsx";
import RoutineWeather from "./RoutineWeather.jsx";
import { BEAUTY_FACTS, getCategorySearchSpec, lookupProductByBarcode, matchProductsToCategory, searchProducts } from "../services/productCatalog.js";

function normalizeBarcode(value) {
  return String(value ?? "").trim().replace(/\s+/g, "");
}

function isBarcode(value) {
  return /^\d{8,14}$/.test(normalizeBarcode(value));
}

const emptyLookupState = () => ({ status: "idle", error: "", products: [] });

function buildRoutineProductSearches(generatedRoutine) {
  const byQuery = new Map();
  for (const step of [...generatedRoutine.morning, ...generatedRoutine.evening, ...generatedRoutine.general]) {
    for (const instruction of step.instructions) {
      for (const category of instruction.productCategories || []) {
        const spec = getCategorySearchSpec(category.label);
        if (!spec) continue;
        if (!byQuery.has(spec.query)) byQuery.set(spec.query, spec);
      }
    }
  }
  return [...byQuery.values()];
}

function deduplicateRoutineCandidates(entries) {
  const seen = new Set();
  return entries.map(([query, state]) => {
    let duplicateRemoved = false;
    const products = (state.products || []).filter((product) => {
      const key = product.barcode !== "Barcode not provided" ? product.barcode : product.id;
      if (seen.has(key)) {
        duplicateRemoved = true;
        return false;
      }
      seen.add(key);
      return true;
    });
    return [query, {
      ...state,
      products,
      status: products.length ? "results" : duplicateRemoved ? "alreadySuggested" : state.status,
    }];
  });
}

function ProductCandidate({ product, category, concerns }) {
  const providedIngredients = Boolean(product.ingredients);
  const priceText = product.price
    ? `${product.price.value}${product.price.currency ? ` ${product.price.currency}` : " (currency not provided)"}`
    : "Price not provided in this catalogue record.";
  return (
    <article className="routine-product-candidate">
      <div className="routine-product-candidate-top">
        {product.image ? <img src={product.image} alt={`Package for ${product.name}`} loading="lazy" /> : <div className="routine-product-image-missing">Image not provided</div>}
        <div>
          <h5>{product.name}</h5>
          {product.brand !== "Brand not provided" && <p className="routine-candidate-brand">{product.brand}</p>}
          <p className="routine-candidate-category"><strong>Catalogue category:</strong> {product.category}</p>
        </div>
      </div>
      <p className="routine-candidate-match">Its catalogue category matches <strong>{category.label}</strong>, the optional category shown for {concerns.join(", ")}. This is a category match only; it does not show that the product addresses the concern or is suitable for you.</p>
      <p className="routine-candidate-price">{priceText}</p>
      <details className="routine-candidate-ingredients">
        <summary>Ingredient information</summary>
        <p>{providedIngredients ? product.ingredients : "Open Beauty Facts does not provide an ingredient list for this record."}</p>
        <p>Catalogue records are community supplied and may be incomplete. Review the package label; this list does not establish safety or suitability.</p>
      </details>
      <a className="routine-candidate-source" href={product.sourceUrl} target="_blank" rel="noreferrer">Open Beauty Facts record</a>
    </article>
  );
}

function RoutineProductMatches({ category, concerns, productSearch, onExploreCategory }) {
  const spec = getCategorySearchSpec(category.label);
  if (!spec) return <p className="routine-candidate-status">A catalogue search is not available for this category yet. The care step and no-purchase option remain available.</p>;
  const state = productSearch[spec.query] || { status: "loading", products: [] };
  return (
    <div className="routine-product-matches" aria-live="polite">
      <h5>Named catalogue candidates to review</h5>
      {state.status === "loading" && <p className="routine-candidate-status" role="status">Checking Open Beauty Facts for records in this category…</p>}
      {state.status === "error" && <p className="routine-candidate-status routine-candidate-error" role="status">{state.error} Your guidance-based routine is still available.</p>}
      {(state.status === "empty" || state.status === "noCategoryMatch") && <p className="routine-candidate-status">{state.status === "noCategoryMatch" ? "Open Beauty Facts returned products, but none had catalogue category information matching this recommendation." : "No matching catalogue candidates are available right now."} The category, care steps, and no-purchase option are still available.</p>}
      {state.status === "sensitiveDataLimited" && <p className="routine-candidate-status">Category matches were returned, but their records did not include ingredient text to review alongside your sensitivity preference. No named candidate is shown.</p>}
      {state.status === "alreadySuggested" && <p className="routine-candidate-status">Matching catalogue items are already shown under another recommended category. Use Explore more to review additional results.</p>}
      {state.products?.map((product) => <ProductCandidate key={product.id} product={product} category={category} concerns={concerns} />)}
      <button type="button" className="routine-explore-category" onClick={() => onExploreCategory?.(spec.query)}>Explore more “{spec.query}” products</button>
    </div>
  );
}

function RoutineSteps({ title, steps, sources, productSearch, onExploreCategory }) {
  if (!steps.length) return null;
  return (
    <section className="generated-routine-group" aria-label={title}>
      <h3>{title}</h3>
      <ol>
        {steps.map((step) => (
          <li key={step.id}>
            <strong>{step.title}</strong>
            {step.instructions.map((instruction) => (
              <div className="generated-routine-instruction" key={step.id}>
                {(instruction.texts || [instruction.text]).filter(Boolean).map((text) => <p key={text}>{text}</p>)}
                <p className="generated-routine-why">For: {instruction.concerns.join(", ")}</p>
                {instruction.productCategories?.length > 0 ? <div className="generated-routine-actionability">
                  <p><strong>Optional product categories</strong></p>
                  <ul>{instruction.productCategories.map((category) => <li key={category.label}>
                    <strong>{category.label}</strong> — {category.use}
                    <RoutineProductMatches category={category} concerns={instruction.concerns} productSearch={productSearch} onExploreCategory={onExploreCategory} />
                  </li>)}</ul>
                </div> : <p className="generated-routine-no-category"><strong>Product category:</strong> No specific category is recommended in the reviewed guidance for this step.</p>}
                {instruction.alternatives?.length > 0 && <p className="generated-routine-alternative"><strong>No-purchase option:</strong> {instruction.alternatives.join(" ")}</p>}
                {instruction.sources.length > 0 && <p className="generated-routine-sources"><strong>Sources:</strong> {instruction.sources.map((sourceKey) => sources[sourceKey]).filter(Boolean).map((source) => <a href={source.url} key={source.url} target="_blank" rel="noreferrer">{source.label}</a>)}</p>}
              </div>
            ))}
          </li>
        ))}
      </ol>
    </section>
  );
}

function GuidanceRoutine({ generatedRoutine, productSearch, onExploreCategory }) {
  const hasSteps = generatedRoutine.morning.length + generatedRoutine.evening.length + generatedRoutine.general.length > 0;
  return (
    <section className="generated-routine" aria-labelledby="generated-routine-title">
      <header>
        <h2 id="generated-routine-title">Guidance-based routine</h2>
        <p>These educational steps update from your current Beauty Guide selections. Named items below are catalogue candidates matched by their listed category, not proof of suitability or efficacy. Saved products remain separate; you do not need to buy or add a product to use this guidance.</p>
        {generatedRoutine.cataloguePreferences?.budget === "Budget-friendly" && <p className="routine-catalogue-note">Open Beauty Facts does not provide price data in this product search, so candidates cannot be compared by cost. Your routine remains usable without buying anything.</p>}
      </header>
      {!generatedRoutine.supported || !hasSteps ? (
        <p className="generated-routine-empty" role="status">{generatedRoutine.emptyMessage}</p>
      ) : <>
        {generatedRoutine.morning.length > 0 && <RoutineSteps title="Morning" steps={generatedRoutine.morning} sources={generatedRoutine.sources} productSearch={productSearch} onExploreCategory={onExploreCategory} />}
        {generatedRoutine.evening.length > 0 && <RoutineSteps title="Evening" steps={generatedRoutine.evening} sources={generatedRoutine.sources} productSearch={productSearch} onExploreCategory={onExploreCategory} />}
        {generatedRoutine.general.length > 0 && <>
          <p className="generated-routine-timing-note">The reviewed guidance does not assign these steps to morning or evening, so they are listed as general guidance without a guessed schedule.</p>
          <RoutineSteps title="General guidance · no time specified" steps={generatedRoutine.general} sources={generatedRoutine.sources} productSearch={productSearch} onExploreCategory={onExploreCategory} />
        </>}
        {generatedRoutine.contextNotes.length > 0 && <div className="generated-routine-context">
          {generatedRoutine.contextNotes.map((note) => <p key={note.label}><strong>{note.label}:</strong> {note.text}</p>)}
        </div>}
        {generatedRoutine.concernNotes.length > 0 && <details className="generated-routine-cautions">
          <summary>Concern-specific explanations and cautions</summary>
          {generatedRoutine.concernNotes.map((note) => <article key={note.concern}>
            <h4>{note.concern}</h4>
            <p>{note.explanation}</p>
            {note.precautions.length > 0 && <ul>{note.precautions.map((item) => <li key={item}>{item}</li>)}</ul>}
            {note.seek && <p><strong>When to seek advice:</strong> {note.seek}</p>}
          </article>)}
        </details>}
        {generatedRoutine.missingConcerns.length > 0 && <p className="generated-routine-empty" role="note">Reviewed routine guidance is not available for: {generatedRoutine.missingConcerns.join(", ")}. No unrelated steps were added for these concerns.</p>}
      </>}
      <p className="generated-routine-disclaimer">This is general educational guidance, not a diagnosis or treatment plan. Stop anything that causes irritation and seek qualified advice for persistent, painful, severe, or worrying symptoms.</p>
    </section>
  );
}

export default function ProductExplorer({ onBack, onTabChange, onExploreCategory, initialQuery = "", routine, setRoutine, generatedRoutine, profile, weatherState, onLoadWeather, onRefreshWeather, initialTab = "explore" }) {
  const [tab, setTab] = useState(initialTab);
  const [query, setQuery] = useState(initialQuery);
  const [barcodeQuery, setBarcodeQuery] = useState("");
  const [searchState, setSearchState] = useState(emptyLookupState);
  const [barcodeState, setBarcodeState] = useState(emptyLookupState);
  const [activeLookup, setActiveLookup] = useState("search");
  const [selected, setSelected] = useState(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [routineMessage, setRoutineMessage] = useState("");
  const [routineProductSearchState, setRoutineProductSearchState] = useState({ key: "", results: {} });
  const routineProductSearches = useMemo(() => buildRoutineProductSearches(generatedRoutine), [generatedRoutine]);
  const cataloguePreferences = generatedRoutine.cataloguePreferences || { sensitive: false, budget: "" };
  const catalogueSensitive = cataloguePreferences.sensitive;
  const catalogueBudget = cataloguePreferences.budget;
  const routineSearchKey = JSON.stringify({ queries: routineProductSearches.map((item) => item.query), sensitive: catalogueSensitive, budget: catalogueBudget });
  const routineProductSearch = routineProductSearchState.key === routineSearchKey ? routineProductSearchState.results : {};

  useEffect(() => {
    if (tab !== "routine" || routineProductSearches.length === 0) return undefined;
    let active = true;
    Promise.all(routineProductSearches.map(async (spec) => {
      try {
        const products = await searchProducts(spec.query);
        const categoryMatches = matchProductsToCategory(products, spec, { sensitive: false });
        const candidates = matchProductsToCategory(products, spec, { sensitive: catalogueSensitive, budget: catalogueBudget });
        const status = candidates.length ? "results" : products.length === 0 ? "empty" : categoryMatches.length > 0 && catalogueSensitive ? "sensitiveDataLimited" : "noCategoryMatch";
        return [spec.query, { status, products: candidates }];
      } catch (error) {
        const message = error?.name === "AbortError"
          ? "The catalogue search took too long."
          : error instanceof TypeError
            ? "Could not connect to Open Beauty Facts. Check your internet connection and try again."
            : error instanceof Error ? error.message : "Open Beauty Facts could not be searched right now.";
        return [spec.query, { status: "error", error: message, products: [] }];
      }
    })).then((entries) => {
      if (active) setRoutineProductSearchState({ key: routineSearchKey, results: Object.fromEntries(deduplicateRoutineCandidates(entries)) });
    });
    return () => { active = false; };
  }, [tab, routineProductSearches, routineSearchKey, catalogueSensitive, catalogueBudget]);

  const lookup = async (input, kind = "search") => {
    const setLookupState = kind === "barcode" ? setBarcodeState : setSearchState;
    setActiveLookup(kind);
    setSelected(null);
    setRoutineMessage("");
    const value = kind === "barcode" ? normalizeBarcode(input) : input.trim();
    if (!value) {
      setLookupState({ status: "error", error: kind === "barcode" ? "Enter barcode digits first." : "Enter a product name, brand, or barcode first.", products: [] });
      return;
    }
    if (kind === "barcode" && !isBarcode(value)) {
      setLookupState({ status: "error", error: "Enter an 8–14 digit barcode. Spaces are ignored; all digits, including leading zeros, are kept.", products: [] });
      return;
    }
    setScannerOpen(false);
    setLookupState({ status: "loading", error: "", products: [] });
    try {
      let results;
      let confirmedMissing = false;
      if (kind === "barcode" || isBarcode(value)) {
        const response = await lookupProductByBarcode(value);
        confirmedMissing = !response.found;
        results = response.found ? [response.product] : [];
      } else {
        results = await searchProducts(value);
      }

      setLookupState({
        status: results.length ? "results" : confirmedMissing ? "notFound" : "empty",
        error: "",
        products: results,
      });
    } catch (error) {
      const message = error?.name === "AbortError"
        ? "The request took too long. Check your connection and try again."
        : error instanceof TypeError
          ? "Could not connect to Open Beauty Facts. Check your internet connection and try again."
          : error instanceof Error ? error.message : "The product lookup failed. Please try again.";
      setLookupState({ status: "error", error: message, products: [] });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    lookup(query, "search");
  };

  const handleBarcodeSubmit = (event) => {
    event.preventDefault();
    lookup(barcodeQuery, "barcode");
  };

  const visibleLookup = activeLookup === "barcode" ? barcodeState : searchState;

  const addToRoutine = (time) => {
    if (!selected) return;
    setRoutine((previous) => {
      const list = previous[time] || [];
      return list.some((item) => item.id === selected.id)
        ? previous
        : { ...previous, [time]: [...list, selected] };
    });
    setRoutineMessage(`Added to your proposed ${time} routine.`);
  };

  const removeFromRoutine = (time, id) => {
    setRoutine((previous) => ({ ...previous, [time]: (previous[time] || []).filter((item) => item.id !== id) }));
  };

  const exploreCategory = (searchTerm) => {
    setQuery(searchTerm);
    setTab("explore");
    setSelected(null);
    setActiveLookup("search");
    setSearchState(emptyLookupState());
    onExploreCategory?.(searchTerm);
  };

  return (
    <div className="app product-app">
      <nav className="navbar">
        <div className="logo">✦ Beauty Mentor</div>
        <button type="button" className="dashboard-return product-back" onClick={onBack}>← Dashboard</button>
      </nav>
      <main className="product-page">
        <button type="button" className="back-button" onClick={selected ? () => { setSelected(null); setRoutineMessage(""); } : onBack}>
          {selected ? "← Back to products" : "← Back to dashboard"}
        </button>
        <header className="product-heading">
          <p className="tagline">BEAUTY MENTOR TOOLS</p>
          <h1>{tab === "routine" ? "My proposed routine" : selected ? "Product details" : "Product Explorer"}</h1>
          <p>Look up community-listed cosmetics and review the available label information.</p>
        </header>

        <div className="product-tabs" role="tablist" aria-label="Product tools">
          <button type="button" role="tab" aria-selected={tab === "explore"} className={tab === "explore" ? "product-tab active-product-tab" : "product-tab"} onClick={() => { setTab("explore"); setSelected(null); onTabChange?.("explore"); }}>Explore products</button>
          <button type="button" role="tab" aria-selected={tab === "routine"} className={tab === "routine" ? "product-tab active-product-tab" : "product-tab"} onClick={() => { setTab("routine"); setSelected(null); onTabChange?.("routine"); }}>My routine</button>
        </div>

        {tab === "routine" ? (
          <>
            <RoutineWeather weatherState={weatherState} onLoadWeather={onLoadWeather} onRefreshWeather={onRefreshWeather} profile={profile} />
            <GuidanceRoutine generatedRoutine={generatedRoutine} productSearch={routineProductSearch} onExploreCategory={exploreCategory} />
            <section className="routine-saved-products" aria-labelledby="saved-routine-products-title">
              <h2 id="saved-routine-products-title">Products you selected (optional)</h2>
              <p className="product-muted">These are catalogue products you manually added. Their listing or ingredient information does not establish safety or suitability.</p>
              <div className="routine-layout" aria-label="Saved morning and evening products">
                {[['morning', 'Morning'], ['evening', 'Evening']].map(([key, label]) => (
                  <div className="routine-column" key={key}>
                    <h2>{label}</h2>
                    {routine[key]?.length ? routine[key].map((product) => (
                      <article className="routine-item" key={product.id}>
                        {product.image && <img src={product.image} alt="" />}
                        <div><h3>{product.name}</h3><p>{product.brand}</p></div>
                        <button type="button" className="remove-routine-button" onClick={() => removeFromRoutine(key, product.id)}>Remove</button>
                      </article>
                    )) : <p className="product-muted">No products saved for this time. Product choices are optional; your guidance-based routine is above.</p>}
                  </div>
                ))}
                <p className="routine-note">These manually selected products are saved in this browser. They are separate from the educational guidance above and do not provide reminders or medical advice.</p>
              </div>
            </section>
          </>
        ) : selected ? (
          <section className="product-detail-card">
            <div className="product-detail-top">
              {selected.image ? <img className="product-detail-image" src={selected.image} alt={`Product package for ${selected.name}`} /> : <div className="product-image-missing">No product image provided</div>}
              <div className="product-detail-copy">
                <p className="tagline">{selected.brand}</p>
                <h2>{selected.name}</h2>
                <dl>
                  <dt>Barcode</dt><dd>{selected.barcode}</dd>
                  <dt>Category</dt><dd>{selected.category}</dd>
                  <dt>Ingredients</dt><dd className="ingredients-copy">{selected.ingredients || "Ingredient list not provided"}</dd>
                  {selected.price && <><dt>Price</dt><dd>{selected.price.value}{selected.price.currency ? ` ${selected.price.currency}` : " (currency not provided)"}</dd></>}
                </dl>
              </div>
            </div>
            <p className="product-caution">Product records are community supplied and may be incomplete or outdated. A barcode or ingredient list does not establish that a product is safe or suitable for you. Check the package label and consult a qualified professional if you have a concern.</p>
            <p className="product-source">Source: <a href={selected.sourceUrl} target="_blank" rel="noreferrer">Open Beauty Facts product record</a>. Product data is shared under ODbL/DBCL; contributed product images are generally CC BY-SA. <a href="https://world.openbeautyfacts.org/terms-of-use" target="_blank" rel="noreferrer">Reuse terms</a>.</p>
            {routineMessage && <p className="routine-added" role="status">{routineMessage}</p>}
            <div className="routine-actions">
              <button type="button" className="next-step-button" onClick={() => addToRoutine("morning")}>Add to morning routine</button>
              <button type="button" className="next-step-button secondary-step-button" onClick={() => addToRoutine("evening")}>Add to evening routine</button>
            </div>
          </section>
        ) : (
          <>
            <section className="product-search-card">
              <form onSubmit={handleSubmit} className="product-search-form">
                <label htmlFor="product-query">Search by product name, brand, or barcode</label>
                <div className="product-search-controls">
                  <input id="product-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. moisturizer, brand, or barcode" />
                  <button type="submit" className="next-step-button" disabled={searchState.status === "loading"}>{searchState.status === "loading" ? "Searching…" : "Search"}</button>
                </div>
              </form>
              <div className="scan-row">
                <button type="button" className="secondary-product-button" onClick={() => setScannerOpen((open) => !open)}>▦ Scan Barcode</button>
                <label className="manual-barcode-label" htmlFor="manual-barcode">or enter a barcode</label>
                <form className="manual-barcode-row" onSubmit={handleBarcodeSubmit}><input id="manual-barcode" inputMode="numeric" autoComplete="off" value={barcodeQuery} onChange={(event) => setBarcodeQuery(event.target.value)} placeholder="Barcode digits" /><button type="submit" className="secondary-product-button" disabled={barcodeState.status === "loading"}>{barcodeState.status === "loading" ? "Looking up…" : "Look up"}</button></form>
              </div>
              {scannerOpen && <BarcodeScanner onDetected={(code) => { setBarcodeQuery(code); lookup(code, "barcode"); }} onClose={() => setScannerOpen(false)} />}
              <p className="product-muted">Barcode lookup can find a database entry; it cannot confirm that the ingredients are complete or that the product is suitable.</p>
            </section>

            {visibleLookup.status === "loading" && <p className="product-state" role="status">{activeLookup === "barcode" ? "Looking up barcode on Open Beauty Facts…" : "Searching Open Beauty Facts…"}</p>}
            {visibleLookup.status === "error" && <p className="product-state product-error" role="alert">{visibleLookup.error}</p>}
            {visibleLookup.status === "notFound" && <p className="product-state" role="status">Product not found. This barcode is not listed in Open Beauty Facts. Some cosmetics are not in the catalogue, and existing records may have incomplete information.</p>}
            {visibleLookup.status === "empty" && <p className="product-state" role="status">Open Beauty Facts returned no matches for this search. That does not necessarily mean the product is absent from the database. Try the exact product name printed on the package, the brand plus product type, or the barcode.</p>}
            {visibleLookup.status === "results" && <section className="product-results" aria-label="Product results"><h2>{activeLookup === "barcode" ? "Barcode match" : "Search results"}</h2><div className="product-grid">{visibleLookup.products.map((product) => <button type="button" className="product-result-card" key={product.id} onClick={() => { setSelected(product); setRoutineMessage(""); }}>
              {product.image ? <img src={product.image} alt="" loading="lazy" /> : <span className="product-result-image-missing">No image</span>}
              <span className="product-result-info"><strong>{product.name}</strong><small>{product.brand}</small><small>{product.category}</small><span>Review details →</span></span>
            </button>)}</div></section>}
            <p className="product-attribution">Live lookup source: <a href={BEAUTY_FACTS} target="_blank" rel="noreferrer">Open Beauty Facts</a> · The catalogue is community-maintained and coverage varies.</p>
          </>
        )}
      </main>
      <footer><p>© 2026 Beauty Mentor</p><p>For educational purposes only — not medical advice.</p></footer>
    </div>
  );
}
