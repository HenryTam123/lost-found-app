import React, { useState } from "react";
import { Toast } from "react-bootstrap";
import { getCurrentToken } from "../utilities/firestoreAPIs";

const CustomToast = () => {
  const [showToast, setShowToast] = useState(true);
  const [isTokenFound, setTokenFound] = useState(false);
  getCurrentToken(setTokenFound);

  return (
    <Toast
      onClose={() => setShowToast(false)}
      show={showToast}
      delay={10000}
      //   autohide
      animation
      style={{
        position: "absolute",
        top: 100,
        right: 20,
      }}
    >
      <Toast.Header className="d-flex justify-content-between">
        <strong>Notification</strong>
        {/* <div className="ml-auto">12 mins ago</div> */}
      </Toast.Header>
      <Toast.Body>There are some new updates that you might love!</Toast.Body>
    </Toast>
  );
};

export default CustomToast;
