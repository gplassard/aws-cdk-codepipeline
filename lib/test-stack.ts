import cdk = require("@aws-cdk/cdk");
import codebuild = require("@aws-cdk/aws-codebuild");
import CodeBuildGithubWebhook = require('./custom/codebuild-github-webhook');

export class TestStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    // The code that defines your stack goes here

    const token = new cdk.SecretParameter(this, "GithubOAuthSecret", {
      ssmParameter: "github-gplassard-oauth"
    }).value;

    const source = new codebuild.GitHubSource({
      owner: "gplassard",
      repo: "aws-cdk-codepipeline",
      oauthToken: token,
      reportBuildStatus: true
    });

    const codebuildProject = new codebuild.Project(this, "MyProject", {
      projectName: name,
      badge: true,
      source: source,
      buildSpec: 'test-buildspec.yml'
    });

    const webhook = new CodeBuildGithubWebhook.CodeBuildGithubWebhook(this, 'Webhook', {
      CodebuildProjectName: codebuildProject.projectName,
      GithubOAuth: token,
      Payload: {
        events: ['pull_request']
      }
    });

    webhook.dependsOnCodebuildProject(codebuildProject);

  }
}
