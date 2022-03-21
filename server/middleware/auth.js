const jwt = require("jsonwebtoken")
const mysql = require("mysql")
const cookieParser = require("cookie-parser")
const { cookie } = require('express/lib/response');
const express = require("express")
app = express()
app.use(cookieParser())


// Connection Pool
const pool = mysql.createPool({
    connectionPool: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


// req, res --> objects || next --> keyword
const auth = async(req, res, next)=>{
    try {
        console.log("verifyUser")
        const token = req.cookies.jwt;                                  // get cookie from cookie
        console.log(token)
        const verifyUser = await jwt.verify(token, "thisisthesecretkeywhichshouldbeatleastXXXIIbitslong")
        console.log(verifyUser)
        console.log("req.params.id")
        console.log(req.email)
        console.log(req.params.email)
        
        // To get logged in user data
        // const user =  Register.findOne({_id: verifyUser._id})
        // console.log(user)
        // console.log(user.firstname)


         // connection to databse
        // pool.getConnection((err, connection) => {
        //     if (err) throw err;  // not connected
        //     console.log("Connection Succesful. Connection id = " + connection.threadId)

        //     // connection.query("SELECT * FROM user ", (err, rows)=>{
        //     connection.query("SELECT * FROM register WHERE token = ?", [token], (err, rows) => {
        //         // when connection done, realse it
        //         connection.release()
        //         if (!err) {
        //             console.log("No Error!", rows)
        //             next();
                    
        //             // res.render('view-user', { rows })
        //         } else {
        //             console.log("error occured", err)
        //         }
        //         console.log("The data from user table: \n", rows)
        //     })

        // })


        // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdXNlci5jb20iLCJpYXQiOjE2NDcyNjMyMTR9.OeDpnnRA-hH-Rzk0i1U-T2MkVFHuGR8b-vKT7QKfvMM
        // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdXNlci5jb20iLCJpYXQiOjE2NDcyNjI5NDF9.zXXsslhhh5XgHC72_-P2tgdT-MJx9C2kh7SmL-gxCfk
        // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdXNlci5jb20iLCJpYXQiOjE2NDcxODExMzZ9.txZp3DYbZSf5fU-5nuyOJaMyKiseuycjQyeYlrGewiA



        // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InByYXNoaWtAZ21haWwuY29tIiwiaWF0IjoxNjQ3MjYzODA0fQ.3L8TyDvHZtEYJ6TgujzqPCKJM8NMhaQPyABAl9MbJdc
        // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InByYXNoaWtAZ21haWwuY29tIiwiaWF0IjoxNjQ3MTYyNjc1fQ.HjCpQwhS7D7MmyES0V7i0DT6BGD9lWDtE-8tksidV9E






        // // // For logout
        // // req.token --> used to get token value
        // req.token = token
        // req.user = user


        next();

    } catch (error) {
        res.status(401).send(error);
    }
}

// Very important -- To use 'auth' functionality in different files
module.exports = auth;