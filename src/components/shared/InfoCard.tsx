'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Item } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { SaveButton } from '@/components/shared/SaveButton';

type InfoCardProps = {
  item: Item;
  itemType?: 'attraction' | 'dining' | 'accommodation';
};

export function InfoCard({ item, itemType = 'attraction' }: InfoCardProps) {
  const image = PlaceHolderImages?.find(p => p.id === item.imageId);
  const href = `/${itemType}s/${item.id}`;


  const [imgSrc, setImgSrc] = useState(image?.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'); // Fallback to a default if empty
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(image?.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image');
    setHasError(false);
  }, [image]);

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (item.hasDetails) {
      return (
        <Link href={href} className="flex group relative w-full">
          {children}
        </Link>
      );
    }
    return <div className="flex group relative w-full cursor-default">{children}</div>;
  };

  return (
    <CardWrapper>
      <Card className={cn(
        "overflow-hidden flex flex-col transform transition-all duration-500 border-muted-foreground/10 w-full",
        item.hasDetails ? "hover:scale-[1.03] hover:shadow-2xl hover:shadow-primary/10 cursor-pointer" : ""
      )}>
        <div className="relative h-56 w-full overflow-hidden bg-muted">
          {image && imgSrc && !hasError ? (
            <Image
              src={imgSrc}
              alt={item.name}
              fill
              className={cn(
                "object-cover transition-transform duration-700",
                item.hasDetails ? "group-hover:scale-110" : ""
              )}
              data-ai-hint={image.imageHint}
              onError={() => setHasError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              <MapPin className="h-12 w-12 opacity-20" />
            </div>
          )}
          <div className={cn(
            "absolute inset-0 bg-black/20 transition-colors duration-500",
            item.hasDetails ? "group-hover:bg-black/0" : ""
          )} />

          <SaveButton
            item={item}
            itemType={itemType}
            className="absolute top-2 right-2 z-10"
          />
        </div>
        <CardHeader>
          <CardTitle className={cn(
            "font-headline text-2xl transition-colors duration-300",
            item.hasDetails ? "group-hover:text-primary" : ""
          )}>{item.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription className={cn(
            "line-clamp-3 transition-colors",
            item.hasDetails ? "group-hover:text-foreground/80" : ""
          )}>{item.description}</CardDescription>
        </CardContent>
        <CardFooter className="flex-wrap gap-2">
          <Badge variant="secondary" className={cn(
            "flex items-center gap-1 transition-colors duration-300",
            item.hasDetails ? "group-hover:bg-primary/10 group-hover:text-primary" : ""
          )}>
            <MapPin className="h-3 w-3" />
            {item.location}
          </Badge>
          {item.district && <Badge variant="outline">{item.district}</Badge>}
        </CardFooter>
      </Card>
    </CardWrapper>
  );
}

