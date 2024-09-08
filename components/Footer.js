import React from 'react'

export default function Footer() {
  return (
      <footer className="bg-gray-800 text-white py-8">
  <div className="container mx-auto px-6">
    <div className="flex flex-col md:flex-row justify-between items-center">
      <div className="text-center md:text-left">
        <h2 className="text-xl font-bold mb-2">SmartBudget</h2>
        <p className="text-gray-400">© {new Date().getFullYear()} Smart Budget. All rights reserved.</p>
      </div>
      <div className="flex flex-col md:flex-row gap-6 mt-6 md:mt-0">
        <a href="#about" className="hover:text-gray-400">About</a>
        <a href="#services" className="hover:text-gray-400">Services</a>
        <a href="#footer" className="hover:text-gray-400">Contact</a>
        <a href="#privacy" className="hover:text-gray-400">Privacy Policy</a>
      </div>
      <div className="mt-6 md:mt-0">
        <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300 mx-2">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 4.01a8.98 8.98 0 0 1-2.61.717 4.486 4.486 0 0 0 1.963-2.485 8.964 8.964 0 0 1-2.846 1.088 4.46 4.46 0 0 0-7.593 4.06A12.653 12.653 0 0 1 1.671 3.15 4.457 4.457 0 0 0 2.878 8.68a4.486 4.486 0 0 1-2.017-.56v.056a4.46 4.46 0 0 0 3.568 4.382 4.494 4.494 0 0 1-2.01.075 4.463 4.463 0 0 0 4.167 3.09A8.944 8.944 0 0 1 0 19.54a12.642 12.642 0 0 0 6.85 2.009c8.22 0 12.711-6.805 12.711-12.71 0-.194-.004-.388-.013-.582A9.04 9.04 0 0 0 22 4.01z"></path></svg>
        </a>
        <a href="https://linkedin.com/in/yourhandle" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300 mx-2">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5C4.98 2.12 6.12.99 7.5.99c1.39 0 2.52 1.13 2.52 2.51s-1.13 2.51-2.52 2.51c-1.39 0-2.52-1.13-2.52-2.51zM6.8 8h3.39V21H6.8V8zm7.62 0h3.39v2.86h.04c.47-1.07 1.63-2.19 3.37-2.19 3.6 0 4.27 2.37 4.27 5.46v6.88h-3.37v-6.29c0-1.5-.03-3.42-2.09-3.42-2.1 0-2.43 1.64-2.43 3.34v6.38H14.4V8z"></path></svg>
        </a>
      </div>
    </div>
  </div>
</footer>

  )
}
