
import { v4 as uuidv4 } from 'uuid'
import {EventRuleDeleteParams, EventRuleGetParams, EventRulePutParams} from "./types";
import EventBridge, {
    DeleteRuleRequest,
    DescribeRuleRequest,
    PutRuleRequest,
    RuleName
} from "aws-sdk/clients/eventbridge";



interface SchedulerServiceProps{

}

export class SchedulerService {

    private props: SchedulerServiceProps
    private eventBridge = new EventBridge()

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
            RoleArn: params.roleArn,
            State: 'ENABLED',
        }
        const rule = await this.eventBridge.putRule(ruleParams).promise()
        const targetParams = {
            Rule: ruleName,
            Targets: [
                {
                    Arn: params.targetLambdaArn,
                    Id: ruleName + '-target',
                }
            ]
        }
        const target = await this.eventBridge.putTargets(targetParams).promise()

        // const permissionParams = {
        //     Action: 'lambda:InvokeFunction',
        //     FunctionName: 'LambdaB',
        //     Principal: 'events.amazonaws.com',
        //     StatementId: ruleName,
        //     SourceArn: rule.RuleArn,
        // };
        //
        // await Lambda.addPermission(permissionParams).promise();

        return {
            RuleResponse: rule,
            TargetResponse: target
        }
    }

    async delete(params: EventRuleDeleteParams): Promise<any> {
        const ruleParams: DeleteRuleRequest = {
            Name: params.ruleName,
            EventBusName: params.eventBusName
        }
        const response = await this.eventBridge.deleteRule(ruleParams)
        return response
    }

}
