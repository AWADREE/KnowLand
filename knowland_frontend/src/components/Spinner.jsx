import React from "react";
import { Circles, TailSpin } from "react-loader-spinner";

function Spinner({ message }) {
  return (
    //added mt-3
    <div className="flex flex-col justify-center items-center w-full h-full mt-3">
      <TailSpin
        // type="Circles"
        color="#ef4444"
        height={50}
        width={200}
        className="m-5"
      />

      <p className="text-lg text-center px-2">{message}</p>
    </div>
  );
}

export default Spinner;
