'use client';

import { useState } from 'react';
import { accommodations, districts } from '@/lib/data';
import { PageHeader } from '@/components/shared/PageHeader';
import { InfoCard } from '@/components/shared/InfoCard';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Filter, X, Hotel, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function AccommodationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const filteredAccommodations = accommodations.filter((accommodation) => {
    const matchesSearch =
      accommodation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accommodation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accommodation.location.toLowerCase().includes(searchTerm.toLowerCase());

    // Handle district matching - some accommodations might have specific district names
    // or generic ones. We'll try to match loosely.
    const matchesDistrict = !selectedDistrict ||
      accommodation.district === selectedDistrict ||
      accommodation.location.includes(selectedDistrict);

    return matchesSearch && matchesDistrict;
  });

  // Get accommodation count per district (approximate)
  const districtCounts = districts.map(district => ({
    ...district,
    count: accommodations.filter(a =>
      a.district === district.name || a.location.includes(district.name)
    ).length
  }));

  return (
    <div>
      <PageHeader
        title="Accommodation Guide"
        subtitle="Find the perfect place to stay, from luxurious resorts to cozy homestays."
      />
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Enhanced Search Bar */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search hotels, resorts, or locations..."
              className="pl-12 pr-4 h-14 text-lg border-2 focus:border-primary shadow-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-6 duration-700 delay-100">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Filter by Location</h3>
            {selectedDistrict && (
              <Badge variant="secondary" className="ml-2">
                {filteredAccommodations.length} results
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!selectedDistrict ? 'default' : 'outline'}
              onClick={() => setSelectedDistrict(null)}
              className={cn(
                "transition-all duration-300",
                !selectedDistrict && "shadow-lg scale-105"
              )}
            >
              <Hotel className="mr-2 h-4 w-4" />
              All Stays
              <Badge variant="secondary" className="ml-2">
                {accommodations.length}
              </Badge>
            </Button>
            {districtCounts.map((district) => (
              <Button
                key={district.id}
                variant={
                  selectedDistrict === district.name ? 'default' : 'outline'
                }
                onClick={() => setSelectedDistrict(district.name)}
                className={cn(
                  "transition-all duration-300 hover:scale-105",
                  selectedDistrict === district.name && "shadow-lg scale-105"
                )}
                disabled={district.count === 0}
              >
                {district.name}
                <Badge
                  variant={selectedDistrict === district.name ? "secondary" : "outline"}
                  className="ml-2"
                >
                  {district.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Results Section */}
        {filteredAccommodations.length > 0 ? (
          <>
            <div className="mb-6 flex items-center justify-between animate-in fade-in duration-500">
              <p className="text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredAccommodations.length}</span> {filteredAccommodations.length === 1 ? 'place' : 'places'} to stay
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAccommodations.map((accommodation, index) => (
                <div
                  key={accommodation.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <InfoCard item={accommodation} itemType="accommodation" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 animate-in fade-in zoom-in duration-500">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
              <Hotel className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No accommodations found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            {(searchTerm || selectedDistrict) && (
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDistrict(null);
                }}
                variant="outline"
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
