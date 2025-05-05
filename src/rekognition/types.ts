export type RekognitionResponse = {
  labels?: {
    name?: string;
    confidence?: number;
    instances?: CustomLabelInstance[];
    parents?: string[];
    categories?: string[];
    aliases?: string[];
  }[];
  faces?: {
    ageRange?: {
      low?: number;
      high?: number;
    };
    beard?: boolean;
    confidence?: number;
    emotions?: {
      type?: string;
      confidence?: number;
    }[];
    eyeglasses?: boolean;
    eyesOpen?: boolean;
    faceOccluded?: boolean;
    gender?: string;
    mustache?: boolean;
    mouthOpen?: boolean;
    smile?: boolean;
    sunglasses?: boolean;
  }[];
};

export type CustomLabelInstance = {
  confidence?: number;
  boundingBox?: {
    left?: number;
    top?: number;
    width?: number;
    height?: number;
  };
  dominantColors: {
    red?: number;
    green?: number;
    blue?: number;
    hexCode?: string;
    cssColor?: string;
    simplifiedColor?: string;
    pixelPercentage?: number;
  }[];
};
