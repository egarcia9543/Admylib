/* eslint-disable no-unused-vars */
function fillDate() {
    document.getElementById('penaltyTime').value = new Date().toISOString().slice(0, 10);
    document.getElementById('penaltyTime').min = new Date().toISOString().slice(0, 10);
}
