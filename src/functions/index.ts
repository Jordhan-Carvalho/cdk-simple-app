import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from 'aws-lambda';
import { S3 } from 'aws-sdk';


// @ts-ignore
const bucketName = process.env.PHOTO_BUCKET_NAME!;
const s3 = new S3();

const generateUrl = async (object: S3.Object): Promise<{filename: string, url: string}> => {
  const url = await s3.getSignedUrlPromise('getObject', {
    Bucket: bucketName,
    Key: object.Key!,
    Expires: (24 *60 * 60)
  });

  return {
    filename: object.Key,
    url
  }
};
/**
 * @name getPhotos
 * @description Lambda description
 * continue desc
 * @param {Object} event -  Base event object of AWS Lambda
 * @param {Object} event.body - Content of the message
 * @param {string} event.body.name - Some const of number type
 * @command sam-beta-cdk local invoke SimpleAppStack/getPhotos -e test/mocks/getPhotos.json
 */
export const main = async (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyStructuredResultV2> => {
  
  try {
    const { Contents: results } = await s3.listObjects({
      Bucket: bucketName
    }).promise();

    const photos = await Promise.all(results.map(r => generateUrl(r)));
    return {
      statusCode: 200,
      body: JSON.stringify(photos),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: error.message
    }
  }
};
