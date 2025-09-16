import RomanceFittingClient from './RomanceFittingClient';

export default function Page({ params }: { params: { id: string } }) {
  return <RomanceFittingClient id={params.id} />;
}