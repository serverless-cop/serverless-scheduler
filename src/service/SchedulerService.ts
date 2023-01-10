
import { v4 as uuidv4 } from 'uuid'
import {EventRuleDeleteParams, EventRuleGetParams, EventRulePutParams} from "./types";
import EventBridge, {
    DeleteRuleRequest,
    DescribeRuleRequest,
    PutRuleRequest
} from "aws-sdk/clients/eventbridge";
import {Lambda} from "aws-sdk";



interface SchedulerServiceProps{

}

export class SchedulerService {

    private props: SchedulerServiceProps
    private eventBridge = new EventBridge()
    private lambda = new Lambda()

    public constructor(props: SchedulerServiceProps){
        this.props = props
    }

    async list(): Promise<any> {
        const response = await this.eventBridge.listRules().promise()
        if (!response) {
            return []
        }
        return response
    }

    async get(params: EventRuleGetParams): Promise<any> {
        const ruleParams: DescribeRuleRequest = {
            Name: params.ruleName,
            EventBusName: params.eventBusName
        }
        const response = await this.eventBridge.describeRule(ruleParams).promise()

        return response
    }

    async put(params: EventRulePutParams): Promise<any> {
        const ruleName = uuidv4()
        const ruleParams: PutRuleRequest = {
            Name: ruleName,
            ScheduleExpression: params.ScheduleExpression,
            State: 'ENABLED',
        }
        const rule = await this.eventBridge.putRule(ruleParams).promise()

        const permissionParams = {
            Action: 'lambda:InvokeFunction',
            FunctionName: params.targetLambdaArn,
            Principal: 'events.amazonaws.com',
            StatementId: ruleName+'-access-statement',
            SourceArn: rule.RuleArn,
        };
        await this.lambda.addPermission(permissionParams).promise();

        const targetParams = {
            Rule: ruleName,
            Targets: [
                {
                    Arn: params.targetLambdaArn,
                    Id: ruleName + '-target',
                    Input: params.input,
                }
            ]
        }
        const target = await this.eventBridge.putTargets(targetParams).promise()

        return {
            RuleResponse: rule,
            TargetResponse: target
        }
    }

    async delete(params: EventRuleDeleteParams): Promise<any> {
        try{
            const ruleParams: DeleteRuleRequest = {
                Name: params.ruleName,
                // EventBusName: params.eventBusName
            }
            console.log(ruleParams)
            const response = await this.eventBridge.deleteRule(ruleParams)
            return response
        } catch(error){
            throw error
        }
    }

}
