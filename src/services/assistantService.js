import { supabase } from "./supabaseClient.js";

const statusMessages = {
  not_configured: "The AI service is not configured yet. No AI response was generated. You can still use your Beauty Guide.",
  not_implemented: "The provider connection has not been implemented yet. No AI response was generated.",
  invalid_message: "Please enter a message before sending.",
  message_too_long: "That message is too long. Please shorten it and try again.",
  image_too_large: "Images must be 5 MB or smaller. Choose a smaller image.",
  unsupported_image: "Use a JPEG, PNG, WebP, or GIF image.",
  invalid_image: "The selected image could not be validated. Choose a valid image and try again.",
  invalid_context: "The selected context could not be sent. Please try again without it.",
  unsupported_context: "The request included unsupported context. Please refresh and try again.",
  unsupported_fields: "The request format was not accepted. Please refresh and try again.",
  invalid_request: "The request could not be read by the assistant service.",
  invalid_json: "The assistant service could not read the request.",
  request_too_large: "The image request exceeded the server upload limit. Choose a smaller image and try again.",
  rate_limited: "The assistant service is busy. Please wait a little before trying again.",
  quota_exceeded: "Gemini's available quota has been reached. Check your AI Studio usage limits and try again after they reset.",
  provider_auth_error: "Gemini could not authorize the request. The server configuration needs attention.",
  provider_unavailable: "Gemini is temporarily unavailable. You can try again later.",
  provider_timeout: "Gemini took too long to respond. You can retry this request manually.",
  network_error: "The server could not connect to Gemini. Please try again later.",
  provider_error: "Gemini could not process this request. Try asking in a different way.",
  content_blocked: "Gemini could not provide a response to that message. Try asking in a different, general way.",
  response_unavailable: "Gemini did not return a usable response. Please try again later.",
  response_incomplete: "Gemini reached its response limit before returning readable text. Ask a shorter or more focused question.",
  invalid_provider_response: "Gemini returned a response the server could not read.",
  server_error: "The assistant service had a problem. Please try again later.",
  history_unavailable: "Your chat history could not be saved or loaded. Please try again.",
  auth_required: "Your session has expired. Please sign in again.",
};

export class AssistantRequestError extends Error {
  constructor(message, { code = "unexpected_error", status = 0, retryable = false, finishReason = null } = {}) {
    super(message);
    this.name = "AssistantRequestError";
    this.code = code;
    this.status = status;
    this.retryable = retryable;
    this.finishReason = finishReason;
  }
}

export async function getAssistantStatus() {
  let response;
  try {
    response = await fetch("/api/assistant/status", { headers: { Accept: "application/json" } });
  } catch {
    throw new AssistantRequestError("Could not reach the assistant service.", { code: "network_error", retryable: true });
  }

  if (!response.ok) {
    throw new AssistantRequestError("Assistant status is temporarily unavailable.", {
      code: "server_error",
      status: response.status,
      retryable: response.status >= 500 || response.status === 429,
    });
  }

  try {
    const result = await response.json();
    if (typeof result.configured !== "boolean") throw new Error("Invalid status response");
    return result.configured;
  } catch {
    throw new AssistantRequestError("The assistant service returned an unexpected status response.", { code: "unexpected_response" });
  }
}

async function fetchAuthenticatedAssistantApi(path, { body, method = "GET" } = {}) {
  if (!supabase) {
    throw new AssistantRequestError("Your sign-in session is unavailable. Please sign in again.", { code: "auth_required" });
  }

  let sessionResult;
  try {
    sessionResult = await supabase.auth.getSession();
  } catch {
    throw new AssistantRequestError("Your sign-in session could not be restored. Please sign in again.", { code: "auth_required" });
  }
  const accessToken = sessionResult.data?.session?.access_token;
  if (sessionResult.error || !accessToken) {
    throw new AssistantRequestError("Your sign-in session has expired. Please sign in again.", { code: "auth_required" });
  }

  const headers = { Accept: "application/json", Authorization: `Bearer ${accessToken}` };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  let response;
  try {
    response = await fetch(path, {
      method,
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new AssistantRequestError("Could not reach the assistant service. Check your connection and try again.", { code: "network_error", retryable: true });
  }

  let payload;
  try {
    payload = JSON.parse(await response.text());
  } catch {
    throw new AssistantRequestError(`The assistant service returned HTTP ${response.status} with an unreadable response.`, {
      code: "unexpected_response",
      status: response.status,
      retryable: response.status >= 500,
    });
  }

  if (response.status === 401) {
    void supabase.auth.signOut({ scope: "local" });
    throw new AssistantRequestError(statusMessages.auth_required, { code: "auth_required", status: 401 });
  }
  if (!response.ok) {
    const code = payload?.error?.code || "server_error";
    const serviceMessage = typeof payload?.error?.message === "string" ? payload.error.message.slice(0, 300) : "";
    throw new AssistantRequestError(serviceMessage || statusMessages[code] || "The assistant request could not be completed.", {
      code,
      status: response.status,
      retryable: ["rate_limited", "provider_unavailable", "provider_timeout", "network_error", "history_unavailable"].includes(code),
    });
  }
  return payload;
}

export async function getAssistantConversations() {
  const payload = await fetchAuthenticatedAssistantApi("/api/assistant/conversations");
  if (!Array.isArray(payload?.conversations)) {
    throw new AssistantRequestError("The assistant returned an invalid conversation list.", { code: "unexpected_response" });
  }
  return payload.conversations;
}

export async function getAssistantMessages(conversationId) {
  const payload = await fetchAuthenticatedAssistantApi(`/api/assistant/conversations/${encodeURIComponent(conversationId)}/messages`);
  if (!Array.isArray(payload?.messages)) {
    throw new AssistantRequestError("The assistant returned invalid saved messages.", { code: "unexpected_response" });
  }
  return payload.messages;
}

export async function deleteAssistantHistory() {
  return fetchAuthenticatedAssistantApi("/api/assistant/conversations", { method: "DELETE" });
}

function readImageAsBase64(image) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(new AssistantRequestError("The selected image could not be read. Please choose it again.", { code: "image_read_error" }));
    reader.readAsDataURL(image);
  });
}

export async function sendAssistantMessage(message, context, image = null, requestIds = {}) {
  const imagePayload = image ? { mimeType: image.type, data: await readImageAsBase64(image) } : null;
  const payload = await fetchAuthenticatedAssistantApi("/api/assistant/chat", {
    method: "POST",
    body: {
      message,
      ...requestIds,
      ...(context && Object.keys(context).length ? { context } : {}),
      ...(imagePayload ? { image: imagePayload } : {}),
    },
  });

  if (typeof payload?.reply !== "string" || !payload.reply.trim() || typeof payload.complete !== "boolean") {
    throw new AssistantRequestError("The service did not return an assistant reply. No guidance was generated.", { code: "unexpected_response" });
  }
  return {
    reply: payload.reply.trim(),
    complete: payload.complete,
    finishReason: typeof payload.finishReason === "string" ? payload.finishReason : null,
    conversationId: payload.conversationId,
    messageId: payload.messageId,
    assistantMessageId: payload.assistantMessageId,
    conversationCreatedAt: payload.conversationCreatedAt,
  };
}
