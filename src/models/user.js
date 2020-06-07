const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require ('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema
({
    Name:
    {
        type:String,
        trim:true,
        required:true,
    },
    Email:
    {
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error('Email is not VALID')
            }
        }
    },
    Password:
    {
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value)
        {
            if(value.toLowerCase().includes('password'))
            {
                throw new Error('Please do not type password in password field')
            }
        }
    },
    Age:
    {
        type:Number,
        default:0,
        validate(value)
        {
            if(value<0)
            {
                throw new Error('Age Must Be A Positive Number')
            }
        }
    },
    tokens:
    [{
        token:
        {
            type:String,
            required:true
        }
    }],
    avatar:
    {
        type: Buffer
    }
},
{
    timestamps:true
})

//Not Saving Data only showing Virtualy thats why we use virtual method
userSchema.virtual('fetch', 
{
    ref: 'Tasks', //refrence of Task Model that we have created with the table name like const Task = mongoose.model('Tasks',...) so here the name of the table is Tasks
    localField: '_id',  //Relationship is created by id field
    foreignField: 'owner' // name of the field on task model
})

//For hidding Private Data
userSchema.methods.toJSON = function()
{
    const user = this 
    const userObject = user.toObject()

    delete userObject.Password
    delete userObject.tokens
    delete userObject.avatar
    delete userObject.__v

    return userObject
}

//To Create Auth Token as u can see that we use methods becoz method is accessable on instances  
userSchema.methods.genrateAuthToken = async function() 
{
    const user = this 
    const token = jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET)
    //to show the data in database and adding new data to database
    user.tokens = user.tokens.concat({ token })
    //saving data to on mongoose
    user.save()
    return token
}


//loggin User algo as u can see we use static becoz static methods are acceable on models 
userSchema.statics.findByCredentials = async(email, password)=>
{
    const user = await User.findOne({Email:email})
    if(!user)
    {
        throw new Error('Unable to Login')
    }

    const isMatch = await bcrypt.compare(password, user.Password)
    if(!isMatch)
    {
        throw new Error('Unable to Login')
    }
    return user
}


//is used to hash the plain text password before saving data in database
userSchema.pre('save', async function(next)
{
    const user = this
    if (user.isModified('Password'))
    {
        user.Password = await bcrypt.hash(user.Password, 8)
    }
    next()
})

//When user is deleted then also remove all tasks created by that user
userSchema.pre('remove', async function(next)
{
    const user = this 
    await Task.deleteMany({ owner:user._id })
    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User