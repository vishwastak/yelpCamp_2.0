var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


//landing page
router.get("/",(req,res)=>{
    res.render("landing");
});


//register
router.get("/register",function(req,res){
    res.render("register");
})
router.post("/register",function(req,res){
    var newUser = new User ({username :req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err.message);
            req.flash("error",err.message);
            res.redirect("/register");
        }
        else {
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Signed up as "+user.username);
            res.redirect("/campgrounds");
        })}
    })
})
//login
router.get("/login",function(req,res){
    res.render("login");
})
router.post("/login",passport.authenticate("local",{
    successRedirect : "/campgrounds",
    failureRedirect : "/login"
}),function(req,res){
    
})

//logout
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged out succcessfully!!");
    res.redirect("/campgrounds");
})


module.exports = router;

