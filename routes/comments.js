var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");
const { route } = require("./campgrounds");

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
//Comment edit form route
router.get("/:comment_id/edit",isCorrectUser,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err)
        res.redirect("back");
        else{
            res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});
        }
    })  
})
//Comment update route
router.put("/:comment_id",isCorrectUser,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err) res.redirect("back");
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})
//Comment delete route
router.delete("/:comment_id",isCorrectUser,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,
        {$pull:{comments:req.params.comment_id}},
        function(err){
       if(err)
       res.redirect("back")
       else {
           Comment.findByIdAndRemove(req.params.comment_id,function(err){
               if(err)
               res.redorect("back");
               else res.redirect("/campgrounds/"+req.params.id);
           })
   }})
})
//middleware to check if a user is logged in
function isLoggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
//middle to check if the logged in user is authorized to modify comments
function isCorrectUser(req,res,next){
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
module.exports = router;