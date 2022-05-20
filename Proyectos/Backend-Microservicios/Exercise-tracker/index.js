const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const mongodb = require('mongodb')
const bodyParser = require('body-parser')
require('dotenv').config()

// Mongoose connection
mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const { Schema } = mongoose

const ExerciseSchema = new Schema({
  "username": {type: String, required: true},
  "date": Date,
  "duration": Number,
  "description": String,
})

const UserSchema = new Schema({
  username: String
})

const LogSchema = new Schema({
  "username": String,
  "count": Number,
  "log": Array
})

const User = mongoose.model('User', UserSchema)
const Exercise = mongoose.model('Exercise', ExerciseSchema)
const Log = mongoose.model('Log', LogSchema)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req, res) => {
  const newUser = new User({
    username: req.body.username
  })
  newUser.save((err,data) => {
    if (err || !data) {res.send("Error saving data"), console.log(err)}
    else {
      res.json({username: data.username, _id: data.id})
    }
  })
})

app.post('/api/users/:id/exercises', (req, res) => {
  const id = req.params.id;
  User.findById(id, (err, userData) => {
    if (err || !userData) {res.send("Error saving the user"), console.log(err)}
    else {
      const newExercise = new Exercise({
        "username": userData.username,
        "description": req.body.description,
        "duration": req.body.duration,
        "date": new Date(req.body.date).toDateString()
      })
      newExercise.save((err, data) => {
        if (err || !data) {res.send("Error saving exercises"), console.log(err)}
        else {
          res.json({
            _id: userData.id,
            username: userData.username,
            "description": data.description,
            "duration": data.duration,
            date: data.date.toDateString(),
          })
        }
      })
    }
  })

  
})

app.get('/api/users/:id/logs', (req, res) => {
  const {from, to, limit} = req.query;
  let idJson = {"id": req.params.id}
  let idToCheck = idJson.id;

  // Check id
  User.findById(idToCheck, (err, data) => {
    var query = {
      username: data.username
    }
    if (from !== undefined && to === undefined) {
      query.date = { $gte: new Date(from)}
    } else if (to !== undefined && from === undefined) {
      query.date = { $lte: new Date(to) }
    } else if (from !== undefined && to !== undefined) {
      query.date = { $gte: new Date(from), $lte: new Date(to) }
    }
  
  let limitChecker = (limit) => {
    let maxLimit = 100;
    if (limit) {
      return limit;
    } else {
      return maxLimit;
    }
  }

  if(err) {
    console.log("error with ID=> " + err)
  } else {
    Exercise.find((query), null, {limit: limitChecker(+limit)}, (err, docs) => {
      let loggedArray = [];
      if (err) {
        console.log("error with query => " + err)
      }else {
        let documents = docs;
        let loggedArray = documents.map((item) => {
          return  {
            "description": item.description,
            "duration": item.duration,
            "date": item.date.toDateString()
          }
        })
        const test = new Log({
          "username": data.username,
          "count": loggedArray.length,
          "log": loggedArray
        })
        
        test.save((err, data) => {
          if (err) {console.log("error saving data " + err)}
          else {
            console.log("saved log successfully")
            res.json({
              "_id": idToCheck,
              "username": data.username,
              "count": data.count,
              "log": loggedArray
            })
          }  
        })
      }
    })
  }
  })
})

app.get('/api/users', (req, res) => {
  User.find({}, (err, data) => {
    if(!data) {res.send("No users here")}
    else{ res.json(data) }
  })
})
 

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
