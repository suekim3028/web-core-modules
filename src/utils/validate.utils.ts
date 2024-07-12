export const testEmail = (email: string) => {
  const reg: RegExp =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return reg.test(email);
};

export const testKoreanName = (name: string) => {
  const reg: RegExp = /^(갸-힣+)$/;
  return reg.test(name);
};
