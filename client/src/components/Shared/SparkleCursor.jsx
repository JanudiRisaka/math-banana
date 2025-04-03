// import React, { useRef, useEffect } from 'react';

// const SimpleCursor = () => {
//   const cursorRef = useRef(null);
//   const pos = useRef({ x: 0, y: 0 });

//   useEffect(() => {
//     const cursor = cursorRef.current;
//     if (!cursor) return;

//     // Update cursor position using requestAnimationFrame
//     const updatePosition = () => {
//       cursor.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
//       requestAnimationFrame(updatePosition);
//     };
//     updatePosition();

//     // Mouse move handler
//     const handleMouseMove = (e) => {
//       pos.current.x = e.clientX;
//       pos.current.y = e.clientY;
//     };

//     // Visibility handlers
//     const handleHide = () => cursor.style.opacity = '0';
//     const handleShow = () => cursor.style.opacity = '1';

//     window.addEventListener('mousemove', handleMouseMove);
//     document.addEventListener('mouseleave', handleHide);
//     document.addEventListener('mouseenter', handleShow);

//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('mouseleave', handleHide);
//       document.removeEventListener('mouseenter', handleShow);
//     };
//   }, []);

//   if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
//     return null;
//   }

//   return (
//     <div
//       ref={cursorRef}
//       className="fixed pointer-events-none z-[9999] w-4 h-4 bg-transparent border-2 border-black rounded-full"
//       style={{
//         left: 0,
//         top: 0,
//         transform: 'translate(-100px, -100px)',
//         transition: 'transform 0.1s',
//         willChange: 'transform',
//         opacity: 1,
//       }}
//     />
//   );
// };

// export default SimpleCursor;