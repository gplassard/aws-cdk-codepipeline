import cdk = require("@aws-cdk/cdk");
import codebuild = require("@aws-cdk/aws-codebuild");
import codepipeline = require("@aws-cdk/aws-codepipeline");

export class DeployStack extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props: cdk.StackProps, env: 'dev' | 'rec' | 'prod') {
        super(parent, name, props);

        // The code that defines your stack goes here

        const project = new codebuild.PipelineProject(this, "MyProject", {
            projectName: name,
            buildSpec: 'deploy-buildspec.yml',
            environmentVariables: {
                ENV: {value: env}
            }
        });

        const pipeline = new codepipeline.Pipeline(this, "MyPipeline", {
            pipelineName: name
        });

        const source = pipeline.addStage("Source");
        new codepipeline.GitHubSourceAction(this, "GithubSource", {
            stage: source,
            owner: "gplassard",
            repo: "aws-cdk-codepipeline",
            branch: env,
            oauthToken: new cdk.SecretParameter(this, "GithubOAuthSecret", {
                ssmParameter: "github-gplassard-oauth"
            }).value
        });

        const build = pipeline.addStage("Build");
        new codebuild.PipelineBuildAction(this, "PipelineBuild", {
            stage: build,
            project: project
        });
    }
}
