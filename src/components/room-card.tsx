import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RoomCardProps {
  roomId: string;
  participants: string[];
}

const RoomCard: React.FC<RoomCardProps> = ({ roomId, participants }) => {
  const router = useRouter();

  const handleJoin = () => {
    router.push(`/room/${roomId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Room ID: {roomId}</CardTitle>
        <CardDescription>Participants:</CardDescription>
      </CardHeader>
      <CardContent>
        {participants.map((participant) => (
          <li key={participant}>{participant}</li>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleJoin}>Join Room</Button>
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
