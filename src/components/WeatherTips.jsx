import { buildWeatherTips } from "../data/weatherTips.js";
import { describeWeatherCode } from "../services/weatherService.js";
import WeatherLocationPicker from "./WeatherLocationPicker.jsx";

const formatValue = (value, unit, digits = 0) => value == null || value === "" || !Number.isFinite(Number(value))
  ? "Not available"
  : `${Number(value).toFixed(digits)}${unit}`;

function weatherIcon(code) {
  if (code == null || code === "") return "☼";
  const value = Number(code);
  if ([0, 1].includes(value)) return "☀";
  if ([2, 3, 45, 48].includes(value)) return "☁";
  if (value >= 51 && value <= 67 || value >= 80 && value <= 82) return "☂";
  if (value >= 71 && value <= 86) return "❄";
  if (value >= 95) return "ϟ";
  return "☼";
}

export default function WeatherTips({ onBack, profile, weatherState, onLoadWeather, onRefreshWeather }) {
  const { data: weather, requestedPlace, status: weatherStatus, error: weatherError } = weatherState;

  const context = {
    experience: profile.skincareExperience,
    lifestyle: profile.lifestyle,
    concerns: profile.selectedConcerns,
    sensitive: profile.sensitive,
  };
  const tips = buildWeatherTips(weatherStatus === "success" ? weather?.current : null, context);

  const current = weather?.current;
  const activePlace = weather?.place ?? requestedPlace;
  const placeLabel = activePlace?.name === "My location"
    ? "My location · approximate area"
    : [activePlace?.name, activePlace?.admin1, activePlace?.country].filter(Boolean).join(", ");

  return (
    <div className="app">
      <nav className="navbar weather-navbar">
        <div className="logo">✦ Beauty Mentor</div>
        <button type="button" className="nav-text-button" onClick={onBack}>← Back to dashboard</button>
      </nav>
      <main className="weather-page">
        <header className="weather-heading">
          <p className="tagline">A LITTLE CARE FOR TODAY’S CONDITIONS</p>
          <h1>Weather <span>Tips</span></h1>
          <p>See current conditions and gentle, practical ideas based on the weather. This is general information, not a skin diagnosis.</p>
        </header>

        <WeatherLocationPicker onLoadWeather={onLoadWeather} disabled={weatherStatus === "loading"} />

        <section className="weather-current-panel" aria-labelledby="current-weather-heading" aria-live="polite">
          <div className="weather-current-top"><div><p className="tagline">CURRENT CONDITIONS</p><h2 id="current-weather-heading">{placeLabel || "Your local weather"}</h2></div>
            {requestedPlace && <button type="button" className="secondary-product-button" onClick={onRefreshWeather} disabled={weatherStatus === "loading"}>{weatherStatus === "loading" ? "Refreshing…" : "↻ Refresh"}</button>}
          </div>
          {weatherStatus === "loading" && <div className="weather-loading" role="status"><span className="weather-loading-mark" aria-hidden="true">☼</span><p>Getting current weather…</p></div>}
          {weatherStatus === "error" && !weather && <div className="weather-error" role="alert"><h3>Weather is unavailable right now</h3><p>{weatherError}</p><button type="button" className="secondary-product-button" onClick={onRefreshWeather} disabled={!requestedPlace}>Try again</button><p>You can also search for another city or use the general tips below.</p></div>}
          {weatherStatus === "idle" && <div className="weather-empty"><span aria-hidden="true">☁</span><p>Choose a city to see its real current weather. General care tips are available below while you decide.</p></div>}
          {weatherStatus === "stale" && <p className="weather-status-message" role="status">This reading is more than 30 minutes old. Refresh to retrieve current conditions; tips below are general until then.</p>}
          {weatherStatus === "error" && weather && <p className="weather-status-message" role="alert">{weatherError} Showing the last successful reading; weather-based tips below use general reminders until you refresh successfully.</p>}
          {weather && current && <>
            {weatherStatus === "loading" && <p className="weather-status-message" role="status">Refreshing; showing the last successful reading until updated.</p>}
            <div className="weather-condition"><span className="weather-condition-icon" aria-hidden="true">{weatherIcon(current.weather_code)}</span><div><strong>{describeWeatherCode(current.weather_code)}</strong><span>Weather data time: {current.time || "Not available"}{weather.timezone ? ` · ${weather.timezone}` : ""}</span></div></div>
            <div className="weather-metric-grid">
              <article><span>Temperature</span><strong>{formatValue(current.temperature_2m, "°C", 1)}</strong></article>
              <article><span>Feels like</span><strong>{formatValue(current.apparent_temperature, "°C", 1)}</strong></article>
              <article><span>Humidity</span><strong>{formatValue(current.relative_humidity_2m, "%")}</strong></article>
              <article><span>UV index</span><strong>{formatValue(current.uv_index, "", 1)}</strong></article>
              <article><span>Wind speed</span><strong>{formatValue(current.wind_speed_10m, " km/h", 1)}</strong></article>
            </div>
            <p className="weather-provider-note">Weather data by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo.com</a> · Forecast data is provided as-is and may be incomplete. The free API is for non-commercial use; a future commercial release would need an appropriate provider plan. See <a href="https://open-meteo.com/en/terms" target="_blank" rel="noreferrer">provider terms</a>.</p>
          </>}
        </section>

        <section className="weather-tips-section" aria-labelledby="weather-tips-heading">
          <div className="weather-section-heading"><p className="tagline">GENTLE, PRACTICAL IDEAS</p><h2 id="weather-tips-heading">{weatherStatus === "success" ? "Tips for these conditions" : "General care reminders"}</h2><p>{weatherStatus === "success" ? "Each suggestion explains which reported weather value triggered it." : "These are general tips, not live-weather recommendations."}</p></div>
          <div className="weather-tip-grid">{tips.map((tip) => <article className="weather-tip-card" key={tip.id}><span className="weather-tip-icon" aria-hidden="true">✿</span><div><h3>{tip.title}</h3><p className="weather-tip-reason">{tip.reason}</p><p>{tip.advice}</p></div></article>)}</div>
          {weatherStatus === "success" && weather?.current?.uv_index != null && Number(weather.current.uv_index) >= 3 && <p className="weather-source-note">Sun protection reminder source: <a href="https://www.aad.org/public/everyday-care/sun-protection/shade-clothing-sunscreen/how-to-apply-sunscreen" target="_blank" rel="noreferrer">American Academy of Dermatology sunscreen guidance</a>.</p>}
        </section>
        <p className="weather-disclaimer">Weather-based suggestions are general comfort ideas, not medical advice. Weather alone does not explain a skin or hair concern.</p>
      </main>
      <footer><p>© 2026 Beauty Mentor</p><p>For educational purposes only — not medical advice.</p></footer>
    </div>
  );
}
