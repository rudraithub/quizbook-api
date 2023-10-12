const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// server.js
const User = require('./models/user');

app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(409).json({ error: 'Username already exists' });
  }

  const newUser = new User(username, password);
  users.push(newUser);

  // Create a JWT token for the new user
  const token = jwt.sign({ username: newUser.username }, 'your-secret-key', {
    expiresIn: '1h', // Token expiration time
  });

  res.status(201).json({ token });
});

// server.js
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find((user) => user.username === username);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Create a JWT token for the authenticated user
  const token = jwt.sign({ username: user.username }, 'your-secret-key', {
    expiresIn: '1h',
  });

  res.json({ token });
});

// server.js
const jwt = require('jsonwebtoken');

// Middleware to verify JWT
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
}

// Protected route example
app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// server.js
app.post('/profile', verifyToken, (req, res) => {
  const { firstName, lastName, dateOfBirth } = req.body;

  // Get the authenticated user
  const user = users.find((u) => u.username === req.user.username);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Create a new profile
  user.profile = new Profile(firstName, lastName, dateOfBirth);

  res.status(201).json({ message: 'Profile created successfully' });
});

app.put('/profile', verifyToken, (req, res) => {
  const { firstName, lastName, dateOfBirth } = req.body;

  // Get the authenticated user
  const user = users.find((u) => u.username === req.user.username);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!user.profile) {
    return res.status(404).json({ error: 'User profile not found' });
  }

  // Update the user's profile
  user.profile.firstName = firstName;
  user.profile.lastName = lastName;
  user.profile.dateOfBirth = dateOfBirth;

  res.json({ message: 'Profile updated successfully', profile: user.profile });
});
