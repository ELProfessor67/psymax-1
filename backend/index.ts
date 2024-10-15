import {config} from 'dotenv';
import MediasoupRoute from 'api/routes/medisoupRoute';
import ChatRoute from 'api/routes/chatRoute';
import http from 'http'
import expres from 'express'
import routes from 'api/routes';
config()

const mediaSoupApp = expres();
mediaSoupApp.use('/api/v1',routes);
const mediaSoupHttpServer = http.createServer(mediaSoupApp);

const chatApp = expres();
const chatHttpServer = http.createServer(chatApp);

//attach sockets routes
const mediasoupRoute = new MediasoupRoute(mediaSoupHttpServer);
const chatRoute = new ChatRoute(chatHttpServer);

const MPORT = Number(process.env.MEDIASOUP_PORT   || 4000);
const CPORT = Number(process.env.CHAT_PORT || 4001);

mediaSoupHttpServer.listen(MPORT, () => {
    console.log(`Mediasoup Server Running on port ${MPORT}`)
});

chatHttpServer.listen(CPORT, () => {
    console.log(`Chat Server Running on port ${CPORT}`)
});




