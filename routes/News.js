var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const { MongoUrl } = require('../Config/keys');

const News = require('../models/news');

var jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, 'secretKey', (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next(); // pass the execution off to whatever request the client intended
  });
}

mongoose.connect(MongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });


router.get('/get',authenticateToken, async function (req, res, next) {
    const news = await News.find();
  res.send(news);
  });

  router.get('/:id' ,authenticateToken, async function (req, res, next) {
      const {id} = req.params ; 
      console.log(req.params)
    const news = await News.findById({_id:id});
  res.send(news);
  });

  router.delete('/delete/:id', authenticateToken  , async function (req, res, next) {
    const {id} = req.params ; 
    console.log(req.params)
  const news = await News.findByIdAndDelete({_id:id});
res.send(news);
});

  router.put('/update/:id', authenticateToken ,  async function (req, res, next) {
    const {id} = req.params ; 
    const {title , text} = req.body ; 
    console.log(req.params)
    const updateNews = {
        title ,
        text
    }
    News.findByIdAndUpdate(id, updateNews).then((result) =>
    res.json('News has been updated')
  );
});

router.post('/', authenticateToken  , async  function (req, res, next) {
    const {title , text} = req.body ; 
    console.log(req.body)

    const newNews =  new News({
        title,
        text
      });
     
        let result = await newNews.save() ; 
        res.json(result)
  });

module.exports = router;
