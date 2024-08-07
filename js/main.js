let siteName = document.querySelector("#siteName");
let siteURL = document.querySelector("#siteURL");
let submitBtn = document.querySelector("button");
let tableData = document.querySelector("#tableData");

let bookmarks;

if (localStorage.getItem("bookmarks") !== null) {
  bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  displayData();
} else {
  bookmarks = [];
}

function add() {
  let bookmarker = {
    name: siteName.value,
    url: siteURL.value
  }
  bookmarks.push(bookmarker);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  clearInpts();
  displayData();
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
  bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  let container = ``;
  for (let i = 0; i < bookmarks.length; i++) {
    container += `
      <tr>
        <td>${bookmarks[i].name}</td>
        <td><a href="${bookmarks[i].url}" class="btn btn-outline-primary">Visit</a></td>
        <td><button onclick="deleteData(${i})" class="btn btn-outline-danger">Delete</button></td>
      </tr>
    `
  }
  tableData.innerHTML = container;
}

function visit(index) {
  window.open(bookmarks[index].url);
}

submitBtn.onclick = () => { add() };