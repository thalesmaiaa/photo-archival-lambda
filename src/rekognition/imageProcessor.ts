import { FaceDetail, Label, Rekognition } from '@aws-sdk/client-rekognition';
import { CustomLabelInstance, RekognitionResponse } from './types';

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
      instances: label.Instances?.map((instance) => {
        return {
          boundingBox: {
            left: instance.BoundingBox?.Left,
            top: instance.BoundingBox?.Top,
            width: instance.BoundingBox?.Width,
            height: instance.BoundingBox?.Height,
          },
          confidence: instance.Confidence,
          dominantColors: instance.DominantColors?.map((color) => {
            return {
              red: color.Red,
              green: color.Green,
              blue: color.Blue,
              hexCode: color.HexCode,
              cssColor: color.CSSColor,
              simplifiedColor: color.SimplifiedColor,
              pixelPercentage: color.PixelPercent,
            };
          }) as CustomLabelInstance['dominantColors'],
        };
      }),
      parents: label.Parents?.map((parent) =>
        parent.Name?.toLocaleLowerCase(),
      ) as string[],
      categories: label.Categories?.map((category) =>
        category.Name?.toLocaleLowerCase(),
      ) as string[],
      aliases: label.Aliases?.map((alias) =>
        alias.Name?.toLocaleLowerCase(),
      ) as string[],
    }));
  }

  private formatProcessorMetadataFaces(
    faces?: FaceDetail[],
  ): RekognitionResponse['faces'] | undefined {
    return faces?.map((face) => {
      return {
        ageRange: {
          low: face.AgeRange?.Low,
          high: face.AgeRange?.High,
        },
        beard: face.Beard?.Value,
        confidence: face.Confidence,
        emotions: face.Emotions?.map((emotion) => {
          return {
            type: emotion.Type?.toLowerCase(),
            confidence: emotion.Confidence,
          };
        }),
        eyeglasses: face.Eyeglasses?.Value,
        eyesOpen: face.EyesOpen?.Value,
        faceOccluded: face.FaceOccluded?.Value,
        gender: face.Gender?.Value,
        mustache: face.Mustache?.Value,
        mouthOpen: face.MouthOpen?.Value,
        smile: face.Smile?.Value,
        sunglasses: face.Sunglasses?.Value,
      };
    });
  }
}
