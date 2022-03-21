const express = require("express");
const mysql = require("mysql")
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken")


const cookieParser = require("cookie-parser")

const { cookie } = require('express/lib/response');
const auth = require("../middleware/auth")

const app = express();

// To use cookieParser as a middleware
app.use(cookieParser())



// Connection Pool
const pool = mysql.createPool({
    connectionPool: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});



// Send Mail

// const sendMailForSignup = (getEmail, getFirstname, randomNum)=>{
const sendMailForSignup = (getEmail, randomNum) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'prashik.ganer123@gmail.com',
            pass: 'prashik12345'
        }
    });

    var mailOptions = {
        from: 'prashik.ganer123@gmail.com',
        to: getEmail,
        subject: 'Your Email validation code',
        // text: 'Hello' + getFirstname + ', welcome to Senselive. Thanks for signing up! Your 1 time password is '+ randomNum +'.'
        text: randomNum + ' is your One Time Password. Use it validate your your email with SenseLive.'
        // text: 'Hello' + getFirstname + ', welcome to Senselive. Thanks for signing up!'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


const sendMailForPasswordRecovery = (getEmail, randomNum) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'prashik.ganer123@gmail.com',
            pass: 'prashik12345'
        }
    });

    var mailOptions = {
        from: 'prashik.ganer123@gmail.com',
        to: getEmail,
        subject: 'Your Recovery Password',
        text: 'We received a request to reset your Senselive dashboard password. Enter the following password reset code: ' + randomNum + '.'

    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}





exports.secret = async(req, res) => {
    // const sample = await req.cookies.jwt
    // console.log(sample)
    // console.log(req.cookies.jwt)
    console.log(`This is the cookie content of jwt ---> ${req.cookies.jwt}`)
    res.send("working")
}



exports.logout = async(req, res) => {
    try {
       
        /* // req.token --> current token of user
        // To logout current particular user
        
        req.user.tokens = req.user.tokens.filter((current_element)=>{
            return current_element.token !== req.token
        })
        */
        
        // Logout from all devices at once



        // console.log(req.user)
        // req.user.tokens = [];

        res.clearCookie("jwt");
        console.log("Loggedout")
        // await req.user.save()
        res.render("login")
    } catch (error) {
        // 500 --> server error
        res.status(500).send(error)
    }

}


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdXNlci5jb20iLCJpYXQiOjE2NDcyNjM2Nzh9.I69ZDINQ5VvGD5UU0CvZFZ6CrD285fyNs41-KLABwas






// view users
exports.get_login = (req, res) => {
    
    res.render('login')
}


// const generateAuthToken = async function () {
//     try {
//         console.log("This is id")
//         console.log(user_email)
//         // const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
//         const token = jwt.sign({ email: user_email.toString() }, "thisisthesecretkeywhichshouldbeatleastXXXIIbitslong");
//         console.log(token)

//         // this.tokens = this.tokens.concat({token: token})

//         // await this.save();
//         // console.log(token);
//         return token;
//     } catch (err) {
//         res.send("This is error part " + err);
//         console.log("This is error part " + err);
//     }
// }

// view users
exports.post_login = (req, res) => {

    const { email, password } = req.body

    // connection to databse
    pool.getConnection( async(err, connection) => {
        if (err) throw err;  // not connected
        console.log("Connection Succesful. Connection id = " + connection.threadId)


        rows = []

        user_email = email
        // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdXNlci5jb20iLCJpYXQiOjE2NDcxODE3MTZ9.rbcx0S1zqdYXKxHFqBfOvu72u-N9V1lnxRdUqsnphqw
        // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdXNlci5jb20iLCJpYXQiOjE2NDcxODE2NDd9.oTiEIsQUpuc2Gr2hdaV4P0Oz9Z0J6x1Y7PVWNVYScao
//         eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdXNlci5jb20iLCJpYXQiOjE2NDcxODExMzZ9.txZp3DYbZSf5fU-5nuyOJaMyKiseuycjQyeYlrGewiA
        
        
        // *****************  TOKEN AUTHENTICATION START *****************


        // Generating Token
        const token = await generateAuthToken();
        console.log(token)


        // The res.cookie() function is used to set the cookie name to value.
        // The value parameter may be a string or object converted to JSON
        // res.cookie(name, value, [options])
        console.log("Before Cookies")

        // Storing generated token in web browser using cookies
        res.cookie("jwt", token, {

            // Example is College login
            expires: new Date(Date.now() + 86400000),
            httpOnly: true
            // secure: true
        });


        // console.log("After Cookies")

        // console.log("cookies" + cookie)
        // res.cookie("jwt", token);
        console.log("cookie")
        console.log(cookie)
        console.log("req.cookies.jwt")
        // console.log(req.cookies.jwt)

        // *****************  TOKEN AUTHENTICATION END *****************




        // connection.query("SELECT * FROM user ", (err, rows)=>{
        connection.query("SELECT email FROM Register WHERE email = ?", [req.body.email], (err, rows, fields) => {
            // when connection done, realse it
            connection.release()

            // rows.forEach(element => {
            //     console.log("element.email");
            //     console.log(element.email);
            //     user_email = element.email

            //     // sample.push(element.email)
            // });

            if (!err) {
                // let removed_user = req.query.removed
                console.log("rows.email")
                console.log(rows)
                console.log(rows)
                // rows.foreach(myFunction)
                // function myFunction(item, index){
                //     console.log(this.item)
                // }

                // sample = []
                // const arr = [1, 2, 3, 8, 7];

                // To check if email present in the database
                var sample = ""
                rows.forEach(element => {
                    console.log(element.email);
                    sample = element.email

                    // sample.push(element.email)
                });
                // for(i=0; i<rows.length;i++){
                //     // console.log(rows[RowDataPacket[i]])
                //     // console.log(rows[RowDataPacket][i].email)
                // }
                // console.log(rows[RowDataPacket].email)
                console.log("sample")
                console.log(sample)
                if (sample == email) {
                    res.render('home', { rows })
                }
                else {
                    res.send("Invalid credentials")
                }
            } else {
                console.log("error occured", err)
            }
            console.log("The data from user table: \n", rows)
        })

    })
}

// view users
exports.verify = (req, res) => {
    res.render('verify')
}


// view users
exports.otp = async (req, res) => {
    console.log("OTP here")
    const { email } = req.body
    console.log("email")
    console.log(email)


    var randomNum = Math.floor(Math.random() * 100000)
    console.log(randomNum)

    const mail = await sendMailForSignup(email, randomNum)
    console.log("mail")
    console.log(mail)

    res.render("otp", { real_otp: randomNum, otp_verified: true, user_email: email });
}

// view users
exports.get_index = (req, res) => {

    res.render("index")
}

// view users
exports.post_index = (req, res) => {

    const { form_otp, real_otp, user_email } = req.body

    console.log(form_otp)
    console.log(real_otp)
    console.log(user_email)


    otp_verified = true
    if (form_otp === real_otp) {
        res.render("index", { user_email: user_email });
        // res.secd("Match"); 
    }
    else {
        // res.secd("Not Matched"); 
        res.render("otp", { real_otp: real_otp, user_email: user_email, otp_verified: false })
    }
    // res.render('index')
}

// view users
exports.get_register = (req, res) => {
    res.render('register')
}


const generateAuthToken = async function () {
    try {
        console.log("This is id")
        console.log(user_email)
        // const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        const token = await jwt.sign({ email: user_email.toString() }, "thisisthesecretkeywhichshouldbeatleastXXXIIbitslong");
        console.log(token)

        // connection to databse

        // pool.getConnection((err, connection) => {
        //     if (err) throw err;  // not connected

        //     console.log("Connection Succesful. Connection id = " + connection.threadId)

        //     // connection.query("INSERT INTO token FROM Register WHERE email = ?", [user_email], (err, rows, fields) => {/
        //     connection.query("INSERT INTO register SET token = ? WHERE id = ?", ["token", email], (err, rows) => {
        //     // connection.query("INSERT INTO register (token) VALUES (?);", ["token"], (err, rows) => {
        //     // connection.query("SELECT * FROM register WHERE email = ?", [user_email], (err, rows) => {
        //     // connection.query("INSERT INTO register SET token = ? WHERE email = ?", [token, user_email], (err, rows) => {
        //     // connection.query("INSERT INTO Register (token) values (?) WHERE email = ?;", [token, user_email], (err, rows) => {
                
        //         // when connection done, realse it
        //         connection.release()

        //         if (!err) {
        //             console.log("success")
        //             // res.send("success")
        //             // return token;

        //         }
        //         else {
        //             // res.send("error")
        //             console.log("error occured", err)
        //             // return token;

        //         }
        //         console.log("The data from user table: \n", rows)
        //     })

        // })



        // this.tokens = this.tokens.concat({token: token})

        // await this.save();
        // console.log(token);
        
        
        return token;
    } catch (err) {
        console.log("This is error part " + err);
        res.send("This is error part " + err);
    }
}


// view users
exports.post_register = (req, res) => {
    const { firstname, lastname, phone, email, password, cpassword, age } = req.body
    // console.log(firstname); console.log(lastname); console.log(phone); console.log(password); console.log(cpassword); console.log(age);



    pool.getConnection(async(err, connection) => {
        if (err) throw err;  // not connected
        console.log("Connection Succesful. Connection id = " + connection.threadId)

        if (password === cpassword) {

            rows = []


            // rows.forEach(element => {
                //     console.log("element.email");
                //     console.log(element.email);
                //     user_email = element.email
    
                //     // sample.push(element.email)
                // });
                user_email = email
                
                
                // *****************  TOKEN AUTHENTICATION START *****************

                // Generating Token
                const token = await generateAuthToken();
                console.log(token)
                const user_token = token
                console.log("user_token")
                console.log(user_token)
                // The res.cookie() function is used to set the cookie name to value.
                // The value parameter may be a string or object converted to JSON
                // res.cookie(name, value, [options])
                console.log("Before Cookies")

                // Storing generated token in web browser using cookies
                res.cookie("jwt", token, {

                    // Example is College login
                    expires: new Date(Date.now() + 86400000),
                    httpOnly: true
                });


//  // connection to databse
                        // pool.getConnection((err, connection) => {
                        //     if (err) throw err;  // not connected


                        //     connection.query("INSERT INTO register SET token = ? AND email = ? WHERE id = ?", [ token, "lets@gmail.com", 22], (err, rows, fields) => {
                        //     // connection.query("SELECT * FROM Register WHERE email = ?", [user_email], (err, rows) => {
                                
                        //         // when connection done, realse it
                        //         connection.release()

                        //         if (!err) {

                                    
                        //             console.log("success", rows)
                                
                        //         }
                        //         else {
                        //             console.log("error occured", err)
                        //         }
                        //         console.log("The data from user table: \n", rows)
                        //     })

                        // })

                console.log("cookie")
                console.log(cookie)

                // *****************  TOKEN AUTHENTICATION END *****************

            connection.query("INSERT INTO register SET firstname = ?, lastname = ?, phone = ?, email = ?, password = ?, cpassword = ?, age = ?, token = ?", [firstname, lastname, phone, email, password, cpassword, age, token], async(err, rows, fields) => {

                // when connection done, realse it
                connection.release()

                if (!err) {

                
                
                    

                    res.render('home', { alert: 'User added Successfully!' })
                } else {
                    console.log("error occured", err)
                }
                console.log("The data from user table: \n", rows)
            })

        } else {
            res.send("Check passwords!")
        }

    })

    // res.render('home')
}

/* Routes for 'forgot password' */

exports.forgot_password_step_1 = (req, res) => {
    res.render('forgot_password_step_1')
}


// view users
exports.forgot_password_step_2 = (req, res) => {
    const { email } = req.body
    user_valid = false

    // connection to databse
    pool.getConnection((err, connection) => {
        if (err) throw err;  // not connected
        console.log("Connection Succesful. Connection id = " + connection.threadId)


        connection.query("SELECT * FROM Register WHERE email = ?", [req.body.email], (err, rows, fields) => {
            // when connection done, realse it
            connection.release()

            if (!err) {
                console.log("rows")
                console.log(rows.length)

                rows.forEach(element => {
                    console.log(element.email);
                    sample = element.email
                });


                if (rows.length == 0) {
                    res.send("Your email is not yet registered!")
                    // console.log("Your email is not yet registered!")
                }
                else {
                    user_valid = true
                    var randomNum = Math.floor(Math.random() * 10000000)
                    console.log(randomNum)
                    console.log(email)
                    sendMailForPasswordRecovery(email, randomNum)
                    res.render("forgot_password_step_2", { recovery_otp: randomNum, otp_verified: true, recovery_email: email })
                    // console.log("You can reset your password!")
                    // res.send("valid email")
                }
            }
            else {
                console.log("error occured", err)
            }
            console.log("The data from user table: \n", rows)
        })

    })




    // res.render('forgot_password_step_2')
}

// view users
exports.forgot_password_step_3 = (req, res) => {

    recovery_email = req.body.recovery_email
    real_recovery_otp = req.body.recovery_otp
    user_recovery_otp = req.body.user_filled_code
    console.log(recovery_email)
    console.log(real_recovery_otp)
    console.log(user_recovery_otp)

    recovery_otp_verified = true
    if (user_recovery_otp === real_recovery_otp) {
        // res.render("forgot-password-step-3", {recovery_email:recovery_email}); 
        // res.send("otp match!"); 
        console.log("otp match!");
        res.render("forgot_password_step_3", { recovery_email: recovery_email, real_recovery_otp: real_recovery_otp, user_recovery_otp: user_recovery_otp });
    }
    else {
        // res.render("forgot-password-step-2", {real_otp:real_otp, user_email:user_email, otp_verified: false})
        console.log("OTP didn't match!");
        res.send("OTP didn't match!")
    }

}


exports.home = (req, res) => {

    const password = req.body.password;
    const cpassword = req.body.cpassword;
    console.log("password")
    console.log(password)
    console.log(cpassword)

    recovery_email = req.body.recovery_email
    console.log(recovery_email)


    pool.getConnection((err, connection) => {
        if (err) throw err;  // not connected
        console.log("Connection Succesful. Connection id = " + connection.threadId)

        //         console.log("req.params.id")
        //         console.log(req.params.id)

        // connection.query("UPDATE Register SET password = ?, cpassword = ? WHERE id = ?", [password, cpassword, req.params.id], (err, rows) => {
        connection.query("SELECT * FROM Register WHERE email = ?", [recovery_email], (err, rows) => {
            connection.release()
            if (!err) {
                console.log("No Error!")
                console.log(rows)

                if (password === cpassword) {
                    console.log("forEach starts")
                    console.log(rows)
                    rows.forEach(element => {
                        console.log(element.id);
                        console.log(element.firstname);
                        user_id = element.id
                        user_firstname = element.firstname
                    });

                    pool.getConnection((err, connection) => {
                        if (err) throw err;  // not connected
                        console.log("Connection Succesful. Connection id = " + connection.threadId)
                        connection.query("UPDATE Register SET password = ?, cpassword = ? WHERE id = ?", [password, password, user_id], (err, rows) => {
                            connection.release()
                            if (!err) {
                                console.log("SUCCESS")

                            }
                            else {
                                console.log("error occured", err)
                            }
                            console.log("The data from user table: \n", rows)
                        })
                    })

                    // res.send("PASSWORDS MATCH")
                    res.status(201).render("home", { userFirstname: user_firstname });

                }
                else {
                    res.send("PASSWORDS DON'T MATCH")

                }


            } else {
                res.send("error")
                console.log("error occured", err)
            }
            // console.log("The data from user table: \n", rows)
        })
    })

    // }
    // // console.log(recovery_email)
    // else {
    //     res.send("Passwords didn't match")

    // }
}



// Find user by serach
exports.find = (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;  // not connected
        console.log("Connection Succesful. Connection id = " + connection.threadId)


        let searchTerm = req.body.search

        // connection.query("SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?", ['%' + searchTerm + '%'], ['%' + searchTerm + '%'], (err, rows)=>{
        connection.query("SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?", ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
            // when connection done, realse it
            connection.release()
            if (!err) {
                res.render('home', { rows })
            } else {
                console.log("error occured", err)
            }
            console.log("The data from user table: \n", rows)
        })

    })
    // res.render('home')
}

exports.form = (req, res) => {
    res.render('add-user')
}

// Create user
exports.create = (req, res) => {

    const { first_name, last_name, email, phone, comments } = req.body
    pool.getConnection((err, connection) => {
        if (err) throw err;  // not connected
        console.log("Connection Succesful. Connection id = " + connection.threadId)


        let searchTerm = req.body.search

        connection.query("INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?", [first_name, last_name, email, phone, comments], (err, rows) => {
            // when connection done, realse it
            connection.release()
            if (!err) {
                res.render('add-user', { alert: 'User added Successfully!' })
            } else {
                console.log("error occured", err)
            }
            console.log("The data from user table: \n", rows)
        })

    })
    // res.render('home')
}

// Edit users
exports.edit = (req, res) => {
    // connection to databse
    pool.getConnection((err, connection) => {
        if (err) throw err;  // not connected
        console.log("Connection Succesful. Connection id = " + connection.threadId)
        connection.query("SELECT * FROM user WHERE id = ?", [req.params.id], (err, rows) => {
            // when connection done, realse it
            connection.release()
            if (!err) {
                res.render('edit-user', { rows })
            } else {
                console.log("error occured", err)
            }
            console.log("The data from user table: \n", rows)
        })
    })
    // res.render('home')
}

// Update users
exports.update = (req, res) => {

    const { first_name, last_name, email, phone, comments } = req.body

    pool.getConnection((err, connection) => {
        if (err) throw err;  // not connected
        console.log("Connection Succesful. Connection id = " + connection.threadId)
        connection.query("UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?", [first_name, last_name, email, phone, comments, req.params.id], (err, rows) => {
            connection.release()
            if (!err) {

                pool.getConnection((err, connection) => {
                    if (err) throw err;  // not connected
                    console.log("Connection Succesful. Connection id = " + connection.threadId)
                    connection.query("SELECT * FROM user WHERE id = ?", [req.params.id], (err, rows) => {
                        // when connection done, realse it
                        connection.release()
                        if (!err) {
                            res.render('edit-user', { rows, alert: `${first_name} has been updated successfully!` })
                        } else {
                            console.log("error occured", err)
                        }
                        console.log("The data from user table: \n", rows)
                    })
                })

            } else {
                console.log("error occured", err)
            }
            console.log("The data from user table: \n", rows)
        })
    })
    // res.render('home')
}


/*
Delete users by id - 2 ways:
1. update status from 'active' to 'removed'.
2. Permanently delete the user.

*/
exports.delete = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;  // not connected
        console.log("Connection Succesful. Connection id = " + connection.threadId)
        connection.query("DELETE FROM user WHERE id = ?", [req.params.id], (err, rows) => {
            // when connection done, realse it
            connection.release()
            if (!err) {
                let removed_user = encodeURIComponent('User Successfully Removed!')
                res.redirect('/?removed' + removed_user)                               // cannot pass object with res.redirect
            } else {
                console.log("error occured", err)
            }
            console.log("The data from user table: \n", rows)
        })
    })

    // pool.getConnection((err, connection)=>{
    //     if(err) throw err;  // not connected
    //     console.log("Connection Succesful. Connection id = " + connection.threadId)
    //     connection.query("UPDATE user SET status = ? WHERE id = ?", ['removed' ,req.params.id],(err, rows)=>{
    //         // when connection done, realse it
    //         connection.release()
    //         if(!err){
    //             // res.render('home', {rows})
    //             res.redirect('/')
    //         }else{
    //             console.log("error occured", err)
    //         }
    //         console.log("The data from user table: \n", rows)
    //     })
    // })  
}

// view users
exports.viewall = (req, res) => {
    // connection to databse
    pool.getConnection((err, connection) => {
        if (err) throw err;  // not connected
        console.log("Connection Succesful. Connection id = " + connection.threadId)

        // connection.query("SELECT * FROM user ", (err, rows)=>{
        connection.query("SELECT * FROM user WHERE id = ?", [req.params.id], (err, rows) => {
            // when connection done, realse it
            connection.release()
            if (!err) {

                res.render('view-user', { rows })
            } else {
                console.log("error occured", err)
            }
            console.log("The data from user table: \n", rows)
        })

    })
    // res.render('home')
}