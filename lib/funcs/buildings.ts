const buildingNameMap = {
  'samia academic center': 'Samia',
  'sargent hall': 'Sargent',
  '73 tremont': 'Stahl',
};

export const simplifyBuildingName = (buildingName: string): string => {
  const [base, ...roomParts] = buildingName.split(/ *room */i);
  const baseKey = base.trim().toLowerCase();
  const simplifiedBase = buildingNameMap[baseKey as keyof typeof buildingNameMap] || base.trim();

  if (roomParts.length > 0 && roomParts[0].trim()) {
    return `${simplifiedBase} Room ${roomParts.join(' ').trim()}`;
  }
  return simplifiedBase;
};

export const stripRoom = (buildingName: string): string => {
  return buildingName.split(/ *room */i)[0].trim();
};
