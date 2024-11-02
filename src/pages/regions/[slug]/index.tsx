import { Box, Flex } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import type { NextPageContext } from 'next';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { EmptySection } from '@/components/shared/EmptySection';
import { Loading } from '@/components/shared/Loading';
import { Superteams } from '@/constants/Superteam';
import { GrantsCard } from '@/features/grants';
import {
  ListingSection,
  ListingTabs,
  regionalListingsQuery,
} from '@/features/listings';
import { Home } from '@/layouts/Home';
import { Meta } from '@/layouts/Meta';
import { getURL } from '@/utils/validUrl';

const RegionsPage = ({
  slug,
  displayName,
  st,
}: {
  slug: string;
  displayName: string;
  st: (typeof Superteams)[0];
}) => {
  const { t } = useTranslation();

  const { data: listings, isLoading: isListingsLoading } = useQuery(
    regionalListingsQuery({ region: slug, take: 10 }),
  );

  const ogImage = new URL(`${getURL()}api/dynamic-og/region/`);
  ogImage.searchParams.set('region', st.displayValue);
  ogImage.searchParams.set('code', st.code!);

  return (
    <>
      <Home type="region" st={st}>
        <Meta
          title={t('regionPage.welcomeTitle', { displayName })}
          description={t('regionPage.welcomeDescription', { displayName })}
          canonical={`https://earn.superteam.fun/regions/${slug}/`}
          og={ogImage.toString()}
        />
        <Box w={'100%'}>
          <ListingTabs
            bounties={listings?.bounties}
            isListingsLoading={isListingsLoading}
            emoji="/assets/home/emojis/moneyman.webp"
            title={t('regionPage.freelanceGigs')}
            showViewAll
            viewAllLink={`/regions/${slug}/all`}
            take={10}
          />

          <ListingSection
            type="grants"
            title={t('regionPage.grants')}
            sub={t('regionPage.grantsDescription')}
            emoji="/assets/home/emojis/grants.webp"
          >
            {isListingsLoading && (
              <Flex
                align="center"
                justify="center"
                direction="column"
                minH={52}
              >
                <Loading />
              </Flex>
            )}
            {!isListingsLoading && !listings?.grants?.length && (
              <Flex align="center" justify="center" mt={8}>
                <EmptySection
                  title={t('regionPage.noGrantsAvailable')}
                  message={t('regionPage.subscribeToNotifications')}
                />
              </Flex>
            )}
            {!isListingsLoading &&
              listings?.grants?.map((grant) => {
                return <GrantsCard grant={grant} key={grant.id} />;
              })}
          </ListingSection>
        </Box>
      </Home>
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const { slug } = context.query;

  const st = Superteams.find((team) => team.region.toLowerCase() === slug);
  const displayName = st?.displayValue;

  const validRegion = Superteams.some(
    (team) => team.region.toLowerCase() === (slug as string).toLowerCase(),
  );

  if (!validRegion) {
    return {
      notFound: true,
    };
  }

  return {
    props: { slug, displayName, st },
  };
}

export default RegionsPage;
