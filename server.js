// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const upload = multer();
const app = express();

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));
app.use(express.static('./public'));

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://piyushroxx11223:root@cluster0.wkgc6tk.mongodb.net/webtech?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('Error connecting to MongoDB Atlas:', err.message);
});

// User model schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
// Define the User model
const User = mongoose.model('User', userSchema, 'details');


// // Add sample values
// const sampleUsers = [
//   { name: 'John Doe', email: 'john@example.com', password: 'password1' },
//   { name: 'Jane Smith', email: 'jane@example.com', password: 'password2' }
// ];

// // Insert sample users into the database
// User.insertMany(sampleUsers)
//   .then(users => console.log('Sample users added:', users))
//   .catch(err => console.error('Error adding sample users:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/index.ejs', (req, res) => {
  res.render('index');
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/Login_Signup.ejs', async (req, res) => {
  try {
    const users = await User.find({});
    res.render('Login_Signup.ejs', { users });
  } catch (err) {
    console.error('Error finding users:', err.message);
    res.redirect('/');
  }
});

// Handle signup form submission
app.use(upload.none());

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate input data
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if the user already exists (case-insensitive)
    const existingUser = await User.findOne({ email: { $regex: new RegExp(email, 'i') } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user document
    const newUser = new User({
      name,
      email,
      password
    });

    // Save the new user to the database
    await newUser.save();

    // Redirect to the index page upon successful signup
    res.redirect('/index.ejs');
  } catch (err) {
    console.error('Error occurred during signup:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Verify the password
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Render the index page upon successful login
    res.render('index');
  } catch (err) {
    console.error('Error occurred during login:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/Services_Page.ejs', (req, res) => {
  res.render('Services_Page');
});

app.get('/Team.ejs', (req, res) => {
  res.render('Team');
});

app.get('/Unique_Features.ejs', (req, res) => {
  res.render('Unique_Features');
});

const port = 3000;
app.listen(port, function(err) {
  if (err) {
    return console.log("An error occurred.");
  }
  console.log(`Server listening on port ${port}`);
});
