import { Box, Grid, HStack, Text } from '@chakra-ui/react';
import axios from 'axios';
import type { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';

import { OgImageViewer } from '@/components/shared/ogImageViewer';
import { type Listing } from '@/features/listings';
import { ListingPageLayout } from '@/layouts/Listing';
import { getURL } from '@/utils/validUrl';

interface BountyDetailsProps {
  bounty: Listing | null;
}

const ReferenceCard = ({ link }: { link?: string }) => {
  if (!link) return <></>;
  return (
    <Box
      w="100%"
      borderRadius={8}
      cursor="pointer"
      onClick={() => window.open(link, '_blank')}
    >
      <OgImageViewer
        showTitle
        externalUrl={link}
        w={'100%'}
        aspectRatio={1.91 / 1}
        objectFit="cover"
        borderRadius={6}
      />
    </Box>
  );
};

function BountyDetails({ bounty }: BountyDetailsProps) {
  const { t } = useTranslation('references');

  return (
    <ListingPageLayout isTemplate bounty={bounty}>
      <Box>
        <HStack
          align={['center', 'center', 'start', 'start']}
          justify={['center', 'center', 'space-between', 'space-between']}
          flexDir={['column', 'column', 'row', 'row']}
          gap={4}
          mt={6}
          mb={10}
          bg="white"
          rounded="lg"
        >
          <Box w="full">
            <Text mt={2} mb={6} color="gray.500" fontSize="xl" fontWeight={600}>
              {t('references')}
            </Text>
            <Grid
              gap={6}
              templateColumns={{
                base: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              }}
            >
              {bounty?.references?.map((reference, i) => (
                <ReferenceCard link={reference.link} key={i} />
              ))}
            </Grid>
          </Box>
        </HStack>
      </Box>
    </ListingPageLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;

  let bountyData;
  try {
    const bountyDetails = await axios.get(
      `${getURL()}api/listings/templates/${slug}/`,
    );
    bountyData = bountyDetails.data;
  } catch (e) {
    console.error(e);
    bountyData = null;
  }

  return {
    props: {
      bounty: bountyData,
    },
  };
};

export default BountyDetails;
