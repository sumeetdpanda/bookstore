import express from "express";
import dotenv from "dotenv";
import { PORT } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js"

const app = express();
dotenv.config({path: "./.env"});

// Middleware for parsing request body
app.use(express.json());

app.get('/', (req, res)=> {
    console.log(req);
    return res.status(204).send('Welcome to MERN Stack Tutorial')
});

// Route to save a new book
app.post('/books', async (req, res)=> {
    try {
        
        if(
            !req.body.title ||
            !req.body.author ||
            !req.body.publishYear
        ) {
            return res.status(400).send({message: 'Send all required fields: title, author, publishYear'});
        }

        const newBook = {
            title: req.body.title,
            author: req.body.author,
            publishYear: req.body.publishYear,
        };

        const book = await Book.create(newBook);
        
        return res.status(201).send(book);

    } catch (error) {
        console.log(error);
        res.status(500).send({message: error});
    }
});

mongoose
    .connect(process.env.MONGO_DB_URL)
    .then(()=>{
        console.log("App connected to DB");

        app.listen(PORT, () => {
            console.log(`App is listening on port: ${PORT}`);
        });
    })
    .catch((error)=>{
        console.log(error);
    });