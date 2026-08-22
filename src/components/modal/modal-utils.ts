export const toCssSize = (value?: number | string) => {
  if (value == null) {
    return undefined;
  }
  return typeof value === 'number' ? `${value}px` : value;
};
