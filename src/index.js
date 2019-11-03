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

io.on('connection', () => {
    console.log('New Websocket connection')
})

server.listen(process.env.PORT, () => {
    console.log(`Server is up and running on port ${process.env.PORT}`)
})