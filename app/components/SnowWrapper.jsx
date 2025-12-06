"use client";

import dynamic from "next/dynamic";

const Snow = dynamic(() => import("./Snow"), { ssr: false });

export default function SnowWrapper() {
  return <Snow />;
}
