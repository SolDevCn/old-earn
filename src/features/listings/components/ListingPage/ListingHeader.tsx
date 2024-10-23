import {
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Link,
  Text,
  Tooltip,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { usePostHog } from 'posthog-js/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  LuCheck,
  LuClock,
  LuEye,
  LuFile,
  LuMessageSquare,
  LuPause,
} from 'react-icons/lu';

import { VerifiedBadge } from '@/components/shared/VerifiedBadge';
import {
  getListingIcon,
  type Listing,
  submissionCountQuery,
} from '@/features/listings';
import { PulseIcon } from '@/svg/pulse-icon';
import { dayjs } from '@/utils/dayjs';

import { ListingTabLink } from './ListingTabLink';
import { RegionLabel } from './RegionLabel';
import { ListingHeaderSeparator } from './Separator';
import { StatusBadge } from './StatusBadge';
import { SubscribeListing } from './SubscribeListing';

export function ListingHeader({
  listing,
  isTemplate = false,
  commentCount,
}: {
  listing: Listing;
  isTemplate?: boolean;
  commentCount?: number;
}) {
  const { t } = useTranslation();
  const {
    type,
    status,
    deadline,
    title,
    sponsor,
    slug,
    region,
    isWinnersAnnounced,
    references,
    publishedAt,
    isPublished,
    Hackathon,
  } = listing;
  const router = useRouter();
  const posthog = usePostHog();
  const isMD = useBreakpointValue({ base: false, md: true });
  const hasDeadlineEnded = dayjs().isAfter(deadline);
  const hasHackathonStarted = dayjs().isAfter(Hackathon?.startDate);
  const isProject = type === 'project';
  const isHackathon = type === 'hackathon';

  const { data: submissionNumber, isLoading: isSubmissionNumberLoading } =
    useQuery(submissionCountQuery(listing.id!));

  const statusIconStyles = { w: 5, h: 5 };
  let statusText = '';
  let statusBgColor = '';
  let statusTextColor = '';
  let statusIcon = (
    <PulseIcon
      {...statusIconStyles}
      bg={statusBgColor}
      text={statusTextColor}
    />
  );

  if (status === 'PREVIEW') {
    statusIcon = (
      <Icon as={LuEye} {...statusIconStyles} color="brand.slate.400" />
    );
    statusText = t('ListingHeader.preview');
    statusBgColor = 'brand.slate.200';
    statusTextColor = 'brand.slate.500';
  } else if (!isPublished && !publishedAt) {
    statusIcon = (
      <Icon as={LuFile} {...statusIconStyles} color="brand.slate.400" />
    );
    statusText = t('ListingHeader.draft');
    statusBgColor = 'brand.slate.200';
    statusTextColor = 'brand.slate.500';
  } else if (!isPublished && publishedAt) {
    statusIcon = <Icon as={LuPause} {...statusIconStyles} color="#ffecb3" />;
    statusText = isMD
      ? t('ListingHeader.submissionsPaused')
      : t('ListingHeader.paused');
    statusBgColor = '#ffecb3';
    statusTextColor = '#F59E0B';
  } else if (isHackathon && !hasDeadlineEnded && !hasHackathonStarted) {
    statusIcon = <Icon as={LuClock} {...statusIconStyles} color="#F3E8FF" />;
    statusText = t('ListingHeader.opensSoon');
    statusBgColor = '#F3E8FF';
    statusTextColor = '#8B5CF6';
  } else if (status === 'OPEN' && isWinnersAnnounced) {
    statusIcon = (
      <Icon as={LuCheck} {...statusIconStyles} color={'brand.slate.400'} />
    );
    statusText = t('ListingHeader.completed');
    statusBgColor = 'brand.slate.200';
    statusTextColor = 'brand.slate.400';
  } else if (!isWinnersAnnounced && hasDeadlineEnded && status === 'OPEN') {
    statusIcon = (
      <PulseIcon {...statusIconStyles} bg={'orange.100'} text={'orange.600'} />
    );
    statusText = t('ListingHeader.inReview');
    statusBgColor = 'orange.100';
    statusTextColor = 'orange.600';
  } else if (!hasDeadlineEnded && !isWinnersAnnounced && status === 'OPEN') {
    statusIcon = (
      <PulseIcon
        isPulsing
        {...statusIconStyles}
        bg={'#9AE6B4'}
        text="#16A34A"
      />
    );
    statusText = isMD
      ? t('ListingHeader.submissionsOpen')
      : t('ListingHeader.open');
    statusBgColor = 'green.100';
    statusTextColor = 'green.600';
  }

  const ListingTitle = () => {
    return (
      <Heading
        color={'brand.slate.700'}
        fontFamily={'var(--font-sans)'}
        fontSize={'xl'}
        fontWeight={700}
        letterSpacing={'-0.5px'}
      >
        {title}
      </Heading>
    );
  };

  const ListingStatus = () => {
    return (
      <StatusBadge
        Icon={statusIcon}
        textColor={statusTextColor}
        text={statusText}
      />
    );
  };

  const CommentCount = () => {
    return (
      !!commentCount && (
        <Link
          as={NextLink}
          display={{ base: 'none', md: 'block' }}
          href="#comments"
        >
          <HStack ml={4}>
            <Icon
              as={LuMessageSquare}
              color="brand.slate.500"
              fill="brand.slate.600"
            />
            <Text fontSize={'sm'}>{commentCount}</Text>
          </HStack>
        </Link>
      )
    );
  };

  const HeaderSub = () => {
    return (
      <Flex align={'center'} wrap={'wrap'} gap={{ base: 1, md: 3 }}>
        <Flex align={'center'} gap={1}>
          <Text
            color={'#94A3B8'}
            fontSize={{ base: 'xs', sm: 'md' }}
            fontWeight={500}
            whiteSpace={'nowrap'}
          >
            {t('ListingHeader.by')} {sponsor?.name}
          </Text>
          {!!sponsor?.isVerified && <VerifiedBadge />}
        </Flex>
        <ListingHeaderSeparator />
        {isHackathon ? (
          <Flex align={'center'}>
            <Image h="1rem" alt={type} src={Hackathon?.altLogo} />
          </Flex>
        ) : (
          <Flex>
            <Tooltip
              px={4}
              py={2}
              color="brand.slate.400"
              fontFamily={'var(--font-sans)'}
              fontSize="sm"
              bg="white"
              borderRadius={'lg'}
              label={
                isProject
                  ? t('ListingHeader.projectTooltip')
                  : t('ListingHeader.bountyTooltip')
              }
            >
              <Flex>
                <Image
                  h="4"
                  mt={{ base: '1px', sm: 1 }}
                  mr={{ base: '1px', sm: 1 }}
                  alt={type}
                  src={getListingIcon(type!)}
                />
                <Text
                  color={'gray.400'}
                  fontSize={{ base: 'xs', sm: 'md' }}
                  fontWeight={500}
                >
                  {isProject
                    ? t('ListingHeader.project')
                    : t('ListingHeader.bounty')}
                </Text>
              </Flex>
            </Tooltip>
          </Flex>
        )}
        <ListingHeaderSeparator />
        <Flex display={'flex'}>
          <ListingStatus />
        </Flex>
        <ListingHeaderSeparator />
        <RegionLabel region={region} />
        <CommentCount />
      </Flex>
    );
  };

  const SponsorLogo = () => {
    return (
      <Image
        w={{ base: 12, md: 16 }}
        h={{ base: 12, md: 16 }}
        mr={2}
        objectFit={'cover'}
        alt={sponsor?.name}
        rounded={'md'}
        src={sponsor?.logo || `${router.basePath}/assets/logo/sponsor-logo.png`}
      />
    );
  };

  return (
    <VStack bg={'white'}>
      <VStack
        justify={'space-between'}
        flexDir={'row'}
        gap={5}
        w={'full'}
        maxW={'7xl'}
        mx={'auto'}
        py={{ base: 4, md: 10 }}
      >
        <HStack align="center">
          <SponsorLogo />
          <VStack align={'start'} gap={isHackathon ? 0 : 1}>
            <HStack>
              <Flex display={{ base: 'none', md: 'flex' }}>
                <ListingTitle />
              </Flex>
            </HStack>
            <Flex display={{ base: 'none', md: 'flex' }}>
              <HeaderSub />
            </Flex>
          </VStack>
        </HStack>
        {listing.id && (
          <SubscribeListing isTemplate={isTemplate} id={listing.id} />
        )}
      </VStack>
      <Flex
        direction={'column'}
        gap={1}
        display={{ base: 'flex', md: 'none' }}
        w="full"
        mb={5}
      >
        <ListingTitle />
        <HeaderSub />
      </Flex>
      {
        <Flex align={'center'} w={'full'} maxW="7xl" h={10}>
          <HStack
            align="center"
            justifyContent="start"
            gap={10}
            w={'full'}
            maxW={'7xl'}
            h={'full'}
            mx={'auto'}
            my={'auto'}
            borderColor="brand.slate.200"
            borderBottomWidth={'1px'}
          >
            <ListingTabLink
              w={{ md: '22rem' }}
              href={`/listings/${type}/${slug}/`}
              text={
                type === 'project'
                  ? t('ListingHeader.invitingProposals')
                  : t('ListingHeader.prizes')
              }
              isActive={false}
              styles={{
                pointerEvents: 'none',
                display: { base: 'none', md: 'flex' },
              }}
            />
            <ListingTabLink
              href={
                !isTemplate
                  ? `/listings/${type}/${slug}/`
                  : `/templates/listings/${slug}/`
              }
              text={t('ListingHeader.details')}
              isActive={
                !router.asPath.split('/')[4]?.includes('submission') &&
                !router.asPath.split('/')[4]?.includes('references')
              }
            />

            {!isProject && isWinnersAnnounced && (
              <ListingTabLink
                onClick={() => posthog.capture('submissions tab_listing')}
                href={`/listings/${type}/${slug}/submission`}
                text={t('ListingHeader.submissions')}
                isActive={!!router.asPath.split('/')[4]?.includes('submission')}
                subText={
                  isSubmissionNumberLoading ? '...' : submissionNumber + ''
                }
              />
            )}

            {isProject && references && references?.length > 0 && (
              <>
                <ListingTabLink
                  href={
                    !isTemplate
                      ? `/listings/${type}/${slug}/references`
                      : `/templates/listings/${slug}/references`
                  }
                  text={t('ListingHeader.references')}
                  isActive={
                    !!router.asPath.split('/')[4]?.includes('references')
                  }
                />
              </>
            )}
          </HStack>
        </Flex>
      }
    </VStack>
  );
}
