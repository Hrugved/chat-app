const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(publicDirectoryPath))

let count = 0;

// runs for every client
io.on('connection', (socket) => {
    console.log('New Websocket connection')
    // emiting on 'socket' sends it to this single connected client 
    socket.emit('countUpdated', count) // want to send initial count only to newly connected client
    socket.on('increment', () => {
        count++
        // emiting on 'io' sends it to the all connected client
        io.emit('countUpdated',count) // want to send updated count to all connected clients
    })
})

server.listen(process.env.PORT, () => {
    console.log(`Server is up and running on port ${process.env.PORT}`)
})