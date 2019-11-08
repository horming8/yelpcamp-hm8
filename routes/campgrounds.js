var express = require("express");
var middlewareObj = require("../middleware/index");
var Campground = require("../models/campground");

var router = express.Router();

router.get("/", async (req, res) => {
    try {
        let campgrounds = await Campground.find();
        res.render("campgrounds/index", {campgrounds: campgrounds});
    } catch (err) {
        console.log(err);
        req.flash("error", `Internal error: ${err.message}`);
    }
});

router.get("/new", middlewareObj.isLogin, async (req, res) => {
    res.render("campgrounds/new");
});

router.post("/", middlewareObj.isLogin, async (req, res) => {
    try {
        let campground = await Campground.create(req.body.campground);
        campground.author.id = req.user._id;
        campground.author.username = req.user.username;
        campground.save();
    } catch (err) {
        console.log(err);
        req.flash("error", `Internal error: ${err.message}`);
    } finally {
        res.redirect("/campgrounds");
    }
});

router.get("/:id", async (req, res) => {
    try {
        // without populate comment, error on show ejs page
        let campground = await Campground.findById(req.params.id).populate("comments").exec();
        res.render("campgrounds/show", {campground: campground});
    } catch (err) {
        console.log(err);
        req.flash("error", `Internal error: ${err.message}`);
        res.redirect("/campgrounds");
    }
});

router.get("/:id/edit", middlewareObj.isCampgroundOwner, async (req, res) => {
    try {
        let campground = await Campground.findById(req.params.id);
        res.render("campgrounds/edit", {campground: campground});
    } catch (err) {
        console.log(err);
        req.flash("error", `Internal error: ${err.message}`);
        req.redirect(`/campgrounds/${req.params.id}`);
    }
});

router.put("/:id", middlewareObj.isCampgroundOwner, async (req, res) => {
    try {
        await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    } catch (err) {
        console.log(err);
        req.flash("error", `Internal error: ${err.message}`);
    } finally {
        res.redirect(`/campgrounds/${req.params.id}`);
    }
});

router.delete("/:id", middlewareObj.isCampgroundOwner, async (req, res) => {
    try {
        await Campground.findByIdAndDelete(req.params.id);
    } catch (err) {
        console.log(err);
        req.flash("error", `Internal error: ${err.message}`);
    } finally {
        res.redirect("/campgrounds");
    }
});

module.exports = router;