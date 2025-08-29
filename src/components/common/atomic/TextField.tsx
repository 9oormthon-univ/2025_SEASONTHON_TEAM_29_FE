'use client';

import * as React from 'react';
import clsx from 'clsx';

export type TextFieldProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  className?: string;
  textareaClassName?: string;

  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  id?: string;
  ariaLabel?: string;
  showCount?: boolean;
};

export default function TextField({
  value,
  defaultValue = '',
  onChange,
  maxLength = 500,
  placeholder = '기억하고 싶은 내용을 적어주세요.',
  className,
  textareaClassName,
  disabled,
  readOnly,
  autoFocus,
  id,
  ariaLabel,
  showCount = true,
}: TextFieldProps) {
  const isControlled = value !== undefined;
  const [inner, setInner] = React.useState(defaultValue);
  const text = isControlled ? (value as string) : inner;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value.slice(0, maxLength);
    if (!isControlled) setInner(next);
    onChange?.(next);
  };

  return (
    <div
      className={clsx(
        'relative inline-flex w-80 h-52 items-start justify-start gap-2.5 overflow-hidden rounded-lg px-4 py-3',
        'outline outline-1 outline-offset-[-1px] outline-box-line',
        className,
      )}
    >
      <textarea
        id={id}
        aria-label={ariaLabel}
        disabled={disabled}
        readOnly={readOnly}
        autoFocus={autoFocus}
        value={text}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={clsx(
          'h-full w-full resize-none bg-transparent outline-none',
          'text-sm leading-normal',
          'text-text-secondary placeholder:text-text-tertiary',
          textareaClassName,
        )}
      />
      {showCount && (
        <span className="pointer-events-none absolute bottom-2 right-4 text-xs text-box-line">
          {text.length}/{maxLength}
        </span>
      )}
    </div>
  );
}
