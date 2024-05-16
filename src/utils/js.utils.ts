/**
 * 원하는 초만큼 기다리도록 하는 함수
 */
export const wait = (seconds: number) => {
  return new Promise((resolve: (v: null) => void) => {
    setTimeout(() => {
      resolve(null);
    }, seconds * 1000);
  });
};

/**
 * string 으로 쓰여진 숫자를 Number로 변환하는 함수.
 * 빈 스트링인 경우, 숫자형식이 아니거나 NaN인 경우 null 반환
 */

export const parseNum = (str: string) => {
  if (str === "") return null;

  const replaced = str.replace(/[^0-9+.]/g, "");
  if (!replaced) return null;
  const parsed = Number(replaced);

  if (typeof parsed !== "number" || Number.isNaN(parsed)) return null;

  return parsed;
};

/**
 * array에 있는 element 중 랜덤한 하나를 return 하는 함수
 */
export const getRandomArrItem = (arr: any[]) => {
  const len = arr.length;
  const idx = Math.floor(Math.random() * len);
  return arr[idx];
};

/**
 * image resize 함수
 */

export const resizeImage = (
  image: HTMLImageElement,
  maxSize: number,
  type?: string
) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const horizontal = image.width >= image.height;

  const width = horizontal ? maxSize : maxSize * (image.width / image.height); // destination canvas size
  const height = horizontal ? maxSize * (image.height / image.width) : maxSize; // destination canvas size

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(image, 0, 0, width, height);

  const url = canvas.toDataURL(type);
  canvas.remove();
  return url;
};
