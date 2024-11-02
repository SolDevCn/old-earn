import { Button, type ButtonProps, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { RecordPaymentModal } from './Modals/RecordPaymentModal';

export const RecordPaymentButton = ({
  applicationId,
  buttonStyle,
  approvedAmount,
  token,
  totalPaid,
  onPaymentRecorded,
}: {
  applicationId: string;
  buttonStyle?: ButtonProps;
  approvedAmount: number;
  totalPaid: number;
  token: string;
  onPaymentRecorded: (updatedApplication: any) => void;
}) => {
  const { t } = useTranslation();
  const {
    isOpen: recordPaymentIsOpen,
    onOpen: recordPaymentOnOpen,
    onClose: recordPaymentOnClose,
  } = useDisclosure();

  return (
    <>
      <RecordPaymentModal
        applicationId={applicationId}
        recordPaymentIsOpen={recordPaymentIsOpen}
        recordPaymentOnClose={recordPaymentOnClose}
        approvedAmount={approvedAmount}
        totalPaid={totalPaid}
        token={token}
        onPaymentRecorded={onPaymentRecorded}
      />
      <Button {...buttonStyle} onClick={() => recordPaymentOnOpen()}>
        {t('recordPaymentButton.recordPayment')}
      </Button>
    </>
  );
};
