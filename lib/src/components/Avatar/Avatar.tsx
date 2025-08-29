import React, { useState } from "react";
import type { CornerType, SizeToken, Style } from "../../utils/types";
import Box, { type BoxProps } from "../Box/Box";
import { classNames } from "../../functions";

type Props = Omit<BoxProps, "children"> & {
  /**
   * How to treat the border radius of the avatar
   * @default "rounded"
   */
  corners?: CornerType;
  /**
   * Size of the avatar
   * @default "s"
   */
  size?: SizeToken | number;
  /**
   * Image to be used in the background
   */
  backgroundImage?: string;
  /**
   * Username to render the first char of,
   * or as a fallback if there's a 404 getting the backgroundImage url
   */
  username: string;
};

const Avatar = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      size = "s",
      backgroundImage,
      className,
      style,
      corners = "rounded",
      username,
      ...rest
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);
    const useFallback = imageError || !backgroundImage;

    const color = chooseColor(username);
    let avatarClassName = `aui-avatar aui-corners--${corners}`;

    if (useFallback) {
      avatarClassName = classNames(avatarClassName, `aui-avatar-${color}`);
    }
    let imageClassName: string | undefined = undefined;
    let avatarStyle: Style = {};
    let imageStyle: Style | undefined = undefined;
    if (typeof size === "number") {
      avatarStyle = { width: size, height: size, fontSize: 0.8 * size };
      imageStyle = { width: size, height: size };
    } else {
      avatarClassName = classNames(avatarClassName, `aui-avatar-${size}`);
      imageClassName = `aui-avatar-${size}`;
    }

    const fallbackCharacter = username[0];

    return (
      <Box
        className={classNames(avatarClassName, className)}
        style={{ ...avatarStyle, ...style }}
        {...rest}
        ref={ref}
      >
        {!useFallback ? (
          <img
            src={backgroundImage}
            alt=""
            className={imageClassName}
            onError={() => setImageError(true)}
            style={imageStyle}
          />
        ) : (
          fallbackCharacter
        )}
      </Box>
    );
  }
);

const colorOptions = ["red", "yellow", "green", "blue", "purple"] as const;

// simple deterministic "hash" to get a background color
function chooseColor(username: string) {
  return colorOptions[
    username.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      colorOptions.length
  ];
}

export default Avatar;
