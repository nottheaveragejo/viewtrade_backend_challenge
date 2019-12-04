const xlsx = require("xlsx");
let wb = xlsx.readFile("SPY_All_Holdings.xlsx")
let ws = wb.Sheets['SPY_All_Holdings']
let data = xlsx.utils.sheet_to_json(ws)
const express = require('express')
const mysql = require('mysql')
const mongo = require('mongodb')
const assert = require('assert')
const app = express()
const port = 3000
var MongoClient = require('mongodb').MongoClient;
let url = 'mongodb://localhost:27017/test'


// let connection = mysql.createConnection({
//   port:"80",
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'sampleDB'
// })

// connection.connect(function(error){
//   if(error){
//     console.log(error)
//   }
//   else{
//     console.log('connected')
//   }
// })

let top10 = function (data){
  let newData = []
  for(let i = 3; i<=12; i++){
    newData.push(data[i])
  }
  return newData
}

// MongoClient.connect(url, function (err, db) {
//   if (err) throw err;
//   let arr = top10(data)
//   db.collection("holdings").insertMany(arr, function (err, result) {
//       if (err) throw err;
//       console.log("Number of documents inserted: " + res.insertedCount);
//       db.close();
//   });

// });

//var stringObj = JSON.stringify(top10(data))


 app.get('/', (req, res) => res.send(top10(data)))





// app.get('/', (req, res) => {
// // res.send(stringObj)
//   connection.query("SELECT * FROM holdings", function(error, rows, fields){
//     if(error){
//       console.log(error)
//     }
//     else{
//       console.log("Success")
//     }
//   })
// })


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

