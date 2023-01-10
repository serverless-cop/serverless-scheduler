import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {Stack} from "aws-cdk-lib";
import {SchedulerApis} from "../lib/construct/scheduler-apis";


export class SchedulerAppStack extends Stack {

  public scheedulerApis:SchedulerApis

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.scheedulerApis = new SchedulerApis(this,id, {

    })
  }


}
