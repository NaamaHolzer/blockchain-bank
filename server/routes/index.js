const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/check-auth');

router.get('/', (req, res) => {
    console.log("In Index");
    res.send("Hi")
})
module.exports = router;