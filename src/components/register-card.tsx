"use client";
import React, { FC, FormEvent, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Label } from "@radix-ui/react-label";
import { toast } from "sonner";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const RegisterCard: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // await axios.post("http://localhost:3000/auth/register", {
      await axios.post(
        `${process.env.NEXT_PUBLIC_URL_SERVER}/auth/register`,
        {
          email,
          password,
        },
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );
      router.push("/");
      toast.success("User registered successfully!");
    } catch (error) {
      toast.error(`Registration failed: ${error}`);
    }
  };

  return (
    // <div className="container mx-auto">
    //   <h1 className="text-3xl font-bold underline">Register</h1>
    //   <form onSubmit={handleRegister} className="mt-4">
    //     <div>
    //       <label htmlFor="email">Email</label>
    //       <input
    //         id="email"
    //         type="email"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //         className="border rounded px-2 py-1"
    //         required
    //       />
    //     </div>
    //     <div className="mt-2">
    //       <label htmlFor="password">Password</label>
    //       <input
    //         id="password"
    //         type="password"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //         className="border rounded px-2 py-1"
    //         required
    //       />
    //     </div>
    //     <button
    //       type="submit"
    //       className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
    //     >
    //       Register
    //     </button>
    //   </form>
    // </div>
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Enter your credentials.</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded px-2 py-1"
            required
          />
        </div>
        <div className="mt-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded px-2 py-1"
            required
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={handleRegister}>Register</Button>
      </CardFooter>
    </Card>
  );
};

export default RegisterCard;
