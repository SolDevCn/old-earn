import {
  Container,
  Image,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { ErrorInfo } from '@/components/shared/ErrorInfo';
import { Loading } from '@/components/shared/Loading';
import { GrantEntry, grantsQuery } from '@/features/grants';
import { Default } from '@/layouts/Default';
import { Meta } from '@/layouts/Meta';

function Grants() {
  const router = useRouter();
  const { t } = useTranslation();

  const {
    data: grants,
    isLoading,
    isError,
  } = useQuery(grantsQuery({ order: 'desc' }));

  return (
    <Default
      meta={
        <Meta
          title={t('grantsPage.metaTitle')}
          description={t('grantsPage.metaDescription')}
          canonical="https://earn.superteam.fun/grants/"
          og={`${router.basePath}/assets/og/grants.png`}
        />
      }
    >
      <VStack
        pos={'relative'}
        justify={'center'}
        direction={'column'}
        w={'100%'}
        minH={'100vh'}
        bg={'#F5F5F5'}
      >
        <Image
          pos={'absolute'}
          top={'0'}
          right={'0'}
          left={'0'}
          w={'100%'}
          alt={t('grantsPage.backgroundImageAlt')}
          src="/assets/home/bg_grad.svg"
        />
        <VStack my={16} textAlign="center" spacing={4}>
          <Text
            px={2}
            fontSize={{ base: '4xl', md: '5xl' }}
            fontWeight={700}
            lineHeight="1.2"
          >
            {t('grantsPage.needFunds')}
          </Text>
          <Text
            maxW="2xl"
            mx={2}
            color="gray.600"
            fontSize={{ base: 'lg', md: 'xl' }}
          >
            {t('grantsPage.discoverGrants')}
          </Text>
          <Text
            mt={3}
            color={'brand.slate.400'}
            fontSize={{ base: 'sm', md: 'md' }}
          >
            {t('grantsPage.benefits')}
          </Text>
        </VStack>
        <Container maxW={'7xl'} mb={12}>
          {isLoading && <Loading />}
          {isError && <ErrorInfo />}
          {!isLoading && !isError && (
            <Wrap justify={'center'} mx="auto" spacing={10}>
              {grants?.map((grant) => (
                <WrapItem key={grant?.id}>
                  <GrantEntry
                    title={grant?.title}
                    slug={grant.slug}
                    minReward={grant?.minReward}
                    maxReward={grant?.maxReward}
                    token={grant?.token}
                    logo={grant?.logo}
                  />
                </WrapItem>
              ))}
            </Wrap>
          )}
        </Container>
      </VStack>
    </Default>
  );
}

export default Grants;
