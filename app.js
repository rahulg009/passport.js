var express               = require("express"),
	mongoose			  =require("mongoose"),
	passport			  =require("passport"),
	bodyParser			  =require("body-parser"),
	User				  =require("./models/user"),
	LocalStrategy         =require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose")
mongoose.connect('mongodb://localhost:27017/auth_web', {useNewUrlParser: true, useUnifiedTopology: true});
var app= express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));


app.use(require("express-session")({
	secret:"Ronaldo is the goat",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",function(req,res){
	res.render("home");
});


app.get("/secret",isLoggedin,function(req,res){
	res.render("secret")
});

// =======================================================================
app.get("/register",function(req,res){
	res.render("register");
});

app.post("/register",function(req,res){
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err){
			console.log(err)
			return res.render("/register");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/secret");
		});
	});
});

app.get("/login",function(req,res){
	res.render("login");
})

app.post("/login",passport.authenticate("local",{
	successRedirect:"/secret",
	failureRedirect:"/login"
}),function(req,res){
	
});


app.get("/logout",function(req,res){
	req.logout()
	res.redirect("/login")
});


function isLoggedin(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
	
	res.redirect("/login");
}



app.listen(3000,function(){
	console.log("connected");
})