import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {Stack} from "aws-cdk-lib";
import {TodoApis} from "../lib/construct/todo-apis";
import {SchedulerAppStatefulStack} from "./scheduler-app-stateful-stack";
import {TodoCognito} from "../lib/construct/todo-cognito";


export interface TodoAppProps{
  todoAppStatefulStack: SchedulerAppStatefulStack
}

export class SchedulerAppStack extends Stack {

  public todoApis:TodoApis

  constructor(scope: Construct, id: string, todoAppProps: TodoAppProps,  props?: cdk.StackProps) {
    super(scope, id, props);
    this.todoApis = new TodoApis(this,id, {
      todoTable: todoAppProps.todoAppStatefulStack.todoTable,
      cognito: todoAppProps.todoAppStatefulStack.cognito
    })
  }


}
