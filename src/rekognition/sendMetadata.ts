import { CustomRekognitionLabel } from './types';

type SendImageMetadata = {
  metadata: CustomRekognitionLabel[];
  objectKey: string;
};

const API_URL = process.env.API_URL;

export async function sendImageMetadata({
  metadata,
  objectKey,
}: SendImageMetadata) {
  const formattedKey = objectKey.replace(/\//g, '-').replace(/\./g, '-');
  await fetch(`${API_URL}/media/${formattedKey}/metadata`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });
}
