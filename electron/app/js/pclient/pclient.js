'use strict';

// This "client" is the Peeqo app itself
// Commands are passed to it from the server after it connects, these are usually forwarded from other real clients to the server

const config = require('config/config');
const socketIOClient = require('socket.io-client');
const id = 'pclient';

class PClient {

    constructor(intentEngine) {
        this.intentEngine = intentEngine;

        this.socket = socketIOClient(config.socket.host);
        this.setupEvents();
    }

    setupEvents() {
        let boundOnConnected = this.onConnected;
        boundOnConnected = boundOnConnected.bind(this);
        this.socket.on('connect', boundOnConnected);
    }

    onConnected() {
        if(this.socket.connected) {
            let boundOnMessageReceived = this.onMessageReceived;
            boundOnMessageReceived = boundOnMessageReceived.bind(this);
            this.socket.on('message', boundOnMessageReceived);
        }
    }

    notifyPClientConnect() {
        this.socket.emit('message', {'id': `${id}`});
    }

    onMessageReceived(msg) {
        console.log('onMessageReceived ', msg);

        if(msg.hasOwnProperty('query')) {
            if(msg.query === 'id') {
                this.notifyPClientConnect();
            }
        }
        else if(msg.hasOwnProperty('cmd')) {
            // Pass the command and its data to the intent engine
            this.intentEngine.parseIntent(msg.cmd);
        }
    }
}

module.exports = {
    PClient : PClient
} ;
