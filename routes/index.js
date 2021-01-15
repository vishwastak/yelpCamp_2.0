var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


//=============Routes==========
router.get("/",(req,res)=>{
    res.render("landing");
});

//================ Comment routes ===============

//authentication routes
router.get("/register",function(req,res){
    res.render("register");
})
router.post("/register",function(req,res){
    var newUser = new User ({username :req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.render("register");
        }
        else {
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        })}
    })
})
router.get("/login",function(req,res){
    res.render("login");
})
router.post("/login",passport.authenticate("local",{
    successRedirect : "/campgrounds",
    failureRedirect : "/login"
}),function(req,res){})

router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
})

//to check if a user is logged in
function isLoggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports = router;

