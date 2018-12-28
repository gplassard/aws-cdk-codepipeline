#!/usr/bin/env node
import cdk = require('@aws-cdk/cdk');
import { TestStack } from '../lib/test-stack';
import { DeployStack } from '../lib/deploy-stack';

const app = new cdk.App();
new TestStack(app, 'TestStack', {env: {region: 'eu-west-1'}});
new DeployStack(app, 'DeployStack-dev', {env: {region: 'eu-west-1'}}, 'dev');
new DeployStack(app, 'DeployStack-rec', {env: {region: 'eu-west-1'}}, 'rec');
new DeployStack(app, 'DeployStack-prod', {env: {region: 'eu-west-1'}}, 'prod');
app.run();
