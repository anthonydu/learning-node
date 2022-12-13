const fs = require("fs");
const express = require('express');
const { verify } = require('hcaptcha');
const ejs = require('ejs');
                    
const app = express();

/*
const PORT = process.env.PORT || 3000;

app.listen(PORT, "test.anthonydu.com", () => {
    console.log(`Live on http://test.anthonydu.com:${PORT}`);
});
*/

const renderIndex = (res, data) => {
    ejs.renderFile("index.ejs", data, (err, data) => {
        if (err) res.status(500).send("Server error: cannot read file.");
        res.contentType('text/html');
        res.send(data);
    });
}

app.get("/", (req, res) => {
    renderIndex(res, { name : "" , display : "none"});
})

app.use(express.urlencoded({ extended: false }));

app.post('/', (req, res) => {
    const secret = '0x0E01204f9936B9f07e265f3d78861638E70E6EfD';
    const token = req.body['h-captcha-response'];
    verify(secret, token)
        .catch(() => {
            console.log("catch");
            renderIndex(res, { name : req.body.name, display : "initial" });
        })
        .then((data) => {
            if (data.success === true) {
                console.log("success");
                const data = JSON.stringify(req.body);
                fs.writeFileSync('user.json', data);
                res.redirect("/submit");
            } else {
                console.log("else");
                renderIndex(res, { name : req.body.name , display : "initial" });
            }
        });
});

app.get("/submit", (req, res) => {
    const body = JSON.parse(fs.readFileSync('user.json'));
    ejs.renderFile("submit.ejs", { name : body.name }, (err, data) => {
        if (err) res.status(500).send("Server error: cannot read file.");
        res.contentType('text/html');
        res.send(data);
    });
})