const JOURNEY_STORAGE_KEY = "beauty-mentor-journey-v1";
const JOURNEY_DB_NAME = "beauty-mentor-private-journey";
const JOURNEY_DB_VERSION = 1;
const PHOTO_STORE = "photos";

export function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function emptyJourneyData() {
  return { startedOn: localDateString(), entries: [], checkins: [], productHistory: [] };
}

export function readJourneyData() {
  try {
    const raw = window.localStorage.getItem(JOURNEY_STORAGE_KEY);
    if (!raw) {
      const data = emptyJourneyData();
      try {
        window.localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(data));
        return { data, error: "" };
      } catch {
        return { data, error: "This browser could not save your journey start date. Your entries may not persist until browser storage is available." };
      }
    }
    const saved = JSON.parse(raw);
    return {
      data: {
        startedOn: typeof saved.startedOn === "string" ? saved.startedOn : localDateString(),
        entries: Array.isArray(saved.entries) ? saved.entries.filter((item) => item && typeof item === "object") : [],
        checkins: Array.isArray(saved.checkins) ? saved.checkins.filter((item) => item && typeof item === "object") : [],
        productHistory: Array.isArray(saved.productHistory) ? saved.productHistory.filter((item) => item && typeof item === "object") : [],
      },
      error: "",
    };
  } catch {
    return {
      data: emptyJourneyData(),
      error: "This browser could not read saved journey notes. You can still use this page for now, but changes may not persist.",
    };
  }
}

export function writeJourneyData(data) {
  try {
    window.localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(data));
    return "";
  } catch {
    return "Journey text could not be saved in this browser. Free some browser storage or export your notes before closing this page.";
  }
}

function openPhotoDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("This browser does not provide IndexedDB photo storage."));
      return;
    }
    const request = window.indexedDB.open(JOURNEY_DB_NAME, JOURNEY_DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(PHOTO_STORE)) {
        database.createObjectStore(PHOTO_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Could not open private photo storage."));
    request.onblocked = () => reject(new Error("Photo storage is busy in another tab. Close other Beauty Mentor tabs and try again."));
  });
}

async function photoTransaction(mode, action) {
  const database = await openPhotoDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(PHOTO_STORE, mode);
    const store = transaction.objectStore(PHOTO_STORE);
    let request;
    try {
      request = action(store);
    } catch (error) {
      database.close();
      reject(error);
      return;
    }
    let result;
    if (request) {
      request.onsuccess = () => { result = request.result; };
      request.onerror = () => reject(request.error || new Error("Photo storage could not complete this request."));
    }
    transaction.oncomplete = () => {
      database.close();
      resolve(result);
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error || new Error("Photo storage could not complete this request."));
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error || new Error("Photo storage did not have enough space or permission."));
    };
  });
}

export function readJourneyPhotos() {
  return photoTransaction("readonly", (store) => store.getAll());
}

export function saveJourneyPhoto(photo) {
  return photoTransaction("readwrite", (store) => store.put(photo));
}

export function deleteJourneyPhoto(id) {
  return photoTransaction("readwrite", (store) => store.delete(id));
}
