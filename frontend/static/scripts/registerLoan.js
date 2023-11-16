/* eslint-disable no-unused-vars */
function fillData(librarianDoc) {
    const returnDate = document.getElementById('returnDate');
    loanDate.value = new Date().toISOString().slice(0, 10);
    loanDate.setAttribute('min', new Date().toISOString().slice(0, 10));
    loanDate.setAttribute('max', new Date().toISOString().slice(0, 10));

    returnDate.value = new Date().toISOString().slice(0, 10);
    returnDate.setAttribute('min', new Date().toISOString().slice(0, 10));

    librarian.value = librarianDoc;
    librarian.setAttribute('readonly', true);
}

function extendLoan(loanId, oldReturnDate, book) {
    const returnDate = document.getElementById('newReturnDate');
    id.value = loanId;
    bookLoaned.value = book;

    returnDate.value = oldReturnDate.slice(0, 10);
    returnDate.setAttribute('min', oldReturnDate.slice(0, 10));
}
