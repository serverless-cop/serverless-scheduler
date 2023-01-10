#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SchedulerAppStack } from '../stack/scheduler-app-stack';

const app = new cdk.App();

new SchedulerAppStack(app, 'SchedulerApiStack',{
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});
