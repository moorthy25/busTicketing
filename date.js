module.exports = getDate;
function getDate() {

    let options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    let today = new Date();
    let day = today.toLocaleDateString("en-US", options);
    return day;

}
