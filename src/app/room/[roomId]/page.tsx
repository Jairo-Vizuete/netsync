"use client";
import { Button } from "@/components/ui/button";
import VideoStream from "@/components/video-stream";
import useLobbyStore from "@/store/lobbyStore";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const Room = () => {
  const {
    roomId: storeRoomId,
    peerId,
    participants,
    joinRoom,
    streams,
  } = useLobbyStore();
  const { roomId } = useParams();

  useEffect(() => {
    if (roomId && !storeRoomId) {
      joinRoom(roomId as string);
    }
  }, [roomId, storeRoomId, joinRoom]);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold underline">Room ID: {roomId}</h1>
      <p>Peer ID: {peerId}</p>
      <h2 className="text-2xl mt-4">Participants:</h2>
      <ul>
        {participants.map((participant) => (
          <li key={participant}>{participant}</li>
        ))}
      </ul>
      <Button onClick={() => console.log(participants)}>
        Get participants
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {streams.map(({ peerId, stream }) => (
          <div key={peerId}>
            <h3 className="text-xl">Stream: {peerId}</h3>
            {/* <VideoStream peerId={peerId} stream={stream} /> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Room;
