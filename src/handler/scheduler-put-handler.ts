import {
    Context,
    APIGatewayProxyResult,
    APIGatewayProxyEvent
} from 'aws-lambda';
import {getEventBody} from "../lib/utils";
import {SchedulerService} from "../service/SchedulerService";
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
        body: 'Empty!'
    }
    try {
        const item = getEventBody(event)

        const rule = await schedulerService.put({
            ScheduleExpression: item.scheduleExpression,
            targetLambdaArn: item.functionArn,
            input: item.functionInput,
        })

        result.body = JSON.stringify(rule)
    } catch (error) {
        console.error(error)
        result.statusCode = 500
        result.body = error.message
    }
    return result
}
