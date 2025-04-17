const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv');
const allRoutes = require('./routes/AllRoutes');

dotenv.config();

const app = express();
const PORT = 3002;
// const PORT = process.env.PORT;

app.use(cors());
app.use(express.json())


// Import and Use Routes
app.use(allRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
