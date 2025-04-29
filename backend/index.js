const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { parse } = require('csv-parse');
const fs = require('fs');
const bcrypt = require('bcrypt'); // Added bcrypt

const app = express();

// CORS setup
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

// Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// MongoDB connection
mongoose.connect('mongodb://startupindia:eLdcBidBdnC7drcF@94.136.186.169:27017/startupindia?authSource=startupindia')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// User schema
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

// User model
const User = mongoose.model('User', userSchema ,'User'); // Using 'User' as the model name and collection name by default

// Create a default admin user if one doesn't exist (Optional, for initial setup)
async function createDefaultAdmin() {
    try {
        const adminExists = await User.findOne({ username: 'admin' });
        if (!adminExists) {
            const defaultAdmin = new User({
                username: 'admin',
                password: 'admin123' // This password will be hashed by the pre 'save' hook
            });
            await defaultAdmin.save();
            console.log('Default admin user created.');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
}

createDefaultAdmin(); // Call this function after connecting to MongoDB


// Club schema (Existing schema)
const clubSchema = new mongoose.Schema({
    'College Name': { type: String, required: true },
    'Club Name': { type: String, required: true },
    'Brief Description': { type: String, default: '' },
    'Club Advisor': { type: String, default: '' },
    'Meeting Schedule': { type: String, default: '' },
    'Club Meeting Location': { type: String, default: '' },
    'Club Meeting Time': { type: String, default: '' },
    'Club Website': { type: String, default: '' },
    'Contact Email of Club Coordinator/Leader': { type: String, default: '' },
    'Phone Number of Club Coordinator/Leader': { type: String, default: '' },
    'Social Media Links': { type: String, default: '' },
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Club model (Existing model)
const Club = mongoose.model('chat', clubSchema, 'chat');

// Login route (New authentication route)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });

        // If user not found
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        // If passwords don't match
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // If login is successful (You might want to send a token here in a real app)
        res.json({ message: 'Login successful' });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});


// Get all clubs (Existing route)
app.get('/clubs', async (req, res) => {
    try {
        const clubs = await Club.find({});
        res.json(clubs);
    } catch (err) {
        console.error('Error fetching clubs:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Add a club (Existing route)
app.post('/addclub', async (req, res) => {
    try {
        console.log('Received club data:', req.body);
        if (!req.body['College Name'] || !req.body['Club Name']) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'College Name and Club Name are required'
            });
        }
        const newClub = new Club(req.body);
        const savedClub = await newClub.save();
        console.log('Club saved successfully:', savedClub);
        res.status(201).json({
            message: 'Club added successfully',
            club: savedClub
        });
    } catch (error) {
        console.error('Error adding club:', error);
        res.status(500).json({
            error: 'Failed to add club',
            message: error.message
        });
    }
});

// Delete a club (Existing route)
app.delete('/deleteclub/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid club ID' });
        }
        const result = await Club.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: 'Club not found' });
        }
        res.json({ message: 'Club deleted successfully' });
    } catch (error) {
        console.error('Error deleting club:', error);
        res.status(500).json({ message: 'Failed to delete club' });
    }
});

// Update a club (Existing route)
app.put('/updateclub/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const clubData = req.body;
        if (!clubData['College Name'] || !clubData['Club Name']) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'College Name and Club Name are required'
            });
        }
        const updatedClub = await Club.findByIdAndUpdate(
            id,
            clubData,
            { new: true, runValidators: true }
        );
        if (!updatedClub) {
            return res.status(404).json({ message: 'Club not found' });
        }
        res.json(updatedClub);
    } catch (error) {
        console.error('Error updating club:', error);
        res.status(500).json({ message: 'Failed to update club' });
    }
});

// Bulk upload clubs (Existing route)
app.post('/bulk-upload', upload.single('csv'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No CSV file uploaded' });
        }

        const clubs = [];
        let added = 0;
        let skipped = 0;
        const duplicates = []; // Track duplicate records

        const parser = fs
            .createReadStream(req.file.path)
            .pipe(parse({
                columns: true,
                skip_empty_lines: true,
                trim: true,
            }));

        for await (const record of parser) {
            // Validate required fields
            if (!record['College Name'] || !record['Club Name']) {
                skipped++;
                continue;
            }

            // Check for duplicate Club Name and College Name
            const exists = await Club.findOne({
                'Club Name': record['Club Name'],
                'College Name': record['College Name']
            });
            if (exists) {
                skipped++;
                duplicates.push({
                    'College Name': record['College Name'] || '',
                    'Club Name': record['Club Name'] || '',
                    'Brief Description': record['Brief Description'] || '',
                    'Club Advisor': record['Club Advisor'] || '',
                    'Meeting Schedule': record['Meeting Schedule'] || '',
                    'Club Meeting Location': record['Club Meeting Location'] || '',
                    'Club Meeting Time': record['Club Meeting Time'] || '',
                    'Club Website': record['Club Website'] || '',
                    'Contact Email of Club Coordinator/Leader': record['Contact Email of Club Coordinator/Leader'] || '',
                    'Phone Number of Club Coordinator/Leader': record['Phone Number of Club Coordinator/Leader'] || '',
                    'Social Media Links': record['Social Media Links'] || '',
                });
                continue;
            }

            clubs.push({
                'College Name': record['College Name'] || '',
                'Club Name': record['Club Name'] || '',
                'Brief Description': record['Brief Description'] || '',
                'Club Advisor': record['Club Advisor'] || '',
                'Meeting Schedule': record['Meeting Schedule'] || '',
                'Club Meeting Location': record['Club Meeting Location'] || '',
                'Club Meeting Time': record['Club Meeting Time'] || '',
                'Club Website': record['Club Website'] || '',
                'Contact Email of Club Coordinator/Leader': record['Contact Email of Club Coordinator/Leader'] || '',
                'Phone Number of Club Coordinator/Leader': record['Phone Number of Club Coordinator/Leader'] || '',
                'Social Media Links': record['Social Media Links'] || '',
            });
        }

        if (clubs.length > 0) {
            const result = await Club.insertMany(clubs, { ordered: false });
            added = result.length;
        }

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        res.json({ message: 'Bulk upload complete', added, skipped, duplicates });
    } catch (error) {
        console.error('Error processing bulk upload:', error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Failed to process CSV: ' + error.message });
    }
});


app.listen(3000, () => {
    console.log('Server started on port 3000');
});