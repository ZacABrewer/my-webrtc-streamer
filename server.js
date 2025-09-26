// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const port = process.env.PORT || 8080;
const app = express();

// Serve all static files from the 'public' directory
app.use(express.static('public'));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

console.log("Signaling server starting...");

wss.on('connection', ws => {
    console.log('Client connected.');

    ws.on('message', message => {
        // The message is a Buffer, so we convert it to a string.
        const messageStr = message.toString();

        // Broadcast the message to all clients except the sender
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(messageStr);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected.');
    });

    ws.on('error', error => {
        console.error('Server error:', error);
    });
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
