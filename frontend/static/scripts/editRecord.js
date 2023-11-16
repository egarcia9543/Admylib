/* eslint-disable no-unused-vars */
function fillData(id, fullname, email, phone) {
    document.getElementById('id').value = id;
    document.getElementById('fullname').value = fullname;
    document.getElementById('email').value = email;
    document.getElementById('phone').value = phone;
}

function fillBookData(id, isbn, title, author, publisher, genre, copies) {
    document.getElementById('id').value = id;
    document.getElementById('isbn').value = isbn;
    document.getElementById('title').value = title;
    document.getElementById('author').value = author;
    document.getElementById('publisher').value = publisher;
    document.getElementById('genre').value = genre;
    document.getElementById('copies').value = copies;
}

function addCopies() {
    document.getElementById('copies').value = parseInt(document.getElementById('copies').value) + 1;
}
