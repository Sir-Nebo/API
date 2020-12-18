const PersonDB = require('./personDB');
const {compareHash} = require('../utils/utils');

module.exports.getUser = async (client, mail, password) => {
    const promises = [];
    const promisePerson = PersonDB.getPerson(client, mail);
    promises.push(promisePerson);
    const values = await Promise.all(promises);
    const personRow = values[0].rows[0];
    const {rows:isAdmin} = await PersonDB.getIsAdmin(client, mail);
    if (personRow !== undefined && !isAdmin[0].isadmin && await compareHash(password, personRow.password)){
        return {userType: "client", value: personRow};
    } else if (personRow !== undefined && isAdmin[0].isadmin && await compareHash(password, personRow.password)) {
        return {userType: "manager", value: personRow};
    } else {
        return {userType: "unknown", value: null};
    }
}