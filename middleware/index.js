var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLogin = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please login first!");
    res.redirect("/login");
}

middlewareObj.isCommentOwner = async function (req, res, next) {
    try {
        if (req.isAuthenticated()) {
            let comment = await Comment.findById(req.params.comment_id);
            if (comment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "Permission denied!");
                res.redirect("back");
            }
        } else {
            req.flash("error", "Please login first!");
        }
    } catch (err) {
        req.flash("error", `Internal error: ${err}`);
        res.redirect("back");
    }
}

middlewareObj.isCampgroundOwner = async function (req, res, next) {
    try {
        if (req.isAuthenticated()) {
            let campground = await Campground.findById(req.params.id);
            if (campground.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "Permission denied!");
                res.redirect("back");
            }
        } else {
            req.flash("error", "Please login first!");
        }
    } catch (err) {
        req.flash("error", `Internal error: ${err}`);
        res.redirect("back");
    }
}

module.exports = middlewareObj;