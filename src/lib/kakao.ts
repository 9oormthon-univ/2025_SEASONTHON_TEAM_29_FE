// src/lib/kakao.ts
type KeywordHit = {
  lat: number;
  lng: number;
  placeName: string;
  placeUrl: string;
  fullAddress: string;      // 도로명 주소가 우선, 없으면 지번
};

export async function fetchLatLngByKeyword(keyword: string): Promise<KeywordHit | null> {
  if (!keyword.trim()) return null;
  const key = process.env.NEXT_PUBLIC_KAKAO_REST_KEY ?? '';
  if (!key) return null;

  const res = await fetch(
    `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(keyword)}`,
    { headers: { Authorization: `KakaoAK ${key}` } }
  ).catch(() => null);

  if (!res || !res.ok) return null;
  const data = await res.json().catch(() => null);
  const doc = data?.documents?.[0];
  if (!doc) return null;

  return {
    lat: parseFloat(doc.y),
    lng: parseFloat(doc.x),
    placeName: doc.place_name,
    placeUrl: doc.place_url,
    fullAddress: doc.road_address_name || doc.address_name || '',
  };
}

/** 좌표→주소: road_address.building_name 등을 얻기 위함 */
export async function fetchBuildingNameByCoord(lng: number, lat: number): Promise<string | null> {
  const key = process.env.NEXT_PUBLIC_KAKAO_REST_KEY ?? '';
  if (!key) return null;

  const url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`;
  const res = await fetch(url, { headers: { Authorization: `KakaoAK ${key}` } }).catch(() => null);
  if (!res || !res.ok) return null;

  const json = await res.json().catch(() => null);
  const road = json?.documents?.[0]?.road_address;
  const name: string | undefined = road?.building_name;
  return name && name.trim().length > 0 ? name : null;
}