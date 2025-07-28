import { useAuthStore } from "@/store/useAuthStore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Navbar() {
  const { logout, authUser } = useAuthStore();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="relative z-50 flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2" onClick={() => navigate("/")}>
        <div className="size-7 rounded-full bg-gradient-to-br from-violet-900 to-pink-500" />
        <h1 className="text-base font-bold text-violet-900 dark:text-violet-100 md:text-2xl">Tasklyst</h1>
      </div>

      {authUser ? (
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={authUser?.avatar} alt={authUser?.username} />
                <AvatarFallback>
                  {authUser?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuItem onClick={() => navigate("/profile")}>
                Profile
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => navigate("/projects")}>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setOpenLogoutDialog(true)}
                className="text-red-600"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={openLogoutDialog} onOpenChange={setOpenLogoutDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Do you really want to logout?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. You’ll be logged out and will
                  need to log in again.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleLogout}>Logout</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <Button
          onClick={handleLogin}
          className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          Login
        </Button>
      )}
    </nav>
  );
}

export default Navbar;
