import { ImageProcessor } from '../../src/rekognition';

jest.mock('@aws-sdk/client-rekognition', () => {
  const mockRekognition = {
    detectLabels: jest.fn(),
    detectFaces: jest.fn(),
  };

  return {
    Rekognition: jest.fn(() => mockRekognition),
  };
});

describe('ImageProcessor', () => {
  const mockRegion = 'us-east-1';
  const mockBucket = 'test-bucket';
  const mockKey = 'test-key';

  function createImageProcessor() {
    return new ImageProcessor({
      region: mockRegion,
      bucket: mockBucket,
      key: mockKey,
    });
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('extractImageMetadata', () => {
    it('should return formatted labels and faces when from Rekognition', async () => {
      const mockLabelsResponse = {
        Labels: [
          {
            Name: 'Person',
            Confidence: 99.9,
            Categories: [{ Name: 'Human' }],
          },
        ],
      };
      const mockFacesResponse = {
        FaceDetails: [
          {
            AgeRange: { Low: 20, High: 30 },
            Gender: { Value: 'Male' },
            Emotions: [{ Type: 'HAPPY', Confidence: 90 }],
            Beard: { Value: true },
            Mustache: { Value: false },
            Smile: { Value: true },
            Eyeglasses: { Value: false },
            EyesOpen: { Value: true },
            Sunglasses: { Value: false },
          },
        ],
      };

      const mockRekognition =
        require('@aws-sdk/client-rekognition').Rekognition();
      mockRekognition.detectLabels.mockResolvedValue(mockLabelsResponse);
      mockRekognition.detectFaces.mockResolvedValue(mockFacesResponse);

      const imageProcessor = createImageProcessor();
      const result = await imageProcessor.extractImageMetadata();

      const expectedResult = {
        labels: [
          {
            name: 'person',
            confidence: '99.90',
            categories: ['human'],
          },
        ],
        faces: [
          {
            ageRange: '20 - 30',
            gender: 'Male',
            dominantEmotion: 'happy',
            beard: true,
            mustache: false,
            smile: true,
            eyeglasses: false,
            eyesOpen: true,
            sunglasses: false,
            emotions: ['happy'],
          },
        ],
      };

      expect(result).toEqual(expectedResult);
    });

    it('should return undefined if an error occurs', async () => {
      const mockRekognition =
        require('@aws-sdk/client-rekognition').Rekognition();
      mockRekognition.detectLabels.mockRejectedValue(
        new Error('Error detecting labels'),
      );
      mockRekognition.detectFaces.mockResolvedValue({ FaceDetails: [] });

      const imageProcessor = createImageProcessor();
      const result = await imageProcessor.extractImageMetadata();

      expect(result).toBeUndefined();
      expect(mockRekognition.detectLabels).toHaveBeenCalled();
      expect(mockRekognition.detectFaces).toHaveBeenCalled();
    });
  });
});
