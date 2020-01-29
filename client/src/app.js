import Register from './register'

const IP = document.getElementById("host")
const PORT = document.getElementById("port")
const readRegisterBtn = document.getElementById("readRegister")
const writeRegisterBtn = document.getElementById("writeRegister")

const addressReadIpt = document.getElementById("addressRead")
const valueReadIpt = document.getElementById("valueRead")
const addressWriteIpt = document.getElementById("addressWrite")
const valueWriteIpt = document.getElementById("valueWrite")
const alertWrite = document.getElementById("alertWrite")

const connection = new WebSocket('ws://localhost:8080')

connection.addEventListener('open', () => {
    console.log("connected")
})

connection.addEventListener('message', e => {
    const register = JSON.parse(e.data)
    switch (register.option){
        case 'read':
            valueReadIpt.value = register.value;
            break
        case 'write':
            alertWrite.style.display = "block"
            setTimeout( () => alertWrite.style.display = "none", 8000)
            break
    }
})

readRegisterBtn.addEventListener('click', e => {
    e.preventDefault();
    sendRegister(addressReadIpt.value, 0, 'read')
})

writeRegisterBtn.addEventListener('click', e=> {
    e.preventDefault();
    sendRegister(addressWriteIpt.value, valueWriteIpt.value, 'write')
})

function sendRegister(address, value, option){
    if (connection.readyState === WebSocket.OPEN){
        const register = new Register(address, value, option)
        connection.send(JSON.stringify(register))
    }else{
        throw 'Not connected'
    }
}