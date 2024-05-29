import { jsUtils } from ".";

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

type ResultType = "dataURL" | "Blob";

export const resizeImage = async <T extends ResultType>(
  image: HTMLImageElement,
  maxSize: number,
  resultType: T,
  type?: string
): Promise<(T extends "dataURL" ? string : Blob) | null> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const horizontal = image.width >= image.height;

  const width = horizontal ? maxSize : maxSize * (image.width / image.height); // destination canvas size
  const height = horizontal ? maxSize * (image.height / image.width) : maxSize; // destination canvas size

  canvas.width = width;
  canvas.height = height;

  console.log("---");
  ctx.drawImage(image, 0, 0, width, height);
  console.log("---drawimage");

  let resolver: ((blob: Blob | null) => void) | null = null;
  const promise = new Promise((r: (blob: Blob | null) => void) => {
    resolver = r;
  });
  canvas.toBlob((b) => {
    console.log("---blob");
    console.log(b);

    if (resolver) resolver(b);
  });

  const blob = await promise;
  console.log("---hasblob", blob);

  if (!blob) return null;
  const url = window.URL.createObjectURL(blob);
  console.log("---url", !!url);
  canvas.remove();
  if (resultType === "dataURL") {
    return url as T extends "dataURL" ? string : Blob;
  } else {
    return blob as T extends "dataURL" ? string : Blob;
  }
};

export const fileToImage = async (file: File) => {
  const image = document.createElement("img");
  image.crossOrigin = "anonymous";

  const imageUrl = window.URL.createObjectURL(file);
  console.log({ imageUrl });
  image.src = imageUrl;
  return image;
};

export const resizeFile = async (file: File, maxSize: number) => {
  const image = document.createElement("img");
  image.crossOrigin = "anonymous";

  const imageUrl = window.URL.createObjectURL(file);

  let resolver: ((blob: Blob | null) => void) | null = null;

  const promise = new Promise((r: (blob: Blob | null) => void) => {
    resolver = r;
  });

  image.onload = async () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const horizontal = image.width >= image.height;

    const width = horizontal ? maxSize : maxSize * (image.width / image.height); // destination canvas size
    const height = horizontal
      ? maxSize * (image.height / image.width)
      : maxSize; // destination canvas size

    canvas.width = width;
    canvas.height = height;

    console.log("---");
    ctx.drawImage(image, 0, 0, width, height);
    console.log("---drawimage");

    canvas.toBlob((b) => {
      console.log("---blob");
      if (!b) return null;
      if (resolver) resolver(b);
    });
  };

  image.src = imageUrl;
  const blob = await promise;
  return blob;
};

export const downloadImages = (
  imageUrls: string[],
  blobs: Blob[],
  filename: (index: number) => string,
  options?: FilePropertyBag | undefined
) => {
  const files = blobs.map((blob, i) => new File([blob], filename(i), options));

  const shareData: ShareData = {
    files,
    title: "독수리 사진관 프로필이미지",
  };

  try {
    if (
      "canShare" in navigator &&
      "share" in navigator &&
      navigator.canShare(shareData)
    ) {
      navigator.share(shareData);
    } else {
      imageUrls.forEach(async (imageUrl, idx) => {
        const a = document.createElement("a");
        a.href = imageUrl;
        a.download = imageUrl;
        a.click();
        await jsUtils.wait(0.5);
        console.log(idx);
        a.remove();
      });
    }
  } catch (e) {
    //
  }
};
