'use client';

import { useState } from 'react';
import { UNIVERSITIES } from '@/lib/types/universities';
import Image from 'next/image';

interface GapDetailSidePanelProps {
  onClose: () => void;
  buildingKey?: string;
  mode?: 'free' | 'arrival-departure';
}

export default function GapDetailSidePanel({ onClose, buildingKey, mode = 'free' }: GapDetailSidePanelProps) {
  const university = UNIVERSITIES[0];
  const [isClosing, setIsClosing] = useState(false);
  const [note, setNote] = useState('');

  const formatName = (key: string) => key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const nearestCommonKeys = buildingKey
    ? university.buildings?.[buildingKey]?.['nearest-common-area']
    : undefined;
  const commonAreas = nearestCommonKeys
    ? nearestCommonKeys
        .map((k) => ({ key: k, data: university.commonAreas?.[k] }))
        .filter((x) => !!x.data)
    : Object.entries(university.commonAreas || {}).map(([k, v]) => ({ key: k, data: v }));

  const nearestDiningKeys = buildingKey
    ? university.buildings?.[buildingKey]?.['nearest-dining-halls']
    : undefined;
  const diningPlaces = nearestDiningKeys
    ? nearestDiningKeys
        .map((k) => ({ key: k, data: university.diningHallsAndCafes?.[k] }))
        .filter((x) => !!x.data)
    : Object.entries(university.diningHallsAndCafes || {}).map(([k, v]) => ({ key: k, data: v }));

  const computeDiningType = (desc?: string) => {
    if (!desc) return 'Dining Hall / Cafe';
    return /cafe/i.test(desc) ? 'Cafe' : 'Dining Hall';
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 250);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/30 z-40 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
        onClick={handleClose}
      />

      {/* Side Panel */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-card shadow-2xl z-50 overflow-y-auto ${isClosing ? 'animate-slide-out' : 'animate-slide-in'}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-card-foreground">{mode === 'free' ? 'Free Time' : 'Arrival & Departure'}</h2>
            <button
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground text-3xl leading-none transition-colors"
            >
              ×
            </button>
          </div>

          <p className="text-muted-foreground mb-6">
            {mode === 'free'
              ? 'Make the most of your break! Explore nearby common areas and dining spots.'
              : 'Arrive and leave campus with ease; transit and parking options below.'}
          </p>

          {mode === 'free' ? (
            <>
              {/* Nearest Common Areas */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Nearest Common Areas</h3>
                <div className="space-y-3">
                  {commonAreas.map(({ key, data }) => (
                    <div key={key} className="border border-border rounded-lg overflow-hidden">
                      <div className="bg-secondary px-3 py-2 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-secondary-foreground">{formatName(key)}</p>
                          {data?.description && (<p className="text-xs text-muted-foreground">{data.description}</p>)}
                        </div>
                        <button className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md">I am here</button>
                      </div>
                      {data?.images?.length ? (
                        <div className="p-2">
                          <div className="relative aspect-video rounded overflow-hidden">
                            <Image src={data.images[0]} alt={`${key} common area`} fill className="object-cover" />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              {/* Nearest Dining Halls & Cafes */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Nearest Dining Halls & Cafes</h3>
                <div className="space-y-3">
                  {diningPlaces.map(({ key, data }) => (
                    <div key={key} className="border border-border rounded-lg overflow-hidden">
                      <div className="bg-secondary px-3 py-2 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-secondary-foreground">{formatName(key)}</p>
                          <p className="text-xs text-muted-foreground">{computeDiningType(data?.description)}</p>
                        </div>
                        <button className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md">I am here</button>
                      </div>
                      {data?.images?.length ? (
                        <div className="p-2">
                          <div className="relative aspect-video rounded overflow-hidden">
                            <Image src={data.images[0]} alt={`${key} dining`} fill className="object-cover" />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-2">
                <label htmlFor="gap-note" className="block text-sm font-semibold text-card-foreground mb-2">Notes</label>
                <textarea
                  id="gap-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note for this free time..."
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px] resize-none"
                />
              </div>
            </>
          ) : (
            <>
              {/* Arrival & Departure: MBTA Stations */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Nearest MBTA Stations</h3>
                {university.mbtaStations && Object.entries(university.mbtaStations).map(([line, stations]) => (
                  <div key={line} className="mb-6">
                    <h4 className="text-sm font-semibold text-card-foreground mb-3 capitalize">{line.replace('-', ' ')}</h4>
                    <div className="space-y-3">
                      {Object.entries(stations).map(([stationName, stationData]) => (
                        <div key={stationName} className="border border-border rounded-lg overflow-hidden">
                          <div className="bg-secondary px-3 py-2">
                            <p className="text-sm font-medium text-secondary-foreground capitalize">{stationName.replace('-', ' ')}</p>
                          </div>
                          {stationData.images.length > 0 && (
                            <div className="p-2">
                              <div className="relative aspect-video rounded overflow-hidden">
                                <Image src={stationData.images[0]} alt={`${stationName} station`} fill className="object-cover" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Arrival & Departure: Parking Garages */}
              {university.parkingGarages && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">Nearest Parking Garages</h3>
                  <div className="space-y-3">
                    {Object.entries(university.parkingGarages).map(([garageName, garageData]) => {
                      const images = (garageData as { images: string[] }).images;
                      return (
                        <div key={garageName} className="border border-border rounded-lg overflow-hidden">
                          <div className="bg-secondary px-3 py-2">
                            <p className="text-sm font-medium text-secondary-foreground capitalize">{garageName.replace('-', ' ')}</p>
                          </div>
                          {images.length > 0 && (
                            <div className="p-2">
                              <div className="relative aspect-video rounded overflow-hidden">
                                <Image src={images[0]} alt={`${garageName} parking`} fill className="object-cover" />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
