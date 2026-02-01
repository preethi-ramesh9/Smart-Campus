import { requireAuth } from "./auth.js";
import { initShell } from "./app.js";
import { fetchAPI } from "./api.js";
import { $, createEl, showToast } from "./utils.js";

const session = requireAuth(); // all roles can access library
if (session) {
  initShell("library");
  initLibraryPage();
}

async function initLibraryPage() {
  $("#bookForm").addEventListener("submit", onBookSubmit);
  $("#issueForm").addEventListener("submit", onIssueSubmit);
  await renderBooks();
  await renderIssues();
}

async function getAllLibrary() {
  const res = await fetchAPI("/api/library", "GET");
  return res.data || [];
}

async function getBooks() {
  const all = await getAllLibrary();
  return all.filter((item) => item.type === "book");
}

async function getIssues() {
  const all = await getAllLibrary();
  return all.filter((item) => item.type === "issue");
}

async function onBookSubmit(e) {
  e.preventDefault();
  const id = $("#bookId").value.trim();
  const title = $("#bookTitle").value.trim();
  const author = $("#bookAuthor").value.trim();
  const copies = Number($("#bookCopies").value);

  if (!id || !title || !author || Number.isNaN(copies) || copies <= 0) {
    showToast("All fields are required and copies must be > 0", "error");
    return;
  }

  const existing = await getBooks();
  const idx = existing.findIndex((b) => b.id === id);
  const payload = { id, type: "book", title, author, copies };

  if (idx === -1) {
    await fetchAPI("/api/library", "POST", payload);
    showToast("Book added", "success");
  } else {
    await fetchAPI("/api/library", "PUT", payload);
    showToast("Book updated", "success");
  }

  $("#bookForm").reset();
  await renderBooks();
}

async function renderBooks() {
  const books = await getBooks();
  const tbody = $("#bookTableBody");
  tbody.innerHTML = "";
  books.forEach((b) => {
    const tr = createEl("tr", {}, [
      createEl("td", { text: b.id }),
      createEl("td", { text: b.title }),
      createEl("td", { text: b.author }),
      createEl("td", { text: b.copies }),
    ]);
    tbody.appendChild(tr);
  });
}

async function onIssueSubmit(e) {
  e.preventDefault();
  const bookId = $("#issueBookId").value.trim();
  const studentId = $("#issueStudentId").value.trim();
  const action = $("#issueAction").value; // issue or return

  if (!bookId || !studentId) {
    showToast("Book ID and Student ID are required", "error");
    return;
  }

  const books = await getBooks();
  const book = books.find((b) => b.id === bookId);
  if (!book) {
    showToast("Book not found", "error");
    return;
  }

  const issues = await getIssues();
  const currentlyIssuedCount = issues.filter(
    (i) => i.bookId === bookId && i.action === "issue"
  ).length;

  if (action === "issue" && currentlyIssuedCount >= book.copies) {
    showToast("No available copies to issue", "error");
    return;
  }

  const record = {
    id: `ISSUE_${Date.now()}`,
    type: "issue",
    bookId,
    studentId,
    action,
    date: new Date().toLocaleDateString(),
  };

  await fetchAPI("/api/library", "POST", record);
  showToast(`Book ${action === "issue" ? "issued" : "returned"}`, "success");
  $("#issueForm").reset();
  await renderIssues();
}

async function renderIssues() {
  const issues = await getIssues();
  const tbody = $("#issueTableBody");
  tbody.innerHTML = "";
  issues
    .slice()
    .reverse()
    .slice(0, 50)
    .forEach((i) => {
      const tr = createEl("tr", {}, [
        createEl("td", { text: i.bookId }),
        createEl("td", { text: i.studentId }),
        createEl("td", { text: i.action === "issue" ? "Issued" : "Returned" }),
        createEl("td", { text: i.date }),
      ]);
      tbody.appendChild(tr);
    });
}

