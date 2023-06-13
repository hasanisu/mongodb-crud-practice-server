const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('mongodb practicing is running')
})



const uri = "mongodb+srv://hasanIsu:hasanisu12345@cluster0.dkggbgt.mongodb.net/?retryWrites=true&w=majority";

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
    await client.connect();
    const userCollection = await client.db("pracDb").collection('items');
    
    app.get('/products', async (req, res) =>{
      const query = {};
      const cursor = userCollection.find(query);
      const pro = await cursor.toArray();
      res.send(pro)
    })
    app.get('/products/:id', async (req, res) =>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await userCollection.findOne(query);
      res.send(result)
    })

    app.post('/products', async (req, res) =>{
       const pro = req.body;
       const result = await userCollection.insertOne(pro)
       res.send(result)
       console.log(result)
    })

    app.put('/products/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const updatedProduct = req.body;
      const option = {upsert: true}
      const updateDoc = {
        $set:{
          name: updatedProduct.name,
          photoURL: updatedProduct.photoURL,
          price: updatedProduct.price,
          quantity: updatedProduct.quantity
        }
      }
      const result = await userCollection.updateOne(filter, updateDoc, option)
      res.send(result)
    })

    app.delete('/products/:id', async (req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })

    

  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`practice running on the port ${port}`)
})