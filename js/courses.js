import { requireAuth } from "./auth.js";
import { initShell } from "./app.js";
import { fetchAPI } from "./api.js";
import { $, createEl, showToast } from "./utils.js";

const session = requireAuth(["admin", "faculty", "student"]);
if (session) {
  initShell("courses");
  initCoursesPage();
}

let editingCode = null;

async function initCoursesPage() {
  $("#addCourseBtn").addEventListener("click", () => openCourseModal());
  $("#courseModalClose").addEventListener("click", closeCourseModal);
  $("#courseCancel").addEventListener("click", closeCourseModal);
  $("#courseSearch").addEventListener("input", renderCourses);
  $("#courseForm").addEventListener("submit", onCourseFormSubmit);

  await renderCourses();
}

async function getCourses() {
  const res = await fetchAPI("/api/courses", "GET");
  return res.data || [];
}

async function renderCourses() {
  const list = await getCourses();
  const tbody = $("#courseTableBody");
  const emptyEl = $("#courseEmpty");
  const query = $("#courseSearch").value.trim().toLowerCase();

  tbody.innerHTML = "";
  let filtered = list;
  if (query) {
    filtered = list.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query) ||
        c.department.toLowerCase().includes(query)
    );
  }

  if (!filtered.length) {
    emptyEl.classList.remove("hidden");
    return;
  }
  emptyEl.classList.add("hidden");

  filtered.forEach((c) => {
    const tr = createEl("tr", {}, [
      createEl("td", { text: c.code }),
      createEl("td", { text: c.name }),
      createEl("td", { text: c.department }),
      createEl("td", { text: c.semester }),
      createEl("td", { text: c.credits }),
      createEl("td", {}, [
        (() => {
          const btnEdit = createEl("button", { class: "btn btn-secondary", type: "button" }, ["Edit"]);
          btnEdit.addEventListener("click", () => openCourseModal(c));
          const btnDel = createEl(
            "button",
            { class: "btn btn-ghost", type: "button" },
            ["Delete"]
          );
          btnDel.addEventListener("click", () => deleteCourse(c.code));
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

function openCourseModal(course = null) {
  const backdrop = $("#courseModalBackdrop");
  backdrop.classList.remove("hidden");
  const title = $("#courseModalTitle");

  if (course) {
    editingCode = course.code;
    title.textContent = "Edit Course";
    $("#courseCode").value = course.code;
    $("#courseCode").disabled = true;
    $("#courseName").value = course.name;
    $("#courseDept").value = course.department;
    $("#courseSemester").value = course.semester;
    $("#courseCredits").value = course.credits;
  } else {
    editingCode = null;
    title.textContent = "Add Course";
    $("#courseForm").reset();
    $("#courseCode").disabled = false;
  }
}

function closeCourseModal() {
  $("#courseModalBackdrop").classList.add("hidden");
}

async function onCourseFormSubmit(e) {
  e.preventDefault();
  const code = $("#courseCode").value.trim();
  const name = $("#courseName").value.trim();
  const department = $("#courseDept").value;
  const semester = Number($("#courseSemester").value);
  const credits = Number($("#courseCredits").value);

  if (!code || !name || !department || !semester || !credits) {
    showToast("All fields are required", "error");
    return;
  }

  if (!editingCode) {
    const existing = await getCourses();
    if (existing.some((c) => c.code === code)) {
      showToast("Course code already exists", "error");
      return;
    }
    await fetchAPI("/api/courses", "POST", { id: code, code, name, department, semester, credits });
    showToast("Course added", "success");
  } else {
    await fetchAPI("/api/courses", "PUT", { id: code, code, name, department, semester, credits });
    showToast("Course updated", "success");
  }

  closeCourseModal();
  await renderCourses();
}

async function deleteCourse(code) {
  if (!confirm("Delete this course?")) return;
  await fetchAPI("/api/courses", "DELETE", { id: code });
  showToast("Course deleted", "success");
  await renderCourses();
}

