import Register from './modbus/register'
import Connection from './modbus/connection'

const connectionModbusBtn = document.getElementById("modbusConnectBtn")
const host = document.getElementById("host")
const port = document.getElementById("port")
const connectAlert = document.getElementById("alertConnect")

const readRegisterBtn = document.getElementById("readRegister")
const addressReadIpt = document.getElementById("addressRead")
const valueReadIpt = document.getElementById("valueRead")

const writeRegisterBtn = document.getElementById("writeRegister")
const addressWriteIpt = document.getElementById("addressWrite")
const valueWriteIpt = document.getElementById("valueWrite")
const writeAlert = document.getElementById("alertWrite")

const startScanRegisterBtn = document.getElementById("startScanRegister")
const stopScanRegisterBtn = document.getElementById("stopScanRegister")
const addressScanIpt = document.getElementById("addressScan")
const valueScanIpt = document.getElementById("valueScan")
let scanRegisterInterval 

const connection = new WebSocket('ws://localhost:8080')

connection.addEventListener('open', () => {
    console.log("connected")
})

connection.addEventListener('message', e => {
    const data = JSON.parse(e.data)
    switch (data.option) {
        case 'connect':
            connectAlert.style.display = "block"
            setTimeout(() => connectAlert.style.display = "none", 8000)
            break
        case 'read':
            valueReadIpt.value = data.value;
            break
        case 'scan':
            valueScanIpt.value = data.value[0];
            break
        case 'write':
            writeAlert.style.display = "block"
            setTimeout(() => writeAlert.style.display = "none", 8000)
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

startScanRegisterBtn.addEventListener('click', e=> {
    e.preventDefault();
    scanRegisterInterval = setInterval ( () => {
        sendRegister(addressScanIpt.value, 0, 'scan')
    }, 1000);
})

stopScanRegisterBtn.addEventListener('click', e => {
    e.preventDefault();
    clearInterval(scanRegisterInterval)
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