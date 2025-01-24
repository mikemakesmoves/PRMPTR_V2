function Footer() {
    return (
      <footer className="h-[50px] bg-prmptrblack text-prmptrwhite font-medium">
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-10 h-full flex items-center justify-between">
          <p className="opacity-100 text-brown2 font-permanent">© PRMPTR 2025</p>
          <p className="flex items-center gap-2">
            Made with <span>❤️</span> <span>🤖</span><span>🐐</span> by 
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