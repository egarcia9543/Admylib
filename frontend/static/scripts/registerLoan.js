/* eslint-disable no-unused-vars */
function fillData(librarianDoc) {
    const returnDate = document.getElementById('returnDate');
    loanDate.value = new Date().toISOString().slice(0, 10);
    loanDate.setAttribute('min', new Date().toISOString().slice(0, 10));
    loanDate.setAttribute('max', new Date().toISOString().slice(0, 10));

    const returnDateValue = new Date();
    returnDateValue.setDate(returnDateValue.getDate() + 5);
    returnDate.value = returnDateValue.toISOString().slice(0, 10);
    returnDate.setAttribute('min', returnDateValue.toISOString().slice(0, 10));

    librarian.value = librarianDoc;
    librarian.setAttribute('readonly', true);
}

function extendLoan(loanId, oldReturnDate, book) {
    const returnDate = document.getElementById('newReturnDate');
    loanIdtoExtend.value = loanId;
    bookLoaned.value = book;

    returnDate.value = oldReturnDate.slice(0, 10);
    returnDate.setAttribute('min', oldReturnDate.slice(0, 10));
}

function returnLoan(loanId, bookIsbn, userDocument) {
    loanToReturn.value = loanId;
    returnBook.value = bookIsbn;
    returnUser.value = userDocument;
}

function returnAndPunish(loanId, bookIsbn, userDocument) {
    loanToReturnP.value = loanId;
    returnBookP.value = bookIsbn;
    returnUserP.value = userDocument;
}
