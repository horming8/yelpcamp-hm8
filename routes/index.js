var express = require("express");
var User = require("../models/user");
var passport = require("passport");

var router = express.Router();

router.get("/", (req, res) => {
    res.render("landing");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            req.flash("error", `Internal error: ${err.message}`);
            return res.render("/register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to YelpCamp!");
            res.redirect("/campgrounds");
        });
    });
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
}));

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logout success!");
    res.redirect("campgrounds");
});

function isLogin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;