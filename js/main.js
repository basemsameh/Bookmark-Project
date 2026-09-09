"use strict";

// --- State Management ---
const state = {
  bookmarks: JSON.parse(localStorage.getItem("bookmarks")) || [],
  currentTheme: localStorage.getItem("theme") || "dark",
  mode: "create",
  editBookmarkNo: null,
};

// --- DOM Elements ---
const elements = {
  siteName: document.querySelector("#siteName"),
  siteURL: document.querySelector("#siteURL"),
  submitBtn: document.querySelector("button"),
  tableData: document.querySelector("#tableData"),
  themeBtn: document.querySelector("#themeBtn i"),
  addBookmarkBtn: document.querySelector("#addBtn"),
  form: document.querySelector("form"),
  tableContainer: document.querySelector("#table-container"),
  toast: document.getElementById("successToast"),
};

// --- Helpers ---
const saveBookmarks = () => localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));

const escapeHTML = (str = "") =>
  str.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

// --- Core Functions ---
function initApp() {
  // Initialize Bootstrap Tooltips
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => new bootstrap.Tooltip(el));

  applyTheme(state.currentTheme);
  renderBookmarks();
  setupEventListeners();
}

function applyTheme(theme) {
  state.currentTheme = theme;
  localStorage.setItem("theme", theme);
  document.body.classList.toggle("black", theme === "dark");

  if (elements.themeBtn) {
    elements.themeBtn.className = `fa-solid fa-${theme === "light" ? "sun" : "moon"}`;
  }
}

function toggleTheme() {
  applyTheme(state.currentTheme === "light" ? "dark" : "light");
}

function renderBookmarks() {
  if (!elements.tableData) return;

  if (state.bookmarks.length === 0) {
    elements.tableData.innerHTML = `
      <tr>
        <td colspan="3" class="text-center py-5 fs-4 fw-bold">No Bookmarks To Show</td>
      </tr>`;
    return;
  }

  elements.tableData.innerHTML = state.bookmarks
    .map((item, index) => {
      const displayNo = item.no ?? index + 1;
      const safeName = escapeHTML(item.name);
      const safeUrl = escapeHTML(item.url);

      return `
        <tr>
          <td>${displayNo}</td>
          <td>${safeName}</td>
          <td>
            <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-primary">
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
            <button data-action="edit" data-index="${index}" class="btn btn-outline-info mx-2">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button data-action="delete" data-index="${index}" class="btn btn-outline-danger">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>`;
    })
    .join("");
}

function handleFormSubmit(e) {
  // Prevent form submission from reloading the page
  if (e) e.preventDefault();

  const name = elements.siteName?.value.trim();
  const url = elements.siteURL?.value.trim();

  if (!name || !url) return;

  let isEditing = state.mode === "edit";

  if (state.mode === "create") {
    state.bookmarks.push({ name, url, no: state.bookmarks.length + 1 });
    showToast("Bookmark Added Successfully");
  } else if (isEditing && state.editBookmarkNo !== null) {
    const targetIndex = state.bookmarks.findIndex((b, idx) => (b.no ?? idx + 1) === state.editBookmarkNo);
    if (targetIndex !== -1) {
      state.bookmarks[targetIndex] = { ...state.bookmarks[targetIndex], name, url };
      showToast("Bookmark Edited Successfully");
    }
  }

  saveBookmarks();
  resetForm();
  renderBookmarks();

  // Hide the form automatically if the user just completed an edit
  if (isEditing) {
    closeBookmarkForm();
  }
}

function handleEdit(index) {
  const bookmark = state.bookmarks[index];
  if (!bookmark) return;

  if (elements.siteName) elements.siteName.value = bookmark.name;
  if (elements.siteURL) elements.siteURL.value = bookmark.url;

  state.editBookmarkNo = bookmark.no ?? index + 1;
  openBookmarkForm("edit");
}

function handleDelete(index) {
  const bookmark = state.bookmarks[index];
  if (!bookmark) return;

  // Ask user for confirmation
  const isConfirmed = window.confirm(`Are you sure you want to delete "${bookmark.name}"?`);

  if (isConfirmed) {
    state.bookmarks.splice(index, 1);
    saveBookmarks();
    renderBookmarks();
    showToast("Bookmark Deleted Successfully");
  }
}

function resetForm() {
  state.editBookmarkNo = null;
  state.mode = "create";
  if (elements.siteName) elements.siteName.value = "";
  if (elements.siteURL) elements.siteURL.value = "";
}

function openBookmarkForm(status = "create") {
  state.mode = status;
  const { form, addBookmarkBtn, tableContainer } = elements;
  if (!form || !addBookmarkBtn || !tableContainer) return;

  form.classList.remove("hide");
  addBookmarkBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
  tableContainer.className = "col-12 col-lg-8 ps-lg-3";
}

function closeBookmarkForm() {
  state.mode = "create";
  const { form, addBookmarkBtn, tableContainer } = elements;
  if (!form || !addBookmarkBtn || !tableContainer) return;

  form.classList.add("hide");
  addBookmarkBtn.innerHTML = `<i class="fa-solid fa-plus"></i>`;
  tableContainer.className = "col-12";
}

function toggleBookmarkForm(status) {
  const { form } = elements;
  if (!form) return;

  if (form.classList.contains("hide")) {
    openBookmarkForm(status);
  } else {
    closeBookmarkForm();
  }
}

function showToast(message) {
  if (!elements.toast) return;
  const toastBody = elements.toast.querySelector(".toast-body");
  if (toastBody) toastBody.textContent = message;
  bootstrap.Toast.getOrCreateInstance(elements.toast).show();
}

// --- Event Listeners ---
function setupEventListeners() {
  // Theme Switcher
  if (elements.themeBtn) elements.themeBtn.addEventListener("click", toggleTheme);

  // Form Submit Handler
  if (elements.form) {
    elements.form.addEventListener("submit", handleFormSubmit);
  } else if (elements.submitBtn) {
    elements.submitBtn.addEventListener("click", handleFormSubmit);
  }

  // Toggle Add Bookmark Form
  if (elements.addBookmarkBtn) {
    elements.addBookmarkBtn.addEventListener("click", () => toggleBookmarkForm("create"));
  }

  // Event Delegation for Table Actions (Edit / Delete)
  if (elements.tableData) {
    elements.tableData.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;

      const index = parseInt(btn.dataset.index, 10);
      if (btn.dataset.action === "edit") handleEdit(index);
      if (btn.dataset.action === "delete") handleDelete(index);
    });
  }
}

// Global exposure for legacy inline HTML attributes if needed
window.displayBookmarkForm = toggleBookmarkForm;

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", initApp);