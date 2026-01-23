const path = "/assets/images/universities/";

export interface Building {
    images: string[];
    "nearest-mbta": Record<string, string[]>;
    "nearest-parking": string[];
}

export interface Entity {
    images: string[];
    address: string;
    website?: string;
}

export interface University {
    name: string,
    location: string,
    viewImages?: Record<string, string[]>,
    // for now, the buildings have the same nearest-mbta and nearest-parking data,
    // this is intentional and for placeholder only, I'll change it later
    buildings?: Record<string, Building>,
    residenceHalls?: Record<string, Entity>,
    parkingGarages?: Record<string, Entity>,
    mbtaStations?: Record<string, Record<string, Entity>>,
    commonAreas?: Record<string, string[]>,
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
        residenceHalls: {
            "smith": {
                images: [path + "su/smith-hall-1.jpg"],
                address: "150 Tremont Street, Boston, MA 02114",
            },
            "court": {
                images: [path + "su/court-hall-1.jpg"],
                address: "1 Court Street, Boston, MA 02114",
            },
            "miller": {
                images: [path + "su/miller-hall-1.jpg"],
                address: "6 Beacon Street #1120, Boston, MA 02114",
            },
            "west": {
                images: [path + "su/west-hall-1.jpg"],
                address: "10 West Street, Boston, MA 02111",
            },
            "modern-theatre": {
                images: [path + "su/mt-hall-1.jpg"],
                address: "525 Washington Steet, Boston, MA 02111",
            },
        },
        parkingGarages: {
            "73-tremont": {
                images: [path + "su/73tremont-parking-1.jpg"],
                address: "73 Tremont Street, Boston, MA 02114",
            },
            "center-plaza": {
                images: [path + "su/center-plaza-parking-1.png"],
                address: "30 Somerset Street, Boston, MA 02114",
            },
            "charles-river-garage": {
                images: [path + "su/crg-parking-1.jpg"],
                address: "207 Cambridge Street, Boston, MA 02114",
            },
        },
        mbtaStations: {
            "blue-line": {
                "bowdoin": {
                    images: [path + "su/bowdoin-bl-mbta-1.jpg"],
                    address: "Bowdoin Square, Boston, MA 02114",
                    website: "https://www.mbta.com/stops/place-bomnl",
                },
                "government-center": {
                    images: [path + "su/govtctr-bl-gl-mbta-1.jpg"],
                    address: "100 Hanover St, Boston, MA 02108",
                    website: "https://www.mbta.com/stops/place-gover",
                },
                "state": {
                    images: [path + "su/state-bl-ol-mbta-1.avif"],
                    address: "State St, Boston, MA 02109",
                    website: "https://www.mbta.com/stops/place-state",
                },
            },
            "orange-line": {
                "haymarket": {
                    images: [path + "su/haymarket-ol-mbta-1.jpeg"],
                    address: "200 Hanover St, Boston, MA 02113",
                    website: "https://www.mbta.com/stops/place-haymt",
                },
                "state": {
                    images: [path + "su/state-bl-ol-mbta-1.avif"],
                    address: "State St, Boston, MA 02109",
                    website: "https://www.mbta.com/stops/place-state",
                },
            },
            "red-line": {
                "park-street": {
                    images: [path + "su/parkst-rl-gl-mbta-1.jpg"],
                    address: "100 Tremont St, Boston, MA 02108",
                    website: "https://www.mbta.com/stops/place-pktrm",
                },
            },
            "green-line": {
                "government-center": {
                    images: [path + "su/govtctr-bl-gl-mbta-1.jpg"],
                    address: "100 Hanover St, Boston, MA 02108",
                    website: "https://www.mbta.com/stops/place-gover",
                },
                "park-street": {
                    images: [path + "su/parkst-rl-gl-mbta-1.jpg"],
                    address: "100 Tremont St, Boston, MA 02108",
                    website: "https://www.mbta.com/stops/place-pktrm",
                },
            }
        },

    },
];