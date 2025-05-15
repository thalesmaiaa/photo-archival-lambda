import { S3Event } from 'aws-lambda';
import { EventListener } from '../src/eventListener';
import { ImageProcessor, sendImageMetadata } from '../src/rekognition';

jest.mock('../src/rekognition', () => ({
  ImageProcessor: jest.fn(),
  sendImageMetadata: jest.fn(),
}));

describe('EventListener', () => {
  let eventListener: EventListener;

  beforeEach(() => {
    eventListener = new EventListener();
    jest.clearAllMocks();
  });

  it('should process S3 event records and send image metadata', async () => {
    const mockEvent: S3Event = {
      Records: [
        {
          awsRegion: 'us-east-1',
          s3: {
            bucket: { name: 'test-bucket' },
            object: { key: 'test-key' },
          },
        },
      ],
    } as unknown as S3Event;

    const mockExtractImageMetadata = jest
      .fn()
      .mockResolvedValue({ width: 100, height: 200 });
    (ImageProcessor as jest.Mock).mockImplementation(() => ({
      extractImageMetadata: mockExtractImageMetadata,
    }));

    const mockSendImageMetadata = sendImageMetadata as jest.Mock;

    await eventListener.listen(mockEvent);

    expect(ImageProcessor).toHaveBeenCalledWith({
      region: 'us-east-1',
      bucket: 'test-bucket',
      key: 'test-key',
    });
    expect(mockExtractImageMetadata).toHaveBeenCalled();
    expect(mockSendImageMetadata).toHaveBeenCalledWith({
      metadata: { width: 100, height: 200 },
      objectKey: 'test-key',
    });
  });

  it('should not send metadata if extraction fails', async () => {
    const mockEvent: S3Event = {
      Records: [
        {
          awsRegion: 'us-east-1',
          s3: {
            bucket: { name: 'test-bucket' },
            object: { key: 'test-key' },
          },
        },
      ],
    } as unknown as S3Event;

    const mockExtractImageMetadata = jest.fn().mockResolvedValue(null);
    (ImageProcessor as jest.Mock).mockImplementation(() => ({
      extractImageMetadata: mockExtractImageMetadata,
    }));

    const mockSendImageMetadata = sendImageMetadata as jest.Mock;

    await eventListener.listen(mockEvent);

    expect(ImageProcessor).toHaveBeenCalledWith({
      region: 'us-east-1',
      bucket: 'test-bucket',
      key: 'test-key',
    });
    expect(mockExtractImageMetadata).toHaveBeenCalled();
    expect(mockSendImageMetadata).not.toHaveBeenCalled();
  });
});
