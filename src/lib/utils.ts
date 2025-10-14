import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLowStockLimit(unit: string, settings: any): number {
  if (!settings) return 10;
  
  const unitLower = unit.toLowerCase().trim();
  
  if (unitLower === 'kg' || unitLower === 'kgs') {
    return settings.lowStockLimitKg || 10;
  } else if (unitLower === 'liter' || unitLower === 'liters' || unitLower === 'l') {
    return settings.lowStockLimitLiters || 10;
  } else if (unitLower === 'pack' || unitLower === 'packs' || unitLower === 'packet' || unitLower === 'packets') {
    return settings.lowStockLimitPack || 10;
  } else if (unitLower === 'piece' || unitLower === 'pieces' || unitLower === 'pcs' || unitLower === 'pc') {
    return settings.lowStockLimitPieces || 10;
  } else {
    return settings.lowStockLimitDefault || 10;
  }
}

export function isLowStock(quantity: number, unit: string, settings: any): boolean {
  const limit = getLowStockLimit(unit, settings);
  return quantity < limit;
}
