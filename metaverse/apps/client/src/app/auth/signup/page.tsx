"use client";
import { BACKEND_URL } from "@/app/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("user");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await axios.post(`${BACKEND_URL}/`, {
      username,
      password,
      role
    });
    console.log(response.data)
    console.log({ username, password });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg w-2xl">
        <div>
          <Label htmlFor="username" className="text-xl font-semibold italic">
            Username
          </Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
            className="text-black"
          />
        </div>

        <div>
          <Label
            htmlFor="password"
            className="text-xl font-semibold drop-shadow-[0_0_10px_rgba(5,15,35,1)] italic"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            className="text-black"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>

        <div className="flex flex-col  ">
          <Label className="text-xl font-semibold italic">Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent className="bg-blend-overlay border-black">
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
      <p className="text-md font-light text-white">
        Already have an account? <Link href={"/auth/signin"}>Sign In</Link>{" "}
      </p>
    </div>
  );
}
export default SignUp;
