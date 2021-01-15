var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");

router.get("/",(req,res)=>{
    Campground.find({},function(err,camps){
        if(err)
        console.log(err);
        else 
        res.render("campgrounds/index",{campgrounds:camps});
    })
});

router.get("/new",isLoggedin,function(req,res){
    res.render("campgrounds/form");
});


router.post("/",isLoggedin,function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    var newCampground = {name :name, image :image, description :desc};
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
//to check if a user is logged in
function isLoggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;