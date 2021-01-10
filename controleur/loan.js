const utils = require('../utils/utils');
const pool = require('../modele/database');
const loanModele = require("../modele/loanDB");
const personModele = require('../modele/personDB');
const toolModele = require('../modele/toolDB');

/**
 * @swagger
 * components:
 *  schemas:
 *      state:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              name:
 *                  type: string
 *      loan:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              dateStart:
 *                  type: string
 *                  description: date de début du prêt
 *              dateEnd:
 *                  type: string
 *                  description: date de début du prêt
 *              state:
 *                  type: integer
 *                  description: état du prêt
 *              tool:
 *                  type: integer
 *                  description: identifiant de l'outil
 *              borrower:
 *                  type: integer
 *                  description: identifiant de l'emprunteur
 *      loanByPerson:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              datestart:
 *                  type: string
 *                  description: date de début du prêt
 *              dateend:
 *                  type: string
 *                  description: date de début du prêt
 *              state:
 *                  type: integer
 *                  description: état du prêt
 *              tool:
 *                  type: integer
 *                  description: identifiant de l'outil
 *              borrower:
 *                  type: integer
 *                  description: identifiant de l'emprunteur
 *              toolbrand:
 *                  type: string
 *                  description: marque de l'outil
 *              toolsize:
 *                  type: string
 *                  description: taille de l'outil
 *              borrowerLastName:
 *                  type: string
 *                  description: nom de l'emprunteur
 *              borrowerFirstName:
 *                  type: string
 *                  description: prénom de l'emprunteur
 *              borrowerRating:
 *                  type: string
 *                  description: note de l'emprunteur
 *              borrowerMail:
 *                  type: string
 *                  description: mail de l'emprunteur
 *              ownerLastName:
 *                  type: string
 *                  description: nom du propriétaire
 *              ownerFirstName:
 *                  type: string
 *                  description: prénom du propriétaire
 *              ownerRating:
 *                  type: string
 *                  description: note du propriétaire
 *              ownerMail:
 *                  type: string
 *                  description: mail du propriétaire
 *              toolname:
 *                  type: string
 *                  description: nom du toolname
 *              toolNameUrl:
 *                  type: string
 *                  description: url du toolname
 *      loanForAll:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              datestart:
 *                  type: string
 *                  description: date de début du prêt
 *              dateend:
 *                  type: string
 *                  description: date de début du prêt
 *              tool:
 *                  type: integer
 *                  description: identifiant de l'outil
 *              borrower:
 *                  type: integer
 *                  description: identifiant de l'emprunteur
 *              toolbrand:
 *                  type: string
 *                  description: marque de l'outil
 *              toolsize:
 *                  type: string
 *                  description: taille de l'outil
 *              borrowerLastName:
 *                  type: string
 *                  description: nom de l'emprunteur
 *              borrowerFirstName:
 *                  type: string
 *                  description: prénom de l'emprunteur
 *              borrowerMail:
 *                  type: string
 *                  description: mail de l'emprunteur
 *              loanerLastName:
 *                  type: string
 *                  description: nom du propriétaire
 *              loanerFirstName:
 *                  type: string
 *                  description: prénom du propriétaire
 *              loanerMail:
 *                  type: string
 *                  description: mail du propriétaire
 *              toolname:
 *                  type: string
 *                  description: nom du toolname
 *              state:
 *                  type: string
 *                  description: nom de l'état
 *              loanerName:
 *                  type: string
 *                  description: nom complet de l'emprunteur
 *              borrowerName:
 *                  type: string
 *                  description: nom complet du propriétaire
 */

/**
 *@swagger
 *components:
 *  responses:
 *      LoanAdded:
 *          description: le pret a été ajouté
 *      UserNotFound:
 *          description: L'utilisateur n'existe pas
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *      ToolNotFound:
 *          description: L'outil n'existe pas
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *  requestBodies:
 *      LoanToAdd:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          datestart:
 *                              type: string
 *                          dateend:
 *                              type: string
 *                          borrowermail:
 *                              type: string
 *                              description: mail de l'emprunteur
 *                          toolId:
 *                              type: integer
 *                              description: id de l'outil
 */
module.exports.postLoan = async (req,res) => {
    const client = await pool.connect();
    const {datestart, dateend, borrowermail, toolId} = req.body;
    try{
        if(borrowermail === undefined || toolId === undefined || datestart === undefined || dateend === undefined){
            res.status(404).json({error: "Les informations nécessaires n'ont pas été reçu"});
        }else{
            let dateStartToDate, dateEndToDate;
            dateStartToDate = utils.changeToDate(datestart);
            dateEndToDate = utils.changeToDate(dateend);
            const personExist = await personModele.personExist(client, borrowermail)
            if(!personExist){
                res.status(404).json({error : "L'utilisateur n'existe pas"});
            }else {
                const {rows : borrowers} = await personModele.getPerson(client, borrowermail);
                const borrowerId = borrowers[0].id;

                const {rows : tools} = await toolModele.getTool(client, toolId);
                const toolIdBD = tools[0].id;

                if(toolIdBD === undefined){
                    res.status(404).json({error : "L'outil n'existe pas"});
                }else {
                    await loanModele.postLoan(client, dateStartToDate, dateEndToDate, borrowerId, toolIdBD, 1);
                    res.sendStatus(201);
                }
            }
        }
    }catch(error){
        res.status(500).json({error : "Problème de connexion au serveur"});
        console.log(error);
    }finally {
        client.release();
    }
}

/**
 *@swagger
 *components:
 *  responses:
 *      LoanDeleted:
 *          description: le pret a été supprimé
 *      LoanNotExist:
 *          description: le pret n'existe pas
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *  requestBodies:
 *      LoanToDelete:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 */
module.exports.deleteLoanById = async (req,res) => {
    const client = await pool.connect();
    const {id} = req.body;
    try{
        if(id === undefined){
            res.status(404).json({error: "Les informations nécessaires n'ont pas été reçu"});
        }else{
            const {rows: loans} = await loanModele.getLoanById(client, id);
            if (loans[0] === undefined) {
                res.status(404).json({error:"L'emprunt n'existe pas"});
            } else {
                const loanId = loans[0].id;
                await loanModele.deleteLoan(client, loanId);
                res.sendStatus(204);
            }
        }
    }catch(error){
        console.log(error);
        res.status(500).json({error : "Problème de connexion au serveur"});
    }finally {
        client.release();
    }
}

/**
 *@swagger
 *components:
 *  responses:
 *      LoansFound:
 *          description: renvoie tous les prêts
 *          content :
 *              application/json:
 *                  schema:
 *                       $ref: '#/components/schemas/loanForAll'
 */
module.exports.getAllLoans = async (req, res) => {
    const client = await pool.connect();
    try{
        const {rows: loans} = await loanModele.getAllLoans(client);
        if(loans !== undefined){
            for (let loan of loans) {
                loan.loanerName = loan.loanerfirstname + " " + loan.loanerlastname;
                loan.borrowerName = loan.borrowerfirstname + " " + loan.borrowerlastname;
            }
        }
        res.json(loans);
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
 *      LoansFoundByBorrower:
 *          description: renvois tous les prêts pour un emprunteur
 *          content :
 *              application/json:
 *                  schema:
 *                       $ref: '#/components/schemas/loanByPerson'
 *      UserNotFound:
 *          description : L'utilisateur n'existe pas
 */
module.exports.getAllLoansWaitingByOwner = async (req,res) => {
    const client = await pool.connect();
    const {loanerMail} = req.params;
    try{
        if(loanerMail === undefined){
            res.status(404).json("Pas reçu les informations");
        }else {
            if (!await personModele.personExist(client, loanerMail)) {
                res.status(404).json("Client n'existe pas");
            } else {
                const {rows:loaner} = await personModele.getPerson(client, loanerMail);
                const {rows: loans} = await loanModele.getAllLoansWaitingByOwner(client, loaner[0].mail);
                res.json(loans);
            }
        }
    }catch(error){
        console.log(error);
        res.status(500).json({error : "Problème de connexion au serveur"});
    }finally {
        client.release();
    }
}

/**
 *@swagger
 *components:
 *  responses:
 *      LoansFoundByBorrower:
 *          description: renvois tous les prêts pour un emprunteur
 *          content :
 *              application/json:
 *                  schema:
 *                       $ref: '#/components/schemas/loanByPerson'
 *      UserNotFound:
 *          description : L'utilisateur n'existe pas
 */
module.exports.getAllLoansAcceptedByBorrower = async (req,res) => {
    const client = await pool.connect();
    const {borrowerMail} = req.params;
    try{
        if(borrowerMail === undefined){
            res.status(404).json("Pas reçu le mail du client");
        }else {
            if (!await personModele.personExist(client, borrowerMail)) {
                res.status(404).json("Client n'existe pas");
            } else {
                const {rows:borrower} = await personModele.getPerson(client, borrowerMail);
                const {rows: loans} = await loanModele.getAllLoansAcceptedByBorrower(client, borrower[0].id);
                res.json(loans);
            }
        }
    }catch(error){
        console.log(error);
        res.status(500).json({error : "Problème de connexion au serveur"});
    }finally {
        client.release();
    }
}

/**
 * @swagger
 * components:
 *  responses :
 *      LoansFoundByOwner:
 *          description : renvois tout les prêts pour un propriétaire
 *          content :
 *              application/json:
 *                  schema:
 *                       $ref: '#/components/schemas/loanByPerson'
 *      UserNotFound:
 *          description : L'utilisateur n'existe pas
 */
module.exports.getAllLoansAcceptedByOwner = async (req,res) => {
    const client = await pool.connect();
    const {loanerMail} = req.params;
    try{
        if(loanerMail === undefined){
            res.status(404).json("Pas reçu le mail du client");
        }else {
            if (!await personModele.personExist(client, loanerMail)) {
                res.status(404).json("Client n'existe pas");
            } else {
                const {rows:loaner} = await personModele.getPerson(client, loanerMail);
                const {rows: loans} = await loanModele.getAllLoansAcceptedByOwner(client, loaner[0].id);
                res.json(loans);
            }
        }
    }catch(error){
        console.log(error)
        res.status(500).json({error : "Problème de connexion au serveur"});
    }finally {
        client.release();
    }
}

/**
 * @swagger
 * components:
 *  responses:
 *      StateUpdated:
 *          description: Etat de l'emprunt mis à jour
 *      LoanNotExist:
 *          description: L'emprunt n'existe pas
 *  requestBodies:
 *      LoanToUpdate:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 *                              description: id de l'emprunt
 *                          state:
 *                              type: integer
 *                              description: id de l'état
 */
module.exports.updateState = async (req,res) => {
    const client = await pool.connect();
    const {id, state} = req.body;
    try{
        if(id === undefined && state === undefined){
            res.status(404).json({error: "Pas reçu les informations demandées"});
        }else {
            if (!await loanModele.loanExist(client, id)) {
                res.status(404).json({error:"le prêt n'existe pas"});
            } else {
                await loanModele.updateState(client, id, state);
                res.sendStatus(204);
            }
        }
    }catch(error){
        console.log(error);
        res.status(500).json({error : "Problème de connexion au serveur"});
    }finally {
        client.release();
    }
}

/**
 * @swagger
 * components:
 *  responses:
 *      StatesFound:
 *          description: renvois tout les états possible d'un emprunt
 *          content :
 *              application/json:
 *                  schema:
 *                       $ref: '#/components/schemas/state'
 */
module.exports.getAllStates = async (req, res) => {
    const client = await pool.connect();
    try{
        const {rows: states} = await loanModele.getAllStates(client);
        res.json(states);
    } catch (e) {
        console.log(e);
        res.status(500).json({error : "Problème de connexion au serveur"});
    } finally {
        client.release();
    }
}