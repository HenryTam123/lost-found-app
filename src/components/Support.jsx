import React from "react";
import Payme from "../images/payme.svg";
import PaymeCode from "../images/payme_code.jpg";
const Support = () => {
  return (
    <div style={{ paddingTop: "75px", minHeight: "90vh" }}>
      <div className="custom-label h4 mt-3 mb-4 py-2">Please support us if you find this website helpful! </div>

      <img src={Payme} height={40} className="mb-2" />
      <br />
      <img src={PaymeCode} height={200} />
    </div>
  );
};

export default Support;
