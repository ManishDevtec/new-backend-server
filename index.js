const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const connectDB = require("./db/connect")
const shubhkamnarouter = require('./routes/Shubhkamna');
const signuprouter = require('./routes/signup');
const Loginrouter = require('./routes/login');
const Toplinksrouter = require('./routes/toplinks');
const Badikhabarrouter = require('./routes/badikhabar');
const Taglineroute = require('./routes/Tagline');
const BlogRouter = require('./routes/Blog');
const categoriesRouter = require('./routes/Category');
const HomeDisplayRouter = require('./routes/HomeDisplay');

const RajiyoRouter = require('./routes/Rajiya');
const VotPollRouter = require('./routes/votpoll');
const {RashifalRouter, JyotishRouter} = require('./routes/Rashifal');
const AdvertRouter = require('./routes/Advert');
const ColorsRouter = require('./routes/Colors');
const TeamRouter = require('./routes/Team');
const AddressRouter = require('./routes/Address');
const RulesRouter = require('./routes/Rules');
const FounderRouter = require('./routes/Founder');

const PORT = process.env.PORT || 5000;
const host = process.env.HOST || 'localhost';

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get('/', (req, res) => {
    res.send("I am live");
});


app.use("/api", BlogRouter);
app.use("/api", TeamRouter);
app.use("/api", RashifalRouter);
app.use("/api", JyotishRouter);
app.use("/api", AdvertRouter);
app.use("/api", VotPollRouter);
app.use("/api", ColorsRouter);
app.use("/api", AddressRouter);
app.use("/api", RulesRouter);
app.use("/api", FounderRouter);
app.use("/api", HomeDisplayRouter);
app.use("/api", RajiyoRouter);
app.use("/api", categoriesRouter);
app.use("/api", signuprouter);
app.use("/api", shubhkamnarouter);
app.use("/api", Badikhabarrouter);
app.use("/api", Taglineroute);
// app.use("/api", ApradhJagatrouter);
app.use("/api", Toplinksrouter);
app.use("/api", Loginrouter);

app.use('/image', express.static('upload/images'));


const start = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running at http://${host}:${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start()
