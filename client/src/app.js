import Register from './modbus/register'
import Connection from './modbus/connection'
import {validateHost, validateInputNumbers} from './validation'

const connectionModbusBtn = document.getElementById("modbusConnectBtn")
const disconnectionModbusBtn = document.getElementById("modbusDisconnectBtn")
const host = document.getElementById("host")
const port = document.getElementById("port")
const connectAlert = document.getElementById("alertConnect")
const notConnectAlert = document.getElementById("alertNotConnect")

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
    notConnectAlert.style.display = "none"
    switch (data.option) {
        case 'notconnect':
            notConnectAlert.style.display = "block"
            break
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
    if (validateHost(host) && validateInputNumbers(port)) {
        createModbusConnection(host.value, port.value)
    }
})

disconnectionModbusBtn.addEventListener('click', e => {
    e.preventDefault()
    clearInterval(scanRegisterInterval)
    connection.send(JSON.stringify({ host: host.value, option: "disconnect" }))
})


readRegisterBtn.addEventListener('click', e => {
    e.preventDefault();
    if (validateInputNumbers(addressReadIpt)) {
        sendRegister(addressReadIpt.value, 0, 'read')
    }
})

startScanRegisterBtn.addEventListener('click', e => {
    e.preventDefault();
    if (validateInputNumbers(addressScanIpt)) {
        scanRegisterInterval = setInterval(() => {
            sendRegister(addressScanIpt.value, 0, 'scan')
        }, 1000);
    }
})

stopScanRegisterBtn.addEventListener('click', e => {
    e.preventDefault();
    clearInterval(scanRegisterInterval)
})

writeRegisterBtn.addEventListener('click', e => {
    e.preventDefault();
    if (validateInputNumbers(addressWriteIpt) && validateInputNumbers(valueWriteIpt)) {
        sendRegister(addressWriteIpt.value, valueWriteIpt.value, 'write')
    }
})

function createModbusConnection(host, port) {
    if (connection.readyState === WebSocket.OPEN) {
        const connectionModbus = new Connection(host, port, 'connect')
        connection.send(JSON.stringify(connectionModbus))
    } else {
        alert('Problem with server. Refresh site')
        throw 'Not connected'
    }
}

function sendRegister(address, value, option) {
    if (connection.readyState === WebSocket.OPEN) {
        const register = new Register(host.value, address, value, option)
        connection.send(JSON.stringify(register))
    } else {
        alert('Problem with server. Refresh site')
        throw 'Not connected'
    }
}

