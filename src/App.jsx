import { useEffect, useMemo, useState } from "react";
import AnimeGirlMap from "./components/AnimeGirlMap.jsx";
import AnimeBoyMap from "./components/AnimeBoyMap.jsx";
import BeautyJourney from "./components/BeautyJourney.jsx";
import BeautyAssistant from "./components/BeautyAssistant.jsx";
import AuthPage from "./components/AuthPage.jsx";
import ProductExplorer from "./components/ProductExplorer.jsx";
import WeatherTips from "./components/WeatherTips.jsx";
import { supabase } from "./services/supabaseClient.js";
import { useWeather } from "./hooks/useWeather.js";
import { buildGuidance } from "./data/guidanceData.js";
import { AGE_RANGES, BUDGET_OPTIONS, LIFESTYLE_OPTIONS, SKINCARE_EXPERIENCES, loadProfile, saveProfile } from "./data/profileStorage.js";
import { buildRoutine } from "./data/routineBuilder.js";

const concerns = {
  Hair: [
    "Hair Fall",
    "Dandruff",
    "Frizzy Hair",
    "Dry Hair",
    "Oily Scalp",
    "Split Ends",
    "Hair Breakage",
    "Rough or Tangled Hair",
    "Oily Hair",
    "Lack of Shine",
    "Dry Scalp",
    "Itchy Scalp",
    "Scalp Sensitivity",
    "Product Buildup",
    "Persistent Scalp Redness or Irritation",
  ],
  Face: [
    "Acne",
    "Acne Scars",
    "Dark Spots",
    "Pigmentation",
    "Dullness",
    "Large Pores",
    "Redness",
    "Uneven Texture",
    "Oily Skin",
    "Dry Skin",
    "Sensitivity",
  ],
  Eyes: [
    "Dark Circles",
    "Puffiness",
    "Dryness",
    "Fine Lines",
    "Tired-Looking Eyes",
    "Sensitive or Irritated Eyelid Skin",
  ],
  Eyebrows: [
    "Sparse brows",
    "Uneven shape",
    "Dry skin",
    "Irritation",
  ],
  Eyelashes: [
    "Sparse lashes",
    "Brittle lashes",
    "Lash care",
    "Sensitivity",
  ],
  Nose: [
    "Blackheads",
    "Visible pores",
    "Redness",
    "Dryness",
    "Uneven tone",
  ],
  Cheeks: [
    "Acne",
    "Dark spots",
    "Redness",
    "Dryness",
    "Uneven texture",
  ],
  Ears: [
    "Dryness",
    "Dark spots",
    "Uneven tone",
    "Sensitivity",
  ],
  Lips: [
    "Dark Lips",
    "Dry Lips",
    "Pigmentation",
    "Chapped Lips",
    "Flaking",
    "Cracked Lips",
    "Lip Sensitivity or Irritation",
    "Lip Texture Concerns",
  ],
  Neck: [
    "Dark Neck",
    "Pigmentation",
    "Dryness",
    "Uneven Skin Tone",
    "Rough Texture",
    "General Body Skin Care",
  ],
  Shoulders: [
    "Acne",
    "Body Acne",
    "Dark Spots",
    "Pigmentation",
    "Dryness",
    "Friction/Chafing",
    "General Body Skin Care",
  ],
  Arms: [
    "Uneven Skin Tone",
    "Dark Spots",
    "Dryness",
    "Keratosis Pilaris",
    "Rough Texture",
    "General Body Skin Care",
  ],
  Underarms: [
    "Dark Underarms",
    "Pigmentation",
    "Odour Care",
    "Dryness",
    "Ingrown Hairs",
    "Friction/Chafing",
    "General Body Skin Care",
  ],
  Hands: [
    "Dryness",
    "Dark Spots",
    "Uneven Tone",
    "Rough Skin",
    "Hand Hygiene",
    "Pigmentation",
    "General Body Skin Care",
  ],
  Nails: [
    "Brittle Nails",
    "Dry Cuticles",
    "Nail Care",
    "Uneven Nails",
    "Peeling Nails",
    "Nail Breakage",
    "Nail Staining",
    "Press-on/Product Precautions",
  ],
  Fingernails: [
    "Brittle nails",
    "Dry cuticles",
    "Nail care",
    "Uneven nails",
    "Peeling Nails",
    "Nail Breakage",
    "Nail Staining",
    "Press-on/Product Precautions",
  ],
  Chest: [
    "Acne",
    "Body Acne",
    "Dark Spots",
    "Pigmentation",
    "Dryness",
    "Friction/Chafing",
    "General Body Skin Care",
  ],
  Abdomen: [
    "Stretch Marks",
    "Dryness",
    "Uneven Skin Tone",
    "Friction/Chafing",
    "General Body Skin Care",
  ],
  Back: [
    "Back Acne",
    "Dark Spots",
    "Uneven Texture",
    "Dryness",
    "Friction/Chafing",
    "General Body Skin Care",
  ],
  Hips: [
    "Dryness",
    "Dark Spots",
    "Uneven Skin Tone",
    "Stretch Marks",
    "Friction/Chafing",
    "General Body Skin Care",
  ],
  Thighs: [
    "Dryness",
    "Uneven Texture",
    "Stretch Marks",
    "Dark Spots",
    "Friction/Chafing",
    "General Body Skin Care",
  ],
  Legs: [
    "Dryness",
    "Uneven Skin Tone",
    "Dark Spots",
    "Rough Skin",
    "Ingrown Hairs",
    "General Body Skin Care",
  ],
  Knees: [
    "Dark Knees",
    "Dryness",
    "Rough Skin",
    "Pigmentation",
    "General Body Skin Care",
  ],
  Feet: [
    "Dry Feet",
    "Cracked Skin",
    "Dark Spots",
    "Rough Skin",
    "Foot Hygiene",
    "Foot Odor/Sweating",
    "Friction Blisters",
    "Rough Heels",
    "General Body Skin Care",
  ],
  Toes: [
    "Nail Care",
    "Dryness",
    "Dark Spots",
    "Rough Skin",
    "Foot Hygiene",
    "Foot Odor/Sweating",
    "Friction Blisters",
  ],
  Toenails: [
    "Brittle Nails",
    "Dry Cuticles",
    "Nail Care",
    "Uneven Nails",
    "Peeling Nails",
    "Nail Breakage",
    "Nail Staining",
  ],
};

const maleFaceFeatures = [
  ["Ears", "M153 111 Q145 108 146 122 Q148 134 158 135 L160 128 Z M247 111 Q255 108 254 122 Q252 134 242 135 L240 128 Z", "#d18a68"],
  ["Eyebrows", "M174 108 L196 106 L197 111 L175 113 Z M204 106 L226 108 L225 113 L203 111 Z", "#392b29"],
  ["Eyes", "M177 118 Q186 113 196 118 Q188 124 178 122 Z M204 118 Q214 113 223 118 Q222 122 212 124 Z", "#fff8f4"],
  ["Eyelashes", "M176 118 Q186 112 197 117 L196 119 Q186 115 177 120 Z M203 117 Q214 112 224 118 L223 120 Q214 115 204 119 Z", "#392b29"],
  ["Cheeks", "M174 130 Q180 128 186 130 M214 130 Q220 128 226 130", "none", "#c78262"],
  ["Nose", "M198 119 Q196 129 198 134 Q201 137 204 133 Q201 134 200 132 L202 120 Z", "#bd785e"],
  ["Lips", "M193 144 Q200 146 207 144", "none", "#80584b"],
];

const ROUTINE_KEY = "beauty-mentor-proposed-routine";
const ROUTE_HASHES = {
  journey: "#beauty-journey",
  productExplorer: "#product-explorer",
  routine: "#my-routine",
  assistant: "#beauty-assistant",
};
const ROUTE_PAGES = Object.fromEntries(Object.entries(ROUTE_HASHES).map(([page, hash]) => [hash, page]));
const pageFromHash = (hash) => ROUTE_PAGES[hash] ?? null;
function readSavedRoutine() {
  try {
    const saved = JSON.parse(localStorage.getItem(ROUTINE_KEY) || "{}");
    return {
      morning: Array.isArray(saved.morning) ? saved.morning : [],
      evening: Array.isArray(saved.evening) ? saved.evening : [],
    };
  } catch {
    return { morning: [], evening: [] };
  }
}

function App() {
  const [page, setPage] = useState("dashboard");
  const [launchFinished, setLaunchFinished] = useState(false);
  const [guestMode, setGuestMode] = useState(false);
  const [authStatus, setAuthStatus] = useState(supabase ? "loading" : "unconfigured");
  const [authSession, setAuthSession] = useState(null);
  const [authNotice, setAuthNotice] = useState("");
  const [profile, setProfile] = useState(() => loadProfile(concerns));
  const generatedRoutine = useMemo(() => buildRoutine(profile), [profile]);
  const userPreferences = profile.onboardingComplete ? profile : null;
  const { selectedArea, selectedConcerns, lifestyle: selectedLifestyle, budget: selectedBudget } = profile;
  const [onboardingDraft, setOnboardingDraft] = useState(() => ({ ageRange: profile.ageRange, skincareExperience: profile.skincareExperience }));
  const [gender, setGender] = useState("female");
  const [bodyView, setBodyView] = useState("anime");
  const [routine, setRoutine] = useState(readSavedRoutine);
  const [productSearchSeed, setProductSearchSeed] = useState("");
  const weatherState = useWeather();

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLaunchFinished(true), 4000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!supabase) return undefined;

    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active || event === "INITIAL_SESSION") return;
      if (event === "SIGNED_OUT" || !session) {
        setAuthSession(null);
        setAuthStatus("signed-out");
        setPage("login");
        if (pageFromHash(window.location.hash)) {
          window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
        }
        return;
      }
      setAuthSession(session);
      setAuthStatus("authenticated");
      setAuthNotice("");
      if (event === "SIGNED_IN") setPage("dashboard");
    });

    const restoreSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!active) return;
        if (error) {
          const invalidSession = [400, 401, 403].includes(error.status);
          if (invalidSession) await supabase.auth.signOut({ scope: "local" });
          if (!active) return;
          setAuthSession(null);
          setAuthStatus(invalidSession ? "signed-out" : "error");
          setAuthNotice(invalidSession ? "Your saved session expired. Please log in again." : "We couldn’t verify your saved session. Check your connection and log in again.");
          return;
        }
        if (!data.session) {
          setAuthSession(null);
          setAuthStatus("signed-out");
          return;
        }

        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (!active) return;
        if (userError || !userData.user) {
          const invalidSession = [400, 401, 403].includes(userError?.status);
          if (invalidSession) await supabase.auth.signOut({ scope: "local" });
          if (!active) return;
          setAuthSession(null);
          setAuthStatus(invalidSession ? "signed-out" : "error");
          setAuthNotice(invalidSession ? "Your saved session is no longer valid. Please log in again." : "We couldn’t verify your saved session. Check your connection and log in again.");
          return;
        }

        setAuthSession(data.session);
        setAuthStatus("authenticated");
        setAuthNotice("");
      } catch {
        if (!active) return;
        setAuthSession(null);
        setAuthStatus("error");
        setAuthNotice("We couldn’t verify your saved session. Check your connection and log in again.");
      }
    };

    void restoreSession();
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const syncPageFromUrl = () => {
      if (!guestMode && (authStatus !== "authenticated" || !authSession)) {
        setPage("login");
        return;
      }
      const nextPage = pageFromHash(window.location.hash) ?? (userPreferences ? "dashboard" : "onboarding");
      if (nextPage !== "productExplorer") setProductSearchSeed("");
      setPage(nextPage);
    };
    window.addEventListener("popstate", syncPageFromUrl);
    window.addEventListener("hashchange", syncPageFromUrl);
    return () => {
      window.removeEventListener("popstate", syncPageFromUrl);
      window.removeEventListener("hashchange", syncPageFromUrl);
    };
  }, [userPreferences, authStatus, authSession, guestMode]);

  useEffect(() => {
    try {
      localStorage.setItem(ROUTINE_KEY, JSON.stringify(routine));
    } catch {
      // The proposed routine remains usable for this session if storage is unavailable.
    }
  }, [routine]);

  const updateProfileField = (field, value) => {
    setProfile((previous) => ({ ...previous, [field]: value }));
  };

  const setAgeRange = (value) => setOnboardingDraft((previous) => ({ ...previous, ageRange: value }));
  const setSkincareExperience = (value) => setOnboardingDraft((previous) => ({ ...previous, skincareExperience: value }));
  const setSelectedBudget = (value) => updateProfileField("budget", value);

  const savePreferences = (overrides = {}) => {
    setProfile((previous) => ({
      ...previous,
      ageRange: overrides.ageRange ?? onboardingDraft.ageRange ?? "Prefer not to say",
      skincareExperience: overrides.skincareExperience ?? onboardingDraft.skincareExperience ?? "I'm new to skincare.",
      onboardingComplete: true,
    }));
    setPage("dashboard");
  };

  const selectArea = (area) => {
    setProfile((previous) => ({ ...previous, selectedArea: area, selectedConcerns: [] }));
  };

  const handleAreaKeyDown = (event, area) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectArea(area);
    }
  };

  const toggleConcern = (concern) => {
    setProfile((previous) => ({
      ...previous,
      selectedConcerns: previous.selectedConcerns.includes(concern)
        ? previous.selectedConcerns.filter((item) => item !== concern)
        : [...previous.selectedConcerns, concern],
    }));
  };

  const toggleLifestyle = (item) => {
    setProfile((previous) => {
      const lifestyle = previous.lifestyle.includes(item)
        ? previous.lifestyle.filter((choice) => choice !== item)
        : [...previous.lifestyle, item];
      return { ...previous, lifestyle, sensitive: lifestyle.includes("Sensitive to products") };
    });
  };

  const openRoutedPage = (nextPage) => {
    const hash = ROUTE_HASHES[nextPage];
    if (!hash) return;
    if (nextPage !== "productExplorer") setProductSearchSeed("");
    if (window.location.hash !== hash) {
      window.history.pushState({ beautyMentorPage: nextPage }, "", `${window.location.pathname}${window.location.search}${hash}`);
    }
    setPage(nextPage);
  };

  const leaveRoutedPage = () => {
    setProductSearchSeed("");
    if (pageFromHash(window.location.hash)) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
    setPage("dashboard");
  };

  const signOut = async () => {
    if (guestMode) {
      setGuestMode(false);
      setPage("login");
      return;
    }
    if (!supabase) return;
    setAuthNotice("");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) setAuthNotice("Sign out could not be completed. Please try again.");
    } catch {
      setAuthNotice("Sign out could not be completed. Please try again.");
    }
  };

  const openBeautyJourney = () => openRoutedPage("journey");

  if (!launchFinished) {
    return (
      <div className="app launch-screen">
        <main className="launch-content" aria-live="polite">
          <div className="launch-mark" aria-hidden="true">✦</div>
          <p className="launch-kicker">A GENTLER WAY TO EXPLORE WELLNESS</p>
          <h1>Beauty <span>Mentor</span></h1>
          <p>Thoughtful, educational guidance for your beauty journey.</p>
          <button className="start-button" onClick={() => setLaunchFinished(true)}>
            {authStatus === "authenticated" ? "Open your dashboard →" : "Continue →"}
          </button>
        </main>
      </div>
    );
  }

  if (authStatus === "loading") {
    return <div className="app auth-loading" role="status" aria-live="polite">Restoring your Beauty Mentor session…</div>;
  }

  if (!guestMode && (authStatus !== "authenticated" || !authSession)) {
    return (
      <AuthPage
        supabase={supabase}
        notice={authNotice}
        onGuestAccess={() => {
          setGuestMode(true);
          setPage(userPreferences ? "dashboard" : "onboarding");
        }}
      />
    );
  }

  if (page === "onboarding" || page === "preferences") {
    const isEditing = page === "preferences";
    return (
      <div className="app">
        <nav className="navbar">
          <div className="logo">✦ Beauty Mentor</div>
          {isEditing && <button className="nav-text-button" onClick={() => setPage("dashboard")}>Back to dashboard</button>}
        </nav>
        <main className="body-page onboarding-page">
          <p className="tagline">{isEditing ? "YOUR PREFERENCES" : "WELCOME TO BEAUTY MENTOR"}</p>
          <h1 className="onboarding-title">A little about <span>your journey.</span></h1>
          <p className="onboarding-intro">Choose an age range and your skincare experience. These are optional preferences—not a diagnosis or a request for your birth date.</p>

          <section className="preference-panel onboarding-panel" aria-label="Your preferences">
            <fieldset>
              <legend>Which age range fits you?</legend>
              <div className="onboarding-options">
                {AGE_RANGES.map((option) => <button type="button" key={option} aria-pressed={onboardingDraft.ageRange === option} className={`preference-option ${onboardingDraft.ageRange === option ? "preference-selected" : ""}`} onClick={() => setAgeRange(option)}>{onboardingDraft.ageRange === option ? "✓ " : ""}{option}</button>)}
              </div>
              <button type="button" className="skip-age-button" onClick={() => setAgeRange("Prefer not to say")}>Skip the age question</button>
            </fieldset>

            <fieldset>
              <legend>What best describes your skincare experience?</legend>
              <div className="onboarding-options">
                {SKINCARE_EXPERIENCES.map((option) => <button type="button" key={option} aria-pressed={onboardingDraft.skincareExperience === option} className={`preference-option ${onboardingDraft.skincareExperience === option ? "preference-selected" : ""}`} onClick={() => setSkincareExperience(option)}>{onboardingDraft.skincareExperience === option ? "✓ " : ""}{option}</button>)}
              </div>
            </fieldset>
            {(onboardingDraft.ageRange === "Under 13" || onboardingDraft.ageRange === "13–17 years") && <p className="age-safety-note" role="note">This guide is general education. Younger users should keep care simple and talk with a trusted adult or qualified professional before trying strong or medicated products.</p>}
            <p className="onboarding-privacy">Your preferences are saved only in this browser. You can change them later in the dashboard.</p>
            <button className="next-step-button" disabled={!onboardingDraft.ageRange || !onboardingDraft.skincareExperience} onClick={savePreferences}>{isEditing ? "Save preferences" : "Continue to your dashboard →"}</button>
          </section>
          {!isEditing && <button className="text-link-button" onClick={() => savePreferences({ ageRange: "Prefer not to say", skincareExperience: onboardingDraft.skincareExperience || "I'm new to skincare." })}>Continue with general guidance</button>}
        </main>
        <footer><p>© 2026 Beauty Mentor</p><p>For educational purposes only — not medical advice.</p></footer>
      </div>
    );
  }

  if (page === "dashboard") {
    const dashboardFeatures = [
      { icon: "✦", title: "Personalized Beauty Guide", description: "Explore a body area and choose the concerns you want to learn about.", action: () => setPage("body") },
      { icon: "♡", title: "My Routine", description: "Review products you have added to your proposed morning and evening routines.", action: () => openRoutedPage("routine") },
      { icon: "⌕", title: "Product Explorer", description: "Search the Open Beauty Facts catalogue and review available product details.", action: () => openRoutedPage("productExplorer") },
      { icon: "✿", title: "Beauty Journey", description: "Keep a private journal, record optional photos, and reflect on routine check-ins.", action: openBeautyJourney },
      { icon: "☼", title: "Weather Tips", description: "Check current conditions for a city and get gentle, weather-aware care ideas.", action: () => setPage("weatherTips") },
      { icon: "◌", title: "Beauty Mentor AI Assistant", description: "Ask for general beauty and skincare education. The AI service is not configured yet.", action: () => openRoutedPage("assistant") },
    ];
    return (
      <div className="app">
        <nav className="navbar">
          <div className="logo">✦ Beauty Mentor</div>
          <div className="nav-links"><span className="active-nav">Home</span><span onClick={() => setPage("body")}>Beauty Guide</span><button className="nav-text-button" onClick={() => { setOnboardingDraft({ ageRange: profile.ageRange, skincareExperience: profile.skincareExperience }); setPage("preferences"); }}>Preferences</button><button className="nav-text-button" onClick={signOut}>Sign out</button></div>
        </nav>
        <main className="dashboard-page">
          <section className="dashboard-welcome">
            <div><p className="tagline">YOUR PERSONALIZED BEAUTY GUIDE</p><h1>Your Beauty.<br />Your Journey.<br /><span>Your Mentor.</span></h1><p className="description">Explore educational beauty guidance shaped around your concerns, lifestyle, and budget.</p><button className="start-button" onClick={() => setPage("body")}>Start Your Beauty Journey →</button></div>
            <div className="hero-card"><div className="sparkle">✦</div><h2>Beauty Mentor</h2><p>Thoughtful guidance for your skin, hair, nails & more.</p><div className="beauty-items"><div>♡ Skin</div><div>✿ Hair</div><div>◇ Nails</div><div>☼ Lifestyle</div></div></div>
          </section>
          {userPreferences && <p className="dashboard-preference-note">Your preferences: {userPreferences.ageRange} · {userPreferences.skincareExperience} <button className="inline-link-button" onClick={() => setPage("preferences")}>Edit</button></p>}
          {(userPreferences?.ageRange === "Under 13" || userPreferences?.ageRange === "13–17 years") && <p className="age-safety-note dashboard-safety-note" role="note">Your guide stays general and conservative. Talk with a trusted adult or qualified professional before trying strong or medicated products.</p>}
          <section className="dashboard-section"><div className="dashboard-section-heading"><p className="tagline">YOUR WELLNESS SPACE</p><h2>Choose where to begin</h2></div><div className="dashboard-grid">{dashboardFeatures.map((feature) => feature.action ? <button className="dashboard-card dashboard-card-active" key={feature.title} onClick={feature.action}><span className="dashboard-icon" aria-hidden="true">{feature.icon}</span><h3>{feature.title}</h3><p>{feature.description}</p><span className="dashboard-card-link">{feature.title === "Personalized Beauty Guide" ? "Open guide →" : "Open →"}</span></button> : <article className="dashboard-card dashboard-card-coming" key={feature.title}><span className="dashboard-icon" aria-hidden="true">{feature.icon}</span><span className="coming-badge">Coming soon</span><h3>{feature.title}</h3><p>{feature.description}</p></article>)}</div></section>
        </main>
        <footer><p>© 2026 Beauty Mentor</p><p>For educational purposes only — not medical advice.</p></footer>
      </div>
    );
  }

  if (page === "productExplorer" || page === "routine") {
    return <ProductExplorer key={page} onBack={leaveRoutedPage} onTabChange={(tab) => { setProductSearchSeed(""); openRoutedPage(tab === "routine" ? "routine" : "productExplorer"); }} onExploreCategory={(searchTerm) => { setProductSearchSeed(searchTerm); openRoutedPage("productExplorer"); }} routine={routine} setRoutine={setRoutine} generatedRoutine={generatedRoutine} profile={profile} weatherState={weatherState} onLoadWeather={weatherState.loadWeather} onRefreshWeather={weatherState.refreshWeather} initialQuery={page === "productExplorer" ? productSearchSeed : ""} initialTab={page === "routine" ? "routine" : "explore"} />;
  }

  if (page === "assistant") {
    return (
      <BeautyAssistant
        onBack={leaveRoutedPage}
        context={{
          area: profile.selectedArea || undefined,
          concerns: profile.selectedConcerns.length ? profile.selectedConcerns : undefined,
          lifestyle: profile.lifestyle.length ? profile.lifestyle : undefined,
          budget: profile.budget || undefined,
          sensitive: profile.sensitive || undefined,
          weather: {
            status: weatherState.status,
            fetchedAt: weatherState.data?.fetchedAt,
            current: weatherState.data?.current ? {
              temperature_2m: weatherState.data.current.temperature_2m,
              apparent_temperature: weatherState.data.current.apparent_temperature,
              relative_humidity_2m: weatherState.data.current.relative_humidity_2m,
              weather_code: weatherState.data.current.weather_code,
              wind_speed_10m: weatherState.data.current.wind_speed_10m,
              uv_index: weatherState.data.current.uv_index,
              precipitation: weatherState.data.current.precipitation,
            } : undefined,
            units: weatherState.data?.units ? Object.fromEntries(
              ["temperature_2m", "apparent_temperature", "relative_humidity_2m", "weather_code", "wind_speed_10m", "uv_index", "precipitation"]
                .filter((field) => typeof weatherState.data.units[field] === "string")
                .map((field) => [field, weatherState.data.units[field]])
            ) : undefined,
          },
        }}
      />
    );
  }

  if (page === "journey") {
    return <BeautyJourney onBack={leaveRoutedPage} profile={profile} concernsByArea={concerns} routine={routine} />;
  }

  if (page === "weatherTips") {
    return <WeatherTips onBack={() => setPage("dashboard")} profile={profile} weatherState={weatherState} onLoadWeather={weatherState.loadWeather} onRefreshWeather={weatherState.refreshWeather} />;
  }

  if (page === "about") {
    return (
      <div className="app">
        <nav className="navbar"><div className="logo">✦ Beauty Mentor</div><button className="nav-text-button" onClick={() => setPage("dashboard")}>← Close</button></nav>
        <main className="body-page about-page" aria-labelledby="about-heading">
          <p className="tagline">ABOUT BEAUTY MENTOR</p>
          <h1 id="about-heading">Thoughtful guidance for <span>your beauty journey.</span></h1>
          <p>Beauty Mentor is a personalized beauty and skincare guidance tool shaped by the concerns and preferences you choose.</p>
          <section className="preference-panel"><h2>What it offers</h2><ul><li>Profile-based guidance using your selected concerns and preferences.</li><li>Concern selection across different body areas.</li><li>Educational starter routine suggestions.</li><li>Weather-aware tips based on weather you choose to load.</li><li>An AI assistant for general beauty and skincare questions.</li></ul></section>
          <section className="preference-panel"><h2>How to use it</h2><p>Select a body area and concerns, then add lifestyle and budget preferences for your starter guidance. You can also ask the AI Assistant a general question.</p></section>
          <section className="preference-panel"><h2>Important note</h2><p>Advice is educational and is not a medical diagnosis. For persistent or concerning skin issues, seek help from a qualified healthcare professional.</p></section>
          <button className="next-step-button" onClick={() => setPage("dashboard")}>Close</button>
        </main>
        <footer><p>© 2026 Beauty Mentor</p><p>For educational purposes only — not medical advice.</p></footer>
      </div>
    );
  }

  if (page === "lifestyle") {
    return (
      <div className="app">
        <nav className="navbar">
          <div className="logo">✦ Beauty Mentor</div>
          <button className="dashboard-return" onClick={() => setPage("dashboard")}>Dashboard</button>
          <div className="nav-links">
            <span onClick={() => setPage("dashboard")}>Home</span>
            <span className="active-nav">Beauty Journey</span>
            <span role="button" tabIndex={0} onClick={() => setPage("about")} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setPage("about"); }}>About</span>
          </div>
        </nav>

        <main className="body-page">
          <button className="back-button" onClick={() => setPage("body")}>
            ← Back to concerns
          </button>
          <div className="body-heading">
            <p className="tagline">STEP 2 OF YOUR JOURNEY</p>
            <h1>Tell us about <span>your lifestyle.</span></h1>
            <p>These choices can help shape future guidance. Choose any lifestyle details and one budget range.</p>
          </div>

          <section className="preference-panel">
            <h2>Your lifestyle</h2>
            <p>Select any that feel right for you.</p>
            <div className="preference-grid">
              {LIFESTYLE_OPTIONS.map((item) => (
                <button key={item} className={`preference-option ${selectedLifestyle.includes(item) ? "preference-selected" : ""}`} onClick={() => toggleLifestyle(item)}>
                  {selectedLifestyle.includes(item) ? "✓ " : "+ "}{item}
                </button>
              ))}
            </div>

            <h2 className="budget-heading">Your budget</h2>
            <p>Choose a general range for beauty products.</p>
            <div className="preference-grid budget-grid">
              {BUDGET_OPTIONS.map((item) => (
                <button key={item} className={`preference-option ${selectedBudget === item ? "preference-selected" : ""}`} onClick={() => setSelectedBudget(item)}>
                  {selectedBudget === item ? "✓ " : ""}{item}
                </button>
              ))}
            </div>

            <button className="next-step-button" disabled={!selectedBudget} onClick={() => setPage("summary")}>
              Review your selections →
            </button>
          </section>
        </main>
        <footer>
          <p>© 2026 Beauty Mentor</p>
          <p>For educational purposes only — not medical advice.</p>
        </footer>
      </div>
    );
  }

  if (page === "summary") {
    return (
      <div className="app">
        <nav className="navbar">
          <div className="logo">✦ Beauty Mentor</div>
          <button className="dashboard-return" onClick={() => setPage("dashboard")}>Dashboard</button>
          <div className="nav-links">
            <span onClick={() => setPage("dashboard")}>Home</span>
            <span className="active-nav">Beauty Journey</span>
            <span role="button" tabIndex={0} onClick={() => setPage("about")} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setPage("about"); }}>About</span>
          </div>
        </nav>
        <main className="body-page">
          <button className="back-button" onClick={() => setPage("lifestyle")}>← Back to lifestyle</button>
          <div className="body-heading">
            <p className="tagline">YOUR SELECTIONS</p>
            <h1>Your journey <span>starts here.</span></h1>
            <p>Your choices are shown below. Continue to see a simple educational starter guide.</p>
          </div>
          <section className="preference-panel summary-panel">
            <h2>Body area</h2><p>{selectedArea}</p>
            <h2>Your concerns</h2><p>{selectedConcerns.join(", ")}</p>
            <h2>Lifestyle</h2><p>{selectedLifestyle.length ? selectedLifestyle.join(", ") : "No lifestyle choices selected"}</p>
            <h2>Budget</h2><p>{selectedBudget}</p>
            <button className="next-step-button" onClick={() => setPage("body")}>Edit concerns</button>
            <button className="next-step-button secondary-step-button" onClick={() => setPage("plan")}>View my starter guide →</button>
          </section>
        </main>
        <footer>
          <p>© 2026 Beauty Mentor</p>
          <p>For educational purposes only — not medical advice.</p>
        </footer>
      </div>
    );
  }

  if (page === "plan") {
    const guidance = buildGuidance({
      area: selectedArea,
      concerns: selectedConcerns,
      lifestyle: selectedLifestyle,
      budget: selectedBudget,
    });

    return (
      <div className="app">
        <nav className="navbar">
          <div className="logo">✦ Beauty Mentor</div>
          <button className="dashboard-return" onClick={() => setPage("dashboard")}>Dashboard</button>
          <div className="nav-links">
            <span onClick={() => setPage("dashboard")}>Home</span>
            <span className="active-nav">Beauty Journey</span>
            <span role="button" tabIndex={0} onClick={() => setPage("about")} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setPage("about"); }}>About</span>
          </div>
        </nav>
        <main className="body-page">
          <button className="back-button" onClick={() => setPage("summary")}>← Back to your selections</button>
          <div className="body-heading">
            <p className="tagline">YOUR STARTER GUIDE</p>
            <h1>{guidance.supported ? <>Guidance for <span>{selectedArea.toLowerCase()}.</span></> : <>Your <span>starter guide.</span></>}</h1>
            <p>This educational information is based on your selections. It does not diagnose a condition or provide a personalized treatment plan.</p>
          </div>

          <section className="preference-panel starter-guide-panel">
            <div className="guide-summary">
              <span className="guide-summary-label">YOUR FOCUS</span>
              <h2>{selectedArea}</h2>
              <p>{selectedConcerns.join(" · ") || "No concerns selected"}</p>
            </div>
            {guidance.supported ? <>
              <h2 className="guide-section-title">Shared everyday care</h2>
              <div className="guide-step-list">
                {guidance.everyday.map((step, index) => (
                  <article className="guide-step" key={step.id}>
                    <span className="guide-step-number">{String(index + 1).padStart(2, "0")}</span>
                    <div><h3>{step.title}</h3><p>{step.text}</p></div>
                  </article>
                ))}
              </div>

              {guidance.lifestyleNote && <p className="guide-context-note"><strong>Lifestyle:</strong> {guidance.lifestyleNote}</p>}
              {userPreferences?.skincareExperience && <p className="guide-context-note"><strong>Routine experience:</strong> {userPreferences.skincareExperience === "I'm new to skincare." ? "Keep any routine simple and introduce changes one at a time." : userPreferences.skincareExperience === "I already have a basic routine." ? "Keep familiar steps that suit you and introduce any change one at a time." : "Continue to monitor how familiar products suit you, and stop anything that causes irritation."}</p>}
              {guidance.sensitivityNote && <p className="guide-context-note"><strong>Product sensitivity:</strong> {guidance.sensitivityNote}</p>}
              <p className="guide-context-note"><strong>Budget:</strong> {guidance.budgetNote}</p>
              {guidance.areaSafetyNote && <p className="guide-context-note" role="note"><strong>Important:</strong> {guidance.areaSafetyNote}</p>}
              {(userPreferences?.ageRange === "Under 13" || userPreferences?.ageRange === "13–17 years") && <p className="guide-context-note" role="note"><strong>Age-aware reminder:</strong> Keep care simple. Talk with a trusted adult or qualified professional before trying strong or medicated products.</p>}

              <h2 className="guide-section-title">Guidance for each concern</h2>
              <div className="guide-concern-list">
                {guidance.entries.map((entry) => (
                  <article className="guide-concern" key={entry.concern}>
                    <h3>{entry.concern}</h3>
                    <p>{entry.explanation}</p>
                    {entry.missing ? <p className="guide-disclaimer">This concern does not yet have reviewed guidance in this guide.</p> : <>
                      <h4>Everyday care for {entry.concern.toLowerCase()}</h4>
                      <ul>{entry.everyday.map((step) => <li key={step.id}>{step.text}</li>)}</ul>
                      <h4>Precautions</h4>
                      <ul>{entry.precautions.map((item) => <li key={item}>{item}</li>)}</ul>
                      {entry.nextSteps.length > 0 && <><h4>Optional next steps</h4><ul>{entry.nextSteps.map((item) => <li key={item}>{item}</li>)}</ul></>}
                      <p><strong>Budget-aware note:</strong> {entry.budget}</p>
                      <p><strong>When to seek professional advice:</strong> {entry.seek}</p>
                      <p className="guide-source-list"><strong>Sources:</strong> {[...new Set(entry.sources)].map((sourceKey) => {
                        const source = guidance.sources[sourceKey];
                        return <a key={sourceKey} href={source.url} target="_blank" rel="noreferrer">{source.label}</a>;
                      })}</p>
                    </>}
                  </article>
                ))}
              </div>
            </> : <div className="guide-safe-fallback" role="status">
              <p>{guidance.message}</p>
              <p>The existing selection flow is preserved, and more area-specific guidance can be added in a later phase.</p>
            </div>}
            <div className="guide-preferences">
              <p><strong>Your routine preferences:</strong> {selectedLifestyle.length ? selectedLifestyle.join(", ") : "No lifestyle choices selected"}</p>
              <p><strong>Your budget:</strong> {selectedBudget || "Not selected"}. This guide does not recommend or link to products.</p>
            </div>
            <p className="guide-disclaimer">This information is for education and is not medical advice. Stop a product that causes irritation. For a persistent, painful, severe, or worrying concern, contact a qualified health professional.</p>
            <button className="next-step-button" onClick={() => setPage("summary")}>Back to review</button>
            <button className="next-step-button secondary-step-button" onClick={() => setPage("body")}>Edit my selections</button>
          </section>
        </main>
        <footer>
          <p>© 2026 Beauty Mentor</p>
          <p>For educational purposes only — not medical advice.</p>
        </footer>
      </div>
    );
  }

  if (page === "body") {
    return (
      <div className="app">
        {/* NAVBAR */}
        <nav className="navbar">
          <div className="logo">✦ Beauty Mentor</div>

          <div className="nav-links">
            <span onClick={() => setPage("dashboard")}>Home</span>
            <span className="active-nav">Beauty Journey</span>
            <span role="button" tabIndex={0} onClick={() => setPage("about")} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setPage("about"); }}>About</span>
          </div>
        </nav>

        <main className="body-page">

          {/* BACK BUTTON */}
          <button
            className="back-button"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Home
          </button>

          {/* HEADING */}
          <div className="body-heading">
            <p className="tagline">STEP 1 OF YOUR JOURNEY</p>

            <h1>
              Where would you like
              <br />
              <span>beauty guidance?</span>
            </h1>

            <p>
              Choose a body area from the interactive map to explore
              concerns and create personalized guidance.
            </p>
          </div>

          {/* GENDER SWITCH */}
          <div className="gender-selector">

            <button
              className={`gender-button ${
                gender === "female" ? "selected" : ""
              }`}
              onClick={() => {
                setGender("female");
                setBodyView("anime");
                selectArea("Face");
              }}
            >
              ♀ Female
            </button>

            <button
              className={`gender-button ${
                gender === "male" ? "selected" : ""
              }`}
              onClick={() => {
                setGender("male");
                setBodyView("boy");
                selectArea("Face");
              }}
            >
              ♂ Male
            </button>

          </div>

          {/* MAIN BODY AREA */}
          <div className="interactive-body-container">

            {/* BODY ILLUSTRATION */}
            <div className="interactive-body">

              <h2>{gender === "female" ? bodyView === "anime" ? "Women’s Beauty Map" : "Female Body Map" : bodyView === "boy" ? "Men’s Beauty Map" : "Male Body Map"}</h2>

              {(gender === "female" || gender === "male") && (
                <div className="body-view-switch" role="group" aria-label="Choose body view">
                  {gender === "female" ? <button type="button" className={bodyView === "anime" ? "view-selected" : ""} onClick={() => setBodyView("anime")}>Anime girl</button> : <button type="button" className={bodyView === "boy" ? "view-selected" : ""} onClick={() => setBodyView("boy")}>Anime boy</button>}
                  <button type="button" className={bodyView === "map" ? "view-selected" : ""} onClick={() => setBodyView("map")}>Original body map</button>
                </div>
              )}

              <p className="body-instruction">
                {(gender === "female" && bodyView === "anime") || (gender === "male" && bodyView === "boy") ? "Select a part of the illustration or use the area buttons below." : "Click directly on a body part"}
              </p>

              {gender === "male" && bodyView === "boy" ? (
                <AnimeBoyMap selectedArea={selectedArea} onSelectArea={selectArea} onKeyDown={handleAreaKeyDown} />
              ) : gender === "female" && bodyView === "anime" ? (
                <AnimeGirlMap selectedArea={selectedArea} onSelectArea={selectArea} onKeyDown={handleAreaKeyDown} />
              ) : gender === "female" ? (

                /* ================= FEMALE ================= */
                <svg
                  className="body-svg"
                  viewBox="0 0 400 760"
                  xmlns="http://www.w3.org/2000/svg"
                >

                  {/* HAIR */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Hair" ? "svg-selected" : ""
                    }`}
                    onClick={() => selectArea("Hair")}
                  >
                    <ellipse
                      cx="200"
                      cy="105"
                      rx="62"
                      ry="75"
                      fill="#4b302d"
                    />
                    <ellipse
                      cx="200"
                      cy="115"
                      rx="45"
                      ry="55"
                      fill="#f2ad87"
                    />
                  </g>

                  {/* FACE */}
                  <g
                    className={`svg-area detail-area ${
                      selectedArea === "Face" ? "svg-selected" : ""
                    }`}
                    onClick={() => selectArea("Face")}
                    role="button"
                    tabIndex={0}
                    aria-label="Select the whole face"
                    onKeyDown={(event) => handleAreaKeyDown(event, "Face")}
                  >
                    <ellipse
                      cx="200"
                      cy="120"
                      rx="40"
                      ry="50"
                      fill="#f2ad87"
                    />
                  </g>

                  {/* EARS */}
                  <g
                    className={`svg-area detail-area ${selectedArea === "Ears" ? "svg-selected" : ""}`}
                    onClick={() => selectArea("Ears")}
                    role="button"
                    tabIndex={0}
                    aria-label="Select ears"
                    onKeyDown={(event) => handleAreaKeyDown(event, "Ears")}
                  >
                    <ellipse cx="158" cy="124" rx="7" ry="12" fill="#e99f7e" />
                    <ellipse cx="242" cy="124" rx="7" ry="12" fill="#e99f7e" />
                    <path d="M158 118 Q164 119 162 126 Q161 130 158 130" fill="none" stroke="#bd765e" strokeWidth="1.5" />
                    <path d="M242 118 Q236 119 238 126 Q239 130 242 130" fill="none" stroke="#bd765e" strokeWidth="1.5" />
                  </g>

                  {/* EYEBROWS */}
                  <g
                    className={`svg-area detail-area ${selectedArea === "Eyebrows" ? "svg-selected" : ""}`}
                    onClick={() => selectArea("Eyebrows")}
                    role="button"
                    tabIndex={0}
                    aria-label="Select eyebrows"
                    onKeyDown={(event) => handleAreaKeyDown(event, "Eyebrows")}
                  >
                    <path d="M174 105 Q183 99 192 104" fill="none" stroke="#75453d" strokeWidth="3" strokeLinecap="round" />
                    <path d="M208 104 Q217 99 226 105" fill="none" stroke="#75453d" strokeWidth="3" strokeLinecap="round" />
                  </g>

                  {/* EYES */}
                  <g
                    className={`svg-area detail-area ${selectedArea === "Eyes" ? "svg-selected" : ""}`}
                    onClick={() => selectArea("Eyes")}
                    role="button"
                    tabIndex={0}
                    aria-label="Select eyes"
                    onKeyDown={(event) => handleAreaKeyDown(event, "Eyes")}
                  >
                    <ellipse cx="184" cy="115" rx="9" ry="5.5" fill="#fff9f7" />
                    <ellipse cx="216" cy="115" rx="9" ry="5.5" fill="#fff9f7" />
                    <circle cx="184" cy="115" r="3" fill="#493331" />
                    <circle cx="216" cy="115" r="3" fill="#493331" />
                    <circle cx="185" cy="114" r="1" fill="white" />
                    <circle cx="217" cy="114" r="1" fill="white" />
                  </g>

                  {/* EYELASHES */}
                  <g
                    className={`svg-area detail-area ${selectedArea === "Eyelashes" ? "svg-selected" : ""}`}
                    onClick={() => selectArea("Eyelashes")}
                    role="button"
                    tabIndex={0}
                    aria-label="Select eyelashes"
                    onKeyDown={(event) => handleAreaKeyDown(event, "Eyelashes")}
                  >
                    <path d="M175 111 L172 107 M180 109 L179 105 M185 109 L185 105 M190 110 L192 106" fill="none" stroke="#493331" strokeWidth="1.3" strokeLinecap="round" />
                    <path d="M210 110 L208 106 M215 109 L215 105 M220 109 L221 105 M225 111 L228 107" fill="none" stroke="#493331" strokeWidth="1.3" strokeLinecap="round" />
                  </g>

                  {/* CHEEKS */}
                  <g
                    className={`svg-area detail-area ${selectedArea === "Cheeks" ? "svg-selected" : ""}`}
                    onClick={() => selectArea("Cheeks")}
                    role="button"
                    tabIndex={0}
                    aria-label="Select cheeks"
                    onKeyDown={(event) => handleAreaKeyDown(event, "Cheeks")}
                  >
                    <ellipse cx="176" cy="130" rx="8" ry="5" fill="#e98983" opacity="0.58" />
                    <ellipse cx="224" cy="130" rx="8" ry="5" fill="#e98983" opacity="0.58" />
                  </g>

                  {/* NOSE */}
                  <g
                    className={`svg-area detail-area ${selectedArea === "Nose" ? "svg-selected" : ""}`}
                    onClick={() => selectArea("Nose")}
                    role="button"
                    tabIndex={0}
                    aria-label="Select nose"
                    onKeyDown={(event) => handleAreaKeyDown(event, "Nose")}
                  >
                    <ellipse cx="200" cy="125" rx="9" ry="12" fill="#f2ad87" opacity="0.01" />
                    <path d="M200 116 Q198 124 196 130 Q200 133 204 130" fill="none" stroke="#bd765e" strokeWidth="2" strokeLinecap="round" />
                    <ellipse cx="200" cy="131" rx="4.5" ry="2.5" fill="#e99b7d" />
                  </g>

                  {/* LIPS */}
                  <g
                    className={`svg-area detail-area ${selectedArea === "Lips" ? "svg-selected" : ""}`}
                    onClick={() => selectArea("Lips")}
                    role="button"
                    tabIndex={0}
                    aria-label="Select lips"
                    onKeyDown={(event) => handleAreaKeyDown(event, "Lips")}
                  >
                    <ellipse cx="200" cy="144" rx="13" ry="8" fill="transparent" pointerEvents="all" />
                    <path d="M188 143 Q194 138 200 141 Q206 138 212 143 Q206 150 200 149 Q194 150 188 143 Z" fill="#b9586f" />
                    <path d="M190 143 Q200 145 210 143" fill="none" stroke="#f4bac1" strokeWidth="1.3" />
                  </g>

                  {/* NECK */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Neck" ? "svg-selected" : ""
                    }`}
                    onClick={() => selectArea("Neck")}
                  >
                    <rect
                      x="182"
                      y="165"
                      width="36"
                      height="55"
                      rx="12"
                      fill="#f2ad87"
                    />
                  </g>

                  {/* SHOULDERS */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Shoulders" ? "svg-selected" : ""
                    }`}
                    onClick={() => selectArea("Shoulders")}
                  >
                    <path
                      d="M145 205 Q200 185 255 205 L275 250 L125 250 Z"
                      fill="#e9a27f"
                    />
                  </g>

                  {/* CHEST / TOP */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Chest" ? "svg-selected" : ""
                    }`}
                    onClick={() => selectArea("Chest")}
                  >
                    <path
                      d="M145 215 Q200 195 255 215 L270 310 L130 310 Z"
                      fill="#d78bab"
                    />
                  </g>

                  {/* ABDOMEN */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Abdomen" ? "svg-selected" : ""
                    }`}
                    onClick={() => selectArea("Abdomen")}
                  >
                    <path
                      d="M150 300 L250 300 L245 420 Q200 440 155 420 Z"
                      fill="#f2ad87"
                    />
                  </g>

                  {/* LEFT ARM */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Arms" ? "svg-selected" : ""
                    }`}
                    onClick={() => selectArea("Arms")}
                  >
                    <path
                      d="M140 220
                         Q115 220 108 250
                         L82 370
                         Q78 390 95 395
                         Q112 400 118 380
                         L150 280 Z"
                      fill="#f2ad87"
                    />
                  </g>

                  {/* RIGHT ARM */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Arms" ? "svg-selected" : ""
                    }`}
                    onClick={() => selectArea("Arms")}
                  >
                    <path
                      d="M260 220
                         Q285 220 292 250
                         L318 370
                         Q322 390 305 395
                         Q288 400 282 380
                         L250 280 Z"
                      fill="#f2ad87"
                    />
                  </g>

                  {/* UNDERARMS */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Underarms"
                        ? "svg-selected"
                        : ""
                    }`}
                    onClick={() => selectArea("Underarms")}
                  >
                    <circle
                      cx="126"
                      cy="265"
                      r="15"
                      fill="#e99778"
                    />
                    <circle
                      cx="274"
                      cy="265"
                      r="15"
                      fill="#e99778"
                    />
                  </g>

                  {/* HANDS */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Hands" ? "svg-selected" : ""
                    } detail-area`}
                    onClick={() => selectArea("Hands")}
                    role="button"
                    tabIndex={0}
                    aria-label="Select hands"
                    onKeyDown={(event) => handleAreaKeyDown(event, "Hands")}
                  >
                    <ellipse cx="92" cy="407" rx="13" ry="18" fill="#f2ad87" />
                    <path d="M81 414 Q77 412 77 417 L76 429 Q76 434 80 434 L84 419 Z" fill="#f2ad87" />
                    <path d="M86 416 Q82 415 82 420 L82 434 Q83 438 87 436 L90 420 Z" fill="#f2ad87" />
                    <path d="M92 417 Q88 416 88 421 L89 436 Q91 440 95 437 L96 421 Z" fill="#f2ad87" />
                    <path d="M98 416 Q94 416 94 421 L96 434 Q98 438 102 435 L103 420 Z" fill="#f2ad87" />
                    <path d="M101 402 Q106 398 111 402 Q115 405 112 410 L106 419 L100 414 Z" fill="#f2ad87" />
                    <g transform="translate(400 0) scale(-1 1)">
                      <ellipse cx="92" cy="407" rx="13" ry="18" fill="#f2ad87" />
                      <path d="M81 414 Q77 412 77 417 L76 429 Q76 434 80 434 L84 419 Z" fill="#f2ad87" />
                      <path d="M86 416 Q82 415 82 420 L82 434 Q83 438 87 436 L90 420 Z" fill="#f2ad87" />
                      <path d="M92 417 Q88 416 88 421 L89 436 Q91 440 95 437 L96 421 Z" fill="#f2ad87" />
                      <path d="M98 416 Q94 416 94 421 L96 434 Q98 438 102 435 L103 420 Z" fill="#f2ad87" />
                      <path d="M101 402 Q106 398 111 402 Q115 405 112 410 L106 419 L100 414 Z" fill="#f2ad87" />
                    </g>
                  </g>

                  {/* THIGH-LENGTH BOTTOM WEAR */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Thighs"
                        ? "svg-selected"
                        : ""
                    }`}
                    onClick={() => selectArea("Thighs")}
                  >
                    <path
                      d="M150 415
                         L250 415
                         L262 500
                         L220 500
                         L200 475
                         L180 500
                         L138 500 Z"
                      fill="#9d7183"
                    />
                  </g>

                  {/* HIPS */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Hips" ? "svg-selected" : ""
                    }`}
                    onClick={() => selectArea("Hips")}
                  >
                    <path
                      d="M145 410
                         Q200 430 255 410
                         L265 455
                         Q200 480 135 455 Z"
                      fill="#f2ad87"
                    />
                  </g>

                  {/* LEFT LEG */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Legs" ? "svg-selected" : ""
                    }`}
                    onClick={() => selectArea("Legs")}
                  >
                    <path
                      d="M145 490
                         L190 490
                         L185 650
                         L145 650 Z"
                      fill="#f2ad87"
                    />
                  </g>

                  {/* RIGHT LEG */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Legs" ? "svg-selected" : ""
                    }`}
                    onClick={() => selectArea("Legs")}
                  >
                    <path
                      d="M210 490
                         L255 490
                         L255 650
                         L215 650 Z"
                      fill="#f2ad87"
                    />
                  </g>

                  {/* KNEES */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Knees"
                        ? "svg-selected"
                        : ""
                    }`}
                    onClick={() => selectArea("Knees")}
                  >
                    <ellipse
                      cx="165"
                      cy="655"
                      rx="22"
                      ry="20"
                      fill="#e99f7e"
                    />
                    <ellipse
                      cx="235"
                      cy="655"
                      rx="22"
                      ry="20"
                      fill="#e99f7e"
                    />
                  </g>

                  {/* LOWER LEGS */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Legs" ? "svg-selected" : ""
                    }`}
                    onClick={() => selectArea("Legs")}
                  >
                    <path
                      d="M145 665 L185 665 L180 735 L145 735 Z"
                      fill="#f2ad87"
                    />
                    <path
                      d="M215 665 L255 665 L255 735 L220 735 Z"
                      fill="#f2ad87"
                    />
                  </g>

                  {/* FEET */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Feet" ? "svg-selected" : ""
                    }`}
                    onClick={() => selectArea("Feet")}
                  >
                    <ellipse
                      cx="160"
                      cy="745"
                      rx="30"
                      ry="13"
                      fill="#f2ad87"
                    />
                    <ellipse
                      cx="240"
                      cy="745"
                      rx="30"
                      ry="13"
                      fill="#f2ad87"
                    />
                  </g>

                  {/* TOES */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Toes" ? "svg-selected" : ""
                    }`}
                    onClick={() => selectArea("Toes")}
                  >
                    <circle
                      cx="145"
                      cy="746"
                      r="7"
                      fill="#e49a79"
                    />
                    <circle
                      cx="255"
                      cy="746"
                      r="7"
                      fill="#e49a79"
                    />
                    <ellipse cx="145" cy="745" rx="4" ry="2.5" fill="#fff4f7" />
                    <ellipse cx="152" cy="747" rx="3.5" ry="2.2" fill="#fff4f7" />
                    <ellipse cx="159" cy="747" rx="3.5" ry="2.2" fill="#fff4f7" />
                    <ellipse cx="166" cy="745" rx="3.5" ry="2.2" fill="#fff4f7" />
                    <ellipse cx="255" cy="745" rx="4" ry="2.5" fill="#fff4f7" />
                    <ellipse cx="248" cy="747" rx="3.5" ry="2.2" fill="#fff4f7" />
                    <ellipse cx="241" cy="747" rx="3.5" ry="2.2" fill="#fff4f7" />
                    <ellipse cx="234" cy="745" rx="3.5" ry="2.2" fill="#fff4f7" />
                  </g>
                  {/* FINGERNAILS: placed on the fingertips; both hands select together */}
                  <g
                    className={`svg-area detail-area ${selectedArea === "Fingernails" ? "svg-selected" : ""}`}
                    onClick={() => selectArea("Fingernails")}
                    role="button"
                    tabIndex={0}
                    aria-label="Select fingernails on both hands"
                    onKeyDown={(event) => handleAreaKeyDown(event, "Fingernails")}
                  >
                    <ellipse cx="79" cy="430" rx="5.5" ry="7" fill="transparent" pointerEvents="all" />
                    <ellipse cx="85" cy="432" rx="5.5" ry="7" fill="transparent" pointerEvents="all" />
                    <ellipse cx="92" cy="434" rx="5.5" ry="7" fill="transparent" pointerEvents="all" />
                    <ellipse cx="99" cy="431" rx="5.5" ry="7" fill="transparent" pointerEvents="all" />
                    <ellipse cx="108" cy="408" rx="5.5" ry="7" fill="transparent" pointerEvents="all" />
                    <ellipse cx="79" cy="430" rx="2.2" ry="3.6" fill="#fff4f7" stroke="#d78da5" strokeWidth="0.8" />
                    <ellipse cx="85" cy="432" rx="2.2" ry="3.6" fill="#fff4f7" stroke="#d78da5" strokeWidth="0.8" />
                    <ellipse cx="92" cy="434" rx="2.2" ry="3.6" fill="#fff4f7" stroke="#d78da5" strokeWidth="0.8" />
                    <ellipse cx="99" cy="431" rx="2.2" ry="3.6" fill="#fff4f7" stroke="#d78da5" strokeWidth="0.8" />
                    <ellipse cx="108" cy="408" rx="2.2" ry="3.6" transform="rotate(35 108 408)" fill="#fff4f7" stroke="#d78da5" strokeWidth="0.8" />
                    <g transform="translate(400 0) scale(-1 1)">
                      <ellipse cx="79" cy="430" rx="5.5" ry="7" fill="transparent" pointerEvents="all" />
                      <ellipse cx="85" cy="432" rx="5.5" ry="7" fill="transparent" pointerEvents="all" />
                      <ellipse cx="92" cy="434" rx="5.5" ry="7" fill="transparent" pointerEvents="all" />
                      <ellipse cx="99" cy="431" rx="5.5" ry="7" fill="transparent" pointerEvents="all" />
                      <ellipse cx="108" cy="408" rx="5.5" ry="7" fill="transparent" pointerEvents="all" />
                      <ellipse cx="79" cy="430" rx="2.2" ry="3.6" fill="#fff4f7" stroke="#d78da5" strokeWidth="0.8" />
                      <ellipse cx="85" cy="432" rx="2.2" ry="3.6" fill="#fff4f7" stroke="#d78da5" strokeWidth="0.8" />
                      <ellipse cx="92" cy="434" rx="2.2" ry="3.6" fill="#fff4f7" stroke="#d78da5" strokeWidth="0.8" />
                      <ellipse cx="99" cy="431" rx="2.2" ry="3.6" fill="#fff4f7" stroke="#d78da5" strokeWidth="0.8" />
                      <ellipse cx="108" cy="408" rx="2.2" ry="3.6" transform="rotate(35 108 408)" fill="#fff4f7" stroke="#d78da5" strokeWidth="0.8" />
                    </g>
                  </g>

                </svg>

              ) : (

                /* ================= MALE ================= */
                <svg
                  className="body-svg"
                  viewBox="0 0 400 760"
                  xmlns="http://www.w3.org/2000/svg"
                >

                  {/* HEAD */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Face" ? "svg-selected" : ""
                    }`}
                    onClick={() => selectArea("Face")}
                  >
                    <circle
                      cx="200"
                      cy="120"
                      r="48"
                      fill="#d99470"
                    />
                  </g>

                  {/* HAIR */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Hair" ? "svg-selected" : ""
                    }`}
                    onClick={() => selectArea("Hair")}
                  >
                    <path
                      d="M153 112 Q160 55 200 60 Q240 55 247 112
                         L235 90 Q200 75 165 90 Z"
                      fill="#3b2927"
                    />
                  </g>

                  {/* SMALL CLICKABLE FACE DETAILS */}
                  {maleFaceFeatures.map(([area, d, fill, stroke]) => (
                    <path
                      key={area}
                      d={d}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={stroke ? 1.4 : undefined}
                      strokeLinecap={stroke ? "round" : undefined}
                      className={`svg-area face-detail ${selectedArea === area ? "svg-selected" : ""}`}
                      onClick={() => selectArea(area)}
                      onKeyDown={(event) => handleAreaKeyDown(event, area)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Select ${area}`}
                    >
                      <title>{area}</title>
                    </path>
                  ))}

                  {/* NECK */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Neck" ? "svg-selected" : ""
                    }`}
                    onClick={() => selectArea("Neck")}
                  >
                    <rect
                      x="178"
                      y="165"
                      width="44"
                      height="55"
                      rx="10"
                      fill="#d99470"
                    />
                  </g>

                  {/* SHOULDERS */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Shoulders"
                        ? "svg-selected"
                        : ""
                    }`}
                    onClick={() => selectArea("Shoulders")}
                  >
                    <path
                      d="M125 210 Q200 180 275 210 L300 300
                         L100 300 Z"
                      fill="#d99470"
                    />
                  </g>

                  {/* CHEST */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Chest" ? "svg-selected" : ""
                    }`}
                    onClick={() => selectArea("Chest")}
                  >
                    <path
                      d="M130 220 L270 220 L275 340
                         L125 340 Z"
                      fill="#d99470"
                    />
                  </g>

                  {/* ABDOMEN */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Abdomen"
                        ? "svg-selected"
                        : ""
                    }`}
                    onClick={() => selectArea("Abdomen")}
                  >
                    <rect
                      x="135"
                      y="335"
                      width="130"
                      height="95"
                      rx="25"
                      fill="#d99470"
                    />
                  </g>

                  {/* ARMS */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Arms" ? "svg-selected" : ""
                    }`}
                    onClick={() => selectArea("Arms")}
                  >
                    <path
                      d="M125 215 Q95 215 88 250
                         L60 380 Q58 400 78 405
                         Q95 408 102 385 L145 285 Z"
                      fill="#d99470"
                    />

                    <path
                      d="M275 215 Q305 215 312 250
                         L340 380 Q342 400 322 405
                         Q305 408 298 385 L255 285 Z"
                      fill="#d99470"
                    />
                  </g>

                  {/* HANDS */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Hands" ? "svg-selected" : ""
                    }`}
                    onClick={() => selectArea("Hands")}
                  >
                    <path d="M58 400 Q70 397 80 405 L93 416 Q97 421 93 425 Q90 429 85 426 L81 423 L87 436 Q89 441 85 443 Q81 445 78 440 L74 432 L78 443 Q79 448 75 449 Q71 450 69 445 L66 434 L67 443 Q67 448 63 447 Q59 446 59 441 L58 430 Q53 423 53 414 Q53 405 58 400 Z" fill="#d99470" />
                    <path d="M342 400 Q330 397 320 405 L307 416 Q303 421 307 425 Q310 429 315 426 L319 423 L313 436 Q311 441 315 443 Q319 445 322 440 L326 432 L322 443 Q321 448 325 449 Q329 450 331 445 L334 434 L333 443 Q333 448 337 447 Q341 446 341 441 L342 430 Q347 423 347 414 Q347 405 342 400 Z" fill="#d99470" />
                  </g>

                  {/* VISIBLE, CLICKABLE NAILS PLACED AT THE FINGER TIPS */}
                  <g
                    className={`svg-area detail-area ${selectedArea === "Fingernails" ? "svg-selected" : ""}`}
                    onClick={() => selectArea("Fingernails")}
                    onKeyDown={(event) => handleAreaKeyDown(event, "Fingernails")}
                    role="button"
                    tabIndex={0}
                    aria-label="Select fingernails on both hands"
                  >
                    <ellipse cx="59" cy="440" rx="4" ry="5.5" fill="#fff4f7" stroke="#b85e7d" strokeWidth="1.5" />
                    <ellipse cx="68" cy="444" rx="4" ry="5.5" fill="#fff4f7" stroke="#b85e7d" strokeWidth="1.5" />
                    <ellipse cx="78" cy="442" rx="4" ry="5.5" fill="#fff4f7" stroke="#b85e7d" strokeWidth="1.5" />
                    <ellipse cx="86" cy="436" rx="4" ry="5.5" fill="#fff4f7" stroke="#b85e7d" strokeWidth="1.5" />
                    <ellipse cx="93" cy="421" rx="4" ry="5" transform="rotate(-45 93 421)" fill="#fff4f7" stroke="#b85e7d" strokeWidth="1.5" />
                    <ellipse cx="341" cy="440" rx="4" ry="5.5" fill="#fff4f7" stroke="#b85e7d" strokeWidth="1.5" />
                    <ellipse cx="332" cy="444" rx="4" ry="5.5" fill="#fff4f7" stroke="#b85e7d" strokeWidth="1.5" />
                    <ellipse cx="322" cy="442" rx="4" ry="5.5" fill="#fff4f7" stroke="#b85e7d" strokeWidth="1.5" />
                    <ellipse cx="314" cy="436" rx="4" ry="5.5" fill="#fff4f7" stroke="#b85e7d" strokeWidth="1.5" />
                    <ellipse cx="307" cy="421" rx="4" ry="5" transform="rotate(45 307 421)" fill="#fff4f7" stroke="#b85e7d" strokeWidth="1.5" />
                    <title>Fingernails · select both hands</title>
                  </g>

                  {/* THIGH-LENGTH SHORTS */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Thighs"
                        ? "svg-selected"
                        : ""
                    }`}
                    onClick={() => selectArea("Thighs")}
                  >
                    <path
                      d="M135 420 L265 420
                         L275 505
                         L205 505
                         L200 475
                         L195 505
                         L125 505 Z"
                      fill="#756170"
                    />
                  </g>

                  {/* HIPS */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Hips" ? "svg-selected" : ""
                    }`}
                    onClick={() => selectArea("Hips")}
                  >
                    <path
                      d="M130 415 Q200 435 270 415
                         L275 460 Q200 485 125 460 Z"
                      fill="#d99470"
                    />
                  </g>

                  {/* LEGS */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Legs" ? "svg-selected" : ""
                    }`}
                    onClick={() => selectArea("Legs")}
                  >
                    <path
                      d="M130 495 L190 495 L185 650
                         L135 650 Z"
                      fill="#d99470"
                    />

                    <path
                      d="M210 495 L270 495 L265 650
                         L215 650 Z"
                      fill="#d99470"
                    />
                  </g>

                  {/* KNEES */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Knees"
                        ? "svg-selected"
                        : ""
                    }`}
                    onClick={() => selectArea("Knees")}
                  >
                    <ellipse
                      cx="160"
                      cy="655"
                      rx="25"
                      ry="20"
                      fill="#cd886a"
                    />
                    <ellipse
                      cx="240"
                      cy="655"
                      rx="25"
                      ry="20"
                      fill="#cd886a"
                    />
                  </g>

                  {/* LOWER LEGS */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Legs" ? "svg-selected" : ""
                    }`}
                    onClick={() => selectArea("Legs")}
                  >
                    <path
                      d="M135 670 L185 670 L180 735
                         L140 735 Z"
                      fill="#d99470"
                    />
                    <path
                      d="M215 670 L265 670 L260 735
                         L220 735 Z"
                      fill="#d99470"
                    />
                  </g>

                  {/* FEET */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Feet" ? "svg-selected" : ""
                    }`}
                    onClick={() => selectArea("Feet")}
                  >
                    <ellipse
                      cx="160"
                      cy="745"
                      rx="32"
                      ry="13"
                      fill="#d99470"
                    />
                    <ellipse
                      cx="240"
                      cy="745"
                      rx="32"
                      ry="13"
                      fill="#d99470"
                    />
                  </g>

                  {/* TOES */}
                  <g
                    className={`svg-area ${
                      selectedArea === "Toes" ? "svg-selected" : ""
                    }`}
                    onClick={() => selectArea("Toes")}
                  >
                    <circle
                      cx="145"
                      cy="746"
                      r="7"
                      fill="#cc8668"
                    />
                    <circle
                      cx="255"
                      cy="746"
                      r="7"
                      fill="#cc8668"
                    />
                  </g>

                </svg>
              )}

              {bodyView === "map" && (
                <div className="click-hint">✦ Click a body part to select it</div>
              )}

            </div>

            {/* CONCERN PANEL */}
            <div className="concern-panel">

              <p className="selected-label">
                SELECTED AREA
              </p>

              <h2>{selectedArea}</h2>

              <p className="concern-description">
                {`What is happening with your ${selectedArea.toLowerCase()}? Select anything that fits, then choose what you would like help with.`}
              </p>

              <h3 className="concern-title">
                What would you like help with?
              </h3>

              <div className="concern-grid">

                {concerns[selectedArea].map((concern) => (
                  <button
                    key={concern}
                    className={`concern-card ${
                      selectedConcerns.includes(concern)
                        ? "concern-selected"
                        : ""
                    }`}
                    onClick={() => toggleConcern(concern)}
                  >
                    <span className="concern-check">
                      {selectedConcerns.includes(concern)
                        ? "✓"
                        : ""}
                    </span>

                    <span>{concern}</span>
                  </button>
                ))}

              </div>

              {/* SELECTED CONCERNS */}
              <div className="selected-concerns">

                <h3>
                  Your Selection
                  {selectedConcerns.length > 0 &&
                    ` (${selectedConcerns.length})`}
                </h3>

                {selectedConcerns.length === 0 ? (
                  <p className="nothing-selected">
                    Select one or more concerns above.
                  </p>
                ) : (
                  <div className="selected-tags">

                    {selectedConcerns.map((concern) => (
                      <span
                        className="selected-tag"
                        key={concern}
                      >
                        {concern}

                        <button
                          onClick={() =>
                            toggleConcern(concern)
                          }
                        >
                          ×
                        </button>
                      </span>
                    ))}

                  </div>
                )}

              </div>

              <button
                className="next-step-button"
                disabled={selectedConcerns.length === 0}
                onClick={() => setPage("lifestyle")}
              >
                Next Step →
              </button>

            </div>
          </div>

        </main>

        <footer>
          <p>
            © 2026 Beauty Mentor
          </p>

          <p>
            For educational purposes only — not medical advice.
          </p>
        </footer>
      </div>
    );
  }

  /* ================= HOME PAGE ================= */

  return (
    <div className="app">

      <nav className="navbar">

        <div className="logo">
          ✦ Beauty Mentor
        </div>

        <div className="nav-links">
          <span>Home</span>

          <span onClick={() => setPage("body")}>
            Beauty Journey
          </span>

          <span role="button" tabIndex={0} onClick={() => setPage("about")} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setPage("about"); }}>About</span>
        </div>

      </nav>

      <main>

        <section className="hero">

          <div className="hero-text">

            <p className="tagline">
              YOUR PERSONALIZED BEAUTY GUIDE
            </p>

            <h1>
              Your Beauty.
              <br />
              Your Journey.
              <br />
              <span>Your Mentor.</span>
            </h1>

            <p className="description">
              Get personalized beauty guidance based on your
              concerns, lifestyle, budget, and goals — all in
              one place.
            </p>

            <button
              className="start-button"
              onClick={() => setPage("body")}
            >
              Start Your Beauty Journey →
            </button>

          </div>

          <div className="hero-card">

            <div className="sparkle">
              ✦
            </div>

            <h2>
              Beauty Mentor
            </h2>

            <p>
              Personalized guidance for your
              <br />
              skin, hair, nails & more.
            </p>

            <div className="beauty-items">
              <div>♡ Skin</div>
              <div>✿ Hair</div>
              <div>◇ Nails</div>
              <div>☼ Lifestyle</div>
            </div>

          </div>

        </section>

        <section className="features">

          <div className="section-heading">

            <p>
              HOW IT WORKS
            </p>

            <h2>
              Your beauty journey starts here.
            </h2>

          </div>

          <div className="feature-grid">

            <div className="feature-card">
              <div className="icon">
                01
              </div>

              <h3>
                Choose Your Concern
              </h3>

              <p>
                Select a body area and choose one
                or multiple beauty concerns.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon">
                02
              </div>

              <h3>
                Tell Us About You
              </h3>

              <p>
                Share your lifestyle, preferences
                and budget to personalize your
                experience.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon">
                03
              </div>

              <h3>
                Get Your Routine
              </h3>

              <p>
                Receive a personalized morning,
                night and weekly routine.
              </p>
            </div>

          </div>

        </section>

      </main>

      <footer>

        <p>
          © 2026 Beauty Mentor
        </p>

        <p>
          For educational purposes only — not medical advice.
        </p>

      </footer>

    </div>
  );
}

export default App;
