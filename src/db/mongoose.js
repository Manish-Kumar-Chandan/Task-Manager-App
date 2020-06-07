const mongoose = require('mongoose')
const validator = require('validator')

//mongoClient constructor
mongoose.connect(process.env.DATABASE_URL,
{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
})


/*
const me = new User({
    description:'   Vallhala   ',
})

me.save().then(()=>
{
    console.log(me)
}).catch((error)=>
{
    console.log('Error!',error)
})*/

/*
const me=new User
({
    Name: '   Chand',
    Email:'Chandu@gmail.com',
    Password:'Password123'   
})

me.save().then(()=>
{
    console.log(me)
}).catch((error)=>
{
    console.log('Error!', error)
})*/