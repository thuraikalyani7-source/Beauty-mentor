import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { deleteAssistantHistory, getAssistantConversations, getAssistantMessages, getAssistantStatus, sendAssistantMessage } from "../services/assistantService.js";
import "./BeautyAssistant.css";

const starterPrompts = [
  "How can I keep a skincare routine simple?",
  "What should I consider when trying a new product?",
  "How can I care for dry-feeling skin gently?",
];
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const maxImageSize = 5 * 1024 * 1024;

function BeautyAssistant({ onBack, context }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [requestError, setRequestError] = useState(null);
  const [pendingMessage, setPendingMessage] = useState(null);
  const [serviceStatus, setServiceStatus] = useState("checking");
  const [statusError, setStatusError] = useState(false);
  const [speechStatus, setSpeechStatus] = useState("idle");
  const [speechMessage, setSpeechMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageMessage, setImageMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");
  const [historyDeleting, setHistoryDeleting] = useState(false);
  const inputRef = useRef(null);
  const imageInputRef = useRef(null);
  const imagePreviewRef = useRef(null);
  const messageImagePreviewsRef = useRef(new Set());
  const conversationRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputValueRef = useRef(input);
  const activeConversationRef = useRef(null);

  useEffect(() => {
    inputValueRef.current = input;
  }, [input]);

  useEffect(() => () => {
    recognitionRef.current?.abort();
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const saved = await getAssistantConversations();
        if (!active) return;
        setConversations(saved);
        if (saved.length) {
          const latest = saved[0];
          const history = await getAssistantMessages(latest.id);
          if (!active) return;
          setActiveConversationId(latest.id);
          activeConversationRef.current = latest.id;
          setMessages(history.map((item) => ({ id: item.id, role: item.role, text: item.content, complete: true, createdAt: item.created_at })));
        }
      } catch (error) {
        if (active) setHistoryError(error.message || "Saved chat history could not be loaded.");
      } finally {
        if (active) setHistoryLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => () => {
    if (imagePreviewRef.current) URL.revokeObjectURL(imagePreviewRef.current);
    messageImagePreviewsRef.current.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    messageImagePreviewsRef.current.clear();
  }, []);

  useEffect(() => {
    let active = true;
    getAssistantStatus()
      .then((configured) => {
        if (active) setServiceStatus(configured ? "configured" : "not-configured");
      })
      .catch(() => {
        if (active) {
          setServiceStatus("unavailable");
          setStatusError(true);
        }
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (messages.length) conversationRef.current?.scrollTo({ top: conversationRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const submitMessage = async (message, { appendUser = true, image = null, requestIds = null } = {}) => {
    const trimmed = message.trim();
    if (!trimmed || sending) return;
    const stableIds = requestIds || {
      conversationId: activeConversationRef.current || crypto.randomUUID(),
      messageId: crypto.randomUUID(),
      assistantMessageId: crypto.randomUUID(),
    };
    if (!activeConversationRef.current) {
      activeConversationRef.current = stableIds.conversationId;
      setActiveConversationId(stableIds.conversationId);
    }
    if (appendUser) {
      const imagePreview = image ? URL.createObjectURL(image) : null;
      if (imagePreview) messageImagePreviewsRef.current.add(imagePreview);
      setMessages((items) => [...items, { id: stableIds.messageId, role: "user", text: trimmed, ...(imagePreview ? { imagePreview } : {}) }]);
    }
    setSending(true);
    setRequestError(null);
    try {
      const result = await sendAssistantMessage(trimmed, context, image, stableIds);
      setMessages((items) => [...items, {
        id: result.assistantMessageId,
        role: "assistant",
        text: result.reply,
        complete: result.complete,
        finishReason: result.finishReason,
      }]);
      setPendingMessage(null);
      setConversations((items) => {
        const found = items.some((item) => item.id === result.conversationId);
        const next = found ? items : [{ id: result.conversationId, created_at: result.conversationCreatedAt }, ...items];
        return next.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      });
      setInput("");
      inputValueRef.current = "";
      if (image) {
        if (imagePreviewRef.current) URL.revokeObjectURL(imagePreviewRef.current);
        imagePreviewRef.current = null;
        setSelectedImage(null);
        if (imageInputRef.current) imageInputRef.current.value = "";
        setImageMessage("");
      }
    } catch (error) {
      setRequestError(error);
      setPendingMessage({ text: trimmed, requestIds: stableIds, retryable: Boolean(error.retryable) });
      void getAssistantConversations().then(setConversations).catch(() => {});
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!input.trim() || sending) return;
    const message = input.trim();
    const image = selectedImage;
    void submitMessage(message, { image: image?.file || null });
  };

  const chooseImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!allowedImageTypes.includes(file.type)) {
      if (imagePreviewRef.current) URL.revokeObjectURL(imagePreviewRef.current);
      imagePreviewRef.current = null;
      setSelectedImage(null);
      setImageMessage("Choose a JPEG, PNG, WebP, or GIF image.");
      event.target.value = "";
      return;
    }
    if (file.size > maxImageSize) {
      if (imagePreviewRef.current) URL.revokeObjectURL(imagePreviewRef.current);
      imagePreviewRef.current = null;
      setSelectedImage(null);
      setImageMessage("Images must be 5 MB or smaller. Choose a smaller image.");
      event.target.value = "";
      return;
    }
    if (imagePreviewRef.current) URL.revokeObjectURL(imagePreviewRef.current);
    imagePreviewRef.current = URL.createObjectURL(file);
    setSelectedImage({ file, preview: imagePreviewRef.current });
    setImageMessage("");
  };

  const removeImage = () => {
    if (imagePreviewRef.current) URL.revokeObjectURL(imagePreviewRef.current);
    imagePreviewRef.current = null;
    setSelectedImage(null);
    setImageMessage("");
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  const clearConversation = () => {
    if (!messages.length && !pendingMessage && !input && !selectedImage) return;
    if (!window.confirm("Clear this conversation from the current view? Saved chat history will remain available.")) return;
    setMessages([]);
    setActiveConversationId(null);
    activeConversationRef.current = null;
    setInput("");
    messageImagePreviewsRef.current.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    messageImagePreviewsRef.current.clear();
    if (imagePreviewRef.current) URL.revokeObjectURL(imagePreviewRef.current);
    imagePreviewRef.current = null;
    setSelectedImage(null);
    setImageMessage("");
    if (imageInputRef.current) imageInputRef.current.value = "";
    setPendingMessage(null);
    setRequestError(null);
  };

  const openConversation = async (conversationId) => {
    if (sending || historyLoading) return;
    setHistoryLoading(true);
    setHistoryError("");
    try {
      const savedMessages = await getAssistantMessages(conversationId);
      setMessages(savedMessages.map((item) => ({ id: item.id, role: item.role, text: item.content, complete: true, createdAt: item.created_at })));
      setActiveConversationId(conversationId);
      activeConversationRef.current = conversationId;
      setInput("");
      inputValueRef.current = "";
      setPendingMessage(null);
      setRequestError(null);
    } catch (error) {
      setHistoryError(error.message || "That conversation could not be opened.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const startNewConversation = () => {
    if (sending) return;
    setMessages([]);
    setActiveConversationId(null);
    activeConversationRef.current = null;
    setPendingMessage(null);
    setRequestError(null);
    setInput("");
    inputValueRef.current = "";
  };

  const deleteSavedHistory = async () => {
    if (!window.confirm("Delete all saved AI Assistant chat history? This permanently deletes your saved conversations and messages.")) return;
    setHistoryDeleting(true);
    setHistoryError("");
    try {
      await deleteAssistantHistory();
      setConversations([]);
      setMessages([]);
      setActiveConversationId(null);
      activeConversationRef.current = null;
      setPendingMessage(null);
      setRequestError(null);
    } catch (error) {
      setHistoryError(error.message || "Saved chat history could not be deleted.");
    } finally {
      setHistoryDeleting(false);
    }
  };

  const choosePrompt = (prompt) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const toggleSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechStatus("error");
      setSpeechMessage("Voice input is not supported by this browser. You can still type your message.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    let speechFailed = false;
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onstart = () => {
      setSpeechStatus("listening");
      setSpeechMessage("Listening… Speak now, then stop when you’re done.");
    };
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .slice(event.resultIndex)
        .filter((result) => result.isFinal)
        .map((result) => result[0].transcript.trim())
        .filter(Boolean)
        .join(" ");
      if (!transcript) return;
      const separator = inputValueRef.current.trim() ? " " : "";
      const nextInput = `${inputValueRef.current}${separator}${transcript}`.slice(0, 2000);
      inputValueRef.current = nextInput;
      setInput(nextInput);
    };
    recognition.onerror = (event) => {
      speechFailed = true;
      recognitionRef.current = null;
      setSpeechStatus("error");
      setSpeechMessage(event.error === "not-allowed" || event.error === "service-not-allowed"
        ? "Microphone access was denied. Allow it in your browser settings to use voice input, or type your message."
        : "Voice input ran into a problem. You can try again or type your message.");
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      if (!speechFailed) {
        setSpeechStatus("stopped");
        setSpeechMessage("Listening stopped. You can edit your message or start again.");
      }
    };
    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setSpeechStatus("error");
      setSpeechMessage("Voice input could not start. Check your microphone and try again, or type your message.");
    }
  };

  const hasContext = Boolean(context?.area || context?.concerns?.length || context?.lifestyle?.length || context?.budget || context?.sensitive);

  return (
    <div className="app assistant-app">
      <nav className="navbar">
        <div className="logo">✦ Beauty Mentor</div>
        <button className="nav-text-button" type="button" onClick={onBack}>← Dashboard</button>
      </nav>
      <main className="assistant-page">
        <header className="assistant-heading">
          <p className="tagline">A THOUGHTFUL CONVERSATION</p>
          <h1>Your Beauty <span>Guide</span></h1>
          <p>Explore general beauty and skincare education in a calm, judgment-free space. This is not a medical service and cannot diagnose conditions.</p>
        </header>

        <section className={`assistant-service-banner ${serviceStatus}`} role="status" aria-live="polite">
          <span className="assistant-status-dot" aria-hidden="true" />
          {serviceStatus === "checking" && "Checking assistant availability…"}
          {serviceStatus === "configured" && "A Gemini key is present on the server. Requests are sent to Google; provider access and quota can still affect a response."}
          {serviceStatus === "not-configured" && "The AI service is not currently configured. Messages will not receive an AI response yet."}
          {serviceStatus === "unavailable" && (statusError ? "Assistant availability could not be checked. You can still try sending a message." : "Assistant availability is unknown.")}
        </section>

        <section className="assistant-chat-card" aria-label="Beauty Mentor conversation">
          <div className="assistant-chat-top">
            <div><span className="assistant-avatar" aria-hidden="true">✦</span><div><h2>Beauty Mentor</h2><p>General beauty and self-care education</p></div></div>
            <div className="assistant-history-actions">
              <button className="secondary-product-button assistant-clear-button" type="button" onClick={startNewConversation} disabled={sending}>New chat</button>
              <button className="secondary-product-button assistant-clear-button" type="button" onClick={clearConversation} disabled={sending || (!messages.length && !pendingMessage && !input && !selectedImage)}>Clear conversation</button>
              <button className="secondary-product-button assistant-clear-button" type="button" onClick={deleteSavedHistory} disabled={historyDeleting || historyLoading}>{historyDeleting ? "Deleting…" : "Delete saved chat history"}</button>
            </div>
          </div>

          <div className="assistant-history-bar">
            <label htmlFor="assistant-saved-conversations">Saved conversations</label>
            <select id="assistant-saved-conversations" value={activeConversationId || ""} onChange={(event) => event.target.value ? void openConversation(event.target.value) : startNewConversation()} disabled={historyLoading || sending || conversations.length === 0}>
              <option value="">{historyLoading ? "Loading history…" : historyError ? "History unavailable" : conversations.length ? "New conversation" : "No saved conversations"}</option>
              {conversations.map((conversation) => <option value={conversation.id} key={conversation.id}>{new Date(conversation.created_at).toLocaleString()}</option>)}
            </select>
          </div>
          {historyError && <p className="assistant-history-error" role="alert">{historyError}</p>}
          {!historyError && historyLoading && <p className="assistant-history-loading" role="status">Loading your saved conversations…</p>}

          <div className="assistant-conversation" ref={conversationRef} aria-live="polite" aria-relevant="additions text">
            {messages.length === 0 ? (
              <div className="assistant-empty-state">
                <span aria-hidden="true">✿</span>
                <h3>What would you like to learn?</h3>
                <p>Choose a starter question or write your own. Prompts only fill the message box; they are not responses.</p>
                <div className="assistant-prompts">
                  {starterPrompts.map((prompt) => <button type="button" key={prompt} onClick={() => choosePrompt(prompt)}>{prompt}</button>)}
                </div>
              </div>
            ) : messages.map((message, index) => (
              <article className={`assistant-message ${message.role}`} key={message.id || `${message.role}-${index}`}>
                <span className="assistant-message-label">{message.role === "user" ? "You" : "Beauty Mentor"}</span>
                {message.role === "assistant" ? (
                  <div className="assistant-markdown"><ReactMarkdown>{message.text}</ReactMarkdown></div>
                ) : (
                  <>
                    {message.imagePreview && <img className="assistant-sent-image" src={message.imagePreview} alt="Image attached to your message" />}
                    <p className="assistant-user-text">{message.text}</p>
                  </>
                )}
                {message.role === "assistant" && !message.complete && (
                  <p className="assistant-incomplete-note" role="status">
                    This response may be incomplete{message.finishReason === "MAX_TOKENS" ? " because it reached Gemini’s response limit" : " because Gemini ended generation early"}. Ask a follow-up or request a shorter version before relying on it as complete.
                  </p>
                )}
              </article>
            ))}
            {sending && <div className="assistant-loading" role="status"><span className="assistant-spinner" aria-hidden="true" />Sending your message…</div>}
          </div>

          {requestError && (
            <div className="assistant-request-error" role="alert">
              <p>{requestError.message}</p>
              {pendingMessage?.retryable && <button type="button" className="secondary-product-button" disabled={sending} onClick={() => void submitMessage(pendingMessage.text, { appendUser: false, image: selectedImage?.file || null, requestIds: pendingMessage.requestIds })}>Try again</button>}
            </div>
          )}

          <form className="assistant-composer" onSubmit={handleSubmit}>
            <label htmlFor="assistant-message">Your message</label>
            <input ref={imageInputRef} id="assistant-image" className="assistant-image-input" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={chooseImage} disabled={sending} aria-describedby="assistant-image-help" />
            {selectedImage && (
              <div className="assistant-image-preview">
                <img src={selectedImage.preview} alt="Selected image preview" />
                <span>{selectedImage.file.name}</span>
                <button type="button" className="secondary-product-button" onClick={removeImage} disabled={sending} aria-label="Remove attached image">Remove image</button>
              </div>
            )}
            <div className="assistant-composer-controls">
              <button className="assistant-attach-button" type="button" onClick={() => imageInputRef.current?.click()} disabled={sending} aria-label="Attach an image">▧ Attach image</button>
              <textarea id="assistant-message" ref={inputRef} rows="2" maxLength="2000" value={input} onChange={(event) => { inputValueRef.current = event.target.value; setInput(event.target.value); }} onKeyDown={handleKeyDown} placeholder="Ask a general beauty or skincare question…" disabled={sending} aria-describedby="assistant-input-help" />
              <button className={`assistant-microphone-button${speechStatus === "listening" ? " is-listening" : ""}`} type="button" onClick={toggleSpeechRecognition} aria-label={speechStatus === "listening" ? "Stop voice input" : "Start voice input"} aria-pressed={speechStatus === "listening"}>
                <span aria-hidden="true">{speechStatus === "listening" ? "■" : "🎙"}</span>
                {speechStatus === "listening" ? "Stop" : "Speak"}
              </button>
              <button className="next-step-button" type="submit" disabled={sending || !input.trim()}>{sending ? "Sending…" : "Send"}</button>
            </div>
            {speechMessage && <p className={`assistant-speech-status ${speechStatus}`} role={speechStatus === "error" ? "alert" : "status"} aria-live="polite">{speechMessage}</p>}
            {imageMessage && <p className="assistant-image-status" role="alert">{imageMessage}</p>}
            <p id="assistant-image-help">JPEG, PNG, WebP, or GIF · up to 5 MB</p>
            <p className="assistant-image-privacy">Selected image and question are sent to the AI service to generate a reply when you press Send.</p>
            <p id="assistant-input-help">Enter to send · Shift+Enter for a new line · Up to 2,000 characters</p>
          </form>
        </section>

        <div className="assistant-privacy-note">
          <h2>Privacy and wellbeing</h2>
          <p>Signed-in conversations and text messages are saved to your account and can be removed with “Delete saved chat history.” To answer, your message{selectedImage ? " and selected image" : ""} and only relevant selected preferences{hasContext ? " (such as area, concerns, lifestyle, budget, and product sensitivity)" : ""} are sent to Beauty Mentor's server and then to Google Gemini. Photos are temporary and are not saved in chat history. The app does not automatically attach journal entries, location, age range, account details, or routine contents; anything you include in your message is sent. For unpaid Gemini API usage, Google may use submitted inputs and responses to improve its products, and human reviewers may review them. Do not include sensitive, confidential, or personal information. See <a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noreferrer">Google’s Gemini API terms</a>.</p>
          <p>Beauty Mentor is not a healthcare professional. For concerning, painful, or persistent symptoms, speak with a qualified healthcare professional.</p>
        </div>
      </main>
      <footer><p>© 2026 Beauty Mentor</p><p>For educational purposes only — not medical advice.</p></footer>
    </div>
  );
}

export default BeautyAssistant;
