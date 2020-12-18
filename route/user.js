const Router = require("express-promise-router");
const router = new Router;
const userController = require('../controleur/user');

/**
 * @swagger
 * /user/login:
 *  post:
 *      tags:
 *         - User
 *      description: renvoie un JWT token permettant l'identification
 *      requestBody:
 *          description: login pour la connexion
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Login'
 *      responses:
 *          200:
 *            description: un token JWT
 *            content:
 *                text/plain:
 *                    schema:
 *                        type: string
 *
 */
router.post('/login', userController.login);

module.exports = router;