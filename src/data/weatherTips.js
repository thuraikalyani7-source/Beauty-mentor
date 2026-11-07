const WEATHER_TIP_RULES = Object.freeze({
  sunnyUv: { threshold: 3, label: "UV index at or above 3" },
  hotCelsius: { threshold: 30, label: "temperature at or above 30°C" },
  highHumidity: { threshold: 70, label: "relative humidity at or above 70%" },
  lowHumidity: { threshold: 35, label: "relative humidity at or below 35%" },
  coldCelsius: { threshold: 10, label: "temperature below 10°C" },
  windyKmh: { threshold: 25, label: "wind at or above 25 km/h" },
  rainyCodes: [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 85, 86, 95, 96, 99],
  rainMm: 0.2,
});

const isAvailable = (value) => value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value));

export function buildWeatherTips(current, preferences = {}) {
  if (!current) {
    return [{
      id: "general-care",
      title: "Keep care comfortable and consistent",
      reason: "Live weather has not been selected, so this is a general reminder rather than a weather-based suggestion.",
      advice: "Choose gentle steps that suit you, follow product labels, and adjust only when your skin or hair feels uncomfortable.",
    }];
  }

  const tips = [];
  const add = (tip) => tips.push(tip);
  const temperature = current.temperature_2m;
  const humidity = current.relative_humidity_2m;
  const uv = current.uv_index;
  const wind = current.wind_speed_10m;
  const weatherCode = Number(current.weather_code);
  const precipitation = current.precipitation;
  const prefersSimple = preferences.lifestyle?.some((item) => ["Busy schedule", "Prefer simple routines"].includes(item))
    || ["I'm new to skincare.", "I already have a basic routine."].includes(preferences.experience);
  const sensitive = preferences.lifestyle?.includes("Sensitive to products") || preferences.sensitive === true
    || preferences.concerns?.some((concern) => /sensitiv|irritat/i.test(concern));
  const hasFrizzConcern = preferences.concerns?.some((concern) => /frizz/i.test(concern));

  if (isAvailable(uv) && Number(uv) >= WEATHER_TIP_RULES.sunnyUv.threshold) {
    add({
      id: "sun-protection",
      title: "Plan for UV exposure",
      reason: `The reported UV index is ${Number(uv).toFixed(1)}; this rule applies at ${WEATHER_TIP_RULES.sunnyUv.label}.`,
      advice: "When outdoors, consider broad-spectrum sunscreen and follow its label directions for reapplication. Shade, a hat, and covering clothing can add sun-protective habits.",
    });
  }

  if (isAvailable(temperature) && Number(temperature) >= WEATHER_TIP_RULES.hotCelsius.threshold) {
    add({
      id: "warm-weather-comfort",
      title: "Choose comfortable warm-weather care",
      reason: `The reported temperature is ${Number(temperature).toFixed(1)}°C; this rule applies at ${WEATHER_TIP_RULES.hotCelsius.label}.`,
      advice: "If heavier layers feel uncomfortable, a lighter-feeling routine may be more pleasant. No particular product is required.",
    });
  }

  if (isAvailable(humidity) && Number(humidity) >= WEATHER_TIP_RULES.highHumidity.threshold) {
    add({
      id: "humid-weather-comfort",
      title: "Keep humid-weather care comfortable",
      reason: `Relative humidity is ${Math.round(Number(humidity))}%; this rule applies at ${WEATHER_TIP_RULES.highHumidity.label}.`,
      advice: "If you prefer a less heavy feel, use only routine steps that feel comfortable to you. Humidity alone does not explain acne or another skin concern.",
    });
    if (hasFrizzConcern) add({ id: "frizz-humidity", title: "For your selected frizz concern", reason: "Your guide selections include frizzy hair and the air is humid.", advice: "A gentle leave-in product or a simple protective style may help manage the feel of frizz; avoid rough towel rubbing and choose what suits your hair." });
  } else if (isAvailable(humidity) && Number(humidity) <= WEATHER_TIP_RULES.lowHumidity.threshold) {
    add({
      id: "dry-air-comfort",
      title: "Be gentle in dry air",
      reason: `Relative humidity is ${Math.round(Number(humidity))}%; this rule applies at ${WEATHER_TIP_RULES.lowHumidity.label}.`,
      advice: "A gentle cleanse and a moisturizer that already suits you may feel more comfortable. Consider skipping harsh exfoliation if your skin feels dry or tight.",
    });
  }

  const rainy = WEATHER_TIP_RULES.rainyCodes.includes(weatherCode) || (isAvailable(precipitation) && Number(precipitation) > WEATHER_TIP_RULES.rainMm);
  if (rainy) {
    add({
      id: "rainy-day-comfort",
      title: "A practical rainy-day note",
      reason: "The reported condition or recent precipitation indicates rain or showers.",
      advice: "Keep hair and skin care comfortable after getting wet, and change out of damp clothing when practical. Rain by itself does not cause acne.",
    });
  }

  const cold = isAvailable(temperature) && Number(temperature) < WEATHER_TIP_RULES.coldCelsius.threshold;
  const windy = isAvailable(wind) && Number(wind) >= WEATHER_TIP_RULES.windyKmh.threshold;
  if (cold || windy) {
    const conditions = [cold && WEATHER_TIP_RULES.coldCelsius.label, windy && WEATHER_TIP_RULES.windyKmh.label].filter(Boolean).join(" and ");
    add({
      id: "cold-windy-comfort",
      title: "Protect exposed skin from uncomfortable weather",
      reason: `This suggestion is shown for ${conditions}.`,
      advice: "Consider covering exposed skin and using a gentle moisturizer that suits you. If you have sensitive skin, stick with familiar products and avoid adding several new products at once.",
    });
  }

  const hasWeatherRuleTips = tips.length > 0;
  if (sensitive) {
    tips.push({ id: "sensitivity-reminder", title: "A sensitivity reminder", reason: "Your preferences mention product sensitivity.", advice: "Keep to products you already tolerate when possible. Stop using a product that causes a reaction and seek professional advice for severe or persistent symptoms." });
  }
  if (!hasWeatherRuleTips) {
    tips.push({ id: "steady-routine", title: "No weather adjustment stands out", reason: "The available weather values did not cross the guidance rules for this page.", advice: prefersSimple ? "Your usual simple routine is enough for today; no extra step is needed just because the weather changed." : "Continue with the routine that feels comfortable to you. Weather alone does not determine what your skin needs." });
  }
  return tips;
}

export { WEATHER_TIP_RULES };
