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
import { useTranslation } from 'next-i18next'; // 添加这行
import React, { useState } from 'react';

interface RejectModalProps {
  rejectIsOpen: boolean;
  rejectOnClose: () => void;
  applicationIds: string[];
  onRejectGrant: (applicationId: string[]) => void;
}

export const RejectAllGrantApplicationModal = ({
  rejectIsOpen,
  rejectOnClose,
  onRejectGrant,
  applicationIds,
}: RejectModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation(); // 添加这行

  const rejectGrant = async () => {
    setLoading(true);
    try {
      await onRejectGrant(applicationIds);
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
          {t('rejectAllModal.title')}
        </ModalHeader>
        <ModalCloseButton />
        <Divider />
        <ModalBody fontSize={'0.95rem'} fontWeight={500}>
          <Text mt={3} color="brand.slate.500">
            {t('rejectAllModal.aboutToReject', {
              count: applicationIds.length,
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
            loadingText={t('rejectAllModal.rejecting')}
            onClick={rejectGrant}
          >
            {t('rejectAllModal.rejectGrant')}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
