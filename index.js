const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uj2jz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const appointmentCollection = client.db("doctorsPortal").collection("appointments");
    // add Appointment data database---------------------------/
    app.post('/addAppointment', (req, res) => {
        const appointment = req.body;
        console.log(appointment,'khan')
        appointmentCollection.insertOne(appointment)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    //get appointments same data --------------------------/
    app.post('/appointmentsByDate', (req, res) => {
        const date = req.body;
        console.log(date.date, 'all Right');
        appointmentCollection.find({ date: date.date })
            .toArray((err, documents) => {
                res.send(documents)
            })

    });
});




app.get('/', (req, res) => {
    res.send("everything is fine")
});

app.listen(port);