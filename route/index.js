const toolNameRouter = require('./toolName');
const userRouter = require('./user');
const loanRouter = require('./loan');
const personRouter = require('./person');
const toolRouter = require('./tool');
const adressRouter = require('./adress');
const router = require("express").Router();

router.use("/toolName", toolNameRouter);
router.use("/user", userRouter);
router.use("/loan", loanRouter);
router.use("/person", personRouter);
router.use("/tool", toolRouter);
router.use("/adress", adressRouter);

module.exports = router;