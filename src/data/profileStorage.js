export const PROFILE_STORAGE_KEY = "beauty-mentor-profile-v1";
const LEGACY_PREFERENCES_KEY = "beauty-mentor-preferences";
const SENSITIVITY_LIFESTYLE = "Sensitive to products";

export const AGE_RANGES = ["Under 13", "13–17 years", "18–24 years", "25–39 years", "40 years and above", "Prefer not to say"];
export const SKINCARE_EXPERIENCES = ["I'm new to skincare.", "I already have a basic routine.", "I have an established routine."];
export const LIFESTYLE_OPTIONS = ["Busy schedule", "Prefer simple routines", "Enjoy self-care", "Often outdoors", SENSITIVITY_LIFESTYLE];
export const BUDGET_OPTIONS = ["Budget-friendly", "Moderate", "Premium"];

export function createDefaultProfile() {
  return {
    onboardingComplete: false,
    ageRange: "",
    skincareExperience: "",
    selectedArea: "Face",
    selectedConcerns: [],
    lifestyle: [],
    budget: "",
    sensitive: false,
  };
}

function readJson(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function normalizeProfile(candidate, concernsByArea, fallback = createDefaultProfile()) {
  const defaults = createDefaultProfile();
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return fallback;

  const ageRange = AGE_RANGES.includes(candidate.ageRange) ? candidate.ageRange : fallback.ageRange;
  const skincareExperience = SKINCARE_EXPERIENCES.includes(candidate.skincareExperience) ? candidate.skincareExperience : fallback.skincareExperience;
  const selectedArea = Object.hasOwn(concernsByArea, candidate.selectedArea)
    ? candidate.selectedArea
    : Object.hasOwn(concernsByArea, fallback.selectedArea) ? fallback.selectedArea : defaults.selectedArea;
  const allowedConcerns = concernsByArea[selectedArea] || [];
  const selectedConcerns = Array.isArray(candidate.selectedConcerns)
    ? [...new Set(candidate.selectedConcerns.filter((item) => typeof item === "string" && allowedConcerns.includes(item)))]
    : [];
  let lifestyle = Array.isArray(candidate.lifestyle)
    ? [...new Set(candidate.lifestyle.filter((item) => LIFESTYLE_OPTIONS.includes(item)))]
    : [];
  const sensitive = candidate.sensitive === true || lifestyle.includes(SENSITIVITY_LIFESTYLE);
  lifestyle = sensitive
    ? [...new Set([...lifestyle, SENSITIVITY_LIFESTYLE])]
    : lifestyle.filter((item) => item !== SENSITIVITY_LIFESTYLE);

  return {
    onboardingComplete: typeof candidate.onboardingComplete === "boolean" ? candidate.onboardingComplete : fallback.onboardingComplete,
    ageRange,
    skincareExperience,
    selectedArea,
    selectedConcerns,
    lifestyle,
    budget: BUDGET_OPTIONS.includes(candidate.budget) ? candidate.budget : "",
    sensitive,
  };
}

export function loadProfile(concernsByArea) {
  const saved = readJson(PROFILE_STORAGE_KEY);
  const legacyPreferences = readJson(LEGACY_PREFERENCES_KEY);
  const legacyProfile = legacyPreferences && typeof legacyPreferences === "object" && !Array.isArray(legacyPreferences)
    ? {
      ...createDefaultProfile(),
      ageRange: AGE_RANGES.includes(legacyPreferences.ageRange) ? legacyPreferences.ageRange : "",
      skincareExperience: SKINCARE_EXPERIENCES.includes(legacyPreferences.skincareExperience) ? legacyPreferences.skincareExperience : "",
      onboardingComplete: AGE_RANGES.includes(legacyPreferences.ageRange)
        && SKINCARE_EXPERIENCES.includes(legacyPreferences.skincareExperience),
    }
    : createDefaultProfile();

  if (saved?.version === 1 && saved.profile && typeof saved.profile === "object") {
    return normalizeProfile(saved.profile, concernsByArea, legacyProfile);
  }

  return normalizeProfile(legacyProfile, concernsByArea);
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({ version: 1, profile }));
  } catch {
    // Keep profile changes usable for this session if browser storage is unavailable.
  }
}
