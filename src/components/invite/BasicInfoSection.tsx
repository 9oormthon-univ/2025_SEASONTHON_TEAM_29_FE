'use client';

import { ORDER_OPTS, isOneOf, type InviteForm, type PersonInfo } from '@/types/invite';
import FormRow from './FormRow';
import FormSection from './FormSection';
import { LabeledCheck } from './LabeledCheck';
import { RolePills } from './RolePills';
import SubHeader from './SubHeader';

const inputCls =
  'h-9 rounded-md border border-gray-200 bg-gray-100 px-3 text-sm text-gray-700 placeholder-gray-400';

export default function BasicInfoSection({
  bride, groom, order, onChange,
}: {
  bride: InviteForm['bride'];
  groom: InviteForm['groom'];
  order: InviteForm['order'];
  onChange: (patch: Partial<Pick<InviteForm, 'bride'|'groom'|'order'>>) => void;
}) {
  const changePerson = (who: 'bride' | 'groom', next: PersonInfo) =>
    onChange({ [who]: next });

  const PersonBlock = (who: 'bride' | 'groom') => {
    const val = who === 'bride' ? bride : groom;
    const title = who === 'bride' ? '신부 정보' : '신랑 정보';

    return (
      <>
        <SubHeader>{title}</SubHeader>

        <FormRow label="이름" noDivider>
          <div className="flex items-center gap-2">
            <input
              className={`${inputCls} w-20`}
              placeholder="성"
              value={val.lastName}
              onChange={(e) => changePerson(who, { ...val, lastName: e.target.value })}
            />
            <input
              className={`${inputCls} w-24`}
              placeholder="이름"
              value={val.firstName}
              onChange={(e) => changePerson(who, { ...val, firstName: e.target.value })}
            />
            <RolePills
              value={val.roleLabel}
              onChange={(r) => changePerson(who, { ...val, roleLabel: r })}
              className="shrink-0"
            />
          </div>
        </FormRow>

        <FormRow label="아버지" noDivider>
          <div className="flex items-center gap-3">
            <input
              className={`${inputCls} w-44`}
              placeholder="성함"
              value={val.father?.lastName ?? ''}
              onChange={(e) =>
                changePerson(who, {
                  ...val,
                  father: { ...(val.father ?? {}), lastName: e.target.value },
                })
              }
            />
            <LabeledCheck
              checked={!!val.father?.deceased}
              onChange={(v) =>
                changePerson(who, {
                  ...val,
                  father: { ...(val.father ?? { lastName: '' }), deceased: v },
                })
              }
              label="故"
            />
          </div>
        </FormRow>

        <FormRow label="어머니">
          <div className="flex items-center gap-3">
            <input
              className={`${inputCls} w-44`}
              placeholder="성함"
              value={val.mother?.lastName ?? ''}
              onChange={(e) =>
                changePerson(who, {
                  ...val,
                  mother: { ...(val.mother ?? {}), lastName: e.target.value },
                })
              }
            />
            <LabeledCheck
              checked={!!val.mother?.deceased}
              onChange={(v) =>
                changePerson(who, {
                  ...val,
                  mother: { ...(val.mother ?? { lastName: '' }), deceased: v },
                })
              }
              label="故"
            />
          </div>
        </FormRow>
      </>
    );
  };

  return (
    <FormSection title="기본정보">
      {PersonBlock('groom')}
      <hr className="my-4 border-t border-gray-200" />
      {PersonBlock('bride')}

      <FormRow label="항목 순서" noDivider>
        <select
          className={`${inputCls} w-40 bg-white`} // 셀렉트는 흰 배경 유지
          value={order}
          onChange={(e) => {
            const v = e.target.value;
            if (isOneOf(ORDER_OPTS, v)) onChange({ order: v });
          }}
        >
          {ORDER_OPTS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </FormRow>
    </FormSection>
  );
}