import {
    AuthorizationType,
    CognitoUserPoolsAuthorizer,
    JsonSchema,
    LambdaIntegration,
    Model,
    RequestValidator,
    RestApi,
    DomainName, BasePathMapping, Cors,
} from "aws-cdk-lib/aws-apigateway";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {join} from "path";
import config from "../../config/config";
import * as cdk from "aws-cdk-lib";
import {Construct} from "constructs";
import {Resource} from "aws-cdk-lib/aws-apigateway/lib/resource";
import {UserPool} from "aws-cdk-lib/aws-cognito";
import {Authorizer} from "aws-cdk-lib/aws-apigateway/lib/authorizer";
import {Certificate} from "aws-cdk-lib/aws-certificatemanager";
import {ARecord, HostedZone, RecordTarget} from "aws-cdk-lib/aws-route53";
import {ApiGateway} from "aws-cdk-lib/aws-route53-targets";
import {aws_apigateway} from "aws-cdk-lib";

export interface Methodprops {
    functionName: string
    handlerName: string
    verb: string
    resource: Resource
    environment: any
    bodySchema?: JsonSchema
    validateRequestBody: boolean
    authorizationType?: AuthorizationType
    authorizer?: Authorizer
}

export interface AuthorizerProps {
    id: string
    authorizerName: string
    identitySource: string
    userPoolArn: string
}

export abstract class GenericApi extends Construct {
    public lambdaIntegration: LambdaIntegration;
    protected api: RestApi
    protected functions = new Map<string,NodejsFunction>()
    protected model: Model
    protected requestValidator: RequestValidator
    // private docs: GenerateOpenApiSpecProps

    protected constructor(scope: Construct, id: string, props?: cdk.StackProps){
        super(scope, id);
        this.api = new RestApi(this, id, {
            restApiName:'schedulerApi',
            deployOptions: {
                stageName: 'prod'
            },
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS // this is also the default
            }})
    }

    protected initializeDomainName(props: any){

        const domainName = aws_apigateway.DomainName.fromDomainNameAttributes(
            this, 'domainNameId', {
                domainName: [props.subdomain, props.rootDomain].join('.'),
                domainNameAliasHostedZoneId: "",
                domainNameAliasTarget: ""
            })

        // const domainName = DomainName.fromDomainNameAttributes(this,
        //     `${envName}-${appName}-${YOUR_DOMAIN_NAME}`, {
        //         domainName: `${YOUR_DOMAIN_NAME}`,
        //         domainNameAliasTarget: `${domainNameAliasTarget}`,       // GET from Route 53- I would prefer having this property as optional
        //         domainNameAliasHostedZoneId: `${domainNameAliasHostedZoneId}` // GET from Route 53- I would prefer having this property as optional
        //     });

        //Used in custom domain
        const pathMapping = new BasePathMapping(this,
            'scheduler-mapping-id', {
                basePath: 'scheduler',
                domainName: domainName,
                restApi: this.api
            });

        // this.api.root.addMethod('ANY');
    }

    protected addMethod(props: Methodprops): NodejsFunction{
        const apiId = config.account + '-' + config.env + '-' + props.functionName
        let options: any = {}

        if(props.authorizationType && props.authorizer){
            options.authorizationType = props.authorizationType
            options.authorizer = {
                authorizerId: props.authorizer.authorizerId
            }
        }

        if(props.validateRequestBody && props.bodySchema){
            this.model = new Model(this, apiId + '-model-validator',
                {
                restApi: this.api,
                contentType: "application/json",
                description: "To validate the request body",
                schema: props.bodySchema
            })
            this.requestValidator = new RequestValidator(this, apiId + '-body-validator',
                {
                restApi: this.api,
                validateRequestBody: props.validateRequestBody,
            })
            options.requestValidator = this.requestValidator
            options.requestModels = {
                "application/json": this.model,
            }
        }

        const lambda = new NodejsFunction(this, apiId, {
            entry: join(__dirname, '..', '..', '..','src', 'handler', props.handlerName),
            handler: 'handler',
            functionName: apiId,
            environment: props.environment
        })
        this.functions.set(apiId,lambda)
        this.lambdaIntegration = new LambdaIntegration(lambda)
        props.resource.addMethod(props.verb, this.lambdaIntegration, options)
        return lambda;
    }

    public generateDocs(){
        // TODO
    }

}
