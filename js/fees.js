import { requireAuth } from "./auth.js";
import { initShell } from "./app.js";
import { fetchAPI } from "./api.js";
import { $, createEl, showToast } from "./utils.js";

const session = requireAuth(["admin", "student"]);
if (session) {
  initShell("fees");
  initFeesPage();
}

async function initFeesPage() {
  if (session.role === "admin") {
    $("#feeForm").addEventListener("submit", onFeeSubmit);
  } else {
    // Students should not edit fee structures
    const formCard = document.getElementById("feeForm")?.closest(".card");
    if (formCard) formCard.classList.add("hidden");
  }
  $("#feePayForm").addEventListener("submit", onPaySubmit);
  await renderFees();
  await renderPayments();
}

async function getFees() {
  const res = await fetchAPI("/api/fees", "GET");
  return res.data || [];
}

async function onFeeSubmit(e) {
  e.preventDefault();
  const program = $("#feeProgram").value.trim();
  const tuition = Number($("#feeTuition").value);
  const exam = Number($("#feeExam").value);
  const other = Number($("#feeOther").value);

  if (!program || Number.isNaN(tuition) || Number.isNaN(exam) || Number.isNaN(other)) {
    showToast("All fields are required", "error");
    return;
  }

  const id = program;
  await fetchAPI("/api/fees", "POST", { id, program, tuition, exam, other });
  showToast("Fee structure saved", "success");
  $("#feeForm").reset();
  await renderFees();
}

async function renderFees() {
  const list = await getFees();
  const tbody = $("#feeTableBody");
  tbody.innerHTML = "";
  list.forEach((f) => {
    const total = (Number(f.tuition) || 0) + (Number(f.exam) || 0) + (Number(f.other) || 0);
    const tr = createEl("tr", {}, [
      createEl("td", { text: f.program }),
      createEl("td", { text: f.tuition }),
      createEl("td", { text: f.exam }),
      createEl("td", { text: f.other }),
      createEl("td", { text: total }),
    ]);
    tbody.appendChild(tr);
  });
}

async function getPayments() {
  const res = await fetchAPI("/api/feePayments", "GET");
  return res.data || [];
}

async function onPaySubmit(e) {
  e.preventDefault();
  const studentId = $("#payStudentId").value.trim();
  const program = $("#payProgram").value.trim();
  if (!studentId || !program) {
    showToast("Student and program are required", "error");
    return;
  }

  await fetchAPI("/api/feePayments", "POST", {
    id: `${studentId}_${program}`,
    studentId,
    program,
    status: "Paid",
  });
  showToast("Payment marked as Paid (demo)", "success");
  $("#feePayForm").reset();
  await renderPayments();
}

async function renderPayments() {
  const tbody = $("#paymentsTableBody");
  tbody.innerHTML = "";
  const payments = await getPayments();
  payments.forEach((p) => {
    const badgeClass =
      p.status === "Paid"
        ? "badge-soft success"
        : p.status === "Overdue"
        ? "badge-soft danger"
        : "badge-soft warning";
    const tr = createEl("tr", {}, [
      createEl("td", { text: p.studentId }),
      createEl("td", { text: p.program }),
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

