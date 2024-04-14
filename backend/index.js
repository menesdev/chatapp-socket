/*
Sunucu için gerekli modülleri ekliyoruz.
Socket.Io kullanımı için socketIo modülü kullanılıyor.
Web server özellikleri içinse epxress modülü.
*/
const express = require('express');
const socket = require('socket.io');

const app = express(); // express nesnesini örnekliyoruz.

// Sunucunun root dizinine bir get isteği geldiğinde "Hello World" mesajını döndürüyoruz.
app.get('/', (req, res) => {
    res.send('Hello World');
});

const io = socket(

    // Sunucuyu ayağa kaldırıp dinlemeye başlıyoruz.
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    }), {
    cors: {
        origin: 'http://localhost:3001',
        methods: ['GET', 'POST']
    }
});

// Socket.IO ile bir kullanıcı bağlandığında ve bağlantı kesildiğinde konsola mesaj yazdırıyoruz.
io.on('connection', (socket) => {
    console.log("User connected");
    // socket.emit('message', 'Hoşgeldiniz');

    socket.on('disconnect', () => {
        console.log("Kullanıcı ayrıldı");
    })

    // Kullanıcı odaya girdiğinde, odaya katıldı mesajı gönderiyoruz.
    socket.on('join', ({ room, name }) => {
        socket.join(room);
        io.to(room).emit('notification', `${name} katıldı`)
    })

    // Kullanıcıdan mesaj alındığında o mesajı o kullanıcının bağlı olduğu odadaki diğer kullanıcılara gönderiyoruz.
    socket.on('messageRoom', ({ room, message }) => {
        io.to(room).emit('message', message);
    })
});