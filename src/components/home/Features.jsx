"use client";

import { Truck, Globe, Leaf, Hammer } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Enjoy complimentary shipping on all orders over €150 across Europe.",
  },
  {
    icon: Globe,
    title: "Made in Denmark",
    description: "Our products are proudly crafted in Denmark, ensuring authenticity and quality.",
  },
  {
    icon: Leaf,
    title: "Sustainable",
    description: "Each item is handcrafted by skilled artisans, reflecting our dedication to craftsmanship.",
  },
  {
    icon: Hammer,
    title: "Handcrafted",
    description: "We prioritize eco-friendly materials and sustainable practices in all our designs.",
  },
];

export default function Features() {
  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="w-full px-4 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center lg:text-left">
                <div className="flex justify-center lg:justify-start mb-4">
                  <Icon
                    className="w-10 h-10 text-pink-400"
                    strokeWidth={1}      
                  />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[#172554]">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}