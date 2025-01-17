interface NavItem {
  label: string;
  posthog: string;
  children?: Array<NavItem>;
  href: string;
  altActive?: string[];
}

export const LISTING_NAV_ITEMS: Array<NavItem> = [
  {
    label: 'nav.bounties',
    href: '/bounties/',
    posthog: 'bounties_navbar',
  },
  {
    label: 'nav.projects',
    href: '/projects/',
    posthog: 'projects_navbar',
  },
  {
    label: 'nav.grants',
    href: '/grants/',
    posthog: 'grants_navbar',
  },
];

export const CATEGORY_NAV_ITEMS: Array<NavItem & { pillPH: string }> = [
  {
    label: 'nav.content',
    href: '/category/content/',
    posthog: 'content_navbar',
    pillPH: 'content_navpill',
    altActive: ['/category/design/all/'],
  },
  {
    label: 'nav.design',
    href: '/category/design/',
    posthog: 'design_navbar',
    pillPH: 'design_navpill',
    altActive: ['/category/design/all/'],
  },
  {
    label: 'nav.development',
    href: '/category/development/',
    posthog: 'development_navbar',
    pillPH: 'development_navpill',
    altActive: ['/category/development/all/'],
  },
  {
    label: 'nav.other',
    href: '/category/other/',
    posthog: 'other_navbar',
    pillPH: 'other_navpill',
    altActive: ['/category/other/all/'],
  },
];

// export const HACKATHON_NAV_ITEMS: Array<NavItem> = [
// {
//   label: 'Renaissance',
//   href: '/renaissance/',
//   posthog: 'renaissance_navbar',
// },
// {
//   label: 'Scribes',
//   href: '/scribes/',
//   posthog: 'scribes_navbar',
// },
// ];

export function renderLabel(navItem: NavItem) {
  switch (navItem.label) {
    // case 'Renaissance':
    //   return (
    //     <RenaissanceSecondaryLogo styles={{ width: '116px', height: 'auto' }} />
    //   );
    default:
      return navItem.label;
  }
}
