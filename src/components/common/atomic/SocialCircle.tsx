import SvgObject from "./SvgObject";

export function SocialCircle({ src, alt, onClick }: { src:string; alt:string; onClick:()=>void }) {
  return (
    <button onClick={onClick} aria-label={alt} className="grid h-9 w-9 place-items-center rounded-full shadow-[0_1px_6px_rgba(0,0,0,0.12)]">
      <SvgObject src={src} alt="" width={36} height={36} />
    </button>
  );
}