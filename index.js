const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require("mongodb");
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express()

//middlewares

app.use(cors())
app.use(express.json())

//connect with mondodb

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster-nerd-academy.c2dutjx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

console.log(uri)

async function run() {
  try {

    const courses = client.db('NERD-ACADEMY').collection('courses');

    app.get('/courses', async (req, res) => {
      const query = {};
      const result = await courses.find(query).toArray();
      res.send(result);
    })
    
  }
  finally {

  }
}
run().catch(console.log);


app.get('/', async (req, res) => {
  res.send('Nerd Academy Server Is Running')
})

app.listen(port , () => {
  console.log(`Nerd Academy Server Is Running On ${port}`);
})