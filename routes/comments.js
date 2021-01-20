var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");

//add new comment
router.get("/new",isLoggedin,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        res.render("comments/form",{campground:foundCampground});
    })
})
//create the comment
router.post("/",isLoggedin,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err)
        console.log(err);
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err)
                console.log(err);
                else {
                   
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                
                    res.redirect("/campgrounds/"+campground._id);
                }
            })
        } 
    })
})

//middleware to check if a user is logged in
function isLoggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;