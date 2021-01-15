var mongoose = require("mongoose");
//Create the schema
var campSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
});
//Create the model
module.exports = mongoose.model("Campground",campSchema);
