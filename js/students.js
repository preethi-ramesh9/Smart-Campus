import { requireAuth } from "./auth.js";
import { initShell } from "./app.js";
import { fetchAPI } from "./api.js";
import { $, $all, createEl, showToast } from "./utils.js";

const session = requireAuth(["admin", "faculty"]);
if (session) {
  initShell("students");
  initStudentsPage();
}

let editingId = null;

async function initStudentsPage() {
  $("#addStudentBtn").addEventListener("click", () => openStudentModal());
  $("#studentModalClose").addEventListener("click", closeStudentModal);
  $("#studentCancel").addEventListener("click", closeStudentModal);
  $("#studentSearch").addEventListener("input", renderStudents);
  $("#studentForm").addEventListener("submit", onStudentFormSubmit);

  await renderStudents();
}

async function getStudents() {
  const res = await fetchAPI("/api/students", "GET");
  return res.data || [];
}

async function renderStudents() {
  const students = await getStudents();
  const tbody = $("#studentsTableBody");
  const emptyEl = $("#studentsEmpty");
  const query = $("#studentSearch").value.trim().toLowerCase();

  tbody.innerHTML = "";
  let filtered = students;
  if (query) {
    filtered = students.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.id.toLowerCase().includes(query) ||
        s.department.toLowerCase().includes(query)
    );
  }

  if (!filtered.length) {
    emptyEl.classList.remove("hidden");
    return;
  }
  emptyEl.classList.add("hidden");

  filtered.forEach((s) => {
    const tr = createEl("tr", {}, [
      createEl("td", { text: s.id }),
      createEl("td", { text: s.name }),
      createEl("td", { text: s.department }),
      createEl("td", { text: s.semester }),
      createEl("td", { text: s.email }),
      createEl("td", {}, [
        (() => {
          const btnEdit = createEl("button", { class: "btn btn-secondary", type: "button" }, ["Edit"]);
          btnEdit.addEventListener("click", () => openStudentModal(s));
          const btnDel = createEl(
            "button",
            { class: "btn btn-ghost", type: "button" },
            ["Delete"]
          );
          btnDel.addEventListener("click", () => deleteStudent(s.id));
          const wrapper = createEl("div", {}, [btnEdit, btnDel]);
          wrapper.style.display = "flex";
          wrapper.style.gap = "4px";
          return wrapper;
        })(),
      ]),
    ]);
    tbody.appendChild(tr);
  });
}

function openStudentModal(student = null) {
  const backdrop = $("#studentModalBackdrop");
  backdrop.classList.remove("hidden");
  const title = $("#studentModalTitle");

  if (student) {
    editingId = student.id;
    title.textContent = "Edit Student";
    $("#studentId").value = student.id;
    $("#studentId").disabled = true;
    $("#studentName").value = student.name;
    $("#studentDept").value = student.department;
    $("#studentSem").value = student.semester;
    $("#studentEmail").value = student.email;
  } else {
    editingId = null;
    title.textContent = "Add Student";
    $("#studentForm").reset();
    $("#studentId").disabled = false;
  }
}

function closeStudentModal() {
  $("#studentModalBackdrop").classList.add("hidden");
}

async function onStudentFormSubmit(e) {
  e.preventDefault();
  const id = $("#studentId").value.trim();
  const name = $("#studentName").value.trim();
  const department = $("#studentDept").value;
  const semester = Number($("#studentSem").value);
  const email = $("#studentEmail").value.trim();

  if (!id || !name || !department || !semester || !email) {
    showToast("Please fill all fields", "error");
    return;
  }

  if (!editingId) {
    // create
    const existing = await getStudents();
    if (existing.some((s) => s.id === id)) {
      showToast("Student ID already exists", "error");
      return;
    }
    await fetchAPI("/api/students", "POST", { id, name, department, semester, email });
    showToast("Student added", "success");
  } else {
    await fetchAPI("/api/students", "PUT", { id, name, department, semester, email });
    showToast("Student updated", "success");
  }

  closeStudentModal();
  await renderStudents();
}

async function deleteStudent(id) {
  if (!confirm("Delete this student?")) return;
  await fetchAPI("/api/students", "DELETE", { id });
  showToast("Student deleted", "success");
  await renderStudents();
}

