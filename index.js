const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


// middlewares
app.use(express.json())
app.use(cors({
   origin: ['http://localhost:5173', 'https://gigforge-4ac2f.web.app'],
   credentials: true,
}))


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f8d3p09.mongodb.net/?retryWrites=true&w=majority`;

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
      app.post('/api/v1/bid_info', async (req, res) => {
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
      app.get('/api/v1/jobs/post/:email', async (req, res) => {
         const email = req.params.email;
         const query = {
            email: email
         }
         const result = await jobCollection.find(query).toArray();
         res.send(result)
      })

      // get data for updating
      app.get('/api/v1/jobs/update/:Id', async (req, res) => {
         const id = req.params.Id;
         const query = {
            _id: new ObjectId(id)
         }
         const result = await jobCollection.findOne(query);
         res.send(result);
      })

      // get data for my_bids page
      app.get('/api/v1/bid_info/:email', async (req, res) => {
         const email = req.params.email;
         const query = { bidderEmail: email }
         const result = await bidCollection.find(query).toArray();
         res.send(result);
      })

      // get data for bid-request page
      app.get('/api/v1/bid_info', async (req, res) => {
         const result = await bidCollection.find().toArray();
         res.send(result);
      })



      // update data
      app.patch('/api/v1/jobs/updateInfo/:id', async (req, res) => {
         const id = req.params.id;
         const updateInfo = req.body;

         const filter = {
            _id: new ObjectId(id)
         }
         const updateDoc = {
            $set: updateInfo
         };
         const result = await jobCollection.updateOne(filter, updateDoc);
         res.send(result)
      })


      // delete data
      app.delete('/api/v1/jobs/delete/:id', async (req, res) => {
         const id = req.params.id;
         const filter = { _id: new ObjectId(id) }
         const result = await jobCollection.deleteOne(filter);
         res.send(result)
      })

   } finally {

   }
}
run().catch(console.dir);


app.get('/', (req, res) => {
   res.send('GigForge Server is Running')
})

app.listen(port, () => {
   console.log(`GigForge Server is running on port: ${port}`)
})