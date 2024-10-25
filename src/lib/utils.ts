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

export function createPopupDescription(
  rackTypology: string,
  rackCount: number
): string {
  return `
    <strong>Rack Type</strong><br> 
    ${rackTypology}<br><br>
    <strong>Racks Available</strong><br>
    ${rackCount || "N/A"}
  `;
}
