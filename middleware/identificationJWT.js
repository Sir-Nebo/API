require('dotenv').config();
const process = require('process');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *  responses:
 *      ErrorJWT:
 *          description: le JWT n'est pas valide
 *      MissingJWT:
 *          description: le JWT n'est pas présent
 */
module.exports.identification = async (req, res, next) => {
    const headerAuth = req.get('authorization');
    if(headerAuth !== undefined && headerAuth.includes("Bearer")){
        const jwtToken =  headerAuth.split(' ')[1];
        try{
            const decodedJwtToken = jwt.verify(jwtToken, process.env.SECRET_TOKEN);
            req.session = decodedJwtToken.userData;
            req.session.authLevel = decodedJwtToken.status;
            next();
        }
        catch (e) {
            console.log(e);
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(401);
    }
};