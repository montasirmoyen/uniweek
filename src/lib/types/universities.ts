const path = "/assets/images/universities/";

export interface Building {
    images: string[];
    "nearest-mbta": Record<string, string[]>;
    "nearest-parking": string[];
}

export interface University {
    name: string,
    location: string,
    viewImages?: Record<string, string[]>,
    // for now, the buildings have the same nearest-mbta and nearest-parking data,
    // this is intentional and for placeholder only, I'll change it later
    buildings?: Record<string, Building>, 
    residenceHallImages?: Record<string, string[]>,
    parkingImages?: Record<string, string[]>,
    mbtaStationImages?: Record<string, Record<string, string[]>>,
    commonAreasImages?: Record<string, string[]>,
};

export const UNIVERSITIES: University[] = [
    {
        name: 'Suffolk University',
        location: 'Boston, MA, USA',
        viewImages: {
            "campus": [
                path + "su/sargent-aerial-1.jpg",
            ],
        },
        buildings: {
            "samia": {
                images: [
                    path + "su/samia-1.webp",
                    path + "su/samia-2.jpg",
                ],
                "nearest-mbta": {
                    "green-line": ["government-center", "park-street"],
                    "orange-line": ["haymarket"],
                    "blue-line": ["bowdoin"],
                    "red-line": ["park-street"],
                },
                "nearest-parking": ["73-tremont", "center-plaza"],
            },
            "sawyer": {
                images: [path + "su/sawyer-1.jpg"],
                "nearest-mbta": {
                    "green-line": ["government-center", "park-street"],
                    "orange-line": ["haymarket"],
                    "blue-line": ["bowdoin"],
                    "red-line": ["park-street"],
                },
                "nearest-parking": ["73-tremont", "center-plaza"],
            },
            "stahl": {
                images: [path + "su/stahl-1.jpg"],
                "nearest-mbta": {
                    "green-line": ["government-center", "park-street"],
                    "orange-line": ["haymarket"],
                    "blue-line": ["bowdoin"],
                    "red-line": ["park-street"],
                },
                "nearest-parking": ["73-tremont", "center-plaza"],
            },
            "sargent": {
                images: [
                    path + "su/sargent-1.jpg",
                    path + "su/sargent-2.jpg",
                ],
                "nearest-mbta": {
                    "green-line": ["government-center", "park-street"],
                    "orange-line": ["haymarket"],
                    "blue-line": ["bowdoin"],
                    "red-line": ["park-street"],
                },
                "nearest-parking": ["73-tremont", "center-plaza"],
            },
            "one-beacon": {
                images: [path + "su/onebeacon-1.jpg"],
                "nearest-mbta": {
                    "green-line": ["government-center", "park-street"],
                    "orange-line": ["haymarket"],
                    "blue-line": ["bowdoin"],
                    "red-line": ["park-street"],
                },
                "nearest-parking": ["73-tremont", "center-plaza"],
            },
            "modern-theatre": {
                images: [
                    path + "su/modern-theatre-1.jpg",
                    path + "su/modern-theatre-2.jpg",
                ],
                "nearest-mbta": {
                    "green-line": ["government-center", "park-street"],
                    "orange-line": ["haymarket"],
                    "blue-line": ["bowdoin"],
                    "red-line": ["park-street"],
                },
                "nearest-parking": ["73-tremont", "center-plaza"],
            },
            "ridgeway": {
                images: [path + "su/ridgeway-1.jpg"],
                "nearest-mbta": {
                    "green-line": ["government-center", "park-street"],
                    "orange-line": ["haymarket"],
                    "blue-line": ["bowdoin"],
                    "red-line": ["park-street"],
                },
                "nearest-parking": ["73-tremont", "center-plaza"],
            },
        },
        residenceHallImages: {
            "smith": [path + "su/smith-hall-1.jpg"],
            "court": [path + "su/court-hall-1.jpg"],
            "miller": [path + "su/miller-hall-1.jpg"],
            "west": [path + "su/west-hall-1.jpg"],
        },
        parkingImages: {
            "73-tremont": [path + "su/73tremont-parking-1.jpg"],
            "center-plaza": [path + "su/center-plaza-parking-1.jpg"],
            "charles-river-garage": [path + "su/crg-parking-1.jpg"],
        },
        mbtaStationImages: {
            "blue-line": {
                "bowdoin": [path + "su/bowdoin-bl-mbta-1.jpg"],
                "government-center": [path + "su/govtctr-bl-gl-mbta-1.jpg"],
                "state": [path + "su/state-bl-ol-mbta-1.avif"],
            },
            "orange-line": {
                "haymarket": [path + "su/haymarket-ol-mbta-1.jpg"],
                "state": [path + "su/state-bl-ol-mbta-1.avif"],
            },
            "red-line": {
                "park-street": [path + "su/parkst-rl-gl-mbta-1.jpg"],
            },
            "green-line": {
                "government-center": [path + "su/govtctr-bl-gl-mbta-1.jpg"],
                "park-street": [path + "su/parkst-rl-gl-mbta-1.jpg"],
            }
        },
    },
];