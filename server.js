const next = require ('next');
const express  = require('express');
var bodyParser = require('body-parser')

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3004;
const app = next({ dev });
const UserRouter = require('./routes/User');
const NewsRouter = require('./routes/News');
const ReportRouter = require('./routes/Reports');



const handle = app.getRequestHandler();

app.prepare()
.then(()=>{

    const server = express() ;

    server.use(express.json())

    server.use('/uploads', express.static('uploads'))

    // parse application/x-www-form-urlencoded
    server.use(bodyParser.urlencoded({ extended: false }))
 
    // parse serverlication/json
    server.use(bodyParser.json())   

    server.use('/user' , UserRouter);
    server.use('/news' , NewsRouter);
    server.use('/reports' , ReportRouter);

    

    server.post('/user', (req , res)=>{
        console.log(req.body);
        res.json(req.body);
    })

    server.get('*',(req , res )=>{
        return handle(req, res);
    })
    server.listen( port , err =>{
        if (err) throw err ;
        console.log('listeninng on' ,  port);
    } )
})
