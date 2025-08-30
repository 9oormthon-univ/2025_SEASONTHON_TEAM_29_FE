'use client';

import Input from '@/components/common/atomic/Input';
import * as React from 'react';

function toDisplay(raw: string) {
  const digits = (raw || '').replace(/\D/g, '').slice(0, 8);
  const y = digits.slice(0, 4);
  const m = digits.slice(4, 6);
  const d = digits.slice(6, 8);
  return [y, m && ` / ${m}`, d && ` / ${d}`].filter(Boolean).join('');
}

function toRaw(input: string) {
  return input.replace(/\D/g, '').slice(0, 8);
}

export function isValidYMD(raw: string) {
  if (raw.length !== 8) return false;
  const y = +raw.slice(0, 4);
  const m = +raw.slice(4, 6);
  const d = +raw.slice(6, 8);
  if (m < 1 || m > 12) return false;

  const daysInMonth = [31, (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (d < 1 || d > daysInMonth[m - 1]) return false;
  return true;
}

export default function DateInput({
  raw,
  onRawChange,
  className,
}: {
  raw: string;
  onRawChange: (nextRaw: string) => void;
  className?: string;
}) {
  const [hover, setHover] = React.useState(false);
  const hasValue = !!raw;

  const display = toDisplay(raw);

  return (
    <Input
      type={hasValue || hover ? 'variant4' : 'default'}
      inputType="text"
      value={display}
      placeholder="YYYY / MM / DD"
      onChange={(e) => onRawChange(toRaw(e.target.value))}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={className}
    />
  );
}