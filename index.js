const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
require("dotenv").config();
const stripe = require("stripe")('sk_test_51M7InvAbbSTlGyeu2fTEmh96AQ3g07u7FU7rs2tuafcvtKrGf3UfNt4UQCBTFYSUPsFJFQWgxw5ki3HJGVPWMRmi00Oe7sO83Z');


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
    const wishlists = client.db("NERD-ACADEMY").collection("wishlists");
    const faq = client.db("NERD-ACADEMY").collection("faq");
    const overview = client.db("NERD-ACADEMY").collection("overview");
    const userscart = client.db("NERD-ACADEMY").collection("userscart");
    const blogdetails = client.db("NERD-ACADEMY").collection("blogdetails");
    const courseContent = client.db("NERD-ACADEMY").collection("courseContent");
    const studentAlsoBought = client.db("NERD-ACADEMY").collection("studentAlsoBought");
    const reviewCollection = client.db("NERD-ACADEMY").collection("review");
    const counter = client.db("NERD-ACADEMY").collection("counter");
    const FAQ = client.db("NERD-ACADEMY").collection("FAQ");
    const studentPurchasedCourses = client.db("NERD-ACADEMY").collection("student-purchased-courses");
    const studentOrderHistory = client.db("NERD-ACADEMY").collection("student-order-history");
    const profileCollection = client.db("NERD-ACADEMY").collection("profile");
    const checkoutData = client.db("NERD-ACADEMY").collection("checkout-data");
    const feedbacks = client.db("NERD-ACADEMY").collection("feedbacks");

    //save users info in db
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // Get User  By Email
    app.get("/users", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    // Update User
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const body = req.body;
      console.log(body);
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          body,
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.get("/courses", async (req, res) => {
      const query = {};
      const result = await courses.find(query).toArray();
      res.send(result);
    });

    app.post("/courses", async (req, res) => {
      const course = req.body;
      course.publish = false;
      const upload = await courses.insertOne(course);
      res.send(upload);
    });

    // make verify Teacher >>>>>>>

    app.put("/courses/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      // const options = { upsert: true };
      const updateDoc = {
        $set: {
          publish: true,
        },
      };
      const result = await courses.updateOne(filter, updateDoc);
      res.send(result);
    });

    // get my course
    app.get("/my-courses", async (req, res) => {
      const email = req.query.email;
      const query = {
        email: email,
      };
      const result = await courses.find(query).toArray();
      res.send(result);
    });

    // Publish show publish:
    app.get("/publish", async (req, res) => {
      const email = req.query.email;
      const query = {
        email: email,
      };
      const result = await courses.find(query).toArray();
      res.send(result);
    });


    app.get("/pending", async (req, res) => {
      console.log(req);
      const query = {
      }
      const result = await courses.find(query).toArray();
      res.send(result);
    })

    // delete product
    app.delete("/deleteCourse/:id", async (req, res) => {
      const deleteId = req.params.id;
      const query = {
        _id: ObjectId(deleteId),
      };
      const result = await courses.deleteOne(query);
      res.send(result);
    });

    app.get('/wishlist', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const wishlist = await wishlists.find(query).toArray();
      res.send(wishlist);
    });

    app.post('/wishlist', async (req, res) => {
      const wishlist = req.body;
      const query = {
        course: wishlist.course,
        email: wishlist.email
      };
      const alreadyAdded = await wishlists.find(query).toArray();
      if (alreadyAdded.length) {
        const message = `You already have adeed this`;
        return res.send({ acknowledged: false, message });
      }
      const result = await wishlists.insertOne(wishlist);
      res.send(result);
    });

    app.delete('/wishlist/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await wishlists.deleteOne(query);
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

    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    app.get("/review", async (req, res) => {
      const query = {};
      const result = await reviewCollection.find(query).toArray();
      res.send(result);
    });

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

    // Feedback API start from here

    app.post('/student-feedback', async (req, res) => {
      const data = req.body;
      const upload = await feedbacks.insertOne(data);
      res.send(upload);
    })

    // Feedback API end here

    // student dashboard data load start from here

    app.post('/perchased-course', async (req, res) => {
      const data = req.body;
      const upload = await studentPurchasedCourses.insertOne(data);
      res.send(upload);
    })

    app.get("/perchased-courses/:email", async (req, res) => {
      const email = req.params.email;
      const query = { buyerEmail: email };
      const result = await studentPurchasedCourses.find(query).toArray();
      res.send(result);
    });

    app.get("/student-order-history/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const result = await checkoutData.find(query).toArray();
      res.send(result);
    });

    app.get("/student-assignment", async (req, res) => {
      const query = {};
      const result = await studentAssignment.find(query).toArray();
      res.send(result);
    });

    app.get("/users/role/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      res.send(user);
    });

    // student dashboard data load end here

    // Stripe API starts from here

    app.post("/create-payment-intent", async (req, res) => {
      const payment = req.body;
      const price = payment.total;

      const amount = price * 100;
      // console.log(amount);

      const paymentIntent = await stripe.paymentIntents.create({
        currency: "usd",
        amount: amount,
        payment_method_types: ["card"],
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    // Stripe API end

    app.post("/userscart", async (req, res) => {
      const coursecart = req.body;
      const result = await userscart.insertOne(coursecart);
      res.send(result);
    });

    app.delete("/usercartdata/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userscart.deleteOne(query);
      res.send(result);
    });

    // Update Profile GET API
    app.get("/profile", async (req, res) => {
      const query = {};
      const users = await profileCollection.find(query).toArray();
      res.send(users);
    });

    // Update Profile POST API
    app.post("/profile", async (req, res) => {
      const user = req.body;
      const result = await profileCollection.insertOne(user);
      res.send(result);
    });

    app.delete("/usercartdata/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userscart.deleteOne(query);
      res.send(result);
    });

    app.delete("/usercart/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await userscart.deleteMany(query);
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
