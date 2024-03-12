const fs = require('fs');

let users = [];
const USERS_FILE = 'users.json';

// Load existing users from the JSON file
try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    users = JSON.parse(data);
} catch (error) {
    console.error('Error loading users:', error);
}
if (!Array.isArray(users)) {
    console.error('Invalid users data loaded from file:', users);
    users = [];
}

// Save users to the JSON file
const saveUsersToFile = () => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 4), 'utf8');
};

// Endpoint to handle account creation
const createAccount = (req, res) => {
    const { username, password } = req.body;

    // Check if username already exists
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    // Add new user to the array
    users.push({ username, password });

    // Save the updated user list to the JSON file
    saveUsersToFile();

    return res.status(201).json({ message: 'Account created successfully' });
};

// Endpoint to handle login
const login = (req, res) => {
    const { username, password } = req.body;

    // Check if username and password match an entry in the users array
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        return res.status(200).json({ message: 'Login successful' });
    } else {
        return res.status(401).json({ error: 'Invalid username or password' });
    }
};

module.exports = { createAccount, login };
