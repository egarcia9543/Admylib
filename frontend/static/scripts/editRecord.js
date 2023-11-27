/* eslint-disable no-unused-vars */
function fillData(id, fullname, email, phone) {
    document.getElementById('id').value = id;
    document.getElementById('fullname').value = fullname;
    document.getElementById('email').value = email;
    document.getElementById('phone').value = phone;
}

function fillBookData(id, isbn, title, author, publisher, genre, copies, summary) {
    document.getElementById('id').value = id;
    document.getElementById('isbn').value = isbn;
    document.getElementById('title').value = title;
    document.getElementById('author').value = author;
    document.getElementById('publisher').value = publisher;
    document.getElementById('genres').value = genre;
    document.getElementById('copies').value = copies;
    document.getElementById('summary').value = summary;
}

function addCopies() {
    document.getElementById('copies').value = parseInt(document.getElementById('copies').value) + 1;
}

function fillReservationData(id, reservationDate, expirationDate) {
    reservationDate = new Date(reservationDate).toISOString().slice(0, 10);
    expirationDate = new Date(expirationDate).toISOString().slice(0, 10);
    document.getElementById('reservationId').value = id;
    document.getElementById('reservationDate').value = reservationDate;
    document.getElementById('reservationDate').min = reservationDate;
    document.getElementById('expirationDate').value = expirationDate;

    document.getElementById('reservationDate').addEventListener('change', () => {
        const reservationDate = new Date(document.getElementById('reservationDate').value);
        const expirationDate = new Date(reservationDate).setDate(reservationDate.getDate() + 5);
        document.getElementById('expirationDate').value = new Date(expirationDate).toISOString().slice(0, 10);
    });
}

function fillPenaltyData(id, penaltyTime, user, justification) {
    penaltyTime = new Date(penaltyTime).toISOString().slice(0, 10);
    document.getElementById('penaltyId').value = id;
    document.getElementById('date').value = penaltyTime;
    document.getElementById('date').min = penaltyTime;
    document.getElementById('document').value = user;
    document.getElementById('justification').value = justification;
}

function reservationDetails(title, isbn, reservationDate, expirationDate) {
    reservationDate = new Date(reservationDate).toISOString().slice(0, 10);
    expirationDate = new Date(expirationDate).toISOString().slice(0, 10);
    document.getElementById('bookTitle').value = title;
    document.getElementById('bookIsbn').value = isbn;
    document.getElementById('dateDetails').value = reservationDate;
    document.getElementById('expirationDetails').value = expirationDate;
}

function loanDetails(title, isbn, loanDate, returnDate) {
    loanDate = new Date(loanDate).toISOString().slice(0, 10);
    returnDate = new Date(returnDate).toISOString().slice(0, 10);
    document.getElementById('title').value = title;
    document.getElementById('isbn').value = isbn;
    document.getElementById('loanDate').value = loanDate;
    document.getElementById('returnDate').value = returnDate;
}
