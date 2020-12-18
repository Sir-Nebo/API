const toolNameControleur = require("../controleur/toolName");
const Router = require("express-promise-router");
const Identification = require("../middleware/identificationJWT");
const Auth = require("../middleware/authorization");
const router = new Router;

/**
 * @swagger
 * /toolName:
 *  get:
 *      tags:
 *         - ToolName
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              $ref: '#/components/responses/ToolNamesFound'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          500:
 *              description: Erreur serveur
 */
router.get('/',Identification.identification, toolNameControleur.getAllToolName);

/**
 * @swagger
 * /toolName:
 *  post:
 *      tags:
 *         - ToolName
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/ToolNameToAdd'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/ToolNameAdded'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeManager'
 *          500:
 *              description: Erreur serveur
 */
router.post('/', Identification.identification, Auth.mustBeManager, toolNameControleur.postToolName);

/**
 * @swagger
 * /toolName:
 *  patch:
 *      tags:
 *         - ToolName
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/ToolNameToUpdate'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/ToolNameUpdated'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeManager'
 *          500:
 *              description: Erreur serveur
 */
router.patch('/', Identification.identification, Auth.mustBeManager, toolNameControleur.updateToolName);

/**
 * @swagger
 * /toolName:
 *  delete:
 *      tags:
 *         - ToolName
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/ToolNameToDelete'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/ToolNameDeleted'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeManager'
 *          500:
 *              description: Erreur serveur
 */
router.delete('/', Identification.identification, Auth.mustBeManager, toolNameControleur.deleteToolName);

module.exports = router;