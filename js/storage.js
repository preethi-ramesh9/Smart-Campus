// storage.js
// Centralized wrapper around localStorage to keep everything namespaced and JSON-safe.

const STORAGE_PREFIX = "cms_demo_";

export const Storage = {
  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (!raw) return defaultValue;
      return JSON.parse(raw);
    } catch (e) {
      console.error("Storage.get error", key, e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error("Storage.set error", key, e);
    }
  },

  remove(key) {
    localStorage.removeItem(STORAGE_PREFIX + key);
  },
};

// Seed some default demo data if not present
export function seedDemoData() {
  if (!Storage.get("students")) {
    Storage.set("students", [
      {
        id: "S001",
        name: "Arjun Kumar",
        department: "CSE",
        semester: 5,
        email: "arjun@example.com",
      },
      {
        id: "S002",
        name: "Priya Singh",
        department: "ECE",
        semester: 3,
        email: "priya@example.com",
      },
    ]);
  }

  if (!Storage.get("faculty")) {
    Storage.set("faculty", [
      {
        id: "F001",
        name: "Dr. Anitha",
        department: "CSE",
        subjects: ["DS", "Algorithms"],
      },
    ]);
  }
}

