import { requireAuth } from "./auth.js";
import { initShell } from "./app.js";
import { fetchAPI } from "./api.js";
import { $, createEl, showToast } from "./utils.js";

const session = requireAuth(["admin", "faculty", "student"]);
if (session) {
  initShell("attendance");
  initAttendancePage();
}

async function initAttendancePage() {
  // Students can only view, not mark attendance
  if (session.role === "student") {
    const formCard = document.getElementById("attendanceForm")?.closest(".card");
    if (formCard) formCard.classList.add("hidden");
  } else {
    $("#attendanceForm").addEventListener("submit", onAttendanceSubmit);
  }
  $("#summaryForm").addEventListener("submit", onSummarySubmit);
  await renderAttendance();
}

async function getAttendance() {
  const res = await fetchAPI("/api/attendance", "GET");
  return res.data || [];
}

async function onAttendanceSubmit(e) {
  e.preventDefault();
  if (session.role === "student") {
    showToast("Students cannot modify attendance.", "error");
    return;
  }
  const date = $("#attDate").value;
  const className = $("#attClass").value.trim();
  const studentId = $("#attStudentId").value.trim();
  const status = $("#attStatus").value;

  if (!date || !className || !studentId) {
    showToast("All fields are required", "error");
    return;
  }

  const record = {
    id: `${date}_${className}_${studentId}`,
    date,
    className,
    studentId,
    status,
  };

  // simple: always POST (allow duplicates as multiple days/periods)
  await fetchAPI("/api/attendance", "POST", record);
  showToast("Attendance saved", "success");
  $("#attendanceForm").reset();
  await renderAttendance();
}

async function renderAttendance() {
  const list = await getAttendance();
  const tbody = $("#attendanceTableBody");
  tbody.innerHTML = "";
  list
    .slice()
    .reverse()
    .slice(0, 50)
    .forEach((r) => {
      const tr = createEl("tr", {}, [
        createEl("td", { text: r.date }),
        createEl("td", { text: r.className }),
        createEl("td", { text: r.studentId }),
        createEl("td", { text: r.status === "present" ? "Present" : "Absent" }),
      ]);
      tbody.appendChild(tr);
    });
}

async function onSummarySubmit(e) {
  e.preventDefault();
  const studentId = $("#summaryStudentId").value.trim();
  const resultEl = $("#summaryResult");

  if (!studentId) {
    resultEl.textContent = "Enter a student ID.";
    return;
  }

  const list = await getAttendance();
  const records = list.filter((r) => r.studentId.toLowerCase() === studentId.toLowerCase());
  if (!records.length) {
    resultEl.textContent = "No attendance records for this student.";
    return;
  }

  const total = records.length;
  const present = records.filter((r) => r.status === "present").length;
  const percent = Math.round((present / total) * 100);
  const shortage = percent < 75;

  resultEl.innerHTML = `
    <div><strong>Student:</strong> ${studentId}</div>
    <div><strong>Present:</strong> ${present} / ${total}</div>
    <div><strong>Percentage:</strong> ${percent}%</div>
    <div class="${shortage ? "text-danger" : ""}" style="margin-top:4px;">
      ${shortage ? "Shortage: below 75%. Alert required." : "Sufficient attendance."}
    </div>
  `;
}

