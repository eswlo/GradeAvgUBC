export const getImageUrl = (path: string) => {
  return new URL(`asset/${path}`, import.meta.url).href;
};
