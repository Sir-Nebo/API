const toolControleur = require("../controleur/tool");
const Router = require("express-promise-router");
const Identification = require("../middleware/identificationJWT");
const router = new Router;

/**
 * @swagger
 * /tool/{city}{country}{toolName}{wantNotAvailable}:
 *  get:
 *      tags:
 *         - Tool
 *      parameters:
 *          - name: city
 *            description: nom d'une ville
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *          - name: country
 *            description: nom d'un pays
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *          - name: toolName
 *            description: nom d'un tool name
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *          - name: wantNotAvailable
 *            description: s'il veut les indisponible
 *            in: path
 *            required: true
 *            schema:
 *              type: boolean
 *      responses:
 *          200:
 *              $ref: '#/components/responses/ToolsFoundByToolNameAndCityAndCountry'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          500:
 *              description: Erreur serveur
 *
 */
router.get('/:city&:country&:toolName&:wantNotAvailable', Identification.identification, toolControleur.getToolByToolNameAndCityAndCountry);

/**
 * @swagger
 * /tool/{ownerId}:
 *  get:
 *      tags:
 *          - Tool
 *      parameters:
 *          - name: ownerId
 *            description: ID d'une personne
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/ToolsFoundByOwner'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          500:
 *              description: Erreur serveur
 */
router.get('/:ownerId', Identification.identification, toolControleur.getToolByOwner);

/**
 * @swagger
 * /tool/id/{id}:
 *  get:
 *      tags:
 *         - Tool
 *      parameters:
 *          - name: id
 *            description: ID d'un outil
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/ToolFound'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          500:
 *              description: Erreur serveur
 *
 */
router.get('/id/:id', Identification.identification, toolControleur.getTool);

/**
 * @swagger
 * /tool:
 *  post:
 *      tags:
 *         - Tool
 *      requestBody:
 *          $ref: '#/components/requestBodies/ToolToAdd'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/ToolAdded'
 *          404:
 *              $ref: '#/components/responses/UserNotFound'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          500:
 *              description: Erreur serveur
 *
 */
router.post('/', Identification.identification, toolControleur.createTool);

/**
 * @swagger
 * /tool:
 *  get:
 *      tags:
 *         - Tool
 *      responses:
 *          200:
 *              $ref: '#/components/responses/ToolsFound'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          500:
 *              description: Erreur serveur
 *
 */
router.get('/', Identification.identification, toolControleur.getAllTools);

/**
 * @swagger
 * /tool:
 *  delete:
 *      tags:
 *         - Tool
 *      requestBody:
 *          $ref: '#/components/requestBodies/ToolToDelete'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/ToolDeleted'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          500:
 *              description: Erreur serveur
 *
 */
router.delete('/', Identification.identification, toolControleur.deleteTool);

/**
 * @swagger
 * /tool:
 *  patch:
 *      tags:
 *         - Tool
 *      requestBody:
 *          $ref: '#/components/requestBodies/ToolToUpdate'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/ToolUpdated'
 *          404:
 *              $ref: '#/components/responses/UserNotFound'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          500:
 *              description: Erreur serveur
 *
 */
router.patch('/', Identification.identification, toolControleur.updateTool);


module.exports = router;