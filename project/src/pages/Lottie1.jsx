import React from "react";
import Lottie from "lottie-react";
import animationData from "./ai.json";

const Lottie1 = () => {
  return (
    <div style={{ width: 300, height: 300 }}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default Lottie1;
