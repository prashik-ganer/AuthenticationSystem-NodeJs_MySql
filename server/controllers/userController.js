const mysql = require("mysql")

// Connection Pool
const pool = mysql.createPool({
    connectionPool: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// view users
exports.view = (req, res) =>{
    // connection to databse
    pool.getConnection((err, connection)=>{
        if(err) throw err;  // not connected
        console.log("Connection Succesful. Connection id = " + connection.threadId)
    
        // connection.query("SELECT * FROM user ", (err, rows)=>{
        connection.query("SELECT * FROM user WHERE status = 'active'", (err, rows)=>{
            // when connection done, realse it
            connection.release()
            if(!err){
                let removed_user = req.query.removed
                res.render('home', {rows, removed_user})
            }else{
                console.log("error occured", err)
            }
            console.log("The data from user table: \n", rows)
        })
    
    })  
// res.render('home')
}


// Find user by serach
exports.find = (req, res)=>{

     pool.getConnection((err, connection)=>{
        if(err) throw err;  // not connected
        console.log("Connection Succesful. Connection id = " + connection.threadId)
    

        let searchTerm = req.body.search
        
        // connection.query("SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?", ['%' + searchTerm + '%'], ['%' + searchTerm + '%'], (err, rows)=>{
        connection.query("SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?", ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows)=>{
            // when connection done, realse it
            connection.release()
            if(!err){
                res.render('home', {rows})
            }else{
                console.log("error occured", err)
            }
            console.log("The data from user table: \n", rows)
        })
    
    })  
// res.render('home')
}

exports.form = (req, res)=>{
    res.render('add-user')
}

// Find user by serach
exports.create = (req, res)=>{

    const { first_name, last_name, email, phone, comments } = req.body
     pool.getConnection((err, connection)=>{
        if(err) throw err;  // not connected
        console.log("Connection Succesful. Connection id = " + connection.threadId)
    

        let searchTerm = req.body.search
        
        connection.query("INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?", [first_name, last_name, email, phone, comments], (err, rows)=>{
            // when connection done, realse it
            connection.release()
            if(!err){
                res.render('add-user', {alert: 'User added Successfully!'})
            }else{
                console.log("error occured", err)
            }
            console.log("The data from user table: \n", rows)
        })
    
    })  
// res.render('home')
}

// Edit users
exports.edit = (req, res) =>{
    // connection to databse
    pool.getConnection((err, connection)=>{
        if(err) throw err;  // not connected
        console.log("Connection Succesful. Connection id = " + connection.threadId)
        connection.query("SELECT * FROM user WHERE id = ?", [req.params.id],(err, rows)=>{
            // when connection done, realse it
            connection.release()
            if(!err){
                res.render('edit-user', {rows})
            }else{
                console.log("error occured", err)
            }
            console.log("The data from user table: \n", rows)
        })
    })  
// res.render('home')
}

// Update users
exports.update = (req, res) =>{

    const { first_name, last_name, email, phone, comments } = req.body
    
    pool.getConnection((err, connection)=>{
        if(err) throw err;  // not connected
        console.log("Connection Succesful. Connection id = " + connection.threadId)
        connection.query("UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?", [first_name, last_name, email, phone, comments, req.params.id], (err, rows)=>{
            connection.release()
            if(!err){
                
                pool.getConnection((err, connection)=>{
                    if(err) throw err;  // not connected
                    console.log("Connection Succesful. Connection id = " + connection.threadId)
                    connection.query("SELECT * FROM user WHERE id = ?", [req.params.id],(err, rows)=>{
                        // when connection done, realse it
                        connection.release()
                        if(!err){
                            res.render('edit-user', {rows, alert: `${first_name} has been updated successfully!`})
                        }else{
                            console.log("error occured", err)
                        }
                        console.log("The data from user table: \n", rows)
                    })
                }) 

            }else{
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
exports.delete = (req, res) =>{
    pool.getConnection((err, connection)=>{
        if(err) throw err;  // not connected
        console.log("Connection Succesful. Connection id = " + connection.threadId)
        connection.query("DELETE FROM user WHERE id = ?", [req.params.id],(err, rows)=>{
            // when connection done, realse it
            connection.release()
            if(!err){
                let removed_user = encodeURIComponent('User Successfully Removed!')
                res.redirect('/?removed' + removed_user)                               // cannot pass object with res.redirect
            }else{
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
exports.viewall = (req, res) =>{
    // connection to databse
    pool.getConnection((err, connection)=>{
        if(err) throw err;  // not connected
        console.log("Connection Succesful. Connection id = " + connection.threadId)
    
        // connection.query("SELECT * FROM user ", (err, rows)=>{
        connection.query("SELECT * FROM user WHERE id = ?", [req.params.id], (err, rows)=>{
            // when connection done, realse it
            connection.release()
            if(!err){
                res.render('view-user', {rows})
            }else{
                console.log("error occured", err)
            }
            console.log("The data from user table: \n", rows)
        })
    
    })  
// res.render('home')
}