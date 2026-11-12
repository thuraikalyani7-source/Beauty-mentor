import { useState } from "react";
import "./AuthPage.css";

function AuthPage({ supabase, notice, onGuestAccess }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!supabase || submitting) return;
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (signUpError) throw signUpError;
        setPassword("");
        if (data?.session) {
          setMessage("Account created successfully! Welcome to Beauty Mentor.");
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
        setPassword("");
      }
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Authentication failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setMessage("");
    setError("");
  };

  return (
    <div className="app auth-app">
      <nav className="navbar"><div className="logo">✦ Beauty Mentor</div></nav>
      <main className="auth-page">
        <section className="auth-card" aria-labelledby="auth-title">
          <div className="auth-tabs" role="tablist" aria-label="Sign in mode">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              className={`auth-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => changeMode("login")}
            >
              Log in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              className={`auth-tab ${mode === "signup" ? "active" : ""}`}
              onClick={() => changeMode("signup")}
            >
              Sign up
            </button>
          </div>

          <p className="tagline">SECURE RENDER DATABASE</p>
          <h1 id="auth-title">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <p className="auth-intro">
            {mode === "login"
              ? "Sign in with your email and password to open your dashboard."
              : "Sign up instantly — no email verification needed."}
          </p>

          {notice && <p className="auth-message" role="status">{notice}</p>}
          {message && <p className="auth-message success" role="status">{message}</p>}
          {error && (
            <div className="auth-message error" role="alert">
              <p>{error}</p>
              {error.includes("Sign Up") && (
                <button
                  type="button"
                  className="quick-signup-btn"
                  onClick={() => changeMode("signup")}
                >
                  Switch to Sign up with this email →
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={submitting}
            />

            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={6}
              required
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={submitting}
            />

            <button
              className="next-step-button auth-submit"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Please wait…" : mode === "login" ? "Log in" : "Sign up"}
            </button>
          </form>

          {onGuestAccess && (
            <div className="guest-access-wrapper">
              <div className="auth-divider"><span>or</span></div>
              <button type="button" className="guest-button" onClick={onGuestAccess}>
                Continue as Guest
              </button>
            </div>
          )}

          <p className="auth-switch">
            {mode === "login" ? "New to Beauty Mentor?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="inline-link-button"
              onClick={() => changeMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </section>
      </main>
      <footer><p>© 2026 Beauty Mentor</p><p>For educational purposes only — not medical advice.</p></footer>
    </div>
  );
}

export default AuthPage;
