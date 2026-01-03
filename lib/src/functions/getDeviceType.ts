type DeviceType = "mobile" | "desktop";

/**
 * Best effort checks to determine the device being used.
 *
 * @returns The device type.
 */
export default function getDeviceType(): DeviceType {
  if (!navigator) return "desktop";

  const { userAgent = "", maxTouchPoints = 0, platform } = navigator;
  const isTouchScreen = maxTouchPoints > 0;
  const isMobileUserAgent = /mobi|android|iphone|ipod|ipad/i.test(userAgent);

  const isNewIpad = platform === "MacIntel" && maxTouchPoints > 1;

  if ((isMobileUserAgent && isTouchScreen) || isNewIpad) {
    return "mobile";
  }

  return "desktop";
}
