// "use client";
// import Image from 'next/image';

// export default function StayInspired() {
//   return (
//     <section className="relative py-12 lg:py-20 overflow-hidden bg-gray-500">
//       {/* Background Image */}
//     <div className="absolute inset-0">
//         <Image
//           src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
//           alt="Cozy living room with books and sofa"
//           fill
//           className="object-cover"
//           priority
//           quality={90}
//         />
//         {/* Dark overlay */}
//         <div className="absolute inset-0 bg-black/60" />
//       </div>

//       {/* Content */}
//       <div className="relative z-10 w-full px-4 lg:px-8">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//           {/* Left side - Text */}
//           <div className="lg:max-w-lg">
//             <h2
//               className="text-white mb-4"
//               style={{
//                 fontFamily: "Playfair Display, serif",
//                 fontWeight: 400,
//                 fontSize: "48px",
//               }}
//             >
//               Stay Inspired
//             </h2>
//             <p className="text-white">
//               Subscribe to receive updates on new posts, exclusive offers, and
//               special content just for you.
//             </p>
//           </div>

//           {/* Right side - Email Form */}
//           <form
//             onSubmit={(e) => e.preventDefault()}
//             className="flex flex-col sm:flex-row gap-2 w-full max-w-md"
//           >
//             <input
//               type="email"
//               required
//               placeholder="E-mail"
//               className="w-full h-10 px-3 rounded-md border border-white bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
//             />
//             <button
//               type="submit"
//               className="px-3 py-1.5 border border-pink-500 text-white rounded-md hover:bg-white hover:text-[#1E3A8A] transition-all duration-300 text-sm md:text-[15px] font-medium whitespace-nowrap self-start sm:self-center"
//             >
//               Subscribe
//             </button>
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// }
// src/components/home/StayInspired.jsx (or .tsx)
"use client";
import Image from 'next/image';
import Link from 'next/link';

export default function StayInspired() {
  return (
    <section className="relative py-12 lg:py-20 overflow-hidden bg-gray-500">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Cozy living room with books and sofa"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12">
          {/* Left side - Text */}
          <div className="lg:max-w-2xl">
            <h2
              className="text-white mb-4"
              style={{
                fontFamily: "Playfair Display, serif",
                fontWeight: 400,
                fontSize: "48px",
                lineHeight: "1.1",
              }}
            >
              Stay Inspired
            </h2>
            <p className="text-white text-lg leading-relaxed">
              Have a question? Want to explore our collections or book a showroom visit?<br />
              We’d love to hear from you.
            </p>
          </div>

          {/* Right side - Contact Us Button */}
          <div className="flex justify-start lg:justify-end">
            <Link href="/contact" className="inline-block">
              <button className="group relative overflow-hidden px-9 py-3 bg-white text-[#1E3A8A] font-medium text-lg rounded-md transition-all duration-500 ease-out hover:shadow-2xl">

                {/* Main Text + Arrow */}
                <span className="relative z-10 flex items-center gap-3 transition-all duration-500 ">
                  Get in Touch
                  <svg
                    className="w-5 h-5 transition-all text-pink-500 duration-500 group-hover:translate-x-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}