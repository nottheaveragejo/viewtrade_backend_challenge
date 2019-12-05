const xlsx = require("xlsx");
let wb = xlsx.readFile("SPY_All_Holdings.xlsx")
let ws = wb.Sheets['SPY_All_Holdings']
let data = xlsx.utils.sheet_to_json(ws)
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
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

//all holdings
app.get('/api', verifyToken, async(req, res) => {
  try{
    const holdings = await Holdings.findAll()
    // res.send(holdings)
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

//token format


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

