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
  userId: {type: String, required: true},
  description: String,
  duration: Number,
  date: Date
})

const UserSchema = new Schema({
  username: String
})

const User = mongoose.model('User', UserSchema)
const Exercise = mongoose.model('Exercise', ExerciseSchema)

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
  const {description, duration, date} = req.body
  User.findById(id, (err, userData) => {
    if (err || !userData) {res.send("Error saving the user"), console.log(err)}
    else {
      const newExercise = new Exercise({
        userId: id,
        description: description,
        duration: duration,
        date: new Date(date).toDateString()
      })
      newExercise.save((err, data) => {
        if (err || !data) {res.send("Error saving exercises"), console.log(err)}
        else {
          res.json({
            _id: userData.id,
            username: userData.username,
            date: data.date.toDateString(),
            duration,
            description
          })
        }
      })
    }
  })

  
})

app.get('/api/users/:id/logs', (req, res) => {
  const { from, to, limit } = req.query
  const {id} = req.params
  User.findById(id, (err, userData) => {
    if (err || !userData) {res.send("Error getting the user"), console.log(err)}
    else {
      let dateObj = {}
      if(from){
        dateObj["$gte"] = new Date(from)
      }
      if (to){
        dateObj["$lte"] = new Date(to)
      }
      let filter = {
        userId: id
      }
      if(from || to) {
        filter.data = dateObj
      }
      let nonNull = limit ?? 500
      Exercise.find(filter).limit(+nonNull).exec((err, data) => {
        if(err || !data) {res.send("Error getting the exercise"), console.log(err)}
        else {
          const count = data.length
          const rawLog = data
          const {username, _id} = userData
          const log = rawLog.map(e => ({
            description: e.description,
            duration: e.duration,
            date: e.date.toDateString()
          }))
          res.json({username, count, _id, log})
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
