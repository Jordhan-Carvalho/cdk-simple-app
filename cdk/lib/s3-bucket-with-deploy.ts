import * as cdk from '@aws-cdk/core';
import { Bucket, BucketEncryption, IBucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import * as path from 'path';

interface S3BucketWithDeployProps {
  deployTo: string[],
  encryption: BucketEncryption
}

export class S3BucketWithDeploy extends cdk.Construct {
  public readonly myBucketSafado: IBucket;
  constructor(scope: cdk.Construct, id: string, props:S3BucketWithDeployProps) {
    super(scope, id);

    this.myBucketSafado = new Bucket(this, 'BukcetRolodu', {
      encryption: props.encryption
    });

    // MANDAR PHOTOS DA PASTA PRO S3 BUCKET
    new BucketDeployment(this, 'MyPhotos', {
      sources: [
        Source.asset(path.join(__dirname, ...props.deployTo))
      ],
      destinationBucket: this.myBucketSafado,
      destinationKeyPrefix: 'carai/curui'
    });
  };

}
