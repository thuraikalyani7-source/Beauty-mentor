// Optional product categories are mapped only to existing reviewed routine
// steps. These are categories, never claims about a particular product.
const RECOMMENDATIONS = {
  Face: {
    "gentle-cleanse": {
      categories: [{ label: "Mild, non-abrasive facial cleanser", use: "Use gently with lukewarm water; avoid scrubbing." }],
      alternative: "Keep washing gentle and avoid scrubbing; you do not need to add a new cleanser if you already have one that suits you.",
      sources: ["acne", "acneCare", "spots", "routine", "pores", "redness", "rosacea", "oily", "dry", "patch", "exfoliate"],
    },
    "sun-protection": {
      categories: [{ label: "Broad-spectrum, water-resistant SPF 30+ sunscreen", use: "Use on exposed skin outdoors and follow the product label." }],
      alternative: "Use shade and sun-protective clothing where practical.",
      sources: ["sunscreen"],
    },
    moisturize: {
      categories: [{ label: "Moisturizer you tolerate; fragrance-free options may suit easily irritated skin", use: "Apply while skin is slightly damp, following the label." }],
      alternative: "Keep the routine gentle and continue a familiar moisturizer if it is comfortable; buying a new one is not required.",
      sources: ["dry"],
    },
    "patch-test": {
      alternative: "Keep to familiar products and do not test anything on irritated or broken skin.",
      sources: ["patch"],
    },
  },
  Nose: {}, Cheeks: {}, Ears: {},
  Hair: {
    "hair-gentle-wash": {
      categories: [{ label: "Shampoo suited to your scalp and hair type", use: "Apply mainly to the scalp and rinse; follow the label." }],
      alternative: "Wash the scalp gently and avoid rubbing shampoo into the hair lengths.",
      sources: ["healthyHair"],
    },
    "scalp-cleanse": {
      categories: [{ label: "A shampoo suited to your scalp", use: "Apply to the scalp and rinse thoroughly. This guidance does not call for a medicated product." }],
      alternative: "Rinse the scalp and hair thoroughly and avoid scrubbing the lengths.",
      sources: ["healthyHair"],
    },
    "scalp-gentle": {
      categories: [{ label: "Gentle, non-medicated shampoo", use: "Rinse thoroughly and stop if it causes irritation." }],
      alternative: "Use familiar products you already tolerate, rinse well, and avoid scratching or vigorous scrubbing.",
      sources: ["dryScalp", "itchyScalp"],
    },
    "hair-condition": {
      categories: [{ label: "Rinse-out conditioner", use: "Apply mainly to lengths and ends as described in the guidance and product label." }],
      alternative: "Handle hair gently and reduce friction; conditioner is optional if you already have a routine that works for you.",
      sources: ["healthyHair"],
      conditionalCategories: [{ source: "leaveIn", label: "Optional leave-in conditioner", use: "For dry, frizzy, brittle, or tangled lengths, apply a small amount to damp mid-lengths and ends, not the scalp; follow the label." }],
    },
  },
  Eyes: {
    "eye-sun-shade": {
      categories: [{ label: "Sunglasses; sunscreen only if its label allows use around the eyes", use: "Use shade and keep any sunscreen out of the eye; follow its label." }],
      alternative: "Use shade and sunglasses outdoors; no eye-area product is required.",
      sources: ["sunscreenChoice"],
    },
    "eye-cool-compress": {
      alternative: "A clean, cool compress over closed eyelids may temporarily ease mild puffiness; do not press on the eyeball.",
      sources: ["darkCircles"],
    },
    "eye-gentle-skin": {
      alternative: "Avoid rubbing or scratching, and keep ordinary skincare away from the eye itself.",
      sources: ["eyelidDermatitis"],
    },
  },
  Eyebrows: {
    "brow-gentle-cosmetic": {
      categories: [{ label: "Optional brow cosmetic intended for the eye area", use: "Use only as labeled and remove gently; it is cosmetic and not needed for care." }],
      alternative: "Natural brow shape does not need correction; gentle grooming without a product is enough.",
      sources: ["eyeCosmetics"],
    },
    "brow-stop-irritant": {
      alternative: "Pause the suspected product and avoid adding products while the skin is inflamed.",
      sources: ["nhsEyelids"],
    },
  },
  Eyelashes: {
    "lash-gentle-care": {
      alternative: "Avoid rubbing or tugging; lash-growth products and extensions are not required.",
      sources: ["eyeCosmetics"],
    },
    "lash-cosmetic-hygiene": {
      categories: [{ label: "Optional eye-area cosmetic", use: "Use only products intended for the eye area and follow the label; no cosmetic is required." }],
      alternative: "Wash hands, use clean tools, and do not share eye cosmetics.",
      sources: ["eyeCosmetics"],
    },
    "lash-stop-irritant": {
      alternative: "Stop the suspected eye cosmetic or adhesive and avoid makeup on inflamed eyelid skin.",
      sources: ["eyeCosmetics"],
    },
  },
  Lips: {
    "lip-gentle-care": {
      categories: [{ label: "Plain lip balm you tolerate; SPF 15+ lip balm outdoors", use: "Follow the label; NHS advises reapplying SPF 15+ lip balm every two hours outdoors." }],
      alternative: "Avoid licking, biting, picking, or scrubbing the lips; protect them from wind where practical.",
      sources: ["nhsLips"],
    },
    "lip-avoid-irritants": {
      alternative: "Stop a lip product that burns or causes a rash and avoid repeatedly trying the suspected trigger.",
      sources: ["lipContact"],
    },
  },
  Neck: {
    "body-tone-protect": {
      categories: [{ label: "Broad-spectrum sunscreen for exposed skin", use: "Use outdoors as directed on its label." }],
      alternative: "Use shade or clothing to cover the area where practical; avoid irritating or lightening treatments.",
      sources: ["sunscreen"],
    },
    "body-gentle-moisture": {
      categories: [
        { label: "Gentle body wash", use: "Use comfortably warm water and keep washing gentle." },
        { label: "Fragrance-free cream moisturizer for dry skin", use: "Pat dry and apply while skin is slightly damp." },
      ],
      alternative: "Use brief, comfortably warm washing and pat dry; a new product is not required if your current care is comfortable.",
      sources: ["bodyDry"],
    },
    "rough-skin-gentle": {
      categories: [{ label: "Basic moisturizer if the skin feels dry", use: "Use according to its label; do not try to remove skin quickly." }],
      alternative: "Reduce rubbing with comfortable clothing and keep the skin intact; do not cut or scrub it.",
      sources: ["bodyDry"],
    },
  },
  Shoulders: {}, Arms: {}, Underarms: {}, Hands: {}, Chest: {}, Abdomen: {}, Back: {}, Hips: {}, Thighs: {}, Legs: {}, Knees: {}, Feet: {}, Toes: {}, Toenails: {}, Nails: {}, Fingernails: {},
};

for (const area of ["Nose", "Cheeks", "Ears"]) {
  RECOMMENDATIONS[area]["gentle-cleanse"] = RECOMMENDATIONS.Face["gentle-cleanse"];
  RECOMMENDATIONS[area]["sun-protection"] = RECOMMENDATIONS.Face["sun-protection"];
  RECOMMENDATIONS[area].moisturize = RECOMMENDATIONS.Face.moisturize;
  RECOMMENDATIONS[area]["patch-test"] = RECOMMENDATIONS.Face["patch-test"];
}

// Body steps are shared across several areas, so their mappings are repeated
// only where the existing guidance and source links support the same category.
const BODY_MOISTURE = {
  categories: [
    { label: "Gentle body wash", use: "Use comfortably warm water and keep washing gentle." },
    { label: "Fragrance-free cream moisturizer for dry skin", use: "Pat dry and apply while skin is slightly damp." },
  ],
  alternative: "Use brief, comfortably warm washing and pat dry; a new product is not required if your current care is comfortable.",
  sources: ["bodyDry"],
};
const BODY_TONE = {
  categories: [{ label: "Broad-spectrum sunscreen for exposed skin", use: "Use outdoors as directed on its label." }],
  alternative: "Use shade or clothing to cover exposed skin where practical; avoid irritating or lightening treatments.",
  sources: ["sunscreen"],
};
for (const area of ["Shoulders", "Arms", "Underarms", "Hands", "Chest", "Abdomen", "Back", "Hips", "Thighs", "Legs", "Knees", "Feet", "Toes", "Toenails", "Nails", "Fingernails"]) {
  if (area !== "Hands" && area !== "Nails" && area !== "Fingernails" && area !== "Feet" && area !== "Toes" && area !== "Toenails") {
    RECOMMENDATIONS[area]["body-gentle-moisture"] = BODY_MOISTURE;
  }
  RECOMMENDATIONS[area]["body-tone-protect"] = BODY_TONE;
}
for (const area of ["Arms", "Hands", "Legs", "Knees", "Feet", "Toes"]) {
  RECOMMENDATIONS[area]["rough-skin-gentle"] = {
    categories: [{ label: "Basic moisturizer for dry skin", use: "Apply as directed if the skin feels dry; do not try to remove thickened skin quickly." }],
    alternative: "Reduce pressure or friction with comfortable clothing or footwear and keep the skin intact.",
    sources: ["bodyDry"],
  };
}
for (const area of ["Nails", "Fingernails", "Toenails"]) {
  RECOMMENDATIONS[area]["nail-moisture"] = {
    categories: [{ label: "Basic moisturizer for nail edges and surrounding skin", use: "Apply after washing or bathing; a dedicated cuticle product is not required." }],
    alternative: "Avoid picking or cutting cuticles and protect hands from prolonged wet work where practical.",
    sources: ["handDry"],
  };
  RECOMMENDATIONS[area]["nail-gentle-care"] = {
    alternative: "Use clean clippers and file gently in one direction; routine nail care does not require cosmetic products.",
    sources: ["nails"],
  };
}
for (const area of ["Feet", "Toes", "Toenails"]) {
  RECOMMENDATIONS[area]["foot-clean-dry"] = {
    alternative: "Wash and dry carefully between toes, use clean socks, and let shoes dry between wears.",
    sources: ["feetOdor"],
  };
}
for (const area of ["Feet", "Toes", "Toenails"]) {
  RECOMMENDATIONS[area]["heel-moisture-pressure"] = {
    categories: [{ label: "Basic moisturizer for dry heel skin", use: "Apply to intact dry skin as directed; avoid sharp or medicated removal products without professional advice." }],
    alternative: "Reduce pressure with comfortable footwear and keep the skin intact; do not cut or aggressively file it.",
    sources: ["bodyDry"],
  };
}
RECOMMENDATIONS.Underarms["body-sweat-clean"] = {
  categories: [{ label: "Deodorant or antiperspirant, if tolerated", use: "Follow the product label and stop if it irritates the skin." }],
  alternative: "Wash gently, dry the area well, and change out of damp clothing.",
  sources: ["sweat"],
};
RECOMMENDATIONS.Underarms["body-shave-gentle"] = {
  categories: [{ label: "Shaving gel, if shaving is part of your routine", use: "Use a product you tolerate and follow the label; shaving is optional." }],
  alternative: "Pause shaving while the skin is sore and avoid pressing hard or shaving against the direction of hair growth.",
  sources: ["ingrownHairs"],
};
RECOMMENDATIONS.Legs["body-shave-gentle"] = RECOMMENDATIONS.Underarms["body-shave-gentle"];
for (const area of ["Shoulders", "Chest", "Back"]) {
  RECOMMENDATIONS[area]["body-acne-gentle"] = {
    categories: [{ label: "Gentle, fragrance-free body cleanser", use: "Wash gently after sweating; avoid abrasive scrubs and do not add a treatment product based on this guide alone." }],
    alternative: "Change out of damp clothing after sweating and avoid rubbing or picking the area.",
    sources: ["backAcne"],
  };
}
RECOMMENDATIONS.Hands["hand-wash-moisturize"] = {
  categories: [{ label: "Fragrance-free hand cream or ointment", use: "Apply after handwashing while skin is slightly damp." }],
  alternative: "Continue handwashing as needed, dry gently, and use gloves for prolonged wet household work where practical.",
  sources: ["handDry"],
};
RECOMMENDATIONS.Hands["hand-sun-care"] = {
  categories: [{ label: "Broad-spectrum SPF 30+ sunscreen for exposed hands", use: "Use outdoors and reapply as directed on the label." }],
  alternative: "Use sun-protective clothing or shade when practical.",
  sources: ["sunscreen"],
};
RECOMMENDATIONS.Fingernails["nail-moisture"] = RECOMMENDATIONS.Nails["nail-moisture"];
RECOMMENDATIONS.Fingernails["nail-gentle-care"] = RECOMMENDATIONS.Nails["nail-gentle-care"];
RECOMMENDATIONS.Toenails["toenail-trim"] = {
  alternative: "Use clean toenail clippers and trim straight across without cutting too short; no cosmetic product is needed.",
  sources: ["nails"],
};
RECOMMENDATIONS.Nails["nail-moisture"] = RECOMMENDATIONS.Fingernails["nail-moisture"];
RECOMMENDATIONS.Nails["nail-gentle-care"] = RECOMMENDATIONS.Fingernails["nail-gentle-care"];

export function getRoutineRecommendation(area, step) {
  const mapping = RECOMMENDATIONS[area]?.[step?.id];
  if (!mapping) {
    return {
      categories: [],
      alternative: "Follow the practical care step above; buying a product is not required.",
      sources: [],
    };
  }
  const availableSources = new Set(step?.sources || []);
  const categories = [...(mapping.categories || [])];
  for (const conditional of mapping.conditionalCategories || []) {
    if (availableSources.has(conditional.source)) {
      categories.push({ label: conditional.label, use: conditional.use });
    }
  }
  return {
    categories,
    alternative: mapping.alternative || "Follow the practical care step above; buying a product is not required.",
    sources: (mapping.sources || []).filter((source) => availableSources.has(source)),
  };
}
