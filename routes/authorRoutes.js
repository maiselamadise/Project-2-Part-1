const express = require('express');
const router = express.Router();
const {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} = require('../controllers/authorController');
const {
  validate,
  mongoIdParam,
  authorCreateRules,
  authorUpdateRules,
} = require('../middleware/validators');

router.route('/').get(getAuthors).post(authorCreateRules, validate, createAuthor);

router
  .route('/:id')
  .get(mongoIdParam, validate, getAuthorById)
  .put([...mongoIdParam, ...authorUpdateRules], validate, updateAuthor)
  .delete(mongoIdParam, validate, deleteAuthor);

module.exports = router;
