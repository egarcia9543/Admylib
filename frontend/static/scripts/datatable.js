/* eslint-disable new-cap */
$(document).ready(function() {
    const table = $('#datatable').DataTable( {
        lengthChange: false,
        buttons: ['copy', 'excel', 'pdf', 'colvis'],
    } );
    table.buttons().container()
        .appendTo( '#datatable_wrapper .col-md-6:eq(0)' );
} );
