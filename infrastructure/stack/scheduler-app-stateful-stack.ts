import * as cdk from 'aws-cdk-lib';
import {CfnOutput, Fn, RemovalPolicy, Stack} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Bucket, HttpMethods} from "aws-cdk-lib/aws-s3";
import {Effect, PolicyStatement} from "aws-cdk-lib/aws-iam";
import {GenericDynamoTable} from "../lib/generic/GenericDynamoTable";
import {TodoCognito} from "../lib/construct/todo-cognito";
import {AttributeType} from "aws-cdk-lib/aws-dynamodb";


export class SchedulerAppStatefulStack extends Stack {
    public todoTable: GenericDynamoTable
    public todosPhotoBucket: Bucket
    public uploadTodoPhotosPolicy: PolicyStatement
    public cognito: TodoCognito
    private suffix: string;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        this.initializeSuffix()
        this.initializeTodosPhotosBucket()
        this.initializeTodosTable()
        this.initializeBucketPolicies()
        this.initializeCognito()
    }

    private initializeSuffix() {
        const shortStackId = Fn.select(2, Fn.split('/', this.stackId));
        const Suffix = Fn.select(4, Fn.split('-', shortStackId));
        this.suffix = Suffix;
    }

    private initializeTodosTable() {
        this.todoTable = new GenericDynamoTable(this, 'TodoDynamoDBTable', {
            tableName: 'Todo-' + this.suffix,
            primaryKey: 'id',
            keyType: AttributeType.STRING
        })
        this.todoTable.addSecondaryIndexes({
            indexName: 'userIdIndex',
            partitionKeyName: 'userId',
            keyType: AttributeType.STRING
        })
    }

    private initializeTodosPhotosBucket() {
        this.todosPhotoBucket = new Bucket(this, 'todo-photos', {
            removalPolicy: RemovalPolicy.DESTROY,
            bucketName: 'todo-photos-' + this.suffix,
            cors: [{
                allowedMethods: [
                    HttpMethods.HEAD,
                    HttpMethods.GET,
                    HttpMethods.PUT
                ],
                allowedOrigins: ['*'],
                allowedHeaders: ['*']
            }]
        });
        new CfnOutput(this, 'todo-photos-bucket-name', {
            value: this.todosPhotoBucket.bucketName
        })
    }

    private initializeBucketPolicies() {
        this.uploadTodoPhotosPolicy = new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                's3:PutObject',
                's3:PutObjectAcl'
            ],
            resources: [this.todosPhotoBucket.bucketArn + '/*']
        });
    }

    private initializeCognito() {
        this.cognito = new TodoCognito(this,'todoCognitoId', {
            suffixId: this.suffix
        })
        this.cognito.addToAuthenticatedRole(this.uploadTodoPhotosPolicy)
        this.cognito.addToAdminRole(this.uploadTodoPhotosPolicy)
    }

}
