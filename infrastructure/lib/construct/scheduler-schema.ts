import {JsonSchemaType} from "aws-cdk-lib/aws-apigateway";

export const putSchedulerSchema = {
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
