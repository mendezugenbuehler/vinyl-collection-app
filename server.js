const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
dotenv.config();

const passUserToView = require('./middleware/pass-user-to-view.js');
const isSignedIn = require('./middleware/is-signed-in.js');

const authController = require('./controllers/auth.js');
const usersController = require('./controllers/users.js');
const recordsController = require('./controllers/records.js');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use(passUserToView);

app.use('/auth', authController);

app.use(isSignedIn);

app.use('/users', usersController);

app.use('/users/:userId/records', recordsController);
app.use('/records', recordsController);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/record-collection', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});


app.get('/', (req, res) => {
    if (!req.session.user) {
        return res.render('index.ejs', { user: null, records: [] });
    }

    const user = req.session.user;
    const records = user.recordCollection || [];
    res.render('index.ejs', { user, records });
});


app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...');
});
