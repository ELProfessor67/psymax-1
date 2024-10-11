import chatServer from "./chatRoute";
import mediaServer from "./medisoupRoute";


export const initRoute = async (MPORT:number,CPORT:number) => {
    mediaServer.listen(MPORT, () => {
        console.log(`Mediasoup Server Running on port ${MPORT}`)
    });
    
    chatServer.listen(CPORT, () => {
        console.log(`Chat Server Running on port ${CPORT}`)
    });
}