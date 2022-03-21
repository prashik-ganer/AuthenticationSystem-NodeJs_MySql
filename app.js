require('dotenv').config()
const express = require("express");
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser")
const mysql = require("mysql")
const cookieParser = require("cookie-parser")


const app = express();
const PORT = process.env.PORT || 3000;


// body-parser: helps to pass json data through forms
app.use(express.urlencoded({extended: false}))

// Parsse application/json
app.use(bodyParser.json())
app.use(cookieParser())

// static files
app.use(express.static('public'));

// setting up template engine
app.engine("hbs", exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs"  
}));
app.set("view engine", "hbs");


// Connection Pool
const pool = mysql.createPool({
    connectionPool: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

});


// connection to databse
pool.getConnection((err, connection)=>{
    if(err) throw err;  // not connected
    console.log("Connection Succesful. Connection id = " + connection.threadId)
})

// To use routes.js file
const routes = require("./server/routes/user")
app.use("/", routes)


// app.get('', (req,res)=>{
//     res.render('home')
// })


app.listen(PORT, ()=>{
    console.log(`Server is running at port number ${PORT}`)
})
