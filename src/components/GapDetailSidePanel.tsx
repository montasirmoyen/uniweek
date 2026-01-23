'use client';

import { UNIVERSITIES } from '@/lib/types/universities';
import Image from 'next/image';

interface GapDetailSidePanelProps {
  onClose: () => void;
}

export default function GapDetailSidePanel({ onClose }: GapDetailSidePanelProps) {
  const university = UNIVERSITIES[0]; // Suffolk University

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Side Panel */}
      <div className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-card shadow-2xl z-50 overflow-y-auto animate-slide-in">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-card-foreground">
              Free Time
            </h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground text-3xl leading-none transition-colors"
            >
              ×
            </button>
          </div>

          <p className="text-muted-foreground mb-6">
            Make the most of your break! Here are nearby transit and parking options.
          </p>

          {/* MBTA Stations */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Nearest MBTA Stations</h3>
            
            {university.mbtaStationImages && Object.entries(university.mbtaStationImages).map(([line, stations]) => (
              <div key={line} className="mb-6">
                <h4 className="text-sm font-semibold text-card-foreground mb-3 capitalize">
                  {line.replace('-', ' ')}
                </h4>
                <div className="space-y-3">
                  {Object.entries(stations).map(([stationName, images]) => (
                    <div key={stationName} className="border border-border rounded-lg overflow-hidden">
                      <div className="bg-secondary px-3 py-2">
                        <p className="text-sm font-medium text-secondary-foreground capitalize">
                          {stationName.replace('-', ' ')}
                        </p>
                      </div>
                      {images.length > 0 && (
                        <div className="p-2">
                          <div className="relative aspect-video rounded overflow-hidden">
                            <Image
                              src={images[0]}
                              alt={`${stationName} station`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Parking Garages */}
          {university.parkingImages && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Nearest Parking Garages</h3>
              <div className="space-y-3">
                {Object.entries(university.parkingImages).map(([garageName, images]) => (
                  <div key={garageName} className="border border-border rounded-lg overflow-hidden">
                    <div className="bg-secondary px-3 py-2">
                      <p className="text-sm font-medium text-secondary-foreground capitalize">
                        {garageName.replace('-', ' ')}
                      </p>
                    </div>
                    {images.length > 0 && (
                      <div className="p-2">
                        <div className="relative aspect-video rounded overflow-hidden">
                          <Image
                            src={images[0]}
                            alt={`${garageName} parking`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
