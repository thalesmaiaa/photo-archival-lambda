import { handler } from '../src/index';
import { EventListener } from '../src/eventListener';
import { S3Event } from 'aws-lambda';

jest.mock('../src/eventListener', () => ({
  EventListener: jest.fn(),
}));

describe('handler function', () => {
  it('should listen S3 events', async () => {
    const mockEvent = {} as S3Event;
    const mockResult = { success: true };
    const mockListen = jest.fn().mockResolvedValue(mockResult);
    (EventListener as jest.Mock).mockImplementation(() => ({
      listen: mockListen,
    }));

    const result = await handler(mockEvent);
    expect(result).toEqual(mockResult);
  });
});
