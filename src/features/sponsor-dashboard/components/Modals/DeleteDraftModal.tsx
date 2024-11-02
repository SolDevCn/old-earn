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
import { AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'sonner';

import { type ListingWithSubmissions } from '@/features/listings';
import { useUser } from '@/store/user';

interface DeleteDraftModalProps {
  deleteDraftIsOpen: boolean;
  deleteDraftOnClose: () => void;
  listingId: string | undefined;
  listingType: string | undefined;
}

export const DeleteDraftModal = ({
  listingId,
  deleteDraftIsOpen,
  deleteDraftOnClose,
  listingType,
}: DeleteDraftModalProps) => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { t } = useTranslation();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (listingType === 'grant') {
        await axios.post(`/api/grants/delete/${listingId}`);
      } else {
        await axios.post(`/api/listings/delete/${listingId}`);
      }
    },
    onSuccess: () => {
      queryClient.setQueryData<ListingWithSubmissions[]>(
        ['dashboard', user?.currentSponsorId],
        (oldData) => (oldData ? oldData.filter((x) => x.id !== listingId) : []),
      );
      toast.success(t('deleteDraftModal.draftDeletedSuccess'));
      deleteDraftOnClose();
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error(t('deleteDraftModal.draftDeleteError'));
    },
  });

  const deleteSelectedDraft = () => {
    deleteMutation.mutate();
  };

  return (
    <Modal isOpen={deleteDraftIsOpen} onClose={deleteDraftOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('deleteDraftModal.title')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text color="brand.slate.500">
            {t('deleteDraftModal.confirmMessage')}
          </Text>
          <br />
          <Text color="brand.slate.500">
            {t('deleteDraftModal.submissionsWarning')}
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button mr={4} onClick={deleteDraftOnClose} variant="ghost">
            {t('common.close')}
          </Button>
          <Button
            isLoading={deleteMutation.isPending}
            leftIcon={<AiOutlineDelete />}
            loadingText={t('deleteDraftModal.deletingText')}
            onClick={deleteSelectedDraft}
            variant="solid"
          >
            {t('deleteDraftModal.confirmButton')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
