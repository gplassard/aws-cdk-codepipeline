import cdk = require('@aws-cdk/cdk');
import cfn = require('@aws-cdk/aws-cloudformation');
import codebuild = require('@aws-cdk/aws-codebuild');
import lambda = require('@aws-cdk/aws-lambda');

export interface WebhookConfig {
    events: string[]
}

export interface CodeBuildGithubWebhookProps {
    CodebuildProjectName: string
    GithubOAuth: cdk.Secret
    Payload: WebhookConfig
}

export class CodeBuildGithubWebhook extends cfn.CustomResource {

    constructor(parent: cdk.Construct, name: string, props: CodeBuildGithubWebhookProps) {
        super(parent, name, {
            resourceType: 'Custom::CodebuildGithubWebhook',
            lambdaProvider: lambda.FunctionRef.import(parent, 'Lambda', {
                functionArn: 'arn:aws:lambda:eu-west-1:147597503572:function:cfn-github-webhook-dev-githubWebhook'
            }),
            properties: props
        });
    }

    dependsOnCodebuildProject(project: codebuild.Project) {
        this.addDependency(project.findChild('Resource') as cdk.Resource);
    }

}
