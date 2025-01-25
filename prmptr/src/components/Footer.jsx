function Footer() {
    return (
      <footer className="h-[100px] bg-prmptrblack text-prmptrwhite font-medium">
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-10 h-full flex flex-col md:flex-row items-center justify-center md:justify-between gap-2 md:gap-0">
          <p className="opacity-100 text-brown2 font-permanent whitespace-nowrap">© PRMPTR 2025</p>
          <p className="flex items-center gap-2 whitespace-nowrap text-sm md:text-base">
            Made with <span className="flex gap-1"><span>❤️</span><span>🤖</span><span>🐐</span></span> by
            <a 
              href="https://www.mikemakesmoves.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-green1 hover:text-green2 transition-colors duration-200 ml-1"
            >
              Mike Gaynor
            </a>
          </p>
        </div>
      </footer>
    );
  }
  
  export default Footer;