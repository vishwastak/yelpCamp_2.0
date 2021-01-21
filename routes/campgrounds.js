var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var Comment    = require("../models/comments");  
var middleware = require("../middleware");

//campground home
router.get("/",(req,res)=>{
    Campground.find({},function(err,camps){
        if(err)
        console.log(err);
        else 
        res.render("campgrounds/index",{campgrounds:camps});
    })
});
//add new campground
router.get("/new",middleware.isLoggedin,function(req,res){
    res.render("campgrounds/form");
});

//create new campground
router.post("/",middleware.isLoggedin,function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    var author={username:req.user.username, 
                id:req.user._id
            };
    var newCampground = {name :name, image :image, description :desc,author:author};
    Campground.create(newCampground,function(err,campground){
        if(err)
        console.log(err);
        else res.redirect("/campgrounds");
    })
    
});

router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err)
        console.log(err);
        else {
            res.render("campgrounds/show",{campground:foundCampground});
        }
    })
})
//Edit and update 

router.get("/:id/edit",middleware.checkCampOwner,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.render("campgrounds/edit",{campground:foundCampground});
        }
    })
})

router.put("/:id",middleware.checkCampOwner,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})
//delete route

router.delete("/:id",middleware.checkCampOwner,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            foundCampground.comments.forEach(function(comment){
                Comment.findByIdAndDelete(comment._id,function(err){
                    if(err){
                        console.log(err);
                        res.redirect("/campgrounds");
                    }
                })
            })
        }
    })
    Campground.findByIdAndDelete(req.params.id,function(err){
        if(err){
            console.log(err);
            res.redirect("/campgorunds");
        }else {
            res.redirect("/campgrounds");
        }
    })
})


module.exports = router;