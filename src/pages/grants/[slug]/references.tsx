import { Box, Grid, HStack, Text } from '@chakra-ui/react';
import axios from 'axios';
import type { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';

import { OgImageViewer } from '@/components/shared/ogImageViewer';
import { type GrantWithApplicationCount } from '@/features/grants';
import { GrantPageLayout } from '@/layouts/Grants';
import { getURL } from '@/utils/validUrl';

interface GrantsDetailsProps {
  grant: GrantWithApplicationCount | null;
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

function Grants({ grant: initialGrant }: GrantsDetailsProps) {
  const [grant] = useState<typeof initialGrant>(initialGrant);
  const { t } = useTranslation();

  return (
    <GrantPageLayout grant={grant}>
      <Box>
        <HStack
          align={['center', 'center', 'start', 'start']}
          justify={['center', 'center', 'space-between', 'space-between']}
          flexDir={['column', 'column', 'row', 'row']}
          gap={4}
          maxW={'7xl'}
          mx={'auto'}
          mt={6}
          mb={10}
          bg="white"
          rounded="lg"
        >
          <Box w="full">
            <Text mt={2} mb={6} color="gray.500" fontSize="xl" fontWeight={600}>
              {t('grantReferences.references')}
            </Text>
            <Grid
              gap={6}
              templateColumns={{
                base: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              }}
            >
              {grant?.references?.map((reference, i) => (
                <ReferenceCard link={reference.link} key={i} />
              ))}
            </Grid>
          </Box>
        </HStack>
      </Box>
    </GrantPageLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;

  let grantData;
  try {
    const grantDetails = await axios.get(`${getURL()}api/grants/${slug}`);
    grantData = grantDetails.data;
  } catch (e) {
    console.error(e);
    grantData = null;
  }

  return {
    props: {
      grant: grantData,
    },
  };
};
export default Grants;
