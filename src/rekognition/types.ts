export type CustomRekognitionLabel = {
  name?: string;
  confidence?: number;
  instances?: CustomLabelInstance[];
  parents?: string[];
  categories?: string[];
  aliases?: string[];
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
