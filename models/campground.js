var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    created: {type: Date, default: Date.now},
    name: String,
    image: String,
    description: String,
    price: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }]
});

module.exports = mongoose.model("Campground", campgroundSchema);