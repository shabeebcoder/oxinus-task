import express from "express";
import { getAccounts, createAccount, checkUserExists, update, deleteuser } from "./services/db"
import passport, { isAuthenticated } from "./config/passport"
import { userUpdateSchema, loginSchema } from "./config/validations"
const app = express();
require('dotenv').config()


app.use(express.json());
app.use(require('express-session')({ secret: process.env.SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());





app.post('/api/login', passport.authenticate('local'), (req, res) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    res.send({
        status: "success"
    })
});

app.get('/api/accounts', isAuthenticated, async (req, res) => {
    const accounts = await getAccounts()
    res.send(accounts)

});
app.post('/api/accounts', async (req, res) => {
    const { error, value } = userUpdateSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const accounts = await createAccount(req.body)
    console.log("dsds", JSON.stringify(accounts))
    res.send(accounts)
});

app.get('/api/accounts/:id', isAuthenticated, async (req, res) => {

    try {
        const a = await checkUserExists('shabeebcoders@gmail.com')
        res.send("true")
    } catch {
        res.send(false)

    }
});

app.put('/api/accounts/:id', isAuthenticated, async (req, res) => {
    try {
        await update({ ...req.body, id: req.params.id });
        res.send(true)
    } catch (e) {

        res.send(false)
    }
});

app.delete('/api/accounts/:id', isAuthenticated, async (req, res) => {
    try {
        await deleteuser(req.params.id);
        res.send(true)
    } catch (e) {

        res.send(false)
    }
});


app.listen(3000, () => {
    console.log("App running on port 3000")
})