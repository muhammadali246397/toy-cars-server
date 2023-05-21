const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port =process.env.PORT || 3000

app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
  res.send('this server is running fine')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rfaan6v.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const database = client.db('toyCars')
    const carCollection = database.collection('carCollection')
    // Connect the client to the server	(optional starting in v4.7)

    app.post('/alltoys',async(req,res) => {
      const toyinfo =req.body;
      console.log(toyinfo)
      const result = await carCollection.insertOne(toyinfo)
      res.send(result)

    })

    app.get('/alltoys',async(req,res) => {
      const cursor = carCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    app.get('/alltoys/:id',async (req,res) => {
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await carCollection.findOne(query)
      console.log(result)
      res.send(result)
    })

    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})