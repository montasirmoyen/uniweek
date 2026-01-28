'use client';

import { useState } from 'react';
import { UNIVERSITIES, MBTA_STATIONS, PARKING_GARAGES } from '@/lib/types/universities';
import { getDistance } from '@/lib/funcs/distance';
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

  // Get the building coordinates for distance calculations
  const gapBuilding = buildingKey ? university.buildings?.[buildingKey] : undefined;
  const gapBuildingCoords = gapBuilding?.lngLat;

  const formatName = (key: string) => key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const nearestCommonKeys = buildingKey
    ? university.buildings?.[buildingKey]?.['nearest-common-area']
    : undefined;
  const commonAreas = nearestCommonKeys
    ? nearestCommonKeys
      .map((k) => ({ key: k, data: university.commonAreas?.[k] }))
      .filter((x) => !!x.data)
    : Object.entries(university.commonAreas || {}).map(([k, v]) => ({ key: k, data: v }));

  // Calculate distances for common areas if building coords available
  const commonAreasWithDistance = gapBuildingCoords
    ? commonAreas
      .map(({ key, data }) => {
        const buildingKey = data?.location;
        const building = buildingKey ? university.buildings?.[buildingKey] : undefined;
        const distance = building?.lngLat
          ? getDistance(gapBuildingCoords[0], gapBuildingCoords[1], building.lngLat[0], building.lngLat[1])
          : undefined;
        return { key, data, distance };
      })
      .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
    : commonAreas.map(({ key, data }) => ({ key, data, distance: undefined }));

  const nearestDiningKeys = buildingKey
    ? university.buildings?.[buildingKey]?.['nearest-dining-halls']
    : undefined;
  const diningPlaces = nearestDiningKeys
    ? nearestDiningKeys
      .map((k) => ({ key: k, data: university.diningHallsAndCafes?.[k] }))
      .filter((x) => !!x.data)
    : Object.entries(university.diningHallsAndCafes || {}).map(([k, v]) => ({ key: k, data: v }));

  // Calculate distances for dining halls if building coords available
  const diningPlacesWithDistance = gapBuildingCoords
    ? diningPlaces
      .map(({ key, data }) => {
        const locationKey = data?.location;
        const isResidenceHall = !!data?.residenceHall;
        const place = locationKey
          ? (isResidenceHall ? university.residenceHalls?.[locationKey] : university.buildings?.[locationKey])
          : undefined;
        const coords = place?.lngLat;
        const distance = coords
          ? getDistance(gapBuildingCoords[0], gapBuildingCoords[1], coords[0], coords[1])
          : undefined;
        return { key, data, distance };
      })
      .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
    : diningPlaces.map(({ key, data }) => ({ key, data, distance: undefined }));

  const computeDiningType = (desc?: string) => {
    if (!desc) return 'Dining Hall / Cafe';
    return /cafe/i.test(desc) ? 'Cafe' : 'Dining Hall';
  };

  // Filter MBTA and parking based on building's nearest lists
  const nearestMbtaMap = buildingKey
    ? university.buildings?.[buildingKey]?.['nearest-mbta']
    : undefined;
  const nearestParkingKeys = buildingKey
    ? university.buildings?.[buildingKey]?.['nearest-parking']
    : undefined;

  const filteredMbtaStations = nearestMbtaMap && university.mbtaStations
    ? Object.entries(university.mbtaStations)
      .map(([line, stations]) => {
        const allowedStations = nearestMbtaMap[line];
        if (!allowedStations) return null;
        const filteredStations = stations
          .filter((name) => allowedStations.includes(name))
          .map((stationName) => ({ stationName, stationData: MBTA_STATIONS[stationName] }))
          .filter((x) => !!x.stationData);
        return filteredStations.length > 0 ? { line, stations: filteredStations } : null;
      })
      .filter((x) => x !== null)
    : university.mbtaStations
      ? Object.entries(university.mbtaStations)
        .map(([line, stations]) => ({
          line,
          stations: stations
            .map((stationName) => ({ stationName, stationData: MBTA_STATIONS[stationName] }))
            .filter((x) => !!x.stationData),
        }))
        .filter(({ stations }) => stations.length > 0)
      : [];

  // Calculate distances for MBTA stations if building coords available
  const mbtaStationsWithDistance = gapBuildingCoords
    ? filteredMbtaStations.map(({ line, stations }) => ({
      line,
      stations: stations
        .map(({ stationName, stationData }) => {
          const distance = stationData?.lngLat
            ? getDistance(gapBuildingCoords[0], gapBuildingCoords[1], stationData.lngLat[0], stationData.lngLat[1])
            : undefined;
          return { stationName, stationData, distance };
        })
        .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity)),
    }))
    : filteredMbtaStations.map(({ line, stations }) => ({
      line,
      stations: stations.map(({ stationName, stationData }) => ({ stationName, stationData, distance: undefined })),
    }));

  const filteredParkingGarages = nearestParkingKeys && university.parkingGarages
    ? university.parkingGarages
      .filter((name) => nearestParkingKeys.includes(name))
      .map((garageName) => ({ garageName, garageData: PARKING_GARAGES[garageName] }))
      .filter((x) => !!x.garageData)
    : university.parkingGarages
      ? university.parkingGarages
        .map((garageName) => ({ garageName, garageData: PARKING_GARAGES[garageName] }))
        .filter((x) => !!x.garageData)
      : [];

  // Calculate distances for parking garages if building coords available
  const parkingGaragesWithDistance = gapBuildingCoords
    ? filteredParkingGarages
      .map(({ garageName, garageData }) => {
        const distance = garageData?.lngLat
          ? getDistance(gapBuildingCoords[0], gapBuildingCoords[1], garageData.lngLat[0], garageData.lngLat[1])
          : undefined;
        return { garageName, garageData, distance };
      })
      .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
    : filteredParkingGarages.map(({ garageName, garageData }) => ({ garageName, garageData, distance: undefined }));

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 250);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
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
              ? 'Make the most of your break, explore nearby common areas and dining spots.'
              : 'Arrive and leave campus with ease; transit and parking options below.'}
          </p>

          {mode === 'free' ? (
            <>
              {/* Nearest Common Areas */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Nearest Common Areas</h3>
                <div className="space-y-3">
                  {commonAreasWithDistance.map(({ key, data, distance }) => {
                    const buildingAddress = data?.location ? university.buildings?.[data.location]?.address : undefined;
                    return (
                      <div key={key} className="border border-border rounded-lg overflow-hidden">
                        <div className="bg-secondary px-3 py-2 flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-secondary-foreground truncate">
                              {formatName(key)}
                              {distance !== undefined && <span className="ml-2 text-xs text-muted-foreground">({distance.toFixed(1)} mi)</span>}
                            </p>
                            {buildingAddress && (
                              <p className="text-[11px] text-muted-foreground truncate">{buildingAddress}</p>
                            )}
                            {data?.description && (
                              <p className="text-xs text-muted-foreground truncate">{data.description}</p>
                            )}
                          </div>
                        </div>
                        {data?.images?.length ? (
                          <div className="p-2">
                            <div className="relative aspect-video rounded overflow-hidden">
                              <Image src={data.images[0]} alt={`${key} common area`} fill className="object-cover" />
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Nearest Dining Halls & Cafes */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Nearest Dining Halls & Cafes</h3>
                <div className="space-y-3">
                  {diningPlacesWithDistance.map(({ key, data, distance }) => {
                    const locationKey = data?.location;
                    const isResidenceHall = !!data?.residenceHall;
                    const locationAddress = locationKey
                      ? (isResidenceHall ? university.residenceHalls?.[locationKey]?.address : university.buildings?.[locationKey]?.address)
                      : undefined;
                    return (
                      <div key={key} className="border border-border rounded-lg overflow-hidden">
                        <div className="bg-secondary px-3 py-2 flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-secondary-foreground truncate">
                              {formatName(key)}
                              {distance !== undefined && <span className="ml-2 text-xs text-muted-foreground">({distance.toFixed(1)} mi)</span>}
                            </p>
                            {locationAddress && (
                              <p className="text-[11px] text-muted-foreground truncate">{locationAddress}</p>
                            )}
                            <p className="text-xs text-muted-foreground">{computeDiningType(data?.description)}</p>
                            {data?.description && (
                              <p className="text-xs text-muted-foreground truncate">{data.description}</p>
                            )}
                            {data?.residenceHall ? (
                              <p className="text-[11px] text-amber-600">Located in a residence hall</p>
                            ) : null}
                          </div>
                        </div>
                        {data?.images?.length ? (
                          <div className="p-2">
                            <div className="relative aspect-video rounded overflow-hidden">
                              <Image src={data.images[0]} alt={`${key} dining`} fill className="object-cover" />
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
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
                  className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px] resize-none"
                />
              </div>
            </>
          ) : (
            <>
              {/* Arrival & Departure: MBTA Stations */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Nearest MBTA Stations</h3>
                {mbtaStationsWithDistance.map(({ line, stations }) => (
                  <div key={line} className="mb-6">
                    <h4 className="text-sm font-semibold text-card-foreground mb-3 capitalize">{line.replace('-', ' ')}</h4>
                    <div className="space-y-3">
                      {stations.map(({ stationName, stationData, distance }) => (
                        <div key={stationName} className="border border-border rounded-lg overflow-hidden">
                          <div className="bg-secondary px-3 py-2 flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-secondary-foreground truncate">
                            {stationName.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                            {distance !== undefined && <span className="ml-2 text-xs text-muted-foreground">({distance.toFixed(1)} mi)</span>}
                            </p>
                            {stationData?.address && (
                            <p className="text-[11px] text-muted-foreground truncate">{stationData.address}</p>
                            )}
                          </div>
                          <a href={stationData.website} target="_blank" rel="noopener noreferrer" className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md shrink-0 w-24 text-center">View Map</a>
                          </div>
                          {stationData?.images?.length ? (
                          <div className="p-2">
                            <div className="relative aspect-video rounded overflow-hidden">
                            <Image src={stationData.images[0]} alt={`${stationName} station`} fill className="object-cover" />
                            </div>
                          </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Arrival & Departure: Parking Garages */}
              {parkingGaragesWithDistance.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">Nearest Parking Garages</h3>
                  <div className="space-y-3">
                    {parkingGaragesWithDistance.map(({ garageName, garageData, distance }) => (
                      <div key={garageName} className="border border-border rounded-lg overflow-hidden">
                        <div className="bg-secondary px-3 py-2">
                          <p className="text-sm font-medium text-secondary-foreground capitalize">
                            {garageName.replace('-', ' ')}
                            {distance !== undefined && <span className="ml-2 text-xs text-muted-foreground">({distance.toFixed(1)} mi)</span>}
                          </p>
                          {garageData?.address && (
                            <p className="text-[11px] text-muted-foreground truncate">{garageData.address}</p>
                          )}
                        </div>
                        {garageData?.images?.length ? (
                          <div className="p-2">
                            <div className="relative aspect-video rounded overflow-hidden">
                              <Image src={garageData.images[0]} alt={`${garageName} parking`} fill className="object-cover" />
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ))}
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
