let siteName = document.querySelector("#siteName");
let siteURL = document.querySelector("#siteURL");
let submitBtn = document.querySelector("#addBookmarkBtn");
let tableData = document.querySelector("#tableData");
let themeBtn = document.querySelector('#themeBtn i');
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
}

function displayData() {
  tableData.innerHTML = '';
  bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  let container = ``;
  if (bookmarks.length > 0) {
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
  } else {
    container = `<td colspan="3" class="text-center py-5 fs-4 fw-bold">No Bookmarks To Show</td>`;
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

submitBtn.onclick = () => { add() };
themeBtn.onclick = () => { changeTheme() }