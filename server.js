// Import necessary libraries
import express from 'express'; // For creating a web server
import cors from 'cors'; // To enable Cross-Origin Resource Sharing (CORS)
import mysql from 'mysql2/promise'; // For interacting with the MySQL database
import bcrypt from 'bcrypt'; // For securely hashing passwords

// Create an instance of the Express application
const app = express();

// Define the port number for the server to listen on
const port = 3002;

// Configure the connection to the MySQL database
const pool = mysql.createPool({
  host: 'localhost', // Hostname of the MySQL server
  user: 'jjinnspecs', // Username for the MySQL database
  password: '0000', // Password for the MySQL database
  database: 'proj1', // Name of the MySQL database
});

// Use middleware to handle incoming requests
app.use(cors()); // Allow requests from different origins
app.use(express.json()); // Parse incoming JSON data in request bodies

// Define the number of rounds for password hashing
const saltRounds = 10;

// Define a secret key for potential use in generating JWTs (not used in this example)
const jwtSecret = 'ogsy'; 

// Handle user signup requests
app.post('/api/signup', async (req, res) => {
  // Extract user information from the request body
  const { firstName, lastName, phoneNumber, email, username, password } = req.body;

  try {
    // Hash the password using bcrypt for security
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Execute SQL query to insert the user into the database
    const [results] = await pool.execute(
      'INSERT INTO users (firstName, lastName, phoneNumber, email, username, password) VALUES (?, ?, ?, ?, ?, ?)',
      [firstName, lastName, phoneNumber, email, username, hashedPassword]
    );

    // Send a success response to the client
    res.status(201).json({ message: 'User registered successfully' }); 
  } catch (error) {
    // Log any errors that occurred during registration
    console.error('Error registering user:', error);

    if (error.code === 'ER_DUP_ENTRY') { // Check for duplicate username/email
      res.status(409).json({ message: 'Username or email already exists' });
    } else {
      // Send an internal server error response
      res.status(500).json({ message: 'Registration failed' });
    }
  }
});

// Handle user login requests
app.post('/api/login', async (req, res) => {
  const { loginIdentifier, password } = req.body;

  if (!loginIdentifier || !password) {
    return res.status(400).json({ error: 'Identifier and password are required' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ? OR email = ? OR phoneNumber = ?', [loginIdentifier, loginIdentifier, loginIdentifier]);

    let user = rows[0];

    if (!user) {
      return res.status(400).json({ error: 'User does not exist' }); 
    }

    try {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // Login successful (generate token, handle session, etc.)
        res.json({ message: 'Login successful' }); 
      } else {
        return res.status(400).json({ error: 'Wrong password' }); 
      }
    } catch (compareError) {
      // Handle bcrypt comparison errors
      if (compareError.message === 'data and hash arguments required') {
        console.error('Error: Missing password or hashed password.');
        return res.status(500).json({ error: 'Internal server error: Missing password or hashed password.' }); 
      } else {
        console.error('Error comparing password:', compareError);
        return res.status(500).json({ error: 'Internal server error' }); 
      }
    }
  } catch (error) {
    console.error('Error finding user:', error);
    return res.status(500).json({ error: 'Internal server error' }); 
  }
}); 

// Handle 404 Not Found requests
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Start the server and listen for connections
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});