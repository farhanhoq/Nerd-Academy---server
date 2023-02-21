const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
// const bodyParser = require('body-parser');
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
    const menuItemsDynamic = client.db("NERD-ACADEMY").collection("menuItems");
    const teachersReview = client.db("NERD-ACADEMY").collection("teacher-review");

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

    app.get("/all-users", async (req, res) => {
      const query = {};
      const result = await usersCollection.find(query).toArray();
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

    app.put("/users", async (req, res) => {
      const email = req.query.email;
      const filter = { enail: email };
      const body = req.body;
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

    app.put("/users-pending-increase", async (req, res) => {
      const email = req.query.email;
      console.log(email)
      const filter = { email: email };
      const updateDoc = {
        $inc: {
          pending : +1
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc
      );
      res.send(result);
    });

    app.put("/users-publish-increase", async (req, res) => {
      const email = req.query.email;
      console.log(email)
      const filter = { email: email };
      const updateDoc = {
        $inc: {
          pending : -1,
          publish : +1
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc
      );
      res.send(result);
    });

    app.put("/users-income", async (req, res) => {
      const email = req.query.email;
      const price = req.body.price
      console.log(email, price)
      const filter = { email: email };
      const updateDoc = {
        $inc: {
          income : +price
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc
      );
      res.send(result);
    });

    // delete users
    app.delete('/del-users/:id', async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: ObjectId(id)
      }
      const result = await usersCollection.deleteOne(query);
      res.send(result)
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


    // get my course
    app.get("/my-courses", async (req, res) => {
      const email = req.query.email;
      const query = {
        email: email,
      };
      const result = await courses.find(query).toArray();
      res.send(result);
    });


    // ------------Created By (Mamun) their below code>>>

    // Update Review created by mamun & Neasher
    app.put('/review/:id', async (req, res) => {
      const id = req.params.id;
      const review = req.body.review;
      console.log(review);
      const query = {
        _id: ObjectId(id)
      };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          review
        }
      };
      const result = reviewCollection.updateOne(query, updatedDoc, options);
      res.send(result);
    });

    // make verify Teacher created by mamun:
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


    // Publish show publish created by mamun:
    app.get("/publish", async (req, res) => {
      const email = req.query.email;
      const query = {
        email: email,
      };
      const result = await courses.find(query).toArray();
      res.send(result);
    });

    // Pending Courses created by mamun
    app.get("/pending", async (req, res) => {
      console.log(req);
      const query = {
      }
      const result = await courses.find(query).toArray();
      res.send(result);
    });

    app.put('/pending/:id', async (req, res) => {
      const id = req.params.id;
      const suggested = req.body.suggested.suggestion;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          suggested
        }
      };
      const result = courses.updateOne(query, updatedDoc, options);
      res.send(result);
    });

    // Student (My reviews) created by mamun
    app.get("/studentsReviews/", async (req, res) => {
      const email = req.query.email;
      const query = { userEmail: email };
      const result = await reviewCollection.find(query).toArray();
      res.send(result);
    });


    // delete Review created by Mamun
    app.delete('/review/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) }
      const result = await reviewCollection.deleteOne(query);
      res.send(result)
    });

    // --------------------------------------------------------------------------
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

    //post review
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    app.post("/teachers-review", async (req, res) => {
      const review = req.body;
      const result = await teachersReview.insertOne(review);
      res.send(result);
    });

    app.get("/review", async (req, res) => {

      // const email = req.query.email;
      const courseId = req.query.courseId;
      // const query = { instructorMail: email, courseId: courseId };
      const query = { courseId: courseId };
      console.log(query);
      const result = await reviewCollection.find(query).toArray();
      // console.log(result);
      res.send(result);
    });

    //dashboard review for specific instructor
    app.get("/das-review", async (req, res) => {
      const email = req.query.email;
      const query = { instructorMail: email };
      // console.log(query);
      const result = await reviewCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    });

    app.post("/blog", async (req, res) => {
      const blogs = req.body;
      const result = await blogdetails.insertOne(blogs);
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

    app.post("/checkout-data", async (req, res) => {
      const data = req.body;
      const upload = await checkoutData.insertOne(data);
      res.send(upload);
    });

    app.get('/perchased-course', async (req, res) => {
      const query = {};
      const result = await checkoutData.find(query).toArray();
      res.send(result);
    })

    app.post('/perchased-course', async (req, res) => {
      const data = req.body;
      const upload = await studentPurchasedCourses.insertOne(data);
      res.send(upload);
    })


    app.get("/perchased-courses-teacher", async (req, res) => {
      const email = req.query.email;
      const query = { instructorEmail: email };
      const result = await studentPurchasedCourses.find(query).toArray();
      res.send(result);
    });

    app.delete('/del-perchased-courses-student/:id', async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: ObjectId(id)
      }
      const result = await studentPurchasedCourses.deleteOne(query);
      res.send(result)
    });

    app.get("/perchased-courses/:email", async (req, res) => {
      const email = req.params.email;
      const query = { buyerEmail: email };
      const result = await studentPurchasedCourses.find(query).toArray();
      res.send(result);
    });

    app.get("/student-order-history", async (req, res) => {
      const email = req.query.email;
      const query = { userEmail: email };
      const result = await checkoutData.find(query).toArray();
      res.send(result);
    });

    app.get("/teacher-order-history", async (req, res) => {
      const email = req.query.email;
      const query = { instructorEmail: email };
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


    //menu items
    app.post("/api/menu-items", async (req, res) => {
      const pages = req.body;
      const result = await menuItemsDynamic.insertOne(pages);
      res.send(result);
    });

    app.get("/api/menu-items", async (req, res) => {
      const query = {};
      const result = await menuItemsDynamic.find(query).toArray();
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
