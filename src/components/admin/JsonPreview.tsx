'use client';
export default function JsonPreview({ data }:{ data: unknown }) {
  return <pre className="bg-gray-50 p-3 rounded overflow-auto">{JSON.stringify(data, null, 2)}</pre>;
}