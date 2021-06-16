import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as SimpleApp from '../lib/simple-app-stack';
import '@aws-cdk/assert/jest';

test('My stack content', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new SimpleApp.SimpleAppStack(app, 'SimpleAppStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {
        "BukcetRolodu0228AE60": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketEncryption": {
              "ServerSideEncryptionConfiguration": [
                {
                  "ServerSideEncryptionByDefault": {
                    "SSEAlgorithm": "AES256"
                  }
                }
              ]
            }
          },
          "UpdateReplacePolicy": "Retain",
          "DeletionPolicy": "Retain"
        }
      },
      "Outputs": {
        "BukcetRoloduNameExport": {
          "Description": "BIRULEIBIS",
          "Value": {
            "Ref": "BukcetRolodu0228AE60"
          },
          "Export": {
            "Name": "BukcetRoloduNameExport"
          }
        }
      }
    }, MatchStyle.EXACT))
});

test('Stack created a S3 bucket', () => {
  // ARRANGE
  const app = new cdk.App();
  // ACT
  const stack = new SimpleApp.SimpleAppStack(app, 'SimpleAppStack');
  // ASSERT
  expect(stack).toHaveResource('AWS::S3::Bucket');
});