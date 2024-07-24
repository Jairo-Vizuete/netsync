import useLobbyStore from "@/store/lobbyStore";
import { useRef, useEffect, FC } from "react";
import { Button } from "./ui/button";

interface VideoStreamProps {
  peerId: string;
  stream: MediaStream;
}

const VideoStream: FC<VideoStreamProps> = ({ peerId, stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toggleCamera, toggleMicrophone } = useLobbyStore();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="video-container">
      <video ref={videoRef} autoPlay className="border rounded w-full h-full" />
      <div className="controls">
        <Button onClick={() => toggleCamera(peerId)}>Toggle Camera</Button>
        <Button onClick={() => toggleMicrophone(peerId)}>
          Toggle Microphone
        </Button>
      </div>
    </div>
  );
};

export default VideoStream;
