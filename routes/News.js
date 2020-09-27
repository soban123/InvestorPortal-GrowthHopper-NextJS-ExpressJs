var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const { MongoUrl } = require('../Config/keys');

const News = require('../models/news');



mongoose.connect(MongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });


router.get('/get', async function (req, res, next) {
    const news = await News.find();
  res.send(news);
  });

  router.get('/:id', async function (req, res, next) {
      const {id} = req.params ; 
      console.log(req.params)
    const news = await News.findById({_id:id});
  res.send(news);
  });

  router.delete('/delete/:id', async function (req, res, next) {
    const {id} = req.params ; 
    console.log(req.params)
  const news = await News.findByIdAndDelete({_id:id});
res.send(news);
});

  router.put('/update/:id', async function (req, res, next) {
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

router.post('/', async  function (req, res, next) {
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
