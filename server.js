const express=require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app=express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host:'localhost',
    database:'mart_stock',
    user:'root',
    password:''
});

connection.connect((error)=>{
console.log("MYSQL database is connected successfully")
});

//create route for load index.html file

app.get("/",(request,response)=>{
    response.sendFile(__dirname+"/index.html");
});

app.get("/get_data", (request, response) => {
    const sql = `SELECT * FROM vegetable_stock ORDER BY quantity DESC`;
    connection.query(sql, (error, result) => {
        response.send(result);
    });
});


app.post("/add_data",(request,response)=>{
    const name=request.body.name;
    const quantity=request.body.quantity;
    const sql=`INSERT INTO vegetable_stock(name,quantity) VALUES ("${name}","${quantity}")`;
    connection.query(sql,(error,results)=>{
        response.json({
            message:'Data Added'
        });
    });

})


app.post("/update_data",(request,response)=>{
    const variable_name=request.body.variable_name;
    const variable_value=request.body.variable_value;

    const id = request.body.id;
    const sql = `UPDATE vegetable_stock SET ${variable_name}="${variable_value}" WHERE id=${id}`;
    connection.query(sql,(error,results)=>{
        if(error) {
            response.json({
                'message':'Error occurred while updating data'
            });
        } else {
            response.json({
                'message':'Data Updated'
            });
        }
    });
});

app.post("/delete_data",(request,response)=>{
    const id=request.body.id;
    const sql = `DELETE FROM vegetable_stock WHERE id='${id}'`;
    connection.query(sql,(error,results)=>{
        response.json({
            message:'Data Deleted'
        });
    });

})


app.listen(3000,()=> {
    console.log('Server listening on port 3000');
});
