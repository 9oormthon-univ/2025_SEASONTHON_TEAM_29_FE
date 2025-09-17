'use client';

import clsx from 'clsx';
export const INVITATION_MESSAGE_MOCK = {
  title: 'Eternal Stories,\nShared Together',
  message:
    '서로의 이야기를 함께 나누며\n영원히 이어질 새로운 문을 열고자\n합니다. 그 첫날에 소중한 발걸음을\n해주신다면 큰 믿음으로 간직하겠습니다.',
};

type Props = {
  title: string;
  message: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  titleClassName?: string;
  messageClassName?: string;
};

export default function InvitationMessage({
  title,
  message,
  align = 'center',
  className,
  titleClassName,
  messageClassName,
}: Props) {
  const alignCls =
    align === 'center'
      ? 'text-center'
      : align === 'right'
        ? 'text-right'
        : 'text-left';

  return (
    <section
      className={clsx(
        'mx-auto w-full max-w-[249px] text-primary-500',
        className,
      )}
      aria-label="Invitation Message"
    >
      <h2
        className={clsx(
          alignCls,
          'leading-10 font-normal text-3xl',
          'text-primary-500',
          titleClassName,
        )}
        style={{ fontFamily: 'OG, serif' }}
      >
        {title.split('\n').map((line, i, arr) => (
          <span key={i}>
            {line}
            {i !== arr.length - 1 && <br />}
          </span>
        ))}
      </h2>

      <p
        className={clsx(
          alignCls,
          'mt-6 text-sm leading-normal font-normal',
          'text-primary-400',
          messageClassName,
        )}
        style={{ fontFamily: 'DI, serif' }}
      >
        {message.split('\n').map((line, i, arr) => (
          <span key={i}>
            {line}
            {i !== arr.length - 1 && <br />}
          </span>
        ))}
      </p>
    </section>
  );
}
