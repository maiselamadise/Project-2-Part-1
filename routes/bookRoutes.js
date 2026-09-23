const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');
const {
  validate,
  mongoIdParam,
  bookCreateRules,
  bookUpdateRules,
} = require('../middleware/validators');

router.route('/').get(getBooks).post(bookCreateRules, validate, createBook);

router
  .route('/:id')
  .get(mongoIdParam, validate, getBookById)
  .put([...mongoIdParam, ...bookUpdateRules], validate, updateBook)
  .delete(mongoIdParam, validate, deleteBook);

module.exports = router;
