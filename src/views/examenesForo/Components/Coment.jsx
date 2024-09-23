import React from "react";
import "tailwindcss/tailwind.css";

const Comment = ({ author, avatar, content, datetime }) => (
  <div className="relative flex items-start space-x-4 p-4 border-b">
    <img
      className="w-10 h-10 rounded-full"
      src={avatar}
      alt={author}
    />
    <div className="w-full">
      <div className="flex items-center justify-between">
        <span className="font-bold">{author}</span>
        <span className="text-sm text-gray-600">{datetime}</span>
      </div>
      <p className="mt-2">{content}</p>
    </div>
  </div>
);

export default Comment;
