import {
  Circuitry,
  Desktop,
  Cpu,
  HardDrives,
  Memory as RouterIcon,
  Monitor
} from '@phosphor-icons/react';

// Categories data for megamenu
export const categories = [
  {
    id: 'computadoras',
    name: 'Computadoras',
    icon: Desktop,
    subcategories: [
      'Laptops',
      'Desktops',
      'Workstations',
      'Servidores'
    ]
  },
  {
    id: 'componentes',
    name: 'Componentes',
    icon: Cpu,
    subcategories: [
      'Procesadores',
      'Memoria RAM',
      'Tarjetas Gráficas',
      'Motherboards'
    ]
  },
  {
    id: 'almacenamiento',
    name: 'Almacenamiento',
    icon: HardDrives,
    subcategories: [
      'Discos SSD',
      'Discos HDD',
      'NAS',
      'Servidores de Almacenamiento'
    ]
  },
  {
    id: 'redes',
    name: 'Redes',
    icon: RouterIcon,
    subcategories: [
      'Routers',
      'Switches',
      'Access Points',
      'Cables de Red'
    ]
  },
  {
    id: 'perifericos',
    name: 'Periféricos',
    icon: Monitor,
    subcategories: [
      'Monitores',
      'Teclados',
      'Ratones',
      'Impresoras'
    ]
  }
]; 