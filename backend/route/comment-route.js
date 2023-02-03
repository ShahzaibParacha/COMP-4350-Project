const express = require('express');
const {
    createComment,
    getAllComments,
    getComment,
    deleteComment,
    updateComment
} = require('../model/comment-model');
const router = express.Router();

//GET all comments
router.get('/', getAllComments);

//GET a single comment
router.get('/:id', getComment);

//POST a new comment
router.post('/', createComment);

//DELETE a signle comment
router.delete('/:id', deleteComment);

//UPDATE a single comment
router.patch('/:id', updateComment);

module.exports = router;
