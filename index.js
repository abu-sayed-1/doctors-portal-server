const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const e = require('express');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uj2jz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());

// use Upload File dependencies------0002k----------/
app.use(express.static('doctors'));
app.use(fileUpload());
//----0002k
const port = 5000;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const appointmentCollection = client.db("doctorsPortal").collection("appointments");
    // add Appointment data database---------------------------/
    app.post('/addAppointment', (req, res) => {
        const appointment = req.body;
        console.log(appointment, 'khan')
        appointmentCollection.insertOne(appointment)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });


    // get all appointment data -------------------------/
    app.get('/appointmentAllData', (req, res) => {
        appointmentCollection.find({})
            // .limit(4)
            .toArray((err, documents) => {
                res.send(documents);
            })

    })




    //get appointments same data --------------------------/
    app.post('/appointmentsByDate', (req, res) => {
        const date = req.body;
        console.log(date.date, 'all Right');
        appointmentCollection.find({ date: date.date })
            .toArray((err, documents) => {
                res.send(documents)
            })

    });

    // Add database doctors Upload file image---0003k-----------/
    app.post('/addDoctors', (req, res) => {
        const file = req.files.file;

        const name = req.body.name;
        const email = req.body.email;
        console.log(name, email, file);

        file.mv(`${__dirname}/doctors/${file.name}`, err => {
            if (err) {
                console.log(err);
                return res.status(500).send({ msg: 'Failed to upload image' });
            }
            return res.send({ name: file.name, path: `/${file.name}` })
        }) 
        //eic code--0003k ^^di amra amader doctors folder er modde client side e file er data amarde server er folder e data paThaidichi
    })



});




app.get('/', (req, res) => {
    res.send("everything is fine")
});

app.listen(port);