import { create } from "zustand";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import Peer from "peerjs";
import axios from "axios";

// const WS_URL = "http://localhost:3000";
const WS_URL = process.env.NEXT_PUBLIC_URL_SERVER as string;
export const ws = io(WS_URL, {
  transports: ["websocket"],
  extraHeaders: {
    "ngrok-skip-browser-warning": "true",
  },
});

// const PEER_SERVER_CONFIG = {
//   host: "localhost",
//   port: 9000,
//   path: "/",
// };

const PEER_SERVER_CONFIG = {
  host: process.env.NEXT_PUBLIC_PEER_SERVER,
  port: 443,
  path: "/",
  secure: true,
  config: {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  },
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
};

interface StreamData {
  peerId: string;
  stream: MediaStream;
}

interface RoomData {
  roomId: string;
  participants: string[];
}

interface LobbyState {
  roomId: string | null;
  peerId: string | null;
  peer: Peer | null;
  participants: string[];
  streams: StreamData[];

  rooms: RoomData[];

  createRoom: () => void;
  joinRoom: (roomId: string) => void;
  addStream: (peerId: string, stream: MediaStream) => void;
  removeStream: (peerId: string) => void;
  fetchPeers: () => Promise<void>;

  toggleCamera: (peerId: string) => void;
  toggleMicrophone: (peerId: string) => void;
}

const useLobbyStore = create<LobbyState>((set, get) => ({
  roomId: null,
  peerId: null,
  peer: null,
  participants: [],
  streams: [],
  rooms: [],

  createRoom: () => {
    ws.emit("create-room");
    ws.on("room-created", ({ roomId }: { roomId: string }) => {
      set({ roomId });
      get().joinRoom(roomId);
    });
  },

  joinRoom: (roomId) => {
    const peerId = uuidv4();
    const peer = new Peer(peerId, PEER_SERVER_CONFIG);
    set({ peerId, peer });
    ws.emit("join-room", { roomId, peerId });

    peer.on("call", (call) => {
      const localStream = get().streams.find(
        (stream) => stream.peerId === get().peerId
      )?.stream;
      if (localStream) {
        call.answer(localStream);
        call.on("stream", (remoteStream) => {
          get().addStream(call.peer, remoteStream);
        });
      }
    });

    ws.on("get-peers", ({ peers }: { peers: string[] }) => {
      set({ participants: peers });

      const localStream = get().streams.find(
        (stream) => stream.peerId === get().peerId
      )?.stream;
      if (localStream) {
        peers.forEach((existingPeerId) => {
          if (existingPeerId !== peerId) {
            const call = peer.call(existingPeerId, localStream);
            call.on("stream", (remoteStream) => {
              get().addStream(existingPeerId, remoteStream);
            });
          }
        });
      }
    });

    // navigator.mediaDevices
    //   .getUserMedia({ video: true, audio: true })
    //   .then((stream) => {
    //     get().addStream(peerId, stream);
    //     const peers = get().participants;
    //     peers.forEach((existingPeerId) => {
    //       if (existingPeerId !== peerId) {
    //         const call = peer.call(existingPeerId, stream);
    //         call.on("stream", (remoteStream) => {
    //           get().addStream(existingPeerId, remoteStream);
    //         });
    //       }
    //     });
    //   })
    //   .catch((err) => console.error("Failed to get local stream", err));
  },

  addStream: (peerId, stream) =>
    set((state) => ({
      streams: [
        ...state.streams.filter((s) => s.peerId !== peerId),
        { peerId, stream },
      ],
    })),

  removeStream: (peerId) =>
    set((state) => ({
      streams: state.streams.filter((s) => s.peerId !== peerId),
    })),

  fetchPeers: async () => {
    try {
      // const { data } = await axios.get("http://localhost:3000/lobby/peers");
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_URL_SERVER}/lobby/peers`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      console.log(data);
      set({ rooms: data });
    } catch (error) {
      console.error("Failed to fetch rooms", error);
    }
  },

  toggleCamera: (peerId) => {
    set((state) => {
      const streamData = state.streams.find((s) => s.peerId === peerId);
      if (streamData) {
        const videoTrack = streamData.stream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.enabled = !videoTrack.enabled;
        }
      }
      return { ...state };
    });
  },

  toggleMicrophone: (peerId) => {
    set((state) => {
      const streamData = state.streams.find((s) => s.peerId === peerId);
      if (streamData) {
        const audioTrack = streamData.stream.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = !audioTrack.enabled;
        }
      }
      return { ...state };
    });
  },
}));

export default useLobbyStore;

// import { create } from "zustand";
// import { v4 as uuidV4 } from "uuid";
// import socketIOClient, { io, Socket } from "socket.io-client";
// import Peer, { DataConnection, MediaConnection } from "peerjs";

// // const WS_URL = "https://29b6-186-5-127-22.ngrok-free.app";
// const WS_URL = "http://localhost:3000";

// const PEER_SERVER_CONFIG = {
//   host: "localhost",
//   port: 9000,
//   path: "/",
//   // secure: true,
// };
// // const PEER_SERVER_CONFIG = {
// //   host: "1785-186-5-127-22.ngrok-free.app",
// //   port: 443,
// //   path: "/",
// //   secure: true,
// // };

// // const ws = socketIOClient(WS_URL, {
// //   secure: true, // Asegúrate de que esté configurado para HTTPS
// //   rejectUnauthorized: false, // Solo para desarrollo, no usar en producción
// // });
// const ws = socketIOClient(WS_URL);

// interface RoomState {
//   ws: Socket;
//   roomId?: string;
//   userId?: string;
//   peer?: Peer;
//   stream?: MediaStream;
//   participants: string[];
//   connections: Record<string, DataConnection | MediaConnection>;
//   createRoom: () => void;
//   joinRoom: (roomId: string) => void;
//   setParticipants: (participants: string[]) => void;
//   addParticipant: (peerId: string) => void;
//   removeParticipant: (peerId: string) => void;
//   addConnection: (
//     peerId: string,
//     connection: DataConnection | MediaConnection
//   ) => void;
//   removeConnection: (peerId: string) => void;
//   setStream: (stream: MediaStream) => void;
// }

// const useRoomStore = create<RoomState>((set, get) => ({
//   ws: ws,
//   roomId: undefined,
//   userId: undefined,
//   peer: undefined,
//   stream: undefined,
//   participants: [],
//   connections: {},

//   createRoom: async () => {
//     const userId = uuidV4();
//     const peer = new Peer(userId, PEER_SERVER_CONFIG);
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     set({ userId, peer, stream });

//     ws.emit("create-room");
//     ws.on("room-created", ({ roomId }: { roomId: string }) => {
//       set({ roomId });
//     });
//   },

//   joinRoom: async (roomId: string) => {
//     const userId = uuidV4();
//     const peer = new Peer(userId, PEER_SERVER_CONFIG);
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     set({ roomId, userId, peer, stream });
//     // ws.emit("join-room", { roomId, peerId: userId });
//   },

//   setParticipants: (participants: string[]) => {
//     set({ participants: Array.from(new Set(participants)) });
//   },

//   addParticipant: (peerId: string) => {
//     set((state) => ({
//       participants: Array.from(new Set([...state.participants, peerId])),
//     }));
//   },

//   removeParticipant: (peerId: string) => {
//     set((state) => ({
//       participants: state.participants.filter((p) => p !== peerId),
//     }));
//   },

//   addConnection: (
//     peerId: string,
//     connection: DataConnection | MediaConnection
//   ) => {
//     set((state) => ({
//       connections: { ...state.connections, [peerId]: connection },
//     }));
//   },

//   removeConnection: (peerId: string) => {
//     set((state) => {
//       const newConnections = { ...state.connections };
//       delete newConnections[peerId];
//       return { connections: newConnections };
//     });
//   },

//   setStream: (stream: MediaStream) => {
//     set({ stream });
//   },
// }));

// export default useRoomStore;
