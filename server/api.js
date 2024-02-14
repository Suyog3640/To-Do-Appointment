var express = require("express");
var mongoClient = require("mongodb").MongoClient;
var cors = require("cors"); 


var connectionString = "mongodb://127.0.0.1:27017";

var app = express();
app.use(cors({ origin: " http://192.168.0.102:4000", credentials: true}));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/", (req, res)=>{
    res.send("<h1>To DO - API</h1>");
});

app.get("/appointments", (req, res)=>{
    mongoClient.connect(connectionString).then(clientObject=>{
        var database = clientObject.db("todo");
        database.collection("appointments").find({}).toArray().then(documents=>{
            res.send(documents);
            res.end();
        })
    })
});

app.get("/appointments/:id", (req, res)=>{
    var id = parseInt(req.params.id);
    mongoClient.connect(connectionString).then(clientObject=>{
        var database = clientObject.db("todo");
        database.collection("appointments").find({Id:id}).toArray().then(documents=>{
            res.send(documents);
            res.end();
        })
    })
});

app.post("/addtask", (req, res)=>{
    var task = {
        Id: parseInt(req.body.Id),
        Title: req.body.Title,
        Date: new Date(req.body.Date),
        Description: req.body.Description
    };
    mongoClient.connect(connectionString).then(clientObject=>{
        var database = clientObject.db("todo");
        database.collection("appointments").insertOne(task).then(()=>{
            console.log("Task Added Successfully..");
            res.end();
        })
    })
});

app.put("/edittask/:id", (req, res)=>{
    var id = parseInt(req.params.id);
    mongoClient.connect(connectionString).then(clientObject=>{
        var database = clientObject.db("todo");
        database.collection("appointments").updateOne({Id:id},{$set:{Id: parseInt(req.body.Id), Title: req.body.Title, Date: new Date(req.body.Date), Description: req.body.Description}}).then(()=>{
            console.log("Task Updated Successfully..");
            res.end();
        })
    })
});

app.delete("/deletetask/:id", (req, res)=>{
    var id = parseInt(req.params.id);
    mongoClient.connect(connectionString).then(clientObject=>{
        var database = clientObject.db("todo");
        database.collection("appointments").deleteOne({Id:id}).then(()=>{
            console.log("Task Deleted Successfully..");
            res.end();
        })
    })
});

app.listen(4000);
console.log(`Server Started : http://127.0.0.1:4000`);