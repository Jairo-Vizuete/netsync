// "use client";
// import { createRef, useEffect, useRef, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import useRoomStore from "@/store/roomStore";
// import { Button } from "@/components/ui/button";
// import axios from "axios";

// const Room: React.FC = () => {
//   const { roomId } = useParams();
//   const router = useRouter();
//   const {
//     roomId: storeRoomId,
//     participants,
//     setParticipants,
//     addParticipant,
//     removeParticipant,
//     peer,
//     stream,
//     addConnection,
//     removeConnection,
//     ws,
//   } = useRoomStore();

//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const [remoteVideoRefs, setRemoteVideoRefs] = useState<
//     Record<string, React.RefObject<HTMLVideoElement>>
//   >({});

//   useEffect(() => {
//     if (!storeRoomId || !peer || !stream) {
//       router.push("/");
//     } else {
//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = stream;
//       }

//       ws.emit("join-room", { roomId: storeRoomId, peerId: peer.id });

//       ws.on("get-users", ({ participants }: { participants: string[] }) => {
//         setParticipants(participants.filter(p => p)); // Evitar entradas vacías
//       });

//       ws.on("user-joined", ({ peerId }: { peerId: string }) => {
//         addParticipant(peerId);
//         if (peer) {
//           const call = peer.call(peerId, stream);
//           call.on("stream", (remoteStream) => {
//             setRemoteVideoRefs((prevRefs) => {
//               const videoRef = prevRefs[peerId] || createRef<HTMLVideoElement>();
//               return { ...prevRefs, [peerId]: videoRef };
//             });
//             remoteStreamMap.current[peerId] = remoteStream;
//           });
//           addConnection(peerId, call);
//         }
//       });

//       ws.on("user-disconnected", ({ peerId }: { peerId: string }) => {
//         removeParticipant(peerId);
//         removeConnection(peerId);
//         setRemoteVideoRefs((prevRefs) => {
//           const { [peerId]: _, ...newRefs } = prevRefs;
//           return newRefs;
//         });
//       });

//       peer.on("call", (call) => {
//         call.answer(stream);
//         call.on("stream", (remoteStream) => {
//           setRemoteVideoRefs((prevRefs) => {
//             const videoRef = prevRefs[call.peer] || createRef<HTMLVideoElement>();
//             return { ...prevRefs, [call.peer]: videoRef };
//           });
//           remoteStreamMap.current[call.peer] = remoteStream; // Store remoteStream in a map to use later
//         });
//         addConnection(call.peer, call);
//       });

//       return () => {
//         ws.off("get-users");
//         ws.off("user-joined");
//         ws.off("user-disconnected");
//       };
//     }
//   }, [
//     storeRoomId,
//     peer,
//     stream,
//     ws,
//     router,
//     setParticipants,
//     addParticipant,
//     removeParticipant,
//     addConnection,
//     removeConnection,
//   ]);

//   // Update the video elements once the refs are set
//   useEffect(() => {
//     Object.entries(remoteVideoRefs).forEach(([peerId, videoRef]) => {
//       if (videoRef.current && remoteStreamMap.current[peerId]) {
//         videoRef.current.srcObject = remoteStreamMap.current[peerId];
//       }
//     });
//   }, [remoteVideoRefs]);

//   const remoteStreamMap = useRef<Record<string, MediaStream>>({});

//   const getParticipants = async () => {
//     const { data } = await axios.get(
//       "http://localhost:3000/lobby/participants"
//     );
//     console.log(data);
//   };

//   return (
//     <main className="flex flex-col items-center p-4 space-y-5">
//       <p>Room ID: {storeRoomId}</p>
//       <p>User ID: {peer?.id}</p>
//       <div className="flex justify-center">
//         <video
//           ref={localVideoRef}
//           autoPlay
//           playsInline
//           className="w-1/2 h-1/2"
//         />
//       </div>
//       <div>
//         <h2 className="text-lg font-semibold mb-2">Participants:</h2>
//         <ul className="list-disc list-inside">
//           {participants.map((participant) => (
//             <li key={participant}>{participant}</li>
//           ))}
//         </ul>
//       </div>
//       <Button onClick={getParticipants}>Participants</Button>

//       <div className="flex justify-start">
//         {Object.entries(remoteVideoRefs).map(([peerId, videoRef]) => (
//           <div className="px-4" key={peerId}>
//             <video ref={videoRef} autoPlay playsInline className="w-20 h-20" />
//             <p>{peerId}</p>
//             <Button>Turn off camera</Button>
//             <Button>Turn off microphone</Button>
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// };

// export default Room;


"use client";
import { createRef, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useRoomStore from "@/store/lobbyStore";
import { Button } from "@/components/ui/button";
import axios from "axios";

const Room: React.FC = () => {
  const { roomId } = useParams();
  const router = useRouter();
  const {
    roomId: storeRoomId,
    // userId,
    participants,
    setParticipants,
    addParticipant,
    removeParticipant,
    peer,
    stream,
    addConnection,
    removeConnection,
    ws,
  } = useRoomStore();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [remoteVideoRefs, setRemoteVideoRefs] = useState<
    Record<string, React.RefObject<HTMLVideoElement>>
  >({});

  useEffect(() => {
    if (!storeRoomId || !peer || !stream) {
      router.push("/");
    } else {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      ws.emit("join-room", { roomId: storeRoomId, peerId: peer.id });

      ws.on("get-users", ({ participants }: { participants: string[] }) => {
        setParticipants(participants);
      });

      ws.on("user-joined", ({ peerId }: { peerId: string }) => {
        addParticipant(peerId);
        if (peer) {
          const call = peer.call(peerId, stream);
          call.on("stream", (remoteStream) => {
            setRemoteVideoRefs((prevRefs) => {
              const videoRef =
                prevRefs[peerId] || createRef<HTMLVideoElement>();
              return { ...prevRefs, [peerId]: videoRef };
            });
            remoteStreamMap.current[peerId] = remoteStream;
          });
          addConnection(peerId, call);
        }
      });

      ws.on("user-disconnected", ({ peerId }: { peerId: string }) => {
        removeParticipant(peerId);
        removeConnection(peerId);
        setRemoteVideoRefs((prevRefs) => {
          const { [peerId]: _, ...newRefs } = prevRefs;
          return newRefs;
        });
      });

      peer.on("call", (call) => {
        call.answer(stream);
        call.on("stream", (remoteStream) => {
          setRemoteVideoRefs((prevRefs) => {
            const videoRef =
              prevRefs[call.peer] || createRef<HTMLVideoElement>();
            return { ...prevRefs, [call.peer]: videoRef };
          });
          remoteStreamMap.current[call.peer] = remoteStream; // Store remoteStream in a map to use later
        });
        addConnection(call.peer, call);
      });

      return () => {
        ws.off("get-users");
        ws.off("user-joined");
        ws.off("user-disconnected");
      };
    }
  }, [
    storeRoomId,
    peer,
    stream,
    ws,
    router,
    setParticipants,
    addParticipant,
    removeParticipant,
    addConnection,
    removeConnection,
  ]);

  // Update the video elements once the refs are set
  useEffect(() => {
    Object.entries(remoteVideoRefs).forEach(([peerId, videoRef]) => {
      if (videoRef.current && remoteStreamMap.current[peerId]) {
        videoRef.current.srcObject = remoteStreamMap.current[peerId];
      }
    });
  }, [remoteVideoRefs]);

  const remoteStreamMap = useRef<Record<string, MediaStream>>({});

  const getParticipants = async () => {
    const { data } = await axios.get(
      "http://localhost:3000/lobby/participants"
    );
    console.log(data);
  };

  return (
    <main className="flex flex-col items-center p-4 space-y-5">
      <p>Room ID: {storeRoomId}</p>
      <p>User ID: {peer?.id}</p>
      <div className="flex justify-center">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          className="w-1/2 h-1/2"
        />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Participants:</h2>
        <ul className="list-disc list-inside">
          {participants.map((participant) => (
            <li key={participant}>{participant}</li>
          ))}
        </ul>
      </div>
      <Button onClick={getParticipants}>Participants</Button>

      <div className="flex justify-start">
        {Object.entries(remoteVideoRefs).map(([peerId, videoRef]) => (
          <div className="px-4" key={peerId}>
            <video ref={videoRef} autoPlay playsInline className="w-20 h-20" />
            <p>{peerId}</p>
            <Button>Turn off camera</Button>
            <Button>Turn off microphone</Button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Room;
