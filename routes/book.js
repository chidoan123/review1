var express = require('express');
var router = express.Router();
//lien ket model
const Book=require("../models/book.model")
const {body, validationResult} = require('express-validator');

/* GET home page. */
router.get('/', async (req, res)=> {
  try{
    const books = await Book.find();
    res.render('book/index',{books});
  }catch(err){
    console.log(`Error:${err}`)
  }
});

//create
router.get('/create',  (req, res)=> {
    res.render('book/create');
 });

 router.post('/create',
  body('title')
    .isLength({ min: 3 })
    .withMessage('title must be at least 3'),
  body('author')
    .isLength({ min: 3 })
    .withMessage('author must be at least 3'),
  body('publicationYear')
    .isNumeric()
    .withMessage('Publication year must be a number')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(`Invalid year (valid: 1900 - ${new Date().getFullYear()})`),
  body('genre')
    .isLength({ min: 3 })
    .withMessage('genre must be at least 3'),

   async (req, res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.render('book/create',{errors: errors.array(),book: req.body});
       // Pass the form data back to pre-fill the form
      
    }
  try{
    const book= new Book(req.body);
    await book.save();
    res.redirect('/book');
  }catch(err){
    console.log(`Error:${err}`)
  }
});

//update
router.get('/update/:id',
   async (req, res)=> {
  try{
    const book= await Book.findById(req.params.id);
    res.render('book/update',{book});
  }catch(err){
    console.log(`Error:${err}`)
  }
 });

 router.post('/update/:id', 
  body('title')
    .isLength({ min: 3 })
    .withMessage('title must be at least 3'),
  body('author')
    .isLength({ min: 3 })
    .withMessage('author must be at least 3'),
  body('publicationYear')
    .isNumeric()
    .withMessage('Publication year must be a number')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(`Invalid year (valid: 1900 - ${new Date().getFullYear()})`),
  body('genre')
    .isLength({ min: 3 })
    .withMessage('genre must be at least 3'),
  async (req, res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.render('book/create',{errors: errors.array(),book: req.body});
       // Pass the form data back to pre-fill the form
      
    }
  try{
    await Book.findByIdAndUpdate(req.params.id, req.body)
    res.redirect("/book")
    }catch(err){
    console.log(`Error:${err}`)
  }
});

//delete
router.get("/delete/:id", async(req, res) =>{
  try{ 
    const book  = await Book.findByIdAndDelete(req.params.id);
    res.redirect("/book");
  }catch{
    console.log(`Error:${err}`);
  }
});

module.exports = router;
