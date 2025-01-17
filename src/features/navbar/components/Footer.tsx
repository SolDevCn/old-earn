import {
  Box,
  Container,
  Flex,
  Image,
  Link,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { UserFlag } from '@/components/shared/UserFlag';
import { Superteams } from '@/constants/Superteam';
import { Discord, GitHub, Twitter } from '@/features/talent';

type Country = {
  name: string;
  flag: string;
  code: string;
};

const countries: Country[] = Superteams.map((superteam) => ({
  name: superteam.displayValue,
  flag: superteam.icons,
  code: superteam.code ?? 'GLOBAL',
}));

const FooterColumn = ({
  title,
  links,
}: {
  title: string;
  links: { href: string; text: string }[];
}) => {
  return (
    <Stack align="flex-start">
      <Text
        color="brand.slate.400"
        fontSize={{ base: 'xs', md: 'sm' }}
        fontWeight="500"
        textTransform="uppercase"
      >
        {title}
      </Text>
      {links.map((link) => (
        <Link
          key={link.text}
          as={NextLink}
          color="brand.slate.500"
          fontSize={{ base: 'sm', md: 'md' }}
          _hover={{ color: 'brand.slate.600' }}
          href={link.href}
        >
          {link.text}
        </Link>
      ))}
    </Stack>
  );
};

const CountrySelector: React.FC = () => {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    name: 'Global',
    flag: '🌍',
    code: 'global',
  });

  const { t } = useTranslation();

  useEffect(() => {
    const path = router.asPath.toLowerCase();
    const matchedCountry = countries.find((country) =>
      path.includes(`/regions/${country.name.toLowerCase()}`),
    );
    if (matchedCountry) {
      setSelectedCountry(matchedCountry);
    } else {
      setSelectedCountry({ name: 'Global', flag: '🌍', code: 'global' });
    }
  }, [router.asPath]);

  const handleCountrySelect = (country: Country) => {
    if (country.name === 'Global') {
      router.push('/');
    } else {
      const regionUrl = `/regions/${country.name.toLowerCase()}`;
      router.push(regionUrl);
    }
  };

  return (
    <Popover closeOnBlur={true} closeOnEsc={true}>
      <PopoverTrigger>
        <Flex
          align="center"
          gap={2}
          px={2}
          py={1}
          bg="white"
          borderRadius="md"
          cursor="pointer"
        >
          {selectedCountry?.flag &&
            (selectedCountry.code === 'global' ? (
              <Text>{t('footer.globalFlag')}</Text>
            ) : (
              <UserFlag location={selectedCountry.code} isCode />
            ))}
          <Text userSelect={'none'}>{selectedCountry.name}</Text>
        </Flex>
      </PopoverTrigger>
      <PopoverContent w="200px">
        <PopoverBody p={0}>
          <Stack gap={0}>
            {countries.map((country) => (
              <Flex
                key={country.name}
                align="center"
                gap={2}
                px={4}
                py={2}
                _hover={{ bg: 'gray.100' }}
                cursor="pointer"
                onClick={() => handleCountrySelect(country)}
              >
                <UserFlag location={country.code} isCode />
                <Text>{country.name}</Text>
              </Flex>
            ))}
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const opportunities = [
    { text: t('footer.opportunities.bounties'), href: '/bounties' },
    { text: t('footer.opportunities.projects'), href: '/projects' },
    { text: t('footer.opportunities.grants'), href: '/grants' },
  ];

  const categories = [
    { text: t('footer.categories.content'), href: '/category/content' },
    { text: t('footer.categories.design'), href: '/category/design' },
    { text: t('footer.categories.development'), href: '/category/development' },
    { text: t('footer.categories.others'), href: '/category/other' },
  ];

  const about = [
    {
      text: t('footer.about.faq'),
      href: 'https://superteamdao.notion.site/Superteam-Earn-FAQ-aedaa039b25741b1861167d68aa880b1?pvs=4',
    },
    {
      text: t('footer.about.terms'),
      href: 'https://drive.google.com/file/d/1ybbO_UOTaIiyKb4Mbm3sNMbjTf5qj5mT/view',
    },
    { text: t('footer.about.privacyPolicy'), href: '/privacy-policy.pdf' },
    {
      text: t('footer.about.changelog'),
      href: 'https://superteamdao.notion.site/Superteam-Earn-Changelog-faf0c85972a742699ecc07a52b569827',
    },
    {
      text: t('footer.about.contactUs'),
      href: 'mailto:support@superteamearn.com',
    },
  ];

  return (
    <Box as="footer" bg="white" borderTop="1px" borderTopColor="blackAlpha.200">
      <Container maxW="7xl" py={8}>
        <Flex
          align="flex-start"
          justify="space-between"
          direction={{ base: 'column', md: 'row' }}
        >
          <Flex direction="column" maxW="540px" mb={{ base: 8, md: 0 }}>
            <Flex align="center" mb={4}>
              <Image
                h={6}
                mr={4}
                alt={t('footer.logoAlt')}
                src="/assets/logo/logo.svg"
              />
            </Flex>
            <Text
              mb={6}
              color="brand.slate.500"
              fontSize={{ base: 'sm', md: 'md' }}
            >
              {t('footer.description')}
            </Text>
            <Flex gap={4}>
              <GitHub link="https://github.com/SuperteamDAO/earn" />
              <Twitter link="https://twitter.com/superteamearn" />
              <Discord link="https://discord.com/invite/Mq3ReaekgG" />
            </Flex>
          </Flex>
          <Flex
            justify={{ base: 'flex-start', md: 'flex-end' }}
            wrap="wrap"
            gap={{ base: 6, md: 16 }}
            w={{ base: '100%', md: 'auto' }}
          >
            <FooterColumn
              title={t('footer.opportunities.title')}
              links={opportunities}
            />
            <FooterColumn
              title={t('footer.categories.title')}
              links={categories}
            />
            <FooterColumn title={t('footer.about.title')} links={about} />
          </Flex>
        </Flex>
      </Container>
      <Box py={4} pb={{ base: 20, md: 4 }} bg="gray.100">
        <Container maxW="7xl">
          <Flex
            align={{ base: 'flex-start', md: 'center' }}
            justify="space-between"
            direction={{ base: 'column', md: 'row' }}
          >
            <Text mb={{ base: 4, md: 0 }} color="brand.slate.500" fontSize="sm">
              © {currentYear} Solar. All rights reserved.
            </Text>
            <Flex align="center">
              <LanguageSwitcher />
              <Text
                mr={2}
                ml={4}
                color="brand.slate.500"
                fontSize="sm"
                fontWeight="500"
              >
                {t('footer.region')}
              </Text>
              <CountrySelector />
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};
