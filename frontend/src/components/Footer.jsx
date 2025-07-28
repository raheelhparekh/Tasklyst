import { Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="relative z-50 mt-16 w-full border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left side: Brand + Copyright */}
        <div className="text-center md:text-left">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="size-6 rounded-full bg-gradient-to-br from-violet-900 to-pink-500" />
            <span className="text-xl font-semibold tracking-tight text-violet-900 dark:text-violet-100">
              Tasklyst
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Raheel. All rights reserved.
          </p>
        </div>

        {/* Center: Navigation */}
        <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-300">
          <button
            onClick={() => navigate("/")}
            className="hover:text-violet-500 transition"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/projects")}
            className="hover:text-violet-500 transition"
          >
            Projects
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="hover:text-violet-500 transition"
          >
            Contact
          </button>
        </div>

        {/* Right: Socials */}
        <div className="flex gap-3">
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/raheelhparekh"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-violet-500 transition" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://linkedin.com/in/raheelhparekh"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-violet-500 transition" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="mailto:rhparekh2003@gmail.com">
              <Mail className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-violet-500 transition" />
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
