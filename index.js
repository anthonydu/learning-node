const { readFile } = require("fs");
const express = require('express');
const bodyParser = require('body-parser');
const { verify } = require('hcaptcha');

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    readFile("index.html", (err, data) => {
        if (err) response.status(500).send("server error");
        res.contentType('text/html');
        res.send(data);
    });
})

app.listen(PORT, () => {
    console.log(`Live on http://localhost:${PORT}`);
});

app.use(bodyParser.urlencoded({ extended: true })); 

app.post('/submit', async (req, res) => {
    const secret = '0x0E01204f9936B9f07e265f3d78861638E70E6EfD';
    const token = req.body['h-captcha-response'];

    verify(secret, token)
        .then((data) => {
            if (data.success === true) {
                res.send('success!');
                res.send(data);
            } else {
                res.send('verification failed');
            }
        })
        .catch(console.error);
});
