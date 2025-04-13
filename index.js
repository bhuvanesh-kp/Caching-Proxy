const CachingProxyServer = require('./server');
const yargs = require('yargs');

yargs.command('start','Starting proxy server',{
        port: {
            describe: 'Port to run server on',
            demandOption: true,
            type: 'number',
        },
        origin: {
            describe: 'Origin server URL',
            demandOption: true,
            type: 'string',
        },
    },
    (argv)=>{
        const {port,origin} = argv;
        const server = new CachingProxyServer(port ,origin);
        server.start();
    }
)

.command('clear', 'Clear Cache',
    {},
    () => {
        const server = new CachingProxyServer();
        server.clearCache();
        console.log(`Cache cleared !!!`);
    }
)

.help()
.argv;