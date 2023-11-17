/* eslint-disable no-unused-vars */
function fillReservation(isbn) {
    const today = new Date().toISOString().slice(0, 10);
    document.getElementById('reservationDate').addEventListener('change', () => {
        const reservationDate = new Date(document.getElementById('reservationDate').value);
        const expirationDate = new Date(reservationDate).setDate(reservationDate.getDate() + 5);
        document.getElementById('expirationDate').value = new Date(expirationDate).toISOString().slice(0, 10);
    });
    book.value = isbn;

    fetch(`/state/${isbn}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.success.length == 0) {
                fetch(`/reservation/${isbn}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.success == false) {
                        document.getElementById('reservationDate').min = new Date().toISOString().slice(0, 10);
                        const expiration = (new Date().getDate() + 5);
                    } else if (data.success == true) {
                        document.getElementById('reservationDate').setAttribute('readonly', true);
                        document.getElementById('reserveBtn').disabled = true;
                        document.getElementById('reserveBtn').innerHTML = 'Reservado';
                    }
                });
            } else if (data.success[0].book.isReserved == true) {
                document.getElementById('reservationDate').setAttribute('readonly', true);
                document.getElementById('reserveBtn').disabled = true;
                document.getElementById('reserveBtn').innerHTML = 'Reservado';
            } else if (data.success.length > 1) {
                let closest;
                data.success.forEach((element) => {
                    if (element.returnDate >= today) {
                        if (closest == null) {
                            closest = element.returnDate;
                        } else if (element.returnDate < closest) {
                            closest = element.returnDate;
                        }
                    }
                });
                const reservationDate = new Date(closest);
                document.getElementById('reservationDate').min = closest.slice(0, 10);
            }
    });
}
