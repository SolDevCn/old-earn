import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

export function InviteMembers({ isOpen, onClose }: Props) {
  const [email, setEmail] = useState<string>('');
  const [memberType, setMemberType] = useState<string>('MEMBER');
  const { t } = useTranslation();

  const inviteMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/member-invites/send/', {
        email,
        memberType,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success(t('inviteMembers.inviteSentSuccess'));
    },
    onError: (error) => {
      console.error('Invite error:', error);
      toast.error(t('inviteMembers.inviteSendError'));
    },
  });

  const handleInput = (emailString: string) => {
    const isEmail = validateEmail(emailString);
    if (isEmail) {
      setEmail(emailString);
    } else {
      setEmail('');
    }
  };

  const sendInvites = () => {
    inviteMutation.mutate();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('inviteMembers.inviteMember')}</ModalHeader>
        <ModalCloseButton />
        {inviteMutation.isSuccess ? (
          <>
            <ModalBody>
              <Alert
                alignItems="center"
                justifyContent="center"
                flexDir="column"
                py={8}
                textAlign="center"
                borderRadius="md"
                status="success"
                variant="subtle"
              >
                <AlertIcon boxSize="40px" mr={4} />
                <Box>
                  <AlertTitle>{t('inviteMembers.sentInvite')}</AlertTitle>
                  <AlertDescription>
                    {t('inviteMembers.teamMemberWillReceive')}
                  </AlertDescription>
                </Box>
              </Alert>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose} variant="solid">
                {t('common.close')}
              </Button>
            </ModalFooter>
          </>
        ) : (
          <>
            <ModalBody>
              <FormControl isInvalid={inviteMutation.isError}>
                <FormLabel mb={0}>
                  {t('inviteMembers.addEmailAddress')}
                </FormLabel>
                <Input
                  color="brand.slate.500"
                  borderColor="brand.slate.300"
                  _placeholder={{
                    color: 'brand.slate.300',
                  }}
                  focusBorderColor="brand.purple"
                  onChange={(e) => handleInput(e.target.value)}
                  type="email"
                />
                <FormErrorMessage>
                  {t('inviteMembers.errorSendingInvite')}
                </FormErrorMessage>
              </FormControl>
              <Stack pt={4}>
                <FormLabel mb={0}>{t('inviteMembers.memberType')}</FormLabel>
                <RadioGroup
                  defaultValue={memberType}
                  onChange={(value) => setMemberType(value)}
                >
                  <Radio
                    _hover={{ bg: 'brand.slate.100' }}
                    colorScheme="purple"
                    name="memberType"
                    size="md"
                    value="MEMBER"
                  >
                    <Box ml={2}>
                      <Text fontSize="sm" fontWeight={700}>
                        {t('inviteMembers.member')}
                      </Text>
                      <Text fontSize="sm">
                        {t('inviteMembers.memberDescription')}
                      </Text>
                    </Box>
                  </Radio>
                  <Radio
                    mt={2}
                    _hover={{ bg: 'brand.slate.100' }}
                    colorScheme="purple"
                    name="memberType"
                    size="md"
                    value="ADMIN"
                  >
                    <Box ml={2}>
                      <Text fontSize="sm" fontWeight={700}>
                        {t('inviteMembers.admin')}
                      </Text>
                      <Text fontSize="sm">
                        {t('inviteMembers.adminDescription')}
                      </Text>
                    </Box>
                  </Radio>
                </RadioGroup>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button mr={4} onClick={onClose} variant="ghost">
                {t('common.close')}
              </Button>
              <Button
                colorScheme="blue"
                isDisabled={!email}
                isLoading={inviteMutation.isPending}
                leftIcon={<AiOutlineSend />}
                loadingText={t('inviteMembers.inviting')}
                onClick={sendInvites}
              >
                {t('inviteMembers.sendInvite')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
