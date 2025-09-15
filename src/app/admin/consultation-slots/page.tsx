// src/app/admin/consultation-slots/page.tsx
'use client';

import { createConsultationSlots } from '@/services/reservation.api';
import { ko } from 'date-fns/locale';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function ConsultationSlotsPage() {
  const [vendorId, setVendorId] = useState('');
  const [selectedTimes, setSelectedTimes] = useState<Date[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const addTime = (date: Date | null) => {
    if (!date) return;
    setSelectedTimes((prev) => [...prev, date]);
  };

  const removeTime = (i: number) => {
    setSelectedTimes((prev) => prev.filter((_, idx) => idx !== i));
  };

  const submit = async () => {
    try {
      const res = await createConsultationSlots({
        vendorId: Number(vendorId),
        startTimes: selectedTimes.map((d) => d.toISOString()), // ✅ ISO8601 변환
      });
      setResult(JSON.stringify(res, null, 2));
    } catch (e) {
      setResult('Error: ' + (e as Error).message);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">상담 가능 시간 일괄 등록</h1>
      <input
        type="number"
        placeholder="Vendor ID"
        value={vendorId}
        onChange={(e) => setVendorId(e.target.value)}
        className="border p-2 mb-4 block"
      />

      <div className="flex gap-2 items-center mb-4">
        <DatePicker
          selected={null}
          onChange={addTime}
          showTimeSelect
          timeIntervals={30}
          dateFormat="yyyy-MM-dd HH:mm"
          locale={ko}
          placeholderText="날짜와 시간을 선택하세요"
          className="border p-2"
        />
        <button
          onClick={submit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          등록
        </button>
      </div>

      {/* 선택된 시간 리스트 */}
      {selectedTimes.length > 0 && (
        <ul className="mt-4 list-disc pl-6">
          {selectedTimes.map((d, i) => (
            <li key={i} className="flex justify-between items-center">
              <span>{d.toISOString()}</span>
              <button
                onClick={() => removeTime(i)}
                className="text-red-500 text-sm"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}

      {result && (
        <pre className="mt-4 p-2 border bg-gray-50 text-sm">{result}</pre>
      )}
    </div>
  );
}