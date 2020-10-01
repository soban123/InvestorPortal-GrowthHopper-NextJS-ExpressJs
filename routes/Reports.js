var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const { MongoUrl } = require('../Config/keys');

const Reports = require('../models/reports');

var multer  = require('multer')


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + file.originalname )
    } , 
    
  })
   
  var upload = multer({ dest: 'uploads/' })

  var upload = multer({ storage: storage   })




mongoose.connect(MongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

router.get('/get', async function (req, res, next) {
    const reports = await Reports.find();
  res.send(reports);
  });

  router.get('/:id', async function (req, res, next) {
      const {id} = req.params ; 
      console.log(req.params)
    const getreports = await Reports.findById({_id:id});
  res.send(getreports);
  });

  router.delete('/delete/:id', async function (req, res, next) {
    const {id} = req.params ; 
    console.log(req.params)
  const rep = await Reports.findByIdAndDelete({_id:id});
res.send(rep);
});

  router.put('/update/:id' , upload.single('file') , async function (req, res, next) {
    const {id} = req.params ; 
    const { title } = req.body ; 
    const {path} = req.file
    const newReport = {
        title , 
        url:path
    };
    Reports.findByIdAndUpdate(id, newReport).then((result) =>
    res.json(result)
  );
});

router.post('/', upload.single('file') , async  function (req, res, next) {
    const { title } = req.body ; 
    const {path} = req.file
    const newReport = new Reports({
        title , 
        url:path
    }) ;
            let result = await newReport.save() ; 
            res.json(result)
  });

module.exports = router;
