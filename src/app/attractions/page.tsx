'use client';

import { useState, Suspense, useEffect } from 'react';
import { attractions, districts } from '@/lib/data';
import { PageHeader } from '@/components/shared/PageHeader';
import { InfoCard } from '@/components/shared/InfoCard';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useSearchParams } from 'next/navigation';

function AttractionsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const categories = ['Beach', 'Hill Station', 'Backwater', 'Heritage', 'Wildlife', 'Waterfall', 'Temple'];


  const filteredAttractions = attractions.filter((attraction) => {
    const matchesSearch =
      attraction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attraction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attraction.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = !selectedDistrict || attraction.district === selectedDistrict;
    // Mock category/budget matching since data might not have these fields yet
    const matchesCategory = !selectedCategory || (attraction.description + attraction.name).toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesDistrict && matchesCategory;
  });

  // Get attraction count per district
  const districtCounts = districts.map(district => ({
    ...district,
    count: attractions.filter(a => a.district === district.name).length
  }));

  return (
    <div>
      <PageHeader
        title="Explore Kerala"
        subtitle="Find your perfect destination with our curated collection of wonders."
      />
      <div className="container mx-auto px-4 py-8 md:py-12">

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-1/4 space-y-8 h-fit lg:sticky lg:top-24">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* District Filter */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Districts
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                <Button
                  variant={!selectedDistrict ? 'secondary' : 'ghost'}
                  className="w-full justify-start font-normal"
                  onClick={() => setSelectedDistrict(null)}
                >
                  All Districts
                  <span className="ml-auto text-xs text-muted-foreground">{attractions.length}</span>
                </Button>
                {districtCounts.map((district) => (
                  <Button
                    key={district.id}
                    variant={selectedDistrict === district.name ? 'secondary' : 'ghost'}
                    className="w-full justify-start font-normal"
                    onClick={() => setSelectedDistrict(district.name)}
                    disabled={district.count === 0}
                  >
                    {district.name}
                    <span className="ml-auto text-xs text-muted-foreground">{district.count}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4" /> Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Badge
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Budget Filter */}


            {/* Clear Filters */}
            {(searchTerm || selectedDistrict || selectedCategory) && (
              <Button
                variant="outline"
                className="w-full border-dashed"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDistrict(null);
                  setSelectedCategory(null);
                }}
              >
                <X className="mr-2 h-4 w-4" /> Clear Filters
              </Button>
            )}
          </aside>

          {/* Main Content Grid */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {selectedDistrict || 'All Destinations'}
                <span className="text-muted-foreground font-normal text-base ml-2">({filteredAttractions.length} places)</span>
              </h2>
            </div>

            {filteredAttractions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAttractions.map((attraction, index) => (
                  <div
                    key={attraction.id}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <InfoCard item={attraction} itemType="attraction" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed rounded-lg">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No matches found</h3>
                <p className="text-muted-foreground">Try widening your search criteria.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function AttractionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AttractionsContent />
    </Suspense>
  );
}
