

import { attractions } from '@/lib/data';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Clock,
  Ban,
  Shirt,
  Ticket,
  Users,
  Star,
  MessageCircleWarning,
  Lightbulb,
  Map,
  Plane,
  Train,
  Bus,
  Waves,
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import fs from 'fs/promises';
import path from 'path';
import { MapView } from '@/components/shared/MapView';
import { SaveButton } from '@/components/shared/SaveButton';

async function getAttractionDetails(id: string) {
  const filePath = path.join(
    process.cwd(),
    'src',
    'lib',
    'data',
    'attractions',
    `${id}.json`
  );
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    return null;
  }
}

function FallbackView({ item }: { item: any }) {
  const singleImage = PlaceHolderImages.find((p) => p.id === item.imageId);
  return (
    <div>
      <PageHeader title={item.name} subtitle={item.description} />
      <div className="container mx-auto px-4 py-8">
        {singleImage && (
          <div className="relative h-96 w-full overflow-hidden rounded-lg shadow-xl mb-8">
            <Image
              src={singleImage.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              data-ai-hint={singleImage.imageHint}
            />
          </div>
        )}
        <Card>
          <CardHeader>
            <CardTitle>More Information Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Detailed information for this attraction is being prepared and
              will be available shortly.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default async function AttractionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const item = attractions.find((a) => a.id === id);

  if (!item) {
    notFound();
  }

  // Always check if there are details to fetch first
  if (!item.hasDetails) {
    return <FallbackView item={item} />;
  }

  const detailData = await getAttractionDetails(id);

  // If after checking, the detail file doesn't exist, show fallback
  if (!detailData) {
    return <FallbackView item={item} />;
  }

  // If we have detailData, proceed to render the full detailed view
  const attractionImages = (detailData.images || [])
    .map((imageId: string) => PlaceHolderImages.find((p) => p.id === imageId))
    .filter(Boolean);

  const position =
    detailData.location.latitude && detailData.location.longitude
      ? {
        lat: detailData.location.latitude,
        lng: detailData.location.longitude,
      }
      : null;

  return (
    <div>
      <PageHeader
        title={detailData.name}
        subtitle={detailData.history.short_description}
      >
        <SaveButton item={item} itemType="attraction" variant="full" />
      </PageHeader>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {attractionImages.length > 0 ? (
          <div className="mb-8 lg:mb-12">
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {attractionImages.map((image: any, index: number) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-[16/9] items-center justify-center p-0 overflow-hidden rounded-lg">
                          {image && (
                            <Image
                              src={image.imageUrl}
                              alt={image.description}
                              width={1280}
                              height={720}
                              className="w-full h-full object-cover"
                              data-ai-hint={image.imageHint}
                            />
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="ml-16" />
              <CarouselNext className="mr-16" />
            </Carousel>
          </div>
        ) : (
          item.imageId && (
            <div className="relative h-96 w-full overflow-hidden rounded-lg shadow-xl mb-8">
              <Image
                src={PlaceHolderImages.find(p => p.id === item.imageId)?.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                alt={item.name}
                fill
                className="object-cover"
                data-ai-hint={PlaceHolderImages.find(p => p.id === item.imageId)?.imageHint}
              />
            </div>
          )
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>History & Significance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {detailData.history.detailed}
                </p>
                <Separator />
                {detailData.significance.religious && (
                  <div>
                    <h4 className="font-semibold mb-2">
                      Religious Significance
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {detailData.significance.religious}
                    </p>
                  </div>
                )}
                {detailData.significance.cultural && (
                  <div>
                    <h4 className="font-semibold mb-2">
                      Cultural Significance
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {detailData.significance.cultural}
                    </p>
                  </div>
                )}
                {detailData.significance.tourism && (
                  <div>
                    <h4 className="font-semibold mb-2">
                      Tourism Significance
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {detailData.significance.tourism}
                    </p>
                  </div>
                )}
                {detailData.significance.heritage && (
                  <div>
                    <h4 className="font-semibold mb-2">Heritage Significance</h4>
                    <p className="text-sm text-muted-foreground">
                      {detailData.significance.heritage}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visitor Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {detailData.visitor_info.timings && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 mt-1 text-primary" />
                      <div>
                        <h4 className="font-semibold">Timings</h4>
                        <ul className="text-sm text-muted-foreground list-disc pl-4 mt-1">
                          {detailData.visitor_info.timings.map((t: any) => (
                            <li key={t.session}>
                              <strong>{t.session}:</strong> {t.start_time} -{' '}
                              {t.end_time}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  {detailData.visitor_info.dress_code && (
                    <div className="flex items-start gap-3">
                      <Shirt className="h-5 w-5 mt-1 text-primary" />
                      <div>
                        <h4 className="font-semibold">Dress Code</h4>
                        <p className="text-sm text-muted-foreground">
                          <strong>Men:</strong>{' '}
                          {detailData.visitor_info.dress_code.men.required}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <strong>Women:</strong>{' '}
                          {detailData.visitor_info.dress_code.women.required}
                        </p>
                      </div>
                    </div>
                  )}
                  {detailData.visitor_info.entry_fee && (
                    <div className="flex items-start gap-3">
                      <Ticket className="h-5 w-5 mt-1 text-primary" />
                      <div>
                        <h4 className="font-semibold">Entry Fee</h4>
                        <p className="text-sm text-muted-foreground">
                          General:{' '}
                          {typeof detailData.visitor_info.entry_fee === 'string' ? detailData.visitor_info.entry_fee : detailData.visitor_info.entry_fee.general_darshan}
                        </p>
                        {typeof detailData.visitor_info.entry_fee !== 'string' && detailData.visitor_info.entry_fee.special_darshan && (
                          <p className="text-sm text-muted-foreground">
                            Special:{' '}
                            {detailData.visitor_info.entry_fee.special_darshan}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {detailData.visitor_info.activities && (
                    <div className="flex items-start gap-3">
                      <Waves className="h-5 w-5 mt-1 text-primary" />
                      <div>
                        <h4 className="font-semibold">Activities</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {detailData.visitor_info.activities.map((activity: string) => (
                            <Badge key={activity} variant="secondary">{activity}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {detailData.visitor_info.entry_rules && (
                    <div className="flex items-start gap-3">
                      <Ban className="h-5 w-5 mt-1 text-destructive" />
                      <div>
                        <h4 className="font-semibold">Entry Rules</h4>
                        <ul className="text-sm text-muted-foreground list-disc pl-4 mt-1">
                          {detailData.visitor_info.entry_rules
                            .only_hindus_allowed_inside && (
                              <li>Only Hindus allowed inside sanctum</li>
                            )}
                          {detailData.visitor_info.entry_rules
                            .photography_allowed_inside === false && (
                              <li>Photography not allowed inside</li>
                            )}
                          {detailData.visitor_info.entry_rules
                            .mobile_phones_allowed_inside === false && (
                              <li>Mobile phones not allowed inside</li>
                            )}
                          {detailData.visitor_info.entry_rules.warning && (
                            <li className="text-destructive-foreground bg-destructive p-2 rounded-md">{detailData.visitor_info.entry_rules.warning}</li>
                          )}
                          {Array.isArray(detailData.visitor_info.entry_rules.warnings) && detailData.visitor_info.entry_rules.warnings.map((w: string) => (
                            <li key={w} className="text-destructive-foreground bg-destructive p-2 rounded-md">{w}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  {detailData.visitor_info.average_crowd_level && (
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 mt-1 text-primary" />
                      <div>
                        <h4 className="font-semibold">Average Crowd</h4>
                        <p className="text-sm text-muted-foreground">
                          {detailData.visitor_info.average_crowd_level}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-8">
              {detailData.nearby_accommodations && (
                <Card>
                  <CardHeader>
                    <CardTitle>Nearby Accommodations</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {detailData.nearby_accommodations.map((hotel: any) => (
                      <div
                        key={hotel.name}
                        className="border p-4 rounded-md bg-secondary/50"
                      >
                        <h5 className="font-semibold">
                          {hotel.name}{' '}
                          <Badge variant="outline">{hotel.type}</Badge>
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {hotel.location_note || `~${hotel.distance_km}km`}
                        </p>
                        {hotel.recommended_for && hotel.recommended_for.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Recommended for:{' '}
                            {hotel.recommended_for.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
              {detailData.nearby_food_places && (
                <Card>
                  <CardHeader>
                    <CardTitle>Nearby Food Places</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {detailData.nearby_food_places.map((food: any) => (
                      <div
                        key={food.name}
                        className="border p-4 rounded-md bg-secondary/50"
                      >
                        <h5 className="font-semibold">
                          {food.name}{' '}
                          <Badge variant="outline">{food.type}</Badge>
                        </h5>
                        {food.cuisine && food.cuisine.length > 0 && (
                          <p className="text-sm text-muted-foreground">
                            {food.cuisine.join(', ')}
                          </p>
                        )}
                        {food.specialties && food.specialties.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Specialties: {food.specialties.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>How to Reach</CardTitle>
                  <CardDescription>
                    Directions to {detailData.name}
                  </CardDescription>
                </div>
                {/* Map Button - Redirects to Google Maps */}
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      detailData.name + ' ' + (detailData.location?.address || detailData.location?.city || '')
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Map className="h-4 w-4" />
                    View on Map
                  </a>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {detailData.transport.nearest_airport && (
                  <>
                    <div className="flex items-start gap-4">
                      <Plane className="h-6 w-6 mt-1 text-primary" />
                      <div>
                        <h5 className="font-semibold mb-1">By Air</h5>
                        <p className="text-sm">
                          Nearest Airport:{' '}
                          <strong>
                            {detailData.transport.nearest_airport.name}
                          </strong>{' '}
                          (~
                          {
                            detailData.transport.nearest_airport
                              .approx_distance_km
                          }
                          km away).
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Travel options:{' '}
                          {detailData.transport.nearest_airport.travel_options.join(
                            ', '
                          )}
                          .
                        </p>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}
                {detailData.transport.nearest_railway_station && (
                  <>
                    <div className="flex items-start gap-4">
                      <Train className="h-6 w-6 mt-1 text-primary" />
                      <div>
                        <h5 className="font-semibold mb-1">By Rail</h5>
                        <p className="text-sm">
                          Nearest Station:{' '}
                          <strong>
                            {
                              detailData.transport.nearest_railway_station
                                .name
                            }
                          </strong>{' '}
                          ( ~
                          {
                            detailData.transport.nearest_railway_station
                              .approx_distance_km
                          }
                          km away).
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Travel options:{' '}
                          {detailData.transport.nearest_railway_station.travel_options.join(
                            ', '
                          )}
                          .
                        </p>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}
                {detailData.transport.by_road && (
                  <div className="flex items-start gap-4">
                    <Bus className="h-6 w-6 mt-1 text-primary" />
                    <div>
                      <h5 className="font-semibold mb-1">By Road</h5>
                      <p className="text-sm">
                        {detailData.transport.by_road.description}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Parking:{' '}
                        {detailData.transport.by_road.parking_info}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {detailData.reviews_summary && (
              <Card>
                <CardHeader>
                  <CardTitle>Reviews Summary</CardTitle>
                  <CardDescription>
                    Overall Rating:{' '}
                    {detailData.reviews_summary.overall_rating_out_of_5} / 5
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />{' '}
                      Highlights
                    </h4>
                    <ul className="text-sm text-muted-foreground list-disc pl-5">
                      {detailData.reviews_summary.highlights.map(
                        (h: string) => (
                          <li key={h}>{h}</li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <MessageCircleWarning className="h-4 w-4 text-destructive" />{' '}
                      Common Complaints
                    </h4>
                    <ul className="text-sm text-muted-foreground list-disc pl-5">
                      {detailData.reviews_summary.common_complaints.map(
                        (c: string) => (
                          <li key={c}>{c}</li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-accent" /> Visitor
                      Tips
                    </h4>
                    <ul className="text-sm text-muted-foreground list-disc pl-5">
                      {detailData.reviews_summary.tips_from_visitors.map(
                        (tip: string) => (
                          <li key={tip}>{tip}</li>
                        )
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
