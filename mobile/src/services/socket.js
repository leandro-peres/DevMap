import socketio from 'socket.io-client';
import { URL } from './api';

const socket = socketio(URL, {
    autoConnect: false,
});

function subscribeToNewDevs(subscribeFunction) {
    socket.on('new-dev', subscribeFunction);
}

function connect(latitude, longitude, techs) {
    socket.io.opts.query = {
        latitude,
        longitude,
        techs,
    }

    socket.connect();

    socket.on('message', text => {
        console.log(text);
    });
}

function disconnect() {
    if (!socket.connected) return;
    socket.disconnect();
}

export {
    connect,
    disconnect,
    subscribeToNewDevs,
};