import { NextAdminOptions } from '@premieroctet/next-admin';

export const options: NextAdminOptions = {
  title: '⚡️ God Panel',
  model: {
    Sponsors: {
      title: "Sponsors",
      icon: "WalletIcon",
      list: {
        display: [
          "name",
          "slug",
          "isActive",
          "logo",
          "url",
          "industry",
          "twitter",
          "bio",
          "createdAt",
          "updatedAt",
          "id",
        ],
        search: ["name", "email"],
      },
      permissions: [`edit`]
    },
    User: {
      title: "Users",
      icon: "UsersIcon",
      list: {
        display: [
          "name",
          "email",
          "role",
          "isActive",
          "createdAt",
          "updatedAt",
          "id",
        ],
        search: ["name", "email"],
      },
      permissions: [`edit`]
    },
    Bounties: {
      title: "Bounties",
      icon: "DocumentIcon",
      list: {
        display: [
          "title",
          "slug",
          "status",
          "isPublished",
          // "description",
          "deadline",
          "eligibility",
          "token",
          "rewardAmount",
          "rewards",
          "applicationLink",
          "createdAt",
          "updatedAt",
          "id",
          "sponsorId",
        ],
        search: ["title", "slug", "status"],
      },
      permissions: [`edit`]
    },
  },
  externalLinks: [
    {
      label: 'Back to Home',
      url: '/',
    },
  ],
};
