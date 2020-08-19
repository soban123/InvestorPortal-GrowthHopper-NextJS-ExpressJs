const next = require ('next');
const express  = require('express');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3004;
const app = next({ dev });
const UserRouter = require('./routes/User');



const handle = app.getRequestHandler();

app.prepare()
.then(()=>{

    const server = express() ;

    server.use(express.json())

    server.use('/user' , UserRouter);

    server.get('/user', (req , res)=>{
        res.end('OK');
    })

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
