'use client';

import Button from '@/components/common/atomic/Button';
import ProgressBar from '@/components/common/atomic/ProgressBar';
import Header from '@/components/common/monocules/Header';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import * as React from 'react';

type Step = 1 | 2 | 3;

type SingleButton = {
  mode: 'single';
  primaryText: string;
  onPrimary?: () => void;
  active?: boolean;
};

type DoubleButtons = {
  mode: 'double';
  leftText: string;
  rightText: string;
  onLeft?: () => void;
  onRight?: () => void;
  activeLeft?: boolean;
  activeRight?: boolean;
};

type BaseProps = {
  title: string;
  step: Step;
  headline?: React.ReactNode;
  rightSlot?: React.ReactNode;
  children?: React.ReactNode;
  contentClassName?: string;
};

export type ReservationStepLayoutProps = BaseProps &
  (SingleButton | DoubleButtons);

export default function ReservationStepLayout(
  props: ReservationStepLayoutProps,
) {
  const { title, step, headline, rightSlot, children, contentClassName } =
    props;
  const router = useRouter();

  const pct = (step / 3) * 100;

  return (
    <div className="min-h-dvh">
      <Header value={title} rightSlot={rightSlot} showBack onBack={()=>router.back()}/>
      <div className="mx-auto w-full max-w-[420px] px-[22px]">
        <div className="py-2">
          <ProgressBar
            value={pct}
            max={100}
            size="sm"
            className="w-full"
            trackClassName="bg-neutral-200"
            indicatorClassName="bg-primary-500"
          />
        </div>
        <div className={clsx('pt-4 pb-28', contentClassName)}>
          {headline && (
            <h1 className="text-[22px] font-extrabold leading-snug text-text--default mb-6">
              {headline}
            </h1>
          )}
          {children}
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto w-full max-w-[420px] px-[22px] pb-[max(16px,env(safe-area-inset-bottom))] pt-3">
          {props.mode === 'single' ? (
            <Button
              size="lg"
              state={props.active ? 'default' : 'inactive'}
              fullWidth
              onClick={props.active ? props.onPrimary : undefined}
              ariaLabel={props.primaryText}
            >
              {props.primaryText}
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-1">
              <Button
                size="md"
                state={'default'}
                fullWidth
                onClick={props.activeLeft === false ? undefined : props.onLeft}
                ariaLabel={props.leftText}
              >
                {props.leftText}
              </Button>
              <Button
                size="md"
                state={'hover'}
                fullWidth
                onClick={
                  props.activeRight === false ? undefined : props.onRight
                }
                ariaLabel={props.rightText}
              >
                {props.rightText}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
