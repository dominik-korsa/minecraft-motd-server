const mc = require('minecraft-protocol');

function startServer({port, motd, versionName, kickMessage}) {
  return new Promise((resolve, reject) => {
    console.log('Server starting...');
    const server = mc.createServer({
      motd,
      port,
      'online-mode': false,
      maxPlayers: 0,
      hideErrors: true,
      kickTimeout: 10000,
      beforePing: (response) => {
        response.version = {name: versionName, protocol: -1};
        return response;
      },
      beforeLogin: (client) => {
        client.end(kickMessage);
      },
    });

    server.on('error', (error) => {
      reject(error);
    });

    server.on('listening', function () {
      resolve({
        port: server.socketServer.address().port,
        close: () => {
          server.close()
        },
      });
    });
  });
}

module.exports.startServer = startServer;
