const personControlleur = require("../controleur/person");
const Router = require("express-promise-router");
const Identification = require("../middleware/identificationJWT");
const Auth = require("../middleware/authorization");
const router = new Router;

/**
 * @swagger
 * /person:
 *  delete:
 *      tags:
 *         - Person
 *      requestBody:
 *          $ref: '#/components/requestBodies/PersonToDelete'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/PersonDeleted'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          404:
 *              $ref: '#/components/responses/PersonNotExist'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeManager'
 *          500:
 *              description: Erreur serveur
 */
router.delete('/', Identification.identification, Auth.mustBeManager, personControlleur.deletePerson);

/**
 * @swagger
 * /person:
 *  get:
 *      tags:
 *         - Person
 *      responses:
 *          200:
 *              $ref: '#/components/responses/PersonsFound'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeManager'
 *          500:
 *              description: Erreur serveur
 */
router.get('/', Identification.identification, Auth.mustBeManager, personControlleur.getAllPerson);

/**
 * @swagger
 * /person:
 *  patch:
 *      tags:
 *         - Person
 *      requestBody:
 *          $ref: '#/components/requestBodies/PersonToUpdate'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/PersonUpdated'
 *          404:
 *              $ref: '#/components/responses/PersonNotExist'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeManager'
 *          500:
 *              description: Erreur serveur
 */
router.patch('/', Identification.identification, personControlleur.updatePerson);

/**
 * @swagger
 * /person/updatePersonAdminRight:
 *  patch:
 *      tags:
 *          - Person
 *      requestBody:
 *          $ref: '#/components/requestBodies/PersonToUpdate'
 *      responses:
 *          400:
 *              $ref: '#/components/responses/PersonUpdated'
 *          404:
 *              $ref: '#/components/responses/PersonNotExist'
 *          500:
 *              description: Erreur serveur
 */
router.patch('/updatePersonAdminRight', Identification.identification, Auth.mustBeManager, personControlleur.updatePersonAdminRight);

/**
 * @swagger
 * /person:
 *  post:
 *      tags:
 *         - Person
 *      requestBody:
 *          $ref: '#/components/requestBodies/PersonToAdd'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/PersonAdded'
 *          404:
 *              $ref: '#/components/responses/PersonExist'
 *          500:
 *              description: Erreur serveur
 */
router.post('/', personControlleur.createPerson);

/**
 * @swagger
 * /person/{mail}:
 *  get:
 *      tags:
 *         - Person
 *      parameters:
 *          - name: mail
 *            description: mail d'un utilisateur
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              $ref: '#/components/responses/PersonFound'
 *          404:
 *              $ref: '#/components/responses/PersonNotExist'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          500:
 *              description: Erreur serveur
 */
router.get('/:mail', Identification.identification, personControlleur.getPerson);

/**
 * @swagger
 * /person/personExist/{mail}:
 *  get:
 *      tags:
 *         - Person
 *      parameters:
 *          - name: mail
 *            description: mail d'un utilisateur
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              $ref: '#/components/responses/PersonExist'
 *          500:
 *              description: Erreur serveur
 */
router.get('/personExist/:mail', personControlleur.personExist);

module.exports = router;