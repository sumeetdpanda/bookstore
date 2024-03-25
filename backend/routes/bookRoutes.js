import express, { Router } from "express";
import { Book } from '../models/bookModel.js'

const router = express.Router();

// Route to save a new book
router.post('/', async (req, res)=> {
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
router.get('/', async (req, res)=> {
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
router.get('/:id', async (req, res)=> {
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
router.put('/:id', async (req, res)=> {
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
router.delete('/:id', async (req, res) => {
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

export default router;