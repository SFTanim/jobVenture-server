const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();

app.use(cors({
    origin: [
        "https://radiant-mooncake-bb00d0.netlify.app",
        "https://assignment-011-41fa0.web.app",
        "https://assignment-011-41fa0.firebaseapp.com"],
    credentials: true
}));
app.use(express.json());

// MongoDB Start


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        // await client.connect();
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const allPostsData = client.db("assignment-011").collection('allPosts')

        app.get('/allCategoryJob', async (req, res) => {
            const cursor = allPostsData.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/allCategoryJob/:category', async (req, res) => {
            const params = req.params.category;
            const query = { jobCategory: params };
            const cursor = allPostsData.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/allCategory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await allPostsData.findOne(query);
            res.send(result);
        })




        // all posted data get
        app.get('/allPostsData', async (req, res) => {
            const cursor = allPostsData.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/allPostsData/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await allPostsData.findOne(query);
            console.log(result);
            res.send(result);
        })
        // get all posts of single user
        app.get(`/allPostsDataWithMail/:email`, async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email }
            const cursor = allPostsData.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })



        // insert a new post
        app.post('/allPostsData', async (req, res) => {
            const newData = req.body;
            const newDataInserted = await allPostsData.insertOne(newData)
            res.send(newDataInserted)

        })


        // get all posts of single user
        app.delete(`/allPostsData/:id`, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await allPostsData.deleteOne(query)
            res.send(result)
        })

        // update data
        app.put('/allPostsData/:id', async (req, res) => {
            const id = req.params.id;
            const updateData = req.body;

            const findingSpecificData = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatingData = {
                $set: {
                    ApplicationDeadLine: updateData.ApplicationDeadLine,
                    jobDescription: updateData.jobDescription,
                    jobTitle: updateData.jobTitle,
                    postingDate: updateData.postingDate,
                    salaryRange: updateData.salaryRange,
                    applicantNumber: Number(updateData.applicantNumber),
                    jobCategory: updateData.jobCategory,
                    bannerPic: updateData.bannerPic
                }
            }
            const result = await allPostsData.updateOne(findingSpecificData, updatingData, options)
            res.send(result);
        })


        // Applied Data
        app.post('/allApplied/:id', async (req, res) => {
            const id = req.params.id;
            const appliedPerson = req.body;
            const specificJob = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const addAppliedPerson = {
                $push: {
                    appliedPersons: appliedPerson.appliedPerson
                },
                $inc: {
                    applicantNumber: 1
                }
            }
            const result = await allPostsData.updateOne(specificJob, addAppliedPerson, options)
            res.send(result)
            console.log(result);
            console.log(id, appliedPerson.appliedPerson, "applicant", appliedPerson.addAApplicant);
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