import { Box, Flex } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';

import { EmptySection } from '@/components/shared/EmptySection';
import {
  ListingCard,
  ListingCardSkeleton,
  ListingSection,
  listingsQuery,
} from '@/features/listings';
import { Home } from '@/layouts/Home';

export default function AllProjectsPage() {
  const { t } = useTranslation();
  const { data: listings, isLoading } = useQuery(
    listingsQuery({
      type: 'project',
      take: 100,
    }),
  );

  return (
    <Home type="listing">
      <Box w={'100%'}>
        <ListingSection
          type="bounties"
          title={t('projectsAll.allProjects')}
          sub={t('projectsAll.biteSize')}
          emoji="/assets/home/emojis/moneyman.webp"
        >
          {isLoading &&
            Array.from({ length: 8 }, (_, index) => (
              <ListingCardSkeleton key={index} />
            ))}
          {!isLoading && !listings?.length && (
            <Flex align="center" justify="center" mt={8}>
              <EmptySection
                title={t('projectsAll.noListings')}
                message={t('projectsAll.updatePreferences')}
              />
            </Flex>
          )}
          {!isLoading &&
            listings?.map((bounty) => (
              <ListingCard key={bounty.id} bounty={bounty} />
            ))}
        </ListingSection>
      </Box>
    </Home>
  );
}
