require('dotenv').config();
// create a contact route that is set up with our server
// create a /contact route that will be used by our form

const router = require("express").Router();
const nodemailer = require("nodemailer");


router.post("/api/contact", (req, res) => {

// Til test :-)
    //  console.log(req.body.name);
    //  console.log(req.body.email);
    //  console.log(req.body.subject);
    //  console.log(req.body.message);
    //  console.log(req.body);
    
// 1 of 3 der skal via nodemailer createTransport, med type og evt. auth.
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        }
    });

// 2 of 3 mailOption, den data/form der skal sendes som mail.
        let mailOptions = {
            from: req.body.email,
            to: 'culmelund@gmail.com',
            subject: req.body.subject,
            text: `${req.body.email}::${req.body.name}::${req.body.message}`
        };
    
// 3 of 3 Nodemailer virker også med Promise som vist under. alternativt ville være som udkommenteret kode.
        transporter.sendMail(mailOptions) 
            .then(function(response) {
                console.log('Email sent');
            })
            .catch(function(error) {
                console.log('Error: ', error)
            });
    // transporter.sendMail(mailOptions, function(err, data) {
    //  if (err){
    //      console.log('Error Occurs: ', err);
    //  } else {
    //      console.log('Email sent!!!');
    //  }
    // });
    // 
    res.redirect("/indexpage");
});


module.exports = {
    router
};