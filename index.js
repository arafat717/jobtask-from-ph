const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000;


// midleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7ct1cb2.mongodb.net/?retryWrites=true&w=majority`;

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

        const serviceCollection = client.db("collegeServer").collection("colleges");
        const allCollection = client.db("collegeServer").collection("allCard");
        const allreviews = client.db("collegeServer").collection("addreview");
        const addinfo = client.db("collegeServer").collection("info");

        const indexKeys = { name: 1, catagory: 1 };
        const indexOptions = { name: "catagoryname" };

        const result = await serviceCollection.createIndex(indexKeys, indexOptions)


        app.get('/searchname/:text', async (req, res) => {
            const searchtext = req.params.text;
            const result = await serviceCollection.find({
                $or: [
                    { name: { $regex: searchtext, $options: "i" } },

                ]
            }).toArray()
            res.send(result)
        })

        app.get('/colleges', async (req, res) => {
            const cursor = serviceCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/addinfo', async (req, res) => {
            const body = req.body;
            console.log(body)
            const result = await addinfo.insertOne(body);
            res.send(result)
        })

        app.get('/addinfo', async (req, res) => {
            const cursor = addinfo.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/allcard', async (req, res) => {
            const cursor = allCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/addreview', async (req, res) => {
            const cursor = allreviews.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        app.get('/colleges/:id', async(req,res)=>{
            const id = req.params.id;
            console.log(id)
            
            const query = {_id: new ObjectId(id)}
            const result = await serviceCollection.findOne(query)
            res.send(result)
        })


        app.get('/allcard/:id', async(req,res)=>{
            const id = req.params.id;
            console.log(id)
            
            const query = {_id: new ObjectId(id)}
            const result = await allCollection.findOne(query)
            res.send(result)
        })


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
    res.send('the server of college is rinning')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})