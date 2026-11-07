import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  deleteJourneyPhoto,
  localDateString,
  readJourneyData,
  readJourneyPhotos,
  saveJourneyPhoto,
  writeJourneyData,
} from "../data/journeyStorage.js";

const JOURNAL_TAGS = ["Hydration", "Comfort", "Dryness", "Oiliness", "General observation"];
const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_PHOTO_SIZE = 10 * 1024 * 1024;

function newId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatDate(date) {
  if (!date) return "Date not set";
  const parsed = new Date(`${date}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function makeJournalDraft(area, concerns, routineProducts) {
  return {
    date: localDateString(),
    title: "",
    area: area || "",
    concerns: [...(concerns || [])],
    productsUsed: routineProducts.map((product) => product.name).filter(Boolean).join(", "),
    routineFollowed: "",
    note: "",
    tags: [],
  };
}

function checkinStatusLabel(value) {
  if (value === "completed") return "Completed";
  if (value === "missed") return "Not completed";
  return "Not recorded";
}

export default function BeautyJourney({
  onBack,
  profile,
  concernsByArea,
  routine,
}) {
  const { selectedArea, selectedConcerns } = profile;
  const initial = useMemo(() => readJourneyData(), []);
  const [journeyData, setJourneyData] = useState(initial.data);
  const [storageMessage, setStorageMessage] = useState(initial.error);
  const [activeTab, setActiveTab] = useState("overview");
  const [photos, setPhotos] = useState([]);
  const [photoStatus, setPhotoStatus] = useState("loading");
  const [photoMessage, setPhotoMessage] = useState("");
  const [photoDate, setPhotoDate] = useState(localDateString());
  const [photoNote, setPhotoNote] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [openPhotoId, setOpenPhotoId] = useState("");
  const [photoEdit, setPhotoEdit] = useState({ date: "", note: "" });
  const [brokenPhotos, setBrokenPhotos] = useState([]);
  const objectUrls = useRef([]);
  const isMounted = useRef(false);

  const [journalDraft, setJournalDraft] = useState(() => makeJournalDraft(selectedArea, selectedConcerns, []));
  const [journalFormOpen, setJournalFormOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState("");
  const [openEntryId, setOpenEntryId] = useState("");
  const [journalMessage, setJournalMessage] = useState("");

  const today = localDateString();
  const todayCheckin = journeyData.checkins.find((checkin) => checkin.date === today);
  const [checkinDate, setCheckinDate] = useState(today);
  const [morningStatus, setMorningStatus] = useState(todayCheckin?.morning || "");
  const [eveningStatus, setEveningStatus] = useState(todayCheckin?.evening || "");
  const [checkinNote, setCheckinNote] = useState(todayCheckin?.note || "");
  const [checkinMessage, setCheckinMessage] = useState("");

  const allRoutineProducts = useMemo(() => {
    const byId = new Map();
    [...(routine.morning || []), ...(routine.evening || [])].forEach((product) => {
      if (product?.id && !byId.has(product.id)) byId.set(product.id, product);
    });
    return [...byId.values()];
  }, [routine]);
  const [productToTrack, setProductToTrack] = useState("");
  const [productStartDate, setProductStartDate] = useState(localDateString());
  const [productMessage, setProductMessage] = useState("");
  const [observationDrafts, setObservationDrafts] = useState({});

  const commitJourneyData = (nextData) => {
    setStorageMessage(writeJourneyData(nextData));
    setJourneyData(nextData);
  };

  const loadPhotos = useCallback(async () => {
    try {
      const savedPhotos = await readJourneyPhotos();
      if (!isMounted.current) return;
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrls.current = [];
      const hydratedPhotos = savedPhotos.filter((photo) => photo && typeof photo === "object" && photo.id)
        .map((photo) => {
          let imageUrl = "";
          if (photo.blob instanceof Blob) {
            imageUrl = URL.createObjectURL(photo.blob);
            objectUrls.current.push(imageUrl);
          }
          return { ...photo, imageUrl };
        })
        .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      setPhotos(hydratedPhotos);
      setPhotoStatus("ready");
    } catch {
      if (!isMounted.current) return;
      setPhotos([]);
      setPhotoStatus("error");
      setPhotoMessage("Private photo storage could not be opened. Your journal notes and routine check-ins can still be used.");
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    loadPhotos();
    return () => {
      isMounted.current = false;
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrls.current = [];
    };
  }, [loadPhotos]);

  const updateJournalDraft = (updates) => setJournalDraft((draft) => ({ ...draft, ...updates }));

  const openJournalEditor = (entry = null) => {
    setEditingEntryId(entry?.id || "");
    setJournalDraft(entry ? {
      date: entry.date || localDateString(),
      title: entry.title || "",
      area: entry.area || "",
      concerns: Array.isArray(entry.concerns) ? entry.concerns : [],
      productsUsed: entry.productsUsed || "",
      routineFollowed: entry.routineFollowed || "",
      note: entry.note || "",
      tags: Array.isArray(entry.tags) ? entry.tags : [],
    } : makeJournalDraft(selectedArea, selectedConcerns, allRoutineProducts));
    setJournalFormOpen(true);
    setOpenEntryId("");
    setJournalMessage("");
  };

  const saveJournalEntry = (event) => {
    event.preventDefault();
    if (!journalDraft.date) {
      setJournalMessage("Choose a date to save this journal entry.");
      return;
    }
    const entry = { ...journalDraft, id: editingEntryId || newId(), updatedAt: new Date().toISOString() };
    commitJourneyData({
      ...journeyData,
      entries: [entry, ...journeyData.entries.filter((item) => item.id !== entry.id)],
    });
    setJournalFormOpen(false);
    setEditingEntryId("");
    setJournalMessage("Your journal entry was saved in this browser.");
  };

  const deleteJournalEntry = (entry) => {
    if (!window.confirm("Delete this journal entry from this browser? This cannot be undone.")) return;
    commitJourneyData({ ...journeyData, entries: journeyData.entries.filter((item) => item.id !== entry.id) });
    setOpenEntryId("");
    setJournalMessage("The journal entry was deleted.");
  };

  const savePhoto = async (event) => {
    event.preventDefault();
    const uploadForm = event.currentTarget;
    setPhotoMessage("");
    if (!photoFile) {
      setPhotoMessage("Choose a photo before saving.");
      return;
    }
    if (!ALLOWED_PHOTO_TYPES.has(photoFile.type)) {
      setPhotoMessage("Choose a JPEG, PNG, or WebP image. Other file types are not accepted.");
      return;
    }
    if (photoFile.size > MAX_PHOTO_SIZE) {
      setPhotoMessage("This photo is larger than 10 MB. Choose a smaller image to keep local storage manageable.");
      return;
    }
    if (!photoDate) {
      setPhotoMessage("Choose the date for this photo.");
      return;
    }

    setPhotoBusy(true);
    try {
      await saveJourneyPhoto({ id: newId(), date: photoDate, note: photoNote.trim(), blob: photoFile, addedAt: new Date().toISOString() });
      setPhotoFile(null);
      setPhotoDate(localDateString());
      setPhotoNote("");
      uploadForm.reset();
      await loadPhotos();
      setPhotoMessage("Your photo was saved privately in this browser.");
    } catch {
      setPhotoMessage("The photo could not be saved. Browser storage may be full or unavailable. Your photo was not uploaded.");
    } finally {
      setPhotoBusy(false);
    }
  };

  const handleOpenPhoto = (photo) => {
    setOpenPhotoId(photo.id);
    setPhotoEdit({ date: photo.date || localDateString(), note: photo.note || "" });
    setPhotoMessage("");
  };

  const savePhotoEdits = async (event) => {
    event.preventDefault();
    const photo = photos.find((item) => item.id === openPhotoId);
    if (!photo || !photoEdit.date) {
      setPhotoMessage("Choose a date for this photo.");
      return;
    }
    setPhotoBusy(true);
    try {
      const storedPhoto = { ...photo };
      delete storedPhoto.imageUrl;
      await saveJourneyPhoto({ ...storedPhoto, date: photoEdit.date, note: photoEdit.note.trim() });
      setOpenPhotoId("");
      await loadPhotos();
      setPhotoMessage("Photo details updated.");
    } catch {
      setPhotoMessage("Photo details could not be saved. Your original photo entry is still in the browser.");
    } finally {
      setPhotoBusy(false);
    }
  };

  const removePhoto = async (photo) => {
    if (!window.confirm("Delete this private photo and its note from this browser? This cannot be undone.")) return;
    setPhotoBusy(true);
    try {
      await deleteJourneyPhoto(photo.id);
      setOpenPhotoId("");
      await loadPhotos();
      setPhotoMessage("The photo was deleted from this browser.");
    } catch {
      setPhotoMessage("The photo could not be deleted. Please try again.");
    } finally {
      setPhotoBusy(false);
    }
  };

  const updateCheckinDate = (date) => {
    const existing = journeyData.checkins.find((checkin) => checkin.date === date);
    setCheckinDate(date);
    setMorningStatus(existing?.morning || "");
    setEveningStatus(existing?.evening || "");
    setCheckinNote(existing?.note || "");
    setCheckinMessage("");
  };

  const saveCheckin = (event) => {
    event.preventDefault();
    if (!checkinDate || (!morningStatus && !eveningStatus)) {
      setCheckinMessage("Choose completed or not completed for at least one routine to record a check-in.");
      return;
    }
    const checkin = { date: checkinDate, morning: morningStatus, evening: eveningStatus, note: checkinNote.trim(), updatedAt: new Date().toISOString() };
    commitJourneyData({
      ...journeyData,
      checkins: [checkin, ...journeyData.checkins.filter((item) => item.date !== checkin.date)].sort((a, b) => b.date.localeCompare(a.date)),
    });
    setCheckinMessage("Your routine check-in was recorded.");
  };

  const startProductTracking = (event) => {
    event.preventDefault();
    const product = allRoutineProducts.find((item) => item.id === productToTrack);
    if (!product || !productStartDate) {
      setProductMessage("Choose a product from your proposed routine and a start date.");
      return;
    }
    if (journeyData.productHistory.some((item) => item.productId === product.id)) {
      setProductMessage("This product is already in your product history.");
      return;
    }
    commitJourneyData({
      ...journeyData,
      productHistory: [{ productId: product.id, name: product.name, brand: product.brand, startedOn: productStartDate, observations: [] }, ...journeyData.productHistory],
    });
    setProductToTrack("");
    setProductMessage("Product start date saved. Any later changes you note are observations, not proof of cause.");
  };

  const saveProductObservation = (event, productId) => {
    event.preventDefault();
    const draft = observationDrafts[productId] || { date: localDateString(), note: "" };
    if (!draft.date || !draft.note.trim()) return;
    commitJourneyData({
      ...journeyData,
      productHistory: journeyData.productHistory.map((item) => item.productId === productId
        ? { ...item, observations: [{ id: newId(), date: draft.date, note: draft.note.trim() }, ...(item.observations || [])] }
        : item),
    });
    setObservationDrafts((previous) => ({ ...previous, [productId]: { date: localDateString(), note: "" } }));
  };

  const removeProductTracking = (product) => {
    if (!window.confirm(`Delete the start date and observations for ${product.name || "this product"}? This cannot be undone.`)) return;
    commitJourneyData({
      ...journeyData,
      productHistory: journeyData.productHistory.filter((item) => item.productId !== product.productId),
    });
  };

  const recordedCheckinCount = journeyData.checkins.reduce((total, item) => total + Number(["completed", "missed"].includes(item.morning)) + Number(["completed", "missed"].includes(item.evening)), 0);
  const weeklyHistory = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index);
    const key = localDateString(date);
    return { date: key, checkin: journeyData.checkins.find((item) => item.date === key) };
  });
  const recentEntries = [...journeyData.entries].sort((a, b) => (b.updatedAt || b.date || "").localeCompare(a.updatedAt || a.date || "")).slice(0, 4);
  const recentObservations = journeyData.productHistory
    .flatMap((product) => (product.observations || []).map((observation) => ({ ...observation, productName: product.name, productBrand: product.brand })))
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 4);
  const openEntry = journeyData.entries.find((entry) => entry.id === openEntryId);
  const openPhoto = photos.find((photo) => photo.id === openPhotoId);

  const toggleDraftArrayValue = (field, value) => {
    const selected = journalDraft[field] || [];
    updateJournalDraft({ [field]: selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value] });
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">✦ Beauty Mentor</div>
        <button type="button" className="dashboard-return journey-dashboard-button" onClick={onBack}>← Dashboard</button>
      </nav>
      <main className="journey-page">
        <button type="button" className="back-button" onClick={onBack}>← Back to dashboard</button>
        <header className="journey-heading">
          <p className="tagline">YOUR PRIVATE WELLNESS SPACE</p>
          <h1>Your Beauty <span>Journey.</span></h1>
          <p>A gentle place to notice your routines and record what feels helpful to you.</p>
        </header>

        <div className="journey-tabs" role="tablist" aria-label="Beauty Journey sections">
          {[["overview", "Overview"], ["photos", "Photos"], ["journal", "Journal"], ["routine", "Routine history"]].map(([key, label]) => (
            <button type="button" role="tab" aria-selected={activeTab === key} className={activeTab === key ? "journey-tab journey-tab-active" : "journey-tab"} key={key} onClick={() => { setActiveTab(key); setOpenEntryId(""); setOpenPhotoId(""); }}>
              {label}{key === "photos" && <span className="journey-tab-count">{photos.length}</span>}
            </button>
          ))}
        </div>

        {storageMessage && <p className="journey-alert" role="alert">{storageMessage}</p>}

        {activeTab === "overview" && (
          <section className="journey-overview">
            <div className="journey-welcome-card">
              <div><p className="tagline">A LITTLE AT A TIME</p><h2>Consistency can be gentle.</h2><p>There is no perfect timeline. Small acts of care and honest notes are enough.</p></div>
              <div className="journey-start-date"><span>Journey started</span><strong>{formatDate(journeyData.startedOn)}</strong></div>
            </div>
            <div className="journey-stat-grid" aria-label="Journey totals">
              <article className="journey-stat-card"><strong>{journeyData.entries.length}</strong><span>Journal entries</span></article>
              <article className="journey-stat-card"><strong>{recordedCheckinCount}</strong><span>Routine check-ins recorded</span></article>
              <article className="journey-stat-card"><strong>{photos.length}</strong><span>Private photos</span></article>
            </div>
            {photoStatus === "error" && <p className="journey-muted">Photo totals are unavailable because browser photo storage could not be opened.</p>}
            <div className="journey-overview-columns">
              <section className="journey-panel"><div className="journey-panel-heading"><h2>Recent journal entries</h2><button type="button" className="inline-link-button" onClick={() => setActiveTab("journal")}>Open journal</button></div>
                {recentEntries.length ? <ul className="journey-recent-list">{recentEntries.map((entry) => <li key={entry.id}><button type="button" className="journey-recent-button" onClick={() => { setActiveTab("journal"); setOpenEntryId(entry.id); }}><strong>{entry.title || entry.area || "Journal note"}</strong><span>{formatDate(entry.date)}{entry.note ? ` · ${entry.note}` : ""}</span></button></li>)}</ul> : <div className="journey-empty"><span aria-hidden="true">✿</span><h3>Your journal starts when you do</h3><p>Save an observation or routine note whenever it is useful. Photos are always optional.</p><button type="button" className="secondary-product-button" onClick={() => { setActiveTab("journal"); openJournalEditor(); }}>Write a first note</button></div>}
              </section>
              <section className="journey-panel"><div className="journey-panel-heading"><h2>Recent observations</h2><button type="button" className="inline-link-button" onClick={() => setActiveTab("journal")}>Product notes</button></div>
                {recentObservations.length ? <ul className="journey-recent-list">{recentObservations.map((observation) => <li key={observation.id}><strong>{observation.productName || "Product"}</strong><span>{formatDate(observation.date)} · {observation.note}</span></li>)}</ul> : <div className="journey-empty compact-empty"><span aria-hidden="true">♡</span><h3>No observations yet</h3><p>Product observations can be added if you have products in your proposed routine.</p></div>}
              </section>
            </div>
            <p className="journey-privacy-note">Your notes stay in this browser. Photos are not uploaded or shared. Browser data may not transfer to another device and may be lost if you clear browser data.</p>
          </section>
        )}

        {activeTab === "photos" && (
          <section className="journey-section">
            <div className="journey-section-intro"><div><h2>Private photo journal</h2><p>Photos are optional and stay on this device in this browser.</p></div></div>
            <form className="journey-panel journey-form photo-upload-form" onSubmit={savePhoto}>
              <h3>Add a photo</h3>
              <p className="journey-muted">Accepted: JPEG, PNG, or WebP, up to 10 MB each.</p>
              <label htmlFor="journey-photo-file">Choose a photo</label>
              <input id="journey-photo-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setPhotoFile(event.target.files?.[0] || null)} />
              <div className="journey-form-grid"><label>Date<input type="date" value={photoDate} onChange={(event) => setPhotoDate(event.target.value)} required /></label><label>Optional note<textarea value={photoNote} onChange={(event) => setPhotoNote(event.target.value)} rows="2" maxLength="600" placeholder="A note for yourself" /></label></div>
              <button type="submit" className="next-step-button" disabled={photoBusy || photoStatus === "error"}>{photoBusy ? "Saving privately…" : "Save photo"}</button>
              {photoStatus === "error" && <p className="journey-muted">Photo storage is not available in this browser session.</p>}
              {photoMessage && <p className="journey-form-message" role="status">{photoMessage}</p>}
            </form>
            {openPhoto && <section className="journey-panel journey-detail-panel" aria-label="Photo entry details">
              <div className="journey-panel-heading"><h3>Photo entry · {formatDate(openPhoto.date)}</h3><button type="button" className="inline-link-button" onClick={() => setOpenPhotoId("")}>Close</button></div>
              {openPhoto.imageUrl && !brokenPhotos.includes(openPhoto.id) ? <img className="journey-open-photo" src={openPhoto.imageUrl} alt="Private journal entry" onError={() => setBrokenPhotos((ids) => [...ids, openPhoto.id])} /> : <p className="journey-image-missing">This image is unavailable. Its date and note can still be edited or deleted.</p>}
              <form className="journey-form" onSubmit={savePhotoEdits}><label>Date<input type="date" value={photoEdit.date} onChange={(event) => setPhotoEdit((previous) => ({ ...previous, date: event.target.value }))} required /></label><label>Optional note<textarea value={photoEdit.note} onChange={(event) => setPhotoEdit((previous) => ({ ...previous, note: event.target.value }))} rows="3" maxLength="600" /></label><div className="journey-action-row"><button type="submit" className="next-step-button" disabled={photoBusy}>Save changes</button><button type="button" className="journey-danger-button" disabled={photoBusy} onClick={() => removePhoto(openPhoto)}>Delete photo</button></div></form>
            </section>}
            {photoStatus === "loading" ? <p className="journey-state" role="status">Loading private photos…</p> : photoStatus === "ready" && photos.length ? <div className="journey-photo-grid">{photos.map((photo) => <article className="journey-photo-card" key={photo.id}><button type="button" className="journey-photo-open" onClick={() => handleOpenPhoto(photo)} aria-label={`Open photo entry from ${formatDate(photo.date)}`}>
              {photo.imageUrl && !brokenPhotos.includes(photo.id) ? <img src={photo.imageUrl} alt="Private progress journal" onError={() => setBrokenPhotos((ids) => [...ids, photo.id])} /> : <span className="journey-image-missing">Image unavailable</span>}
              <span><strong>{formatDate(photo.date)}</strong><small>{photo.note || "No note added"}</small></span>
            </button></article>)}</div> : photoStatus === "ready" ? <div className="journey-empty"><span aria-hidden="true">▧</span><h3>No photos saved</h3><p>You can keep a journal without photos. Any photo you add stays private in this browser.</p></div> : null}
            <p className="journey-privacy-note">Local photos may not transfer to another device and can be lost if browser data is cleared. Beauty Mentor does not upload them.</p>
          </section>
        )}

        {activeTab === "journal" && (
          <section className="journey-section">
            <div className="journey-section-intro"><div><h2>Beauty and skincare journal</h2><p>Record what you notice in your own words. No field is required except the date.</p></div><button type="button" className="next-step-button" onClick={() => openJournalEditor()}>+ New journal entry</button></div>
            {journalMessage && !journalFormOpen && <p className="journey-form-message" role="status">{journalMessage}</p>}
            {journalFormOpen && <form className="journey-panel journey-form" onSubmit={saveJournalEntry}>
              <div className="journey-panel-heading"><h3>{editingEntryId ? "Edit journal entry" : "New journal entry"}</h3><button type="button" className="inline-link-button" onClick={() => { setJournalFormOpen(false); setEditingEntryId(""); }}>Cancel</button></div>
              <div className="journey-form-grid"><label>Date<input type="date" value={journalDraft.date} onChange={(event) => updateJournalDraft({ date: event.target.value })} required /></label><label>Optional title<input value={journalDraft.title} onChange={(event) => updateJournalDraft({ title: event.target.value })} maxLength="100" placeholder="A short title" /></label></div>
              <label>Body area (optional)<select value={journalDraft.area} onChange={(event) => updateJournalDraft({ area: event.target.value, concerns: event.target.value === selectedArea ? [...selectedConcerns] : [] })}><option value="">Choose an area</option>{Object.keys(concernsByArea).map((area) => <option value={area} key={area}>{area}</option>)}</select></label>
              {journalDraft.area && (concernsByArea[journalDraft.area] || []).length > 0 && <fieldset className="journey-fieldset"><legend>Related concerns (optional)</legend><div className="journey-chip-list">{concernsByArea[journalDraft.area].map((concern) => <button type="button" className={journalDraft.concerns.includes(concern) ? "journey-chip selected-journey-chip" : "journey-chip"} aria-pressed={journalDraft.concerns.includes(concern)} key={concern} onClick={() => toggleDraftArrayValue("concerns", concern)}>{concern}</button>)}</div></fieldset>}
              <label>Products used (optional)<textarea value={journalDraft.productsUsed} onChange={(event) => updateJournalDraft({ productsUsed: event.target.value })} rows="2" maxLength="500" placeholder={allRoutineProducts.length ? "Products from your proposed routine are prefilled; edit as needed" : "You can type product names here"} /></label>
              <label>Routine followed (optional)<select value={journalDraft.routineFollowed} onChange={(event) => updateJournalDraft({ routineFollowed: event.target.value })}><option value="">Not recorded</option><option value="morning">Morning routine</option><option value="evening">Evening routine</option><option value="both">Morning and evening routines</option><option value="other">Another routine</option></select></label>
              <label>Observations or notes (optional)<textarea value={journalDraft.note} onChange={(event) => updateJournalDraft({ note: event.target.value })} rows="4" maxLength="2000" placeholder="How did your routine or skin feel?" /></label>
              <fieldset className="journey-fieldset"><legend>Optional tags</legend><div className="journey-chip-list">{JOURNAL_TAGS.map((tag) => <button type="button" className={journalDraft.tags.includes(tag) ? "journey-chip selected-journey-chip" : "journey-chip"} aria-pressed={journalDraft.tags.includes(tag)} key={tag} onClick={() => toggleDraftArrayValue("tags", tag)}>{tag}</button>)}</div></fieldset>
              <div className="journey-action-row"><button type="submit" className="next-step-button">{editingEntryId ? "Save changes" : "Save journal entry"}</button></div>
              {journalMessage && <p className="journey-form-message" role="status">{journalMessage}</p>}
            </form>}
            {openEntry && <article className="journey-panel journey-detail-panel"><div className="journey-panel-heading"><div><p className="journey-muted">{formatDate(openEntry.date)}</p><h3>{openEntry.title || openEntry.area || "Journal note"}</h3></div><button type="button" className="inline-link-button" onClick={() => setOpenEntryId("")}>Close</button></div>
              {openEntry.area && <p><strong>Area:</strong> {openEntry.area}{openEntry.concerns?.length ? ` · ${openEntry.concerns.join(", ")}` : ""}</p>}{openEntry.productsUsed && <p><strong>Products used:</strong> {openEntry.productsUsed}</p>}{openEntry.routineFollowed && <p><strong>Routine:</strong> {openEntry.routineFollowed}</p>}{openEntry.tags?.length > 0 && <p><strong>Tags:</strong> {openEntry.tags.join(", ")}</p>}{openEntry.note && <p className="journey-entry-note">{openEntry.note}</p>}
              <div className="journey-action-row"><button type="button" className="secondary-product-button" onClick={() => openJournalEditor(openEntry)}>Edit entry</button><button type="button" className="journey-danger-button" onClick={() => deleteJournalEntry(openEntry)}>Delete entry</button></div>
            </article>}
            {journeyData.entries.length ? <div className="journey-entry-list">{[...journeyData.entries].sort((a, b) => (b.date || "").localeCompare(a.date || "")).map((entry) => <article className="journey-entry-card" key={entry.id}><button type="button" className="journey-entry-open" onClick={() => setOpenEntryId(entry.id)}><span className="journey-entry-date">{formatDate(entry.date)}</span><strong>{entry.title || entry.area || "Journal note"}</strong><span>{entry.note || entry.tags?.join(" · ") || "Open to see entry details"}</span></button></article>)}</div> : !journalFormOpen && <div className="journey-empty"><span aria-hidden="true">✎</span><h3>No journal entries yet</h3><p>Write a note when you want. Photos and product tracking are optional.</p><button type="button" className="secondary-product-button" onClick={() => openJournalEditor()}>Write an entry</button></div>}

            <section className="journey-panel product-history-panel"><div className="journey-panel-heading"><div><h2>Product start dates and observations</h2><p className="journey-muted">Notes show what you noticed; they do not establish that a product caused a change.</p></div></div>
              {allRoutineProducts.length > 0 && <form className="journey-inline-form" onSubmit={startProductTracking}><label>Product from your proposed routine<select value={productToTrack} onChange={(event) => setProductToTrack(event.target.value)}><option value="">Choose a product</option>{allRoutineProducts.filter((product) => !journeyData.productHistory.some((item) => item.productId === product.id)).map((product) => <option value={product.id} key={product.id}>{product.name} · {product.brand}</option>)}</select></label><label>Started using it<input type="date" value={productStartDate} onChange={(event) => setProductStartDate(event.target.value)} /></label><button type="submit" className="secondary-product-button">Save start date</button></form>}
              {productMessage && <p className="journey-form-message" role="status">{productMessage}</p>}
              {journeyData.productHistory.length ? <div className="product-history-list">{journeyData.productHistory.map((product) => {
                const draft = observationDrafts[product.productId] || { date: localDateString(), note: "" };
                return <article className="product-history-card" key={product.productId}><div className="journey-panel-heading"><div><h3>{product.name}</h3><p>{product.brand} · Started {formatDate(product.startedOn)}</p></div><button type="button" className="journey-danger-button" onClick={() => removeProductTracking(product)}>Remove history</button></div><form className="journey-observation-form" onSubmit={(event) => saveProductObservation(event, product.productId)}><label>New observation<textarea value={draft.note} onChange={(event) => setObservationDrafts((previous) => ({ ...previous, [product.productId]: { ...draft, note: event.target.value } }))} maxLength="600" rows="2" placeholder="Write what you noticed, without assuming a cause" /></label><label>Date<input type="date" value={draft.date} onChange={(event) => setObservationDrafts((previous) => ({ ...previous, [product.productId]: { ...draft, date: event.target.value } }))} /></label><button type="submit" className="secondary-product-button" disabled={!draft.note.trim()}>Add observation</button></form>
                  {product.observations?.length > 0 && <ul className="journey-observation-list">{product.observations.map((observation) => <li key={observation.id}><strong>{formatDate(observation.date)}</strong><span>{observation.note}</span></li>)}</ul>}
                </article>;
              })}</div> : <p className="journey-empty-inline">{allRoutineProducts.length ? "Choose a proposed-routine product above to record when you started using it." : "No product history yet. Add a product to your proposed routine in Product Explorer to record a start date here."}</p>}
            </section>
          </section>
        )}

        {activeTab === "routine" && (
          <section className="journey-section">
            <div className="journey-section-intro"><div><h2>Routine check-ins</h2><p>Record only what you remember. Missed or unrecorded routines are normal; there is no streak to maintain.</p></div></div>
            <form className="journey-panel journey-form checkin-form" onSubmit={saveCheckin}>
              <h3>Record a check-in</h3>
              <div className="journey-form-grid"><label>Date<input type="date" value={checkinDate} onChange={(event) => updateCheckinDate(event.target.value)} required /></label><label>Morning routine<select value={morningStatus} onChange={(event) => setMorningStatus(event.target.value)}><option value="">Not recorded</option><option value="completed">Completed</option><option value="missed">Not completed</option></select></label><label>Evening routine<select value={eveningStatus} onChange={(event) => setEveningStatus(event.target.value)}><option value="">Not recorded</option><option value="completed">Completed</option><option value="missed">Not completed</option></select></label></div>
              <label>Optional note<textarea value={checkinNote} onChange={(event) => setCheckinNote(event.target.value)} rows="2" maxLength="600" placeholder="Anything you want to remember?" /></label>
              <button type="submit" className="next-step-button">Save check-in</button>
              {checkinMessage && <p className="journey-form-message" role="status">{checkinMessage}</p>}
            </form>
            <section className="journey-panel weekly-history"><div className="journey-panel-heading"><div><h2>Last 7 days</h2><p className="journey-muted">A blank mark means no check-in was recorded for that routine.</p></div></div>
              <div className="weekly-history-list">{weeklyHistory.map(({ date, checkin }) => <article className="weekly-history-row" key={date}><strong>{formatDate(date)}</strong><span className={`checkin-mark checkin-${checkin?.morning || "blank"}`}>Morning · {checkinStatusLabel(checkin?.morning)}</span><span className={`checkin-mark checkin-${checkin?.evening || "blank"}`}>Evening · {checkinStatusLabel(checkin?.evening)}</span>{checkin?.note && <small>{checkin.note}</small>}</article>)}</div>
              {journeyData.checkins.length === 0 && <p className="journey-empty-inline">No check-ins have been recorded yet. The history will fill in as you choose to record them.</p>}
            </section>
          </section>
        )}

        <p className="journey-disclaimer">Beauty Mentor stores this information on your device for your personal reflection. It does not diagnose conditions or judge appearance. This page is educational and is not medical advice.</p>
      </main>
      <footer><p>© 2026 Beauty Mentor</p><p>For educational purposes only — not medical advice.</p></footer>
    </div>
  );
}
