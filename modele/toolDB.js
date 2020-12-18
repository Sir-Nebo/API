module.exports.createTool = async (client, brand, size, toolName, owner) => {
    await client.query("INSERT INTO Tool(brand, size, toolName, owner) VALUES ($1, $2, $3, $4)",
        [brand, size, toolName, owner]
        );
}

module.exports.deleteTool = async (client, id) => {
    await client.query("DELETE FROM Tool WHERE id = $1",
        [id]
        );
}

module.exports.getAllTools = async (client) => {
    return await client.query("SELECT t.*, tn.name as toolname, p.lastname as ownerLastName, p.firstname as ownerFirstName, p.mail as ownerMail FROM Tool t, person p, toolname tn where t.owner = p.id and t.toolname = tn.id");
}

module.exports.getTool = async (client, id) => {
    return await client.query("SELECT * FROM Tool WHERE id = $1",
        [id]
        );
}

module.exports.updateTool = async (client, id, brand, size, toolName, owner) => {
    await client.query("UPDATE Tool SET brand = $1, size = $2, toolName = $3, owner = $4 WHERE id = $5",
        [brand, size, toolName, owner, id]
        );
}

module.exports.getToolByToolName = async (client, toolName) => {
    return await client.query("SELECT * FROM Tool WHERE toolName = $1",
        [toolName]
    );
}

module.exports.getToolByToolNameAndCity = async (client, toolName, cityId) => {
    return await client.query(
        "SELECT t.*, tn.name as toolName, tn.url as toolNameUrl, o.lastname as ownerLastName, o.firstname as ownerFirstName, o.mail as ownerMail, o.rating as ownerRating, o.numhouse, s.name as street, ci.zipcode, ci.name as city, co.name as country" +
        " FROM Tool t, toolname tn, person o, street s, city ci, country co" +
        " WHERE t.toolname = tn.id AND tn.id = $1 and o.id = t.owner AND" +
        " t.owner in (SELECT p.id FROM person p WHERE p.street in (SELECT s.id FROM street s WHERE s.city = $2))" +
        " AND s.id = o.street AND ci.id = s.city AND co.name = ci.country",
        [toolName, cityId]);
}

module.exports.getAllToolByOwner = async (client, id) => {
    return await client.query("SELECT t.*, tn.url as toolnameurl, tn.name as toolname FROM Tool t, toolName tn WHERE t.owner = $1 and t.toolname = tn.id", [id]);
}