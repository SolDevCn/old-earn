import { Box, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Trans } from 'react-i18next';

import { TERMS_OF_USE } from '@/constants';

import { EmailSignIn } from './EmailSignIn';

export const SignIn = () => {
  const router = useRouter();

  return (
    <Box>
      <Box px={6}>
        <EmailSignIn />
        <Text
          mt={4}
          mb={2}
          color="brand.slate.500"
          fontSize="xs"
          textAlign="center"
        >
          <Trans i18nKey="signIn.termsAgreement" ns="common">
            By using this website, you agree to our{' '}
            <Link
              as={NextLink}
              fontWeight={600}
              href={TERMS_OF_USE}
              isExternal
              rel="noopener noreferrer"
            >
              Terms of Use
            </Link>{' '}
            and our{' '}
            <Link
              as={NextLink}
              fontWeight={600}
              href={`${router.basePath}/privacy-policy.pdf`}
              isExternal
            >
              Privacy Policy
            </Link>
            .
          </Trans>
        </Text>
      </Box>
      <Box
        flexDir={'column'}
        py={'7px'}
        bg={'brand.slate.100'}
        borderBottomRadius="6px"
      >
        <Text color="brand.slate.400" fontSize="xs" textAlign="center">
          <Trans i18nKey="signIn.needHelp" ns="common">
            Need help? Reach out to us at{' '}
            <Text as="u">
              <Link
                as={NextLink}
                href={'mailto:support@superteamearn.com'}
                isExternal
              >
                support@superteamearn.com
              </Link>
            </Text>
          </Trans>
        </Text>
      </Box>
    </Box>
  );
};
