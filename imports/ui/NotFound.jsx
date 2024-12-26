import React from "react";

export default () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300">
      <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-lg w-full">
        <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-500 mb-6">
          Oops! It seems the page you are looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
};
