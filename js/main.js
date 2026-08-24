"use strict";
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
let siteName = document.querySelector("#siteName");
let siteURL = document.querySelector("#siteURL");
const submitBtn = document.querySelector("button");
const tableData = document.querySelector("#tableData");
const themeBtn = document.querySelector("#themeBtn i");
const addBookmarkBtn = document.querySelector("#addBtn");
let editBookmarkNo = 0;
let mode = "create";
let currentTheme = "dark";
let bookmarks = [];
if (localStorage.getItem("theme") !== null) {
    currentTheme = localStorage.getItem("theme") ?? "dark";
    checkTheme();
}
else {
    currentTheme = "light";
    localStorage.setItem("theme", currentTheme);
    checkTheme();
}
if (currentTheme === "light") {
    if (themeBtn)
        themeBtn.className = "fa-solid fa-sun";
}
else {
    if (themeBtn)
        themeBtn.className = "fa-solid fa-moon";
}
if (localStorage.getItem("bookmarks") !== null) {
    bookmarks = JSON.parse(localStorage?.getItem("bookmarks") ?? "");
}
else {
    bookmarks = [];
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}
displayData();
function add() {
    if (!siteName?.value || !siteURL?.value)
        return;
    const maxNo = bookmarks.length + 1;
    let bookmarker = {
        name: siteName?.value,
        url: siteURL?.value,
        no: maxNo,
    };
    bookmarks.push(bookmarker);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    clearInpts();
    displayData();
    displayToast("edit");
}
function clearInpts() {
    editBookmarkNo = 0;
    if (siteName)
        siteName.value = "";
    if (siteURL)
        siteURL.value = "";
}
function deleteData(index) {
    bookmarks.splice(index, 1);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    displayData();
    displayToast("delete");
}
function assignInputValues(index) {
    const bookmark = {
        name: bookmarks[index].name,
        url: bookmarks[index].url,
        no: bookmarks[index].no ?? index + 1,
    };
    if (siteName)
        siteName.value = bookmark.name;
    if (siteURL)
        siteURL.value = bookmark.url;
    editBookmarkNo = bookmark.no;
    displayBookmarkForm("edit");
}
function updateBookmark(index) {
    bookmarks[index].name = siteName?.value ?? "";
    bookmarks[index].url = siteURL?.value ?? "";
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    clearInpts();
    displayData();
    displayToast("edit");
}
function displayData() {
    if (!tableData)
        return;
    tableData.innerHTML = "";
    bookmarks = JSON.parse(localStorage.getItem("bookmarks") ?? "");
    let container = ``;
    if (bookmarks.length === 0) {
        container = `<td colspan="3" class="text-center py-5 fs-4 fw-bold">No Bookmarks To Show</td>`;
    }
    else {
        for (let i = 0; i < bookmarks.length; i++) {
            container += `
            <tr>
                <td>${bookmarks[i].no ?? i + 1}</td>
                <td>${bookmarks[i].name}</td>
                <td>
                    <a
                        href="${bookmarks[i].url}" 
                        class="btn btn-outline-primary">Visit
                    </a>
                    <button
                        onclick="assignInputValues(${i})"
                        class="btn btn-outline-secondary"
                        >Update
                    </button>
                    <button
                        onclick="deleteData(${i})"
                        class="btn btn-outline-danger"
                        >Delete
                    </button>
                </td>
            </tr>
            `;
        }
    }
    tableData.innerHTML = container;
}
function checkTheme() {
    currentTheme === "light"
        ? document.body.classList.remove("black")
        : document.body.classList.add("black");
}
function changeTheme() {
    if (!themeBtn)
        return;
    if (themeBtn.className === "fa-solid fa-moon") {
        currentTheme = "light";
        themeBtn.className = "fa-solid fa-sun";
    }
    else {
        currentTheme = "dark";
        themeBtn.className = "fa-solid fa-moon";
    }
    localStorage.setItem("theme", currentTheme);
    currentTheme = localStorage.getItem("theme") ?? "";
    checkTheme();
}
function displayBookmarkForm(status) {
    let form = document.querySelector("form");
    let tableContainer = document.querySelector("#table-container");
    mode = status;
    if (!form || !addBookmarkBtn || !tableContainer)
        return;
    if (form.classList.contains("hide")) {
        form.classList.remove("hide");
        addBookmarkBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
        tableContainer.className = "col-12 col-lg-8 ps-lg-3";
    }
    else {
        form.classList.add("hide");
        addBookmarkBtn.innerHTML = `<i class="fa-solid fa-plus"></i>`;
        tableContainer.className = "col-12";
    }
}
function displayToast(text) {
    const toastLive = document.getElementById("successToast");
    if (!toastLive)
        return;
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLive);
    const toastBody = toastLive.querySelector(".toast-body");
    if (!toastBody)
        return;
    if (text === "add") {
        toastBody.innerHTML = `Bookmark Added Successfully`;
    }
    else if (text === "delete") {
        toastBody.innerHTML = `Bookmark Deleted Successfully`;
    }
    else {
        toastBody.innerHTML = `Bookmark Edited Successfully`;
    }
    toastBootstrap.show();
}
themeBtn.onclick = () => changeTheme();
submitBtn.onclick = () => {
    console.log(mode);
    if (mode === "create")
        add();
    else if (mode === "edit")
        updateBookmark(editBookmarkNo - 1);
};
