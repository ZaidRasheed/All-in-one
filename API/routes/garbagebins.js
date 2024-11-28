import express from 'express'
const router = express.Router();

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const serviceAccount = require("../serviceAccountKey.json")

const URL = process.env.URL

import admin from "firebase-admin"
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: URL
});


const options = ['full', 'half', 'empty']
router
    .route("")
    .get((req, res) => {
        const docRef = admin.firestore().collection('bens');
        docRef.get()
            .then(snapshot => {
                let arrayR = snapshot.docs.map(doc => {
                    return doc.data();
                });
                return res.json(arrayR);

            }).catch(function (error) {
                return res.json({ error: error });
            })
    })
    .post((req, res) => {
        try {
            if (!options.includes(req.body.level)) return res.json({ status: "Invalid level", message: "Please choose a valid status level" })
            const newBin = {
                id: req.body.id,
                level: req.body.level,
                enabled: req.body.enabled
            }
            admin.firestore().collection('bens').doc(newBin.id).set(newBin)
            res.json({ status: "success", message: `Bin ${newBin.id} has been created` })
        } catch (error) {
            res.json({ status: "error", message: error })
        }
    })
    .patch((req, res) => {
        try {
            if (!options.includes(req.body.level)) return res.json({ status: "Invalid level", message: "Please choose a valid status level" })
            admin.firestore().collection('bens').doc(req.body.id).update({ enabled: req.body.enabled })
            res.json({ status: "success", message: `Bin ${req.body.id} has been updated` })

        } catch (error) {
            res.json({ status: "error", error: error.message })
        }

    })
    .put((req, res) => {
        try {
            if (!options.includes(req.body.level)) return res.json({ status: "Invalid level", message: "Please choose a valid status level" })
            admin.firestore().collection('bens').doc(req.body.id).update({ level: req.body.level })
            res.json({ status: "success", message: `Bin ${req.body.id} has been updated` })

        } catch (error) {
            res.json({ status: "error", error: error.message })
        }
    })
    .delete((req, res) => {
        try {
            admin.firestore().collection('bens').doc(req.body.id).delete()
            res.json({ status: "success", message: `Bin ${req.body.id} has been deleted` })
        } catch (error) {
            console.log(error)
            res.json({ status: "error", message: `Unable to delete bin ${req.body.id}` })
        }

    });

export default router;