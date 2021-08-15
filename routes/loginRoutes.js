const authController = require('../controllers/authController');
const User = require('./../models/userModel');

const express = require('express');

const router = express.Router();


router.post("/login", async(req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        console.log(user);
        if (user) {
            const cmp = await bcrypt.compare(req.body.password, user.hashedPassword);
            if (cmp) {

                req.session.userID = user.id;
                req.session.username = user.firstName;
                req.session.save(function(err) {
                    console.log("session user id ", req.session.userID);
                    if (!err) {

                        res.redirect("/");
                    }
                });

            } else {
                res.send("Wrong username or password.");
            }
        } else {
            res.send("Wrong username or password.");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server error Occured");
    }
});

router.get("/logout", (req, res) => {

    req.session.destroy();
    console.log("session destroyed. Logging out...")
    res.redirect("/");
})

module.exports = router;