//hardcoded data
const xlsx = require("xlsx");
let wb = xlsx.readFile("SPY_All_Holdings.xlsx")
let ws = wb.Sheets['SPY_All_Holdings']
let data = xlsx.utils.sheet_to_json(ws)
//webscraping to get the daily updates
const rp = require('request-promise')
const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const port = 3000
const Holdings = require ('./holdingsModel')
const db = require('./db')
const holdingsData = require('./holdings.json')

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//headers
// writeStream.write(`lastArr \n`)

let top10 = function (data){
  let newData = []
  for(let i = 3; i<=12; i++){
    newData.push(data[i])
  }
  return newData
}

let lastArr = []
 request('https://us.spdrs.com/etf/spdr-sp-500-etf-trust-SPY', (error, response, html) => {
  if(!error && response.statusCode == 200){
    const $ = cheerio.load(html)
    let rows = $('tr')
    let arr = []
    let digitArr = []
    let finDigArr = []
    let sectorArr = [
      'Information Technology',
      'Information Technology',
      'Consumer Discretionary',
      'Communication Services',
      'Financials',
      'Financials',
      'Communication Services',
      'Communication Services',
      'Health Care',
      'Information Technology'
    ]
    let tickerArr = ['MSFT',
      'AAPL',
      'AMZN',
      'FB',
      'BRK.B',
      'JPM',
      'GOOG',
      'GOOGL',
      'JNJ',
      'V']
    rows.each((i, el)=>{
      const digit = $(el).text().replace(/\s\s+/g, '').match(/\d+/g)
      const item = $(el).text().replace(/\s\s+/g, '').split(/[0-9]/)[0]
     arr.push(item)
      digitArr.push(digit)
    })
    digitArr.slice(105, 115).map((i) => finDigArr.push(Number(i.join('.'))))
    let finNameArr = arr.slice(105, 115)
    for(let i = 0; i< 10; i++){
      lastArr.push({name: finNameArr[i], ticker: tickerArr[i], weight: finDigArr[i], sector: sectorArr[i]})
    }
    // console.log(lastArr)
    //write to JSON
    fs.writeFile(
      './holdings.json',
      JSON.stringify(lastArr),
      function (err) {
        if (err) {
            console.error('There was an error');
        }
    }
      )
  }
  console.log("done")
})


//console.log(top10(data))
async function seed() {
  await db.sync({force: true})
  console.log('db synced!')
  await Promise.all(
    holdingsData.map(element => {
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
}

runSeed()

//all holdings
app.get('/api', verifyToken, async(req, res) => {
  try{
    const holdings = await Holdings.findAll()
    jwt.verify(req.token, 'ilovecorgis', (err, authData) => {
      if(err){
        res.sendStatus(403)
      }else{
        res.send({holdings, authData})
      }
    })
  }
  catch(err){
    console.log(err)
  }
})

//specific single holding by id

app.get('/:id', verifyToken, async(req, res) => {
  try{
    const holding = await Holdings.findAll({
     where: {
       id: req.params.id
     }
    })
    jwt.verify(req.token, 'ilovecorgis', (err, authData) => {
      if(err){
        res.sendStatus(403)
      }else{
        res.send({holding, authData})
      }
    })
  }
  catch(err){
    console.log(err)
  }
})


//get holding by ticker
app.get('/api/:ticker', verifyToken, async(req, res) => {
  try{
    const holding = await Holdings.findAll({
     where: {
       ticker: req.params.ticker
     }
    })
    jwt.verify(req.token, 'ilovecorgis', (err, authData) => {
      if(err){
        res.sendStatus(403)
      }else{
        res.send({holding, authData})
      }
    })
    //res.send(holding)
  }
  catch(err){
    console.log(err)
  }
})

//create tokens that the user can use to access API
//set them to expire in 30s
app.post('/api/login', (req, res) => {
  //mock user
  const user = {
    id: 1,
    username: 'lisa',
    email: 'lisaxjo@gmail.com'
  }
  jwt.sign({user}, "ilovecorgis", { expiresIn: '30s' }, (err, token)=> {
    res.json({
      token
    })
  });
})



//verify middleware

function verifyToken (req,res, next){
  //get that token
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined'){
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    req.token = bearerToken;
    next();
  }else{
    res.sendStatus(403)
  }
}




app.listen(port, () => console.log(`Example app listening on port ${port}!`))

