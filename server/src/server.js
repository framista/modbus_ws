var ModbusRTU = require("modbus-serial")
var client = new ModbusRTU();

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
    ws.on('message', data => {
        const slave = JSON.parse(data)
        switch (slave.option) {
            case 'connect':
                connectModbus(slave, ws);
                break
            case 'disconnect':
                console.log("rozlaczone")
                closeModbus(slave, ws);
                break
            case 'read':
                slave.option = isModbusConnect(slave)
                readRegister(slave, ws)
                break
            case 'scan':
                slave.option = isModbusConnect(slave)
                scanRegister(slave, ws)
                break
            case 'write':
                slave.option = isModbusConnect(slave)
                writeRegister(slave, ws)
                break
        }
    })
})

function isModbusConnect(slave) {
    return client.isOpen ? slave.option : 'notconnect'
}

function connectModbus(slave, ws) {
    if (client.isOpen) {
        closeModbus(slave, ws)
    }
    try {
        client.connectTCP(slave.host, { port: parseInt(slave.port) });
        client.setID(1);
        setTimeout(() => {
            slave.option = isModbusConnect(slave)
            ws.send(JSON.stringify(slave))
        }, 1000);
    } catch{
        console.log("Cannot connect with modbus")
    }
}

function closeModbus(slave, ws) {
    client.close();
    slave.option = 'notconnect'
    ws.send(JSON.stringify(slave))
}

function readRegister(register, ws) {
    if (register.option === 'notconnect') {
        ws.send(JSON.stringify(register))
    } else {
        address = parseInt(register.address)
        client.readHoldingRegisters(address, 1).then(data => {
            register.value = data.data;
            ws.send(JSON.stringify(register))
        })
    }
}

function scanRegister(register, ws) {
    if (register.option === 'notconnect') {
        ws.send(JSON.stringify(register))
    } else {
        address = parseInt(register.address)
        client.readCoils(address, 1).then(data => {
            register.value = data.data;
            ws.send(JSON.stringify(register))
        })
    }
}

function writeRegister(register, ws) {
    if (register.option === 'notconnect') {
        ws.send(JSON.stringify(register))
    } else {
        address = parseInt(register.address)
        value = parseInt(register.value)
        client.writeRegister(address, value).then(() => {
            ws.send(JSON.stringify(register))
        })
    }
}
