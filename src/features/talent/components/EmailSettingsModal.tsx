import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Switch,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { usePostHog } from 'posthog-js/react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { useUser } from '@/store/user';

export const EmailSettingsModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { user, refetchUser } = useUser();

  const posthog = usePostHog();

  const emailSettings = user?.emailSettings || [];

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    emailSettings.map((setting) => setting.category),
  );

  const [isUpdating, setIsUpdating] = useState(false);

  const { t } = useTranslation();

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const updateEmailSettings = async () => {
    try {
      posthog.capture('confirm_email preferences');
      setIsUpdating(true);
      await axios.post('/api/user/update-email-settings', {
        categories: selectedCategories,
      });

      await refetchUser();

      setIsUpdating(false);
      onClose();
      toast.success('Email preferences updated');
    } catch (error) {
      console.error('Error updating email preferences:', error);
      toast.error('Failed to update email preferences.');
      setIsUpdating(false);
    }
  };

  const showSponsorAlerts = user?.currentSponsorId;
  const showTalentAlerts = user?.isTalentFilled;

  const AlertOption = ({
    title,
    category,
  }: {
    title: string;
    category: string;
  }) => (
    <Flex align="center" justify="space-between">
      <Text mt={1} color="brand.slate.500" fontWeight={500}>
        {title}
      </Text>
      <Switch
        mt={0.5}
        isChecked={selectedCategories.includes(category)}
        onChange={() => handleCategoryChange(category)}
      />
    </Flex>
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p={2}>
          <ModalCloseButton mt={2} />
          <ModalBody>
            <Text color="brand.slate.700" fontSize="2xl" fontWeight={600}>
              {t('emailSettings.updatePreferences')}
            </Text>
            <Text mt={1} color="brand.slate.400" fontWeight={500}>
              {t('emailSettings.tellUsPreferences')}
            </Text>
            {showSponsorAlerts && (
              <Box mt={6}>
                <Text
                  mt={6}
                  mb={1}
                  color="brand.slate.400"
                  fontSize="sm"
                  letterSpacing={0.8}
                >
                  {t('emailSettings.sponsorAlerts')}
                </Text>
                <AlertOption
                  title={t('emailSettings.newSubmissions')}
                  category="submissionSponsor"
                />
                <AlertOption
                  title={t('emailSettings.commentsReceived')}
                  category="commentSponsor"
                />
                <AlertOption
                  title={t('emailSettings.deadlineReminders')}
                  category="deadlineSponsor"
                />
              </Box>
            )}
            {showTalentAlerts && (
              <Box mt={6}>
                <Text
                  mt={6}
                  mb={1}
                  color="brand.slate.400"
                  fontSize="sm"
                  letterSpacing={0.8}
                >
                  {t('emailSettings.talentAlerts')}
                </Text>
                <AlertOption
                  title={t('emailSettings.weeklyRoundup')}
                  category="weeklyListingRoundup"
                />
                <AlertOption
                  title={t('emailSettings.newListings')}
                  category="createListing"
                />
                <AlertOption
                  title={t('emailSettings.likesAndComments')}
                  category="commentOrLikeSubmission"
                />
                <AlertOption
                  title={t('emailSettings.scoutInvites')}
                  category="scoutInvite"
                />
              </Box>
            )}
            {(showTalentAlerts || showSponsorAlerts) && (
              <Box mt={6}>
                <Text
                  mt={6}
                  mb={1}
                  color="brand.slate.400"
                  fontSize="sm"
                  letterSpacing={0.8}
                >
                  {t('emailSettings.generalAlerts')}
                </Text>
                <AlertOption
                  title={t('emailSettings.commentReplies')}
                  category="replyOrTagComment"
                />
                <AlertOption
                  title={t('emailSettings.productUpdates')}
                  category="productAndNewsletter"
                />
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              className="ph-no-capture"
              w="100%"
              colorScheme="blue"
              isLoading={isUpdating}
              loadingText={t('emailSettings.updatingPreferences')}
              onClick={updateEmailSettings}
            >
              {t('emailSettings.updatePreferences')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
