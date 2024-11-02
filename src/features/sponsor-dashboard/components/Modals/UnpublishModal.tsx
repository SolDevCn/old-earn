import { ViewOffIcon } from '@chakra-ui/icons';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { toast } from 'sonner';

import { type ListingWithSubmissions } from '@/features/listings';
import { useUser } from '@/store/user';

interface UnpublishModalProps {
  unpublishIsOpen: boolean;
  unpublishOnClose: () => void;
  listingId: string | undefined;
  listingType: string | undefined;
}

export const UnpublishModal = ({
  unpublishIsOpen,
  unpublishOnClose,
  listingId,
  listingType,
}: UnpublishModalProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const updateMutation = useMutation({
    mutationFn: async (status: boolean) => {
      let result;
      if (listingType === 'grant') {
        result = await axios.post(`/api/grants/update/${listingId}/`, {
          isPublished: status,
        });
      } else {
        result = await axios.post(`/api/listings/update/${listingId}/`, {
          isPublished: status,
        });
      }
      return result.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<ListingWithSubmissions[]>(
        ['dashboard', user?.currentSponsorId],
        (oldData) =>
          oldData
            ? oldData.map((listing) =>
                listing.id === data.id
                  ? { ...listing, isPublished: data.isPublished }
                  : listing,
              )
            : [],
      );
      toast.success(t('unpublishModal.unpublishSuccess'));
      unpublishOnClose();
    },
    onError: (error) => {
      console.error('Unpublish error:', error);
      toast.error(t('unpublishModal.unpublishError'));
    },
  });

  const changeBountyStatus = (status: boolean) => {
    updateMutation.mutate(status);
  };

  return (
    <Modal isOpen={unpublishIsOpen} onClose={unpublishOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('unpublishModal.title')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text color="brand.slate.500">{t('unpublishModal.description')}</Text>
        </ModalBody>
        <ModalFooter>
          <Button mr={4} onClick={unpublishOnClose} variant="ghost">
            {t('common.close')}
          </Button>
          <Button
            isLoading={updateMutation.isPending}
            leftIcon={<ViewOffIcon />}
            loadingText={t('unpublishModal.unpublishing')}
            onClick={() => changeBountyStatus(false)}
            variant="solid"
          >
            {t('unpublishModal.unpublish')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
