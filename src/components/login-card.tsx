"use client";
import React, { FC, FormEvent, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";

const LoginCard: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // const response = await axios.post("http://localhost:3000/auth/login", {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL_SERVER}/auth/login`,
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
      localStorage.setItem("token", response.data.access_token);
      router.push("/lobby");
      toast.success("User successfully logged in!");
    } catch (error) {
      toast.error(`Login failed ${error}`);
    }
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
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
            required
          />
        </div>
        <p>
          If you do not have an account please{" "}
          <a
            href="/register"
            className="text-blue-800 font-bold underline font-sans"
          >
            REGISTER NOW
          </a>
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={handleLogin}>Login</Button>
      </CardFooter>
    </Card>
  );
};

export default LoginCard;
