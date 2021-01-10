const Router = require("express-promise-router");
const router = new Router;
const loanControleur = require("../controleur/loan");
const Identification = require("../middleware/identificationJWT");
const Auth = require("../middleware/authorization");

/**
 * @swagger
 * /loan/borrower/{borrowerMail}:
 *  get:
 *      tags:
 *         - Loan
 *      parameters:
 *          - name: borrowerMail
 *            description: mail d'un utilisateur
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              $ref: '#/components/responses/LoansFoundByBorrower'
 *          404:
 *              $ref: '#/components/responses/UserNotFound'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          500:
 *              description: Erreur serveur
 */
router.get('/borrower/:borrowerMail',Identification.identification, loanControleur.getAllLoansAcceptedByBorrower);

/**
 * @swagger
 * /loan/loaner/{loanerMail}:
 *  get:
 *      tags:
 *          -   Loan
 *      parameters:
 *          -   name: loanerMail
 *              description: mail du prêteur
 *              in: path
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          200:
 *             $ref: '#/components/responses/LoansFoundByOwner'
 *          404:
 *              $ref: '#/components/responses/UserNotFound'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          500:
 *              description: Erreur serveur
 */
router.get('/loaner/:loanerMail',Identification.identification, loanControleur.getAllLoansAcceptedByOwner);

router.get('/waiting/loaner/:loanerMail',Identification.identification, loanControleur.getAllLoansWaitingByOwner);

/**
 * @swagger
 * /loan:
 *  get:
 *      tags:
 *         - Loan
 *      responses:
 *          200:
 *              $ref: '#/components/responses/PersonFound'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeManager'
 *          500:
 *              description: Erreur serveur
 */
router.get('/', Identification.identification, Auth.mustBeManager, loanControleur.getAllLoans);

/**
 * @swagger
 * /loan:
 *  post:
 *      tags:
 *         - Loan
 *      requestBody:
 *          $ref: '#/components/requestBodies/LoanToAdd'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/LoanAdded'
 *          404:
 *              $ref: '#/components/responses/UserNotFound'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          500:
 *              description: Erreur serveur
 */
router.post('/', Identification.identification, loanControleur.postLoan);

/**
 * @swagger
 * /loan:
 *  delete:
 *      tags:
 *         - Loan
 *      requestBody:
 *          $ref: '#/components/requestBodies/LoanToDelete'
 *      responses:
 *          200:
 *              $ref: '#/components/responses/LoanDeleted'
 *          404:
 *              $ref: '#/components/responses/LoanNotExist'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeManager'
 *          500:
 *              description: Erreur serveur
 */
router.delete('/', Identification.identification, Auth.mustBeManager, loanControleur.deleteLoanById);

/**
 * @swagger
 * /loan:
 *  patch:
 *      tags:
 *          - Loan
 *      requestBody:
 *          $ref: '#/components/requestBodies/LoanToUpdate'
 *      responses:
 *          200:
 *             $ref: '#/components/responses/StateUpdated'
 *          404:
 *              $ref: '#/components/responses/UserNotFound'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          500:
 *              description: Erreur serveur
 */
router.patch("/", Identification.identification, loanControleur.updateState);

/**
 * @swagger
 * /loan/states:
 *  get:
 *      tags:
 *          - Loan
 *      responses:
 *          500:
 *              description: Erreur Serveur
 */
router.get('/states', Identification.identification, Auth.mustBeManager, loanControleur.getAllStates);

module.exports = router;