const express = require('express');
const cors = require('cors');
const port = 4040;
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hey, This is Carserv Server!');
})

// Mongo DB Connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pcwvo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("carserv").collection("services");
  const teamCollection = client.db("carserv").collection("team");
  const reviewCollection = client.db("carserv").collection("review");
  const orderCollection = client.db("carserv").collection("orders")
  // perform actions on the collection object

  console.log(err)

  // Service Adding
  app.post('/addService', (req, res) => {
      const service = req.body;
      //console.log(service)
      serviceCollection.insertOne(service)
      .then(result => {
          console.log(result)
          res.send(result.insertedCount > 0)
      })
  })


  // Getting Services
  app.get('/services', (req, res) => {
      serviceCollection.find()
      .toArray((err, documents) => {
        res.send(documents)
      })


  })





// Getting Service By Id
app.get('/services/:id', (req, res) => {
    // const id = ObjectId(req.params._id); 
    // console.log(id)
    serviceCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) => {
        res.send(documents)
        console.log(documents)
        console.log(err)
    })

})



// adding Order
app.post('/addOrder', (req, res) => {
    const order = req.body;
    //console.log(order)
    orderCollection.insertOne(order)
    .then(result => {
        console.log(result)
        res.send(result.insertedCount > 0)
    })
})


// getting full order List
app.get('/orderList', (req, res) => {
    orderCollection.find()
    .toArray((err, documents) => {
        res.send(documents)
    })
})


// getting orders for specific Email
app.get('/orderViaEmail', (req, res) => {

    orderCollection.find({email: req.query.email})
    .toArray((err, documents) => {
        res.status(200).send(documents)
        console.log(documents)
    })
})


// Specific Rule for Team
app.post('/isTeam', (req, res) => {
    const email = req.body.email;
    teamCollection.find({email: email})
    .toArray((err, teams) => {
        res.send(teams.length > 0)
    })
})











  // Team Adding
  app.post('/addTeam', (req, res) => {
      const team = req.body;
      teamCollection.insertOne(team)
      .then(result => {
          console.log(result)
          res.send(result.insertedCount > 0)
      })
  })

  // Getting Team in UI
  app.get('/team', (req, res) => {
      teamCollection.find()
      .toArray((err, documents) => {
          res.send(documents)
      })
  })


  // Adding Review 
  app.post('/addReview', (req,res) => {
      const review = req.body;
      reviewCollection.insertOne(review)
      .then(result => {
          res.send(result)
      })
  })

  // getting Reviews 
  app.get('/reviews', (req, res) => {
      reviewCollection.find()
      .toArray((err, documents) => {
          res.send(documents)
      })
  })









    console.log('Database Connected!')
  //client.close();
});










app.listen(process.env.PORT || port)
