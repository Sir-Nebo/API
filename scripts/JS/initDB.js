const pool = require("../../modele/database");
const fs = require("fs");
const path = require("path");

async function initDB(){
    const client = await pool.connect();
    try{
        let query = fs.readFileSync(path.join(__dirname, "../SQL/createTable.sql"), "utf-8");
        await client.query(query);
        query = fs.readFileSync(path.join(__dirname, "../SQL/insertTable.sql"), "utf-8");
        await client.query(query);
    } catch (e) {
        console.log(e);
    } finally {
     
        client.release();
        await pool.end();
    }
}

initDB().then(() => console.log("done"));