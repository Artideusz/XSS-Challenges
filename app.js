const express = require("express")
const app = express()
const path = require("path")
const sqlite = require("sqlite3")

const db = new sqlite.Database('./data/db.sqlite', (e) => { e && console.log(e) })

app.use(express.static(pwd("public/assets")))
app.use(express.json())

function pwd(pathname) {
    return path.join(__dirname, pathname);
}

app.get("/", (req, res) => {
    res.sendFile(pwd("public/index.html"))
})

app.get("/reflected", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reflected Search</title>
        <link rel="stylesheet" href="css/bootstrap.min.css">
        <link rel="stylesheet" href="css/reflected.css">
    </head>
    <body>
        <div class="fullscreen text-center">
            <h3>${req.query?.s ? encodeURIComponent(req.query.s) : "Reflected Search"}</h3>
            <br>
            <form action="/reflected" method="get">
                <input class="form-control" value="${req.query?.s || ""}" type="text" name="s">
                <br>
                <button class="btn btn-primary"type="submit">Search!</button>
            </form>
            <br>
            <br>
            <div id="items" class="d-flex justify-content-center">
                <div class="item inactive">
                    <p>ABC1</p>
                    <img src="img/placeholder.png" class="item-image">
                </div>
                <div class="item inactive">
                    <p>ABC2</p>
                    <img src="img/placeholder.png" class="item-image">
                </div>
                <div class="item inactive">
                    <p>ABC3</p>
                    <img src="img/placeholder.png" class="item-image">
                </div>
                <div class="item inactive">
                    <p>DEF1</p>
                    <img src="img/placeholder.png" class="item-image">
                </div>
                <div class="item inactive">
                    <p>DEF2</p>
                    <img src="img/placeholder.png" class="item-image">
                </div>
                <div class="item inactive">
                    <p>DEF3</p>
                    <img src="img/placeholder.png" class="item-image">
                </div>
                <div class="item inactive">
                    <p>GHI1</p>
                    <img src="img/placeholder.png" class="item-image">
                </div>
                <div class="item inactive">
                    <p>GHI2</p>
                    <img src="img/placeholder.png" class="item-image">
                </div>
                <div class="item inactive">
                    <p>GHI3</p>
                    <img src="img/placeholder.png" class="item-image">
                </div>
            </div>
        </div>
        <script src="js/interact.min.js"></script>
        <script src="js/reflected.js"></script>
        <script src="js/jquery.slim.js"></script>
        <script src="js/bootstrap.min.js"></script>
    </body>
    </html>`)
})

app.get("/dom-based", (req, res) => {
    if(/[\<\>\\\/]/.test(decodeURIComponent(req.url.substr(1)))) {
        res.sendFile(pwd("public/blocked.html"))
    } else {
        res.sendFile(pwd("public/dom-based.html"))
    }
})

app.get("/persistent", (req, res) => {
    res.sendFile(pwd("public/persistent.html"))
})

/** Backend - This could be in a different folder, but since this is a small project, I will leave it here. */

app.post("/addComment", (req, res) => {
    if(req.body?.id && req.body?.content && !/iframe|<script|<img|\son\w+=|alert|javascript:|<\/pre.*/gi.test(req.body.content)) {
        db.get("SELECT 1 FROM Posts WHERE id = ? LIMIT 1", [req.body['id']], (err, dbResponse) => {
            if(err) {
                console.log(err)
                res.send(JSON.stringify({ status: "error", message: "Something went wrong server-side!" }));
            } else {
                if(dbResponse) {
                    db.run("INSERT INTO Comments (post_id, comment) VALUES (?,?);", [req.body['id'], req.body['content']], (err)=>{
                        if(err) {
                            res.send(JSON.stringify({ status: "error", message: "Something went wrong server-side!" }))
                        }
                        res.send(JSON.stringify({ status: "success" }))
                    })
                } else {
                    res.send(JSON.stringify({ status: "error", message: "Something wrong with data sent!" }))
                }
            }
        })
    } else {
        res.send(JSON.stringify({ status: "error", message: "Something wrong or prohibited with data sent!" }))
    }
})

app.post("/showPosts", (req, res) => {
    // This doesn't look great. There is probably a more efficient way to do this.
    db.all("SELECT * FROM Posts", (err, postRows) => {
        if(err) {
            res.send(`An error has occured! ${err}`)
        } else {
            db.all("SELECT * FROM Comments", (e, commentRows) => {
                if(err) {
                    res.send(`An error has occured! ${err}`)
                } else {
                    let result = postRows
                        .map( post => {
                            post['comments'] = commentRows
                                .filter( comment => comment['post_id'] == post['id'] )
                            return post;
                        })
                    res.send(JSON.stringify(result))
                }
            })
        }
    })
})

app.listen(8080, "0.0.0.0", () => { console.log("Listening on port 8080") })