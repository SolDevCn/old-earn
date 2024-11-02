import { InfoOutlineIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { usePostHog } from 'posthog-js/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import { ImagePicker } from '@/components/shared/ImagePicker';
import { IndustryList } from '@/constants';
import { SignIn } from '@/features/auth';
import {
  useSlugValidation,
  useSponsorNameValidation,
} from '@/features/sponsor';
import type { SponsorType } from '@/interface/sponsor';
import { Default } from '@/layouts/Default';
import { Meta } from '@/layouts/Meta';
import { useUser } from '@/store/user';
import { uploadToCloudinary } from '@/utils/upload';

const CreateSponsor = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const animatedComponents = makeAnimated();
  const { data: session, status } = useSession();
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    getValues,
  } = useForm();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [industries, setIndustries] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loginStep, setLoginStep] = useState(0);

  const { user } = useUser();
  const posthog = usePostHog();

  const {
    setSponsorName,
    isInvalid: isSponsorNameInvalid,
    validationErrorMessage: sponsorNameValidationErrorMessage,
    sponsorName,
  } = useSponsorNameValidation();
  const { setSlug, isInvalid, validationErrorMessage, slug } =
    useSlugValidation();

  useEffect(() => {
    if (user?.currentSponsorId && session?.user?.role !== 'GOD') {
      router.push('/dashboard/listings?open=1');
    }
  }, [user?.currentSponsorId, router]);

  const createNewSponsor = async (sponsor: SponsorType) => {
    if (getValues('bio').length > 180) {
      setErrorMessage(t('newSponsor2.bioLengthExceeded'));
      return;
    }
    setIsLoading(true);
    setHasError(false);
    try {
      await axios.post('/api/sponsors/create', {
        ...sponsor,
      });
      await axios.post(`/api/email/manual/welcome-sponsor`);
      router.push('/dashboard/listings?open=1');
    } catch (e: any) {
      if (e?.response?.status === 403) {
        setErrorMessage(t('newSponsor2.notAuthorized'));
      }
      if (e?.response?.data?.error?.code === 'P2002') {
        setErrorMessage(t('newSponsor2.nameExists'));
      }
      setIsLoading(false);
      setHasError(true);
    }
  };

  if (!session && status === 'loading') {
    return <></>;
  }

  if (!session || session.user.role !== 'GOD') {
    // 从环境变量EARN_GOD_EMAIL 获取管理员邮件地址
    const godEmail = process.env.NEXT_PUBLIC_EARN_GOD_EMAIL;
    const godTelegram = process.env.NEXT_PUBLIC_EARN_GOD_TELEGRAM;
    const godTelegramLink = `https://t.me/${godTelegram}`;

    return (
      <Default
        meta={
          <Meta
            title={t('newSponsor2.metaTitle')}
            description={t('newSponsor2.metaDescription')}
            canonical="https://earn.superteam.fun/new/sponsor/"
          />
        }
      >
        <VStack w="full" pt={8} pb={24}>
          <Heading
            color={'gray.700'}
            fontFamily={'var(--font-sans)'}
            fontSize={'24px'}
            fontWeight={700}
          >
            {t('newSponsor.contactAdmin')}
          </Heading>
          <Text
            color={'gray.400'}
            fontFamily={'var(--font-sans)'}
            fontSize={'20px'}
            fontWeight={500}
          >
            <Trans
              i18nKey="newSponsor.contactAdminDetail"
              values={{ godEmail, godTelegram }}
              components={{
                1: <Link href={`mailto:${godEmail}`} />,
                3: <Link href={godTelegramLink} isExternal />,
              }}
            />
          </Text>
        </VStack>
      </Default>
    );
  }

  return (
    <Default
      meta={
        <Meta
          title={t('newSponsor2.metaTitle')}
          description={t('newSponsor2.metaDescription')}
          canonical="https://earn.superteam.fun/new/sponsor/"
        />
      }
    >
      {!session ? (
        <>
          <Box w={'full'} minH={'100vh'} bg="white">
            <Box
              alignItems="center"
              justifyContent={'center'}
              flexDir={'column'}
              display={'flex'}
              maxW="32rem"
              minH="60vh"
              mx="auto"
            >
              <Text
                pt={4}
                color="brand.slate.900"
                fontSize={18}
                fontWeight={600}
                textAlign={'center'}
              >
                {t('newSponsor2.oneStepAway')}
              </Text>
              <Text
                pb={4}
                color="brand.slate.600"
                fontSize={15}
                fontWeight={400}
                textAlign={'center'}
              >
                {t('newSponsor2.joiningEarn')}
              </Text>
              <SignIn loginStep={loginStep} setLoginStep={setLoginStep} />
            </Box>
          </Box>
        </>
      ) : (
        <VStack w="full" pt={8} pb={24}>
          <VStack>
            <Heading
              color={'gray.700'}
              fontFamily={'var(--font-sans)'}
              fontSize={'24px'}
              fontWeight={700}
            >
              {t('newSponsor2.welcomeToEarn')}
            </Heading>
            <Text
              color={'gray.400'}
              fontFamily={'var(--font-sans)'}
              fontSize={'20px'}
              fontWeight={500}
            >
              {t('newSponsor2.basicInformation')}
            </Text>
          </VStack>
          <VStack w={'2xl'} pt={10}>
            <form
              onSubmit={handleSubmit(async (e) => {
                posthog.capture('complete profile_sponsor');
                createNewSponsor({
                  bio: e.bio,
                  industry: industries ?? '',
                  name: sponsorName,
                  slug,
                  logo: imageUrl ?? '',
                  twitter: e.twitterHandle,
                  url: e.sponsorurl ?? '',
                  entityName: e.entityName,
                });
              })}
              style={{ width: '100%' }}
            >
              <Flex justify={'space-between'} gap={2} w={'full'}>
                <FormControl isRequired>
                  <FormLabel
                    color={'brand.slate.500'}
                    fontSize={'15px'}
                    fontWeight={600}
                    htmlFor={'sponsorname'}
                  >
                    {t('newSponsor2.companyName')}
                  </FormLabel>
                  <Input
                    w={'full'}
                    borderColor={'brand.slate.300'}
                    _placeholder={{ color: 'brand.slate.300' }}
                    focusBorderColor="brand.purple"
                    id="sponsorname"
                    placeholder="Stark Industries"
                    {...register('sponsorname')}
                    isInvalid={isSponsorNameInvalid}
                    onChange={(e) => setSponsorName(e.target.value)}
                    value={sponsorName}
                  />
                  {isSponsorNameInvalid && (
                    <Text
                      mt={1}
                      color={'red'}
                      fontSize={'sm'}
                      lineHeight={'15px'}
                      letterSpacing={'-1%'}
                    >
                      {sponsorNameValidationErrorMessage}
                    </Text>
                  )}
                  <FormErrorMessage>
                    {errors.sponsorname ? t('newSponsor2.required') : null}
                  </FormErrorMessage>
                </FormControl>
                <FormControl w={'full'} isRequired>
                  <FormLabel
                    color={'brand.slate.500'}
                    fontSize={'15px'}
                    fontWeight={600}
                    htmlFor={'slug'}
                  >
                    {t('newSponsor2.companyUsername')}
                  </FormLabel>
                  <Input
                    w={'full'}
                    borderColor={'brand.slate.300'}
                    _placeholder={{ color: 'brand.slate.300' }}
                    focusBorderColor="brand.purple"
                    id="slug"
                    placeholder="starkindustries"
                    {...register('slug')}
                    isInvalid={isInvalid}
                    onChange={(e) => setSlug(e.target.value)}
                    value={slug}
                  />
                  {isInvalid && (
                    <Text
                      mt={1}
                      color={'red'}
                      fontSize={'sm'}
                      lineHeight={'15px'}
                      letterSpacing={'-1%'}
                    >
                      {validationErrorMessage}
                    </Text>
                  )}
                  <FormErrorMessage>
                    {errors.slug ? t('newSponsor2.required') : null}
                  </FormErrorMessage>
                </FormControl>
              </Flex>
              <HStack justify={'space-between'} w={'full'} my={6}>
                <FormControl w={'full'}>
                  <FormLabel
                    color={'brand.slate.500'}
                    fontSize={'15px'}
                    fontWeight={600}
                    htmlFor={'sponsorname'}
                  >
                    {t('newSponsor2.companyUrl')}
                  </FormLabel>
                  <Input
                    borderColor={'brand.slate.300'}
                    _placeholder={{ color: 'brand.slate.300' }}
                    focusBorderColor="brand.purple"
                    id="sponsorurl"
                    placeholder="https://starkindustries.com"
                    {...register('sponsorurl')}
                  />
                  <FormErrorMessage>
                    {errors.sponsorurl ? t('newSponsor2.invalidUrl') : null}
                  </FormErrorMessage>
                </FormControl>
                <FormControl w={'full'} isRequired>
                  <FormLabel
                    color={'brand.slate.500'}
                    fontSize={'15px'}
                    fontWeight={600}
                    htmlFor={'twitterHandle'}
                  >
                    {t('newSponsor2.companyTwitter')}
                  </FormLabel>
                  <Input
                    w={'full'}
                    borderColor={'brand.slate.300'}
                    _placeholder={{ color: 'brand.slate.300' }}
                    id="twitterHandle"
                    placeholder="@StarkIndustries"
                    {...register('twitterHandle')}
                  />
                  <FormErrorMessage>
                    {errors.twitterHandle
                      ? t('newSponsor2.invalidTwitter')
                      : null}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
              <HStack w="full">
                <FormControl w={'full'} isRequired>
                  <HStack mb={2}>
                    <FormLabel
                      m={0}
                      color={'brand.slate.500'}
                      fontSize={'15px'}
                      fontWeight={600}
                      htmlFor={'entityName'}
                    >
                      {t('newSponsor2.entityName')}
                    </FormLabel>
                    <Tooltip
                      fontSize="xs"
                      label={t('newSponsor2.entityNameTooltip')}
                    >
                      <InfoOutlineIcon
                        color="brand.slate.500"
                        w={3}
                        h={3}
                        display={{ base: 'none', md: 'block' }}
                      />
                    </Tooltip>
                  </HStack>
                  <Input
                    w={'full'}
                    borderColor={'brand.slate.300'}
                    _placeholder={{ color: 'brand.slate.300' }}
                    focusBorderColor="brand.purple"
                    id="entityName"
                    placeholder={t('newSponsor2.entityNamePlaceholder')}
                    {...register('entityName')}
                  />
                  <FormErrorMessage>
                    {errors.entityName ? t('newSponsor2.required') : null}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
              {
                <VStack align={'start'} gap={2} mt={6} mb={3}>
                  <Heading
                    color={'brand.slate.500'}
                    fontSize={'15px'}
                    fontWeight={600}
                  >
                    {t('newSponsor2.companyLogo')}{' '}
                    <span
                      style={{
                        color: 'red',
                      }}
                    >
                      *
                    </span>
                  </Heading>
                  <HStack gap={5}>
                    <ImagePicker
                      onChange={async (e) => {
                        const a = await uploadToCloudinary(e, 'earn-sponsor');
                        setImageUrl(a);
                      }}
                    />
                  </HStack>
                </VStack>
              }

              <HStack justify={'space-between'} w={'full'} mt={6}>
                <FormControl w={'full'} isRequired>
                  <FormLabel
                    color={'brand.slate.500'}
                    fontSize={'15px'}
                    fontWeight={600}
                    htmlFor={'industry'}
                  >
                    {t('newSponsor2.industry')}
                  </FormLabel>

                  <Select
                    placeholder={t('newSponsor2.selectIndustry')}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
                    options={IndustryList.map((elm: string) => {
                      return { label: t(`industries.${elm}`), value: elm };
                    })}
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        backgroundColor: 'brand.slate.500',
                        borderColor: 'brand.slate.300',
                      }),
                    }}
                    onChange={(e) =>
                      setIndustries(e.map((i: any) => i.value).join(', '))
                    }
                  />
                  <FormErrorMessage>
                    {errors.industry ? <>{errors.industry.message}</> : <></>}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
              <Box my={6}>
                <FormControl isRequired>
                  <FormLabel
                    color={'brand.slate.500'}
                    fontSize={'15px'}
                    fontWeight={600}
                    htmlFor={'bio'}
                  >
                    {t('newSponsor2.companyBio')}
                  </FormLabel>
                  <Input
                    w={'full'}
                    borderColor={'brand.slate.300'}
                    _placeholder={{ color: 'brand.slate.300' }}
                    focusBorderColor="brand.purple"
                    id="bio"
                    maxLength={180}
                    {...register('bio')}
                    placeholder={t('newSponsor2.bioPlaceholder')}
                  />
                  <Text
                    color={
                      (watch('bio')?.length || 0) > 160
                        ? 'red'
                        : 'brand.slate.400'
                    }
                    fontSize={'xs'}
                    textAlign="right"
                  >
                    {t('newSponsor2.charactersLeft', {
                      count: 180 - (watch('bio')?.length || 0),
                    })}
                  </Text>
                  <FormErrorMessage>
                    {errors.bio ? <>{errors.bio.message}</> : <></>}
                  </FormErrorMessage>
                </FormControl>
              </Box>
              <Box my={8}>
                {hasError && (
                  <Text align="center" mb={2} color="red">
                    {t('newSponsor2.errorMessage')}
                    {(validationErrorMessage ||
                      sponsorNameValidationErrorMessage) &&
                      t('newSponsor2.companyNameExists')}
                  </Text>
                )}
                {(validationErrorMessage ||
                  sponsorNameValidationErrorMessage) && (
                  <Text align={'center'} color="yellow.500">
                    {t('newSponsor2.existingAccountContact')}
                  </Text>
                )}
              </Box>
              <Button
                className="ph-no-capture"
                w="full"
                isDisabled={imageUrl === ''}
                isLoading={!!isLoading}
                loadingText={t('newSponsor2.creatingText')}
                size="lg"
                type="submit"
                variant="solid"
              >
                {t('newSponsor2.createSponsor')}
              </Button>
            </form>
          </VStack>
        </VStack>
      )}
    </Default>
  );
};

export default CreateSponsor;
