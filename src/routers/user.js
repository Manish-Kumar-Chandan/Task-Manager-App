const express = require('express')
const User = require('../models/user')
const multer = require('multer')
const sharp = require('sharp')
const auth = require('../middleware/auth')
const {sendWelcomeEmail, sendLeavingEmail} = require('../emails/accounts')
const router = new express.Router()

//app.post is used for create new user
router.post('/users', async(req, res)=>
{
    const user = new User(req.body)
    
    try 
    {
        await user.save()
        sendWelcomeEmail(user.Email, user.Name)
        const token = await user.genrateAuthToken()
        res.status(201).send({user, token})
    } catch (e) 
    {
        res.status(400)
        res.send(e)
    }
})

//for login user
router.post('/users/login', async(req, res)=>
{
    try 
    {
        const user = await User.findByCredentials(req.body.Email, req.body.Password)
        const token = await user.genrateAuthToken()
        res.send({user, token})  
    } catch (e) 
    {
        res.status(400).send('Unable to login Please Check your Email and Password')    
    }
})

//logout Algo
router.post('/users/logout',auth ,async(req, res)=>
{
    try 
    {
        //req.user.token is coming from auth.js
        req.user.tokens = req.user.tokens.filter((token)=>
        {
            return token.token != req.token
        })

        await req.user.save()
        res.send('Logout Successfully!')

    } catch (e) 
    {
        res.status(500).send(e)
    }
})

//logout all user from all sessions
router.post('/users/logoutall',auth ,async(req, res)=>
{
    try 
    {
        req.user.tokens=[]
        await req.user.save()
        res.send('Logged Out From all Sessions!')
    } catch (e) 
    {
        res.status(500).send(e)    
    }
})

//app.get('/users') is used to find many doccument
router.get('/users/me',auth ,async(req, res)=>
{ 
    res.send(req.user)    
})

//app.get('/users/:id') is used to find single document
router.get('/users/:id', async(req, res)=>
{
  const _id = req.params.id
  try 
  {
    const user = await User.findById(_id)
    if(!user)
    {
        return res.status(404).send("Data Not Found Please Search different entry")
    }
    res.status(302).send(user)
  } 
  catch (error) 
  {
      res.status(500).send()
  }    
})

//Update by ID 
router.patch('/users/me',auth ,async(req, res)=>
{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['Name', 'Age', 'Email', 'Password']
    const isvalidOprations = updates.every((update)=>allowedUpdates.includes(update))

    if(!isvalidOprations)
    {
        return res.status(400).send('Invalid Updates !')
    }

    try 
    {
        updates.forEach((update)=>req.user[update]=req.body[update])
        await req.user.save()
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
        res.send(req.user)
    }
    catch(e) 
    {
        res.status(400).send(e)
    } 
})

// Delete Opration 
router.delete('/users/me',auth ,async(req, res)=>
{
    try 
    {
        await req.user.remove()
        sendLeavingEmail(req.user.Email, req.user.Name)
        res.send(req.user)
    } catch (e) 
    {
        res.status(502).send()
    }
})


//To upload File
const upload = multer({
    limits: 
    {
        fileSize: 1000000 // 1 MB
    },
    fileFilter(req, file, callback)
    {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
        {
            return callback(new Error('Please Check Your Image Format It should be JPG, JPEG OR PNG'))
        }
        callback(undefined, true)
    }
})

router.post('/users/me/avatar',auth ,upload.single('avatar'), async(req,res)=>
{
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer() 
    req.user.avatar = buffer
    await req.user.save()
    res.send('Image Uploaded Succesfuly!')
},(error, req, res, next)=>
{
    res.status(400).send({Error: error.message})
})

//Delete users avatar
router.delete('/users/me/avatar', auth, async(req, res)=>
{
    req.user.avatar = undefined
    await req.user.save()
    res.send('Image is Deleted Succesfuly!')
})

//Fetching users avatar 
router.get('/users/:id/avatar', async(req, res)=>
{
    try
    {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar)
        {
           throw new Error()
        }

        res.set('Content-Type', 'image/png') //res.set('Header','application/json')
        res.send(user.avatar)
    }
    catch(e)
    {
        res.status(404).send(e)
    }
})

module.exports = router