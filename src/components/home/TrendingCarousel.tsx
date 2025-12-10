'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { type Item } from '@/lib/data';
import { InfoCard } from '@/components/shared/InfoCard';

export function TrendingCarousel({ attractions }: { attractions: Item[] }) {
    const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay({ delay: 4000 })]);

    return (
        <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
                {attractions.map((attraction) => (
                    <div key={attraction.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0 pl-4">
                        <div className="h-full transform hover:-translate-y-2 transition-transform duration-300">
                            <InfoCard item={attraction} itemType="attraction" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
