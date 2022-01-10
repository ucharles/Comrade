import React, { useRef, useEffect } from "react";

import "./Map.css";

const Map = (props) => {
  const mapRef = useRef();

  // props에서 해당 키의 값을 가져오는 JS 기본 문법.
  const { center, zoom } = props;

  // props, function, array of dependancy
  // 종속성 배열에 있는 변수의 내용이 변경될 때마다, 함수의 내용이 재실행됨.
  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom,
    });

    new window.google.maps.Marker({ position: center, map: map });
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}></div>
  );
};

export default Map;
