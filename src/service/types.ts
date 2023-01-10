export interface EventRuleGetParams {
    ruleName: string
    eventBusName?: string
}
// export interface EventRuleEntity {
//     ruleName: string
//     userId: string
//     name: string
//     description: string
//     deadline: string
// }
export interface EventRulePutParams {
    ScheduleExpression: string
    targetLambdaArn: string
    input: string
    roleArn: string
}

export type EventRuleDeleteParams = EventRuleGetParams
