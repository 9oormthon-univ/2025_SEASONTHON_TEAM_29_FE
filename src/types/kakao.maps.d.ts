export {};

declare global {
  interface Window {
    kakao: KakaoNamespace;
  }

  type KakaoLatLng = {
    getLat: () => number;
    getLng: () => number;
  };

  type KakaoMap = unknown;
  type KakaoMarker = unknown;

  type KakaoGeocodeResult = {
    x: string;
    y: string;
    [k: string]: unknown;
  };

  type KakaoGeocoder = {
    addressSearch: (
      query: string,
      cb: (result: KakaoGeocodeResult[], status: string) => void,
    ) => void;
  };

  type KakaoNamespace = {
    maps: {
      load: (cb: () => void) => void;
      Map: new (
        container: HTMLElement,
        options: { center: KakaoLatLng; level: number },
      ) => KakaoMap;
      LatLng: new (lat: number, lng: number) => KakaoLatLng;
      Marker: new (options: {
        map: KakaoMap;
        position: KakaoLatLng;
      }) => KakaoMarker;
      services: {
        Geocoder: new () => KakaoGeocoder;
        Status: { OK: string };
      };
    };
  };
}
