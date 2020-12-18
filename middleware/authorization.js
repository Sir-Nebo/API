/**
 *@swagger
 * components:
 *  responses:
 *      mustBeManager:
 *          description: L'action demandée ne peut être réalisée que par un manager
 */
module.exports.mustBeManager = async(req, res, next) => {
    if(req.session !== undefined && req.session.authLevel === "manager"){
        next();
    } else {
        res.sendStatus(403);
    }
}