const sources = {
  acne: { label: "AAD: acne skin-care tips", url: "https://www.aad.org/public/diseases/acne/skin-care/tips" },
  acneCare: { label: "AAD: acne treatment", url: "https://www.aad.org/public/diseases/acne/derm-treat/treat" },
  scars: { label: "AAD: acne scar treatment", url: "https://www.aad.org/public/diseases/acne/derm-treat/scars/treatment/" },
  redness: { label: "AAD: caring for facial redness", url: "https://www.aad.org/public/everyday-care/skin-care-secrets/face/facial-redness" },
  rosacea: { label: "AAD: gentle skin care for rosacea", url: "https://www.aad.org/public/diseases/rosacea/triggers/tips" },
  dry: { label: "AAD: dry-skin care", url: "https://www.aad.org/public/everyday-care/skin-care-basics/dry/dermatologists-tips-relieve-dry-skin" },
  oily: { label: "AAD: oily-skin care", url: "https://www.aad.org/public/everyday-care/skin-care-basics/dry/oily-skin" },
  spots: { label: "AAD: dark spots and skin care", url: "https://www.aad.org/public/everyday-care/skin-care-secrets/routine/fade-dark-spots" },
  pores: { label: "AAD: caring for enlarged pores", url: "https://www.aad.org/public/everyday-care/skin-care-secrets/face/treat-large-pores" },
  exfoliate: { label: "AAD: safely exfoliating at home", url: "https://www.aad.org/public/everyday-care/skin-care-secrets/routine/safely-exfoliate-at-home" },
  patch: { label: "AAD: testing skin-care products", url: "https://www.aad.org/public/everyday-care/skin-care-secrets/prevent-skin-problems/test-skin-care-products/" },
  sunscreen: { label: "AAD: choosing sunscreen", url: "https://www.aad.org/public/everyday-care/sun-protection/shade-clothing-sunscreen/choosing-right-sunscreen" },
  routine: { label: "AAD: healthy-looking skin basics", url: "https://www.aad.org/public/everyday-care/skin-care-secrets/routine/healthier-looking-skin" },
  healthyHair: { label: "AAD: healthy hair care tips", url: "https://www.aad.org/public/everyday-care/hair-scalp-care/hair/healthy-hair-tips" },
  hairDamage: { label: "AAD: styling hair without damage", url: "https://www.aad.org/public/diseases/hair-loss/hair-care/styling" },
  hairHabits: { label: "AAD: hair-care habits that can cause damage", url: "https://www.aad.org/public/everyday-care/hair-scalp-care/hair/habits-that-damage-hair" },
  leaveIn: { label: "AAD: using leave-in conditioner", url: "https://www.aad.org/public/everyday-care/hair-scalp-care/hair/leave-in-conditioner-tips/" },
  shedding: { label: "AAD: hair loss and excessive shedding", url: "https://www.aad.org/public/diseases/hair-loss/insider/shedding/" },
  hairSigns: { label: "AAD: hair-loss signs and symptoms", url: "https://www.aad.org/public/diseases/hair-loss/insider/begin" },
  dandruff: { label: "AAD: dandruff care", url: "https://www.aad.org/public/everyday-care/hair-scalp-care/scalp/treat-dandruff" },
  itchyScalp: { label: "AAD: common causes of an itchy scalp", url: "https://www.aad.org/public/everyday-care/itchy-skin/itch-relief/relieve-scalp-itch" },
  dryScalp: { label: "AAD: dry scalp and similar conditions", url: "https://www.aad.org/public/everyday-care/hair-scalp-care/scalp/dry-scalp-conditions" },
  dryShampoo: { label: "AAD: using dry shampoo safely", url: "https://www.aad.org/public/everyday-care/hair-scalp-care/hair/dry-shampoo-best-results" },
  nhsDandruff: { label: "NHS: dandruff and when to seek help", url: "https://www.nhs.uk/conditions/dandruff/" },
  contactDermatitis: { label: "MedlinePlus: contact dermatitis", url: "https://medlineplus.gov/ency/article/000869.htm" },
  nhsLips: { label: "NHS: sore or dry lips", url: "https://www.nhs.uk/symptoms/sore-or-dry-lips/" },
  nhsEyelids: { label: "NHS: eyelid problems and warning signs", url: "https://www.nhs.uk/symptoms/eyelid-problems/" },
  darkCircles: { label: "DermNet: dark circles under the eyes", url: "https://dermnetnz.org/topics/dark-circles-under-the-eyes" },
  nhsDryEyes: { label: "NHS: dry-eye symptoms and urgent signs", url: "https://www.nhs.uk/symptoms/dry-eyes/" },
  eyelidDermatitis: { label: "DermNet: eyelid contact dermatitis", url: "https://dermnetnz.org/topics/eyelid-contact-dermatitis" },
  lipContact: { label: "DermNet: reactions to lip-care products", url: "https://dermnetnz.org/topics/contact-reactions-to-lipsticks-and-other-lipcare-products" },
  cheilitis: { label: "DermNet: causes and care for inflamed lips", url: "https://dermnetnz.org/topics/cheilitis" },
  lipPigmentation: { label: "DermNet: pigmented contact cheilitis", url: "https://dermnetnz.org/topics/pigmented-contact-cheilitis" },
  fineLines: { label: "AAD: wrinkle-care basics", url: "https://www.aad.org/public/everyday-care/skin-care-secrets/anti-aging/wrinkle-remedies" },
  sunscreenChoice: { label: "AAD: sunscreen around eyes and lips", url: "https://www.aad.org/public/everyday-care/sun-protection/shade-clothing-sunscreen/choosing-right-sunscreen" },
  bodyDry: { label: "AAD: dry-skin care", url: "https://www.aad.org/public/everyday-care/skin-care-basics/dry/dermatologists-tips-relieve-dry-skin" },
  backAcne: { label: "AAD: back acne care", url: "https://www.aad.org/public/diseases/acne/DIY/back-acne" },
  handCare: { label: "AAD: care for hands", url: "https://www.aad.org/public/everyday-care/skin-care-basics/care/skin-care-tips-hands" },
  handDry: { label: "AAD: dry skin from handwashing", url: "https://www.aad.org/public/everyday-care/skin-care-basics/dry/coronavirus-handwashing" },
  nails: { label: "AAD: how to trim and care for nails", url: "https://www.aad.org/public/everyday-care/nail-care-secrets/basics/how-to-trim-nails" },
  artificialNails: { label: "AAD: reduce artificial nail damage", url: "https://www.aad.org/public/everyday-care/nail-care-secrets/basics/pedicures/reduce-artificial-nail-damage" },
  feetOdor: { label: "NHS: smelly feet care", url: "https://www.nhs.uk/symptoms/smelly-feet/" },
  callus: { label: "MedlinePlus: corns and calluses", url: "https://medlineplus.gov/cornsandcalluses.html" },
  blisters: { label: "AAD: prevent and care for blisters", url: "https://www.aad.org/public/everyday-care/injured-skin/burns/prevent-treat-blisters" },
  diabeticFoot: { label: "MedlinePlus: diabetic foot care", url: "https://medlineplus.gov/diabeticfoot.html" },
  sweat: { label: "MedlinePlus: sweating and body odor", url: "https://medlineplus.gov/sweat.html" },
  ingrownHairs: { label: "AAD: shaving and razor-bump prevention", url: "https://www.aad.org/public/everyday-care/skin-care-basics/hair/how-to-shave" },
  stretchMarks: { label: "NHS: stretch marks", url: "https://www.nhs.uk/conditions/stretch-marks/" },
  keratosisPilaris: { label: "AAD: keratosis pilaris self-care", url: "https://www.aad.org/public/diseases/a-z/keratosis-pilaris-self-care" },
  eyeCosmetics: { label: "FDA: eye cosmetic safety", url: "https://www.fda.gov/cosmetics/cosmetic-products/eye-cosmetic-safety" },
  browLashHairLoss: { label: "AAD: eyebrow and eyelash hair-loss signs", url: "https://www.aad.org/public/diseases/hair-loss/types/alopecia/symptoms" },
};

const faceGuidance = {
  Acne: {
    explanation: "Breakouts can have several causes, and this guide cannot identify which applies to you.",
    everyday: [{ id: "gentle-cleanse", title: "Cleanse gently", text: "Wash gently with lukewarm water and a mild cleanser; avoid scrubbing. Cleanse after sweating and no more than twice daily unless a clinician advises otherwise.", sources: ["acne"] }, { id: "sun-protection", title: "Protect skin from daylight", text: "When outdoors, use shade and a broad-spectrum, water-resistant SPF 30+ sunscreen that you tolerate; follow its label.", sources: ["sunscreen", "acne"] }],
    precautions: ["Do not pick or squeeze spots; this can worsen irritation and raise the chance of marks or scarring."],
    nextSteps: ["If you want treatment options, a pharmacist or dermatologist can help choose an approach for your skin and health history."],
    budget: "A gentle routine using products you already tolerate is a reasonable start; you do not need a multi-step set.",
    seek: "Ask a dermatologist if acne is painful, leaving scars, persistent, or affecting your wellbeing.", sources: ["acne", "acneCare", "scars", "sunscreen"],
  },
  "Acne Scars": {
    explanation: "Marks after acne can look different from one another; a clinician can tell what kind of mark is present.",
    everyday: [{ id: "gentle-cleanse", title: "Cleanse gently", text: "Wash without scrubbing and avoid picking at active spots or marks.", sources: ["acne"] }, { id: "sun-protection", title: "Protect skin from daylight", text: "Use shade and tolerated broad-spectrum SPF 30+ sunscreen outdoors to help limit darkening of marks.", sources: ["sunscreen", "spots"] }],
    precautions: ["Avoid home procedures, harsh scrubs, or strong peels on marks; irritation can make discoloration worse."],
    nextSteps: ["Scar treatments vary by mark type and often need professional assessment."],
    budget: "Start with gentle care and sun protection you already own and tolerate; procedures or specialty products are not a required first step.",
    seek: "For persistent scars or marks that bother you, consult a dermatologist before trying procedures or strong treatments.", sources: ["scars", "acne", "spots", "sunscreen"],
  },
  "Dark Spots": {
    explanation: "Dark spots can follow irritation, acne, sun exposure, or other causes; this guide does not diagnose their cause.",
    everyday: [{ id: "sun-protection", title: "Protect skin from daylight", text: "Use shade and a broad-spectrum SPF 30+ sunscreen you tolerate when outdoors; follow the label and reapply as directed.", sources: ["spots", "sunscreen"] }, { id: "gentle-cleanse", title: "Keep care gentle", text: "Avoid irritating the area and use a gentle cleanser you already tolerate.", sources: ["spots"] }],
    precautions: ["Do not use household bleach or unlabelled/lightening products. Irritation may make spots darker."],
    nextSteps: ["If spots persist, a dermatologist can help identify the cause and discuss suitable options."],
    budget: "Shade, a hat, and a sunscreen you tolerate can be practical priorities; avoid buying several spot products at once.",
    seek: "Have a clinician assess a new or changing spot, or discoloration that persists or concerns you.", sources: ["spots", "sunscreen"],
  },
  Pigmentation: {
    explanation: "Pigmentation describes a change in skin color, not a diagnosis; causes and suitable care differ.",
    everyday: [{ id: "sun-protection", title: "Protect skin from daylight", text: "Use shade and a tolerated broad-spectrum SPF 30+ sunscreen outdoors, following the label.", sources: ["spots", "sunscreen"] }, { id: "gentle-cleanse", title: "Avoid irritation", text: "Keep cleansing gentle and pause products that sting or cause a rash.", sources: ["spots", "patch"] }],
    precautions: ["Avoid bleaching products or aggressive at-home treatments; irritation can worsen uneven color."],
    nextSteps: ["A dermatologist can assess the cause before you try targeted treatment."],
    budget: "Focus on gentle care and sun protection you tolerate; multiple corrective products are not necessary.",
    seek: "Ask a dermatologist about persistent, spreading, or changing pigmentation.", sources: ["spots", "sunscreen", "patch"],
  },
  Dullness: {
    explanation: "A dull appearance is nonspecific and can relate to dryness, irritation, or other factors.",
    everyday: [{ id: "gentle-cleanse", title: "Keep the routine gentle", text: "Use a mild cleanser and moisturizer that feel comfortable; avoid scrubbing for a quick fix.", sources: ["routine", "exfoliate"] }, { id: "sun-protection", title: "Protect exposed skin", text: "When outdoors, use shade and tolerated broad-spectrum SPF 30+ sunscreen as directed.", sources: ["sunscreen"] }],
    precautions: ["Frequent or harsh exfoliation can irritate skin; do not exfoliate skin that is red, broken, or sensitive."],
    nextSteps: ["If you choose to exfoliate, keep it gentle and infrequent; stop if it stings or becomes irritated."],
    budget: "A simple cleanser, moisturizer if needed, and sun protection are enough to begin; avoid buying a full routine for this concern.",
    seek: "Ask a clinician if the change is sudden, persistent, or comes with other symptoms.", sources: ["routine", "exfoliate", "sunscreen"],
  },
  "Large Pores": {
    explanation: "Pore size is normal and influenced by factors such as skin type; pores cannot be permanently erased.",
    everyday: [{ id: "gentle-cleanse", title: "Cleanse gently", text: "Wash gently and avoid squeezing or scrubbing pores.", sources: ["pores"] }, { id: "sun-protection", title: "Use sun protection", text: "Protect exposed skin with shade and tolerated broad-spectrum SPF 30+ sunscreen outdoors.", sources: ["pores", "sunscreen"] }],
    precautions: ["Harsh scrubs and pore strips can irritate skin and do not permanently shrink pores."],
    nextSteps: ["A dermatologist can explain realistic options if pore appearance remains a concern."],
    budget: "Gentle cleansing and sun protection are practical basics; expensive products cannot permanently remove pores.",
    seek: "Seek professional advice for persistent irritation or if you want to discuss treatment choices.", sources: ["pores", "sunscreen"],
  },
  Redness: {
    explanation: "Facial redness has many possible causes, including temporary irritation; it is not enough to identify a condition.",
    everyday: [{ id: "gentle-cleanse", title: "Choose gentle care", text: "Wash gently with lukewarm water and use fragrance-free products if these suit you.", sources: ["redness", "rosacea"] }, { id: "sun-protection", title: "Reduce sun exposure", text: "Use shade and tolerated broad-spectrum SPF 30+ sunscreen outdoors; sun can trigger or worsen some redness.", sources: ["redness", "sunscreen"] }],
    precautions: ["Avoid products that sting and abrasive scrubbing. Triggers vary, so do not assume a food or product is responsible without observing a pattern."],
    nextSteps: ["A brief note of products or conditions that coincide with redness may help a clinician assess it."],
    budget: "Gentle products you already tolerate and shade are reasonable first steps; avoid buying several redness treatments.",
    seek: "See a dermatologist if redness lasts more than two weeks, keeps returning, or is painful or worrying.", sources: ["redness", "rosacea", "sunscreen"],
  },
  "Uneven Texture": {
    explanation: "Uneven texture can have different causes and cannot be assessed from this selection alone.",
    everyday: [{ id: "gentle-cleanse", title: "Cleanse without scrubbing", text: "Use a gentle cleanser and avoid picking or rubbing textured areas.", sources: ["routine", "exfoliate"] }, { id: "sun-protection", title: "Protect exposed skin", text: "Use shade and tolerated broad-spectrum SPF 30+ sunscreen outdoors as directed.", sources: ["sunscreen"] }],
    precautions: ["Strong exfoliants and rough scrubs can worsen irritation, especially when skin is already sensitive."],
    nextSteps: ["If you try a new cosmetic product, introduce one at a time and stop if it causes irritation."],
    budget: "Keep to basics you tolerate; a large collection of products is not needed to start.",
    seek: "Ask a dermatologist if texture changes suddenly, persists, or comes with pain, itching, or sores.", sources: ["exfoliate", "patch", "routine", "sunscreen"],
  },
  "Oily Skin": {
    explanation: "Oil production varies naturally and may change with age, environment, and other factors.",
    everyday: [{ id: "gentle-cleanse", title: "Wash gently", text: "Cleanse gently up to twice daily and after sweating; avoid repeated washing or scrubbing.", sources: ["oily"] }, { id: "sun-protection", title: "Protect exposed skin", text: "Choose a sunscreen labeled broad-spectrum SPF 30+ that feels comfortable and follow its directions.", sources: ["oily", "sunscreen"] }],
    precautions: ["Trying to strip away all oil with harsh cleansers can irritate skin."],
    nextSteps: ["If choosing cosmetics, labels such as non-comedogenic may be helpful; no special product is required."],
    budget: "A gentle cleanser and sunscreen you tolerate are enough basics; avoid buying products that promise to remove all oil.",
    seek: "Consult a dermatologist if oiliness is accompanied by persistent acne or irritation.", sources: ["oily", "sunscreen"],
  },
  "Dry Skin": {
    explanation: "Dryness may be affected by weather, washing, and products; persistent or severe symptoms may need assessment.",
    everyday: [{ id: "gentle-cleanse", title: "Use lukewarm water", text: "Keep washing brief and gentle; avoid hot water and harsh scrubbing.", sources: ["dry"] }, { id: "moisturize", title: "Moisturize after washing", text: "Apply a moisturizer you tolerate while skin is slightly damp; fragrance-free options may suit easily irritated skin.", sources: ["dry"] }, { id: "sun-protection", title: "Protect exposed skin", text: "Use shade and tolerated broad-spectrum SPF 30+ sunscreen outdoors as directed.", sources: ["sunscreen"] }],
    precautions: ["Stop products that burn or worsen dryness; avoid vigorous exfoliation on dry or cracked skin."],
    nextSteps: ["A simple moisturizer may be enough; introduce any new product one at a time."],
    budget: "A basic moisturizer that you tolerate can be more useful than several specialty products.",
    seek: "Ask a clinician if dryness is severe, cracked, bleeding, very itchy, or does not improve with gentle care.", sources: ["dry", "patch", "sunscreen"],
  },
  Sensitivity: {
    explanation: "Sensitivity is a description of how skin reacts, not a diagnosis; reactions can have different causes.",
    everyday: [{ id: "gentle-cleanse", title: "Keep care simple and gentle", text: "Use lukewarm water and products that you already know feel comfortable; avoid scrubbing.", sources: ["patch", "routine"] }, { id: "patch-test", title: "Test new products cautiously", text: "Test a new leave-on product on a small area as directed by the AAD before wider use; stop if a reaction develops.", sources: ["patch"] }],
    precautions: ["Avoid adding several new products at once, which makes it harder to identify a trigger."],
    nextSteps: ["If a product causes a reaction, stop using it. Keep its label or ingredient list to discuss with a clinician if needed."],
    budget: "There is no need to replace products that already suit you; prioritize simplicity over a larger routine.",
    seek: "Seek medical advice for recurring reactions; urgent swelling or trouble breathing needs emergency care.", sources: ["patch", "routine"],
  },
};

// Hair and scalp entries use the same fields as face entries. Several labels
// are existing UI identifiers; the additional labels are added to the Hair
// concern list in App.jsx so the guide can be selected through the current flow.
const hairGuidance = {
  "Frizzy Hair": {
    explanation: "Frizz can be related to hair texture, dryness, humidity, handling, or damage; the guide cannot determine its cause.",
    everyday: [{ id: "hair-gentle-wash", title: "Wash the scalp gently", text: "Shampoo the scalp rather than rubbing shampoo through the lengths; let the rinse clean the lengths.", sources: ["healthyHair"] }, { id: "hair-condition", title: "Condition where hair needs it", text: "Use a rinse-out conditioner after washing, placing it on the lengths and ends according to your hair texture.", sources: ["healthyHair"] }, { id: "hair-gentle-detangle", title: "Detangle with care", text: "Work gently from the ends upward with a wide-tooth comb when appropriate for your hair texture.", sources: ["healthyHair", "hairDamage"] }],
    precautions: ["Rough towel rubbing, excessive heat, and repeated brushing can worsen frizz and damage."], nextSteps: ["If useful, a small amount of leave-in conditioner made for your hair type can be applied to the lengths, not the scalp; it is optional."], budget: "Start with a conditioner you already tolerate; a leave-in product is optional, not required.", seek: "Ask a dermatologist if frizz occurs alongside ongoing breakage, scalp symptoms, or sudden hair changes.", sources: ["healthyHair", "hairDamage", "leaveIn"],
  },
  "Dry Hair": {
    explanation: "Hair can feel dry because of its natural texture or from styling and environmental wear; this selection does not identify a cause.",
    everyday: [{ id: "hair-gentle-wash", title: "Wash the scalp, not the lengths", text: "Massage shampoo gently into the scalp and let it rinse through the hair to avoid unnecessarily drying the lengths.", sources: ["healthyHair"] }, { id: "hair-condition", title: "Condition the lengths", text: "Condition after washing; dry or curly hair may benefit from conditioner through more of its length, as tolerated.", sources: ["healthyHair"] }, { id: "hair-gentle-dry", title: "Reduce drying friction", text: "Blot or wrap hair in a soft towel or T-shirt rather than rubbing it briskly.", sources: ["healthyHair", "hairDamage"] }],
    precautions: ["Limit high heat and harsh chemical processing, which can damage hair further."], nextSteps: ["If needed, choose one conditioner intended for your hair type and follow its label."], budget: "A basic rinse-out conditioner that suits your hair can be enough; specialty masks and oils are not required.", seek: "Seek professional advice if dryness is persistent with scalp pain, sores, or significant breakage.", sources: ["healthyHair", "hairDamage"],
  },
  "Hair Breakage": {
    explanation: "Breakage means strands are snapping; it can look different from shedding from the roots, and this guide cannot tell which is happening.",
    everyday: [{ id: "hair-gentle-detangle", title: "Handle strands gently", text: "Minimize tugging and use a wide-tooth comb to detangle in a way that suits your hair texture.", sources: ["hairDamage", "healthyHair"] }, { id: "hair-heat-limit", title: "Reduce heat and tension", text: "Use less frequent heat styling and avoid repeatedly tight styles that pull on the hair.", sources: ["hairDamage"] }, { id: "hair-condition", title: "Condition after washing", text: "A rinse-out conditioner can reduce friction and make hair easier to manage.", sources: ["healthyHair", "shedding"] }],
    precautions: ["Do not brush forcefully, rub wet hair with a towel, or continue a style that causes pulling or pain."], nextSteps: ["Notice whether breakage changes with styling or handling, without assuming that this explains all hair loss."], budget: "Gentler handling and less heat cost nothing; begin there before buying strengthening products.", seek: "Arrange professional assessment if breakage is substantial, continues despite gentler care, or occurs with thinning, bald patches, scalp pain, or sores.", sources: ["hairDamage", "healthyHair", "shedding", "hairSigns"],
  },
  "Hair Fall": {
    explanation: "Some daily shedding is normal, but increased shedding and hair loss have different possible causes. This guide cannot diagnose the cause.",
    everyday: [{ id: "hair-gentle-wash", title: "Wash gently for your scalp and hair type", text: "Clean the scalp without scrubbing the lengths; use a conditioner to help reduce tangling and friction.", sources: ["healthyHair", "shedding"] }, { id: "hair-gentle-detangle", title: "Avoid pulling while styling", text: "Handle hair gently and choose comfortable styles that do not create persistent tension.", sources: ["hairDamage", "shedding"] }],
    precautions: ["Do not stop a prescribed medicine or start hair-loss medication or supplements based on this guide; discuss concerns with a health professional."], nextSteps: ["If you notice a change, note when it began and any recent changes in health or hair practices to share at an appointment."], budget: "Avoid spending on unverified supplements or products before the cause is assessed; gentle hair care is a reasonable no-cost first step.", seek: "Seek prompt professional assessment for sudden or substantial shedding, patchy loss, or loss with scalp pain, sores, redness, or intense itching.", sources: ["shedding", "hairSigns", "hairDamage"],
  },
  "Rough or Tangled Hair": {
    explanation: "Roughness and tangling can be influenced by texture, dryness, damage, and handling; they do not identify a medical condition by themselves.",
    everyday: [{ id: "hair-gentle-detangle", title: "Detangle gradually", text: "Start at the ends and work upward with a wide-tooth comb; use a method suited to your hair texture and avoid yanking knots.", sources: ["healthyHair"] }, { id: "hair-condition", title: "Use conditioner after washing", text: "Conditioner can help hair feel more manageable; apply it to the lengths and ends or more broadly if your hair is dry or curly.", sources: ["healthyHair"] }, { id: "hair-gentle-dry", title: "Dry without rubbing", text: "Gently blot or wrap hair instead of rubbing it with a towel.", sources: ["healthyHair", "hairDamage"] }],
    precautions: ["Forceful brushing, especially when hair is fragile or wet, can increase breakage; follow texture-specific detangling guidance."], nextSteps: ["If tangling remains difficult, a small amount of suitable conditioner or detangler on the lengths is optional."], budget: "Use a wide-tooth comb and a conditioner that already works for you; more products are not automatically needed.", seek: "Ask a dermatologist if roughness is persistent with breakage, thinning, or scalp symptoms.", sources: ["healthyHair", "hairDamage", "leaveIn"],
  },
  "Oily Hair": {
    explanation: "Hair may look oily because oil builds up at the scalp; how often washing feels useful varies with hair texture and scalp needs.",
    everyday: [{ id: "hair-gentle-wash", title: "Clean the scalp as needed", text: "Massage shampoo into the scalp and rinse well; people with straight hair and an oily scalp may need to wash more often than people with dry, curly, or textured hair.", sources: ["healthyHair"] }, { id: "hair-condition", title: "Keep conditioner on the lengths", text: "If you use conditioner, apply it mainly where the hair needs it so the scalp is not coated unnecessarily.", sources: ["healthyHair", "leaveIn"] }],
    precautions: ["Repeated harsh washing or scrubbing to remove every trace of oil can irritate the scalp and dry the lengths."], nextSteps: ["Adjust wash timing based on comfort and how quickly the scalp becomes oily; there is no single schedule for everyone."], budget: "A regular shampoo suited to your scalp is usually a more practical starting point than specialty oil-control products.", seek: "Ask a clinician if oiliness comes with persistent itching, redness, painful scaling, or hair loss.", sources: ["healthyHair", "dryShampoo"],
  },
  "Split Ends": {
    explanation: "Split ends are damaged hair-shaft ends; hair does not repair itself once a strand is split.",
    everyday: [{ id: "hair-heat-limit", title: "Reduce further damage", text: "Limit high heat, rough brushing, and repeated chemical processing that can contribute to brittle ends.", sources: ["hairDamage", "hairHabits"] }, { id: "hair-condition", title: "Condition after washing", text: "Conditioner can reduce friction and help limit further breakage and split ends.", sources: ["shedding", "healthyHair"] }, { id: "hair-gentle-dry", title: "Treat wet hair gently", text: "Blot hair dry and detangle carefully rather than rubbing or pulling.", sources: ["hairDamage", "healthyHair"] }],
    precautions: ["Products may temporarily smooth the look of ends, but do not permanently mend a split strand."], nextSteps: ["A trim can remove split ends if you want; it is a styling choice, not a medical requirement."], budget: "Reduce friction and heat without buying products; a trim is optional and depends on your preference.", seek: "Seek professional advice if split ends occur with substantial breakage or scalp changes.", sources: ["hairDamage", "hairHabits", "shedding"],
  },
  "Lack of Shine": {
    explanation: "Hair shine is affected by hair texture, surface condition, products, and lighting; low shine alone does not establish a health problem.",
    everyday: [{ id: "hair-gentle-wash", title: "Rinse shampoo and product out well", text: "Apply shampoo to the scalp and rinse thoroughly; buildup can make hair feel dull or coated.", sources: ["healthyHair", "dryShampoo"] }, { id: "hair-condition", title: "Condition hair after washing", text: "Conditioner can smooth the hair surface and improve manageability; use it where it suits your hair type.", sources: ["healthyHair", "leaveIn"] }, { id: "hair-heat-limit", title: "Limit excessive heat", text: "Use heat tools less often and on low or medium settings when you use them.", sources: ["healthyHair", "hairDamage"] }],
    precautions: ["Avoid harsh scrubs, repeated high heat, or unverified shine remedies that irritate the scalp or damage hair."], nextSteps: ["If you already use styling products, try rinsing thoroughly and simplifying layers before adding another product."], budget: "Rinsing well and reducing heat are free first steps; shine products are optional and do not treat a diagnosed cause.", seek: "Ask a clinician if loss of shine is accompanied by new hair loss, scalp irritation, or a persistent unexplained change.", sources: ["healthyHair", "dryShampoo", "hairDamage"],
  },
  Dandruff: {
    explanation: "Flaking and itch can occur with dandruff, but similar scalp symptoms can have other causes; this guide cannot distinguish them.",
    everyday: [{ id: "scalp-cleanse", title: "Wash the scalp and rinse well", text: "Regular washing may help mild flaking; shampoo the scalp rather than scrubbing the hair lengths.", sources: ["dandruff", "healthyHair"] }],
    precautions: ["Do not scratch, scrape, or use harsh home remedies. Some dandruff shampoos can dry hair or irritate skin; do not start a medicated shampoo without appropriate pharmacist or clinician guidance."], nextSteps: ["A pharmacist or clinician can help decide whether a dandruff shampoo is appropriate and explain how to use it safely for your hair texture."], budget: "Try gentle scalp cleansing first; ask a pharmacist before spending on medicated products, and follow any product label if advised.", seek: "Get professional advice if flaking is severe, very itchy, painful, red or swollen, causes sores or patchy loss, or does not improve after appropriate advice.", sources: ["dandruff", "nhsDandruff", "dryScalp", "healthyHair"],
  },
  "Oily Scalp": {
    explanation: "An oily scalp is common, and washing needs differ by hair texture, activity, and how quickly oil accumulates.",
    everyday: [{ id: "scalp-cleanse", title: "Wash the scalp at a comfortable frequency", text: "Massage shampoo into the scalp and rinse well. Straight hair with an oily scalp may need more frequent washing; dry or textured hair may need a different schedule.", sources: ["healthyHair"] }, { id: "hair-condition", title: "Condition the hair, not the scalp", text: "Apply conditioner mainly to lengths and ends when needed, especially if they feel dry.", sources: ["healthyHair", "leaveIn"] }],
    precautions: ["Do not use harsh cleansers or scrub the scalp to try to remove all natural oil."], nextSteps: ["If using dry shampoo, treat it as a temporary styling aid, not a replacement for washing with water and shampoo."], budget: "A simple shampoo matched to your scalp is a practical essential; dry shampoo and specialty treatments are optional.", seek: "Consult a clinician if oiliness comes with persistent scaling, itching, redness, pain, or hair loss.", sources: ["healthyHair", "dryShampoo"],
  },
  "Dry Scalp": {
    explanation: "Dry scalp and dandruff may both involve flakes and itch and can be hard to distinguish without an assessment.",
    everyday: [{ id: "scalp-gentle", title: "Choose gentle scalp care", text: "Consider a gentle, non-medicated shampoo and rinse it out thoroughly; harsh washing or some products can dry or irritate the scalp.", sources: ["dryScalp", "itchyScalp"] }],
    precautions: ["Avoid scratching, scraping flakes, or applying irritating home remedies or oils to the scalp."], nextSteps: ["Notice whether symptoms began after a product change and stop a product that causes burning or a rash."], budget: "A gentle shampoo you already tolerate may be enough to try; avoid buying several scalp treatments at once.", seek: "Ask a dermatologist if flaking or dryness persists, is severe, or occurs with redness, pain, sores, or hair loss.", sources: ["dryScalp", "itchyScalp", "nhsDandruff"],
  },
  "Itchy Scalp": {
    explanation: "An itchy scalp has many possible causes, including product irritation and flaking conditions; itch alone cannot identify the cause.",
    everyday: [{ id: "scalp-gentle", title: "Rinse and handle gently", text: "Rinse shampoo and styling products out thoroughly and avoid scratching or scrubbing the scalp.", sources: ["itchyScalp"] }, { id: "scalp-product-review", title: "Notice recent product changes", text: "If irritation started after a new product, stop that product and keep its ingredient list for a health professional if symptoms continue.", sources: ["itchyScalp", "contactDermatitis"] }],
    precautions: ["Do not apply medication, essential oils, vinegar, or other harsh home remedies to an itchy scalp without professional guidance."], nextSteps: ["If symptoms are mild and clearly follow a new cosmetic product, pause it; do not repeatedly re-test a product that caused a reaction."], budget: "Stopping a suspected irritant and rinsing thoroughly are sensible first steps; avoid buying multiple treatments to guess at the cause.", seek: "See a clinician for persistent or severe itch, rash, pain, swelling, sores, discharge, or associated hair loss.", sources: ["itchyScalp", "contactDermatitis", "nhsDandruff"],
  },
  "Scalp Sensitivity": {
    explanation: "Scalp sensitivity describes discomfort or reactions and does not identify a specific condition or ingredient.",
    everyday: [{ id: "scalp-gentle", title: "Keep scalp care familiar and gentle", text: "Use products you already tolerate, rinse thoroughly, and avoid vigorous scratching or scrubbing.", sources: ["itchyScalp", "contactDermatitis"] }, { id: "scalp-product-review", title: "Introduce changes cautiously", text: "Avoid changing several hair products at once. Stop a new product if burning, itching, or a rash develops.", sources: ["itchyScalp", "contactDermatitis"] }],
    precautions: ["Do not continue using a product that caused a rash or burning. Do not attempt a home test on the scalp after a significant reaction."], nextSteps: ["Keep the product label or ingredient list and discuss recurring reactions with a clinician; they can advise whether formal patch testing is appropriate."], budget: "Continue with familiar products that suit you; a bigger or more expensive routine is not needed.", seek: "Seek professional advice for recurring reactions, rash, swelling, sores, or symptoms that persist after stopping the suspected product.", sources: ["itchyScalp", "contactDermatitis"],
  },
  "Product Buildup": {
    explanation: "Residue from styling products or dry shampoo can make hair feel coated; buildup is not the only possible cause of flakes or itch.",
    everyday: [{ id: "scalp-cleanse", title: "Cleanse with shampoo and water", text: "Apply shampoo to the scalp and rinse well; dry shampoo absorbs oil but does not clean the scalp or replace regular washing.", sources: ["healthyHair", "dryShampoo"] }],
    precautions: ["Avoid homemade powders or piling on dry shampoo; excess residue can leave hair stiff and may irritate the scalp."], nextSteps: ["Try using fewer styling layers and wash dry shampoo out with regular shampoo and water; follow product directions."], budget: "Using fewer styling products and rinsing thoroughly are low-cost steps; a special clarifying product is not automatically needed.", seek: "Ask a clinician if itching, burning, tenderness, or irritation persists after you stop the suspected product and wash gently.", sources: ["healthyHair", "dryShampoo", "itchyScalp"],
  },
  "Persistent Scalp Redness or Irritation": {
    explanation: "Persistent redness or irritation can have different causes, including reactions or scalp conditions; it cannot be diagnosed from a selection.",
    everyday: [{ id: "scalp-gentle", title: "Avoid further irritation", text: "Use familiar, gentle products, rinse well, and pause a product that seems to worsen the reaction.", sources: ["itchyScalp", "contactDermatitis"] }],
    precautions: ["Do not scratch, apply strong home remedies, or start medicated products without professional guidance."], nextSteps: ["Note when the irritation began and which products contact the scalp; this may help a clinician assess it."], budget: "Avoid trial-and-error purchases; professional assessment can help prevent spending on unsuitable products.", seek: "Arrange medical assessment for persistent redness or irritation, and sooner for severe pain, swelling, sores, discharge, or hair loss.", sources: ["itchyScalp", "contactDermatitis", "nhsDandruff", "hairSigns"],
  },
};

const eyeGuidance = {
  "Dark Circles": {
    explanation: "Dark circles are an appearance with several possible contributors, including pigmentation, visible vessels, facial structure, thin skin, or shadowing. This selection cannot identify the cause.",
    everyday: [{ id: "eye-gentle-skin", title: "Treat the surrounding skin gently", text: "Avoid rubbing or scratching the under-eye skin. If you use a cosmetic product there, keep it away from the eye itself and follow its label.", sources: ["darkCircles", "eyelidDermatitis"] }, { id: "eye-sun-shade", title: "Protect the area from sun", text: "Sunglasses and shade can protect the delicate skin around the eyes outdoors. If using sunscreen near the eyes, follow its label and keep it out of the eye.", sources: ["darkCircles", "sunscreenChoice"] }],
    precautions: ["Do not use bleaching agents, lemon juice, harsh scrubs, or strong products close to the eyes. Stronger treatments can irritate eyelid skin."], nextSteps: ["If the appearance is new, changing, or bothersome, a dermatologist can help assess possible causes. Cosmetic camouflage is optional."], budget: "Sunglasses, shade, and avoiding eye rubbing are practical low-cost steps. Many marketed remedies lack good evidence, and no product is required.", seek: "Ask a clinician about persistent or changing discoloration, especially if it comes with eyelid irritation or other symptoms.", sources: ["darkCircles", "eyelidDermatitis", "sunscreenChoice"],
  },
  Puffiness: {
    explanation: "Puffy eyelids can have different contributors, including temporary swelling, irritation, or other health factors; this guide cannot determine the cause.",
    everyday: [{ id: "eye-cool-compress", title: "For temporary puffiness, try a cool compress", text: "A clean, cool compress over closed eyelids may temporarily reduce the appearance of mild swelling. Do not press on the eyeball.", sources: ["darkCircles"] }, { id: "eye-gentle-skin", title: "Avoid rubbing the eyelids", text: "Handle the surrounding skin gently and avoid scratching or rubbing, which can irritate it.", sources: ["darkCircles", "eyelidDermatitis"] }],
    precautions: ["Do not put skincare, essential oils, or home remedies into the eye. Sudden or marked swelling is not an ordinary beauty concern."], nextSteps: ["If puffiness is temporary, notice whether it settles. Do not assume sleep or a cosmetic product will address persistent swelling."], budget: "A clean cool cloth is a no-cost option for mild temporary puffiness; avoid buying products that promise a guaranteed fix.", seek: "Get medical advice for persistent, sudden, painful, red, hot, or one-sided swelling. Eye pain, significant redness, light sensitivity, or vision change needs prompt assessment; sudden or severe symptoms need urgent help.", sources: ["darkCircles", "nhsEyelids", "nhsDryEyes"],
  },
  Dryness: {
    explanation: "This option refers to dry skin around the eyes, not dryness of the eyeball. If the eye itself feels gritty, sore, red, blurry, or light-sensitive, use the eye-symptom guidance below and seek appropriate care.",
    everyday: [{ id: "eye-gentle-skin", title: "Keep care gentle around the eyes", text: "Avoid rubbing and use only products labelled as suitable for the eye area; keep them out of the eye and stop if they sting or cause a rash.", sources: ["eyelidDermatitis", "nhsEyelids"] }],
    precautions: ["Do not apply ordinary face acids, essential oils, or home remedies near or into the eyes. Avoid using a product on irritated eyelid skin unless a clinician advises it."], nextSteps: ["If you choose to try a new eye-area cosmetic, introduce one at a time and follow its label. If it irritates you, stop using it."], budget: "You may not need a separate eye cream; prioritize avoiding irritants and use only a product you already tolerate that is labelled for this area.", seek: "Ask a clinician or pharmacist if eyelid dryness persists, keeps returning, or comes with swelling, pain, discharge, or a rash. Eye pain, significant redness, light sensitivity, or vision change needs prompt medical assessment.", sources: ["eyelidDermatitis", "nhsEyelids", "nhsDryEyes"],
  },
  "Fine Lines": {
    explanation: "Fine lines and other texture around the eyes are common skin features and vary with age, expression, and individual skin characteristics; this guide cannot assess or remove them.",
    everyday: [{ id: "eye-sun-shade", title: "Protect delicate skin outdoors", text: "Sunglasses and shade help protect the skin around the eyes. Use only sunscreen labelled for the area and avoid getting it in the eye.", sources: ["fineLines", "sunscreenChoice"] }, { id: "eye-gentle-skin", title: "Avoid pulling at the skin", text: "Remove eye makeup gently and avoid rubbing or scrubbing the eyelids.", sources: ["eyelidDermatitis"] }],
    precautions: ["Avoid strong anti-aging products close to the eyes unless a clinician specifically advises them; irritation can be more likely on thin eyelid skin."], nextSteps: ["A moisturizer may temporarily soften the look of fine lines, but it will not erase them. Any optional product should be labelled for the eye area and used as directed."], budget: "Sunglasses, shade, and gentle makeup removal are useful basics; premium eye creams are not automatically more effective.", seek: "Ask a dermatologist if you want to discuss cosmetic options or if the skin change is sudden or accompanied by irritation.", sources: ["fineLines", "eyelidDermatitis", "sunscreenChoice"],
  },
  "Tired-Looking Eyes": {
    explanation: "‘Tired-looking’ describes appearance, not a diagnosis; shadows, puffiness, lighting, and individual facial features can all affect it.",
    everyday: [{ id: "eye-gentle-skin", title: "Keep the area comfortable", text: "Avoid rubbing the eyes and keep any cosmetics on the surrounding skin, away from the eye itself.", sources: ["darkCircles", "eyelidDermatitis"] }, { id: "eye-sun-shade", title: "Use sunglasses and shade outdoors", text: "These can protect the delicate surrounding skin; they are not a treatment for eye symptoms.", sources: ["darkCircles", "sunscreenChoice"] }],
    precautions: ["Do not treat persistent fatigue, eye discomfort, or a change in vision as a cosmetic issue."], nextSteps: ["If tiredness is part of the appearance, ordinary rest may help how you feel, but it cannot guarantee a change in under-eye appearance."], budget: "A simple routine and sun protection are enough; no eye product is required for this appearance concern.", seek: "Seek medical advice for ongoing fatigue that concerns you, persistent eyelid changes, or any eye pain, marked redness, light sensitivity, or vision changes. Sudden or severe eye symptoms need urgent attention.", sources: ["darkCircles", "nhsEyelids", "nhsDryEyes"],
  },
  "Sensitive or Irritated Eyelid Skin": {
    explanation: "Eyelid skin is thin and can react to products or rubbing. A selection cannot identify whether irritation is allergic, irritant, or due to another cause.",
    everyday: [{ id: "eye-gentle-skin", title: "Pause suspected irritants", text: "Stop a new cosmetic that causes burning, itching, or a rash; avoid rubbing and keep products out of the eye.", sources: ["eyelidDermatitis", "nhsEyelids"] }],
    precautions: ["Do not put ordinary skincare, essential oils, or home remedies into the eye. Avoid applying strong actives or makeup to actively irritated eyelid skin."], nextSteps: ["Keep the product packaging or ingredient list. A clinician can advise whether further assessment or patch testing is appropriate; do not repeatedly retry a product that caused a reaction."], budget: "Returning to familiar products and pausing suspected irritants costs nothing; avoid trial-and-error purchases around the eyes.", seek: "Arrange professional assessment if eyelid irritation persists or recurs. A swollen, red, hot, painful eyelid, light sensitivity, or vision change needs prompt advice; sudden or severe eye symptoms are urgent.", sources: ["eyelidDermatitis", "nhsEyelids", "nhsDryEyes"],
  },
};

const lipGuidance = {
  "Dark Lips": {
    explanation: "Natural lip color varies. A change in pigmentation may have different causes, including irritation or sun exposure; this selection cannot identify the cause.",
    everyday: [{ id: "lip-gentle-care", title: "Protect and care for lips gently", text: "Use a plain lip balm you tolerate; when outdoors, NHS advises a lip balm with SPF 15 or higher and reapplication every two hours.", sources: ["nhsLips"] }, { id: "lip-avoid-irritants", title: "Notice products that irritate", text: "If a lip product causes burning or a rash, stop using it and avoid repeated exposure.", sources: ["lipContact", "lipPigmentation"] }],
    precautions: ["Do not scrub, bleach, or use lemon juice or other unverified lightening remedies. Pigmentation is not always caused by the same thing and may not completely fade."], nextSteps: ["A clinician can assess a new or changing color before any targeted treatment is considered."], budget: "A basic balm and sun protection are practical; avoid spending on unverified lightening products.", seek: "Have a clinician assess persistent, new, or changing lip discoloration, especially if it is sore, swollen, cracked, or ulcerated.", sources: ["nhsLips", "lipPigmentation", "lipContact"],
  },
  "Dry Lips": {
    explanation: "Dry lips are common and can be affected by weather, wind, sun, or irritation; this guide cannot determine the cause.",
    everyday: [{ id: "lip-gentle-care", title: "Use a simple lip balm", text: "Apply a lip balm you tolerate; petroleum jelly or beeswax are options listed by the NHS. Use SPF 15+ lip balm outdoors and reapply as directed.", sources: ["nhsLips"] }],
    precautions: ["Avoid licking or biting your lips, and do not pick at flakes. These habits can worsen soreness or delay healing."], nextSteps: ["If one balm stings, stop it and consider asking a pharmacist about a simple alternative."], budget: "An inexpensive plain balm or petroleum jelly may be sufficient; a premium balm is not automatically better.", seek: "Ask a pharmacist or GP if soreness persists; hot, painful, or swollen lips need medical advice.", sources: ["nhsLips", "lipContact"],
  },
  Pigmentation: {
    explanation: "Uneven lip tone or pigmentation can have varied causes, including natural variation and product-related irritation; it is not a diagnosis.",
    everyday: [{ id: "lip-gentle-care", title: "Protect lips from sun and dryness", text: "Use a balm you tolerate; NHS recommends SPF 15 or higher outdoors, reapplied every two hours.", sources: ["nhsLips"] }, { id: "lip-avoid-irritants", title: "Keep the routine non-irritating", text: "Stop lip products that burn, itch, or cause a rash; product reactions can sometimes be associated with color changes.", sources: ["lipContact", "lipPigmentation"] }],
    precautions: ["Do not use bleaching agents, lemon juice, harsh exfoliation, or unverified pigmentation remedies. Improvement cannot be guaranteed or assumed to be complete."], nextSteps: ["A dermatologist can assess persistent or changing pigmentation and discuss whether a cause needs attention."], budget: "A simple tolerated balm and sun protection are sensible basics; skip costly correction products until the cause is understood.", seek: "Consult a clinician for new, persistent, or changing pigmentation, particularly if it comes with pain, swelling, sores, or scaling.", sources: ["lipPigmentation", "lipContact", "nhsLips"],
  },
  "Chapped Lips": {
    explanation: "Chapping means lips feel dry or sore; common contributors include weather, wind, sun, and irritation, but the cause can vary.",
    everyday: [{ id: "lip-gentle-care", title: "Apply a balm and protect outdoors", text: "Use a balm you tolerate and follow its directions; the NHS suggests SPF 15+ lip balm outdoors, reapplied every two hours.", sources: ["nhsLips"] }],
    precautions: ["Avoid lip licking, biting, and picking flakes. Avoid a balm that stings or worsens irritation."], nextSteps: ["If you are unsure which product suits you, ask a pharmacist rather than trying multiple products at once."], budget: "A simple balm is a practical first step; expensive products are not required.", seek: "Ask a pharmacist or GP if chapping does not settle or keeps returning. Hot, painful, or swollen lips need medical advice.", sources: ["nhsLips", "lipContact"],
  },
  Flaking: {
    explanation: "Flaking can happen with dry or irritated lips, but persistent scaling can have other causes and cannot be diagnosed here.",
    everyday: [{ id: "lip-gentle-care", title: "Keep flakes protected", text: "Apply a balm you tolerate and let flakes settle; do not scrub or peel them off.", sources: ["nhsLips", "lipContact"] }],
    precautions: ["Picking, biting, or licking flaky skin can slow healing. Avoid abrasive scrubs and irritating home remedies."], nextSteps: ["If flaking began after a new balm, lipstick, or toothpaste, stop the suspected product and note the timing."], budget: "Use one familiar, low-cost balm rather than layering multiple products.", seek: "Seek professional advice if flaking persists, spreads, or comes with pain, swelling, bleeding, or sores.", sources: ["nhsLips", "lipContact", "cheilitis"],
  },
  "Cracked Lips": {
    explanation: "Cracks can occur when lips are very dry or irritated; deeper, recurrent, or non-healing cracks may need assessment.",
    everyday: [{ id: "lip-gentle-care", title: "Protect cracked lips gently", text: "Use a balm you tolerate and avoid pulling at the skin; protect lips from wind and sun.", sources: ["nhsLips"] }],
    precautions: ["Do not pick, lick, bite, or scrub cracks. Avoid applying products that sting, and do not use household remedies or essential oils."], nextSteps: ["If cracks are at the mouth corners or keep returning, ask a pharmacist or clinician rather than assuming simple dryness."], budget: "A basic balm and avoiding further irritation are low-cost steps; avoid buying strong treatments without advice.", seek: "Get professional advice for persistent, deep, bleeding, painful, swollen, infected-looking, or non-healing cracks.", sources: ["nhsLips", "cheilitis", "lipContact"],
  },
  "Lip Sensitivity or Irritation": {
    explanation: "Lip irritation may follow contact with a cosmetic, balm, toothpaste, or another trigger; this guide cannot identify an allergy or cause.",
    everyday: [{ id: "lip-avoid-irritants", title: "Pause products that trigger discomfort", text: "Stop a product that causes burning, itching, swelling, or a rash; keep the ingredient list to discuss if symptoms recur.", sources: ["lipContact", "nhsLips"] }, { id: "lip-gentle-care", title: "Use familiar care only", text: "If tolerated, use a simple balm and avoid adding several new lip products while irritated.", sources: ["nhsLips", "lipContact"] }],
    precautions: ["Do not repeatedly retry a product that caused a reaction. Avoid fragranced/flavoured products if they seem to trigger symptoms, and do not apply essential oils or home remedies."], nextSteps: ["A pharmacist or clinician can help review recurring reactions; formal testing should be guided by a professional."], budget: "Pause suspected triggers and keep to familiar products; no premium or multi-product routine is needed.", seek: "Seek advice for persistent or recurrent irritation. Painful swelling, blisters, sores, or trouble breathing after a reaction needs urgent medical help.", sources: ["lipContact", "nhsLips", "cheilitis"],
  },
  "Lip Texture Concerns": {
    explanation: "Lip texture naturally varies. New or persistent roughness can reflect dryness or irritation but may have other causes.",
    everyday: [{ id: "lip-gentle-care", title: "Protect the lip surface", text: "Use a balm you tolerate and protect lips outdoors; avoid rubbing or picking at the surface.", sources: ["nhsLips"] }, { id: "lip-avoid-irritants", title: "Simplify if a product irritates", text: "Pause a lipstick, balm, or toothpaste that seems to cause burning, flaking, or a rash.", sources: ["lipContact"] }],
    precautions: ["Avoid harsh exfoliation, lemon juice, bleaching agents, and unverified texture treatments on the lips."], nextSteps: ["If roughness continues despite avoiding irritation, a clinician can assess the area; no cosmetic product can guarantee a texture change."], budget: "A simple balm and fewer irritating products are practical starting points; premium texture products are optional and not proven necessary.", seek: "Ask a clinician about persistent texture changes, sores, ulcers, bleeding, pain, or color changes.", sources: ["nhsLips", "lipContact", "cheilitis"],
  },
};

// Stage 4 uses the same record shape as earlier guidance. Everyday steps have
// stable IDs so the guide can deduplicate shared basics across selected concerns.
const bodyEntry = ({ explanation, care, precautions, nextSteps, budget, seek, sources: sourceKeys }) => ({
  explanation,
  everyday: [{ id: care.id, title: care.title, text: care.text, sources: care.sources }],
  precautions,
  nextSteps,
  budget,
  seek,
  sources: sourceKeys,
});

const eyebrowSparse = bodyEntry({
  explanation: "Brow density varies naturally. Thinning can have different causes, so this selection cannot determine why it is happening.",
  care: { id: "brow-gentle-cosmetic", title: "Use gentle, eye-area-safe grooming", text: "If you use brow makeup, choose a product intended for use around the eyes and remove it gently according to its label. A brow pencil is an optional cosmetic way to define shape temporarily.", sources: ["eyeCosmetics"] },
  precautions: ["Do not use scalp hair dye or unverified growth products on eyebrows. Avoid repeated plucking or pulling, which can irritate skin and damage hairs."],
  nextSteps: ["If brow thinning is new, patchy, or progressing, note when it began and whether skin changes are also present."],
  budget: "No growth product is needed; an optional basic brow pencil may be used if tolerated.",
  seek: "Ask a dermatologist or clinician about sudden, patchy, or continuing brow loss, especially if lashes, scalp hair, or skin are also changing.",
  sources: ["browLashHairLoss", "eyeCosmetics"],
});
const eyebrowShape = bodyEntry({
  explanation: "Brows naturally differ in density and shape; an uneven appearance is not itself a diagnosis or a problem that needs treatment.",
  care: { id: "brow-gentle-cosmetic", title: "Keep shaping gentle", text: "If you choose to groom, make small changes with clean tools and avoid applying cosmetics that are not intended for the eye area.", sources: ["eyeCosmetics"] },
  precautions: ["Avoid aggressive plucking, harsh chemicals, and scalp hair dyes on the brow area. Stop a product that causes burning or a rash."],
  nextSteps: ["A qualified professional can discuss cosmetic shaping if desired; it is optional."],
  budget: "No special product or treatment is needed for natural brow asymmetry.",
  seek: "Seek advice if a change in brow shape is sudden or comes with hair loss, pain, rash, swelling, or skin changes.",
  sources: ["eyeCosmetics", "browLashHairLoss"],
});
const eyebrowIrritation = bodyEntry({
  explanation: "Irritation around the brows can follow cosmetics, grooming, or other triggers; this guide cannot identify the cause.",
  care: { id: "brow-stop-irritant", title: "Pause products that irritate the brow area", text: "Stop a cosmetic or grooming product that burns, itches, or causes a rash. Keep the area clean gently and avoid adding new products while it is inflamed.", sources: ["eyeCosmetics", "nhsEyelids"] },
  precautions: ["Do not apply products inside the eye or use unapproved dyes around the brows. Avoid makeup on inflamed skin."],
  nextSteps: ["Keep the product label and note when symptoms started if you need to discuss a recurring reaction with a professional."],
  budget: "Pausing a suspected trigger and simplifying care costs nothing; avoid buying several soothing products.",
  seek: "Ask a clinician if irritation persists or recurs. Eye pain, significant redness, light sensitivity, or vision changes need prompt assessment.",
  sources: ["eyeCosmetics", "nhsEyelids"],
});
const lashSparse = bodyEntry({
  explanation: "Lash length and density vary naturally. New or substantial lash loss can have several causes and should not be self-diagnosed.",
  care: { id: "lash-gentle-care", title: "Avoid pulling or stressing lashes", text: "Handle lashes gently and avoid rubbing or tugging. If using eye cosmetics, keep tools clean and do not share products.", sources: ["eyeCosmetics", "lashExtensions"] },
  precautions: ["Do not start prescription medicines or unverified lash-growth products based on this guide. Extensions, adhesives, and removal can irritate or damage natural lashes."],
  nextSteps: ["Temporary cosmetics are optional; choose products intended for the eye area and stop if they cause irritation."],
  budget: "No growth serum or extension service is required; gentle handling is free.",
  seek: "Ask a clinician about sudden, patchy, or persistent lash loss, especially with eyelid irritation or changes to eyebrow/scalp hair.",
  sources: ["browLashHairLoss", "eyeCosmetics"],
});
const lashCare = bodyEntry({
  explanation: "Lashes and eyelids are delicate, and eye cosmetics can become contaminated or cause irritation if misused.",
  care: { id: "lash-cosmetic-hygiene", title: "Keep eye cosmetics clean", text: "Wash hands before applying eye makeup, use clean tools, do not share cosmetics, and replace mascara according to its label. Use only products intended for the eye area.", sources: ["eyeCosmetics"] },
  precautions: ["Do not apply hair dye or permanent lash tint. Avoid eye cosmetics when the eyelid skin is inflamed or you have an eye infection; do not add water or saliva to dried mascara."],
  nextSteps: ["If you choose extensions or false lashes, review the adhesive ingredients and consider the risks of irritation and lash damage."],
  budget: "Routine lash care does not require extensions or premium cosmetics.",
  seek: "Stop a product that irritates you; seek medical advice if the irritation persists or if you develop eye pain, redness, light sensitivity, or vision changes.",
  sources: ["eyeCosmetics"],
});
const lashSensitivity = bodyEntry({
  explanation: "Sensitivity near the lashes may involve eyelid skin or the eye itself; this guide cannot tell which structure is affected.",
  care: { id: "lash-stop-irritant", title: "Pause eye products that trigger symptoms", text: "Stop eye cosmetics or adhesives that cause burning, itching, swelling, or rash. Keep products out of the eye and do not apply makeup to inflamed eyelid skin.", sources: ["eyeCosmetics", "nhsEyelids"] },
  precautions: ["Do not use essential oils, household remedies, or non-eye products near or in the eye. Do not repeatedly retry a product that caused a reaction."],
  nextSteps: ["Keep the product packaging and note when symptoms started to discuss with a clinician if the reaction recurs."],
  budget: "Pause suspected triggers; no specialty product is needed while symptoms are active.",
  seek: "Seek prompt assessment for persistent irritation. Eye pain, marked redness, light sensitivity, or vision changes require prompt medical assessment; sudden or severe symptoms are urgent.",
  sources: ["eyeCosmetics", "nhsEyelids"],
});

const faceSubareaGuidance = {
  Eyebrows: {
    "sparse brows": eyebrowSparse,
    "uneven shape": eyebrowShape,
    "dry skin": faceGuidance["Dry Skin"],
    irritation: eyebrowIrritation,
  },
  Eyelashes: {
    "sparse lashes": lashSparse,
    "brittle lashes": lashSparse,
    "lash care": lashCare,
    sensitivity: lashSensitivity,
  },
  Nose: {
    blackheads: faceGuidance.Acne,
    "visible pores": faceGuidance["Large Pores"],
    redness: faceGuidance.Redness,
    dryness: faceGuidance["Dry Skin"],
    "uneven tone": faceGuidance.Pigmentation,
  },
  Cheeks: {
    acne: faceGuidance.Acne,
    "dark spots": faceGuidance["Dark Spots"],
    redness: faceGuidance.Redness,
    dryness: faceGuidance["Dry Skin"],
    "uneven texture": faceGuidance["Uneven Texture"],
  },
  Ears: {
    dryness: faceGuidance["Dry Skin"],
    "dark spots": faceGuidance["Dark Spots"],
    "uneven tone": faceGuidance.Pigmentation,
    sensitivity: faceGuidance.Sensitivity,
  },
};

const bodyCare = bodyEntry({
  explanation: "Dry, rough, or uneven-feeling body skin can have several causes; this guide cannot identify the cause from a selection.",
  care: { id: "body-gentle-moisture", title: "Keep body care gentle and moisturize dry areas", text: "Use a gentle wash, keep showers comfortably warm and brief, pat dry, then apply a fragrance-free cream to dry skin while it is slightly damp. For exposed areas, use broad-spectrum sun protection outdoors.", sources: ["bodyDry", "sunscreen"] },
  precautions: ["Avoid scrubbing, picking, harsh bleaching products, or adding several new products at once; irritation can make skin more uncomfortable or change its appearance."],
  nextSteps: ["Notice whether the area is exposed to sun, rubbing, frequent washing, or a recent product change; this context can help a clinician assess persistent changes."],
  budget: "A basic gentle cleanser and moisturizer you already tolerate may be enough; premium products are not required.",
  seek: "Ask a clinician about persistent or worsening dryness, rash, unexplained color/texture changes, cracking, or painful irritation.",
  sources: ["bodyDry", "sunscreen"],
});
const bodyAcne = bodyEntry({
  explanation: "Bumps on the chest, shoulders, or back may be acne, but other conditions can look similar; this guide cannot diagnose them.",
  care: { id: "body-acne-gentle", title: "Reduce sweat and friction without scrubbing", text: "After sweating, change out of damp clothing and wash gently. Choose loose or moisture-wicking clothing for activity and avoid rubbing or picking the bumps.", sources: ["backAcne", "blisters"] },
  precautions: ["Avoid abrasive brushes, harsh scrubs, and squeezing. Do not start medicated acne products or combine treatments based only on this guide; they can irritate skin."],
  nextSteps: ["If you want to consider an acne treatment, ask a pharmacist or dermatologist whether it suits the body area and your skin; follow product directions."],
  budget: "Start with gentle cleansing and clean clothing; no special product is required. Ask a professional before spending on multiple treatments.",
  seek: "Seek a dermatologist's advice for deep or painful bumps, scarring, widespread/persistent breakouts, or a rash that does not improve.",
  sources: ["backAcne"],
});
const bodyTone = bodyEntry({
  explanation: "Body dark spots or uneven tone can follow different processes, including irritation or sun exposure; appearance alone does not establish a cause.",
  care: { id: "body-tone-protect", title: "Protect exposed skin and avoid irritation", text: "Use broad-spectrum sun protection on exposed areas and keep cleansing gentle. If a product seems to burn or cause a rash, stop using it.", sources: ["spots", "sunscreen", "patch"] },
  precautions: ["Do not use bleaching agents, lemon juice, harsh scrubs, or unverified lightening remedies. Avoid treating a new or changing spot as cosmetic before it is assessed."],
  nextSteps: ["A clinician can assess persistent, new, or changing marks and discuss appropriate options if needed."],
  budget: "Sun protection and avoiding irritation are practical basics; skip expensive spot-correcting products until the cause is understood.",
  seek: "Have a clinician assess a spot that is new, changing, persistent, painful, bleeding, or otherwise worrying.",
  sources: ["spots", "sunscreen"],
});
const bodyFriction = bodyEntry({
  explanation: "Rubbing between skin, clothing, or footwear can irritate the skin; repeated irritation may lead to soreness or blisters.",
  care: { id: "body-friction-reduce", title: "Reduce rubbing and pause when skin becomes sore", text: "Choose comfortable, well-fitting clothing or footwear and moisture-wicking layers for activity. A protective soft covering may help a small friction-prone spot; stop the activity if it becomes painful or red.", sources: ["blisters"] },
  precautions: ["Do not pop, cut, or drain a blister yourself. Avoid applying fragranced products to broken or irritated skin."],
  nextSteps: ["Check whether seams, straps, repetitive movement, or shoes are rubbing the area and adjust one source at a time."],
  budget: "Changing a rubbing garment or shoe fit is often a lower-cost first step; no premium product is needed.",
  seek: "Seek care for a blister or irritated area that is very painful, infected-looking, repeatedly returns, or does not heal.",
  sources: ["blisters"],
});
const ingrownHairCare = bodyEntry({
  explanation: "Shaving-related bumps can have different causes, including ingrown hairs or irritation; a selected concern is not a diagnosis.",
  care: { id: "body-shave-gentle", title: "Reduce shaving irritation", text: "If shaving is part of your routine, soften the area with warm water, use a shaving gel you tolerate, shave in the direction hair grows, and avoid pressing hard. Pause if the skin becomes sore.", sources: ["ingrownHairs"] },
  precautions: ["Do not dig into, squeeze, or pick a bump, and avoid harsh scrubs or irritating depilatory products on inflamed skin."],
  nextSteps: ["Consider pausing hair removal until irritation settles; ask a clinician if bumps are recurrent or unclear."],
  budget: "Changing shaving technique or taking a break costs nothing; avoid buying multiple treatments before the cause is clear.",
  seek: "Seek assessment for persistent, painful, spreading, pus-filled, or scarring bumps, or if you are unsure what the bumps are.",
  sources: ["ingrownHairs"],
});
const bodySweat = bodyEntry({
  explanation: "Sweat and odor are common and can vary with heat, activity, and individual factors; this guide cannot assess unusual or persistent changes.",
  care: { id: "body-sweat-clean", title: "Keep the area clean and dry", text: "Wash regularly, dry skin folds well, and change out of damp clothing. For underarms, use a deodorant or antiperspirant only if tolerated and follow its label.", sources: ["sweat", "feetOdor"] },
  precautions: ["Stop a deodorant or product that causes burning or a rash. Do not apply fragrance or harsh substances to broken or irritated skin."],
  nextSteps: ["If a product seems to irritate the area, pause it and keep care simple; a pharmacist can discuss suitable alternatives."],
  budget: "Washing, drying, and clean clothing are free basics; premium deodorants are not automatically more effective.",
  seek: "Ask a clinician about a sudden or persistent change in sweating or odor, or if it affects daily life despite routine hygiene.",
  sources: ["sweat", "feetOdor"],
});
const footSweat = bodyEntry({
  explanation: "Foot sweating and odor can be affected by sweat, moisture, footwear, and other causes; persistent symptoms may need assessment.",
  care: { id: "foot-clean-dry", title: "Keep feet and footwear dry", text: "Wash feet regularly and dry between the toes. Change damp socks, choose breathable footwear, and let shoes dry fully between wears.", sources: ["feetOdor", "sweat"] },
  precautions: ["Avoid applying deodorants or fragranced products to broken or irritated skin. Stop any product that causes a rash or burning."],
  nextSteps: ["A pharmacist can discuss suitable foot powders or antiperspirant products if basic hygiene steps are not enough."],
  budget: "Changing socks and allowing shoes to dry are low-cost first steps; premium products are not automatically better.",
  seek: "Ask a clinician if odor or sweating persists despite routine care, affects daily life, or comes with rash, pain, swelling, or nail changes.",
  sources: ["feetOdor", "sweat"],
});
const stretchMarkCare = bodyEntry({
  explanation: "Stretch marks are common lines in the skin and often become less visible over time; creams cannot be relied on to remove them.",
  care: { id: "stretch-mark-gentle", title: "Keep the area comfortable", text: "Use a moisturizer if the area feels dry or itchy, and avoid rubbing or irritating the skin. There is no need for a special product for routine comfort.", sources: ["stretchMarks", "bodyDry"] },
  precautions: ["Avoid claims that oils or creams prevent or erase stretch marks. Do not use prescription-strength or retinoid products without professional advice, particularly during pregnancy."],
  nextSteps: ["If appearance concerns you, a dermatologist can explain realistic options; treatments may improve appearance but do not guarantee removal."],
  budget: "Basic moisturizer is optional for comfort; costly creams are not proven to erase stretch marks.",
  seek: "Ask a clinician if marks appear suddenly with other health changes or if you are concerned about a rapid change in your skin.",
  sources: ["stretchMarks"],
});
const kpCare = bodyEntry({
  explanation: "Rough, small bumps on the upper arms can have different causes; a concern selection cannot confirm keratosis pilaris or distinguish it from other skin changes.",
  care: { id: "kp-gentle-moisture", title: "Moisturize and avoid rough scrubbing", text: "Keep bathing brief and warm rather than hot, use a mild cleanser, and apply a moisturizer after bathing. Scrubbing can irritate the bumps. If you are considering an exfoliating ingredient, use it only as directed and stop if it stings or dries the skin.", sources: ["keratosisPilaris"] },
  precautions: ["Do not pick or aggressively scrub bumps. Exfoliating ingredients can irritate sensitive skin; avoid applying them to broken or inflamed skin."],
  nextSteps: ["If the bumps persist or the appearance concerns you, a dermatologist can confirm what they are and discuss whether any treatment is appropriate."],
  budget: "Gentle washing and a moisturizer you already tolerate are reasonable basics; a specialty exfoliant is optional and is not required.",
  seek: "Seek professional advice if bumps are painful, itchy, inflamed, spreading, or do not seem like your usual skin texture.",
  sources: ["keratosisPilaris", "bodyDry"],
});
const handDry = bodyEntry({
  explanation: "Frequent handwashing, sanitizer, weather, or wet work can contribute to dry hands, but persistent rash or cracking may need assessment.",
  care: { id: "hand-wash-moisturize", title: "Moisturize after handwashing", text: "Continue washing hands as needed using lukewarm water, dry gently, then apply a fragrance-free cream or ointment while the skin is slightly damp. Gloves can help with wet household work.", sources: ["handDry", "handCare"] },
  precautions: ["Do not stop necessary hand hygiene. If a product stings or triggers a rash, stop it and simplify the routine."],
  nextSteps: ["Keep a small amount of a tolerated hand moisturizer near the sink or in a bag so it is easy to use."],
  budget: "A plain fragrance-free cream or ointment is enough; a premium hand product is not necessary.",
  seek: "Ask a clinician about persistent, painful, cracked, bleeding, or inflamed hands.",
  sources: ["handDry", "handCare"],
});
const handTone = bodyEntry({
  explanation: "Hand discoloration has multiple possible causes and may be related to sun exposure, irritation, or other factors; this guide cannot determine which.",
  care: { id: "hand-sun-care", title: "Protect hands outdoors", text: "Apply broad-spectrum SPF 30 or higher to exposed hands when outdoors and reapply as directed. Moisturize after washing if your hands feel dry.", sources: ["handCare", "sunscreen"] },
  precautions: ["Avoid bleaching agents, abrasive scrubs, and unverified spot treatments. Do not assume a new or changing mark is simply pigmentation."],
  nextSteps: ["Note any product or exposure changes; a clinician can assess persistent or changing marks."],
  budget: "A sunscreen you tolerate and a basic moisturizer are practical essentials; expensive brightening products are not required.",
  seek: "Have new, changing, persistent, painful, or bleeding marks checked by a clinician.",
  sources: ["handCare", "sunscreen"],
});
const roughSkin = bodyEntry({
  explanation: "Roughness or thickened skin can result from dryness, pressure, or repeated friction, among other causes.",
  care: { id: "rough-skin-gentle", title: "Soften rough skin without cutting it", text: "Moisturize regularly and reduce pressure or friction with comfortable shoes, gloves, or clothing suited to the area. Keep care gentle rather than trying to remove skin quickly.", sources: ["bodyDry", "callus"] },
  precautions: ["Do not shave, cut, or aggressively file thickened skin. People with diabetes, reduced foot sensation, or circulation problems should get professional advice before treating foot calluses."],
  nextSteps: ["Review whether repeated pressure or rubbing can be reduced; for feet, check that footwear fits comfortably."],
  budget: "A simple moisturizer and reducing pressure are low-cost steps; avoid costly or sharp callus-removal tools.",
  seek: "Seek professional assessment for painful thickened skin, cracks, bleeding, or foot concerns with diabetes, reduced sensation, or poor circulation.",
  sources: ["callus", "diabeticFoot"],
});
const handNailCare = bodyEntry({
  explanation: "Brittle, peeling, or splitting nails can be affected by repeated wetting and drying or cosmetic treatments; persistent changes can also have other causes.",
  care: { id: "nail-moisture", title: "Protect nails from repeated wetting and drying", text: "Moisturize nails and surrounding skin after washing, and use gloves for prolonged wet household work when practical. Trim or file rough edges gently in one direction.", sources: ["nails", "handDry"] },
  precautions: ["Do not cut or push back cuticles, bite or tear nail edges, or forcefully remove artificial nails. Avoid covering damaged nails with artificial products."],
  nextSteps: ["Take breaks from polish or artificial nails if they seem to worsen brittleness or irritation; stop products that cause a reaction."],
  budget: "Clean clippers, a basic file, and moisturizer are enough for routine care; salon services and premium strengthening products are optional.",
  seek: "Ask a clinician or dermatologist about persistent changes in nail color, shape, thickness, attachment, pain, or surrounding skin.",
  sources: ["nails", "artificialNails"],
});
const nailGeneralCare = bodyEntry({
  explanation: "Routine nail care is mainly about keeping nails clean and preventing avoidable injury; it does not require cosmetic products.",
  care: { id: "nail-gentle-care", title: "Use clean tools and gentle filing", text: "Keep nails clean, use clean clippers, smooth rough edges by filing in one direction, and trim toenails straight across. Do not cut cuticles.", sources: ["nails"] },
  precautions: ["Do not share unclean nail tools or cut/push cuticles. Never dig under the nail or cut into painful nail corners."],
  nextSteps: ["If you choose a manicure or pedicure, ask that cuticles not be cut and that tools are clean."],
  budget: "A clean clipper and simple file are sufficient for routine nail care.",
  seek: "Get professional assessment for persistent color, shape, thickness, separation, pain, or swelling changes.",
  sources: ["nails", "artificialNails"],
});
const nailAppearance = bodyEntry({
  explanation: "Staining or an uneven nail appearance may relate to polish or other causes; appearance alone cannot establish what is happening beneath the nail.",
  care: { id: "nail-gentle-care", title: "Give nails a break from cosmetic products", text: "Pause polish or artificial coverings if the nail is irritated or damaged, and keep nails clean and gently filed. Avoid trying to scrub away a stain aggressively.", sources: ["nails", "artificialNails"] },
  precautions: ["Do not assume new or persistent yellow, dark, thickened, painful, or detached nails are cosmetic. Avoid covering a changing nail while its cause is unknown."],
  nextSteps: ["Take note of when a change started and whether a product was used; a clinician or dermatologist can assess persistent changes."],
  budget: "Taking a break from polish costs nothing; avoid buying whitening or unverified nail treatments.",
  seek: "Have unexplained or persistent nail color, texture, thickness, shape, or attachment changes assessed by a qualified professional.",
  sources: ["nails", "artificialNails"],
});
const nailProductCare = bodyEntry({
  explanation: "Artificial nails, press-ons, adhesives, and removal methods can weaken nails or irritate surrounding skin, especially with repeated use.",
  care: { id: "nail-gentle-care", title: "Use nail products cautiously", text: "Consider breaks between artificial nail applications and follow product directions. If a salon service is chosen, ask the technician not to cut cuticles.", sources: ["artificialNails"] },
  precautions: ["Do not force, peel, or file off artificial nails. Stop a product that causes burning, itching, swelling, or a rash; avoid covering damaged nails."],
  nextSteps: ["Ask a qualified nail professional about safer removal options rather than pulling the product off yourself."],
  budget: "Artificial nails and frequent salon maintenance are optional; simple natural nail care is lower cost.",
  seek: "Seek advice for persistent irritation, pain, swelling, or nail damage after a product or salon service.",
  sources: ["artificialNails"],
});
const cuticleCare = bodyEntry({
  explanation: "Cuticles and nearby skin help protect the nail area; dryness or irritation can make them uncomfortable.",
  care: { id: "nail-moisturize", title: "Moisturize nail edges and leave cuticles intact", text: "Apply a moisturizer to the nail edges after handwashing or bathing and avoid picking at dry skin.", sources: ["nails", "handDry"] },
  precautions: ["Do not cut, bite, or aggressively push cuticles back; avoid products that cause burning, redness, or swelling."],
  nextSteps: ["Ask a nail professional to skip cuticle trimming if you choose a manicure or pedicure."],
  budget: "A basic hand cream or ointment can moisturize nail edges; no dedicated cuticle product is required.",
  seek: "Seek advice for persistent redness, swelling, tenderness, drainage, or repeated irritation around a nail.",
  sources: ["nails", "artificialNails"],
});
const footCare = bodyEntry({
  explanation: "Foot dryness, odor, or discomfort may relate to moisture, friction, footwear, or other causes; this guide cannot diagnose the cause.",
  care: { id: "foot-clean-dry", title: "Wash and dry feet carefully", text: "Wash feet regularly and dry well, especially between toes. Use clean socks, let shoes dry between wears, and choose comfortable breathable footwear.", sources: ["feetOdor", "blisters"] },
  precautions: ["Do not cut thick skin, dig at an ingrown nail, or pop a blister. If you have diabetes, reduced sensation, or poor circulation, ask a health professional before self-treating foot problems."],
  nextSteps: ["Check whether socks or shoes are damp, tight, or rubbing; change into dry, well-fitting footwear when possible."],
  budget: "Clean socks, washing and drying carefully, and comfortable footwear are useful basics; specialized products are not always needed.",
  seek: "Seek professional advice for persistent odor, painful cracks, non-healing blisters, spreading redness, warmth, swelling, pus, significant pain, or concerning nail changes.",
  sources: ["feetOdor", "blisters", "diabeticFoot"],
});
const footRough = bodyEntry({
  explanation: "Rough or thickened heel skin can develop with dryness and pressure or friction, but appearance alone cannot determine its cause.",
  care: { id: "heel-moisture-pressure", title: "Moisturize heels and reduce pressure", text: "Apply moisturizer to dry heel skin and choose shoes that fit comfortably. Keep the skin intact and avoid trying to remove it quickly.", sources: ["callus", "bodyDry"] },
  precautions: ["Do not cut, shave, or aggressively file heel skin. With diabetes, poor circulation, or reduced foot sensation, get professional advice before any callus care."],
  nextSteps: ["If footwear rubs or puts pressure on the heel, consider a better fit and seek advice if it continues."],
  budget: "A basic moisturizer and comfortable shoes are practical starting points; avoid sharp or medicated removal products without advice.",
  seek: "Seek professional advice for painful or cracking heels, bleeding, signs of infection, or any foot wound if you have diabetes or reduced sensation.",
  sources: ["callus", "diabeticFoot"],
});
const footNailCare = bodyEntry({
  explanation: "Toenail appearance can change for many reasons; thick, yellow, painful, detached, or suddenly changing nails should not automatically be treated as cosmetic.",
  care: { id: "toenail-trim", title: "Keep toenails clean and trim straight across", text: "Use clean toenail clippers, trim straight across without cutting too short, and dry feet carefully after washing.", sources: ["nails", "feetOdor"] },
  precautions: ["Do not dig into nail corners or attempt to remove a painful or ingrown nail yourself. Avoid polish or artificial coverings over a nail that appears damaged or irritated."],
  nextSteps: ["Choose footwear with enough room around the toes and pause cosmetic products if they cause irritation."],
  budget: "Clean clippers and roomier footwear may be all that is needed for basic care; avoid unverified nail treatments.",
  seek: "Have persistent or unexplained nail discoloration, thickening, separation, pain, or swelling assessed by a qualified professional.",
  sources: ["nails", "diabeticFoot"],
});

const bodyAreaAliases = {
  Neck: { "dark neck": bodyTone, pigmentation: bodyTone, dryness: bodyCare, "uneven skin tone": bodyTone, "rough texture": roughSkin, "general body skin care": bodyCare },
  Shoulders: { acne: bodyAcne, "dark spots": bodyTone, pigmentation: bodyTone, dryness: bodyCare, "body acne": bodyAcne, "friction/chafing": bodyFriction, "general body skin care": bodyCare },
  Arms: { "uneven skin tone": bodyTone, "dark spots": bodyTone, dryness: bodyCare, "keratosis pilaris": kpCare, "rough texture": roughSkin, "general body skin care": bodyCare },
  Underarms: { "dark underarms": bodyTone, pigmentation: bodyTone, "odour care": bodySweat, dryness: bodyCare, "sweat/body odor": bodySweat, irritation: bodyFriction, "ingrown hairs": ingrownHairCare, "friction/chafing": bodyFriction, "general body skin care": bodyCare },
  Hands: { dryness: handDry, "dark spots": handTone, "uneven tone": handTone, "rough skin": roughSkin, "hand hygiene": handDry, pigmentation: handTone, "general body skin care": handDry },
  Nails: { "brittle nails": handNailCare, "dry cuticles": cuticleCare, "nail care": nailGeneralCare, "uneven nails": nailAppearance, "peeling nails": handNailCare, "nail breakage": handNailCare, "nail staining": nailAppearance, "press-on/product precautions": nailProductCare },
  Fingernails: { "brittle nails": handNailCare, "dry cuticles": cuticleCare, "nail care": nailGeneralCare, "uneven nails": nailAppearance, "peeling nails": handNailCare, "nail breakage": handNailCare, "nail staining": nailAppearance, "press-on/product precautions": nailProductCare },
  Chest: { acne: bodyAcne, "dark spots": bodyTone, pigmentation: bodyTone, dryness: bodyCare, "body acne": bodyAcne, "friction/chafing": bodyFriction, "general body skin care": bodyCare },
  Abdomen: { "stretch marks": stretchMarkCare, dryness: bodyCare, "uneven skin tone": bodyTone, "friction/chafing": bodyFriction, "general body skin care": bodyCare },
  Back: { "back acne": bodyAcne, acne: bodyAcne, "dark spots": bodyTone, "uneven texture": bodyCare, dryness: bodyCare, "friction/chafing": bodyFriction, "general body skin care": bodyCare },
  Hips: { dryness: bodyCare, "dark spots": bodyTone, "uneven skin tone": bodyTone, "stretch marks": stretchMarkCare, "friction/chafing": bodyFriction, "general body skin care": bodyCare },
  Thighs: { dryness: bodyCare, "uneven texture": bodyCare, "stretch marks": stretchMarkCare, "dark spots": bodyTone, "friction/chafing": bodyFriction, "chafing": bodyFriction, "general body skin care": bodyCare },
  Legs: { dryness: bodyCare, "uneven skin tone": bodyTone, "dark spots": bodyTone, "rough skin": roughSkin, "ingrown hairs": ingrownHairCare, "general body skin care": bodyCare },
  Knees: { "dark knees": bodyTone, dryness: bodyCare, "rough skin": roughSkin, pigmentation: bodyTone, "general body skin care": bodyCare },
  Feet: { "dry feet": footCare, "cracked skin": footRough, "dark spots": bodyTone, "rough skin": footRough, "foot hygiene": footCare, "foot odor/sweating": footSweat, "friction blisters": bodyFriction, "rough heels": footRough, "general body skin care": footCare },
  Toes: { "nail care": footNailCare, dryness: footCare, "dark spots": bodyTone, "rough skin": footRough, "foot hygiene": footCare, "foot odor/sweating": footSweat, "friction blisters": bodyFriction },
  Toenails: { "brittle nails": footNailCare, "dry cuticles": cuticleCare, "nail care": footNailCare, "uneven nails": nailAppearance, "peeling nails": footNailCare, "nail breakage": footNailCare, "nail staining": nailAppearance },
};

const faceConcernAliases = { "dark spots": "Dark Spots", pigmentation: "Pigmentation", dullness: "Dullness", redness: "Redness", "uneven texture": "Uneven Texture", "oily skin": "Oily Skin", "dry skin": "Dry Skin", sensitivity: "Sensitivity", "acne scars": "Acne Scars", acne: "Acne", "large pores": "Large Pores" };
const hairConcernAliases = {
  "frizzy hair": "Frizzy Hair", frizz: "Frizzy Hair", "dry hair": "Dry Hair",
  "hair breakage": "Hair Breakage", "hair fall": "Hair Fall", "hair fall or excessive shedding": "Hair Fall", "excessive shedding": "Hair Fall",
  "rough or tangled hair": "Rough or Tangled Hair", "oily hair": "Oily Hair", "split ends": "Split Ends", "lack of shine": "Lack of Shine",
  dandruff: "Dandruff", "dandruff and flaking": "Dandruff", "oily scalp": "Oily Scalp", "dry scalp": "Dry Scalp", "itchy scalp": "Itchy Scalp",
  "scalp sensitivity": "Scalp Sensitivity", "sensitive scalp": "Scalp Sensitivity", "product buildup": "Product Buildup",
  "persistent scalp redness or irritation": "Persistent Scalp Redness or Irritation", "scalp redness": "Persistent Scalp Redness or Irritation",
};
const eyeConcernAliases = {
  "dark circles": "Dark Circles", puffiness: "Puffiness", dryness: "Dryness", "dryness around eyes": "Dryness", "dryness around the eyes": "Dryness",
  "fine lines": "Fine Lines", "tired-looking eyes": "Tired-Looking Eyes", "tired looking eyes": "Tired-Looking Eyes",
  "sensitive or irritated eyelid skin": "Sensitive or Irritated Eyelid Skin", "sensitive eyelid skin": "Sensitive or Irritated Eyelid Skin",
};
const lipConcernAliases = {
  "dark lips": "Dark Lips", pigmentation: "Pigmentation", "lip pigmentation or uneven tone": "Pigmentation", "uneven lip tone": "Pigmentation",
  "dry lips": "Dry Lips", "chapped lips": "Chapped Lips", flaking: "Flaking", "cracked lips": "Cracked Lips",
  "lip sensitivity or irritation": "Lip Sensitivity or Irritation", "lip texture concerns": "Lip Texture Concerns",
};

const budgetGuidance = {
  "Budget-friendly": "Budget-friendly focus: start with products you already tolerate; no purchase is required to use this educational guidance.",
  Moderate: "Moderate budget focus: add a product only if it addresses a clear need and fits comfortably within your budget.",
  Premium: "Premium budget focus: a higher price is not a guarantee of better results; choose based on comfort and need, not price tier.",
};

export function buildGuidance({ area, concerns = [], lifestyle = [], budget = "" } = {}) {
  const isHair = area === "Hair";
  const isEyes = area === "Eyes";
  const isLips = area === "Lips";
  const isFaceSubarea = Object.hasOwn(faceSubareaGuidance, area);
  const isEyeAdjacent = isEyes || area === "Eyebrows" || area === "Eyelashes";
  const isBody = Object.hasOwn(bodyAreaAliases, area);
  const concernData = area === "Face" ? faceGuidance : isHair ? hairGuidance : isEyes ? eyeGuidance : isLips ? lipGuidance : isBody ? bodyAreaAliases[area] : isFaceSubarea ? faceSubareaGuidance[area] : null;
  const aliases = area === "Face" ? faceConcernAliases : isHair ? hairConcernAliases : isEyes ? eyeConcernAliases : isLips ? lipConcernAliases : null;
  if (!concernData) {
    return { supported: false, message: `Concern-specific guidance for ${area || "this area"} has not been added yet. No unrelated advice is shown.` };
  }
  if (!concerns.length) {
    return { supported: false, message: `No ${isHair ? "hair or scalp" : isEyes ? "eye-area" : isLips ? "lip" : isBody ? area.toLowerCase() : "face"} concerns are selected yet. Go back and choose one or more concerns to see relevant educational guidance.` };
  }

  const entries = concerns.map((concern) => {
    const normalized = String(concern).trim().toLowerCase();
    const key = isBody || isFaceSubarea ? normalized : aliases[normalized];
    const detail = concernData[key];
    return detail ? { concern, ...detail } : { concern, missing: true, explanation: "Specific guidance for this selected concern has not been reviewed for this guide. No unrelated advice is substituted." };
  });
  const known = entries.filter((entry) => !entry.missing);
  const uniqueSteps = new Map();
  known.flatMap((entry) => entry.everyday).forEach((step) => {
    if (!uniqueSteps.has(step.id)) uniqueSteps.set(step.id, step);
  });
  const hasSensitivity = lifestyle.includes("Sensitive to products") || concerns.some((item) => ["sensitivity", "irritation", "scalp sensitivity", "sensitive or irritated eyelid skin", "lip sensitivity or irritation"].includes(String(item).toLowerCase()));
  const isBusy = lifestyle.includes("Busy schedule") || lifestyle.includes("Prefer simple routines");

  return {
    supported: true,
    entries,
    everyday: [...uniqueSteps.values()],
    sensitivityNote: hasSensitivity ? isHair ? "Scalp-sensitivity preference: keep to familiar, gentle products, rinse thoroughly, and stop any new product that causes burning, itching, or a rash. Seek professional advice if a reaction persists." : isEyeAdjacent ? "Eye-area sensitivity: use only familiar products labelled for the eye area, keep them out of the eye, and stop anything that stings or causes a rash. Avoid testing new products on irritated eyelid skin." : isLips ? "Lip sensitivity: pause products that sting or cause irritation; use only familiar, simple lip care if tolerated, and avoid repeatedly testing a trigger." : isBody ? "Skin/nail sensitivity: keep care simple, stop products that burn or trigger a rash, and try at most one new product at a time on intact skin. Do not test products on a wound or inflamed area." : "Sensitivity preference: keep the routine especially simple, patch-test one new product at a time, and leave out optional exfoliation or treatment steps unless a clinician advises them." : "",
    lifestyleNote: isBusy ? "For a busy schedule, use only the shared basics above; optional steps can be skipped." : lifestyle.includes("Often outdoors") ? isHair ? "Since you are often outdoors, shade or a hat can protect an exposed scalp, especially where hair is thinning." : isEyeAdjacent ? "Since you are often outdoors, sunglasses and shade help protect the delicate skin around the eyes." : isLips ? "Since you are often outdoors, the NHS advises SPF 15+ lip balm reapplied every two hours." : isBody ? "For exposed body areas, follow sunscreen directions and use clothing or shade when practical. Hands and feet can also be exposed outdoors." : "Since you are often outdoors, plan shade and sunscreen according to its label." : "",
    areaSafetyNote: isEyeAdjacent ? "Eye safety: this guidance is for the brow/lash area or surrounding skin, not the eyeball. Avoid ordinary hair dye and unapproved tinting near the eyes. Eye pain, significant redness, light sensitivity, or vision changes need prompt assessment; sudden or severe symptoms are urgent." : isBody && ["Feet", "Toes", "Toenails"].includes(area) ? "Foot safety: people with diabetes, reduced foot sensation, or poor circulation should seek professional advice before treating wounds or thick skin themselves. Get prompt help for spreading redness, warmth, swelling, pus, significant pain, or a non-healing wound." : isBody ? "Skin and nail safety: this educational guide cannot identify a diagnosis. Persistent rash, worsening redness, warmth, swelling, pus, significant pain, or unexplained nail changes should be assessed by a qualified professional." : "",
    budgetNote: budgetGuidance[budget] || "No budget range selected; the guidance does not require buying products.",
    sources,
  };
}
