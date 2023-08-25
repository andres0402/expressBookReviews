const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred."});
      } else {
        return res.status(404).json({message: "User already exists"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user. Please provide a valid username and password."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const fetchBookDetails = () => {
        return new Promise((resolve, reject) =>{
            if(books){
                resolve(books);
            }
            else{
                reject(new Error("No books were found"));
            }
            
        });
    };

        
    fetchBookDetails()
    .then(details => {
        res.json(details);
    })
    .catch(error => {
        res.status(404).json({ message: error.message });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

    let isbn = req.params.isbn;

    const fetchBookDetails = () => {
        return new Promise((resolve, reject) =>{
            if(books[isbn]){
                resolve(books[isbn]);
            }
            else{
                reject(new Error("No books were found"));
            }
            
        });
    };
  
    fetchBookDetails()
    .then(details => {
        res.json(details);
    })
    .catch(error => {
        res.status(404).json({ message: error.message });
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
   
        let author = req.params.author;

        const fetchBookDetails = () => {
            return new Promise((resolve, reject) => {
                const results = Object.values(books).filter((book) => {
                    return book.author === author;
                });
    
                if (results.length > 0) {
                    resolve(results);
                } else {
                    reject(new Error("No books were found written by the author"));
                }
            });
        };
    
        fetchBookDetails()
            .then(details => {
                res.json(details);
            })
            .catch(error => {
                res.status(404).json({ message: error.message });
            });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;

    const fetchBookDetails = () => {
        return new Promise((resolve, reject) => {
            let results = Object.values(books).filter((book)=>{
                return book.title === title;
            });

            if (results.length > 0) {
                resolve(results);
            } else {
                reject(new Error("No books were found written by the author"));
            }
        });
    };

    fetchBookDetails()
            .then(details => {
                res.json(details);
            })
            .catch(error => {
                res.status(404).json({ message: error.message });
            });
    

    
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];

    if(book){
        res.send({
            "reviews": book.reviews 
        });
    }
    else{
        res.status(404).json({message: "No books where found with the ISBN provided"});
    }
});

module.exports.general = public_users;
