import { S3Event } from 'aws-lambda';
import { ImageProcessor, sendImageMetadata } from './rekognition';

export class EventListener {
  public async listen(event: S3Event) {
    event.Records.forEach(async (record) => {
      const bucket = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
      const region = record.awsRegion;
      const imageProcessor = new ImageProcessor({
        region,
        bucket,
        key,
      });

      const response = await imageProcessor.processImage();
      if (response) {
        await sendImageMetadata({
          metadata: response,
          objectKey: key,
        });
      }
    });
  }
}
