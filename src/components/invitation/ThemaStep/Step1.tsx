'use client';

import UploadFrame from '../UploadFrame';
import Button from '@/components/common/atomic/Button';

export default function Step1({
  file,
  onChangeFile,
  onNext,
}: {
  file: File | null;
  onChangeFile: (f: File | null) => void;
  onNext: () => void;
}) {
  return (
    <div className="px-6 pt-6">
      <p className="text-sm font-medium text-text--default">
        우리 청첩장의 얼굴이 될 사진이에요
      </p>
      <h2 className="mt-1 text-xl font-bold text-text--default">
        메인사진을 담아주세요.
      </h2>

      <div className="mt-25 flex flex-col items-center">
        <UploadFrame value={file} onChange={onChangeFile} />
      </div>

      <div className="fixed inset-x-0 bottom-0 px-6 pb-20 pt-4 bg-white/80 backdrop-blur">
        <Button fullWidth onClick={onNext} disabled={!file}>
          등록하기
        </Button>
      </div>
    </div>
  );
}
