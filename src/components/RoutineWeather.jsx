import { buildWeatherTips } from "../data/weatherTips.js";
import { describeWeatherCode } from "../services/weatherService.js";
import WeatherLocationPicker from "./WeatherLocationPicker.jsx";

function formatValue(value, unit = "", digits = 0) {
  if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value))) return null;
  return `${Number(value).toFixed(digits)}${unit}`;
}

function placeName(place) {
  if (place?.name === "My location") return "My location · approximate area";
  return [place?.name, place?.admin1, place?.country].filter(Boolean).join(", ") || "Selected location";
}

export default function RoutineWeather({ weatherState, onLoadWeather, onRefreshWeather, profile }) {
  const weather = weatherState.data;
  const isCurrent = weatherState.status === "success" && Boolean(weather?.current);
  const tips = isCurrent ? buildWeatherTips(weather.current, {
    experience: profile.skincareExperience,
    lifestyle: profile.lifestyle,
    concerns: profile.selectedConcerns,
    sensitive: profile.sensitive,
  }).filter((tip) => tip.id !== "sensitivity-reminder" && (tip.id !== "frizz-humidity" || profile.selectedArea === "Hair")) : [];
  const current = weather?.current;
  const fields = [
    ["Temperature", formatValue(current?.temperature_2m, "°C", 1)],
    ["Feels like", formatValue(current?.apparent_temperature, "°C", 1)],
    ["Humidity", formatValue(current?.relative_humidity_2m, "%")],
    ["UV index", formatValue(current?.uv_index, "", 1)],
    ["Wind", formatValue(current?.wind_speed_10m, " km/h", 1)],
  ].filter(([, value]) => value !== null);

  return (
    <section className="routine-weather" aria-labelledby="routine-weather-title">
      <header className="routine-weather-heading">
        <div><p className="tagline">TODAY’S CONDITIONS</p><h2 id="routine-weather-title">Weather and your routine</h2><p>Weather suggestions use the same Open-Meteo readings and reviewed rules as Weather Tips. Your regular concern-based routine remains available either way.</p></div>
        {weatherState.requestedPlace && <button type="button" className="secondary-product-button" onClick={onRefreshWeather} disabled={weatherState.status === "loading"}>{weatherState.status === "loading" ? "Refreshing…" : weather ? "↻ Refresh" : "Try again"}</button>}
      </header>
      <WeatherLocationPicker compact onLoadWeather={onLoadWeather} disabled={weatherState.status === "loading"} />
      {weatherState.status === "loading" && <p className="routine-weather-status" role="status">Getting current weather…</p>}
      {weatherState.status === "stale" && <p className="routine-weather-status" role="status">This reading is more than 30 minutes old. Refresh for current conditions; weather-adjusted advice is paused until then.</p>}
      {weatherState.status === "error" && <p className="routine-weather-error" role="alert">{weatherState.error} Weather-based adjustments are paused; your ordinary routine is still available.{weather && ` Last successful reading: ${weather.current.time || weather.fetchedAt}.`}</p>}
      {weather && current && <>
        <div className="routine-weather-current">
          <div><strong>{placeName(weather.place)}</strong><span>{describeWeatherCode(current.weather_code)} · Provider time: {current.time || "Not available"}</span>{weather.fetchedAt && <span>Retrieved: {new Date(weather.fetchedAt).toLocaleString()}</span>}</div>
          <div className="routine-weather-metrics">{fields.length ? fields.map(([label, value]) => <span key={label}><b>{label}:</b> {value}</span>) : <span>Weather measurements are not available.</span>}</div>
        </div>
        <section className="routine-weather-tips" aria-labelledby="routine-weather-tips-title">
          <h3 id="routine-weather-tips-title">Weather-adjusted guidance</h3>
          <p>These suggestions are separate from your selected-concern guidance and appear only for weather values returned by the provider.</p>
          {weatherState.status === "success" ? (tips.length ? <ul>{tips.map((tip) => <li key={tip.id}><strong>{tip.title}</strong><p>{tip.reason}</p><p>{tip.advice}</p>{tip.id === "sun-protection" && current.uv_index != null && Number(current.uv_index) >= 3 && <a href="https://www.aad.org/public/everyday-care/sun-protection/shade-clothing-sunscreen/how-to-apply-sunscreen" target="_blank" rel="noreferrer">American Academy of Dermatology sunscreen guidance</a>}</li>)}</ul> : <p>No weather-specific adjustment is available for the selected area and concerns.</p>) : <p>Weather adjustments are paused until the reading is refreshed successfully.</p>}
        </section>
      </>}
      {weatherState.status === "idle" && <p className="routine-weather-status">Choose a city or optionally use your location to see live conditions and relevant weather guidance. No location is assumed.</p>}
      <p className="routine-weather-disclaimer">Weather alone does not explain a skin or hair concern. These are general comfort suggestions, not a diagnosis or treatment plan.</p>
    </section>
  );
}
