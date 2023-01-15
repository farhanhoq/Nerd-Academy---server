const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express()
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

require("dotenv").config();

//middlewares

app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.send('Nerd Academy Server Is Running')
})

app.listen(port , () => {
  console.log(`Nerd Academy Server Is Running On ${port}`);
})