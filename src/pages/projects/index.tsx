import { Box } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { listingsQuery, ListingTabs } from '@/features/listings';
import { Home } from '@/layouts/Home';
import { Meta } from '@/layouts/Meta';
import { dayjs } from '@/utils/dayjs';

export default function ProjectsPage() {
  const { t } = useTranslation();

  const deadline = useMemo(
    () => dayjs().subtract(2, 'months').toISOString(),
    [],
  );

  const { data: listings, isLoading } = useQuery(
    listingsQuery({
      take: 100,
      type: 'project',
      deadline,
    }),
  );

  return (
    <Home type="listing">
      <Meta
        title={t('projectsPage.metaTitle')}
        description={t('projectsPage.metaDescription')}
        canonical="https://earn.superteam.fun/projects/"
      />
      <Box w={'100%'}>
        <ListingTabs
          bounties={listings}
          isListingsLoading={isLoading}
          emoji="/assets/home/emojis/moneyman.webp"
          title={t('nav.projects')}
          viewAllLink="/projects/all"
          showViewAll
          take={20}
        />
      </Box>
    </Home>
  );
}
