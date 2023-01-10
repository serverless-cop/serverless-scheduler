import {Construct} from "constructs";
import {AuthorizerProps, GenericApi} from "../generic/GenericApi";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import { putSchedulerSchema } from "./scheduler-schema";
import {CognitoUserPoolsAuthorizer} from "aws-cdk-lib/aws-apigateway";
import {AuthorizationType} from "@aws-cdk/aws-apigateway";
import config from "../../config/config";
import {UserPool} from "aws-cdk-lib/aws-cognito";
import {CfnEventBusPolicy, EventBus} from "aws-cdk-lib/aws-events";


export interface SchedulerApiProps {

}

export class SchedulerApis extends GenericApi {
    private listApi: NodejsFunction
    private getApi: NodejsFunction
    private putApi: NodejsFunction
    private deleteApi: NodejsFunction

    public constructor(scope: Construct, id: string, props: SchedulerApiProps) {
        super(scope, id)
        this.initializeApis(props);
        this.initializeDomainName({
            certificateArn: config.apiDomainCertificateArn,
            subdomain: config.subdomain,
            domainNameId: 'domainNameId',
            rootDomain: config.rootDomain,
            ARecordId: 'ARecordId'
        })
    }

    private initializeApis(props: SchedulerApiProps){
        // const authorizer = this.createAuthorizer({
        //     id: 'schedulerUserAuthorizerId',
        //     authorizerName: 'schedulerUserAuthorizer',
        //     identitySource: 'method.request.header.Authorization',
        //     userPoolArn: config.userPoolArn
        // })

        const schedulesApiResource = this.api.root.addResource('schedules')
        const schedulesIdResource = schedulesApiResource.addResource('{id}')

        this.listApi = this.addMethod({
            functionName: 'scheduler-list',
            handlerName: 'scheduler-list-handler.ts',
            verb: 'GET',
            resource: schedulesApiResource,
            environment: {

            },
            validateRequestBody: false,
            authorizationType: AuthorizationType.COGNITO,
            // authorizer: authorizer
        })

        this.getApi = this.addMethod({
            functionName: 'scheduler-get',
            handlerName: 'scheduler-get-handler.ts',
            verb: 'GET',
            resource: schedulesIdResource,
            environment: {

            },
            validateRequestBody: false,
            authorizationType: AuthorizationType.COGNITO,
            // authorizer: authorizer
        })

        this.putApi = this.addMethod({
            functionName: 'scheduler-post',
            handlerName: 'scheduler-put-handler.ts',
            verb: 'POST',
            resource: schedulesApiResource,
            environment: {
                FUNCTION_ARN: config.toRunFunctionArn,
                FUNCTION_INPUT: config.toRunFunctionInput
            },
            validateRequestBody: true,
            bodySchema: putSchedulerSchema,
            authorizationType: AuthorizationType.COGNITO,
            // authorizer: authorizer
        })

        this.deleteApi = this.addMethod({
            functionName: 'scheduler-delete',
            handlerName: 'scheduler-delete-handler.ts',
            verb: 'DELETE',
            resource: schedulesIdResource,
            environment: {

            },
            validateRequestBody: false,
            authorizationType: AuthorizationType.COGNITO,
            // authorizer: authorizer
        })

        // const bus = EventBus.fromEventBusName(this, 'defaultEB', 'default')

        // this.listApi.addPermission("eventBridgePermissionId", {
        //     principal: '',
        // })
    }

    protected createAuthorizer(props: AuthorizerProps): CognitoUserPoolsAuthorizer{
        const userPool = UserPool.fromUserPoolArn(this,'userPoolId', props.userPoolArn)
        const authorizer = new CognitoUserPoolsAuthorizer(
            this,
            props.id,
            {
                cognitoUserPools: [userPool],
                authorizerName: props.authorizerName,
                identitySource: props.identitySource
            });
        authorizer._attachToApi(this.api)
        return authorizer
    }

}
