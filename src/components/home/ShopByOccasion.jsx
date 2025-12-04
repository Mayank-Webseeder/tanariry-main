
'use client';

import Image from 'next/image';
import Link from 'next/link';

export function OccasionCards({ clickable = false }) {
  const occasions = [
    {
      title: 'Tea Set',
      image: 'https://images.unsplash.com/photo-1698280954292-c955f882486f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2Zhc3QlMjB0YWJsZSUyMHNldHRpbmd8ZW58MXx8fHwxNzYwMzQ3NDIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      link: '/products?category=tea-set',
    },
    {
      title: 'Dinner Set',
      image: 'https://images.unsplash.com/photo-1634864418654-f0c877ad7897?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdW5jaCUyMGRpbmluZyUyMHRhYmxlfGVufDF8fHx8MTc2MDM0NzQyMnww&ixlib=rb-4.1.0&q=80&w=1080',
      link: '/products?category=dinner-set',
    },
    {
      title: 'Coffee Mugs',
      image: '/menu2.jpg',
      link: '/products?category=coffee-mugs',
    },
    {
      title: 'Cups & Saucers',
      image: 'https://images.unsplash.com/photo-1668365139546-fee374c0b678?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWElMjB0aW1lJTIwY3JvY2tlcnl8ZW58MXx8fHwxNzYwMzQ3NDIzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      link: '/products?category=cups-saucers',
    },
    {
      title: 'Milk Pot/Sugar Pot',
      image: 'https://images.unsplash.com/photo-1551807306-69951ee44e70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwcGxhdGUlMjBjZXJhbWljfGVufDF8fHx8MTc2MDM0NzQyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      link: '/products?category=pots',
    },
    {
      title: 'Accessories',
      image: 'https://images.unsplash.com/photo-1759629523494-b342430f2100?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBldGl6ZXIlMjBzZXJ2aW5nJTIwZGlzaHxlbnwxfHx8fDE3NjAzNDc0MjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      link: '/products?category=accessories',
    },
  ];

  const Card = ({ occasion }) => (
    <div className="group relative overflow-hidden aspect-[3/4] rounded-md">
      <div className="relative w-full h-full">
        <Image
          src={occasion.image}
          alt={occasion.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16.66vw"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
          {occasion.title}
        </h3>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
      {occasions.map((occasion, index) =>
        clickable ? (
          <Link key={index} href={occasion.link} className="block">
            <Card occasion={occasion} />
          </Link>
        ) : (
          <Card key={index} occasion={occasion} />
        )
      )}
    </div>
  );
}


export default function ShopByOccasion() {
  return (
    <section id="occasion" className="py-12 lg:py-16">
      <div className="w-full px-4 lg:px-8">
  
        <div className="relative mb-12 inline-block">
          <h2
            className="text-3xl text-[#172554] pb-3"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 400,
              fontSize: '48px',
            }}
          >
            Shop by Occasion
          </h2>
          <div className="absolute left-0 bottom-0 h-1 bg-pink-300 rounded-full w-full"></div>
        </div>

        {/* Reusable Cards */}
        <OccasionCards clickable={true} />
      </div>
    </section>
  );
}