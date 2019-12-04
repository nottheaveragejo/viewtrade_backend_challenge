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
const Holdings = require ('./holdingsModel')
const db = require('./db')


var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



let top10 = function (data){
  let newData = []
  for(let i = 3; i<=12; i++){
    newData.push(data[i])
  }
  return newData
}

console.log(top10(data)[0])
async function seed() {
  await db.sync({force: true})
  console.log('db synced!')
  await Promise.all(
    top10(data).map(element => {
      return Holdings.create(element)
    })
  )
  console.log(`seeded users`)
  console.log(`seeded successfully`)
}

async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  }
  // finally {
  //   console.log('closing db connection')
  //   await db.close()
  //   console.log('db connection closed')
  // }
}

runSeed()

// app.get('/', (req, res) => res.send(top10(data)))

//all holdings
app.get('/', async(req, res) => {
  try{
    const holdings = await Holdings.findAll()
    res.send(holdings)
  }
  catch(err){
    console.log(err)
  }
})

//specific single holding

app.get('/:id',  async(req, res) => {
  try{
    const holding = await Holdings.findAll({
     where: {
       id: req.params.id
     }
    })
    res.send(holding)
  }
  catch(err){
    console.log(err)
  }
})

//get holding by ticker
app.get('/ticker/:ticker',  async(req, res) => {
  try{
    const holding = await Holdings.findAll({
     where: {
       ticker: req.params.ticker
     }
    })
    res.send(holding)
  }
  catch(err){
    console.log(err)
  }
})


//get holdings by symbol
// app.get('/:symbol',  async(req, res) => {
//   try{
//     const holdingBySymbol = await Holdings.findAll({
//      where: {
//        name: req.params.symbol
//      }
//     })
//     res.send(holdingBySymbol )
//   }
//   catch(err){
//     console.log(err)
//   }
// })



app.listen(port, () => console.log(`Example app listening on port ${port}!`))

