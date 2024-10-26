import type { Feature } from "./types";

export function getTypologyText(typologie: string): string {
  const typologyMap: { [key: string]: string } = {
    ARCEAU_MOTO: "Motorbike",
    ARCEAU_VELO: "Bike",
    ARCEAU_VELO_CARGO: "Bike + Cargo",
  };
  return typologyMap[typologie] || "Unknown";
}

export function mapRackProperties(feature: Feature): Feature {
  const { typologie, nombre, ...rest } = feature.properties;
  return {
    ...feature,
    properties: {
      ...rest,
      rackTypology: getTypologyText(typologie),
      rackCount: nombre,
    },
  };
}

export function mapFountainProperties(feature: Feature): Feature {
  const { nom_fontaine, adresse, hivernage, date_dernier_controle, ...rest } =
    feature.properties;
  return {
    ...feature,
    properties: {
      ...rest,
      fountainName: nom_fontaine,
      fountainAddress: adresse,
      fountainInWinterization: hivernage,
      fountainLastControlDate: date_dernier_controle,
    },
  };
}

export function mapPublicToiletProperties(feature: Feature): Feature {
  const { type, handi, adresse, ...rest } = feature.properties;
  return {
    ...feature,
    properties: {
      ...rest,
      toiletType: type,
      accessibleForDisabled: handi.toLowerCase() === "oui",
      toiletAddress: adresse,
    },
  };
}

export function createRackPopupDescription(
  properties: any
): string {
  return `
    <strong>Rack Type</strong><br> 
    ${properties.rackTypology}<br><br>
    <strong>Racks Available</strong><br>
    ${properties.rackCount || "N/A"}
  `;
}

export function createFountainPopupDescription(properties: any): string {
  return `
    <strong>Fountain Name</strong><br>
    ${properties.fountainName || "N/A"}<br><br>
    <strong>Address</strong><br>
    ${properties.fountainAddress || "N/A"}<br><br>
    <strong>Winterization</strong><br>
    ${properties.fountainInWinterization ? "Yes" : "No"}<br><br>
    <strong>Last Control Date</strong><br>
    ${properties.fountainLastControlDate || "N/A"}
  `;
}

export function createPublicToiletPopupDescription(properties: any): string {
  return `
    <strong>Toilet Type</strong><br>
    ${properties.toiletType || "N/A"}<br><br>
    <strong>Address</strong><br>
    ${properties.toiletAddress || "N/A"}<br><br>
    <strong>Accessible for Disabled</strong><br>
    ${properties.accessibleForDisabled ? "Yes" : "No"}
  `;
}
