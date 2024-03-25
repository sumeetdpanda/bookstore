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
            return res.status(400).json({message: 'Send all required fields: title, author, publishYear'});
        }

        const newBook = {
            title: req.body.title,
            author: req.body.author,
            publishYear: req.body.publishYear,
        };

        const book = await Book.create(newBook);
        
        return res.status(201).json(book);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
});

// Route to Get All Books from DB
app.get('/books', async (req, res)=> {
    try {
        const books = await Book.find({});

        return res.status(200).json({
            count: books.length,
            data: books
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
});

// Route to Get One Book from DB by id
app.get('/books/:id', async (req, res)=> {
    try {
        const { id } = req.params;

        const books = await Book.findById(id);

        return res.status(200).json(books);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
});

// Route for updating a book in db
app.put('/books/:id', async (req, res)=> {
    try {
        if(
            !req.body.title ||
            !req.body.author ||
            !req.body.publishYear
        ) {
            return res.status(400).json({message: 'Send all required fields: title, author, publishYear'});
        }

        const { id } = req.params;

        const result = await Book.findByIdAndUpdate(id, req.body);

        if(!result){
            return res.status(404).json({message: "Book not found"});
        }

        return res.status(200).json({message: "Book updated successfully"});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message});
    }
});

// Route to delete a book from db
app.delete('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Book.findByIdAndDelete(id);

        if(!result){
            return res.status(404).json({message: "Book not found"});
        }

        return res.status(200).json({message: "Book deleted successfully"});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
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