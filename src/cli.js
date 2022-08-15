const {startServer} = require("./index");

async function main() {
  const config = Object.fromEntries(
    ['PORT', 'MOTD', 'VERSION_NAME', 'KICK_MESSAGE']
      .map((key) => {
        if (!process.env[key]) throw new Error(`Env variable ${key} not set`)
        return [key, process.env[key]]
      })
  );

  console.log('> Starting server');
  const {port} = await startServer({
    port: config.PORT,
    motd: config.MOTD,
    versionName: config.VERSION_NAME,
    kickMessage: config.KICK_MESSAGE,
  });
  console.log('> Server listening on port', port);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
