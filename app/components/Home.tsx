"use client";

import React from "react";

const Home = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-2">
      <div className="flex items-center justify-center w-full h-screen font-semibold text-2xl text-rose-500">
        Status Activated {count}
      </div>

      <div
        className="cursor-pointer px-4 py-2 rounded bg-rose-600 text-white text-xl"
        onClick={() => setCount((count) => (count += 1))}
      >
        Plus
      </div>
      <div
        className="cursor-pointer px-4 py-2 rounded bg-rose-600 text-white text-xl"
        onClick={() => setCount((count) => (count -= 1))}
      >
        Min
      </div>
    </div>
  );
};

export default Home;
