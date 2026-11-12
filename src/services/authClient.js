const TOKEN_KEY = "bm_auth_token";
const USER_KEY = "bm_auth_user";

const listeners = new Set();

function notify(event, session) {
  for (const cb of listeners) {
    try {
      cb(event, session);
    } catch (e) {
      console.error(e);
    }
  }
}

// Live Render Web Service URL fallback
export const PROD_BACKEND_URL = "https://beauty-mentor-app.onrender.com";

export function getApiUrl(endpoint) {
  if (typeof window !== "undefined") {
    // If the browser is directly on the Render web service, use relative URL
    if (window.location.origin.includes("beauty-mentor-app.onrender.com")) {
      return endpoint;
    }
  }
  // Otherwise, route directly to the live Render backend
  return `${PROD_BACKEND_URL}${endpoint}`;
}

async function safeRequestApi(endpoint, options = {}) {
  const url = getApiUrl(endpoint);
  let res;

  try {
    res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(options.headers || {}),
      },
    });
  } catch (err) {
    // If relative URL failed (e.g. running locally without local backend), fallback to live Render backend
    if (!url.startsWith("http")) {
      try {
        res = await fetch(`${PROD_BACKEND_URL}${endpoint}`, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            ...(options.headers || {}),
          },
        });
      } catch {
        throw new Error("Unable to connect to the server. Please check your network connection.");
      }
    } else {
      throw new Error("Unable to connect to the server. Please check your network connection.");
    }
  }

  // Safely parse body as text first to prevent "Unexpected end of JSON input"
  const rawText = await res.text();
  let data = null;

  if (rawText && rawText.trim().length > 0) {
    try {
      data = JSON.parse(rawText);
    } catch {
      if (res.status >= 500) {
        throw new Error("The Render server is currently waking up. Please wait 15 seconds and try again.");
      }
      throw new Error(`Server returned unexpected response (status ${res.status}). Please try again.`);
    }
  } else {
    // Empty body returned
    if (res.status >= 500 || res.status === 200) {
      throw new Error("The server is waking up from standby. Please wait a moment and try again.");
    }
    throw new Error(`Server returned an empty response (status ${res.status}).`);
  }

  if (!res.ok) {
    const errorMsg = data?.error || data?.message || "Operation failed. Please check your credentials.";
    throw new Error(errorMsg);
  }

  return data;
}

export const authClient = {
  auth: {
    async signUp({ email, password }) {
      const data = await safeRequestApi("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      const session = { access_token: data.token, user: data.user };
      notify("SIGNED_IN", session);
      return { data: { user: data.user, session }, error: null };
    },

    async signInWithPassword({ email, password }) {
      const data = await safeRequestApi("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      const session = { access_token: data.token, user: data.user };
      notify("SIGNED_IN", session);
      return { data: { user: data.user, session }, error: null };
    },

    async signOut() {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      try {
        await safeRequestApi("/api/auth/logout", { method: "POST" });
      } catch {}
      notify("SIGNED_OUT", null);
      return { error: null };
    },

    async getSession() {
      const token = localStorage.getItem(TOKEN_KEY);
      const userStr = localStorage.getItem(USER_KEY);
      if (!token || !userStr) return { data: { session: null }, error: null };
      try {
        const user = JSON.parse(userStr);
        return { data: { session: { access_token: token, user } }, error: null };
      } catch {
        return { data: { session: null }, error: null };
      }
    },

    async getUser() {
      const { data } = await this.getSession();
      return { data: { user: data.session?.user || null }, error: null };
    },

    onAuthStateChange(callback) {
      listeners.add(callback);
      const token = localStorage.getItem(TOKEN_KEY);
      const userStr = localStorage.getItem(USER_KEY);
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          callback("INITIAL_SESSION", { access_token: token, user });
        } catch {}
      }
      return {
        data: {
          subscription: {
            unsubscribe: () => listeners.delete(callback),
          },
        },
      };
    },
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
};

export const supabase = authClient;
