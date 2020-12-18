const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports.changeToDate = (date) => {
        const dateParts = date.split("/");
        return new Date(dateParts[2],dateParts[1],dateParts[0]);
}

module.exports.getDateToStr = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1
    const year = date.getFullYear();
    return day + "/" + (month < 10 ? "0" : "") + month + "/" + year;
}

module.exports.getHash = (string) => bcrypt.hash(string, saltRounds);

module.exports.compareHash = (string, hash) => bcrypt.compare(string, hash);

module.exports.commitSQL = async (client) => {
    await client.query("COMMIT;");
}

module.exports.beginSQL = async (client) => {
    await client.query("BEGIN;");
}

module.exports.rollBackSQL = async (client) => {
    await client.query("ROLLBACK;");
}
