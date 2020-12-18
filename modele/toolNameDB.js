module.exports.postToolName = async (client, name, url) => {
    await client.query("INSERT INTO toolname(name,url) values ($1,$2)",[name,url]);
}

module.exports.getAllToolName = async (client) => {
    return client.query("SELECT * from toolname");
}
module.exports.getToolNameById = async (client, id) => {
    return client.query("SELECT * from toolname where id = $1",[id]);
}

module.exports.getToolNameByName = async (client, name) => {
    return client.query("SELECT * from toolname where name = $1",[name]);
}

module.exports.deleteToolName = async(client,name) => {
    await client.query("DELETE FROM toolname where name = $1",[name]);
}

module.exports.updateToolName = async(client, oldName, newName, newUrl) => {
    await client.query("UPDATE toolName set name = $2, url = $3 where name = $1",[oldName,newName, newUrl]);
}