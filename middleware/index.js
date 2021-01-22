var Campground = require("../models/campgrounds");
var Comment    = require("../models/comments"); 

var middlewareObject = {
    isLoggedin: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error","You need to be logged in to do that");
        res.redirect("/login");
    }
};

middlewareObject.checkCampOwner = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err || !foundCampground){
                req.flash("error","Campground not found");
                res.redirect("back");
            }else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else
                    {   req.flash("error","You do not have the permissions to do that")
                        res.redirect("back");
                        }
            }
        })
    }else {
        req.flash("error","You need to be logged in");
        res.redirect("back");
    }
}
middlewareObject.checkCommentOwner = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err || !foundComment){
                req.flash("error","Comment not found");
                res.redirect("back");
            }else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("You do not have permissions to do this");
                    res.redirect("back");
                }
            }
        })
    }else {
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
}

module.exports = middlewareObject;