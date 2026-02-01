// app.js
// Common page bootstrap: sidebar nav, logout, session display, seeding demo data.

import { getSession, logout } from "./auth.js";
import { setActiveNav, $, showToast } from "./utils.js";
import { seedDemoData } from "./storage.js";

seedDemoData();

export function initShell(currentPageId) {
  const session = getSession();
  const userLabel = $("#currentUserLabel");
  if (session && userLabel) {
    userLabel.textContent = `${session.name} (${session.role})`;
  }

  const logoutBtn = $("#logoutButton");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      logout();
    });
  }

  // Role-based navigation visibility
  if (session) {
    const pageRoles = {
      // admin sees everything; faculty and student limited
      dashboard: ["admin", "faculty", "student"],
      students: ["admin", "faculty"],
      faculty: ["admin"],
      attendance: ["admin", "faculty", "student"],
      courses: ["admin", "faculty", "student"],
      exams: ["admin", "faculty", "student"],
      fees: ["admin", "student"],
      timetable: ["admin", "faculty", "student"],
      materials: ["student"],
      notifications: ["admin", "faculty", "student"],
      library: ["admin", "faculty", "student"],
      placements: ["admin", "faculty", "student"],
      settings: ["admin", "faculty", "student"],
    };

    const role = session.role;
    document.querySelectorAll(".nav-item").forEach((item) => {
      const page = item.dataset.page;
      const allowed = pageRoles[page] || ["admin"];
      if (!allowed.includes(role)) {
        item.classList.add("hidden");
      }
    });
  }

  setActiveNav(currentPageId);

  // Nav links use plain href, but we keep a small UX touch with toasts
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const label = item.querySelector("span:nth-child(2)");
      if (label) {
        showToast(`Opening ${label.textContent}...`, "info", 1200);
      }
    });
  });
}

