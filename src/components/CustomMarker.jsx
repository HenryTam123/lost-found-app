import React from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";

const CustomMarker = ({ position }) => {
  // console.log(position);
  return (
    <>
      <Marker position={position} />
      {/* <InfoWindow position={position} /> */}
    </>
  );
};

export default CustomMarker;
