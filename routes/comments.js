var express = require("express");
var middlewareObj = require("../middleware/index");
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var router = express.Router({mergeParams: true});

router.get("/new", middlewareObj.isLogin, async (req, res) => {
    try {
        let campground = await Campground.findById(req.params.id).populate("comments").exec();
        res.render("comments/new", {campground: campground});
    } catch (err) {
        console.log(err);
        req.flash("error", `Internal error: ${err.message}`);
    } finally {
        res.redirect(`/campgrounds/${req.params.id}`);
    }
});

router.post("/", middlewareObj.isLogin, async (req, res) => {
    try {
        let comment = await Comment.create(req.body.comment);
        comment.author.id = req.user._id;
        comment.author.username = req.user.username;
        await comment.save();

        let campground = await Campground.findById(req.params.id);
        campground.comments.push(comment);
        await campground.save();
    } catch (err) {
        console.log(err);
        req.flash("error", `Internal error: ${err.message}`);
    } finally {
        res.redirect(`/campgrounds/${req.params.id}`);
    }
});

router.get("/:comment_id/edit", middlewareObj.isCommentOwner, async (req, res) => {
    try {
        let campground = await Campground.findById(req.params.id);
        let comment = await Comment.findById(req.params.comment_id);
        res.render("comments/edit", {campground: campground, comment: comment});
    } catch (err) {
        console.log(err);
        req.flash("error", `Internal error: ${err.message}`);
    } finally {
        res.redirect(`/campgrounds/${req.params.id}`);
    }
});

router.put("/:comment_id", middlewareObj.isCommentOwner, async (req, res) => {
    try {
        await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment);
        res.redirect(`/campgrounds/${req.params.id}`);  
    } catch (err) {
        console.log(err);
        req.flash("error", `Internal error: ${err.message}`);
    } finally {
        res.redirect(`/campgrounds/${req.params.id}`);
    }
});

router.delete("/:comment_id", middlewareObj.isCommentOwner, async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.comment_id);
        res.redirect(`/campgrounds/${req.params.id}`); 
    } catch (err) {
        console.log(err);
        req.flash("error", `Internal error: ${err.message}`);
    } finally {
        res.redirect(`/campgrounds/${req.params.id}`);
    }
})

module.exports = router;