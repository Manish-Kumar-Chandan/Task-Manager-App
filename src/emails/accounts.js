const sgmail = require('@sendgrid/mail')
//const sendgridApiKey = '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'

sgmail.setApiKey(process.env.SENDGRID_API_KEY)


const sendWelcomeEmail = (Email, Name)=>
{
    sgmail.send
    ({
        to: Email,
        from:'manishchandan154@gmail.com',
        subject:'Thanks for Joining in',
        text:`Welcome, ${Name} to the Task Manager Family!`
    })
}

const sendLeavingEmail = (Email, Name)=>
{
    sgmail.send
    ({
        to: Email,
        from:'manishchandan154@gmail.com',
        subject:'Sorry To See You Go!',
        text:`Goodbye, ${Name} We hope to see back sometime soon`
    })
}
module.exports = 
{
 sendWelcomeEmail,
 sendLeavingEmail   
}