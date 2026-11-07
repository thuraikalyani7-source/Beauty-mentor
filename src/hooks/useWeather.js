import { useCallback, useEffect, useRef, useState } from "react";
import { getCurrentWeather } from "../services/weatherService.js";

function samePlace(first, second) {
  return first?.latitude === second?.latitude && first?.longitude === second?.longitude;
}

export const WEATHER_STALE_AFTER_MS = 30 * 60 * 1000;

export function useWeather() {
  const [weatherState, setWeatherState] = useState({
    data: null,
    requestedPlace: null,
    status: "idle",
    error: "",
  });
  const requestNumber = useRef(0);

  useEffect(() => {
    if (weatherState.status !== "success" || !weatherState.data?.fetchedAt) return undefined;
    const fetchedAt = Date.parse(weatherState.data.fetchedAt);
    if (!Number.isFinite(fetchedAt)) return undefined;
    const markStale = () => setWeatherState((current) => current.status === "success" && current.data === weatherState.data
      ? { ...current, status: "stale" }
      : current);
    const delay = fetchedAt + WEATHER_STALE_AFTER_MS - Date.now();
    if (delay <= 0) {
      markStale();
      return undefined;
    }
    const timer = window.setTimeout(markStale, delay);
    return () => window.clearTimeout(timer);
  }, [weatherState.data, weatherState.status]);

  const loadWeather = useCallback(async (place) => {
    const requestId = ++requestNumber.current;
    setWeatherState((current) => ({
      data: samePlace(current.data?.place, place) ? current.data : null,
      requestedPlace: place,
      status: "loading",
      error: "",
    }));

    try {
      const data = await getCurrentWeather(place);
      if (requestId === requestNumber.current) {
        setWeatherState({ data, requestedPlace: place, status: "success", error: "" });
      }
      return data;
    } catch (error) {
      if (requestId === requestNumber.current) {
        setWeatherState((current) => ({
          ...current,
          requestedPlace: place,
          status: "error",
          error: error instanceof TypeError
            ? "Could not connect to the weather service. Check your internet connection and try again."
            : error instanceof Error ? error.message : "Weather could not be retrieved. Please try again.",
        }));
      }
      return null;
    }
  }, []);

  const refreshWeather = useCallback(() => {
    if (weatherState.requestedPlace) return loadWeather(weatherState.requestedPlace);
    return Promise.resolve(null);
  }, [loadWeather, weatherState.requestedPlace]);

  return { ...weatherState, loadWeather, refreshWeather };
}
