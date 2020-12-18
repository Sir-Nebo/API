const pool = require('../modele/database');
const personModele = require('../modele/personDB');
const addressModele = require('../modele/addressDB')
const utils = require('../utils/utils');
const {beginSQL, commitSQL, rollBackSQL} = require("../utils/utils");

/**
 * @swagger
 * components:
 *  schemas:
 *      person:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              lasname:
 *                  type: string
 *                  description: nom de famille de la personne
 *              firstname:
 *                  type: string
 *                  description: prénom de la personne
 *              birthdate:
 *                  type: string
 *                  description: date de naissance de la personne
 *              phonenumber:
 *                  type: string
 *                  description: téléphone de la personne
 *              gender:
 *                  type: string
 *                  description: genre de la personne
 *              numhouse:
 *                  type: string
 *                  description: numéro de maison de la personne
 *              street:
 *                  type: integer
 *                  description: identifiant de la rue de la personne
 *              mail:
 *                  type: string
 *                  description: mail de la personne
 *              password:
 *                  type: string
 *                  format: password
 *                  description: mot de passe de la personne
 *              rating:
 *                  type: integer
 *                  description: cote de la personne
 *              isadmin:
 *                  type: boolean
 *                  description: si la personne est administrateur
 *              streetName:
 *                  type: string
 *                  description: nom de la rue de la personne
 *              cityName:
 *                  type: string
 *                  description: nom de la ville de la personne
 *              zipcode:
 *                  type: string
 *                  description: code postale de la personne
 *              country:
 *                  type: string
 *                  description: nom du pays de la personne
 */

/**
 *@swagger
 *components:
 *  responses:
 *      PersonDeleted:
 *          description: la personne a été supprimer
 *      PersonNotExist:
 *          description: la personne demandé n'existe pas
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *  requestBodies:
 *      PersonToDelete:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          mail:
 *                              type: string
 */
module.exports.deletePerson = async (req, res) => {
    const client = await pool.connect();
    const {mail} = req.body;
    try {
        if (mail === undefined){
            res.sendStatus(400);
        } else {
            const personExist = personModele.personExist(client, mail);
            if (personExist){
                await personModele.deletePerson(client, mail);
                res.sendStatus(204);
            }else{
                res.status(404).json({error : "La personne n'existe pas"});
            }
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({error : "Problème de connexion au serveur"});
    } finally {
        client.release();
    }
}

/**
 * @swagger
 * components:
 *  responses:
 *      PersonsFound:
 *           description: renvoie tous les personnes
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/person'
 */
module.exports.getAllPerson = async (req, res) => {
    const client = await pool.connect();
    try {
        const {rows:persons} = await personModele.getAllPerson(client);
        res.json(persons);
    } catch (e) {
        console.log(e);
        res.status(500).json({error : "Problème de connexion au serveur"});
    } finally {
        client.release()
    }
}

/**
 * @swagger
 * components:
 *  responses:
 *      PersonUpdated:
 *          description: la personne a été mis à jour
 *      PersonNotExist:
 *          description: la personne demandé n'existe pas
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *  requestBodies:
 *      PersonToUpdate:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          lastname:
 *                              type: string
 *                          firstname:
 *                              type: string
 *                          birthdate:
 *                              type: string
 *                          phonenumber:
 *                              type: string
 *                          gender:
 *                              type: string
 *                          numhouse:
 *                              type: string
 *                          street:
 *                              type: integer
 *                          mail:
 *                              type: string
 *                          password:
 *                              type: string
 *                              format: password
 *                          rating:
 *                              type: integer
 *                          isadmin:
 *                              type: boolean
 *                          postCode:
 *                              type: string
 *                          city:
 *                              type: string
 *                          country:
 *                              type: string
 *                      required:
 *                          lastname
 *                          firstname
 *                          birthdate
 *                          phonenumber
 *                          numhouse
 *                          street
 *                          mail
 *                          password
 *                          isadmin
 *                          postCode
 *                          city
 *                          country
 */
module.exports.updatePerson = async (req, res) => {
    const client = await pool.connect();
    const {lastName, firstName, birthdateStr, genderStr, numHouse, street, mail, password, isAdminStr, phoneNumber, ratingStr} = req.body;
    const birthdate = utils.changeToDate(birthdateStr);
    const gender = genderStr.charAt(0);
    const isAdmin = Boolean(isAdminStr);
    const rating = parseInt(ratingStr);
    try{
        if (mail === undefined){
            res.status(400).json({error: "Adresse mail non définie"});
        } else {
            const clientExist = await personModele.personExist(client, mail);
            if (clientExist){
                await personModele.updatePerson(client, lastName, firstName, birthdate, gender, numHouse, street, mail, password, isAdmin, phoneNumber, rating);
                res.sendStatus(204);
            } else {
                res.status(404).json({error: "Personne inexistante"});;
            }
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({error : "Problème de connexion au serveur"});
    } finally {
        client.release();
    }
}

/**
 * @swagger
 * components:
 *  responses:
 *      PersonUpdated:
 *          description: la personne a été mis à jour
 *      PersonNotExist:
 *          description: l'utilisateur demandé n'existe pas
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *  requestBodies:
 *      PersonToUpdate:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          mail:
 *                              type: string
 *                          isadmin:
 *                              type: boolean
 *                      required:
 *                          mail
 *                          isadmin
 */
module.exports.updatePersonAdminRight = async (req, res) => {
    const client = await pool.connect();
    const {mail, isAdmin} = req.body;
    try{
        if (mail !== undefined) {
            const personExist = await personModele.personExist(client, mail);
            if (personExist) {
                await personModele.updatePersonAdminRight(client, mail, isAdmin);
            } else {
                res.status(404).json({error: "Personne inexistante"});;
            }
        } else {
            res.status(400).json({error: "Adresse mail non définie"});
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({error : "Problème de connexion au serveur"});
    } finally {
        client.release();
    }
}

/**
 * @swagger
 * components:
 *  responses:
 *      PersonFound:
 *           description: renvoie une personne
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/person'
 *      PersonNotExist:
 *          description: la personne demandé n'existe pas
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 */
module.exports.getPerson = async (req, res) => {
    const client = await pool.connect();
    const {mail} = req.params;
    try{
        if (mail !== undefined){
            const {rows: persons} = await personModele.getPerson(client, mail);
            let person = persons[0];
            if (person !== undefined){
                res.json(person);
            } else {
                res.status(404).json({error:"L'utilisateur n'existe pas"});
            }
        }
        else {
            res.status(400).json({error: "Adresse mail non définie"});
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({error : "Problème de connexion au serveur"});
    } finally {
        client.release();
    }
}

/**
 *@swagger
 *components:
 *  responses:
 *      PersonAdded:
 *          description: la personne a été ajouté
 *      PersonExist:
 *          description: la personne existe déjà
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *      countryNotExist:
 *          description: le pays n'est pas pris en compte
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *  requestBodies:
 *      PersonToAdd:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          lasname:
 *                              type: string
 *                          firstname:
 *                              type: string
 *                          birthdate:
 *                              type: string
 *                          phonenumber:
 *                              type: string
 *                          gender:
 *                              type: string
 *                          numhouse:
 *                              type: string
 *                          street:
 *                              type: integer
 *                          mail:
 *                              type: string
 *                          password:
 *                              type: string
 *                              format: password
 *                          rating:
 *                              type: integer
 *                          isadmin:
 *                              type: boolean
 *                          postCode:
 *                              type: string
 *                          city:
 *                              type: string
 *                          country:
 *                              type: string
 *                      required:
 *                          lasname
 *                          firstname
 *                          birthdate
 *                          phonenumber
 *                          numhouse
 *                          street
 *                          mail
 *                          password
 *                          isadmin
 *                          postCode
 *                          city
 *                          country
 */
module.exports.createPerson = async (req, res) => {
    const client = await pool.connect();
    const {lastname, firstname, birthdate, gender, numhouse, streetname, mail, password, phonenumber, zipcode, cityname, country} = req.body;
    if (lastname !== undefined && firstname !== undefined && birthdate !== undefined && numhouse !== undefined && streetname !== undefined && mail !== undefined && password !== undefined && phonenumber !== undefined && zipcode !== undefined && cityname !== undefined && country !== undefined) {
        const birthDate = utils.changeToDate(birthdate);
        const genderChar = (gender === undefined ? null : gender.charAt(0));
        let streetDB;
        try {
            await beginSQL(client);
            const personExist = await personModele.personExist(client, mail);
            if (!personExist){
                let {rows:countryDB} = await addressModele.getCountry(client, country);
                countryDB = countryDB[0];
                if (countryDB !== undefined){
                    let {rows:cityDB} = await addressModele.getCity(client, cityname, countryDB.name);
                    cityDB = cityDB[0];
                    if (cityDB === undefined) {
                        await addressModele.createCity(client, zipcode, cityname, countryDB.name);
                        let {rows:cityDB} = await addressModele.getCity(client, cityname, countryDB.name);
                        cityDB = cityDB[0];
                        await addressModele.createStreet(client, streetname, cityDB.id);
                        const {rows: streets} = await addressModele.getStreet(client, cityDB.id, streetname);
                        streetDB = streets[0];
                    } else {
                        let {rows: streets} = await addressModele.getStreet(client, cityDB.id, streetname);
                        streetDB = streets[0];
                        if(streets[0] === undefined){
                            await addressModele.createStreet(client, streetname, cityDB);
                            let {rows: streets} = await addressModele.getStreet(client, cityDB.id, streetname);
                            streetDB = streets[0];
                        }
                    }
                    await personModele.createPerson(client, lastname, firstname, birthDate, genderChar, numhouse, streetDB.id, mail, password, false, phonenumber, 0);
                    await commitSQL(client);
                    res.sendStatus(201);
                } else {
                    await rollBackSQL(client);
                    res.status(400).json({error:"Le pays n'existe ou n'est pas pris en charge par l'application"});
                }

            }else{
                await rollBackSQL(client);
                res.status(400).json({error:"L'utilisateur existe déjà !"});
            }
        } catch (e){
            await rollBackSQL(client);
            console.log(e);
            res.status(500).json({error : "Problème de connexion au serveur"});
        } finally {
            client.release();
        }
    } else {
        res.status(400).json("Toute les données obliagtoire ne sont pas remplies");
    }
}

/**
 * @swagger
 * components:
 *  responses:
 *      PersonExist:
 *          description: renvoie si la personne existe
 *          content:
 *               application/json:
 *                   type: boolean
 */
module.exports.personExist = async (req,res) => {
    const client = await pool.connect();
    const {mail} = req.params;
    try{
        if (mail !== undefined){
            const personExist = await personModele.personExist(client, mail);
            if (personExist){
                res.json(true);
            } else {
                res.json(false);
            }
        }
        else {
            res.status(400).json({error: "Adresse mail non définie"});
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({error : "Problème de connexion au serveur"});
    } finally {
        client.release();
    }
}