"use client";
import { useState } from "react";
import { Mail } from "lucide-react";

export default function EmailLink() {
  const [isOpen, setIsOpen] = useState(false);
  const email = "dpthk2024@gmail.com";

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    alert("Email copied to clipboard!");
    setIsOpen(false);
  };

  return (
    <div>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
        className="inline-flex items-center text-primary hover:underline cursor-pointer"
      >
        <Mail className="w-5 h-5 mr-1" />
        {email}
      </a>

      {isOpen && (
        <div className=" fixed inset-0 bg-green-800 bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Contact via Email</h2>
            <div className="flex flex-col gap-3">
              <button
                onClick={copyEmail}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Copy Email
              </button>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=dpthk2024@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-center"
              >
                Open Gmail
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
