import { S3Event } from 'aws-lambda';
import { ImageProcessor, sendImageMetadata } from './rekognition';

export class EventListener {
  public async listen(event: S3Event) {
    await Promise.all(
      event.Records.map(async ({ awsRegion, s3 }) => {
        const bucket = s3.bucket.name;
        const key = decodeURIComponent(s3.object.key.replace(/\+/g, ' '));
        const imageProcessor = new ImageProcessor({
          region: awsRegion,
          bucket,
          key,
        });

        const metadata = await imageProcessor.extractImageMetadata();
        if (metadata) {
          await sendImageMetadata({
            metadata,
            objectKey: key,
          });
        }
      }),
    );
  }
}
