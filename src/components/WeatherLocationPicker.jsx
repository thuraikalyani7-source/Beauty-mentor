import { useState } from "react";
import { searchCities } from "../services/weatherService.js";

function getLocationError(error) {
  if (error.code === 1) return "Location permission was denied. You can still search for a city manually.";
  if (error.code === 2) return "Your location could not be determined. Please search for a city manually.";
  if (error.code === 3) return "Location lookup timed out. Please try again or search for a city manually.";
  return "Your browser could not provide a location. Please search for a city manually.";
}

export default function WeatherLocationPicker({ onLoadWeather, disabled = false, compact = false }) {
  const [cityQuery, setCityQuery] = useState("");
  const [matches, setMatches] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");

  const submitCitySearch = async (event) => {
    event.preventDefault();
    const query = cityQuery.trim();
    if (!query) {
      setSearchMessage("Enter a city name to search.");
      setMatches([]);
      return;
    }
    setSearching(true);
    setSearchMessage("");
    setMatches([]);
    try {
      const results = await searchCities(query);
      setMatches(results);
      setSearchMessage(results.length ? "Choose the matching city to load its current weather." : "No matching cities were found. Check the spelling or add a country name.");
    } catch (error) {
      setSearchMessage(error instanceof TypeError
        ? "Could not connect to city search. Check your internet connection and try again."
        : error instanceof Error ? error.message : "City search failed. Check your connection and try again.");
    } finally {
      setSearching(false);
    }
  };

  const useMyLocation = () => {
    setLocationMessage("");
    if (!navigator.geolocation) {
      setLocationMessage("This browser does not support location access. You can search for a city manually.");
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const place = { name: "My location", admin1: "", country: "", latitude: coords.latitude, longitude: coords.longitude, timezone: "" };
      await onLoadWeather(place);
      setMatches([]);
      setSearchMessage("");
      setLocationMessage("");
      setLocationLoading(false);
    }, (error) => {
      setLocationMessage(getLocationError(error));
      setLocationLoading(false);
    }, { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 });
  };

  const loadPlace = async (place) => {
    await onLoadWeather(place);
    setMatches([]);
    setSearchMessage("");
    setLocationMessage("");
  };

  return (
    <section className={`weather-location-panel${compact ? " weather-location-panel-compact" : ""}`} aria-labelledby={compact ? "routine-weather-location-title" : "weather-location-title"}>
      <div><h2 id={compact ? "routine-weather-location-title" : "weather-location-title"}>Choose a city</h2><p>Search by city name, or optionally use your device location. Location is requested only when you press the button.</p></div>
      <form className="weather-city-form" onSubmit={submitCitySearch}>
        <label htmlFor={compact ? "routine-weather-city" : "weather-city"}>City name</label>
        <div className="weather-city-controls"><input id={compact ? "routine-weather-city" : "weather-city"} value={cityQuery} onChange={(event) => setCityQuery(event.target.value)} placeholder="For example, Mumbai" autoComplete="address-level2" /><button className="next-step-button" type="submit" disabled={disabled || searching || locationLoading}>{searching ? "Searching…" : "Search city"}</button></div>
      </form>
      <button type="button" className="secondary-product-button weather-location-button" onClick={useMyLocation} disabled={disabled || locationLoading || searching}>{locationLoading ? "Finding location…" : "Use my location"}</button>
      <p className="weather-privacy-note">Your location is used to request weather from Open-Meteo. The app does not continuously track or save precise coordinates. You can use city search instead.</p>
      {searchMessage && <p className="weather-status-message" role="status">{searchMessage}</p>}
      {locationMessage && <p className="weather-status-message" role="status">{locationMessage}</p>}
      {matches.length > 0 && <div className="weather-city-results" role="group" aria-label="Matching cities">{matches.map((place) => <button type="button" className="weather-city-result" key={place.id} onClick={() => loadPlace(place)} disabled={disabled}><strong>{place.name}</strong><span>{[place.admin1, place.country].filter(Boolean).join(", ")}</span></button>)}</div>}
    </section>
  );
}
