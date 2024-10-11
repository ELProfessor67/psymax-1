import { initRoute } from 'api/routes';
import {config} from 'dotenv';



config()



const MPORT = Number(process.env.MEDIASOUP_PORT   || 4000);
const CPORT = Number(process.env.CHAT_PORT || 4001);
initRoute(MPORT,CPORT)


