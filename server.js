// Dependencies
var express = require("express");
var mongoose = require("mongoose");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 8080;

// If deployed, use the deployed database. Otherwise use local.

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/swipedstories"

// Initialize Express
var app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Set Handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Connect to the Mongo DV
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});

app.get("/", function(req, res) {
    db.Article.find({})
        .then(function(dbArticle) {
            // console.log(dbArticle);
            res.render("index", dbArticle);
        })
        .catch(function(err) {
            res.json(err)
        });
});

app.get("/scrape", function(req, res) {
    axios.get("https://www.cracked.com").then(function(response) {
        //Load into cheerio and save to $
        var $ = cheerio.load(response.data);
        $(".content-cards-info").each(function(i, element) {
            var result = {};
            result.headline = $(this)
                .children("h3").find("a").text();
            result.summary = $(this)
                .children("p").text();
            result.url = $(this)
                .children("h3").find("a").attr("href");
            
            db.Article.create(result)
                .then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    console.log(err);
                });
        });
        res.send("Scrape Complete");
    });
});

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});