import React from "react";

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        
        {/* LEFT */}
        <p>© {new Date().getFullYear()} Blog App</p>

        {/* RIGHT */}
        <div className="flex gap-6 mt-3 md:mt-0">
          <p className="hover:text-black cursor-pointer">Privacy</p>
          <p className="hover:text-black cursor-pointer">Terms</p>
          <p className="hover:text-black cursor-pointer">Contact</p>
        </div>

      </div>

    </footer>
  );
}

export default Footer;