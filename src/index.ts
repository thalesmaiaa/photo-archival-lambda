import { S3Event } from 'aws-lambda';
import { EventListener } from './eventListener';

export async function handler(event: S3Event) {
  const eventListener = new EventListener();
  return await eventListener.listen(event);
}
