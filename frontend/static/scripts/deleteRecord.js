/* eslint-disable no-unused-vars */
function deleteRecord(url) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            deleteRecordRequest(url);
        }
    });
}

function deleteRecordRequest(url) {
    fetch(url, {
        method: 'DELETE',
    })
    .then((res) => res.json())
    .catch((error) => console.error('Error:', error));
    Swal.fire({
        title: 'Registro eliminado',
        text: 'El registro ha sido eliminado',
        icon: 'success',
        confirmButtonText: 'Aceptar',
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.reload();
        }
    });
}

function deleteAccount(url) {
    document.getElementById('confirmDelete').setAttribute('href', url);
}

function cancelReservation(url) {
    document.getElementById('confirmCancel').setAttribute('href', url);
};
