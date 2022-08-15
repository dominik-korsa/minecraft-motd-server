const {startServer} = require("../src");
const mc = require('minecraft-protocol');

const testConfig = {
  motd: 'Test message of the day',
  kickMessage: 'Test kick message',
  versionName: 'Test version name'
};

test('Start server error', () => {
  return expect(() => startServer({
    port: -1,
    ...testConfig,
  })).rejects.toThrowError();
})

test('Server starts and stops', async () => {
  const server = await startServer(0);
  expect(server.port).not.toEqual(0);
  server.close();
})

describe('Version checks', () => {
  let server;
  beforeAll(async () => {
    server = await startServer({
      port: 25565,
      ...testConfig,
    });
    expect(server.port).toEqual(25565);
  });
  afterAll(async () => {
    server.close();
  });

  describe('Ping', () => {
    mc.supportedVersions.forEach((version) => {
      test(version, async () => {
        const result = await mc.ping({
          host: 'localhost',
          version,
        });
        if ('motd' in result) {
          expect(result.motd).toEqual(testConfig.motd);
          expect(result.version).toEqual(testConfig.versionName);
          expect(result.protocol).toEqual(-1);
        } else {
          expect(result.description.text).toEqual(testConfig.motd);
          expect(result.version.name).toEqual(testConfig.versionName);
          expect(result.version.protocol).toEqual(-1);
        }
      });
    });

    describe('Kick', () => {
      mc.supportedVersions.forEach((version) => {
        test(version, async () => {
          const client = await mc.createClient({
            port: server.post,
            host: 'localhost',
            username: 'Steve',
            version,
          });
          const reason = await new Promise((resolve, reject) => {
            client.on('disconnect', function (packet) {
              resolve(JSON.parse(packet.reason).text);
            });
            setTimeout(() => {
              client.end();
              reject(new Error('Didn\'t receive disconnect packet'));
            }, 5000);
          });
          expect(reason).toEqual(testConfig.kickMessage);
        });
      });
    });
  });
});
