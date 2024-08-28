import { CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Icon,
  IconButton,
  Image,
  Input,
  Text,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { RxUpload } from 'react-icons/rx';

interface ImagePickerProps {
  onChange?: (file: File) => void;
  onReset?: () => void;
  defaultValue?: {
    url: string;
  };
}

export const ImagePicker = ({
  onChange,
  onReset,
  defaultValue,
}: ImagePickerProps) => {
  const [preview, setPreview] = useState<string | null>(
    defaultValue?.url || null,
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null | undefined) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange && onChange(file);
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onReset && onReset();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  return (
    <Box
      pos={'relative'}
      p={4}
      border="1px dashed"
      borderColor={isDragging ? 'brand.primary' : 'brand.slate.300'}
      borderRadius="md"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Flex>
        {preview ? (
          <Image
            w={20}
            h={20}
            borderRadius={'xl'}
            objectFit={'cover'}
            alt="Preview"
            src={preview}
          />
        ) : (
          <Flex
            align={'center'}
            justify={'center'}
            w={20}
            h={20}
            bg="brand.slate.100"
            borderRadius={'xl'}
          >
            <Icon as={RxUpload} boxSize={6} color="brand.slate.500" />
          </Flex>
        )}
        {preview && (
          <IconButton
            pos="absolute"
            zIndex={1}
            top={3}
            right={3}
            color={'brand.slate.400'}
            bg={'transparent'}
            _hover={{ bg: 'brand.slate.100' }}
            aria-label="Remove image"
            icon={<CloseIcon />}
            onClick={handleReset}
            size="sm"
          />
        )}

        <Flex justify={'center'} direction={'column'} px={5}>
          <Text mb={1} color={'brand.slate.500'} fontWeight={600}>
            Choose or drag and drop media
          </Text>
          <Text color="brand.slate.400" fontSize="sm">
            Maximum size 5 MB
          </Text>
        </Flex>
      </Flex>

      <Input
        ref={fileInputRef}
        accept="image/jpeg, image/png, image/webp"
        hidden
        onChange={(e) =>
          handleFileChange(e.target.files ? e.target.files[0] : null)
        }
        type="file"
      />
      <Box
        pos="absolute"
        top={0}
        right={0}
        bottom={0}
        left={0}
        cursor="pointer"
        onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
      />
    </Box>
  );
};
