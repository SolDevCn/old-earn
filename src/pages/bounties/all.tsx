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

export default function AllBountiesPage() {
  const { t } = useTranslation();
  const { data: listings, isLoading } = useQuery(
    listingsQuery({
      type: 'bounty',
      take: 100,
    }),
  );

  return (
    <Home type="listing">
      <Box w={'100%'} pr={{ base: 0, lg: 6 }}>
        <ListingSection
          type="bounties"
          title={t('bountiesAll.allBounties')}
          sub={t('bountiesAll.biteSize')}
          emoji="/assets/home/emojis/moneyman.webp"
        >
          {isLoading &&
            Array.from({ length: 8 }, (_, index) => (
              <ListingCardSkeleton key={index} />
            ))}
          {!isLoading && !listings?.length && (
            <Flex align="center" justify="center" mt={8}>
              <EmptySection
                title={t('bountiesAll.noListings')}
                message={t('bountiesAll.updatePreferences')}
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
