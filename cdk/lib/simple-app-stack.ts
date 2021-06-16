import { Bucket, BucketEncryption } from '@aws-cdk/aws-s3';
import * as lambda from '@aws-cdk/aws-lambda-nodejs';
import * as cdk from '@aws-cdk/core';
import { Runtime } from '@aws-cdk/aws-lambda';
import * as path from 'path';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { CorsHttpMethod, HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { IPublicHostedZone } from '@aws-cdk/aws-route53';
import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import { S3BucketWithDeploy } from './s3-bucket-with-deploy';

interface SimpleAppStackProps extends cdk.StackProps{
  hostedZone: IPublicHostedZone,
  certificate: ICertificate,
}

export class SimpleAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: SimpleAppStackProps) {
    super(scope, id, props);

    const { myBucketSafado } = new S3BucketWithDeploy(this, 'MyCustomBUcket', {
      deployTo: ['..', '..', 'src', 'photos'],
      encryption: BucketEncryption.S3_MANAGED
    });

   
    new cdk.CfnOutput(this, 'BukcetRoloduNameExport', {
      value: myBucketSafado.bucketName,
      exportName: 'BukcetRoloduNameExport',
      description: 'BIRULEIBIS'
    });

    // UDEMY WAY
    // const bucketContainerPermissions = new PolicyStatement();
    // bucketContainerPermissions.addResources(myBucketSafado.bucketArn);
    // bucketContainerPermissions.addActions('s3:ListBucket')

    // const bucketPermissions = new PolicyStatement();
    // bucketPermissions.addResources(`${myBucketSafado.bucketArn}/*`)
    // bucketPermissions.addActions('s3:GetObject', 's3:PutObject');

    // getPhotosLambda.addToRolePolicy(bucketPermissions);
    // getPhotosLambda.addToRolePolicy(bucketContainerPermissions);
    
    const getPhotosLambda = new lambda.NodejsFunction(this, 'getPhotos', {
      // entry: '../../src/functions/index.ts', // accepts .js, .jsx, .ts and .tsx files
      entry: path.join(__dirname, '../', '../', 'src', 'functions', 'index.ts'), 
      handler: 'main', // defaults to 'handler',
      runtime: Runtime.NODEJS_14_X,
      environment: {
        PHOTO_BUCKET_NAME: myBucketSafado.bucketName
      }
    });

    getPhotosLambda.addToRolePolicy(new PolicyStatement({
      resources: [myBucketSafado.bucketArn],
      actions: ['s3:ListBucket', 's3:GetObject', 's3:PutObject'],
    }));

    const api = new HttpApi(this, 'testingHttpApi', {
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [CorsHttpMethod.GET]
      },
      apiName: 'photo-api',
      createDefaultStage: true
    });

    const lambdaIntegration = new LambdaProxyIntegration({
      handler: getPhotosLambda
    });

    api.addRoutes({
      path: '/getAllPhotos',
      methods: [
        HttpMethod.GET
      ],
      integration: lambdaIntegration
    })

    // defines an API Gateway Http API resource backed by our "dynamoLambda" function.
    // let api = new apigw.HttpApi(this, 'Endpoint', {
    //   defaultIntegration: new integrations.LambdaProxyIntegration({
    //     handler: dynamoLambda
    //   })
    // });
    
    new cdk.CfnOutput(this, 'HTTP API Url', {
      value: api.url ?? 'Something went wrong with the deploy',
      exportName: 'MyAPIEndpoint'
    });

  }
}
