export type FeatureProperties = {
  [key: string]: any;
};

export type Feature = {
  properties: FeatureProperties;
  [key: string]: any;
};

export type GeoJSONData = {
  features: Feature[];
  [key: string]: any;
};
