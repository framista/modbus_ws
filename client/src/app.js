import Register from './modbus/register'
import Connection from './modbus/connection'

const host = document.getElementById("host")
const port = document.getElementById("port")
const readRegisterBtn = document.getElementById("readRegister")
const writeRegisterBtn = document.getElementById("writeRegister")
const connectionModbusBtn = document.getElementById("modbusConnectBtn")

const addressReadIpt = document.getElementById("addressRead")
const valueReadIpt = document.getElementById("valueRead")
const addressWriteIpt = document.getElementById("addressWrite")
const valueWriteIpt = document.getElementById("valueWrite")
const alertWrite = document.getElementById("alertWrite")
const alertConnect = document.getElementById("alertConnect")

const connection = new WebSocket('ws://localhost:8080')

connection.addEventListener('open', () => {
    console.log("connected")
})

connection.addEventListener('message', e => {
    const data = JSON.parse(e.data)
    switch (data.option) {
        case 'connect':
            alertConnect.style.display = "block"
            setTimeout(() => alertConnect.style.display = "none", 8000)
            break
        case 'read':
            valueReadIpt.value = data.value;
            break
        case 'write':
            alertWrite.style.display = "block"
            setTimeout(() => alertWrite.style.display = "none", 8000)
            break
    }
})

connectionModbusBtn.addEventListener('click', e => {
    e.preventDefault()
    createModbusConnection(host.value, port.value)
})

function createModbusConnection(host, port){
    if (connection.readyState === WebSocket.OPEN) {
        const connectionModbus = new Connection(host, port, 'connect')
        connection.send(JSON.stringify(connectionModbus))
    } else {
        throw 'Not connected'
    }
}

readRegisterBtn.addEventListener('click', e => {
    e.preventDefault();
    sendRegister(addressReadIpt.value, 0, 'read')
})

writeRegisterBtn.addEventListener('click', e => {
    e.preventDefault();
    sendRegister(addressWriteIpt.value, valueWriteIpt.value, 'write')
})

function sendRegister(address, value, option) {
    if (connection.readyState === WebSocket.OPEN) {
        const register = new Register(address, value, option)
        connection.send(JSON.stringify(register))
    } else {
        throw 'Not connected'
    }
}