import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { GrantApplicationStatus } from '@prisma/client';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { LoadingSection } from '@/components/shared/LoadingSection';
import {
  ApplicationDetails,
  ApplicationHeader,
  ApplicationList,
  applicationsQuery,
  type GrantApplicationWithUser,
  PaymentsHistoryTab,
  RejectAllGrantApplicationModal,
  sponsorGrantQuery,
} from '@/features/sponsor-dashboard';
import { SponsorLayout } from '@/layouts/Sponsor';
import { useUser } from '@/store/user';

interface Props {
  slug: string;
}

const selectedStyles = {
  borderColor: 'brand.purple',
  color: 'brand.slate.600',
};

function GrantApplications({ slug }: Props) {
  const { user } = useUser();
  const router = useRouter();
  const [selectedApplication, setSelectedApplication] =
    useState<GrantApplicationWithUser>();
  const [skip, setSkip] = useState(0);
  let length = 20;
  const [searchText, setSearchText] = useState('');
  const [selectedApplicationIds, setSelectedApplicationIds] = useState<
    Set<string>
  >(new Set());

  const queryClient = useQueryClient();

  const [isToggledAll, setIsToggledAll] = useState(false);
  const {
    isOpen: isTogglerOpen,
    onOpen: onTogglerOpen,
    onClose: onTogglerClose,
  } = useDisclosure();
  const {
    isOpen: rejectedIsOpen,
    onOpen: rejectedOnOpen,
    onClose: rejectedOnClose,
  } = useDisclosure();

  const params = { searchText, length, skip };

  const { data: applications, isLoading: isApplicationsLoading } = useQuery({
    ...applicationsQuery(slug, params),
    retry: false,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    selectedApplicationIds.size > 0 ? onTogglerOpen() : onTogglerClose();
  }, [selectedApplicationIds]);

  useEffect(() => {
    setIsToggledAll(isAllCurrentToggled());
  }, [selectedApplicationIds, applications]);

  useEffect(() => {
    const newSet = new Set(selectedApplicationIds);
    Array.from(selectedApplicationIds).forEach((a) => {
      const applicationWithId = applications?.find(
        (application) => application.id === a,
      );
      if (
        applicationWithId &&
        applicationWithId.applicationStatus !== 'Pending'
      ) {
        newSet.delete(a);
      }
    });
    setSelectedApplicationIds(newSet);
  }, [applications]);

  const isAllCurrentToggled = () =>
    applications
      ?.filter((application) => application.applicationStatus === 'Pending')
      .every((application) => selectedApplicationIds.has(application.id)) ||
    false;

  const toggleApplication = (id: string) => {
    setSelectedApplicationIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        return newSet;
      } else {
        return newSet.add(id);
      }
    });
  };

  const isToggled = useCallback(
    (id: string) => {
      return selectedApplicationIds.has(id);
    },
    [selectedApplicationIds, applications],
  );

  const toggleAllApplications = () => {
    if (!isAllCurrentToggled()) {
      setSelectedApplicationIds((prev) => {
        const newSet = new Set(prev);
        applications
          ?.filter((application) => application.applicationStatus === 'Pending')
          .map((application) => newSet.add(application.id));
        return newSet;
      });
    } else {
      setSelectedApplicationIds((prev) => {
        const newSet = new Set(prev);
        applications?.map((application) => newSet.delete(application.id));
        return newSet;
      });
    }
  };

  useEffect(() => {
    if (searchText) {
      length = 999;
      if (skip !== 0) {
        setSkip(0);
      }
    } else {
      length = 20;
    }
  }, [searchText]);

  const { data: grant, isLoading: isGrantLoading } = useQuery(
    sponsorGrantQuery(slug, user?.currentSponsorId),
  );

  const rejectGrantMutation = useMutation({
    mutationFn: async (applicationIds: string[]) => {
      const batchSize = 10;
      for (let i = 0; i < applicationIds.length; i += batchSize) {
        const batch = applicationIds.slice(i, i + batchSize);
        await axios.post(
          `/api/sponsor-dashboard/grants/update-application-status`,
          {
            data: batch.map((a) => ({ id: a })),
            applicationStatus: 'Rejected',
          },
        );
      }
    },
    onMutate: async (applicationIds) => {
      queryClient.setQueryData(
        ['sponsor-applications', slug, params],
        (old: any) => {
          if (!old) return old;
          return old.map((application: GrantApplicationWithUser) =>
            applicationIds.includes(application.id)
              ? {
                  ...application,
                  applicationStatus: GrantApplicationStatus.Rejected,
                }
              : application,
          );
        },
      );
    },
    onError: () => {
      toast.error(
        'An error occurred while rejecting applications. Please try again.',
      );
    },
    onSuccess: (_, applicationIds) => {
      queryClient.setQueryData(
        ['sponsor-applications', slug, params],
        (old: any) => {
          if (!old) return old;
          return old.map((application: GrantApplicationWithUser) =>
            applicationIds.includes(application.id)
              ? {
                  ...application,
                  applicationStatus: GrantApplicationStatus.Rejected,
                }
              : application,
          );
        },
      );

      const updatedApplication = queryClient
        .getQueryData<
          GrantApplicationWithUser[]
        >(['sponsor-applications', slug, params])
        ?.find((application) => applicationIds.includes(application.id));

      setSelectedApplication(updatedApplication);
      setSelectedApplicationIds(new Set());
      toast.success('Applications rejected successfully');
    },
  });

  const handleRejectGrant = (applicationIds: string[]) => {
    rejectGrantMutation.mutate(applicationIds);
    rejectedOnClose();
  };

  useEffect(() => {
    if (grant && grant.sponsorId !== user?.currentSponsorId) {
      router.push('/dashboard/listings');
    }
  }, [grant, user?.currentSponsorId, router]);

  useEffect(() => {
    if (applications && applications.length > 0) {
      setSelectedApplication((selectedApplication) => {
        if (applications.find((appl) => appl.id === selectedApplication?.id)) {
          return selectedApplication;
        }
        return applications[0];
      });
    }
  }, [applications, searchText]);

  const { t } = useTranslation();

  return (
    <SponsorLayout isCollapsible>
      {isGrantLoading ? (
        <LoadingSection />
      ) : (
        <>
          <ApplicationHeader grant={grant} />
          <Tabs defaultIndex={0}>
            <TabList
              gap={4}
              color="brand.slate.400"
              fontWeight={500}
              borderBottomWidth={'1px'}
            >
              <Tab
                px={1}
                fontSize="sm"
                fontWeight={500}
                _selected={selectedStyles}
              >
                {t('grantApplications.applications')}
              </Tab>
              <Tab
                px={1}
                fontSize="sm"
                fontWeight={500}
                _selected={selectedStyles}
              >
                Payments History
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel px={0}>
                {!applications?.length &&
                !searchText &&
                !isApplicationsLoading ? (
                  <>
                    <Image
                      w={32}
                      mx="auto"
                      mt={32}
                      alt={'talent empty'}
                      src="/assets/bg/talent-empty.svg"
                    />
                    <Text
                      mx="auto"
                      mt={5}
                      color={'brand.slate.600'}
                      fontSize={'lg'}
                      fontWeight={600}
                      textAlign={'center'}
                    >
                      {t('grantApplications.noApplications')}
                    </Text>
                    <Text
                      mx="auto"
                      mb={200}
                      color={'brand.slate.400'}
                      fontWeight={500}
                      textAlign={'center'}
                    >
                      {t('grantApplications.noApplicationsDesc')}
                    </Text>
                  </>
                ) : (
                  <>
                    <Flex align={'start'} bg="white">
                      <Flex flex="4 1 auto" minH="600px">
                        <ApplicationList
                          applications={applications}
                          setSearchText={setSearchText}
                          selectedApplication={selectedApplication}
                          setSelectedApplication={setSelectedApplication}
                          isToggled={isToggled}
                          toggleApplication={toggleApplication}
                          isAllToggled={isToggledAll}
                          toggleAllApplications={toggleAllApplications}
                        />
                        <ApplicationDetails
                          isMultiSelectOn={selectedApplicationIds.size > 0}
                          grant={grant}
                          applications={applications}
                          selectedApplication={selectedApplication}
                          setSelectedApplication={setSelectedApplication}
                          params={params}
                        />
                      </Flex>
                    </Flex>
                    <Flex align="center" justify="start" gap={4} mt={4}>
                      {!!searchText ? (
                        <Text color="brand.slate.400" fontSize="sm">
                          {t('grantApplications.foundResults', {
                            count: applications?.length || 0,
                          })}
                        </Text>
                      ) : (
                        <>
                          <Button
                            isDisabled={skip <= 0}
                            leftIcon={<ChevronLeftIcon w={5} h={5} />}
                            onClick={() =>
                              skip >= length
                                ? setSkip(skip - length)
                                : setSkip(0)
                            }
                            size="sm"
                            variant="outline"
                          >
                            {t('grantApplications.previous')}
                          </Button>
                          <Text color="brand.slate.400" fontSize="sm">
                            <Text as="span" fontWeight={700}>
                              {skip + 1}
                            </Text>{' '}
                            -{' '}
                            <Text as="span" fontWeight={700}>
                              {Math.min(
                                skip + length,
                                grant?.totalApplications!,
                              )}
                            </Text>{' '}
                            {t('grantApplications.of')}
                            <Text as="span" fontWeight={700}>
                              {grant?.totalApplications}
                            </Text>{' '}
                            {t('grantApplications.applications')}
                          </Text>
                          <Button
                            isDisabled={
                              grant?.totalApplications! <= skip + length ||
                              (skip > 0 && skip % length !== 0)
                            }
                            onClick={() =>
                              skip % length === 0 && setSkip(skip + length)
                            }
                            rightIcon={<ChevronRightIcon w={5} h={5} />}
                            size="sm"
                            variant="outline"
                          >
                            {t('grantApplications.next')}
                          </Button>
                        </>
                      )}
                    </Flex>
                  </>
                )}
              </TabPanel>
              <TabPanel px={0}>
                <PaymentsHistoryTab grant={grant} grantId={grant?.id} />
              </TabPanel>
            </TabPanels>
          </Tabs>
          <Popover
            closeOnBlur={false}
            closeOnEsc={false}
            isOpen={isTogglerOpen}
            onClose={onTogglerClose}
          >
            <PopoverContent
              pos="fixed"
              bottom={10}
              w="full"
              mx="auto"
              p={0}
              bg="transparent"
              border="none"
              shadow="none"
            >
              <PopoverBody
                w="fit-content"
                mx="auto"
                px={4}
                bg="white"
                borderWidth={2}
                borderColor="brand.slate.200"
                shadow="lg"
                rounded={'lg'}
              >
                {selectedApplicationIds.size > 100 && (
                  <Text pb={2} color="red" textAlign="center">
                    Cannot select more than 100 applications
                  </Text>
                )}
                <HStack gap={4} fontSize={'lg'}>
                  <HStack fontWeight={500}>
                    <Text>{selectedApplicationIds.size}</Text>
                    <Text color="brand.slate.500">Selected</Text>
                  </HStack>
                  <Box w="1px" h={4} bg="brand.slate.300" />
                  <Button
                    fontWeight={500}
                    bg="transparent"
                    onClick={() => {
                      setSelectedApplicationIds(new Set());
                    }}
                    variant="link"
                  >
                    UNSELECT ALL
                  </Button>
                  <Button
                    gap={2}
                    color="#E11D48"
                    fontWeight={500}
                    bg="#FEF2F2"
                    isDisabled={
                      selectedApplicationIds.size === 0 ||
                      selectedApplicationIds.size > 100
                    }
                    onClick={rejectedOnOpen}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.11111 0.777832C9.49056 0.777832 12.2222 3.5095 12.2222 6.88894C12.2222 10.2684 9.49056 13.0001 6.11111 13.0001C2.73167 13.0001 0 10.2684 0 6.88894C0 3.5095 2.73167 0.777832 6.11111 0.777832ZM8.305 3.83339L6.11111 6.02728L3.91722 3.83339L3.05556 4.69505L5.24944 6.88894L3.05556 9.08283L3.91722 9.9445L6.11111 7.75061L8.305 9.9445L9.16667 9.08283L6.97278 6.88894L9.16667 4.69505L8.305 3.83339Z"
                        fill="#E11D48"
                      />
                    </svg>
                    {t('grantApplications.rejectAllApplications')}
                  </Button>
                </HStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <RejectAllGrantApplicationModal
            applicationIds={Array.from(selectedApplicationIds)}
            rejectIsOpen={rejectedIsOpen}
            rejectOnClose={rejectedOnClose}
            onRejectGrant={handleRejectGrant}
          />
        </>
      )}
    </SponsorLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;
  return {
    props: { slug },
  };
};

export default GrantApplications;
