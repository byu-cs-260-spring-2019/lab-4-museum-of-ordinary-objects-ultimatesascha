const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);

const app = express();


// Create a new item in the museum: takes a title and a path to an image.
var db = firebase.firestore();
var itemsRef = db.collection('items');

app.get('/api/items', async (req, res) => {
    try {
        let querySnapshot = await itemsRef.get();
        res.send(querySnapshot.docs.map(doc => doc.data()));
    }
    catch(err) {
        res.sendStatus(500);
    }
});

app.post('/api/items', async (req, res) => {
    try {
        let querySnapshot = await itemsRef.get();
        let numRecords = querySnapshot.docs.length;
        let item = {
            id: req.body.title,
            title: req.body.title,
            path: req.body.path,
            description: req.body.description,
        };
        itemsRef.doc(item.id.toString()).set(item);
        res.send(item);
    } 
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

//delete
app.delete('/api/items/:id', async (req, res) => {
    try {
        let itemToDelete = itemsRef.doc(req.params.id.toString());

        let item = await itemToDelete.get();

        if (!item.exists) {
            res.status(404).send("Sorry, that item does not exist");
            return;
        }

        itemToDelete.delete();
        res.sendStatus(200);
        return;
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

//edit
app.put('/api/items/:id', async function(req, res)  {
    try {
        let itemToEdit = itemsRef.doc(req.params.id.toString());

        item = await itemToEdit.get();

        if (!item.exists) {
            res.status(404).send("Sorry, that item does not exist");
        }

        itemToEdit.update({
            title: req.body.title,
            description: req.body.description,
        });

        res.sendStatus(200);
        return;
    }
    catch (error) {
        console.log(error);
    }
});
exports.app = functions.https.onRequest(app);