var mongoose = require("mongoose");
var passport = require("passport");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");

var seeds = [
    {
        user: "joe",
        pass: "joe",
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        user: "pupu",
        pass: "pupu",
        name: "Desert Mesa", 
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        user: "momo",
        pass: "momo",
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
];



async function seed() {
    try {
        await Campground.remove();
        await Comment.remove();
        await User.remove();

        for (const data of seeds) {
            let user = await User.register(new User({username: data.user}), data.pass);
            console.log(`created user: ${user}`);

            let comment = await Comment.create({
                text: "This place is great, but I wish there was Internet here",
            });
            comment.author.id = user.id;
            comment.author.username = user.username;
            await comment.save();

            let campground = await Campground.create(data);
            campground.author.id = user.id;
            campground.author.username = user.username;
            campground.comments.push(comment);
            await campground.save();
        }
    }
    catch (err) {
        console.log(err);
    }
    console.log("campground database reset");
}
module.exports = seed;