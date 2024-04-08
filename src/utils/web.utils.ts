export const copyToClipboard = (text: string, onSuccess: () => void) => {
  if (window.navigator.clipboard === undefined) {
    copyToClipboardWithoutNavigator(text, onSuccess);
  } else {
    window.navigator.clipboard.writeText(text).then(onSuccess, () => {
      copyToClipboardWithoutNavigator(text, onSuccess);
    });
  }
};

const copyToClipboardWithoutNavigator = (
  text: string,
  onSuccess: () => void
) => {
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  onSuccess();
};
