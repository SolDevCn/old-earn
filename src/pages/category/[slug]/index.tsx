import { Box, Flex } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import type { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';

import { EmptySection } from '@/components/shared/EmptySection';
import { Loading } from '@/components/shared/Loading';
import { GrantsCard, grantsQuery } from '@/features/grants';
import {
  ListingSection,
  listingsQuery,
  ListingTabs,
} from '@/features/listings';
import { Home } from '@/layouts/Home';
import { Meta } from '@/layouts/Meta';
import { dayjs } from '@/utils/dayjs';

type SlugKeys = 'design' | 'content' | 'development' | 'other';

function ListingCategoryPage({ slug }: { slug: string }) {
  const router = useRouter();
  const deadline = useMemo(
    () => dayjs().subtract(1, 'month').toISOString(),
    [],
  );

  const { data: listingsData, isLoading: isListingsLoading } = useQuery(
    listingsQuery({
      take: 100,
      filter: slug,
      deadline,
    }),
  );

  const { data: grants, isLoading: isGrantsLoading } = useQuery(
    grantsQuery({ order: 'asc', take: 10 }),
  );

  const { t } = useTranslation();

  const titlesForSlugs: { [key in SlugKeys]: string } = {
    design: t('categoryPage.designTitle'),
    content: t('categoryPage.contentTitle'),
    development: t('categoryPage.developmentTitle'),
    other: t('categoryPage.otherTitle'),
  };

  const titleKey = slug as SlugKeys;
  const title = titlesForSlugs[titleKey] || 'Superteam Earn';
  const formattedSlug =
    slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();

  const metaDescription = `Find the latest ${slug.toLowerCase()} bounties and grants for freelancers and builders in the crypto space on Superteam Earn.`;
  const canonicalURL = `https://earn.superteam.fun/category/${slug}/`;

  return (
    <Home type="category">
      <Meta
        title={title}
        description={metaDescription}
        canonical={canonicalURL}
        og={`${router.basePath}/assets/og/categories/${slug}.png`}
      />
      <Box w={'100%'}>
        <ListingTabs
          bounties={listingsData ?? []}
          isListingsLoading={isListingsLoading}
          emoji="/assets/home/emojis/moneyman.webp"
          title={t('categoryPage.gigs', { formattedSlug })}
          viewAllLink={`/category/${slug}/all`}
          showViewAll
          take={10}
        />
        <ListingSection
          type="grants"
          title={t('categoryPage.grants', { formattedSlug })}
          sub={t('categoryPage.grantsDescription')}
          emoji="/assets/home/emojis/grants.webp"
          showViewAll
        >
          {isGrantsLoading && (
            <Flex align="center" justify="center" direction="column" minH={52}>
              <Loading />
            </Flex>
          )}
          {!isGrantsLoading && !grants?.length && (
            <Flex align="center" justify="center" mt={8}>
              <EmptySection
                title={t('categoryPage.noGrantsAvailable')}
                message={t('categoryPage.subscribeNotification')}
              />
            </Flex>
          )}
          {!isGrantsLoading &&
            grants?.map((grant) => <GrantsCard grant={grant} key={grant.id} />)}
        </ListingSection>
      </Box>
    </Home>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const { slug } = context.query;

  if (slug && typeof slug === 'string' && slug !== slug.toLowerCase()) {
    return {
      redirect: {
        destination: `/category/${slug.toLowerCase()}`,
        permanent: false,
      },
    };
  }

  const normalizedSlug = typeof slug === 'string' ? slug.toLowerCase() : '';
  const validCategories = ['design', 'content', 'development', 'other'];

  if (!validCategories.includes(normalizedSlug)) {
    return {
      notFound: true,
    };
  }

  return {
    props: { slug },
  };
}

export default ListingCategoryPage;
