import React from 'react';

function Header() {
  return (
    <header className="bg-prmptrwhite p-4">
      <div className="container mx-auto flex items-center gap-10 max-w-[1240px] px-4">
        <h1 className="text-2xl font-permanent text-brown3">PRMPTR</h1>
        <p className="text-sm text-brown3">Write more creative image prompts.</p>
      </div>
    </header>
  );
}

export default Header;
