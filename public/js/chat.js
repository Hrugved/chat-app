const socket = io()

socket.on('message', (msg) => {
    const node = document.createElement('li')
    const textNode = document.createTextNode(`${msg.text} <-- ${moment(msg.createdAt).format('h:mm a')}`)
    node.appendChild(textNode)
    document.querySelector('ul').appendChild(node)
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    document.querySelector('#button').setAttribute('disabled','disabled')
    const msg = e.target.elements.message.value
    socket.emit('send_msg', msg, (error) => {
        document.querySelector('#button').removeAttribute('disabled')
        document.querySelector('#input').focus()
        e.target.elements.message.value = ''
        if(error) {
            document.querySelector('#remark').innerHTML = `<p style="background-color:red;">${error}</p>`
        } else {
            document.querySelector('#remark').innerHTML = '<p style="background-color:green;">sent</p>'
        }
    })
})

socket.on('client_msg', (msg) => {
    const node = document.createElement('li')
    const textNode = document.createTextNode(`${msg.text} <-- ${moment(msg.createdAt).format('h:mm a')}`)
    node.appendChild(textNode)
    document.querySelector('ul').appendChild(node)
})

socket.on('client_location', ({pos,createdAt}) => {
    const node = document.createElement('li')
    const link = document.createElement('a')
    link.setAttribute('href', pos)
    const textNode = document.createTextNode(`location <-- ${moment(createdAt).format('h:mm a')}`)
    link.appendChild(textNode)
    node.appendChild(link)
    document.querySelector('ul').appendChild(node)
})

document.querySelector('#send-location').addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('your browser doesnt support geolocation')
    }

    navigator.geolocation.getCurrentPosition((pos) => {
        const {longitude, latitude} = pos.coords
        document.querySelector('#send-location').setAttribute('disabled','disabled')
        socket.emit('send_location', `https:/www.google.com/maps?q=${latitude},${longitude}`, () => {
            document.querySelector('#send-location').removeAttribute('disabled')
            document.querySelector('#remark').innerHTML = '<p style="background-color:green;">Location shared</p>'
        })
    })
})

// index
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

socket.emit('join', {username, room})