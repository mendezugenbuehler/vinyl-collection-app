const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

//index
router.get('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        res.render('records/index.ejs', {
            records: currentUser.recordCollection,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

//new
router.get('/new', (req, res) => {
    res.render('records/new.ejs');
});

//delete and post
router.post('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const newRecord = {
            artist: req.body.artist,
            album: req.body.album,
            format: req.body.format,
            rating: req.body.rating || null,
            review: req.body.review || '',
        };

        currentUser.recordCollection.push(newRecord);
        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/records`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

//update
router.get('/:recordId/edit', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const recordToEdit = currentUser.recordCollection.id(req.params.recordId);
        res.render('records/edit.ejs', { record: recordToEdit });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

//change
router.put('/:recordId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const recordToUpdate = currentUser.recordCollection.id(req.params.recordId);

        recordToUpdate.set({
            artist: req.body.artist,
            album: req.body.album,
            format: req.body.format,
            rating: req.body.rating || null,
            review: req.body.review || '',
        });

        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/records`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// delete
router.delete('/:recordId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        currentUser.recordCollection.id(req.params.recordId).deleteOne();
        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/records`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

module.exports = router;
