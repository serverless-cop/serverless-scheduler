import {
    Context,
    APIGatewayProxyResult,
    APIGatewayProxyEvent
} from 'aws-lambda';
import {getEventBody, getSub} from "../lib/utils";
import {Env} from "../lib/env";
import {SchedulerService} from "../service/SchedulerService";
const functionArn = Env.get('FUNCTION_ARN')
const functionInput = Env.get('FUNCTION_INPUT')
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
            roleArn: item.roleArn
        })

        result.body = JSON.stringify(rule)
    } catch (error) {
        result.statusCode = 500
        result.body = error.message
    }
    return result
}
