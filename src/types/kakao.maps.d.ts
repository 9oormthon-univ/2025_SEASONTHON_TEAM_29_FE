export { };

declare global {
  interface Window {
    kakao: KakaoNamespace;
  }

  type KakaoLatLng = {
    getLat: () => number;
    getLng: () => number;
  };

  type KakaoPoint = { x: number; y: number };
  type KakaoSize = unknown;
  type KakaoMarkerImage = unknown;
  type KakaoProjection = {
    pointFromCoords: (latlng: KakaoLatLng) => KakaoPoint;
    coordsFromPoint: (pt: KakaoPoint) => KakaoLatLng;
  };

  type KakaoMap = {
    setCenter: (latlng: KakaoLatLng) => void;
    panTo: (latlng: KakaoLatLng) => void;
    getProjection: () => KakaoProjection;
    getCenter: () => KakaoLatLng;
  };
  type KakaoMarker = {
    setMap: (map: KakaoMap | null) => void;
    setImage?: (img: KakaoMarkerImage) => void;
    setZIndex?: (z: number) => void;
  };

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
      Point: new (x: number, y: number) => KakaoPoint;
      Size: new (w: number, h: number) => KakaoSize;
      MarkerImage: new (src: string, size: KakaoSize, opts?: { offset: KakaoPoint }) => KakaoMarkerImage;
      Marker: new (options: {
        map?: KakaoMap;
        position: KakaoLatLng;
        title?: string;
      }) => KakaoMarker;
      services: {
        Geocoder: new () => KakaoGeocoder;
        Status: { OK: string };
      };
      event: {
        addListener: (target: KakaoMarker, event: string, cb: () => void) => void;
      };
    };
  };
}
