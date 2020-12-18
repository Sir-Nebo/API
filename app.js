const Router = require("./route");
const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use(Router);

app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});