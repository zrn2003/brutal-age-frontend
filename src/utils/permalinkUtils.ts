/**
 * Short permalink generator for Brutal Age Account Listings.
 * Converts 24-character MongoDB IDs into clean 6-character short permalinks.
 * Example: '67b6f387a19c4d28e71b29a1' -> '/p/1b29a1'
 */
export const getShortProductCode = (id: string | undefined): string => {
  if (!id) return '';
  return id.length > 6 ? id.slice(-6) : id;
};

export const getShortProductUrl = (id: string | undefined): string => {
  const code = getShortProductCode(id);
  return `${window.location.origin}/p/${code}`;
};
