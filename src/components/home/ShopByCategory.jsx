"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

function LargeCategoryCard({ title, desc, image, onClick }) {
  return (
    <div
      // onClick={onClick}
      className="group relative overflow-hidden aspect-[4/5] rounded-2xl  shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      {/* Image */}
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Text content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
        <h3 className="text-white text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-200 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default function ShopByCategory() {
  const router = useRouter();

  const categories = [
    {
      title: "Bone China Ceramic Dinnerware",
      desc: "Elegant handcrafted dinnerware that adds timeless charm and grace to your table setting.",
      image: "/serving.jpg",
    },
    {
      title: "Brass Dinner Sets",
      desc: "Traditional brass sets designed to bring a royal touch and classic elegance to your dining.",
      image: "/kitchenware.webp",
    },
    {
      title: "Gold-Plated Collection",
      desc: "Luxury gold-finished pieces that redefine sophistication and elegance on every dining table.",
      image: "/tableware1.webp",
    },
  ];


  return (
    <section id="category" className="py-12 lg:py-16 bg-background">
      <div className="w-full px-4 lg:px-8">
        <div className="relative inline-block mb-12">
          <h1
            className=" text-[#172554] pb-3"
            style={{
              fontFamily: "Playfair Display, serif",
              fontWeight: 400,
              fontSize: "48px",
            }}
          >
            Shop by Category
          </h1>
          <div className="absolute left-0 bottom-0 h-1 bg-pink-500 rounded-full w-full"></div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <LargeCategoryCard
              key={index}
              title={category.title}
              desc={category.desc}
              image={category.image}
              onClick={() =>
                router.push(`/products?category=${encodeURIComponent(category.title)}`)
              }

            />
          ))}
        </div>
      </div>
    </section>
  );
}
