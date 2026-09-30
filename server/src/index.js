const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & JSON Body Parsing
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);
