import {
  DetectLabelsCommand,
  Label,
  RekognitionClient,
} from '@aws-sdk/client-rekognition';
import { CustomLabelInstance, CustomRekognitionLabel } from './types';

export class ImageProcessor {
  private region: string;
  private bucket: string;
  private key: string;

  constructor({
    region,
    bucket,
    key,
  }: {
    region: string;
    bucket: string;
    key: string;
  }) {
    this.region = region;
    this.bucket = bucket;
    this.key = key;
  }

  public async processImage(): Promise<CustomRekognitionLabel[] | undefined> {
    const rekognition = this.createRekognitionClient();
    const command = this.createDetectLabelsCommand();

    try {
      const response = await rekognition.send(command);
      return this.formatProcessorMetadataLabels(response.Labels);
    } catch (error) {
      console.error('Rekognition failed:', error);
      throw error;
    }
  }

  private createRekognitionClient(): RekognitionClient {
    return new RekognitionClient({ region: this.region });
  }

  private createDetectLabelsCommand(): DetectLabelsCommand {
    return new DetectLabelsCommand({
      Image: {
        S3Object: {
          Bucket: this.bucket,
          Name: this.key,
        },
      },
      MaxLabels: 10,
      MinConfidence: 80,
    });
    // return new DetectFacesCommand({
    //   Image: {
    //     S3Object: {
    //       Bucket: this.bucket,
    //       Name: this.key,
    //     },
    //   },
    //   Attributes: ['ALL'],
    // });
  }

  private formatProcessorMetadataLabels(
    labels?: Label[],
  ): CustomRekognitionLabel[] | undefined {
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
}
