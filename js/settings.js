import { requireAuth } from "./auth.js";
import { initShell } from "./app.js";
import { Storage } from "./storage.js";
import { $, showToast } from "./utils.js";

const session = requireAuth();
if (session) {
  initShell("settings");
  initSettingsPage();
}

function initSettingsPage() {
  const form = $("#settingsForm");
  const saved = Storage.get("preferences", { rowsPerPage: 20, theme: "dark" });

  $("#rowsPerPage").value = saved.rowsPerPage;
  $("#themeToggle").value = saved.theme;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const rows = Number($("#rowsPerPage").value) || 20;
    const theme = $("#themeToggle").value;
    Storage.set("preferences", { rowsPerPage: rows, theme });
    showToast("Settings saved (frontend only)", "success");
  });
}

