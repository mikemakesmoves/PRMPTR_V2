function Footer() {
    return (
      <footer className="h-[100px] bg-prmptrblack text-prmptrwhite font-medium mt-8 md:mt-12">
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-10 h-full flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="opacity-100 text-brown2 font-permanent whitespace-nowrap order-1">© PRMPTR 2025</p>
          
          <p className="flex items-center gap-2 whitespace-nowrap order-2 text-sm">
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