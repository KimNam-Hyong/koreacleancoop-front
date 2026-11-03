
"use client";

import Script from "next/script";
import { useState } from "react";

export default function KakaoMapLoader() {
  const [error, setError] = useState(false);

  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

  if (!appKey) {
    console.error("카카오 JavaScript 키가 설정되지 않았습니다.");
    return null;
  }

  return (
    <>
      <Script
        id="daum-postcode-sdk"
        src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
      />

      <Script
        id="kakao-map-sdk"
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services&autoload=false`}
        strategy="afterInteractive"
        onReady={() => {
          const kakao = (window as any).kakao;

          if (!kakao?.maps?.load) {
            console.error("카카오맵 SDK 객체가 없습니다.");
            return;
          }

          kakao.maps.load(() => {
            if (!kakao.maps.services?.Geocoder) {
              console.error("주소 변환 라이브러리가 없습니다.");
              return;
            }

            (window as any).kccKakaoReady = true;

            console.log("카카오맵 API 준비 완료");
          });
        }}
        onError={() => {
          setError(true);
          console.error("카카오맵 SDK 로딩 실패");
        }}
      />

      {error && (
        <div role="alert" className="text-red-600">
          카카오맵 서비스를 불러오지 못했습니다.
        </div>
      )}
    </>
  );
}
