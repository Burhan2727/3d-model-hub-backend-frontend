const express = require("express")
const cors = require('cors');
const admin = require("firebase-admin");
require("dotenv").config()
const serviceAccount = require("./serviceKey.json");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = 3000
// middlwere
app.use(cors())
app.use(express.json())
// firbase admin sdk start------------
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
// firbase admin sdk end------------
// create Server start-------------------------------
// mongodb connection start----------------

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.iiwakpk.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const varifyToken = async (req, res, next)=>{
    const authorization = req.headers.authorization
    if(!authorization){
       return res.status(401).send({
            message: "unauthorized access. Token not Found"
        })
    }
    const token = authorization.split(" ")[1]
    try {
        await admin.auth().verifyIdToken(token)
        
        next()
    } catch (error) {
        res.status(401).send({
            message: "unauthorized access"
        })
    }
    console.log(token)
    
}
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const db = client.db("model-db")
    const modelCollection = db.collection("models")
    const downloadsCollection = db.collection("downloads")
    // get data from mongo db.......
    // find, findOne
    app.get("/models", async (req, res)=> {
        const result =await modelCollection.find().toArray()
        res.send(result)
    })
    app.get("/models/:id", varifyToken ,async (req, res)=>{
        const {id} = req.params
        const result = await modelCollection.findOne({_id: new ObjectId(id)})
        res.send({
            success: true,
            result
        })
    })
    // get by email--------
    app.get("/my-models", varifyToken ,async (req, res)=>{
        const email = req.query.email
        const result = await modelCollection.find({created_by: email}).toArray()
        res.send(result)
    })
    app.get("/my-downloads", varifyToken ,async (req , res)=> {
        const email = req.query.email
        const result = await downloadsCollection.find({downloaded_by: email}).toArray()
        res.send(result)
    })
    app.get("/search", async (req, res)=>{
      const search_text = req.query.search
      const result = await modelCollection.find({name: {$regex :search_text, $options: "i"}}).toArray()
      res.send(result)
    })
    // update data------------
    // server-> put, mongodb-> updateOne(), updateMany()
    //PUT
    //updateOne
    //updateMany

    app.put("/models/:id", varifyToken ,async (req, res) => {
      const { id } = req.params;
      const data = req.body;
      console.log(id)
      console.log(data)
      const objectId = new ObjectId(id);
      const filter = { _id: objectId };
      const update = {
        $set: data,
      };

      const result = await modelCollection.updateOne(filter, update);

      res.send({
        success: true,
        result,
      });
    });
    // delete Data-------------
    // server-> delete, mongodb-> deleteOne(), deleteMany()
    app.delete("/models/:id" ,async (req, res)=>{
        const {id} = req.params
        const result = await modelCollection.deleteOne({_id: new ObjectId(id)})
        res.send({
            success: true,
            result
        })
    })

    // latest 6 get, sort(), and limit()
    app.get("/latest-models", async (req, res)=> {
        const data = req.body;
        const result = await modelCollection.find().sort({created_at: 'desc'}).limit(6).toArray();
        res.send({
            success: true,
            result
        })
    })

    // set data to mongodb
    // from client post method
    // server to mongodb insertMany(), insertOne()
    app.post("/models" ,async (req, res)=>{
        const data = req.body;
        const result = await modelCollection.insertOne(data)
        res.send({
            success: true,
            result
        })
    })
    // downloads api-----post
   app.post("/downloads", async(req, res) => {
      const data = req.body
      const result = await downloadsCollection.insertOne(data)
      res.send({
            success: true,
            result
        })
    })

  // update downloads.....
  app.put("/downloads/:id", async (req, res)=> {
        const {id} = req.params;
        // const data = req.body;
        const objectId = new ObjectId(id)
        const filter = {_id: objectId};
        const update = {
        $inc: {
          downloads: 1
        }
      }
        const result = await modelCollection.updateOne(filter, update)
        res.send({
            success: true,
            result
        })
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// mongodb connection end----------------

app.get("/", (req, res)=> {
    res.send("Hello Backend World")
})
app.get("/hellow", (req, res)=>{
    res.send("This is Hello server")
})
// create Server end-------------------------------
app.listen(port, ()=>{
    console.log(`Server app listening on port ${port}`)
})