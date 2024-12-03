const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const server = new WebSocket.Server({ port: 8080 });

const filePath = path.join(__dirname, 'csv', 'tablas.csv');
console.log('Ruta de la carpeta actual:', __dirname);
console.log('Ruta del archivo CSV que se está monitoreando:', filePath);


let lastModifiedTime = fs.existsSync(filePath) ? fs.statSync(filePath).mtime : null;

// Enviar la notificación de actualización a todos los clientes conectados
server.on('connection', ws => {
    console.log('Cliente conectado');
    ws.on('message', message => {
        console.log('Mensaje recibido del cliente:', message);
    });
});


function notifyUnity() {
    console.log('Archivo CSV actualizado detectado. Enviando notificación a Unity.');
    server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('Archivo CSV actualizado');
        }
    });
}
fs.watch(filePath, (eventType, filename) => {
    if (eventType === 'change') {
        console.log('El archivo CSV ha cambiado.');
        lastModifiedTime = fs.statSync(filePath).mtime;
        notifyUnity(); // Notificar a Unity
    }
});

// API para revisar el archivo CSV y notificar si ha habido una actualización
app.get('/check-csv', (req, res) => {
    if (!fs.existsSync(filePath)) {
        console.log('Archivo CSV no encontrado');
        return res.status(404).send('Archivo CSV no encontrado');
    }

    const currentModifiedTime = fs.statSync(filePath).mtime;
    console.log('Última modificación detectada:', currentModifiedTime);
    console.log('Última modificación guardada:', lastModifiedTime);

    if (lastModifiedTime && currentModifiedTime > lastModifiedTime) {
        console.log('El archivo ha sido sobrescrito o actualizado.');
        lastModifiedTime = currentModifiedTime;
        notifyUnity(); // Notificar a Unity
        return res.status(200).send('Archivo CSV actualizado');
    } else {
        console.log('No hay cambios en el archivo CSV.');
        return res.status(200).send('No hay cambios en el archivo CSV');
    }
});


app.listen(3000, () => {
    console.log('API de monitoreo corriendo en el puerto 3000');
});
