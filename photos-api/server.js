require('dotenv').config();
const express = require('express');
const app = express();
const redis = require('redis');
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
});
redisClient.on('error', (err) => {
    console.log(err);
    process.exit();
});


app.get('/ping', (req, res) => {
    res.send('pong');
});

app.get('/users', (req, res) => {
    redisClient.lrange('myusers', 0, -1, (err, data) => {
        if(err) {
            return res.status(500).send('Error');
        }
        res.json({
            data: data
        });
    });
});

app.post('/users/:name', (req, res) => {
    const { name } = req.params;

    redisClient.rpush('myusers', name, (err, data) => {
        if(err) {
            return res.status(500).send('Error');
        }
        res.json({
            data: data
        });
    });
});

var PORT = process.env.NODE_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
});