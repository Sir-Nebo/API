const Router = require("express-promise-router");
const router = new Router;
const addressControleur = require("../controleur/address");
const Identification = require("../middleware/identificationJWT");

/**
 * @swagger
 * /address/city:
 *  get:
 *      tags:
 *         - Address
 *      responses:
 *          200:
 *              $ref: '#/components/responses/CitiesFound'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          500:
 *              description: Erreur serveur
 */
router.get('/city/:country', Identification.identification, addressControleur.getAllCityByCountry);

/**
 * @swagger
 * /address/country:
 *  get:
 *      tags:
 *         - Address
 *      responses:
 *          200:
 *              $ref: '#/components/responses/CountriesFound'
 *          500:
 *              description: Erreur serveur
 */
router.get('/country', addressControleur.getAllCountry);


module.exports = router;