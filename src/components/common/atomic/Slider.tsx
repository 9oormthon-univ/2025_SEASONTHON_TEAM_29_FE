import DotUnit from './DotUnit';

type Props = {
  total: number;
  index: number;
  onChange?: (i: number) => void;
};

export default function Slider({ total, index, onChange }: Props) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          aria-label={`slide ${i + 1}`}
          onClick={() => onChange?.(i)}
          className="flex items-center justify-center"
        >
          <DotUnit isActive={i === index} />
        </button>
      ))}
    </div>
  );
}
