class WindowSize {
  public width: number = 0;
  public height: number = 0;
}

export const WindowSizeInstance = new WindowSize();

export default {
  width: WindowSizeInstance.width,
  height: WindowSizeInstance.height,
};
