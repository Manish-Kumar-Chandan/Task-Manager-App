const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

/*app.use((req, res, next) =>
{
        res.status(503).send('Site is currently down, Please check back soon...')
})*/

//app.use is for costomize our server this full line it will autometically parse incoming json into an object
app.use(express.json()) 
app.use(userRouter)
app.use(taskRouter)

//Activating Port on Heroku as well as on 3000 by port variable
app.listen(port,()=>
{
    console.log('Server is up on port ' +port) 
})

/*const jwt = require('jsonwebtoken')

const myfun = async()=>
{
    const genratetoken = await jwt.sign({_id:'myid123'}, 'this is secret message')
    console.log (genratetoken)
    
    const authenticatetoken = await jwt.verify(genratetoken, 'this is secret message')
    console.log(authenticatetoken)
}
myfun()

//relationship between User and Task
const Task = require('./models/task')
const User = require('./models/user')

const myfun = async()=>
{
    // const task = await Task.findById('5ed6185a4d3b05251c210bda')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)
    
    const user = await User.findById('5ed617c84d3b05251c210bd8')
    await user.populate('fetch').execPopulate()
    console.log(user.fetch)
}

myfun()
*/














