var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const { MongoUrl } = require('../Config/keys');
const User = require('../models/User');
const investorsdailyreturns = require('../models/InvestorDailyReturns');
const investorsmonthlyreturns = require('../models/investormonthlyreturns');

const bcrypt = require('bcrypt');
const saltRounds = 10;

var jwt = require('jsonwebtoken');

var cron = require('node-cron');
const { json } = require('express');
const { find } = require('../models/User');

//
mongoose.connect(MongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

// CREATE ADMIN USER
User.find({ email: 'admin@growthhopper.com' }).then((doc) => {
  console.log(doc);
  if (doc.length === 0) {
    const data = {
      name: 'Admin',
      email: 'admin@growthhopper.com',
      password: 'bigbang123$',
      role: 'admin',
      amount: 0,
      package: 0,
    };
    bcrypt.hash(data.password, saltRounds, function (err, hash) {
      const newuser = new User({
        name: data.name,
        email: data.email,
        password: hash,
        role: data.role,
        amount: data.amount,
        package: data.package,
        month: new Date().getMonth(),
      });
      newuser
        .save()
        .then((result) => {
          console.log('ADMIN SAVED');
        })
        .catch((err) => console.log(err));
    });
  }
});
investorsmonthlyreturns.find({ email: 'hasan@gmail.com' }).then((doc) => {
  var total = 0;
  doc.map((mr) => {
    total = total + mr.revenue;
  });
  console.log('MONTHLY TOTAL: ', total);
});
investorsdailyreturns.find({ email: 'hasan@gmail.com' }).then((doc) => {
  var subtotal = 0;
  doc.map((dr) => {
    var totalone = 0;
    dr.dailyprofit.map((profit) => {
      totalone = totalone + profit;
    });
    subtotal = subtotal + totalone;
    console.log(dr.month, totalone);
  });
  console.log('MONTHLY TOTAL CAL: ', subtotal);
});

//Auth function

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

/* GET users listing. */
router.get('/', async function (req, res, next) {
  const user = await User.find();
  res.send(user);
});

router.get('/:id', async function (req, res, next) {
  const { id } = req.params;
  const user = await User.findById({ _id: id });
  res.send(user);
});

router.post('/',async function (req, res, next) {
  console.log(req.body);
  const {
    name,
    email,
    password,
    role = 'investor',
    amount,
    package,
  } = req.body;

   bcrypt.hash(password, saltRounds, async function (err, hash) {
    // console.log(hash);

    const month = new Date().getMonth();
    const newuser =  new User({
      name,
      email,
      password: hash,
      role,
      amount,
      package,
      month,
    });
   
      let postUser = await newuser.save() ; 
      console.log('postUser' , postUser) ; 


    
  const openDay = new Date().getDate();

  var arr = [];
  while (arr.length < 6) {
    var r = Math.floor(Math.random() * 6);
    if (arr.indexOf(r) === -1) arr.push(r);
  }

  let calPackageperc = package.split('')[0];

  for (let i = 0; i < 6; i++) {
    var revenue = (amount * (calPackageperc + arr[i])) / 1000;
    var packageprecent = (calPackageperc + arr[i]) / 10;

    const monthlyreturns = new investorsmonthlyreturns({
      email,
      userId : postUser._id , 
      package,
      amount,
      packageprecent,
      revenue,
      startDay: openDay,
      endDay: openDay,
      month: Number(month) + i > 11 ? month + i - 12 : Number(month) + i,
    });

    monthlyreturns
      .save()
      .then((result) => {
        console.log(result);
        res.json(result);
      })
      .catch((err) => res.json(err));

    //Daily

    let arrofdailyprofit = [];

    for (let t = 0; t < 31; t++) {
      if (i == 0) {
        if (t == 0) {
          arrofdailyprofit.push(0);
        } else {
          var returns =
            t % 2 == 0
              ? revenue / 30 + Math.floor((Math.random() * revenue) / 100)
              : revenue / 30 - Math.floor((Math.random() * revenue) / 100);
          arrofdailyprofit.push(returns);
        }
      } else {
        var returns =
          t % 2 == 0
            ? revenue / 30 + Math.floor((Math.random() * revenue) / 100)
            : revenue / 30 - Math.floor((Math.random() * revenue) / 100);
        arrofdailyprofit.push(returns);
      }
    }

    arrofdailyprofit.pop();
    var totaldr = 0;
    arrofdailyprofit.map((dr) => {
      totaldr = totaldr + dr;
    });
    var disc = revenue - totaldr;
    arrofdailyprofit.push(disc);
    
    const dailyreturns = new investorsdailyreturns({
      email,
      userId : postUser._id ,
      month: Number(month) + i > 11 ? month + i - 12 : Number(month) + i,
      dailyprofit: arrofdailyprofit,
    });

    dailyreturns
      .save()

      .then((result) => {
        console.log(result)
        res.json(result);
      })

      .catch((err) => res.json({ err }));
  }
    
    
  });


  
});

router.put('/update/:id', authenticateToken, function (req, res) {
  const { id } = req.params;
  const { name, email, month, role = 'investor', amount, package } = req.body;

  const updatedUser = {
    name,
    email,
    month,
    role,
    amount,
    package,
  };

  User.findByIdAndUpdate(id, updatedUser).then((result) =>
    res.json('User has been updated')
  );


  


  // bcrypt.hash(password, saltRounds, function (err, hash) {

  // });
});

router.put('/block/:id', authenticateToken, function (req, res) {
  const { id } = req.params;

  User.findByIdAndUpdate(id, { status: 0 }).then((result) =>
    res.json('User has been blocked')
  );
});

router.put('/active/:id', authenticateToken, function (req, res) {
  const { id } = req.params;
  console.log('id', id);

  User.findByIdAndUpdate(id, { status: 1 }).then((result) =>
    res.json('User has been Active')
  );
});

router.post('/login', async function (req, res, next) {
  if (req.body.password && req.body.email) {
    var { email, password } = req.body;
  }

  console.log('req', req.body);
  if (email && password) {
    const user = await User.find({ email });
    if (user.length > 0) {
      console.log('user', user);
      const hash = user[0].password;
      if (user[0].status == 1) {
        var token = jwt.sign(
          { email: user[0].email, id: user[0]._id },
          'secretKey',
          { expiresIn: '5h' }
        );

        bcrypt.compare(password, hash, function (err, result) {
          console.log(result);
          if (result) {
            res.json({
              user,
              token,
              message: 'Success',
            });
          } else {
            res.status(400).json('Failed');
          }

          if (err) {
            res.json('Failed Auth');
          }
        });
      } else {
        res.json('User Blocked');
      }
    } else {
      res.status(400).json('Failed');
    }
  } else {
    res.status(400).json({
      message: 'Auth failed',
    });
  }
});



router.get('/investorsdailyreturns/:id/:month', async function (
  req,
  res,
  next
) {
  const { id , month } = req.params;

  const dailyreturns = await investorsdailyreturns.find({ month, userId : `${id}` });
  res.send(dailyreturns);
});

router.get('/investorsmonthlyreturns/:id/:month', async function (
  req,
  res,
  next
) {
  const { id ,  month } = req.params;

  const monthlyreturns = await investorsmonthlyreturns.find({ userId : `${id}`, month });
  res.send(monthlyreturns);
});

router.get('/investorsmonthlyreturns/:id', async function (req, res, next) {
  const { id, month } = req.params;

  const monthlyreturns = await investorsmonthlyreturns.find({ userId : `${id}` });
  res.send(monthlyreturns);
});

module.exports = router;
