/* eslint-disable new-cap */
$(document).ready(function() {
    const table = $('#datatable').DataTable( {
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json',
        },
        lengthChange: false,
        buttons: ['copy', 'excel', 'pdf', 'colvis'],
    } );
    table.buttons().container()
        .appendTo( '#datatable_wrapper .col-md-6:eq(0)' );
} );
