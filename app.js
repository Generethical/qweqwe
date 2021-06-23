const path = require('path')
const express = require('express');
const hbs = require('hbs');
const app = express();
const port = process.env.PORT || 4000;
const metals = require('./utils/metals')

//Define paths for Express config
const directory = path.join(__dirname,"../public/");
const viewsPath = path.join(__dirname,"../templates/views")
const partialsPath = path.join(__dirname,'../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(directory))

app.get('/index',(req,res)=>{
    res.render('index',{
        name:'Artem Sturchenko'
    })
})

app.get('/find',(req,res)=>{
    let obj = {}
    if(!req.query.metal || !req.query.date){
        return res.send({
            error:'You must enter a value'
        })
    }else{
    obj = metals(req.query.metal,req.query.date)
    console.log(obj);
    res.send({
        value:req.query.metal,  
        date:req.query.date
        })
    }
})

app.listen(port,()=>{
    console.log('Server is up on port '+port);
});