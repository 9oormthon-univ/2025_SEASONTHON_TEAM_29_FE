'use client';

import { createAvailableSlots } from '@/services/contract.api';
import { Button, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dayjs } from 'dayjs';
import { useState } from 'react';

export default function ContractSlotsPage() {
  const [productId, setProductId] = useState('');
  const [selectedTimes, setSelectedTimes] = useState<Dayjs[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [pendingTime, setPendingTime] = useState<Dayjs | null>(null);

  const removeTime = (i: number) => {
    setSelectedTimes((prev) => prev.filter((_, idx) => idx !== i));
  };

  const submit = async () => {
    try {
      const res = await createAvailableSlots({
        productId: Number(productId),
        startTimes: selectedTimes.map((d) => d.toISOString()),
      });
      setResult(JSON.stringify(res, null, 2));
    } catch (e) {
      setResult('Error: ' + (e as Error).message);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">계약 가능 시간 일괄 등록</h1>
        <TextField
          type="number"
          label="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="mb-4"
        />

        <div className="flex gap-2 items-center mb-4">
         <DateTimePicker
            label="날짜와 시간을 선택하세요"
            onChange={(newValue) => setPendingTime(newValue)} // 임시 저장
            onAccept={(newValue) => {
              if (newValue && newValue.isValid()) {
                setSelectedTimes((prev) => [...prev, newValue]);
                setPendingTime(null); // 초기화
              }
            }}
            value={pendingTime}
            slotProps={{ textField: { fullWidth: true } }}
          />
          <Button variant="contained" color="success" onClick={submit}>
            등록
          </Button>
        </div>

        {selectedTimes.length > 0 && (
          <ul className="mt-4 list-disc pl-6">
            {selectedTimes.map((d, i) => (
              <li key={i} className="flex justify-between items-center">
                <span>{d.toISOString()}</span>
                <Button color="error" size="small" onClick={() => removeTime(i)}>
                  삭제
                </Button>
              </li>
            ))}
          </ul>
        )}

        {result && (
          <pre className="mt-4 p-2 border bg-gray-50 text-sm">{result}</pre>
        )}
      </div>
    </LocalizationProvider>
  );
}