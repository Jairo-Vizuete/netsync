"use client";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useLobbyStore from "@/store/lobbyStore";
import RoomCard from "@/components/room-card";
import axios from "axios";

const Lobby = () => {
  const router = useRouter();
  const { createRoom, roomId, fetchPeers, rooms } = useLobbyStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchPeers();
    }
  }, [fetchPeers, router]);

  useEffect(() => {
    if (roomId) {
      router.push(`/room/${roomId}`);
    }
  }, [roomId, router]);

  return (
    <main className="flex flex-col min-h-screen items-center justify-center space-y-5">
      <Button onClick={createRoom}>Create new room</Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {rooms.map((room) => (
          <RoomCard
            key={room.roomId}
            roomId={room.roomId}
            participants={room.participants}
          />
        ))}
      </div>
    </main>
  );
};

export default Lobby;

// "use client";
// import { Button } from "@/components/ui/button";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import useLobbyStore from "@/store/lobbyStore";
// import RoomCard from "@/components/RoomCard";

// const Lobby = () => {
//   const router = useRouter();
//   const { createRoom, roomId, fetchPeers, rooms } = useLobbyStore();

//   useEffect(() => {
//     if (roomId) {
//       router.push(`/room/${roomId}`);
//     }
//   }, [roomId, router]);

//   useEffect(() => {
//     fetchPeers();
//   }, [fetchPeers]);

//   return (
//     <main className="flex flex-col min-h-screen items-center justify-center space-y-5">
//       Lobby
//       <Button onClick={createRoom}>Create new room</Button>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//         {rooms.map((room) => (
//           <RoomCard
//             key={room.roomId}
//             roomId={room.roomId}
//             participants={room.participants}
//           />
//         ))}
//       </div>
//     </main>
//   );
// };

// export default Lobby;
