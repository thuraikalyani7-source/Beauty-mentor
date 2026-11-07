const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

async function readJson(response, context) {
  if (!response.ok) {
    if (response.status === 429) throw new Error("The weather service is receiving too many requests. Please wait a moment and try again.");
    if (response.status >= 500) throw new Error("The weather service is temporarily unavailable. Please try again later.");
    throw new Error(`The ${context} request could not be completed (HTTP ${response.status}).`);
  }
  return response.json();
}

export async function searchCities(query, signal) {
  const url = new URL(GEOCODING_URL);
  url.search = new URLSearchParams({ name: query.trim(), count: "6", language: "en", format: "json" });
  const data = await readJson(await fetch(url, { signal }), "city search");
  return (Array.isArray(data.results) ? data.results : []).map((place) => ({
    id: `${place.id ?? place.name}-${place.latitude}-${place.longitude}`,
    name: place.name,
    admin1: place.admin1 ?? "",
    country: place.country ?? "",
    latitude: place.latitude,
    longitude: place.longitude,
    timezone: place.timezone ?? "",
  }));
}

export async function getCurrentWeather(place, signal) {
  const url = new URL(FORECAST_URL);
  url.search = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index,precipitation",
    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
    timezone: "auto",
  });
  const data = await readJson(await fetch(url, { signal }), "weather");
  if (!data.current || typeof data.current !== "object") {
    throw new Error("The provider did not return current weather for this location.");
  }
  return {
    place,
    current: data.current,
    units: data.current_units ?? {},
    timezone: data.timezone ?? place.timezone ?? "",
    fetchedAt: new Date().toISOString(),
  };
}

export function describeWeatherCode(code) {
  if (code == null || code === "") return "Weather condition not available";
  const descriptions = new Map([
    [0, "Clear sky"], [1, "Mainly clear"], [2, "Partly cloudy"], [3, "Overcast"],
    [45, "Fog"], [48, "Rime fog"], [51, "Light drizzle"], [53, "Drizzle"], [55, "Dense drizzle"],
    [56, "Freezing drizzle"], [57, "Dense freezing drizzle"], [61, "Light rain"], [63, "Rain"], [65, "Heavy rain"],
    [66, "Freezing rain"], [67, "Heavy freezing rain"], [71, "Light snow"], [73, "Snow"], [75, "Heavy snow"],
    [77, "Snow grains"], [80, "Light rain showers"], [81, "Rain showers"], [82, "Violent rain showers"],
    [85, "Snow showers"], [86, "Heavy snow showers"], [95, "Thunderstorm"], [96, "Thunderstorm with hail"], [99, "Thunderstorm with heavy hail"],
  ]);
  return descriptions.get(Number(code)) ?? "Weather condition not available";
}
