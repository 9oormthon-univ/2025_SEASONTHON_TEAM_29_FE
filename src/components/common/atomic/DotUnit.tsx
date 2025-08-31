interface DotUnitProps {
  isActive: boolean;
}
export default function DotUnit({ isActive }: DotUnitProps) {
  return isActive ? (
    <div className="w-9 h-3 rounded-full bg-primary-500" />
  ) : (
    <div className="w-3 h-3 rounded-full bg-primary-300" />
  );
}
