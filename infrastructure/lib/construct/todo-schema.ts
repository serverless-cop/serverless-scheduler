import {JsonSchemaType} from "aws-cdk-lib/aws-apigateway";

export const createTodoSchema = {
    type: JsonSchemaType.OBJECT,
    required: ["description", "name", "deadline"],
    properties: {
        name: {
            type: JsonSchemaType.STRING
        },
        description: {
            type: JsonSchemaType.STRING
        },
        deadline: {
            type: JsonSchemaType.STRING
        },
    },
}

export const editTodoSchema = {
    type: JsonSchemaType.OBJECT,
    required: ["description", "name", "deadline", "id"],
    properties: {
        id: {
            type: JsonSchemaType.STRING
        },
        name: {
            type: JsonSchemaType.STRING
        },
        description: {
            type: JsonSchemaType.STRING
        },
        deadline: {
            type: JsonSchemaType.STRING
        },
    },
}
