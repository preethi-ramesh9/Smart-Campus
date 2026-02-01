import { requireAuth } from "./auth.js";
import { initShell } from "./app.js";
import { fetchAPI } from "./api.js";
import { $, createEl, showToast } from "./utils.js";

const session = requireAuth(["admin", "faculty", "student"]);
if (session) {
  initShell("exams");
  initExamsPage();
}

async function initExamsPage() {
  if (session.role === "student") {
    const marksCard = document.getElementById("marksForm")?.closest(".card");
    if (marksCard) marksCard.classList.add("hidden");
  } else {
    $("#marksForm").addEventListener("submit", onMarksSubmit);
  }
  $("#resultForm").addEventListener("submit", onResultSubmit);
  await renderMarks();
}

async function getMarks() {
  const res = await fetchAPI("/api/exams", "GET");
  return res.data || [];
}

function gradeFromScore(score) {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  if (score >= 40) return "E";
  return "F";
}

function gradePoint(grade) {
  const map = { S: 10, A: 9, B: 8, C: 7, D: 6, E: 5, F: 0 };
  return map[grade] ?? 0;
}

async function onMarksSubmit(e) {
  e.preventDefault();
  if (session.role === "student") {
    showToast("Students cannot enter marks.", "error");
    return;
  }
  const studentId = $("#marksStudentId").value.trim();
  const courseCode = $("#marksCourseCode").value.trim();
  const type = $("#marksType").value;
  const score = Number($("#marksScore").value);

  if (!studentId || !courseCode || Number.isNaN(score)) {
    showToast("All fields are required", "error");
    return;
  }

  const grade = gradeFromScore(score);
  const record = {
    id: `${studentId}_${courseCode}_${type}_${Date.now()}`,
    studentId,
    courseCode,
    type,
    score,
    grade,
  };

  await fetchAPI("/api/exams", "POST", record);
  showToast("Marks saved", "success");
  $("#marksForm").reset();
  await renderMarks();
}

async function renderMarks() {
  const list = await getMarks();
  const tbody = $("#marksTableBody");
  tbody.innerHTML = "";
  list
    .slice()
    .reverse()
    .slice(0, 50)
    .forEach((m) => {
      const tr = createEl("tr", {}, [
        createEl("td", { text: m.studentId }),
        createEl("td", { text: m.courseCode }),
        createEl("td", { text: m.type }),
        createEl("td", { text: m.score }),
        createEl("td", { text: m.grade }),
      ]);
      tbody.appendChild(tr);
    });
}

async function onResultSubmit(e) {
  e.preventDefault();
  const studentId = $("#resultStudentId").value.trim();
  const resultEl = $("#resultContent");
  if (!studentId) {
    resultEl.textContent = "Enter a student ID.";
    return;
  }

  const list = await getMarks();
  const records = list.filter((m) => m.studentId.toLowerCase() === studentId.toLowerCase());
  if (!records.length) {
    resultEl.textContent = "No marks for this student.";
    return;
  }

  let totalPoints = 0;
  let totalCredits = 0;
  const rows = records
    .map((r) => {
      const credits = 3;
      const gp = gradePoint(r.grade);
      totalPoints += gp * credits;
      totalCredits += credits;
      return `<tr><td>${r.courseCode}</td><td>${r.type}</td><td>${r.score}</td><td>${r.grade}</td></tr>`;
    })
    .join("");
  const cgpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : "0.00";

  resultEl.innerHTML = `
    <table class="table compact">
      <thead>
        <tr><th>Course</th><th>Type</th><th>Marks</th><th>Grade</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="mt-sm"><strong>CGPA (demo):</strong> ${cgpa}</div>
  `;
}

