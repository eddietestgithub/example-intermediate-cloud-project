import * as cdk from 'aws-cdk-lib';
import { DockerImageAsset, Platform } from 'aws-cdk-lib/aws-ecr-assets';
import * as apprunner from '@aws-cdk/aws-apprunner-alpha';
import { Tags } from 'aws-cdk-lib';

const CLIENT_APP_BUILD_DIR = './public/'; //TODO perhaps share constant with parent project
export class ClientCDKAppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const environment = props.tags?.['environment'] ?? 'unknown';
    const applicationGroup = props.tags?.['applicationGroup'] ?? 'unknown';
    const resourceGroup = props.tags?.['resourceGroup'] ?? 'unknown';

    const userProjectStagingDirectory = './build/image/';

    const imageAsset = new DockerImageAsset(this, `${id}-dockerImage`, {
      directory: userProjectStagingDirectory,
      buildArgs: {
        BUILD_RESOURCES_DIR: CLIENT_APP_BUILD_DIR /* this has to be relative to the Dockerfile */,
      },
      platform: Platform.LINUX_AMD64,
    });

    Tags.of(imageAsset).add('environment', environment);
    Tags.of(imageAsset).add('applicationGroup', applicationGroup);
    Tags.of(imageAsset).add('resourceGroup', resourceGroup);
    Tags.of(imageAsset).add('stackId', id);

    const appRunnerService = new apprunner.Service(this, `${id}-appRunner`, {
      serviceName: `${id}-appRunner`,
      source: apprunner.Source.fromAsset({
        imageConfiguration: { port: 80 },
        asset: imageAsset,
      }),
    });
    new cdk.CfnOutput(this, 'awsServiceId', { value: appRunnerService.serviceId });
    new cdk.CfnOutput(this, 'awsServiceName', { value: appRunnerService.serviceName });
    new cdk.CfnOutput(this, 'awsServiceArn', { value: appRunnerService.serviceArn });
    new cdk.CfnOutput(this, 'awsServiceUrl', { value: appRunnerService.serviceUrl });
    new cdk.CfnOutput(this, 'awsServiceStatus', { value: appRunnerService.serviceStatus });

    new cdk.CfnOutput(this, 'awsStackId', { value: this.stackId });
    new cdk.CfnOutput(this, 'awsStackName', { value: this.stackName });
  }
}
