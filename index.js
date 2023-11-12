const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;



// middlewares
app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f8d3p09.mongodb.net/?retryWrites=true&w=majority`;

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

      const jobCollection = client.db('GigForgeDB').collection('posted-jobs')
      const bidCollection = client.db('GigForgeDB').collection('bidder-info')



      // create data 

      // post jobs 
      app.post('/api/v1/jobs', async (req, res) => {
         const job = req.body;
         const result = await jobCollection.insertOne(job)
         res.send(result)
      })

      // post bidder info
      app.post('/api/v1/bid-info', async (req, res) => {
         const info = req.body;
         const result = await bidCollection.insertOne(info);
         res.send(result);
      })


      // read data 

      // get data by category
      app.get('/api/v1/jobs', async (req, res) => {
         const category = req.query.category;
         const query = {
            category: category
         }
         const result = await jobCollection.find(query).toArray()
         res.send(result);
      })

      // get specific data on clicking
      app.get('/api/v1/jobs/:id', async (req, res) => {
         const id = req.params.id;
         const query = {
            _id: new ObjectId(id)
         }
         const result = await jobCollection.findOne(query)
         res.send(result)
      })

      // get posted job 
      app.get('/api/v1/jobs/post/:email', async (req, res) =>{
         const email = req.params.email;
         const query = {
            email: email
         }
         const result = await jobCollection.find(query).toArray();
         res.send(result)
      })



      // Connect the client to the server	(optional starting in v4.7)
      // await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
   }
}
run().catch(console.dir);



app.get('/', (req, res) => {
   res.send('GigForge Server is Running')
})

app.listen(port, () => {
   console.log(`GigForge Server is running on port: ${port}`)
})