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

export const authClient = {
  auth: {
    async signUp({ email, password }) {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create account.");
      }
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      const session = { access_token: data.token, user: data.user };
      notify("SIGNED_IN", session);
      return { data: { user: data.user, session }, error: null };
    },

    async signInWithPassword({ email, password }) {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid login credentials.");
      }
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
        await fetch("/api/auth/logout", { method: "POST" });
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
