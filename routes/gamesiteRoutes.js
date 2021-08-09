const express = require('express');
const fs = require('fs');

const router = express.Router();

const frontpage = fs.readFileSync(__dirname + '/../public/frontpage/frontpage.html', 'utf-8');
const loginpage = fs.readFileSync(__dirname + '/../public/login/login.html', 'utf-8');
const signuppage = fs.readFileSync(__dirname + '/../public/signup/signup.html', 'utf-8');
const indexpage = fs.readFileSync(__dirname + '/../public/index/index.html', 'utf-8');
const rulespage = fs.readFileSync(__dirname + '/../public/rules/rules.html', 'utf-8');
const contactpage = fs.readFileSync(__dirname + '/../public/contact/contact.html', 'utf-8');
const profilepage = fs.readFileSync(__dirname + '/../public/userpage/userpage.html', 'utf-8');


router.get('/', (req, res) => {
  res.status(200).send(frontpage);
});

router.get('/rules', (req, res) => {
  res.status(200).send(rulespage);
});

router.get('/contact', (req, res) => {
  res.status(200).send(contactpage);
});

router.get('/login', (req, res) => {
  res.status(200).send(loginpage);
});

router.get('/signup', (req, res) => {
  res.status(200).send(signuppage);
});

router.post('/gamesite/signup', (req, res) => {
});

module.exports = router;