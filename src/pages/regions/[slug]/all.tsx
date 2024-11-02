import { Box } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import type { NextPageContext } from 'next';
import { useTranslation } from 'next-i18next';

import { Superteams } from '@/constants/Superteam';
import { ListingTabs, regionalListingsQuery } from '@/features/listings';
import { Home } from '@/layouts/Home';
import { Meta } from '@/layouts/Meta';
import { getURL } from '@/utils/validUrl';

export default function AllRegionListingsPage({
  slug,
  displayName,
  st,
}: {
  slug: string;
  displayName: string;
  st: (typeof Superteams)[0];
}) {
  const { data: listings, isLoading: isListingsLoading } = useQuery(
    regionalListingsQuery({ region: slug }),
  );

  const ogImage = new URL(`${getURL()}api/dynamic-og/region/`);
  ogImage.searchParams.set('region', st.region);
  ogImage.searchParams.set('code', st.code!);

  const { t } = useTranslation();

  return (
    <Home type="region" st={st}>
      <Meta
        title={t('regionAll.title', {
          displayName: displayName,
          description: t('regionAll.description'),
        })}
        description={t('regionAll.metaDescription', {
          displayName: displayName,
        })}
        canonical={`https://earn.superteam.fun/regions/${slug}/`}
        og={ogImage.toString()}
      />
      <Box w={'100%'}>
        <ListingTabs
          bounties={listings?.bounties}
          isListingsLoading={isListingsLoading}
          emoji="/assets/home/emojis/moneyman.webp"
          title={t('regionAll.freelanceGigs')}
          viewAllLink="/all"
        />
      </Box>
    </Home>
  );
}

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
