import { FaceDetail, Label, Rekognition } from '@aws-sdk/client-rekognition';
import { RekognitionResponse } from './types';

type ImageProcessorProps = {
  region: string;
  bucket: string;
  key: string;
};

export class ImageProcessor {
  private key: string;
  private region: string;
  private bucket: string;
  private rekognition: Rekognition;

  constructor({ region, bucket, key }: ImageProcessorProps) {
    this.region = region;
    this.bucket = bucket;
    this.key = key;
    this.rekognition = this.createRekognitionClient();
  }

  public async processImage(): Promise<RekognitionResponse | undefined> {
    const [labelsResponse, facesResponse] = await Promise.all([
      this.detectLabels(),
      this.detectFaces(),
    ]);

    try {
      return {
        labels: this.formatProcessorMetadataLabels(labelsResponse.Labels),
        faces: this.formatProcessorMetadataFaces(facesResponse.FaceDetails),
      };
    } catch (error) {}
  }

  private createRekognitionClient() {
    return new Rekognition({ region: this.region });
  }

  private async detectLabels() {
    return await this.rekognition.detectLabels({
      Image: {
        S3Object: {
          Bucket: this.bucket,
          Name: this.key,
        },
      },
      MaxLabels: 10,
      MinConfidence: 80,
    });
  }
  private async detectFaces() {
    return await this.rekognition.detectFaces({
      Image: {
        S3Object: {
          Bucket: this.bucket,
          Name: this.key,
        },
      },
      Attributes: ['ALL'],
    });
  }

  private formatProcessorMetadataLabels(
    labels?: Label[],
  ): RekognitionResponse['labels'] | undefined {
    return labels?.map((label) => ({
      name: label.Name?.toLowerCase(),
      confidence: label.Confidence,
      categories: label.Categories?.map((category) =>
        category.Name?.toLocaleLowerCase().split(' ').join('_'),
      ) as string[],
    }));
  }

  private formatProcessorMetadataFaces(
    faces?: FaceDetail[],
  ): RekognitionResponse['faces'] | undefined {
    return faces?.map((face) => {
      return {
        ageRange: `${face.AgeRange?.Low} - ${face.AgeRange?.High}`,
        gender: face.Gender?.Value,
        dominantEmotion: face.Emotions?.sort(
          (a, b) => (b.Confidence || 0) - (a?.Confidence || 0),
        )[0].Type?.toLowerCase(),
        beard: face.Beard?.Value,
        mustache: face.Mustache?.Value,
        smile: face.Smile?.Value,
        eyeglasses: face.Eyeglasses?.Value,
        eyesOpen: face.EyesOpen?.Value,
        sunglasses: face.Sunglasses?.Value,
        emotions: face.Emotions?.filter(
          (emotion) => emotion.Confidence && emotion.Confidence > 5,
        )
          .map((emotion) => emotion.Type?.toLowerCase())
          .filter(Boolean) as string[],
      };
    });
  }
}
