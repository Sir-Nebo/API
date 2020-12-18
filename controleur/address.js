const pool = require('../modele/database');
const addressModele = require('../modele/addressDB');

/**
 * @swagger
 * components:
 *  schemas:
 *      city:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              name:
 *                  type: string
 *              zipcode:
 *                  type: string
 *              country:
 *                  type: string
 *                  description: identifiant de country
 *      country:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *      street:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              name:
 *                  type: string
 *              city:
 *                  type: integer
 *                  description : identifiant de city
 */

/**
 *@swagger
 *components:
 *  responses:
 *      CitiesFound:
 *          description: renvoie toutes les villes
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/city'
 */
module.exports.getAllCityByCountry = async (req,res) => {
    const client = await pool.connect();
    const {country} = req.params;
    try{
        if(country !== undefined) {
            const {rows:countries} = await addressModele.getCountry(client, country);
            if(countries !== undefined) {
                const {rows: cities} = await addressModele.getAllCityByCountry(client, country);
                res.json(cities);
            }else{
                res.status(404).json({error:"Pays non pris en compte"});
            }
        }else{
            res.status(404).json({error:"Information non rentrée"});
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
 *      CityFound:
 *          description: renvoie une ville
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/city'
 *  requestBodies:
 *      CityToFound:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          city:
 *                              type: string
 *                              description: nom de la ville
 *                          country:
 *                              type: string
 */
module.exports.getCity = async (req, res) => {
    const {city, country} = req.body;
    const client = await pool.connect();
    if (city !== undefined && country !== undefined) {
        try {
            const {rows: cityDB} = await addressModele.getCity(client, city, country);
            res.json(cityDB);
        } catch (error) {
            res.status(500).json({error : "Problème de connexion au serveur"});
        } finally {
            client.release();
        }
    } else {
        res.status(400).json("Toutes les données nécessaires ne sont pas définie");
    }
}

/**
 *@swagger
 *components:
 *  responses:
 *      CountriesFound:
 *          description: renvoie tout les pays
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/country'
 */
module.exports.getAllCountry = async (req,res) => {
    const client = await pool.connect();
    try{
        const {rows: countries} = await addressModele.getAllCountry(client);
        res.json(countries);
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
 *      CitiesFound:
 *          description: renvoie un pays
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/country'
 *  requestBodies:
 *      CountryToFound:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          country:
 *                              type: string
 */
module.exports.getCountry = async (req, res) => {
    const {country} = req.body;
    const client = await pool.connect();
    if(country !== undefined) {
        try {
            const {rows: countryDB} = await addressModele.getCountry(client, country);
            res.json(countryDB);
        } catch (e) {
            res.status(500).json({error : "Problème de connexion au serveur"});
        } finally {
            client.release();
        }
    } else {
        res.status(400).json("Toutes les données nécessaires ne sont pas définie");
    }
}

/**
 *@swagger
 *components:
 *  responses:
 *      StreetFound:
 *          description: renvoie une rue
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/street'
 *  requestBodies:
 *      StreetToFound:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          city:
 *                              type: string
 *                              description: id de la ville
 *                          name:
 *                              type: string
 *                              description: nom de la rue
 */
module.exports.getStreet = async (req, res) => {
    const {city, name} = req.body;
    const client = await pool.connect();
    if (city !== undefined && name !== undefined) {
        try {
            const {rows: street} = await addressModele.getStreet(client, city, name);
            res.json(street);
        } catch (e) {
            res.status(500).json({error : "Problème de connexion au serveur"});
        } finally {
            client.release();
        }
    }
}