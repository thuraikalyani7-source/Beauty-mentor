import { buildGuidance } from "./guidanceData.js";
import { getRoutineRecommendation } from "./routineRecommendations.js";

const EXPLICIT_TIMINGS = new Set(["morning", "evening", "both"]);
const SENSITIVITY_OPTION = "Sensitive to products";

export function getRoutineTiming(step) {
  return EXPLICIT_TIMINGS.has(step?.routineTiming) ? step.routineTiming : "general";
}

function getExperienceNote(experience) {
  if (experience === "I'm new to skincare.") return "Keep any routine simple and introduce changes one at a time.";
  if (experience === "I already have a basic routine.") return "Keep familiar steps that suit you and introduce any change one at a time.";
  if (experience === "I have an established routine.") return "Continue to monitor how familiar products suit you, and stop anything that causes irritation.";
  return "";
}

function getAgeNote(ageRange) {
  return ageRange === "Under 13" || ageRange === "13–17 years"
    ? "Keep care simple. Talk with a trusted adult or qualified professional before trying strong or medicated products."
    : "";
}

function addInstruction(stepGroup, step, concern, area) {
  // Keep one visible instruction block per shared step, while retaining each
  // concern's distinct wording inside that block.
  const instruction = stepGroup.instructions[0];
  const target = instruction || { texts: [], concerns: [], sources: [], productCategories: [], alternatives: [] };
  if (!instruction) stepGroup.instructions.push(target);
  if (!target.texts.includes(step.text)) target.texts.push(step.text);
  if (!target.concerns.includes(concern)) target.concerns.push(concern);
  for (const source of step.sources || []) {
    if (!target.sources.includes(source)) target.sources.push(source);
  }
  const recommendation = getRoutineRecommendation(area, step);
  for (const category of recommendation.categories) {
    const existing = target.productCategories.find((item) => item.label === category.label && item.use === category.use);
    if (!existing) target.productCategories.push({ ...category, sources: [...recommendation.sources] });
    else {
      for (const source of recommendation.sources) {
        if (!existing.sources.includes(source)) existing.sources.push(source);
      }
    }
  }
  if (!target.alternatives.includes(recommendation.alternative)) target.alternatives.push(recommendation.alternative);
  for (const source of recommendation.sources) {
    if (!target.sources.includes(source)) target.sources.push(source);
  }
  stepGroup.timings.add(getRoutineTiming(step));
}

function resolveTiming(timings) {
  if (timings.size !== 1) return "general";
  const [timing] = timings;
  return EXPLICIT_TIMINGS.has(timing) ? timing : "general";
}

export function buildRoutine(profile = {}) {
  const lifestyle = Array.isArray(profile.lifestyle) ? [...profile.lifestyle] : [];
  if (profile.sensitive && !lifestyle.includes(SENSITIVITY_OPTION)) lifestyle.push(SENSITIVITY_OPTION);
  const sensitivePreference = Boolean(profile.sensitive || lifestyle.includes(SENSITIVITY_OPTION));
  const concerns = Array.isArray(profile.selectedConcerns) ? profile.selectedConcerns : [];
  const guidance = buildGuidance({
    area: profile.selectedArea,
    concerns,
    lifestyle,
    budget: profile.budget || "",
  });

  const result = {
    supported: guidance.supported,
    area: profile.selectedArea || "",
    concerns,
    morning: [],
    evening: [],
    general: [],
    contextNotes: [],
    concernNotes: [],
    missingConcerns: [],
    sources: guidance.sources || {},
    cataloguePreferences: { sensitive: sensitivePreference, budget: profile.budget || "" },
    emptyMessage: guidance.supported
      ? "The selected guidance does not currently include everyday routine steps. No steps or products have been added."
      : "Choose a body area and one or more concerns in the Beauty Guide to generate reviewed routine steps. Product selections are optional.",
  };

  if (!guidance.supported) return result;

  const groupedSteps = new Map();
  for (const entry of guidance.entries) {
    if (entry.missing) {
      result.missingConcerns.push(entry.concern);
      continue;
    }

    result.concernNotes.push({
      concern: entry.concern,
      explanation: entry.explanation,
      precautions: Array.isArray(entry.precautions) ? entry.precautions : [],
      seek: entry.seek || "",
    });

    for (const step of Array.isArray(entry.everyday) ? entry.everyday : []) {
      if (!step?.id || typeof step.text !== "string" || !step.text.trim()) continue;
      const group = groupedSteps.get(step.id) || {
        id: step.id,
        title: step.title || "Everyday guidance",
        instructions: [],
        timings: new Set(),
      };
      addInstruction(group, step, entry.concern, profile.selectedArea);
      groupedSteps.set(step.id, group);
    }
  }

  for (const group of groupedSteps.values()) {
    const step = {
      id: group.id,
      title: group.title,
      instructions: group.instructions,
    };
    const timing = resolveTiming(group.timings);
    if (timing === "morning" || timing === "both") result.morning.push(step);
    if (timing === "evening" || timing === "both") result.evening.push(step);
    if (timing === "general") result.general.push(step);
  }

  if (result.missingConcerns.length > 0 && groupedSteps.size === 0) {
    result.emptyMessage = `Reviewed routine guidance is not available for: ${result.missingConcerns.join(", ")}. No unrelated steps or product categories were added.`;
  }

  if (guidance.lifestyleNote) result.contextNotes.push({ label: "Lifestyle", text: guidance.lifestyleNote });
  if (guidance.sensitivityNote) result.contextNotes.push({ label: "Sensitivity", text: guidance.sensitivityNote });
  if (guidance.budgetNote) result.contextNotes.push({ label: "Budget", text: guidance.budgetNote });
  if (guidance.areaSafetyNote) result.contextNotes.push({ label: "Important", text: guidance.areaSafetyNote });

  const experienceNote = getExperienceNote(profile.skincareExperience);
  if (experienceNote) result.contextNotes.push({ label: "Routine experience", text: experienceNote });
  const ageNote = getAgeNote(profile.ageRange);
  if (ageNote) result.contextNotes.push({ label: "Age-aware reminder", text: ageNote });

  return result;
}
