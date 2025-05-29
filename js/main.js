const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
let siteName = document.querySelector("#siteName");
let siteURL = document.querySelector("#siteURL");
let submitBtn = document.querySelector("#addBookmarkBtn");
let tableData = document.querySelector("#tableData");
let themeBtn = document.querySelector('#themeBtn i');
let addBookmarkBtn = document.querySelector("#addBtn");
let bookmarks;
let currentTheme;

if (localStorage.getItem('theme') !== null) {
  currentTheme = localStorage.getItem('theme');
  checkTheme();
} else {
  currentTheme = 'light';
  localStorage.setItem('theme', currentTheme);
  checkTheme();
}

currentTheme === 'light'
  ? themeBtn.className = 'fa-solid fa-sun'
  : themeBtn.className = 'fa-solid fa-moon'

if (localStorage.getItem("bookmarks") !== null) {
  bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  displayData();
} else {
  bookmarks = [];
  tableData.innerHTML = `<td colspan="3" class="text-center py-5 fs-4 fw-bold">No Bookmarks To Show</td>`
}

function add() {
  if (siteName.value && siteURL.value) {
    let bookmarker = {
      name: siteName.value,
      url: siteURL.value
    }
    bookmarks.push(bookmarker);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    clearInpts();
    displayData();
    displayToast('add');
  }
}

function clearInpts() {
  siteName.value = '';
  siteURL.value = '';
}

function deleteData(index) {
  bookmarks.splice(index, 1);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  displayData();
  displayToast('delete');
}

function displayData() {
  tableData.innerHTML = '';
  bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  let container = ``;
  if (bookmarks.length === 0) {
    container = `<td colspan="3" class="text-center py-5 fs-4 fw-bold">No Bookmarks To Show</td>`;
  } else {
    for (let i = 0; i < bookmarks.length; i++) {
      container += `
        <tr>
          <td>${i + 1}</td>
          <td>${bookmarks[i].name}</td>
          <td>
            <a href="${bookmarks[i].url}" target="_blank" class="btn btn-outline-primary">Visit</a>
            <button onclick="deleteData(${i})" class="btn btn-outline-danger">Delete</button>
          </td>
        </tr>
      `
    }
  }
  tableData.innerHTML = container;
}

function checkTheme() {
  currentTheme === 'light'
    ? document.body.classList.remove('black')
    : document.body.classList.add('black')
}

function changeTheme() {
  console.log(themeBtn);
  if (themeBtn.className === 'fa-solid fa-moon') {
    currentTheme = 'light';
    themeBtn.className = 'fa-solid fa-sun';
  } else {
    currentTheme = 'dark';
    themeBtn.className = 'fa-solid fa-moon';
  }
  localStorage.setItem('theme', currentTheme);
  currentTheme = localStorage.getItem('theme');
  checkTheme();
}

function displayBookmarkForm() {
  let form = document.querySelector("form");
  let tableContainer = document.querySelector('#table-container');
  if (form.classList.contains("hide")) {
    form.classList.remove("hide");
    addBookmarkBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
    tableContainer.className = 'col-12 col-lg-8 ps-lg-3';
  } else {
    form.classList.add("hide");
    addBookmarkBtn.innerHTML = `<i class="fa-solid fa-plus"></i>`;
    tableContainer.className = 'col-12';
  }
}

function displayToast(text) {
  const toastLive = document.getElementById('successToast');
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLive);
  if (text === 'add') {
    toastLive.querySelector('.toast-body').innerHTML = `Bookmark Added Successfully`;
  } else if (text === 'delete') {
    toastLive.querySelector('.toast-body').innerHTML = `Bookmark Deleted Successfully`;
  }
  toastBootstrap.show();
}

submitBtn.onclick = () => { add() };
themeBtn.onclick = () => { changeTheme() }
addBookmarkBtn.onclick = () => { displayBookmarkForm() };