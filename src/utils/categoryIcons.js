import {
  Circuitry,
  Desktop,
  Cpu,
  HardDrives,
  Memory as RouterIcon,
  Monitor,
  Lightning
} from '@phosphor-icons/react';

// Category-specific hit components for different product types
export const getCategoryIcon = (categories) => {
  const category = categories?.[0]?.toLowerCase() || '';
  if (category.includes('computadora') || category.includes('laptop')) return Desktop;
  if (category.includes('procesador') || category.includes('cpu')) return Cpu;
  if (category.includes('almacenamiento') || category.includes('disco')) return HardDrives;
  if (category.includes('red') || category.includes('router')) return RouterIcon;
  if (category.includes('monitor') || category.includes('audio')) return Monitor;
  if (category.includes('fuente') || category.includes('energia')) return Lightning;
  return Circuitry;
}; 