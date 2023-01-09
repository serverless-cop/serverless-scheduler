#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SchedulerAppStack } from '../stack/scheduler-app-stack';
import { SchedulerAppStatefulStack } from "../stack/scheduler-app-stateful-stack";

const app = new cdk.App();

const statefulStack = new SchedulerAppStatefulStack(app, 'SchedulerStatefulStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }})
new SchedulerAppStack(app, 'SchedulerApiStack', {
    todoAppStatefulStack: statefulStack,
}, {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});
