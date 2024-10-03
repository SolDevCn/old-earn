import { Regions } from '@prisma/client';

export const Superteams = [
  {
    name: 'Solar',
    icons: '/assets/superteams/india.jpg',
    banner: '/assets/superteam-banners/India.png',
    region: Regions.CHINA,
    displayValue: 'China',
    country: ['China'],
    code: 'CN',
    hello: '你好',
  },
  {
    name: 'Superteam Vietnam',
    icons: '/assets/superteams/vietnam.png',
    banner: '/assets/superteam-banners/Vietnam.png',
    region: Regions.VIETNAM,
    displayValue: 'Vietnam',
    country: ['Vietnam'],
    code: 'VN',
    hello: 'Xin chào',
  },
  {
    name: 'Superteam Malaysia',
    icons: '/assets/superteams/malaysia.jpg',
    banner: '/assets/superteam-banners/Malaysia.png',
    region: Regions.MALAYSIA,
    displayValue: 'Malaysia',
    country: ['Malaysia'],
    code: 'MY',
    hello: 'Salaam',
  },
  {
    name: 'Superteam Japan',
    icons: '/assets/superteams/japan.png',
    banner: '/assets/superteam-banners/Japan.png',
    region: Regions.JAPAN,
    displayValue: 'Japan',
    country: ['Japan'],
    code: 'JP',
    hello: `Kon'nichiwa`,
  },
  {
    name: 'Superteam Singapore',
    icons: '/assets/superteams/singapore.png',
    banner: '/assets/superteam-banners/Singapore.png',
    region: Regions.SINGAPORE,
    displayValue: 'Singapore',
    country: ['Singapore'],
    code: 'SG',
    hello: 'Hello',
  },
];

// const NonSTRegions = [];

export const CombinedRegions = [...Superteams];
