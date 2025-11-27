const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let feedbacks = [];
 

const getFeedback = (req, res) => {
    const { status } = req.query;
    
    if (status) {
        const filteredFeedbacks = feedbacks.filter(f => f.status === status);
        return res.json(filteredFeedbacks);
    }
    
    res.json(feedbacks);
};

const addFeedback = (req, res) => {
    const { name, email, eventName, division, rating, comment, suggestion } = req.body;

    if (!name || !email || !eventName || !division || !rating) {
        return res.status(400).json({ message: 'Data tidak lengkap!' });
    }

    const newFeedback = {
        id: Date.now().toString(),
        name,
        email,
        eventName,
        division, 
        rating: parseInt(rating),
        comment: comment || "",
        suggestion: suggestion || "",
        createdAt: new Date().toISOString(),
        status: "open" 
    };

    feedbacks.push(newFeedback);
    res.status(201).json({ message: 'Feedback berhasil disimpan', data: newFeedback });
};

const updateFeedback = (req, res) => {
    const { id } = req.params;
    const { status, eventName, division, rating, comment, suggestion } = req.body;

    const index = feedbacks.findIndex(f => f.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Feedback tidak ditemukan' });
    }

    feedbacks[index] = {
        ...feedbacks[index],
        status: status || feedbacks[index].status,
        eventName: eventName || feedbacks[index].eventName,
        division: division || feedbacks[index].division,
        rating: rating || feedbacks[index].rating,
        comment: comment || feedbacks[index].comment,
        suggestion: suggestion || feedbacks[index].suggestion
    };

    res.json({ message: 'Feedback berhasil diupdate', data: feedbacks[index] });
};

const deleteFeedback = (req, res) => {
    const { id } = req.params;
    
    const initialLength = feedbacks.length;
    feedbacks = feedbacks.filter(f => f.id !== id);

    if (feedbacks.length === initialLength) {
        return res.status(404).json({ message: 'Feedback tidak ditemukan' });
    }

    res.json({ message: 'Feedback berhasil dihapus' });
};

[cite_start]

app.get('/api/feedback', getFeedback);       
app.post('/api/feedback', addFeedback);     
app.put('/api/feedback/:id', updateFeedback); 
app.delete('/api/feedback/:id', deleteFeedback); 

app.listen(PORT, () => {    
    console.log(`Server berjalan di http://localhost:${PORT}`);
});