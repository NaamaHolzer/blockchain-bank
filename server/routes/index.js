const express = require('express');
const router = express.Router();
const checksession = require('../middlewares/checksession');

router.get('/', (req, res) => {
    console.log("In Index");
    res.send("Hi")
})
module.exports = router;