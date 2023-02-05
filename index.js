const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_key);


const port = process.env.PORT || 5000;
const app = express();

//middlewares

app.use(cors());
app.use(express.json());

//connect with mondodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster-nerd-academy.c2dutjx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

console.log(uri);

async function run() {
  try {
    const usersCollection = client.db("NERD-ACADEMY").collection("users");
    const courses = client.db("NERD-ACADEMY").collection("courses");
    const faq = client.db("NERD-ACADEMY").collection("faq");
    const overview = client.db("NERD-ACADEMY").collection("overview");
    const userscart = client.db("NERD-ACADEMY").collection("userscart");
    const blogdetails = client.db("NERD-ACADEMY").collection("blogdetails");
    const courseContent = client.db("NERD-ACADEMY").collection("courseContent");
    const studentAlsoBought = client.db("NERD-ACADEMY").collection("studentAlsoBought");
    const review = client.db("NERD-ACADEMY").collection("review");
    const counter = client.db("NERD-ACADEMY").collection("counter");
    const FAQ = client.db("NERD-ACADEMY").collection("FAQ");
    const studentPurchasedCourses = client.db("NERD-ACADEMY").collection("student-purchased-courses");
    const studentOrderHistory = client.db("NERD-ACADEMY").collection("student-order-history");
    const profileCollection = client.db("NERD-ACADEMY").collection("profile");

    //save users info in db
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.get("/courses", async (req, res) => {
      const query = {};
      const result = await courses.find(query).toArray();
      res.send(result);
    });

    app.post("/courses", async (req, res) => {
      const course = req.body;
      const upload = await courses.insertOne(course);
      res.send(upload);
    });

    // get my course
    app.get('/my-courses', async (req, res) => {
      const email = req.query.email;
      const query = {
        email: email
      };
      const result = await courses.find(query).toArray();
      res.send(result);
    });

    // delete product
    app.delete('/deleteCourse/:id', async (req, res) => {
      const deleteId = req.params.id;
      const query = {
        _id: ObjectId(deleteId)
      }
      const result = await courses.deleteOne(query);
      res.send(result);
    });

    app.get("/counter", async (req, res) => {
      const query = {};
      const result = await counter.find(query).toArray();
      res.send(result);
    });

    app.get("/courses/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await courses.find(query).toArray();
      res.send(result);
    });

    app.get("/courseContent", async (req, res) => {
      const query = {};
      const result = await courseContent.find(query).toArray();
      res.send(result);
    });

    app.get("/studentAlsoBought", async (req, res) => {
      const query = {};
      const result = await studentAlsoBought.find(query).toArray();
      res.send(result);
    });

    app.get('/review', async (req, res) => {
      const query = {};
      const result = await review.find(query).toArray();
      res.send(result);
    })

    app.get("/blog", async (req, res) => {
      const query = {};
      const result = await blogdetails.find(query).toArray();
      res.send(result);
    });

    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await blogdetails.find(query).toArray();
      res.send(result);
    });

    app.get("/faq", async (req, res) => {
      const query = {};
      const result = await faq.find(query).toArray();
      res.send(result);
    });

    app.get("/overview", async (req, res) => {
      const query = {};
      const result = await overview.find(query).toArray();
      res.send(result);
    });

    app.get("/cartdata", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cartdata = await userscart.find(query).toArray();
      res.send(cartdata);
    });

    // category wise data load start
    app.get("/webdevdata", async (req, res) => {
      const query = { category: "Web Development" };
      const result = await courses.find(query).toArray();
      res.send(result);
    });
    app.get("/computerscience", async (req, res) => {
      const query = { category: "Computer Science" };
      const result = await courses.find(query).toArray();
      res.send(result);
    });
    app.get("/mobileappdev", async (req, res) => {
      const query = { category: "Mobile App Development" };
      const result = await courses.find(query).toArray();
      res.send(result);
    });
    app.get("/artificialintelligence", async (req, res) => {
      const query = { category: "Artificial Intelligence" };
      const result = await courses.find(query).toArray();
      res.send(result);
    });
    app.get("/programming", async (req, res) => {
      const query = { category: "Programming" };
      const result = await courses.find(query).toArray();
      res.send(result);
    });

    // category wise data load end

    // student dashboard data load start from here

    app.get("/perchased-courses", async (req, res) => {
      const query = {};
      const result = await studentPurchasedCourses.find(query).toArray();
      res.send(result);
    });

    app.post('/perchased-course', async (req, res) => {
      const data = req.body;
      const upload = await studentPurchasedCourses.insertOne(data);
      res.send(upload);
    })

    app.get("/order-history", async (req, res) => {
      const query = {};
      const result = await studentOrderHistory.find(query).toArray();
      res.send(result);
    });

    app.get("/student-assignment", async (req, res) => {
      const query = {};
      const result = await studentAssignment.find(query).toArray();
      res.send(result);
    });



    // Stripe API starts from here

    app.post('/create-payment-intent', async (req, res) => {
      const payment = req.body;
      const price = payment.total;

      const amount = price * 100;
      console.log(amount);

      const paymentIntent = await stripe.paymentIntents.create({
        currency: 'usd',
        amount: amount,
        "payment_method_types": [
          "card"
        ]
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    })

    // Stripe API end

    // Checking roles API start from here
    app.get('users/admin/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === 'admin'});
    })

    app.get('users/teacher/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isTeacher: user?.role === 'teacher'});
    })

    app.get('users/student/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isStudent: user?.role === 'student'});
    })

    app.get('/users/role/:email', async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      res.send(user);
    })
    // Checking roles API end here




    app.post("/userscart", async (req, res) => {
      const coursecart = req.body;
      const result = await userscart.insertOne(coursecart);
      res.send(result);
    });

    // Update Profile GET API
    app.get('/profile', async (req, res) => {
      const query = {};
      const users = await profileCollection.find(query).toArray();
      res.send(users);
    });

    // Update Profile POST API
    app.post('/profile', async (req, res) => {
      const user = req.body;
      const result = await profileCollection.insertOne(user);
      res.send(result);
    });

    // Update Profile 
    // app.put('/users/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: ObjectId(id) };
    //   const user = req.body;
    //   const option = { upsert: true };
    //   const updatedprofile = {
    //     $set: {
    //       name: user.name,
    //       email: user.email,

    //     }
    //   }
    //   const result = await usersCollection.updateOne(filter, updatedprofile, option)
    //   res.send(result)
    // })


    app.delete("/usercartdata/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userscart.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("Nerd Academy Server Is Running");
});

app.listen(port, () => {
  console.log(`Nerd Academy Server Is Running On ${port}`);
});
