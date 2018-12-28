import cdk = require("@aws-cdk/cdk");
import codebuild = require("@aws-cdk/aws-codebuild");

export class TestStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    // The code that defines your stack goes here

    const source = new codebuild.GitHubSource({
      owner: "gplassard",
      repo: "aws-cdk-codepipeline",
      oauthToken: new cdk.SecretParameter(this, "GithubOAuthSecret", {
        ssmParameter: "github-gplassard-oauth"
      }).value,
      reportBuildStatus: true,
      webhook: true
    });

    new codebuild.Project(this, "MyProject", {
      projectName: name,
      badge: true,
      source: source,
      buildSpec: 'test-buildspec.yml'
    });
  }
}
