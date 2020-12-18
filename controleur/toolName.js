const pool = require('../modele/database');
const toolNameModele = require('../modele/toolNameDB');

/**
 * @swagger
 * components:
 *  schemas:
 *      toolName:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              name:
 *                  type: string
 *                  description: nom du toolName
 */

/**
 *@swagger
 *components:
 *  responses:
 *      ToolNameAdded:
 *          description: le toolName a été ajouté
 *  requestBodies:
 *      ToolNameToAdd:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 */
module.exports.postToolName = async (req,res) => {
    const client = await pool.connect();
    const {name,url} = req.body;
    try{
        if (name !== undefined) {
            const urlDB = (url !== undefined ? url : null);
            await toolNameModele.postToolName(client, name, urlDB);
            res.sendStatus(201);
        } else {
            res.status(400).json({error : "Données obligatoire non inséré"})
        }
    }catch(error){
        res.status(500).json({error : "Problème de connexion au serveur"});
    }finally {
        client.release();
    }
}

/**
 *@swagger
 *components:
 *  responses:
 *      ToolNameDeleted:
 *          description: le toolName a été supprimé
 *  requestBodies:
 *      ToolNameToDelete:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 */
module.exports.deleteToolName = async (req,res) => {
    const client = await pool.connect();
    const {name} = req.body;
    try{
        if (name !== undefined) {
            await toolNameModele.deleteToolName(client, name);
            res.sendStatus(204);
        } else {
            res.status(400).json({error : "Données obligatoire non inséré"})
        }
    }catch(error){
        res.status(500).json({error : "Problème de connexion au serveur"});
    }finally {
        client.release();
    }
}

/**
 * @swagger
 * components:
 *  responses:
 *      ToolNamesFound:
 *           description: renvoie tous les toolName
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/toolName'
 */
module.exports.getAllToolName = async (req,res) => {
    const client = await pool.connect();
    try{
        const {rows : toolNames} = await toolNameModele.getAllToolName(client);
        res.json(toolNames);
    }catch(error){
        res.status(500).json({error : "Problème de connexion au serveur"});
    }finally {
        client.release();
    }
}

/**
 *@swagger
 *components:
 *  responses:
 *      ToolNameUpdated:
 *          description: le toolName a été mis à jour
 *  requestBodies:
 *      ToolNameToUpdate:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          oldName:
 *                              type: string
 *                          newName:
 *                              type: string
 */
module.exports.updateToolName = async (req,res) => {
    const client = await pool.connect();
    const {oldName, newName, newUrl} = req.body;
    try{
        if (oldName !== undefined && newName !== undefined) {
            const {rows:toolNames} = await toolNameModele.getToolNameByName(client,oldName);
            if(toolNames[0] !== undefined) {
                const urlDB = (newUrl === undefined ? toolNames[0].url : newUrl);

                await toolNameModele.updateToolName(client, oldName, newName, urlDB);
                res.sendStatus(204);
            }else{
                res.status(400).json({error : "Tool name n'existe pas"});
            }
        } else {
            res.status(400).json({error : "Données obligatoire non inséré"})
        }
    }catch(error){
        res.status(500).json({error : "Problème de connexion au serveur"});
    }finally {
        client.release();
    }
}