var Campground = require("../models/campgrounds");
var Comment    = require("../models/comments"); 

var middlewareObject = {
    isLoggedin: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect("/login");
    }
};

middlewareObject.checkCampOwner = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                res.redirect("back");
            }else{
                
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else
                    res.redirect("back");
            }
        })
    }else {
        res.redirect("back");
    }
}
middlewareObject.checkCommentOwner = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                res.redirect("back");
            }else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        })
    }else {
        res.redirect("back");
    }
}

module.exports = middlewareObject;