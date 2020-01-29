var ModbusRTU = require("modbus-serial")
var client = new ModbusRTU();

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
    ws.on('message', data => {
        const slave = JSON.parse(data)
        switch (slave.option) {
            case 'connect':
                client.connectTCP(slave.host, { port: parseInt(slave.port) });
                client.setID(1);
                ws.send(JSON.stringify(slave))
                break
            case 'read':
                readRegister(slave, ws)
                break
            case 'write':
                writeRegister(slave, ws)
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
