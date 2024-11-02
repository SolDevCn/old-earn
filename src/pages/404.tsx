import { Image, Text, VStack } from '@chakra-ui/react';
import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';

import { Default } from '@/layouts/Default';
import { Meta } from '@/layouts/Meta';

export default function Custom404() {
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Sentry.captureMessage(`Page Not Found: ${router.asPath}`, {
        level: 'error',
        extra: {
          route: router.asPath,
        },
      });
    }
  }, [router.asPath]);

  return (
    <>
      <Default
        meta={
          <Meta
            title={t('404.metaTitle')}
            description={t('404.metaDescription')}
          />
        }
      >
        <VStack
          align={'center'}
          justify={'start'}
          gap={4}
          minH={'100vh'}
          mt={20}
        >
          <Image alt={t('404.pageImageAlt')} src="/assets/bg/404.svg" />
          <Text color="black" fontSize={'xl'} fontWeight={500}>
            {t('404.nothingFound')}
          </Text>
          <Text
            maxW={'2xl'}
            color="gray.500"
            fontSize={['md', 'md', 'lg', 'lg']}
            fontWeight={400}
            textAlign={'center'}
          >
            {t('404.errorMessage')}
          </Text>
          <Image
            w={['20rem', '20rem', '30rem', '30rem']}
            alt={t('404.catImageAlt')}
            src="/assets/bg/cat.svg"
          />
        </VStack>
      </Default>
    </>
  );
}
