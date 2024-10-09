import { consumerContainer } from "api/constants/variableConstant";


export const consumerMediaResume = async ({ serverConsumerId }:{serverConsumerId:string}) => {
    try {
        const consumer = consumerContainer.findConsumerId(serverConsumerId);              
               await consumer?.resume();
    } catch (error) {
        console.log('Error while resume media: ',(error as Error).message)
    }
}