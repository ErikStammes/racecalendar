const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')
const path = require('path')
const winston = require('winston')
var helmet = require('helmet')

// Parse dev mode
var devMode = process.argv.includes('-dev')

// Logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
})
if (devMode) {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }))
}

// Express
const app = express()

app.use(helmet())
app.use(helmet.frameguard({
    action: 'allow-from',
    domain: 'http://teamskits.nl'
}))
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(express.static(path.join(__dirname, 'public')))


// MongoDB
mongoose.connect('mongodb://localhost/data')

var db = mongoose.connection
db.on('error', function(error) {
    logger.error('Error while trying to connect to Mongo')
    logger.error(JSON.stringify(error))
})
db.once('open', function() {
  logger.info('Connected to Mongo')
})

var Schema = mongoose.Schema
var userSchema = new Schema({
    email: String,
    name: String,
    role: String,
    password: String
})

userSchema.methods.generateHash = function(password) {
    let salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt)
}

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

var raceSchema = new Schema({
   date: Date,
   endDate: Date,
   name: String,
   location: String,
   time: String,
   register: String,
   participants: [{ type: Schema.Types.ObjectId, ref: 'User'}],
   registered_participants: [{ type: Schema.Types.ObjectId, ref: 'User'}],
   cars: [{ type: Schema.Types.ObjectId, ref: 'User'}],
   description: String,
   canRegister: { type: Boolean, default: true }
})

var User = mongoose.model('User', userSchema)
var Race = mongoose.model('Race', raceSchema)

//Passport
var ExtractJwt = passportJWT.ExtractJwt
var JwtStrategy = passportJWT.Strategy

const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: 'eriksecret2018'
}

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    User.findOne({ _id: jwt_payload.id }, function (err, user) {
        if (err || !user) { 
            next(null, false)
        } else {
            next(null, user)
        }
  })
})

passport.use(strategy)

var PassportAuth = passport.authenticate('jwt', {session: false})

// Express endpoints
app.post('/login', function (req, res) {
    const remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    logger.info('Login request' + remoteAddress)
    if (req.body.username && req.body.password) {
        var name = req.body.username
        var password = req.body.password
        User.findOne({ email: name}, function (err, user) {
            if (!user) {
                logger.info('Login unsuccesful: ' + name)
                res.status(401).json({message: 'User not found'})
                return
            }
            if (err) {
                logger.error('Login unsuccesful: ' + JSON.stringify(err))
                res.status(401).json({message: err})
                return
            }
            if (user.validPassword(password)) {
                var payload = { id: user._id }
                var token = jwt.sign(payload, jwtOptions.secretOrKey)
                logger.info('Login succesful: ' + user.name)
                res.json({token: token, user: user})
                return
            } else {
                logger.info('Login unsuccesful, incorrect password')
                res.status(401).json({message: 'Password incorrect'})
                return
            }
        })
    }
})

app.post('/register', function (req, res) {
    const remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    logger.info('Register request' + remoteAddress)
    if (!req.body.name || !req.body.password || !req.body.email) {
        return res.status(400).json({message: 'Not all fields supplied'})
    }
    if (req.body.token.toLowerCase() !== 'spartaansebourgondiers') {
        return res.status(401).json({message: 'Invalid token'})
    }
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        role: 'racer'
    })
    user.password = user.generateHash(req.body.password)
    user.save((err, user) => {
        if (err) {
            logger.error('Register failed, ' + JSON.stringify(err))
            return res.status(500).json({message: 'Error while saving user'})
        }
        logger.info('Registration succesful ' + user.name)
        return res.status(201).send()
    })

})

app.get('/me', PassportAuth, (req, res) => 
    User.findOne({_id : req.user._id}, function (err, user) {
        if (!user) {
            return res.status(401).json({message: 'User not found'})
        }
        if (err) {
            logger.error('Error retrieving me' + JSON.stringify(err))
            return res.status(401).json({error: err})
        }
        res.json({user})
    })
)

app.get('/races', PassportAuth, (req, res) =>
    Race
        .find({date: {"$gte": new Date()}})
        .find()
        .sort({date: 'asc'})
        .populate({ path: 'participants', select: 'name', model: User })
        .populate({ path: 'registered_participants', select: 'name', model: User})
        .exec(function (err, races) {
            if (err) { 
                logger.error('Error retrieving races' + JSON.stringify(err))
                return res.status(500).send(err)
            }
            res.send(races)
}))

app.post('/race', PassportAuth, function(req, res) {
    var race = new Race(req.body)
    race.save(function (err, race) {
        if (err) {
            logger.error('Error posting race' + JSON.stringify(err))
            return res.status(500).send(err)
        }
        return res.status(201).json(race)
    })
})

app.post('/race/:id/register/:signedup', PassportAuth, (req, res) => {
    let update = req.params.signedup === 'true' ? 
    { $push : { registered_participants: req.user._id }, $pull: { participants: req.user._id }} :
    { $push : { participants: req.user._id }, $pull: { registered_participants: req.user._id }}
    Race.findByIdAndUpdate(req.params.id, update, { new: true })
        .populate('participants')
        .populate('registered_participants')
        .exec(function (err, race) {
            if (err) {
                logger.error('Error saving registration' + JSON.stringify(err))
                return res.status(500).send(err)
            }
            res.send(race)
        }
    )
})

app.delete('/race/:id/register/:signedup', PassportAuth, (req, res) => {
    let pull = req.params.signedup === 'true' ? 
        { $pull : { registered_participants: req.user._id }} :
        { $pull : { participants: req.user._id }}
    Race.findByIdAndUpdate(req.params.id, pull, {new: true})
        .populate('participants')
        .populate('registered_participants')
        .exec(function (err, race) {
            if (err) {
                logger.error('Error deleting registration' + JSON.stringify(err))
                return res.status(500).send(err)
            }
            res.send(race)
        })
})

// app.post('/race/:id/car', PassportAuth, (req, res) =>
//     Race.findOne({ _id: req.params.id }, function (err, race) {
//         if (err) return res.status(500).send(err)
//         if (!race) return res.status(404).json({'Error': 'Race not found'})
//         race.cars.push(req.user._id)
//         race.save(function (err, updatedRace) {
//             if (err) return res.status(500).send(err)
//             res.send(updatedRace)
//         })
//     })
// )

let port = 80
app.listen(port, () => logger.info('Listening on port '+port+'!'))
