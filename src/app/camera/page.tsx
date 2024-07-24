"use client";

import React from "react";
import Webcam from "react-webcam";

const Camera: React.FC = () => {
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  return (
    <div className="container mx-auto">
      {/* <LocalCamera /> */}
      {/* <h1 className="text-3xl font-bold underline">Webcam Test</h1>
      <Webcam
        audio={false}
        height={720}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
        className="border rounded"
      /> */}
    </div>
  );
};

export default Camera;

// "use client";
// import { Button } from "@/components/ui/button";
// import React, { useEffect, useState } from "react";

// const Test = () => {
//   const [test, setTest] = useState(0);
//   useEffect(() => {
//     console.log("Hello bro!");

//     return () => {
//       console.log("Bye bro!");
//     };
//   }, [test]);

//   return (
//     <div>
//       {test}
//       <Button onClick={() => setTest(test + 1)}>Sum</Button>
//       <Button
//         onClick={() =>
//           setTest((num) => {
//             console.log(num);
//             return num + 1;
//           })
//         }
//       >
//         Sum
//       </Button>
//     </div>
//   );
// };

// export default Test;

// import React, { useEffect, useRef, useState } from "react";

// const CameraTest: React.FC = () => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
//   const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

//   const startCamera = async () => {
//     try {
//       const constraints = {
//         video: { facingMode },
//         audio: false,
//       };
//       const stream = await navigator.mediaDevices.getUserMedia(constraints);
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//     } catch (error) {
//       console.error("Error accessing media devices.", error);
//     }
//   };

//   const getDevices = async () => {
//     const devices = await navigator.mediaDevices.enumerateDevices();
//     setDevices(devices.filter((device) => device.kind === "videoinput"));
//   };

//   useEffect(() => {
//     if (
//       "mediaDevices" in navigator &&
//       "getUserMedia" in navigator.mediaDevices
//     ) {
//       console.log("Let's get this party started");
//       getDevices();
//       startCamera();
//     } else {
//       console.error("MediaDevices API not supported.");
//     }
//   }, [facingMode]);

//   const toggleFacingMode = () => {
//     setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 space-y-5">
//       <h1 className="text-2xl font-semibold">Camera Test</h1>
//       <video
//         ref={videoRef}
//         autoPlay
//         playsInline
//         muted
//         className="w-full max-w-md rounded shadow-md"
//       />
//       <button
//         onClick={toggleFacingMode}
//         className="px-4 py-2 bg-blue-500 text-white rounded mt-4"
//       >
//         Toggle Camera
//       </button>
//       <div>
//         <h2 className="text-lg font-semibold">Available Cameras:</h2>
//         <ul>
//           {devices.map((device, index) => (
//             <li key={index}>{device.label || `Camera ${index + 1}`}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default CameraTest;
