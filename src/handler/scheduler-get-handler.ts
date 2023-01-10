import {
    Context,
    APIGatewayProxyResult,
    APIGatewayProxyEvent
} from 'aws-lambda';
import {SchedulerService} from "../service/SchedulerService";
import {getPathParameter, getSub} from "../lib/utils";
const schedulerService = new SchedulerService({})

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
    const id = getPathParameter(event, 'id')

    const rule = await schedulerService.get({
        ruleName: id
    })

    result.body = JSON.stringify(rule)
    return result
}
