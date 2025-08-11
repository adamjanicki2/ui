import React, { useState, useRef } from "react";
import { classNames } from "../../functions";

type Props = Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
  "children"
> & {
  /**
   * Code string to render
   */
  children: string;
  /**
   * Whether to disable click to copy
   */
  disableCopy?: boolean;
};

const InlineCode = React.forwardRef<HTMLElement, Props>(
  ({ className, disableCopy, onClick, children, ...props }, ref) => {
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    const handleCopy = () => {
      const timeout = timeoutRef.current;
      if (timeout) {
        clearTimeout(timeout);
        timeoutRef.current = null;
      }
      navigator.clipboard.writeText(children);
      setCopied(true);
      timeoutRef.current = window.setTimeout(() => {
        setCopied(false);
        timeoutRef.current = null;
      }, 3000);
    };

    return (
      <code
        ref={ref}
        role="button"
        className={classNames(
          "ajui-inline-code",
          disableCopy ? undefined : "ajui-copy-cursor",
          copied ? "ajui-inline-code-copied" : undefined,
          className
        )}
        onClick={(e) => {
          if (!disableCopy) {
            handleCopy();
          }
          onClick?.(e);
        }}
        {...props}
      >
        {children}
      </code>
    );
  }
);

export default InlineCode;
