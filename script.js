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
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

runSeed()

 app.get('/', (req, res) => res.send(top10(data)))

//  app.get('/data', (req, res) => )





app.listen(port, () => console.log(`Example app listening on port ${port}!`))

