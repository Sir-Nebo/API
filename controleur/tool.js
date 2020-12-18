const pool = require('../modele/database');
const toolModel = require('../modele/toolDB');
const toolNameModel = require('../modele/toolNameDB');
const personModel = require('../modele/personDB');
const addressModel = require('../modele/addressDB');
const loanModel = require('../modele/loanDB');

/**
 * @swagger
 * components:
 *  schemas:
 *      tool:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              brand:
 *                  type: string
 *                  description: marque de l'outil
 *              size:
 *                  type: string
 *                  description: taille de l'outil
 *              toolName:
 *                  type: integer
 *                  description: identifiant du ToolName
 *              owner:
 *                  type: integer
 *                  description: identifiant du propriétaire de l'outil
 *      toolByToolNameAndCity:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              brand:
 *                  type: string
 *                  description: marque de l'outil
 *              size:
 *                  type: string
 *                  description: taille de l'outil
 *              toolName:
 *                  type: string
 *                  description: nom du ToolName
 *              toolNameUrl:
 *                  type: string
 *                  description: url du ToolName
 *              ownerLastName:
 *                  type: string
 *                  description: nom du propriétaire de l'outil
 *              ownerFirstName:
 *                  type: string
 *                  description: prenom du propriétaire de l'outil
 *              ownerMail:
 *                  type: string
 *                  description: mail du propriétaire de l'outil
 *              ownerRating:
 *                  type: integer
 *                  description: note du propriétaire de l'outil
 *              numhouse:
 *                  type: integer
 *                  description: numéro de maison du propriétaire de l'outil
 *              street:
 *                  type: string
 *                  description: nom de la rue du propriétaire de l'outil
 *              zipcode:
 *                  type: string
 *                  description: code postal du propriétaire de l'outil
 *              city:
 *                  type: string
 *                  description: nom de la ville du propriétaire de l'outil
 *              country:
 *                  type: string
 *                  description: nom du pays du propriétaire de l'outil
 *      toolForAll:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              brand:
 *                  type: string
 *                  description: marque de l'outil
 *              size:
 *                  type: string
 *                  description: taille de l'outil
 *              toolName:
 *                  type: string
 *                  description: nom du ToolName
 *              ownerLastName:
 *                  type: string
 *                  description: nom du propriétaire de l'outil
 *              ownerFirstName:
 *                  type: string
 *                  description: prenom du propriétaire de l'outil
 *              ownerMail:
 *                  type: string
 *                  description: mail du propriétaire de l'outil
 *              loandateend:
 *                  type: string
 *                  description: date de fin de l'emprunt en cours s'il y en a un
 */

/**
 *@swagger
 *components:
 *  responses:
 *      ToolAdded:
 *          description: le tool a été ajouté
 *      UserNotFound:
 *          description: Les infos fournient n'existe pas
 *  requestBodies:
 *      ToolToAdd:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          brand:
 *                              type: string
 *                          size:
 *                              type: string
 *                          toolName:
 *                              type: integer
 *                          email:
 *                              type: integer
 *                              description: email du propriétaire
 */
module.exports.createTool = async (req, res) => {
    const client = await pool.connect();
    const {brand, size, toolName, email} = req.body;
    try{
        if (email !== undefined && await personModel.personExist(client, email)) {
            const {rows: person} = await personModel.getPerson(client, email)
            await toolModel.createTool(client, brand, size, toolName, person[0].id);
            res.sendStatus(201);
        } else {
            res.status(404).json({error : "Le mail n'a pas été insérer ou la personne n'existe pas"});
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
 *      ToolDeleted:
 *          description: le tool a été supprimé
 *  requestBodies:
 *      ToolToDelete:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 */
module.exports.deleteTool = async (req, res) => {
    const client = await pool.connect();
    const {id} = req.body;
    try{
        if (id !== undefined) {
            await toolModel.deleteTool(client, id);
            res.sendStatus(204);
        } else {
            res.status(400).json({error : "L'id de l'outil n'est pas définie"});
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
 *      ToolsFound:
 *          description: renvois tous les outils
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/toolForAll'
 */
module.exports.getAllTools = async (req, res) => {
    const client = await pool.connect();
    try{
        const {rows : tools} = await toolModel.getAllTools(client);
        if(tools !== undefined) {
            for (let iTool in tools) {
                const {rows : loans} = await loanModel.getLoanByTool(client, tools[iTool].id);
                if(loans[0] !== undefined) {
                    tools[iTool].loandateend = loans[0].dateend;
                }
            }
        }
        res.json(tools);
    }catch(e){
        console.log(e);
        res.status(500).json({error : "Problème de connexion au serveur"});
    }finally {
        client.release();
    }
}

/**
 *@swagger
 *components:
 *  responses:
 *      ToolFound:
 *          description: renvois un outil
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/tool'
 */
module.exports.getTool = async (req, res) => {
    const client = await pool.connect();
    const {id} = parseInt(req.body);
    try{
        if (id !== undefined) {
            const tool = await toolModel.getTool(client, id);
            res.json(tool);
        } else {
            res.status(400).json({error : "L'id de l'outil n'est pas définie"});
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
 *      ToolUpdated:
 *          description: le tool a été mis à jour
 *      UserNotFound:
 *          description: Les infos fournient n'existe pas
 *  requestBodies:
 *      ToolToUpdate:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 *                          brand:
 *                              type: string
 *                          size:
 *                              type: string
 *                          toolName:
 *                              type: integer
 *                          email:
 *                              type: string
 */
module.exports.updateTool = async (req, res) => {
    const client = await pool.connect();
    const {id,brand, size, toolName, email} = req.body;
    try {
        if (email !== undefined && await personModel.personExist(client, email)) {
            const {rows: person} = await personModel.getPerson(client, email);
            await toolModel.updateTool(client,id, brand, size, toolName, person[0].id);
            res.sendStatus(204);
        } else {
            res.status(404).json({error : "le propriétaire de l'outil n'est pas définie ou il n'existe pas"});
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
 *      ToolsFoundByToolName:
 *          description: renvois les outils en fonction du toolName
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/tool'
 *  requestBodies:
 *      ToolToSearch:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          toolName:
 *                              type: integer
 */
module.exports.getToolByToolName = async (req, res) => {
    const client = await pool.connect();
    const {toolName} = req.body;
    try {
        if (toolName !== undefined){
            const tools = await toolModel.getToolByToolName(client, toolName);
            res.json(tools);
        } else {
            res.status(400).json({error : "ToolName n'est pas définie"});;
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
 *      ToolsFoundByToolNameAndCityAndCountry :
 *          description: renvois les outils en fonction du toolName, de la ville et du pays
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/toolByToolNameAndCity'
 */
module.exports.getToolByToolNameAndCityAndCountry = async (req, res) => {
    const client = await pool.connect();
    const {toolName, city, country, wantNotAvailable} = req.params;
    if(toolName !== undefined && city !== undefined && country !== undefined && wantNotAvailable !== undefined){
        try{
            const {rows:toolNames} = await toolNameModel.getToolNameByName(client, toolName);
            const {rows:cities} = await addressModel.getCity(client, city, country);
            const {rows:tools} = await toolModel.getToolByToolNameAndCity(client, toolNames[0].id, cities[0].id);
            if(tools !== undefined) {
                for (let iTool in tools) {
                    const {rows : loans} = await loanModel.getLoanByTool(client, tools[iTool].id);
                    if(loans[0] !== undefined) {
                        if (wantNotAvailable === "true") {
                            tools[iTool].loandateend = loans[0].dateend;
                        } else {
                            tools.splice(iTool, 1);
                        }
                    }

                }
            }
            res.json(tools);
        } catch (e) {
            console.log(e);
            res.status(500).json({error : "Problème de connexion au serveur"});
        } finally {
            client.release();
        }
    } else {
        res.status(400).json("Données obligatoires non insérée");
    }
}

/**
 *@swagger
 *components:
 *  responses:
 *      ToolsFoundByOwner :
 *          description: renvois les outils en fonction du propriétaire
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/tool'
 */
module.exports.getToolByOwner = async (req, res) => {
    const client = await pool.connect();
    const {ownerId} = req.params;
    if(ownerId !== undefined){
        try {
            const {rows:tools} = await toolModel.getAllToolByOwner(client, ownerId);
            res.json(tools);
        } catch (e) {
            console.log(e);
            res.status(500).json({error : "Problème de connexion au serveur"});
        } finally {
            client.release();
        }
    } else {
        res.status(400).json("Données obligatoires non insérée");
    }
}
