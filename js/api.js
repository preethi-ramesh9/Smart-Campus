// api.js
// Centralized API handler. All data access goes through here.
// Currently it works on top of localStorage via Storage module,
// but can later be replaced with real fetch() calls to a backend.

import { Storage } from "./storage.js";

// Simulate network latency for demo feel
const NETWORK_DELAY_MS = 150;

export async function fetchAPI(endpoint, method = "GET", data = null) {
  // For real backend, replace this switch with:
  // return fetch(BASE_URL + endpoint, {...})

  await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));

  switch (endpoint) {
    case "/api/login":
      return handleLogin(data);
    case "/api/students":
      return handleCollection("students", method, data);
    case "/api/faculty":
      return handleCollection("faculty", method, data);
    case "/api/attendance":
      return handleCollection("attendance", method, data);
    case "/api/courses":
      return handleCollection("courses", method, data);
    case "/api/exams":
      return handleCollection("exams", method, data);
    case "/api/fees":
      return handleCollection("fees", method, data);
    case "/api/feePayments":
      return handleCollection("feePayments", method, data);
    case "/api/notifications":
      return handleCollection("notifications", method, data);
    case "/api/library":
      return handleCollection("library", method, data);
    case "/api/placements":
      return handleCollection("placements", method, data);
    case "/api/timetable":
      return handleCollection("timetable", method, data);
    default:
      throw new Error(`Unknown endpoint: ${endpoint}`);
  }
}

function handleLogin({ username, password }) {
  // Very simple frontend-only auth check.
  // In production replace with backend JWT auth.
  const demoUsers = {
    admin: { password: "admin123", role: "admin", name: "Admin User" },
    faculty1: { password: "faculty123", role: "faculty", name: "Faculty User" },
    student1: { password: "student123", role: "student", name: "Student User" },
  };

  const userKey = username.toLowerCase();
  const demoUser = demoUsers[userKey];

  if (!demoUser || demoUser.password !== password) {
    return { ok: false, error: "Invalid username or password." };
  }

  const session = {
    username: userKey,
    role: demoUser.role,
    name: demoUser.name,
    loginAt: new Date().toISOString(),
  };

  Storage.set("session", session);
  return { ok: true, data: session };
}

function handleCollection(key, method, data) {
  const list = Storage.get(key, []);

  if (method === "GET") {
    return { ok: true, data: list };
  }

  if (method === "POST") {
    list.push(data);
    Storage.set(key, list);
    return { ok: true, data };
  }

  if (method === "PUT") {
    // expects data.id
    const idx = list.findIndex((item) => item.id === data.id);
    if (idx === -1) return { ok: false, error: "Not found" };
    list[idx] = data;
    Storage.set(key, list);
    return { ok: true, data };
  }

  if (method === "DELETE") {
    // expects data.id
    const idx = list.findIndex((item) => item.id === data.id);
    if (idx === -1) return { ok: false, error: "Not found" };
    list.splice(idx, 1);
    Storage.set(key, list);
    return { ok: true };
  }

  return { ok: false, error: "Unsupported method" };
}

