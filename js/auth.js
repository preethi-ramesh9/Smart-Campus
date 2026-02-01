// auth.js
// Frontend-only authentication and route guarding.

import { Storage } from "./storage.js";

export function getSession() {
  return Storage.get("session", null);
}

export function isAuthenticated() {
  return !!getSession();
}

export function requireAuth(allowedRoles = []) {
  const session = getSession();
  if (!session) {
    window.location.href = "login.html";
    return null;
  }

  if (allowedRoles.length && !allowedRoles.includes(session.role)) {
    // For now, redirect to dashboard if role not allowed
    window.location.href = "dashboard.html";
    return null;
  }

  return session;
}

export function logout() {
  Storage.remove("session");
  window.location.href = "login.html";
}

