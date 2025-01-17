import { Box, Flex, Image, Skeleton, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const TotalStats = ({
  bountyCount,
  TVE,
  isTotalLoading,
}: {
  bountyCount: number | undefined;
  TVE: number | undefined;
  isTotalLoading: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <Flex
      align={'center'}
      justify={'space-between'}
      wrap={'wrap'}
      gap={2}
      w="full"
      px={'0.5rem'}
      py={'1rem'}
      bg={'#F8FAFC'}
      rounded={'md'}
    >
      <Flex>
        <Image
          h={'1.5625rem'}
          mr={'0.5rem'}
          mb={'auto'}
          alt={t('TotalStats.dollarIconAlt')}
          src="/assets/icons/lite-purple-dollar.svg"
        />
        <Box>
          {isTotalLoading ? (
            <Skeleton w="54px" h="14px" />
          ) : (
            <Text color={'black'} fontSize={'sm'} fontWeight={'600'}>
              ${TVE?.toLocaleString()}
            </Text>
          )}
          <Text color={'gray.500'} fontSize={'xs'} fontWeight={'400'}>
            {t('TotalStats.totalValueEarned')}
          </Text>
        </Box>
      </Flex>
      <Box
        display={{ base: 'none', xl: 'block' }}
        w={'0.0625rem'}
        h={'80%'}
        bg={'#CBD5E1'}
      ></Box>
      <Flex>
        <Image
          h={'25x'}
          mr={'0.5rem'}
          mb={'auto'}
          alt={t('TotalStats.suitcaseIconAlt')}
          src="/assets/icons/lite-purple-suitcase.svg"
        />
        <Box>
          {isTotalLoading ? (
            <Skeleton w="32px" h="14px" />
          ) : (
            <Text color={'black'} fontSize={'sm'} fontWeight={'600'}>
              {bountyCount}
            </Text>
          )}
          <Text color={'gray.500'} fontSize={'xs'} fontWeight={'400'}>
            {t('TotalStats.opportunitiesListed')}
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};
