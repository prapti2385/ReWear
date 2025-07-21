// /src/components/Footer.js
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-center md:text-left mb-4 md:mb-0">
                        <h3 className="text-xl font-bold">ReWear</h3>
                        <p className="text-gray-500 mt-1">Sustainable Fashion Community</p>
                    </div>
                    <div className="flex space-x-6 text-gray-600">
                        <a href="#" className="hover:text-indigo-600">About</a>
                        <a href="#" className="hover:text-indigo-600">FAQ</a>
                        <a href="#" className="hover:text-indigo-600">Contact</a>
                        <a href="#" className="hover:text-indigo-600">Terms of Service</a>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-100 pt-6 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} ReWear. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;