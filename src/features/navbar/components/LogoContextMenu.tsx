import { CopyIcon, DownloadIcon } from '@chakra-ui/icons';
import {
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useClipboard,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import { toast } from 'sonner';

// Correctly formatted SVG string for the logo
const logoSvg =
  '<svg width="81" height="21" viewBox="0 0 81 21" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_2580_746)"> <path d="M10.5 21C16.299 21 21 16.299 21 10.5C21 4.70101 16.299 0 10.5 0C4.70101 0 0 4.70101 0 10.5C0 16.299 4.70101 21 10.5 21Z" fill="#6366F1"/> <path d="M13.7492 7.5107H16.125V8.42172C16.125 9.6573 15.1193 10.656 13.8751 10.656H13.7492V7.5107ZM10.3681 6.1875H13.7492V14.7875H13.3469C10.896 14.7875 10.4057 13.0901 10.4057 11.5796L10.3681 6.1875ZM4.875 8.13481C4.875 9.66995 5.98101 10.2318 7.21286 10.419H4.875V14.8125H7.12494C9.38761 14.8125 9.65138 13.8139 9.65138 12.8652C9.65138 11.7043 8.84703 10.8932 7.60245 10.581H9.65138V6.1875H7.40144C5.13908 6.1875 4.875 7.18614 4.875 8.13481Z" fill="white"/> <path d="M34.6023 17.0917C33.2114 17.0917 31.9983 16.8087 30.9632 16.2426C29.9281 15.6765 29.1194 14.9002 28.5372 13.9136C27.9549 12.927 27.6638 11.7949 27.6638 10.5172C27.6638 9.53059 27.8256 8.62488 28.149 7.80002C28.4725 6.97517 28.9254 6.26354 29.5076 5.66511C30.0899 5.05052 30.7772 4.58148 31.5697 4.25801C32.3784 3.91837 33.2518 3.74854 34.1899 3.74854C35.0632 3.74854 35.8719 3.91028 36.6159 4.23375C37.3599 4.54105 37.9987 4.98582 38.5325 5.56807C39.0824 6.13415 39.5029 6.80535 39.794 7.58168C40.0851 8.35802 40.2145 9.20713 40.1822 10.129L40.1579 11.1964H29.8473L29.2893 9.08582H37.3195L36.9313 9.5225V8.98878C36.8989 8.55209 36.7534 8.15584 36.4946 7.80002C36.252 7.4442 35.9366 7.16926 35.5484 6.97517C35.1603 6.78109 34.7236 6.68405 34.2384 6.68405C33.5267 6.68405 32.9202 6.82153 32.4189 7.09648C31.9336 7.37143 31.5617 7.77577 31.3029 8.30949C31.0441 8.84321 30.9147 9.49016 30.9147 10.2503C30.9147 11.0266 31.0764 11.6978 31.3999 12.2639C31.7396 12.83 32.2086 13.2747 32.807 13.5982C33.4216 13.9055 34.1413 14.0592 34.9662 14.0592C35.5323 14.0592 36.0498 13.9702 36.5189 13.7923C36.9879 13.6144 37.4893 13.3071 38.023 12.8704L39.6727 15.1751C39.2037 15.5957 38.6861 15.9515 38.12 16.2426C37.554 16.5176 36.9717 16.7278 36.3733 16.8734C35.7749 17.0189 35.1845 17.0917 34.6023 17.0917Z" fill="#334155"/> <path d="M47.5316 17.0917C46.4641 17.0917 45.5018 16.8006 44.6446 16.2183C43.7874 15.6361 43.1081 14.8436 42.6067 13.8408C42.1053 12.8381 41.8546 11.6897 41.8546 10.3958C41.8546 9.10199 42.1053 7.96176 42.6067 6.97517C43.1243 5.97241 43.8197 5.18799 44.6931 4.62192C45.5665 4.03967 46.5611 3.74854 47.6771 3.74854C48.3079 3.74854 48.8821 3.84558 49.3996 4.03967C49.9333 4.21758 50.3943 4.46827 50.7825 4.79174C51.1868 5.11521 51.5264 5.4872 51.8014 5.90772C52.0763 6.32823 52.2704 6.78109 52.3836 7.2663L51.6558 7.145V4.01541H55.0765V16.8491H51.6073V13.768L52.3836 13.6953C52.2542 14.1481 52.044 14.5767 51.7529 14.9811C51.4617 15.3854 51.0978 15.7493 50.6611 16.0728C50.2406 16.3801 49.7635 16.6308 49.2298 16.8249C48.6961 17.0028 48.13 17.0917 47.5316 17.0917ZM48.4777 14.1077C49.1247 14.1077 49.6907 13.954 50.1759 13.6467C50.6611 13.3394 51.0331 12.9108 51.2919 12.3609C51.5669 11.7949 51.7043 11.1398 51.7043 10.3958C51.7043 9.66807 51.5669 9.02921 51.2919 8.47931C51.0331 7.92941 50.6611 7.50082 50.1759 7.19352C49.6907 6.87005 49.1247 6.70831 48.4777 6.70831C47.8469 6.70831 47.289 6.87005 46.8037 7.19352C46.3347 7.50082 45.9627 7.92941 45.6878 8.47931C45.4128 9.02921 45.2753 9.66807 45.2753 10.3958C45.2753 11.1398 45.4128 11.7949 45.6878 12.3609C45.9627 12.9108 46.3347 13.3394 46.8037 13.6467C47.289 13.954 47.8469 14.1077 48.4777 14.1077Z" fill="#334155"/> <path d="M58.5304 16.8491V4.01541H61.8541L61.9754 8.13966L61.3932 7.29056C61.5872 6.62744 61.9026 6.02902 62.3393 5.49529C62.776 4.94539 63.2855 4.51679 63.8677 4.20949C64.4661 3.90219 65.0888 3.74854 65.7358 3.74854C66.0107 3.74854 66.2776 3.7728 66.5364 3.82132C66.7951 3.86984 67.0135 3.92645 67.1914 3.99115L66.2695 7.77577C66.0754 7.67873 65.8409 7.59786 65.5659 7.53316C65.291 7.4523 65.0079 7.41186 64.7168 7.41186C64.3287 7.41186 63.9647 7.48464 63.6251 7.6302C63.3016 7.75959 63.0186 7.95368 62.776 8.21245C62.5334 8.45506 62.3393 8.74617 62.1937 9.08582C62.0644 9.42546 61.9997 9.79746 61.9997 10.2018V16.8491H58.5304Z" fill="#334155"/> <path d="M69.168 16.8491V4.01541H72.4674L72.5645 6.63553L71.8852 6.92665C72.0631 6.3444 72.3785 5.81876 72.8314 5.34973C73.3004 4.86452 73.8584 4.47635 74.5053 4.18523C75.1523 3.89411 75.8316 3.74854 76.5432 3.74854C77.5136 3.74854 78.3223 3.94263 78.9692 4.33079C79.6323 4.71896 80.1256 5.30929 80.4491 6.1018C80.7888 6.87813 80.9586 7.84045 80.9586 8.98878V16.8491H77.5136V9.25564C77.5136 8.67339 77.4327 8.18818 77.271 7.80002C77.1093 7.41185 76.8586 7.12882 76.5189 6.95091C76.1955 6.75683 75.7911 6.67596 75.3059 6.70831C74.9177 6.70831 74.5538 6.773 74.2142 6.90239C73.8907 7.01561 73.6077 7.18543 73.3651 7.41186C73.1387 7.63829 72.9527 7.89706 72.8071 8.18818C72.6777 8.47931 72.613 8.7947 72.613 9.13435V16.8491H70.9148C70.5428 16.8491 70.2112 16.8491 69.9201 16.8491C69.629 16.8491 69.3783 16.8491 69.168 16.8491Z" fill="#334155"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M33.5475 5.50793L34.6766 0.617188L37.5998 1.29203L36.4707 6.18277L33.5475 5.50793Z" fill="#334155"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M29.7 19.7079L31.0173 14.002L33.9405 14.6768L32.6232 20.3827L29.7 19.7079Z" fill="#334155"/> </g> <defs> <clipPath id="clip0_2580_746"> <rect width="81" height="21" fill="white"/> </clipPath> </defs> </svg>';

export const LogoContextMenu = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { t } = useTranslation('common');
  const { onCopy: onCopyLogo } = useClipboard(logoSvg);
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyLogo = () => {
    onCopyLogo();
    toast.success(t('LogoContextMenu.logoCopied'));
  };

  const handleDownload = () => {
    window.open('/earn-brand-assets.zip', '_blank');
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
  };
  const router = useRouter();

  return (
    <Box
      display={{ base: 'none', md: 'block' }}
      onContextMenu={handleContextMenu}
    >
      <Menu isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <MenuButton
          as={Box}
          cursor={'pointer'}
          onClick={() => router.push('/')}
        >
          {children}
        </MenuButton>
        <MenuList>
          <MenuItem icon={<CopyIcon />} onClick={handleCopyLogo}>
            {t('LogoContextMenu.copyLogoAsSVG')}
          </MenuItem>
          <MenuItem icon={<DownloadIcon />} onClick={handleDownload}>
            {t('LogoContextMenu.downloadAllAssets')}
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};
