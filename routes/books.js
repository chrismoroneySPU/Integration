    // Here we are going to code the API!!!!
// REST application
// Our API works over HTTP
// Using request from the HTTP verbs:
// - POST
// - GET
// - PATCH / PUT
// - DELETE

// For the routes
let express = require('express');
let router = express.Router();
// For the Data Model
let BookSchema = require('../models/books');


function HandleError(response, reason, message, code){
    console.log('ERROR: ' + reason);
    response.status(code || 500).json({"error:": message});
}

router.post('/', (request, response, next) => {
    let newBook = request.body;
    if (!newBook.Name || !newBook.Author || !newBook.ISBN || !newBook.Price){
        HandleError(response, 'Missing Info', 'Form data missing', 500);
    } else {
        let book = new BookSchema({
            Name: newBook.Name,
            Author: newBook.Author,
            ISBN: newBook.ISBN,
            Price: newBook.Price
        });
        book.save((error) => {
            if (error){
                response.send({"error": error});
            } else {
                response.send({"id": book.id});
            }
        });
    }
});

router.get('/', (request, response, next) => {
    let author = request.query['author'];
    if (author){
        BookSchema
            .find({"Author": author})
            .exec( (error, books) => {
                if (error){
                    response.send({"error": error});
                } else {
                    response.send(books);
                }
            });
    } else {
        BookSchema
            .find()
            .exec((error, books) => {
                if (error){
                    response.send({"error": error});
                } else{
                    response.send(books);
                }
            });
    }
});

router.get('/:ISBN', (request, response, next) =>{
    BookSchema
        .findOne({"ISBN": request.params.ISBN}, (error, result) =>{
            if (error) {
                response.status(500).send(error);
            }
            if (result) {
                response.send(result);
            } else {
                response.status(404).send({"id": request.params.id, "error":  "Not Found"});
            }

        });
});

router.patch('/:ISBN', (request, response, next) =>{
    BookSchema
        .findOne({"ISBN": request.params.ISBN}, (error, result)=>{
            if (error) {
                response.status(500).send(error);
            } else if (result){
                if (request.body.ISBN) {
                    delete request.body.ISBN;
                }
                for (let field in request.body){
                    result[field] = request.body[field];
                }
                result.save((error, book)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send(book);
                });
            } else {
                response.status(404).send({"ISBN": request.params.ISBN, "error":  "Not Found"});
            }

        });
});

router.delete('/:ISBN', (request, response, next) =>{
    BookSchema
        .findOne({"ISBN": request.params.ISBN}, (error, result)=>{
            if (error) {
                response.status(500).send(error);
            } else if (result){
                result.remove((error)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send({"deletedISBN": request.params.ISBN});
                });
            } else {
                response.status(404).send({"ISBN": request.params.ISBN, "error":  "Not Found"});
            }
        });
});


module.exports = router;