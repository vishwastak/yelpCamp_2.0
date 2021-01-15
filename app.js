var  express    = require("express"),
     mongoose   = require("mongoose"),     
     bodyparser = require("body-parser"),
     User       = require("./models/user"),
     Campground = require("./models/campgrounds"),
     Comment    = require("./models/comment"),
     seedDB     = require("./seed"),
     passport   = require("passport"),
     localStratergy = require("passport-local"),
     expressSession = require("express-session"),
     app        = express();

var campgroundRoute = require("./routes/campgrounds"),
    commentRoute    = require("./routes/comments"),
    indexRoute      = require("./routes/index");

//Connect the database
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true,useUnifiedTopology: true });
seedDB();

app.set("view engine","ejs");

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"))
app.use(express.static("public"));

app.use(expressSession({
    secret : "Colt Steele the boss!!",
    resave:false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(userInfo);

app.use("/",indexRoute);
app.use("/campgrounds",campgroundRoute);
app.use("/campgrounds/:id/comments",commentRoute);

passport.use(new localStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//==========middleware============

//passing user info to the ejs templates
function userInfo(req,res,next){
    res.locals.currentUser = req.user;
    next();
}

app.listen("3000",function(){
    console.log("App has stared !!");
})