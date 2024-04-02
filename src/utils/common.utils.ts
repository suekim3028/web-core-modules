//

export const wait = (seconds: number) => {
  return new Promise((resolve: (v: null) => void) => {
    setTimeout(() => {
      resolve(null);
    }, seconds * 1000);
  });
};
