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
    // const indexKeys = { carname:1};
    // const indexOptions = { name: "carname" }; 
    // const result = await carCollection.createIndex(indexKeys, indexOptions);

    app.post('/alltoys',async(req,res) => {
      const toyinfo =req.body;
      console.log(toyinfo)
      const result = await carCollection.insertOne(toyinfo)
      res.send(result)

    })

    app.get('/toys/:category',async(req,res) => {
      
      const category = await carCollection
      .find({
        category: req.params.category,
      }).limit(2)
      .toArray();
    res.send(category);
    })

    app.get('/alltoys',async(req,res) => {
      const cursor = carCollection.find().limit(20);
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

    app.get('/mytoys',async(req,res) => {
      let query = {};
      if(req.query.selleremail){
        query = {selleremail:req.query.selleremail}
      }
      const result = await carCollection.find(query).toArray()
      res.send(result)
    })
    
    app.get('/mytoys/:id',async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await carCollection.findOne(query)
      res.send(result)
    })

    app.put('/mytoys/:id',async(req,res) => {
      const id = req.params.id;
      const updateInfo = req.body;
      const filter ={ _id : new ObjectId(id)}
      const options = {upsert:true};
      const updateDoc = {
        $set:{
          price:updateInfo.price,
          quantity:updateInfo.quantity,
          description:updateInfo.description
        }
      }
      const result = await carCollection.updateOne(filter,updateDoc,options)
      res.send(result)
    })

    app.get('/mytoy',async(req,res) => {
     
      const result = await carCollection.find().toArray()
      res.send(result)
    })

    app.delete('/mytoy/:id',async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await carCollection.deleteOne(query)
      res.send(result)
    })

    app.get('/searchcar',async(req,res) => {
     
      const result = await carCollection.find().toArray()
      res.send(result)
    })

    // app.get("/searchcar/:carname", async (req, res) => {
    //   const carname = req.params.carname;
    //   const result = await carCollection
    //     .find({
    //       $or: [
    //         { carname: { $regex: carname, $options: "i" } },
    //       ],
    //     })
    //     .toArray();
    //   res.send(result);
    // });



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