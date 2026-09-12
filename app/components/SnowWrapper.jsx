"use client";

import dynamic from "next/dynamic";

const Snow = dynamic(() => import("./Snow"), { ssr: false });

export default function SnowWrapper() {
  const isDecember = new Date().getMonth() === 11;

  if (!isDecember) return null;

  return <Snow />;
}
