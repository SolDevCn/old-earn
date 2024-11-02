import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { usePostHog } from 'posthog-js/react';
import { type Dispatch, type SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ImagePicker } from '@/components/shared/ImagePicker';
import { CountryList } from '@/constants';
import { useUser } from '@/store/user';
import { uploadToCloudinary } from '@/utils/upload';

import { useUsernameValidation } from '../../utils';
import type { UserStoreType } from './types';

interface Step1Props {
  setStep: Dispatch<SetStateAction<number>>;
  useFormStore: () => UserStoreType;
}

export function AboutYou({ setStep, useFormStore }: Step1Props) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const { updateState, form } = useFormStore();
  const { user } = useUser();
  const posthog = usePostHog();
  const [isGooglePhoto, setIsGooglePhoto] = useState<boolean>(
    user?.photo?.includes('googleusercontent.com') || false,
  );
  const { t } = useTranslation();

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      username: user?.username ?? '',
      location: form.location,
      photo: user?.photo,
      bio: form.bio,
    },
  });

  const { setUsername, isInvalid, validationErrorMessage, username } =
    useUsernameValidation();

  const onSubmit = async (data: any) => {
    if (isInvalid) {
      return;
    }
    posthog.capture('about you_talent');
    updateState({ ...data, photo: isGooglePhoto ? user?.photo : imageUrl });
    setStep((i) => i + 1);
  };

  return (
    <Box w={'full'}>
      <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
        <FormControl w="full" mb={5} isRequired>
          <Box w={'full'} mb={'1.25rem'}>
            <FormLabel color={'brand.slate.500'}>
              {t('aboutYou.username')}
            </FormLabel>
            <Input
              color={'gray.800'}
              borderColor="brand.slate.300"
              _placeholder={{
                color: 'brand.slate.400',
              }}
              focusBorderColor="brand.purple"
              id="username"
              placeholder={t('aboutYou.usernamePlaceholder')}
              {...register('username', { required: true })}
              isInvalid={isInvalid}
              maxLength={40}
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            {isInvalid && (
              <Text color={'red'} fontSize={'sm'}>
                {validationErrorMessage}
              </Text>
            )}
          </Box>

          <Flex justify="space-between" gap={8} w={'full'} mb={'1.25rem'}>
            <Box w="full">
              <FormLabel color={'brand.slate.500'}>
                {t('aboutYou.firstName')}
              </FormLabel>
              <Input
                color={'gray.800'}
                borderColor="brand.slate.300"
                _placeholder={{
                  color: 'brand.slate.400',
                }}
                focusBorderColor="brand.purple"
                id="firstName"
                placeholder={t('aboutYou.firstNamePlaceholder')}
                {...register('firstName', { required: true })}
                maxLength={100}
              />
            </Box>
            <Box w="full">
              <FormLabel color={'brand.slate.500'}>
                {t('aboutYou.lastName')}
              </FormLabel>
              <Input
                color={'gray.800'}
                borderColor="brand.slate.300"
                _placeholder={{
                  color: 'brand.slate.400',
                }}
                focusBorderColor="brand.purple"
                id="lastName"
                placeholder={t('aboutYou.lastNamePlaceholder')}
                {...register('lastName', { required: true })}
                maxLength={100}
              />
            </Box>
          </Flex>

          <Box w={'full'} mb={'1.25rem'}>
            <FormLabel color={'brand.slate.500'}>
              {t('aboutYou.location')}
            </FormLabel>
            <Select
              color={watch().location.length === 0 ? 'brand.slate.300' : ''}
              borderColor="brand.slate.300"
              _placeholder={{
                color: 'brand.slate.400',
              }}
              focusBorderColor="brand.purple"
              id={'location'}
              placeholder={t('aboutYou.selectCountry')}
              {...register('location', { required: true })}
            >
              {CountryList.map((ct) => {
                return (
                  <option key={ct} value={ct}>
                    {ct}
                  </option>
                );
              })}
            </Select>
          </Box>
          <VStack align={'start'} gap={2} rowGap={'0'} my={3} mb={'25px'}>
            {user?.photo ? (
              <>
                <FormLabel
                  mb={'0'}
                  pb={'0'}
                  color={'brand.slate.500'}
                  requiredIndicator={<></>}
                >
                  {t('aboutYou.profilePicture')}
                </FormLabel>
                <ImagePicker
                  defaultValue={{ url: user.photo }}
                  onChange={async (e) => {
                    setUploading(true);
                    const a = await uploadToCloudinary(e, 'earn-pfp');
                    setIsGooglePhoto(false);
                    setImageUrl(a);
                    setUploading(false);
                  }}
                  onReset={() => {
                    setImageUrl('');
                    setUploading(false);
                  }}
                />
              </>
            ) : (
              <>
                <FormLabel
                  mb={'0'}
                  pb={'0'}
                  color={'brand.slate.500'}
                  requiredIndicator={<></>}
                >
                  {t('aboutYou.profilePicture')}
                </FormLabel>
                <ImagePicker
                  onChange={async (e) => {
                    setUploading(true);
                    const a = await uploadToCloudinary(e, 'earn-pfp');
                    setImageUrl(a);
                    setUploading(false);
                  }}
                  onReset={() => {
                    setImageUrl('');
                    setUploading(false);
                  }}
                />
              </>
            )}
          </VStack>

          <Box w={'full'} mb={'1.25rem'}>
            <FormLabel color={'brand.slate.500'}>{t('aboutYou.bio')}</FormLabel>
            <Textarea
              borderColor="brand.slate.300"
              _placeholder={{
                color: 'brand.slate.400',
              }}
              focusBorderColor="brand.purple"
              id={'bio'}
              maxLength={180}
              placeholder={t('aboutYou.bioPlaceholder')}
              {...register('bio', { required: true })}
            />
            <Text
              color={
                (watch('bio')?.length || 0) > 160 ? 'red' : 'brand.slate.400'
              }
              fontSize={'xs'}
              textAlign="right"
            >
              {t('aboutYou.charactersLeft', {
                count: 180 - (watch('bio')?.length || 0),
              })}
            </Text>
          </Box>
          <Button
            className="ph-no-capture"
            w={'full'}
            h="50px"
            color={'white'}
            bg={'rgb(101, 98, 255)'}
            isLoading={uploading}
            spinnerPlacement="start"
            type="submit"
          >
            {t('aboutYou.continue')}
          </Button>
        </FormControl>
      </form>
    </Box>
  );
}
