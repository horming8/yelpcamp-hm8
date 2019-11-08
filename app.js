var bodyParser = require("body-parser");
var flash = require("connect-flash");
var express = require("express");
var expressSession = require("express-session");
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds")

var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var authRoutes = require("./routes/index");

var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(expressSession({
    secret: "josiah will be ready for job hunting",
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect("mongodb+srv://devops:devops@cluster0-qmm86.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => {
    console.log("database connected");
}).catch(err => {
    console.log("error:", err.message);
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
    if (process.argv[3] && process.argv[3] == "clean") {
        seedDB();
    }
    console.log(`running at port: ${port}`);
});