// System fonts for React Native CLI project
export const Fonts = {
  dmSans: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
};

export const useAppFonts = () => {
  // Always return true since we're using system fonts
  return true;
};

export default Fonts;
