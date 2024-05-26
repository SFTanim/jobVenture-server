const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());











app.get('/', (req, res) => {
    res.send('Assignment-011 Server Running')
})

app.listen(port, () => {
    console.log("Assignment-011 is running on port: ", port);
})