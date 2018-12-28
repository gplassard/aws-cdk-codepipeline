import cdk = require("@aws-cdk/cdk");
import codebuild = require("@aws-cdk/aws-codebuild");
import codepipeline = require("@aws-cdk/aws-codepipeline");

export class HelloCdkStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    // The code that defines your stack goes here

    const project = new codebuild.PipelineProject(this, "MyProject", {
      projectName: "MyProject"
    });

    const pipeline = new codepipeline.Pipeline(this, "MyPipeline", {
      pipelineName: "MyPipeline"
    });

    const source = pipeline.addStage("Source");
    new codepipeline.GitHubSourceAction(this, "GithubSource", {
      stage: source,
      owner: "gplassard",
      repo: "aws-cdk-codepipeline",
      branch: "master",
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
