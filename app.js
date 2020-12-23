//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

let currentUser = "";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.use(session({
  secret: "My little secret.",
  resave: false,
  saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://admin-izhak:a1234567@cluster0-byotr.mongodb.net/multigameDB", {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  questionsPerLevel: Number,
  score: Number
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






app.get("/", function(req, res){
  res.render("home");
});

app.get("/game", function(req, res){
  res.render("game");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/login", function(req, res){
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function(err){
    if(err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        currentUser = req.body.username;
        User.findOne({username: currentUser}, function(err, user){
          if(user) {
            res.render("game", {
              score: user.score,
            });
          }
        });
      });
    }
  });
});

app.post("/register", function(req, res){
  User.register({username: req.body.username}, req.body.password, function(err, user){
    if(err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
        currentUser = req.body.username;
        res.redirect("/configuration");
      });
    }
  });
});

app.post("/login", function(req, res){
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function(err){
    if(err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        currentUser = req.body.username;
        User.findOne({username: currentUser}, function(err, user){
          if(user) {
            res.render("game", {
              score: user.score,
            });
          }
        });
      });
    }
  });
});


app.get("/configuration", function(req, res){
  if(req.isAuthenticated()){
    res.render("configuration");
  } else {
    res.redirect("/");
  }
});

app.post("/configuration", function(req, res){
  User.updateOne({username: currentUser}, {questionsPerLevel: req.body.questionsPerLevel}, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("configuration updated successfully.");
    }
    res.redirect("/game");
  });
});


app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
})




let port = process.env.PORT;
if(port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started!");
});
