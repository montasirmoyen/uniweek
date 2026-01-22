Weekly Schedule App: Version 1 Plan

What it is: 
- An app for Suffolk University students to organize and aestheticize their schedule

General Architecture:
- Home page: Hero page, about us, etc.
- Login/register: Upgrade from guest to user
- Schedule uploader: Limited to 1 upload as guest 
- Schedule library, show uploaded schedules: Won’t be available to view as guest

Weekly Schedule Viewer Architecture:
- Weather up top in Boston
- View classes in a neat Sunday to Saturday layout with times
- Class block:
    - Color coded based on index, with building’s image as cover opacity 50%
    - Clickable to show a side view with:
        - Class details
        - Building images
        - Add note
        - Button saying “I am attending”
            - Only clickable on that day and before that class ends
            - Optional to add name, or stay anonymous
            - Cant use if guest account
    - Mouse hover to see quick desc details
- Gaps between class blocks will have clickable side view that will show:
    - Nearest study spots/chilling spots
        - Will have a button saying “I am here”:
            - Clickable only once per day, the count for you will persist for an hour, per spot to avoid excessive writes
            - Optional to add name, or stay anonymous
            - Cant use if guest account
    - Nearest food
        - Filters for halal, vegan, etc.
        - Sorts for cheapest, popular etc.
    - Add note
- Gaps above the first class block and below the last class block:
    - Nearest train stations, green line, red line etc.
    - Nearest parking garages
- Library of themes to customize your schedule, 
Tech Stack:
- Typescript
- React.js
- Next.js
- TailwindCSS
- (?) Python for possible web-scraping/API

Dependencies:
- “xlsx” library to parse .xlsx files
