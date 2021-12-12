export const getAvantageItems = (baseData) =>
  baseData.items.filter((item) => item.type === "avantage");
export const getDesavantageItem = (baseData) =>
  baseData.items.filter((item) => item.type === "desavantage");
export const getDonItem = (baseData) =>
  baseData.items.filter((item) => item.type === "don");
export const getTechniqueItem = (baseData) =>
  baseData.items.filter((item) => item.type === "technique");

export const getObjetItem = (baseData) =>
  baseData.items.filter((item) => item.type === "objet");
export const getArmeItem = (baseData) =>
  baseData.items.filter((item) => item.type === "arme");
export const getArmureItem = (baseData) =>
  baseData.items.filter((item) => item.type === "armure");

export const getSortilegeItem = (baseData) =>
  baseData.items.filter((item) => item.type === "sortilege");