import React from 'react';
import { Linkedin, Github } from 'lucide-react';

function Footer() {
    return (
        <footer className="w-full py-6 px-4 bg-white/5 border-t border-white/10 backdrop-blur-md rounded-xl">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="text-white text-sm mb-4 md:mb-0">
                    &copy; 2025 Janudi Risaka || 2433193
                </div>

                <div className="flex space-x-4 items-center">
                    <a
                        href="https://lk.linkedin.com/in/janudi-risaka-141223349"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-yellow-400 transition-colors duration-300"
                        aria-label="LinkedIn Profile"
                    >
                        <Linkedin className="w-5 h-5" />
                    </a>

                    <a
                        href="https://github.com/JanudiRisaka"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-yellow-400 transition-colors duration-300"
                        aria-label="GitHub Profile"
                    >
                        <Github className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
