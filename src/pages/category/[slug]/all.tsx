import { Box } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import type { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { listingsQuery, ListingTabs } from '@/features/listings';
import { Home } from '@/layouts/Home';
import { Meta } from '@/layouts/Meta';

type SlugKeys = 'design' | 'content' | 'development' | 'other';

function AllCategoryListingsPage({ slug }: { slug: string }) {
  const router = useRouter();
  const { t } = useTranslation();

  const { data: listings, isLoading } = useQuery(
    listingsQuery({
      filter: slug,
      take: 100,
    }),
  );

  const titlesForSlugs: { [key in SlugKeys]: string } = {
    design: t('categoryAll.designTitle'),
    content: t('categoryAll.contentTitle'),
    development: t('categoryAll.developmentTitle'),
    other: t('categoryAll.otherTitle'),
  };

  const titleKey = slug as SlugKeys;
  const title = titlesForSlugs[titleKey] || 'Solar Earn';
  const metaDescription = t('categoryAll.metaDescription', {
    category: slug.toLowerCase(),
  });
  const canonicalURL = `https://earn.superteam.fun/category/${slug}/all`;

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
          bounties={listings}
          isListingsLoading={isLoading}
          emoji="/assets/home/emojis/moneyman.webp"
          title={t('categoryAll.freelanceGigs')}
          viewAllLink="/all"
        />
      </Box>
    </Home>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const { slug } = context.query;

  if (slug && typeof slug === 'string' && slug !== slug.toLowerCase()) {
    return {
      redirect: {
        destination: `/category/${slug.toLowerCase()}/all`,
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

export default AllCategoryListingsPage;
