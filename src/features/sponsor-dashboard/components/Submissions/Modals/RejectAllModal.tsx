import { CloseIcon } from '@chakra-ui/icons';
import {
  Button,
  Circle,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';

interface RejectModalProps {
  rejectIsOpen: boolean;
  rejectOnClose: () => void;
  submissionIds: string[];
  onRejectSubmission: (submissionId: string[]) => void;
}

export const RejectAllSubmissionModal = ({
  rejectIsOpen,
  rejectOnClose,
  onRejectSubmission,
  submissionIds,
}: RejectModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();

  const rejectSubmission = async () => {
    setLoading(true);
    try {
      await onRejectSubmission(submissionIds);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      rejectOnClose();
    }
  };

  return (
    <Modal isOpen={rejectIsOpen} onClose={rejectOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color={'brand.slate.500'} fontSize={'md'} fontWeight={600}>
          {t('submissionModals.rejectAll.title')}
        </ModalHeader>
        <ModalCloseButton />
        <Divider />
        <ModalBody fontSize={'0.95rem'} fontWeight={500}>
          <Text mt={3} color="brand.slate.500">
            {t('submissionModals.rejectAll.message', {
              count: submissionIds.length,
            })}
          </Text>
          <br />
          <Button
            w="full"
            mb={3}
            color="white"
            bg="#E11D48"
            _hover={{ bg: '#E11D48' }}
            isLoading={loading}
            leftIcon={
              loading ? (
                <Spinner color="#E11D48" size="sm" />
              ) : (
                <Circle p={'5px'} bg="#FFF">
                  <CloseIcon color="#E11D48" boxSize="2.5" />
                </Circle>
              )
            }
            loadingText={t('submissionModals.rejectAll.rejecting')}
            onClick={rejectSubmission}
          >
            {t('submissionModals.rejectAll.rejectButton')}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
