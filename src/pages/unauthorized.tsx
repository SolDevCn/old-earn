import { Text, VStack } from '@chakra-ui/react';
import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';

import { Default } from '@/layouts/Default';
import { Meta } from '@/layouts/Meta';

export default function Unauthorized() {
  const router = useRouter();
  const { t } = useTranslation('common');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Sentry.captureMessage(`Unauthorized Access: ${router.asPath}`, {
        level: 'warning',
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
            title={t('unauthorized.metaTitle')}
            description={t('unauthorized.metaDescription')}
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
          <Text color="black" fontSize={'xl'} fontWeight={500}>
            {t('unauthorized.title')}
          </Text>
          <Text
            maxW={'2xl'}
            color="gray.500"
            fontSize={['md', 'md', 'lg', 'lg']}
            fontWeight={400}
            textAlign={'center'}
          >
            {t('unauthorized.message')}
          </Text>
        </VStack>
      </Default>
    </>
  );
}
