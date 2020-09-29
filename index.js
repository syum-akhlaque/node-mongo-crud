const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const password = 'o65YdjyFT5P2rADb';
// db name = firstdb
// Connection URL
const uri = "mongodb+srv://dbUser:o65YdjyFT5P2rADb@cluster0.plwup.mongodb.net/firstdb?retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req,res) =>{
    // res.send("hello i am working")
    res.sendFile(__dirname +'/index.html')
})
// Use connect method to connect to the Server
const client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("firstdb").collection("products");

    // send data to mongodb----
      app.post("/addProduct", (req,res) => {
      const product = req.body;
      collection.insertOne(product)
      .then( result=>{
          console.log('successsfully added data' )
          res.redirect("/")
        })
    }) //---

    // Read data from mongodb----
    app.get('/product', (req,res) =>{
      collection.find({})
      .toArray((err, documents) =>{
        res.send(documents); 
      })
    })

  //get data for update 
    app.get('/product/:id', (req,res)=>{
      collection.find({_id : ObjectId(req.params.id)})
      .toArray((err,documents) => {
        res.send(documents[0]);
      })
      
    })
  //update
  app.patch('/update/:id', (req,res)=>{
    collection.updateOne({_id: ObjectId(req.params.id)},
    { 
      $set: { item: req.body.item, quantity: req.body.quantity}
     }
    )
    .then(result => {
      res.send(result.modifiedCount> 0)
    })
  })
  
  // delete data from mongodb
  app.delete('/delete/:id', (req,res)=>{
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
       res.send(result.deletedCount> 0)
      
    })
  })
});

app.listen(3000)