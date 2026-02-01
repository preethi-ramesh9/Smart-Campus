import { requireAuth } from "./auth.js";
import { initShell } from "./app.js";
import { fetchAPI } from "./api.js";
import { $, createEl, showToast } from "./utils.js";

const session = requireAuth(["admin", "faculty", "student"]);
if (session) {
  initShell("placements");
  initPlacementsPage();
}

async function initPlacementsPage() {
  if (session.role === "student") {
    // Students can apply; companies/news posted by admin/faculty
    $("#companyForm").classList.add("hidden");
    // Optionally prefill student ID when known
  } else {
    $("#companyForm").addEventListener("submit", onCompanySubmit);
  }
  $("#placementForm").addEventListener("submit", onPlacementSubmit);
  await renderCompanies();
  await renderPlacements();
}

async function getCompanies() {
  const res = await fetchAPI("/api/placements", "GET");
  return (res.data || []).filter((i) => i.type === "company");
}

async function getPlacements() {
  const res = await fetchAPI("/api/placements", "GET");
  return (res.data || []).filter((i) => i.type === "placement");
}

async function onCompanySubmit(e) {
  e.preventDefault();
  const name = $("#companyName").value.trim();
  const minCgpa = Number($("#companyCgpa").value);
  const roles = $("#companyRoles").value.trim();

  if (!name || Number.isNaN(minCgpa)) {
    showToast("Company and min CGPA are required", "error");
    return;
  }

  const id = `COMP_${name.toLowerCase().replace(/\s+/g, "_")}`;
  await fetchAPI("/api/placements", "POST", {
    id,
    type: "company",
    name,
    minCgpa,
    roles,
  });
  showToast("Company saved", "success");
  $("#companyForm").reset();
  await renderCompanies();
}

async function renderCompanies() {
  const list = await getCompanies();
  const tbody = $("#companyTableBody");
  tbody.innerHTML = "";
  list.forEach((c) => {
    const tr = createEl("tr", {}, [
      createEl("td", { text: c.name }),
      createEl("td", { text: c.minCgpa }),
      createEl("td", { text: c.roles || "" }),
    ]);
    tbody.appendChild(tr);
  });
}

async function onPlacementSubmit(e) {
  e.preventDefault();
  const studentId = $("#placeStudentId").value.trim();
  const company = $("#placeCompany").value.trim();
  const status = $("#placeStatus").value;

  if (!studentId || !company) {
    showToast("Student and company are required", "error");
    return;
  }

  const id = `PLC_${studentId}_${company}_${Date.now()}`;
  await fetchAPI("/api/placements", "POST", {
    id,
    type: "placement",
    studentId,
    company,
    status,
  });
  showToast("Placement status updated", "success");
  $("#placementForm").reset();
  await renderPlacements();
}

async function renderPlacements() {
  const list = await getPlacements();
  const tbody = $("#placementTableBody");
  tbody.innerHTML = "";
  list
    .slice()
    .reverse()
    .forEach((p) => {
      const badgeClass =
        p.status === "selected"
          ? "badge-soft success"
          : p.status === "shortlisted"
          ? "badge-soft warning"
          : p.status === "rejected"
          ? "badge-soft danger"
          : "badge-soft";
      const tr = createEl("tr", {}, [
        createEl("td", { text: p.studentId }),
        createEl("td", { text: p.company }),
        (() => {
          const span = createEl("span", { class: `badge ${badgeClass}` }, [p.status]);
          const td = createEl("td", {}, []);
          td.appendChild(span);
          return td;
        })(),
      ]);
      tbody.appendChild(tr);
    });
}

