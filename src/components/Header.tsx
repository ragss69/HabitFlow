import React from "react";

const Header = () => (
  <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7edf4] px-10 py-3">
    <div className="flex items-center gap-4 text-[#0d141c]">
      <div className="size-4">
        {/* Logo SVG */}
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* ...SVG path here... */}
        </svg>
      </div>
      <h2 className="text-[#0d141c] text-lg font-bold leading-tight tracking-[-0.015em]">Momentum</h2>
    </div>
    <div className="flex flex-1 justify-end gap-8">
      <div className="flex items-center gap-9">
        <a className="text-[#0d141c] text-sm font-medium leading-normal" href="#">Dashboard</a>
        <a className="text-[#0d141c] text-sm font-medium leading-normal" href="#">Explore</a>
        <a className="text-[#0d141c] text-sm font-medium leading-normal" href="#">Challenges</a>
        <a className="text-[#0d141c] text-sm font-medium leading-normal" href="#">Community</a>
      </div>
      <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#e7edf4] text-[#0d141c] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
        {/* Bell Icon SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
          {/* ...SVG path here... */}
        </svg>
      </button>
      <div
        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
        style={{
          backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBVqvecheRZ_cxqJUax77qPbhyE5h4hp-X38a5wdDWjHSa7NIO5ouwDDKJf8jYdNOZnoJEdED9-pDRtYhjzlurHv-6oqO21Pl-t2ecuigaleDXBwHnGQgytl7TdRwqLUozpCdNFYmBXCkelxCRfx57qQoJQmIFen055zjll5YQggbvFCcG7a4pz2R9792PMQbgT6GPhrTbYuNSlIEo8DL4DuccxeMTDkkQ2MxUPirpjfl7Pj3HZ8M2P_CE5V_s9UiQ_fhC2FKyJRjI")'
        }}
      ></div>
    </div>
  </header>
);

export default Header;
