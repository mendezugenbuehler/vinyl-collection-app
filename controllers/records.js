const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

// Show 
router.get('/', async (req, res) => {
    try {
        const userToView = await User.findById(req.session.user._id);
        if (!userToView) {
            return res.redirect('/');
        }

        res.render('records/index.ejs', {
            records: userToView.recordCollection,
            isCurrentUser: true,
            user: req.session.user,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// Show full record details 
router.get('/:recordId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const recordToView = currentUser.recordCollection.id(req.params.recordId);
        res.render('records/show.ejs', { record: recordToView });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// Show form to add a new record 
router.get('/new', (req, res) => {
    res.render('records/new.ejs');
});

// Create new 
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

// Edit 
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

// Update record
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

// Delete record
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
