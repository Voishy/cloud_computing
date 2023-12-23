const functions = require("firebase-functions");

const admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const express = require("express");
const cors = require("cors");

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Main App
const app =express();
app.use(cors({origin: true}));

// Main databases reference
const db = admin.firestore();

// Routes
app.get("/", (req, res) => {
    return res.status(200).send("Hai there how you doing? ...");
});

// create -> post()
app.post("/api/create", (req, res) => {
    (async () => {
        try {
            await db.collection('userDetails').doc(`/${Date.now()}`).create({
                id : Date.now(),
                title : req.body.title,
                times : req.body.times,
                article : req.body.article,
            });
            return res.status(200).send({ status: 'Success', msg: "Data Saved"});
        } catch(error){
            console.log(error)
            return res.status(500).send({ status: 'Failed', msg: error });
        }
    })();
});
// get -> get()
// Fetch  - single data from firestoreusing spesific id
app.get("/api/get/:id", (req, res) => {
    (async () => {
        try {
            const reqDoc = db.collection('userDetails').doc(req.params.id);
            let userDetail = await reqDoc.get();
            let response = userDetail.data();

            return res.status(200).send({ status: "Success", data: response });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ status: "Failed", msg: error });
        }
    })();
});

// Fetch  - All details from firestore
app.get("/api/getAll", (req, res) => {
    (async () => {
        try {
            const query = db.collection('userDetails');
            let response = [];

            await query.get().then((data) => {
                let docs = data.docs;

            docs.map((doc) => {
                const selectedItem = {
                title: doc.data().title,
                times: doc.data().times,
                article: doc.data().article,
                };

                response.push(selectedItem);
            });
            return response;
        });

            return res.status(200).send({ status: "Success", data: response });
            } catch (error) {

            console.log(error);
            return res.status(500).send({ status: "Failed", msg: error });
        }
    })();
});

// update -> put()
app.put("/api/update/:id", (req, res) => {
    (async () => {
        try {
            
            const reqDoc = db.collection('userDetails').doc(req.params.id);
            await reqDoc.update({
                title: req.body.title,
                times: req.body.times,
                article: req.body.article,
            });

            return res.status(200).send({ status: 'Success', msg: "Data Updated"});
        } catch(error){
            console.log(error)
            return res.status(500).send({ status: 'Failed', msg: error });
        }
    })();
});
// delete -> delete()
app.delete("/api/delete/:id", (req, res) => {
    (async () => {
        try {
            
            const reqDoc = db.collection('userDetails').doc(req.params.id);
            await reqDoc.delete();

            return res.status(200).send({ status: 'Success', msg: "Data Removed"});
        } catch(error){
            console.log(error)
            return res.status(500).send({ status: 'Failed', msg: error });
        }
    })();
});
// export the api to firebase cloud funtions
exports.app = functions.https.onRequest(app);
