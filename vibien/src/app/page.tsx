'use client';

import { Button, Link } from "@nextui-org/react";

export default function Home() {
  return (
    <div className="overlay-background">
      <div className="content">
        <h1 className="header-featured">
          Aiming at <span className="gradient-text">preserving</span><br />
          the legacy of Vietnamese classical texts.
        </h1>
        <p className="para-featured text-[#000000] max-w-lg">
          Vi Biên Thư Khố (<span className="chineseText">韋編書庫</span>) is a digital library dedicated to the accessibility of Vietnam's classical literature.
        </p>
        <Button as={Link} size="lg" radius="full" className="bg-gradient-to-tr from-[#0056b3] to-[#0070f3] text-white shadow-lg" href="/library">Get Started</Button>
      </div>
    </div>
  );
}
