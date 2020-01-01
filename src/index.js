const express = require('express')
const path = require('path')

const Filter = require('bad-words')

const http = require('http')
const socketio = require('socket.io')

const {generateMessage, generateLocation} = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(publicDirectoryPath))

// socket connects
io.on('connection', (socket) => {
    
    // emitters
    socket.on('join', ({username,room}) => {
        socket.join(room)
        socket.emit('message', generateMessage('welcome!'))
        socket.broadcast.to(room).emit('client_msg', generateMessage(`${username} has joined the chat`))
    })

    // listeners
    socket.on('send_msg', (msg, cb) => {
        const filter = new Filter()
        if(filter.isProfane(msg)) {
            return cb('profanity is not allowed')
        }
        cb()
        io.emit('client_msg', generateMessage(msg))
    })
    socket.on('send_location', (pos, cb) => {
        cb()
        io.emit('client_location', generateLocation(pos))
    })


    // socket disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat')
    })
})


server.listen(process.env.PORT, () => {
    console.log(`Server is up and running on port ${process.env.PORT}`)
})