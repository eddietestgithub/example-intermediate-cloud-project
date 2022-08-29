#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ClientCDKAppStack } from './user-project-cdk-stack';
import { readFileSync } from 'fs';
import { Tags } from 'aws-cdk-lib';

const { environment, applicationGroup } = { "environment":"testing", "applicationGroup":"aws-cdk-pipeline-prototype"}
const resourceGroup = `${environment}-${applicationGroup}-prototypeAttempt1-cdkapp`;
const stackId = `${resourceGroup}-userAppstack`;

//dev-userEvidenceApp-321-cdkapp-stack
//this should eventually probably just run as a lambda that does most of the functionality in the user-project build script
const app = new cdk.App();

Tags.of(app).add('environment', environment);
Tags.of(app).add('applicationGroup', applicationGroup);
Tags.of(app).add('resourceGroup', resourceGroup);
Tags.of(app).add('stackId', stackId);

new ClientCDKAppStack(app, stackId, {
  tags: {
    'environment': environment,
    'applicationGroup': applicationGroup,
    'resourceGroup': resourceGroup,
    'stackId': stackId,
  },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
