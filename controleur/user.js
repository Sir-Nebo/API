require("dotenv").config();
const process = require('process');
const jwt = require('jsonwebtoken');
const pool = require('../modele/database');
const userDB = require('../modele/userDB');

/**
 * @swagger
 * components:
 *  schemas:
 *      Login:
 *          type: object
 *          properties:
 *              email:
 *                  type: string
 *              password:
 *                  type: string
 *                  format: password
 *          required:
 *              email,
 *              password
 */
module.exports.login = async (req, res) => {
    const {email, password} = req.body;
    console.log(req.body)
    if(email === undefined || password === undefined){
        res.status(400).json({error : "Données obligatoire non inséré"});
    } else {
        const client = await pool.connect();
        try {
            const {userType, value} = await userDB.getUser(client, email, password);
            if (userType === "unknown") {
                res.sendStatus(404);
            }
            const {id, lastname, firstname, mail} = value;
            const payload = {status: userType, userData: {id, lastname, firstname, mail}};
            const token = jwt.sign(
                payload,
                process.env.SECRET_TOKEN,
                {expiresIn: '1d'}
            );
            res.json(token);
        } catch (e) {
            console.log(e);
            res.status(500).json({error : "Problème de connexion au serveur"});
        } finally {
            client.release();
        }
    }
}