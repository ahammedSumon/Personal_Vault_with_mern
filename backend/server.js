const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const MONGODB_URI = 'mongodb+srv://salauddin18_db_user:b0FftkoS9CMtt7Wt@cluster0.7x32g3f.mongodb.net/memoryVault?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI).then(() => {
    console.log('Connected to Mongodb!')
})
.catch((error) => {
    console.log('Error',error)
});

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const fileSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, maxlength: 500 },
  type: { type: String, enum: ['photo', 'note', 'voice', 'document'], required: true },
  content: { type: String, required: true },
  thumbnail: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const File = mongoose.model('File', fileSchema);

app.get('/',(req,res) => {
    res.json({message: 'server is running! 🚀'});
});

// ===================== API ENDPOINTS =====================

// POST: Create new memory/file
app.post('/api/files', async (req, res) => {
    try {
        const { title, description, type, content, thumbnail } = req.body;

        // Validation
        if (!title || !type || !content) {
            return res.status(400).json({ error: 'Title, type, and content are required' });
        }

        // Create new file
        const newFile = new File({
            title,
            description,
            type,
            content,
            thumbnail
        });

        // Save to database
        await newFile.save();
        
        // Send back the created file with 201 status (Created)
        res.status(201).json({ 
            message: 'Memory saved successfully! ✅',
            data: newFile 
        });
    } catch (error) {
        res.status(500).json({ error: 'Error saving memory', details: error.message });
    }
});

// GET: Fetch all memories
app.get('/api/files', async (req, res) => {
    try {
        // Get all files from database
        const files = await File.find();
        
        res.status(200).json({ 
            message: 'Memories fetched successfully ✅',
            count: files.length,
            data: files 
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching memories', details: error.message });
    }
});

// GET: Fetch single memory by ID
app.get('/api/files/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find file by MongoDB ID
        const file = await File.findById(id);

        if (!file) {
            return res.status(404).json({ error: 'Memory not found' });
        }

        res.status(200).json({ 
            message: 'Memory fetched successfully ✅',
            data: file 
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching memory', details: error.message });
    }
});

// DELETE: Delete memory by ID
app.delete('/api/files/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Delete file from database
        const deletedFile = await File.findByIdAndDelete(id);

        if (!deletedFile) {
            return res.status(404).json({ error: 'Memory not found' });
        }

        res.status(200).json({ 
            message: 'Memory deleted successfully ✅',
            data: deletedFile 
        });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting memory', details: error.message });
    }
});

// PUT: Update memory by ID
app.put('/api/files/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, type, content, thumbnail } = req.body;

        // Validate at least one field is provided
        if (!title && !description && !type && !content && !thumbnail) {
            return res.status(400).json({ error: 'At least one field is required to update' });
        }

        // Build update object with only provided fields
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (type !== undefined) updateData.type = type;
        if (content !== undefined) updateData.content = content;
        if (thumbnail !== undefined) updateData.thumbnail = thumbnail;

        // Update memory in database
        const updatedFile = await File.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedFile) {
            return res.status(404).json({ error: 'Memory not found' });
        }

        res.status(200).json({ 
            message: 'Memory updated successfully ✅',
            data: updatedFile 
        });
    } catch (error) {
        res.status(500).json({ error: 'Error updating memory', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});
