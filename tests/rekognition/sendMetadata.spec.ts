import { sendImageMetadata } from '../../src/rekognition';
import { RekognitionResponse } from '../../src/rekognition/types';

describe('sendImageMetadata', () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch as unknown as typeof fetch;

  const API_URL = process.env.API_URL;

  const metadata: RekognitionResponse = {
    labels: [
      {
        name: 'Person',
        confidence: '99.9',
        categories: ['Human'],
      },
    ],
    faces: [
      {
        ageRange: '20 - 30',
      },
    ],
  };

  const objectKey = 'folder/image.jpg';

  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should call fetch with the correct URL and options', async () => {
    const formattedKey = 'folder-image-jpg';
    const expectedUrl = `${API_URL}/media/${formattedKey}/metadata`;

    mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));

    await sendImageMetadata({ metadata, objectKey });

    expect(mockFetch).toHaveBeenCalledWith(expectedUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });
  });

  it('should handle fetch errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(sendImageMetadata({ metadata, objectKey })).rejects.toThrow(
      'Network error',
    );
  });
});
