const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));
app.use(express.json());

// MongoDB Start


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9sxzsr9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const allCategoryJob = client.db("assignment-011").collection('allJobs')

        app.get('/allCategoryJob', async (req, res) => {
            const cursor = allCategoryJob.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/allCategoryJob/:category', async (req, res) => {
            const params = req.params.category;
            const query = { category: params };
            const cursor = allCategoryJob.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// MongoDB Finish













app.get('/', (req, res) => {
    res.send('Assignment-011 Server Running')
})

app.listen(port, () => {
    console.log("Assignment-011 is running on port: ", port);
})