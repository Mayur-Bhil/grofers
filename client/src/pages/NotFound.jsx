import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const NotFound = () => {
    const navigate = useNavigate();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [glitchActive, setGlitchActive] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        
        // Random glitch effect
        const glitchInterval = setInterval(() => {
            setGlitchActive(true);
            setTimeout(() => setGlitchActive(false), 200);
        }, 3000);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearInterval(glitchInterval);
        };
    }, []);

    const handleGoHome = () => {
        navigate('/');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                {/* Floating Particles */}
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`
                        }}
                    />
                ))}
                
                {/* Moving Gradient Orbs */}
                <div 
                    className="absolute w-96 h-96 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full opacity-20 blur-3xl animate-bounce"
                    style={{
                        left: `${mousePos.x / 10}%`,
                        top: `${mousePos.y / 10}%`,
                        transform: 'translate(-50%, -50%)'
                    }}
                />
                <div 
                    className="absolute w-64 h-64 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-30 blur-2xl animate-pulse"
                    style={{
                        right: `${mousePos.x / 15}%`,
                        bottom: `${mousePos.y / 15}%`,
                        transform: 'translate(50%, 50%)'
                    }}
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                {/* Glitch Effect Container */}
                <div className={`relative ${glitchActive ? 'animate-pulse' : ''}`}>
                    {/* Main 404 Text */}
                    <div className="relative mb-8">
                        <h1 className={`text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 leading-none select-none ${glitchActive ? 'blur-sm' : ''}`}>
                            404
                        </h1>
                        
                        {/* Glitch Layers */}
                        {glitchActive && (
                            <>
                                <h1 className="absolute inset-0 text-9xl md:text-[12rem] font-black text-red-500 opacity-70 animate-ping leading-none select-none">
                                    404
                                </h1>
                                <h1 className="absolute inset-0 text-9xl md:text-[12rem] font-black text-cyan-400 opacity-50 transform translate-x-1 leading-none select-none">
                                    404
                                </h1>
                            </>
                        )}
                    </div>

                    {/* Animated Robot/Astronaut */}
                    <div className="mb-8 relative">
                        <div className="text-8xl mb-4 animate-bounce">
                            🤖
                        </div>
                        <div className="absolute -top-2 -right-2 text-2xl animate-spin">
                            ⚡
                        </div>
                        <div className="absolute -bottom-2 -left-2 text-xl animate-ping">
                            💫
                        </div>
                    </div>

                    {/* Creative Error Messages */}
                    <div className="space-y-4 mb-8">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-pulse">
                            Page.exe Not Found
                        </h2>
                        <div className="bg-black bg-opacity-50 backdrop-blur-sm border border-cyan-400 rounded-lg p-6 font-mono text-left max-w-2xl mx-auto">
                            <div className="flex items-center mb-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                <span className="text-gray-400 text-sm ml-2">Terminal</span>
                            </div>
                            <div className="text-green-400">
                                <div className="mb-1">$ searching for page...</div>
                                <div className="mb-1">$ ERROR: Page not found in database</div>
                                <div className="mb-1">$ Suggestion: Try different coordinates</div>
                                <div className="flex items-center">
                                    <span>$ </span>
                                    <div className="w-2 h-5 bg-green-400 ml-1 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                        <button
                            onClick={handleGoHome}
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                            className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold text-lg rounded-full transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-pink-500/50"
                        >
                            <span className="relative z-10">🏠 Teleport Home</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                        
                        <button
                            onClick={handleGoBack}
                            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-full transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/50"
                        >
                            <span className="relative z-10">⏰ Time Travel Back</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </div>

                    {/* Fun Facts */}
                    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
                        <h3 className="text-xl font-semibold text-white mb-4">🎯 Fun Fact</h3>
                        <p className="text-gray-300 text-lg">
                            The HTTP 404 error was named after room 404 at CERN, where the World Wide Web was born. 
                            You're witnessing internet history! 🌐✨
                        </p>
                    </div>

                    {/* Quick Navigation */}
                    <div className="mt-8 pt-6 border-t border-white border-opacity-20">
                        <p className="text-gray-300 mb-4">🚀 Quick Navigation</p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            {[
                                { path: '/', label: '🏠 Home', color: 'from-green-400 to-blue-500' },
                                { path: '/search', label: '🔍 Search', color: 'from-yellow-400 to-orange-500' },
                                { path: '/dashboard', label: '📊 Dashboard', color: 'from-purple-400 to-pink-500' },
                                { path: '/login', label: '🔐 Login', color: 'from-indigo-400 to-purple-500' }
                            ].map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => navigate(link.path)}
                                    className={`px-4 py-2 bg-gradient-to-r ${link.color} text-white rounded-full hover:scale-105 transform transition-all duration-200 hover:shadow-lg`}
                                >
                                    {link.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default NotFound;