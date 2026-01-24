const path = "/assets/images/universities/";

export interface Building {
    fullName?: string;
    images: string[];
    "nearest-mbta": Record<string, string[]>;
    "nearest-parking": string[];
    "nearest-common-area": string[];
}

export interface ResidenceHall {
    images: string[];
    fullName?: string;
    address: string;
    website?: string;
}

export interface ParkingGarage {
    images: string[];
    address: string;
    website?: string;
}

export interface TrainStation {
    images: string[];
    address: string;
    website?: string;
}

export interface CommonArea {
    location: string;
    description?: string;
    images: string[];
}

export interface University {
    name: string,
    location: string,
    viewImages?: Record<string, string[]>,
    // for now, the buildings have the same nearest-mbta and nearest-parking data,
    // this is intentional and for placeholder only, I'll change it later
    buildings?: Record<string, Building>,
    residenceHalls?: Record<string, ResidenceHall>,
    parkingGarages?: Record<string, ParkingGarage>,
    mbtaStations?: Record<string, Record<string, TrainStation>>,
    commonAreas?: Record<string, CommonArea>,
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
        commonAreas: {
            "library": {
                location: "stahl",
                description: "The library within the Rosalie K. Stahl building offers the most areas for students to study, collaborate, and relax between classes.",
                images: [
                    path + "su/library-common-1.jpg",
                    path + "su/library-common-2.jpg",
                    path + "su/library-common-3.jpg",
                ],
            },
            "samia": {
                location: "samia",
                description: "Samia offers many spots to sit and relax in between classes, check the first few floors for areas with comfortable seating.",
                images: [
                    path + "su/samia-common-1.webp",
                ],
            },
            "sargent": {
                location: "sargent",
                description: "Sargent offers many spots to study and take a break in between classes.",
                images: [
                    path + "su/sargent-common-1.jpg",
                ],
            },
            "sawyer": {
                location: "sawyer",
                description: "Sawyer offers the second most spots to study and take a break in between classes on the campus.",
                images: [
                    path + "su/sawyer-common-1.jpg",
                    path + "su/sawyer-common-2.jpg",
                    path + "su/sawyer-common-3.jpg",
                    path + "su/sawyer-common-4.jpg",
                    path + "su/sawyer-common-5.jpg",
                ],
            },
        },
        buildings: {
            "samia": {
                fullName: "Samia Academic Center",
                images: [
                    path + "su/samia-1.webp",
                    path + "su/samia-2.jpg",
                ],
                "nearest-mbta": {
                    "green-line": ["government-center"],
                    "orange-line": ["haymarket"],
                    "blue-line": ["government-center"],
                },
                "nearest-parking": ["73-tremont", "center-plaza", "charles-river-garage"],
                "nearest-common-area": ["library", "samia", "one-beacon", "sawyer"],
            },
            "sawyer": {
                fullName: "Sawyer Building",
                images: [path + "su/sawyer-1.jpg"],
                "nearest-mbta": {
                    "green-line": ["government-center"],
                    "orange-line": ["haymarket"],
                    "blue-line": ["government-center"],
                },
                "nearest-parking": ["73-tremont", "center-plaza"],
                "nearest-common-area": ["library", "samia", "one-beacon", "sawyer"],
            },
            "one-beacon": {
                fullName: "One Beacon Street Center for Entrepreneurship",
                images: [path + "su/onebeacon-1.jpg"],
                "nearest-mbta": {
                    "green-line": ["government-center"],
                    "orange-line": ["haymarket"],
                    "blue-line": ["government-center"],
                },
                "nearest-parking": ["73-tremont", "center-plaza"],
                "nearest-common-area": ["library", "samia", "one-beacon", "sawyer"],
            },
            "stahl": {
                fullName: "Rosalie K. Stahl Building",
                images: [path + "su/stahl-1.jpg"],
                "nearest-mbta": {
                    "green-line": ["government-center", "park-street"],
                    "orange-line": ["state", "downtown-crossing"],
                    "blue-line": ["government-center", "state"],
                    "red-line": ["park-street"],
                },
                "nearest-parking": ["73-tremont", "center-plaza"],
                "nearest-common-area": ["library", "samia", "one-beacon", "sawyer"],
            },
            "sargent": {
                fullName: "David J. Sargent Hall",
                images: [
                    path + "su/sargent-1.jpg",
                    path + "su/sargent-2.jpg",
                ],
                "nearest-mbta": {
                    "green-line": ["park-street"],
                    "orange-line": ["state", "downtown-crossing"],
                    "blue-line": ["state"],
                    "red-line": ["park-street"],
                },
                "nearest-parking": ["73-tremont"],
                "nearest-common-area": ["sargent", "library"],
            },
            "modern-theatre": {
                fullName: "Modern Theatre Building",
                images: [
                    path + "su/modern-theatre-1.jpg",
                    path + "su/modern-theatre-2.jpg",
                ],
                "nearest-mbta": {
                    "green-line": ["park-street"],
                    "orange-line": ["state", "downtown-crossing"],
                    "blue-line": ["state"],
                    "red-line": ["park-street"],
                },
                "nearest-parking": ["73-tremont"],
                "nearest-common-area": ["sargent"],
            },
            "ridgeway": {
                images: [path + "su/ridgeway-1.jpg"],
                "nearest-mbta": {
                    "green-line": ["government-center"],
                    "orange-line": ["haymarket"],
                    "blue-line": ["government-center", "bowdoin"],
                },
                "nearest-parking": ["center-plaza", "charles-river-garage"],
                "nearest-common-area": ["samia", "sawyer"],
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
                    address: "200 Washington Street, Boston, MA 02109",
                    website: "https://www.mbta.com/stops/place-state",
                },
                "downtown-crossing": {
                    images: [path + "su/dtcrossing-ol-mbta-1.jpg"],
                    address: "Washington St &, Summer St, Boston, MA 02108",
                    website: "https://www.mbta.com/stops/place-dwnxg",
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