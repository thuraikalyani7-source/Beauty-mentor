// Beauty Mentor Expert Conversational AI Engine
// Comprehensive knowledge base for skincare, haircare, body care, and cosmetic routines.

export function generateExpertBeautyAdvice(userMessage, context = {}) {
  const msg = (userMessage || "").toLowerCase();
  const { area, concerns = [], lifestyle = [], budget, sensitive, weather } = context || {};

  // Context cues
  const isSensitive = sensitive === true || concerns.includes("sensitive") || msg.includes("sensitive");
  const budgetTier = budget || (msg.includes("affordable") || msg.includes("cheap") || msg.includes("budget") ? "budget" : "flexible");

  // 1. SKIN BARRIER DAMAGE / REPAIR
  if (msg.includes("barrier") || msg.includes("damaged") || msg.includes("stinging") || msg.includes("burning") || msg.includes("redness") || msg.includes("irritated")) {
    return `### ✨ Restoring & Healing Your Skin Barrier

When your skin barrier is compromised, skin often feels tight, stings when applying basic moisturizer, or appears persistently red.

#### 🌿 Immediate Recovery Protocol (7–14 Days):
1. **Press Pause on All Actives:** Immediately stop using Retinol, AHAs (glycolic/lactic acid), BHAs (salicylic acid), Vitamin C, and physical scrubs.
2. **Ultra-Gentle Cleansing:** Use a non-foaming, hydrating cream cleanser (e.g., CeraVe Hydrating Cleanser or Cetaphil Gentle Cleanser) once daily at night. Splash with lukewarm water only in the morning.
3. **Barrier-Repairing Actives:**
   - **Ceramides:** The natural mortar between skin cells.
   - **Panthenol (Vitamin B5) & Centella Asiatica (Cica):** Deeply soothing and anti-inflammatory.
   - **Hyaluronic Acid / Glycerin:** Humectants that pull moisture into the epidermis.
4. **Rich Protective Seal:** Use an occlusive balm containing squalane or dimethicone (e.g., *La Roche-Posay Cicaplast Baume B5+* or *Avene Cicalfate+*) as the final step at night.
5. **Physical / Mineral Sunscreen:** Choose 100% Zinc Oxide mineral SPF in the morning to prevent UV irritation without chemical filters stinging.

> **💡 Pro Tip:** Do not reintroduce any exfoliating acids or retinoids until your skin feels comfortable with zero stinging for at least 7 consecutive days.`;
  }

  // 2. INGREDIENTS CONFLICTS / COMBINATIONS
  if (msg.includes("mix") || msg.includes("combine") || msg.includes("conflict") || msg.includes("together") || msg.includes("pair")) {
    return `### 🧴 Ingredient Compatibility: What to Mix & What to Avoid

Knowing which active ingredients work harmoniously together is the secret to glowing skin without irritation.

#### ❌ Dangerous Combinations (Do Not Use in Same Routine):
* **Retinol + AHA / BHA:** Both promote rapid cell turnover. Mixing them causes severe barrier peeling, inflammation, and sensitivity.  
  *➡️ Better:* Use AHA/BHA in the morning or alternate nights (Skin Cycling).
* **Retinol + Benzoyl Peroxide:** Benzoyl peroxide oxidizes and deactivates retinol while doubling dryness.  
  *➡️ Better:* Benzoyl peroxide in the AM, Retinol in the PM.
* **Vitamin C (L-Ascorbic Acid) + Retinol:** Both are potent actives with different optimal pH levels.  
  *➡️ Better:* Vitamin C every morning under sunscreen; Retinol at bedtime.
* **Multiple Strong Acids (AHA + BHA + Peel):** Over-exfoliation strips the stratum corneum.

#### ✅ Power Duos (Safe & Synergistic):
* **Niacinamide + Salicylic Acid:** Niacinamide soothes inflammation while BHA clears deep inside pores.
* **Hyaluronic Acid + Any Active:** Apply HA to damp skin first to buffer stronger treatments.
* **Ceramides + Retinol:** "Sandwich" your retinol between ceramide moisturizer layers to prevent flaking.
* **Vitamin C + SPF:** Vitamin C neutralizes free radicals that penetrate past sunscreen, boosting UV defense.`;
  }

  // 3. MORNING & EVENING ROUTINE (GENERAL OR SPECIFIC)
  if (msg.includes("routine") || msg.includes("step") || msg.includes("daily") || msg.includes("morning") || msg.includes("night") || msg.includes("regimen")) {
    let skinFocus = "Balanced Skin";
    if (msg.includes("oily") || msg.includes("acne")) skinFocus = "Oily & Blemish-Prone Skin";
    else if (msg.includes("dry") || msg.includes("flaky")) skinFocus = "Dry & Dehydrated Skin";
    else if (msg.includes("combination") || msg.includes("combo")) skinFocus = "Combination Skin";
    else if (msg.includes("aging") || msg.includes("wrinkle") || msg.includes("fine line")) skinFocus = "Firming & Anti-Aging";

    return `### ✨ Your Personalized ${skinFocus} Daily Routine

Here is a balanced, dermatologist-aligned routine designed for optimal efficacy and skin safety:

#### ☀️ Morning Routine (Protect & Hydrate):
1. **Gentle Cleanser:** Cleanse with lukewarm water or a mild foaming gel to remove overnight sweat and sebum.
2. **Hydrating Toner or Serum:** Apply a lightweight Hyaluronic Acid or Niacinamide (2–5%) serum on damp skin.
3. **Antioxidant (Optional):** Vitamin C serum to brighten skin and defend against environmental stressors.
4. **Lightweight Moisturizer:** A gel-cream formulation that seals in hydration without clogging pores.
5. **Broad-Spectrum Sunscreen (SPF 30–50+):** The single most essential anti-aging step. Use two finger-lengths for face and neck.

#### 🌙 Evening Routine (Repair & Renew):
1. **First Cleanse (Double Cleanse):** Cleansing oil or micellar water to break down sunscreen and makeup.
2. **Second Cleanse:** Water-based gentle cleanser to purify pores thoroughly.
3. **Targeted Active (Alternate Nights):**
   - *Night 1:* Exfoliant (2% Salicylic Acid for pores, or Glycolic/Lactic Acid for texture).
   - *Night 2:* Retinoid (Retinol 0.2–0.5% or retinal) for collagen support and cell renewal.
   - *Nights 3 & 4:* Rest & recovery nights (Barrier support serums only).
4. **Barrier Night Cream:** Rich in ceramides, squalane, or peptides to nourish your skin during overnight cell turnover.

> **💡 Rule of Thumb:** Always apply products from thinnest texture to thickest (Water $\\rightarrow$ Essence $\\rightarrow$ Serum $\\rightarrow$ Cream $\\rightarrow$ Oil/SPF).`;
  }

  // 4. RETINOL / RETINOIDS
  if (msg.includes("retinol") || msg.includes("retinoid") || msg.includes("tretinoin") || msg.includes("adapalene")) {
    return `### 🌙 The Complete Guide to Starting Retinol

Retinol is the gold-standard dermatological ingredient for boosting collagen, smoothing fine lines, clearing stubborn blemishes, and refining texture.

#### 📋 How to Start Without Irritation:
1. **Start Low & Slow:** Begin with a low concentration (0.1% to 0.3% retinol or encapsulated retinal).
2. **Frequency Schedule:**
   - *Weeks 1–2:* Once every 3 nights.
   - *Weeks 3–4:* Every other night.
   - *Week 5+:* Nightly, only if skin tolerates it with zero flaking.
3. **The "Sandwich Method" (For Sensitive Skin):**
   - Layer 1: Lightweight moisturizer.
   - Layer 2: Pea-sized amount of retinol across the face.
   - Layer 3: Another layer of nourishing moisturizer.
4. **Keep It Out of Sensitive Zones:** Avoid applying directly around eyes, corners of nose, and lips.

#### ⚠️ Essential Rules:
* Always use **night only** (sunlight degrades retinol molecules).
* Never skip **morning SPF 50**—retinol accelerates new, UV-vulnerable cell emergence.
* Expect a mild 2–4 week adjustment period ("purging"). If severe peeling occurs, reduce frequency.`;
  }

  // 5. ACNE, PORES, BLACKHEADS & BLEMISHES
  if (msg.includes("acne") || msg.includes("pimple") || msg.includes("breakout") || msg.includes("blackhead") || msg.includes("whitehead") || msg.includes("pore")) {
    return `### 🫧 Target-Clearing Guide: Acne, Pores & Breakouts

Breakouts occur when sebum, dead skin cells, and *C. acnes* bacteria get trapped within hair follicles. Here is how to target them effectively:

#### 🔬 Key Proven Ingredients:
1. **2% Salicylic Acid (BHA):** Oil-soluble acid that penetrates deep into sebum-filled pores to dissolve dead skin and debris.
2. **Niacinamide (4–5%):** Regulates sebum output and dramatically reduces post-blemish redness (PIE).
3. **Azelaic Acid (10%):** Antibacterial, anti-inflammatory, and reduces stubborn post-acne dark marks.
4. **Benzoyl Peroxide (2.5–5%):** Directly kills acne-causing bacteria. Use as a short-contact wash or targeted spot treatment.

#### 🛡️ Golden Habits:
* **Resist Picking:** Popping pimples forces bacteria deeper and causes long-term scarring and hyperpigmentation.
* **Hydrocolloid Pimple Patches:** Apply to surface blemishes overnight to draw out fluid and prevent touching.
* **Non-Comedogenic Hydration:** Dehydrated skin overproduces oil to compensate—always use an oil-free moisturizer.`;
  }

  // 6. DARK SPOTS & HYPERPIGMENTATION
  if (msg.includes("dark spot") || msg.includes("hyperpigmentation") || msg.includes("melasma") || msg.includes("marks") || msg.includes("brightening") || msg.includes("scars")) {
    return `### ☀️ Clearing Hyperpigmentation & Dark Spots

Hyperpigmentation is caused by excess melanin production triggered by UV exposure, hormonal shifts, or post-inflammatory marks from acne.

#### 🌟 Dermatologist-Recommended Brighteners:
1. **Vitamin C (Ascorbic Acid 10–15%):** Inhibits tyrosinase (the melanin-producing enzyme) and brightens overall complexion.
2. **Tranexamic Acid (3–5%):** Exceptional for stubborn melasma and sun spots by calming the melanocyte pathway.
3. **Alpha Arbutin (2%):** A gentle, safe derivative of hydroquinone that fades uneven spots without irritation.
4. **Azelaic Acid (10%):** Especially effective on dark brown and red marks left by recent breakouts.
5. **AHA Exfoliation (Lactic or Glycolic Acid):** Sweeps away pigmented surface cells to reveal fresher skin underneath.

#### 🛑 Non-Negotiable Step:
* **Broad Spectrum SPF 50:** Even 5 minutes of unprotected UV exposure stimulates melanocytes and reverses weeks of fading progress. Reapply every 2 hours when outdoors.`;
  }

  // 7. HAIR & SCALP CARE
  if (msg.includes("hair") || msg.includes("scalp") || msg.includes("dandruff") || msg.includes("frizz") || msg.includes("split end") || msg.includes("shedding")) {
    return `### 💇‍♀️ Hair & Scalp Wellness Guide

Healthy, radiant hair begins at the root. Treating your scalp with the same care as your facial skin yields long-term strength and shine.

#### 🌿 Scalp Health:
* **Dry Scalp vs. Dandruff:**
  - *Dry Scalp:* Small, dry white flakes caused by cold air or harsh shampoo. Treat with scalp hydrating serums (hyaluronic acid or squalane).
  - *Dandruff (Seborrheic Dermatitis):* Larger, yellowish, oily flakes caused by yeast overgrowth (*Malassezia*). Treat with active anti-fungal shampoos containing Zinc Pyrithione, Ketoconazole, or Salicylic Acid.
* **Clarifying Cleansing:** Use a clarifying shampoo once every 1–2 weeks to dissolve silicone and product buildup.

#### ✨ Lengths & Ends Protection:
1. **Bond Repair (e.g., Bis-aminopropyl or peptides):** Essential if hair has undergone heat styling, bleaching, or chemical coloring.
2. **Leave-in Conditioner:** Spritz onto damp hair before brushing to detangle without mechanical breakage.
3. **Silicone or Argan Hair Oil:** Smooth a drop through ends to lock in hydration and seal split cuticles.
4. **Heat Protectant (Up to 450°F / 230°C):** Mandatory before using hair dryers, curling wands, or flat irons.`;
  }

  // 8. DRY OR DEHYDRATED SKIN
  if (msg.includes("dry") || msg.includes("flaky") || msg.includes("tight") || msg.includes("winter") || msg.includes("hydration")) {
    return `### 💧 Deep Hydration Guide for Dry & Dehydrated Skin

Dry skin lacks oil/lipids, while dehydrated skin lacks water. Both benefit from layering humectants followed by rich emollients.

#### 🧴 The "Damp Skin" Technique:
1. **Never Towel Dry Fully:** Leave skin slightly damp after washing.
2. **Apply Humectants First:** Smooth on Glycerin, Hyaluronic Acid, or Snail Mucin while skin is wet so they pull moisture directly into the stratum corneum.
3. **Lock with Barrier Emollients:** Immediately follow with a nourishing cream rich in Ceramides, Shea Butter, or Jojoba Oil.
4. **Nighttime "Slugging" (Optional):** For extreme dry patches, apply a thin layer of pure Petrolatum (Vaseline or Aquaphor) over your night cream to seal 99% of transepidermal water loss.

> **⚠️ Avoid:** Foaming sulfate cleansers, long hot showers, and high-alcohol toners.`;
  }

  // 9. GENERAL / PERSONALIZED FALLBACK
  return `### ✨ Welcome! I am Your Beauty Mentor AI

I am here to guide your personalized beauty, skincare, and self-care routine with safe, science-backed guidance.

${area ? `> **Current Focus Area:** ${area}${concerns.length ? ` · **Concerns:** ${concerns.join(", ")}` : ""}\n\n` : ""}
#### 💡 How I Can Help You Today:
* **Custom Routines:** Tell me your skin type (oily, dry, combo, sensitive) and I will build an exact step-by-step AM/PM regimen.
* **Ingredient Deep Dives:** Ask about Retinol, Niacinamide, Vitamin C, Salicylic Acid, or Hyaluronic Acid.
* **Product Compatibility:** Wondering if two products can be layered together safely? Ask me!
* **Targeted Solutions:** Advice for acne, dark spots, fine lines, skin barrier recovery, or hair and scalp wellness.

**What specific question or routine would you like to explore together?**`;
}
