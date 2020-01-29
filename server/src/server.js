var ModbusRTU = require("modbus-serial")
var client = new ModbusRTU();

const IP = ""
const PORT = 502

let value = 0

client.connectTCP(IP, { port: PORT });
client.setID(1);

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
    ws.on('message', data => {
        const register = JSON.parse(data)
        switch (register.option) {
            case 'read':
                readRegister(register, ws)
                break
            case 'write':
                writeRegister(register, ws)
                break
        }
    })
})

function readRegister(register, ws) {
    address = parseInt(register.address)
    client.readHoldingRegisters(address, 1).then(data => {
        register.value = data.data;
        ws.send(JSON.stringify(register))
    })
}

function writeRegister(register, ws){
    address = parseInt(register.address)
    value = parseInt(register.value)
    client.writeRegister(address, value).then(() => {
        ws.send(JSON.stringify(register))
    })
}
