//updater/index.js
(function (updater) {
    updater.init = function (server) {
        var socketio = require('socket.io');
        var io = socketio.listen(server);
        var sockets = io.sockets;

        sockets.on('connection', function (s) {
            
            s.on('join_category', function (category) {
                s.join(category);
            });
            s.on('addNote', function (data) {
                s.broadcast.to(data.category)
                .emit('broadcast_note', data.note);
            });
        });

    };
})(module.exports);