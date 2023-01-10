import {
    Context,
    APIGatewayProxyResult,
    APIGatewayProxyEvent
} from 'aws-lambda';
import {SchedulerService} from "../service/SchedulerService";
import {getSub} from "../lib/utils";
const schedulerService = new SchedulerService({

})

export async function handler(event: APIGatewayProxyEvent, context: Context):
    Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': '*'
        },
        body: ''
    }
    const sub = getSub(event)
    const ruleList = await schedulerService.list()

    result.body = JSON.stringify(ruleList)
    return result
}
