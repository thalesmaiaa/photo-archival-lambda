export type RekognitionResponse = {
  labels?: {
    name?: string;
    confidence?: string;
    categories?: string[];
  }[];
  faces?: {
    ageRange?: string;
    beard?: boolean;
    mustache?: boolean;
    dominantEmotion?: string;
    gender?: string;
    smile?: boolean;
    emotions?: string[];
    eyeglasses?: boolean;
    eyesOpen?: boolean;
    sunglasses?: boolean;
  }[];
};
