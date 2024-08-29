import React, { useEffect } from "react";
import { useFocusTrap, useScrollLock } from "../../hooks";
import { classNames } from "../../utils/util";

type LayerProps = {
  /**
   * Callback that fires when the user clicks outside the layer
   */
  onClose?: () => void;
  /**
   * The child of the layer.
   * IMPORTANT: the child must be able to accept a ref
   */
  children: React.ReactElement;
  /**
   * [Optional] Additional class name
   */
  className?: string;
  /**
   * [Optional] Additional styles
   */
  style?: React.CSSProperties;
  /**
   * [Optional] Whether to disable the escape key to close the layer
   * @default false
   */
  disableEscape?: boolean;
};

type AnimatedLayerProps = LayerProps & {
  /**
   * [Optional] Config for visibility, including styles and class names
   * Set the `transition` property on the `style` prop to animate the layer
   */
  visibility: {
    visible: boolean;
    invisibleStyle?: React.CSSProperties;
    visibleStyle?: React.CSSProperties;
    invisibleClassName?: string;
    visibleClassName?: string;
  };
};

const BaseLayer = ({
  onClose,
  children,
  style,
  className,
  disableEscape = false,
  visible,
}: LayerProps & { visible: boolean }): JSX.Element => {
  const focusRef = useFocusTrap<HTMLElement>(visible);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    if (!disableEscape) document.addEventListener("keydown", handleEscape);
    return () => {
      if (!disableEscape) document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, disableEscape]);

  return (
    <div
      className={classNames("ajui-layer-backdrop", className)}
      style={style}
      onClick={onClose}
    >
      {React.cloneElement(children, {
        ref: focusRef,
        onClick: (e: React.SyntheticEvent) => {
          e.stopPropagation();
          children.props.onClick?.(e);
        },
      })}
    </div>
  );
};

const Layer = (props: LayerProps): JSX.Element => {
  // Lock and unlock on mount and unmount
  useScrollLock();

  return <BaseLayer {...props} visible />;
};

const defaultInvisibleStyle = {
  visibility: "hidden",
  opacity: 0,
};

const defaultVisibleStyle = { opacity: 1 };

export const AnimatedLayer = ({
  visibility,
  className,
  style = {},
  ...props
}: AnimatedLayerProps): JSX.Element => {
  const {
    visible,
    invisibleStyle = defaultInvisibleStyle,
    visibleStyle = defaultVisibleStyle,
    invisibleClassName,
    visibleClassName,
  } = visibility;

  // lock and unlock on visibility change
  useScrollLock(visible);

  const mergedStyle = {
    ...style,
    ...(visible ? visibleStyle : invisibleStyle),
  };
  const mergedClassName = classNames(
    className,
    visible ? visibleClassName : invisibleClassName
  );
  return (
    <BaseLayer
      {...props}
      style={mergedStyle}
      className={mergedClassName}
      visible={visible}
    />
  );
};

export default Layer;
