import { requireAuth } from "./auth.js";
import { initShell } from "./app.js";
import { fetchAPI } from "./api.js";
import { $, createEl, showToast } from "./utils.js";

const session = requireAuth(["admin"]);
if (session) {
  initShell("faculty");
  initFacultyPage();
}

let editingId = null;

async function initFacultyPage() {
  $("#addFacultyBtn").addEventListener("click", () => openFacultyModal());
  $("#facultyModalClose").addEventListener("click", closeFacultyModal);
  $("#facultyCancel").addEventListener("click", closeFacultyModal);
  $("#facultySearch").addEventListener("input", renderFaculty);
  $("#facultyForm").addEventListener("submit", onFacultyFormSubmit);

  await renderFaculty();
}

async function getFaculty() {
  const res = await fetchAPI("/api/faculty", "GET");
  return res.data || [];
}

async function renderFaculty() {
  const list = await getFaculty();
  const tbody = $("#facultyTableBody");
  const emptyEl = $("#facultyEmpty");
  const query = $("#facultySearch").value.trim().toLowerCase();

  tbody.innerHTML = "";
  let filtered = list;
  if (query) {
    filtered = list.filter(
      (f) =>
        f.name.toLowerCase().includes(query) ||
        f.id.toLowerCase().includes(query) ||
        f.department.toLowerCase().includes(query)
    );
  }

  if (!filtered.length) {
    emptyEl.classList.remove("hidden");
    return;
  }
  emptyEl.classList.add("hidden");

  filtered.forEach((f) => {
    const tr = createEl("tr", {}, [
      createEl("td", { text: f.id }),
      createEl("td", { text: f.name }),
      createEl("td", { text: f.department }),
      createEl("td", { text: (f.subjects || []).join(", ") }),
      createEl("td", {}, [
        (() => {
          const btnEdit = createEl("button", { class: "btn btn-secondary", type: "button" }, ["Edit"]);
          btnEdit.addEventListener("click", () => openFacultyModal(f));
          const btnDel = createEl(
            "button",
            { class: "btn btn-ghost", type: "button" },
            ["Delete"]
          );
          btnDel.addEventListener("click", () => deleteFaculty(f.id));
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

function openFacultyModal(faculty = null) {
  const backdrop = $("#facultyModalBackdrop");
  backdrop.classList.remove("hidden");
  const title = $("#facultyModalTitle");

  if (faculty) {
    editingId = faculty.id;
    title.textContent = "Edit Faculty";
    $("#facultyId").value = faculty.id;
    $("#facultyId").disabled = true;
    $("#facultyName").value = faculty.name;
    $("#facultyDept").value = faculty.department;
    $("#facultySubjects").value = (faculty.subjects || []).join(", ");
  } else {
    editingId = null;
    title.textContent = "Add Faculty";
    $("#facultyForm").reset();
    $("#facultyId").disabled = false;
  }
}

function closeFacultyModal() {
  $("#facultyModalBackdrop").classList.add("hidden");
}

async function onFacultyFormSubmit(e) {
  e.preventDefault();
  const id = $("#facultyId").value.trim();
  const name = $("#facultyName").value.trim();
  const department = $("#facultyDept").value;
  const subjectsStr = $("#facultySubjects").value.trim();
  const subjects = subjectsStr ? subjectsStr.split(",").map((s) => s.trim()).filter(Boolean) : [];

  if (!id || !name || !department) {
    showToast("ID, Name and Department are required", "error");
    return;
  }

  if (!editingId) {
    const existing = await getFaculty();
    if (existing.some((f) => f.id === id)) {
      showToast("Faculty ID already exists", "error");
      return;
    }
    await fetchAPI("/api/faculty", "POST", { id, name, department, subjects });
    showToast("Faculty added", "success");
  } else {
    await fetchAPI("/api/faculty", "PUT", { id, name, department, subjects });
    showToast("Faculty updated", "success");
  }

  closeFacultyModal();
  await renderFaculty();
}

async function deleteFaculty(id) {
  if (!confirm("Delete this faculty member?")) return;
  await fetchAPI("/api/faculty", "DELETE", { id });
  showToast("Faculty deleted", "success");
  await renderFaculty();
}

