const {getHash} = require('../utils/utils');

module.exports.createPerson = async (client, lastName, firstName, birthdate, gender, numhouse, street, mail, password, isAdmin, phoneNumber, rating) => {
    return await client.query(`
        INSERT INTO Person(lastName, firstName, birthdate, phoneNumber, gender, numhouse, street, mail, password, rating, isAdmin)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [lastName, firstName, birthdate, phoneNumber, gender, numhouse, street, mail, await getHash(password), rating, isAdmin]
    );
}

module.exports.personExist = async (client, mail) => {
    const {rows : person} = await client.query("SELECT count(id) AS nbr FROM Person WHERE mail = $1", [mail]);
    return person[0].nbr === "1";
}

module.exports.deletePerson = async (client, mail) => {
    await client.query("DELETE FROM Person WHERE mail = $1",
        [mail]);
}

module.exports.getAllPerson = async (client) => {
    return await client.query(
        "SELECT p.*, s.name as streetName, ci.name as cityName, ci.zipcode, co.name as country " +
        "FROM Person p, Street s, City ci, Country co " +
        "WHERE p.street = s.id AND s.city = ci.id AND ci.country = co.name"
    );
}

module.exports.getPerson = async (client, mail) => {
    return await client.query(
        "SELECT p.*, s.name as streetName, ci.name as cityName, ci.zipcode, co.name as country FROM Person p, Street s, City ci, Country co WHERE mail = $1 AND p.street = s.id AND s.city = ci.id AND ci.country = co.name", [mail]
    );
}
module.exports.getPersonById = async (client, id) => {
    return await client.query(
        "SELECT p.*, s.name as streetName, ci.name as cityName, ci.zipcode, co.name as country FROM Person p, Street s, City ci, Country co WHERE p.id = $1 AND p.street = s.id AND s.city = ci.id AND ci.country = co.name", [id]
    );
}

module.exports.updatePerson = async (client, mail, lastName, firstName, birthdate, gender, numhouse, street, password, isAdmin, phoneNumber, rating) => {
    await client.query(
        "UPDATE Person SET lastName = $1, firstName = $2, birthdate = $3, gender = $4, numhouse = $5, street = $6, mail = $7, password = $8, isAdmin = $9, phoneNumber = $10, rating = $11 WHERE mail = $12",
        [lastName, firstName, birthdate, gender, numhouse, street, mail, password, isAdmin, phoneNumber, rating, mail]
    );
}

module.exports.updatePersonAdminRight = async (client, mail, isAdmin) => {
    await client.query(
        "UPDATE person SET isAdmin = $1 WHERE mail = $2", [isAdmin, mail]
    );
}

module.exports.getIsAdmin = async (client, mail) => {
    return await client.query(`
        SELECT isAdmin FROM person WHERE mail = $1 LIMIT 1;
    `, [mail]);
}