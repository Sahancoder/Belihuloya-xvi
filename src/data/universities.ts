import { University } from '../types/university';

export const UNIVERSITIES: University[] = [
  {
    id: 'susl',
    code: 'SUSL',
    name: 'Sabaragamuwa University of Sri Lanka',
    shortName: 'Sabaragamuwa',
    logoPath: '/universities/sabara-removebg-preview.png',
    primaryColor: '#800000',
    secondaryColor: '#FFD700',
  },
  {
    id: 'uoc',
    code: 'UOC',
    name: 'University of Colombo',
    shortName: 'Colombo',
    logoPath: '/universities/colombo.png',
    primaryColor: '#800000',
    secondaryColor: '#FFD700',
  },
  {
    id: 'uop',
    code: 'UOP',
    name: 'University of Peradeniya',
    shortName: 'Peradeniya',
    logoPath: '/universities/pera.webp',
    primaryColor: '#002147',
    secondaryColor: '#DAA520',
  },
  {
    id: 'usj',
    code: 'USJ',
    name: 'University of Sri Jayewardenepura',
    shortName: 'Sri Jayewardenepura',
    logoPath: '/universities/japura.png',
    primaryColor: '#004225',
    secondaryColor: '#FFD700',
  },
  {
    id: 'uok',
    code: 'UOK',
    name: 'University of Kelaniya',
    shortName: 'Kelaniya',
    logoPath: '/universities/Kelaniya.png',
    primaryColor: '#800020',
    secondaryColor: '#FFD700',
  },
  {
    id: 'uom',
    code: 'UOM',
    name: 'University of Moratuwa',
    shortName: 'Moratuwa',
    logoPath: '/universities/moratuwa.png',
    primaryColor: '#002B49',
    secondaryColor: '#C0C0C0',
  },
  {
    id: 'uoj',
    code: 'UOJ',
    name: 'University of Jaffna',
    shortName: 'Jaffna',
    logoPath: '/universities/jaffna.png',
    primaryColor: '#651C32',
    secondaryColor: '#E6A100',
  },
  {
    id: 'uor',
    code: 'UOR',
    name: 'University of Ruhuna',
    shortName: 'Ruhuna',
    logoPath: '/universities/uor.svg',
    primaryColor: '#003366',
    secondaryColor: '#FFD700',
  },
  {
    id: 'eusl',
    code: 'EUSL',
    name: 'Eastern University, Sri Lanka',
    shortName: 'Eastern',
    logoPath: '/universities/eusl.svg',
    primaryColor: '#1A365D',
    secondaryColor: '#ECC94B',
  },
  {
    id: 'seusl',
    code: 'SEUSL',
    name: 'South Eastern University of Sri Lanka',
    shortName: 'South Eastern',
    logoPath: '/universities/seusl.svg',
    primaryColor: '#065F46',
    secondaryColor: '#F59E0B',
  },
  {
    id: 'rusl',
    code: 'RUSL',
    name: 'Rajarata University of Sri Lanka',
    shortName: 'Rajarata',
    logoPath: '/universities/rajarata.png',
    primaryColor: '#7F1D1D',
    secondaryColor: '#D97706',
  },
  {
    id: 'wusl',
    code: 'WUSL',
    name: 'Wayamba University of Sri Lanka',
    shortName: 'Wayamba',
    logoPath: '/universities/wusl.svg',
    primaryColor: '#1E3A8A',
    secondaryColor: '#F3F4F6',
  },
  {
    id: 'uwu',
    code: 'UWU',
    name: 'Uva Wellassa University',
    shortName: 'Uva Wellassa',
    logoPath: '/universities/uwa.png',
    primaryColor: '#B45309',
    secondaryColor: '#FBBF24',
  },
  {
    id: 'ousl',
    code: 'OUSL',
    name: 'The Open University of Sri Lanka',
    shortName: 'Open University',
    logoPath: '/universities/ousl.svg',
    primaryColor: '#1E40AF',
    secondaryColor: '#FACC15',
  },
  {
    id: 'uvpa',
    code: 'UVPA',
    name: 'University of the Visual and Performing Arts',
    shortName: 'Visual & Performing Arts',
    logoPath: '/universities/uvpa.svg',
    primaryColor: '#831843',
    secondaryColor: '#FCD34D',
  },
];

export const getUniversityById = (id: string): University => {
  const found = UNIVERSITIES.find((u) => u.id.toLowerCase() === id.toLowerCase());
  return found || UNIVERSITIES[0];
};

export const getUniversityByCode = (code: string): University => {
  const found = UNIVERSITIES.find((u) => u.code.toLowerCase() === code.toLowerCase());
  return found || UNIVERSITIES[0];
};
