import { requireAuth } from "./auth.js";
import { initShell } from "./app.js";
import { fetchAPI } from "./api.js";
import { $, createEl, showToast } from "./utils.js";

const session = requireAuth(["admin", "faculty", "student"]);
if (session) {
  initShell("timetable");
  initTimetablePage();
}

async function initTimetablePage() {
  if (session.role === "student") {
    const formCard = document.getElementById("timetableForm")?.closest(".card");
    if (formCard) formCard.classList.add("hidden");
  } else {
    $("#timetableForm").addEventListener("submit", onTimetableSubmit);
  }
  await renderTimetable();
}

async function getTimetable() {
  const res = await fetchAPI("/api/timetable", "GET");
  return res.data || [];
}

async function onTimetableSubmit(e) {
  e.preventDefault();
  const day = $("#ttDay").value;
  const period = Number($("#ttPeriod").value);
  const className = $("#ttClass").value.trim();
  const course = $("#ttCourse").value.trim();
  const faculty = $("#ttFaculty").value.trim();

  if (!day || !period || !className || !course || !faculty) {
    showToast("All fields are required", "error");
    return;
  }

  const id = `${day}_${period}_${className}`;
  await fetchAPI("/api/timetable", "POST", { id, day, period, className, course, faculty });
  showToast("Timetable slot saved", "success");
  $("#timetableForm").reset();
  await renderTimetable();
}

async function renderTimetable() {
  const list = await getTimetable();
  const tbody = $("#timetableTableBody");
  tbody.innerHTML = "";
  let visible = list;

  // For faculty, show only the slots where this faculty has classes
  if (session.role === "faculty") {
    const key = (session.name || "").toLowerCase();
    visible = list.filter(
      (t) => (t.faculty || "").toLowerCase() === key
    );
  }

  visible
    .slice()
    .sort((a, b) => a.day.localeCompare(b.day) || a.period - b.period)
    .forEach((t) => {
      const tr = createEl("tr", {}, [
        createEl("td", { text: t.day }),
        createEl("td", { text: t.period }),
        createEl("td", { text: t.className }),
        createEl("td", { text: t.course }),
        createEl("td", { text: t.faculty }),
      ]);
      tbody.appendChild(tr);
    });
}

