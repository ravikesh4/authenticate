const express = require('express')
const app = express()
const morgan  = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()

// import routes
const authRoutes = require('./routes/auth') 
const userRoutes = require('./routes/user') 
const postRoutes = require('./routes/post')
const categoryRoutes = require('./routes/category')

// mongodb connection 
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(() => console.log('DB Connected'))
.catch(err => console.log('DB Connection Error', err))

// app middleware 
app.use(morgan('dev'));
app.use(bodyParser.json());

// app.use(cors());
if(process.env.NODE_ENV = 'development') {
    app.use(cors({origin: `http://localhost:3000`}))
} 

// middleware 
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', postRoutes);
app.use('/api', categoryRoutes);






const port = process.env.PORT || 8000
app.listen(port, () => console.log(`Example app listening on port ${port} - ${process.env.NODE_ENV}!`))