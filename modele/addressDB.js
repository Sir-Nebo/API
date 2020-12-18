//Functions for city

module.exports.getAllCity = async(client) => {
    return await client.query("SELECT * FROM city");
}
module.exports.getAllCityByCountry = async(client, country) => {
    return await client.query("SELECT * FROM city where country = $1",[country]);
}

module.exports.createCity = async (client, zipCode, cityName, country) => {
    await client.query("INSERT INTO City(name, zipCode, country) VALUES ($1, $2, $3)", [cityName, zipCode, country]);
}

module.exports.getCity = async(client, city, country) => {
    return await client.query("SELECT * FROM City WHERE name = $1 and country = $2", [city, country]);
}

module.exports.getCityById = async (client, cityId) => {
    return await client.query("SELECT * FROM City WHERE id = $1", [cityId]);
}

//Functions for Country

module.exports.getAllCountry = async(client) => {
    return await client.query("SELECT * FROM country");
}

module.exports.getCountry = async(client, country) => {
    return await client.query("SELECT * FROM country WHERE name = $1", [country]);
}

//Functions for Street

module.exports.createStreet = async (client, street, cityId) => {
    await client.query("INSERT INTO Street(name, city) VALUES ($1, $2)", [street, cityId]);
}

module.exports.getStreetById = async (client, streetId) => {
    return await client.query("SELECT * FROM Street WHERE id = $1", [streetId]);
}

module.exports.getStreet = async (client, city, name) => {
    return await client.query("SELECT * FROM Street WHERE city = $1 and name = $2", [city, name]);
}