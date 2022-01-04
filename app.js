const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const req = require("express/lib/request");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

/////////////Requests targeting all articles

app.route("/articles")
.get(function (req, res) {
    Article.find({}, function (err, foundArticles) {
        if(!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})
.post(function (req, res) {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function (err) {
    if (!err) {
        res.send("Successfully added a new article.")
    } else {
        res.send(err);
    }        
    });
})
.delete(function (req, res) {
    Article.deleteMany({}, function (err) {
        if ((!err)) {
            res.send("Successfully deleted all articles");
        } else {
            res.send(err);
        }
    });
});

/////////////Requests targeting a specific article

app.route("/articles/:articleTitle")
.get(function (req, res) {
    Article.findOne({title: req.params.articleTitle}, function (err, foundArticle) {
        if (!err) {
            res.send(foundArticle);
        } else {
            res.send("No articles matching that articles was found");
        }
    })
})
.put(function (req, res) {
    Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function (err) {
        if (!err) {
            res.send("Successfully updated article");
        } else {
            res.send(err);
        }
    }
)
})
.patch(function (req, res) {
    Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body}, 
    function (err) {
    if (!err) {
    res.send("Successfully updated article");    
    } else {
        res.send(err);
    }
    }
    );
})
.delete(function (req, res) {
    Article.deleteOne(
    {title: req.params.articleTitle},
    function (err) {
        if (!err) {
            res.send("Successfully deleted article")
        } else {
            res.send(err);
        }
    }
    );
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});