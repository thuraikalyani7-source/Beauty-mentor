import { useState } from "react";
import "./AuthPage.css";

function AuthPage({ supabase, notice, onGuestAccess }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!supabase || submitting) return;
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({ email: email.trim(), password });
        if (signUpError) throw signUpError;
        setPassword("");
        if (!data.session) {
          setMessage("Check your email (and Spam folder) for a confirmation link, then return here to log in.");
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (signInError) throw signInError;
        setPassword("");
      }
    } catch (authError) {
      const errMsg = authError instanceof Error ? authError.message : "Authentication could not be completed. Please try again.";
      if (errMsg.toLowerCase().includes("email not confirmed")) {
        setError("Your email is not confirmed yet. Please check your inbox and Spam folder for the link from Supabase, or resend it below.");
      } else {
        setError(errMsg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email.trim() || !supabase || resending) return;
    setResending(true);
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
      });
      if (resendError) throw resendError;
      setMessage("Confirmation email resent! Please check your inbox and Spam folder.");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend confirmation email.");
    } finally {
      setResending(false);
    }
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setMessage("");
    setError("");
  };

  const showResend = error.toLowerCase().includes("not confirmed") || message.toLowerCase().includes("check your email");

  return (
    <div className="app auth-app">
      <nav className="navbar"><div className="logo">✦ Beauty Mentor</div></nav>
      <main className="auth-page">
        <section className="auth-card" aria-labelledby="auth-title">
          <p className="tagline">A THOUGHTFUL CONVERSATION</p>
          <h1 id="auth-title">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <p className="auth-intro">Sign in to continue to your Beauty Mentor dashboard.</p>
          {!supabase && <p className="auth-message" role="alert">Authentication is not configured. Add your Supabase project URL and publishable key to the local environment, then restart the app.</p>}
          {notice && <p className="auth-message" role="status">{notice}</p>}
          {message && <p className="auth-message success" role="status">{message}</p>}
          {error && <p className="auth-message error" role="alert">{error}</p>}
          {showResend && (
            <button type="button" className="resend-link-button" onClick={handleResendConfirmation} disabled={resending || !email.trim()}>
              {resending ? "Resending confirmation email…" : "Resend confirmation email"}
            </button>
          )}
          <form onSubmit={handleSubmit}>
            <label htmlFor="auth-email">Email</label>
            <input id="auth-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} disabled={submitting} />
            <label htmlFor="auth-password">Password</label>
            <input id="auth-password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} disabled={submitting} />
            <button className="next-step-button auth-submit" type="submit" disabled={!supabase || submitting}>{submitting ? "Please wait…" : mode === "login" ? "Log in" : "Sign up"}</button>
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
            <button type="button" className="inline-link-button" onClick={() => changeMode(mode === "login" ? "signup" : "login")}>
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
