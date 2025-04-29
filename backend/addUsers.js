const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Required by the schema hook

// --- Database Connection ---
// Use the same MongoDB connection string as in your index.js
const dbURI = 'mongodb://startupindia:eLdcBidBdnC7drcF@94.136.186.169:27017/startupindia?authSource=startupindia';

mongoose.connect(dbURI)
    .then(() => {
        console.log('Connected to MongoDB');
        addUsers(); // Call the function to add users after connection
    })
    .catch((err) => console.error('MongoDB connection error:', err));

// --- User Schema and Model (Must match the one in index.js) ---
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // This will store the hashed password
}, {
    timestamps: true
});

// Hash the password before saving a user
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const User = mongoose.model('User', userSchema,'Users'); // Using 'User' model, connects to 'users' collection by default

// --- Function to Add Users ---
async function addUsers() {
    // Define the users you want to add
    // You can change the usernames and passwords here
    const usersToAdd = [
        { username: 'user1', password: 'password1' },
        { username: 'user2', password: 'password2' },
        // { username: 'user3', password: 'password3' },
        // { username: 'user4', password: 'password4' },
        // { username: 'user5', password: 'password5' },
        // Add more users here if needed
    ];

    console.log(`Attempting to add ${usersToAdd.length} users...`);

    for (const userData of usersToAdd) {
        try {
            // Check if user already exists
            const existingUser = await User.findOne({ username: userData.username });
            if (existingUser) {
                console.log(`User "${userData.username}" already exists. Skipping.`);
                continue; // Skip to the next user
            }

            // Create a new user instance
            const newUser = new User({
                username: userData.username,
                password: userData.password // The pre 'save' hook will hash this
            });

            // Save the user to the database
            await newUser.save();
            console.log(`Successfully added user: "${newUser.username}"`);

        } catch (error) {
            console.error(`Error adding user "${userData.username}":`, error.message);
        }
    }

    console.log('Finished attempting to add users.');
    mongoose.connection.close(); // Close the database connection after finishing
    console.log('MongoDB connection closed.');
}

// Note: The addUsers function is called automatically after the database connection is established.
