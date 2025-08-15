"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/app/lib/config";
import { redirect } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

 
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const response= await axios.post(`${BACKEND_URL}/api/v1/signin`,{
      username,
      password
    })
    if(response.status==200){
      toast.success(`welcome to loomify ${username} ${response.data}`)
      redirect("/")
    }else{
      toast.error("wrong credentials",)
    }
    console.log({ username, password })
    
  };

  return (
    <div className="space-y-4 max-w-lg w-2xl">
      <Toaster/>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full">
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
            className="text-xl font-semibold  drop-shadow-[0_0_10px_rgba(5,15,35,1)] italic"
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

        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
        <p className="text-md font-light text-white">
          Dont have an account? <Link href={"/auth/signup"}>Sign Up</Link>{" "}
        </p>
    </div>
  );
}
export default SignIn;
