Legend:
(done) means its been implemented

What this project is: 
- An app for Suffolk University students to organize and aestheticize their schedule

What we have right now:
- Upload .xlsx file and show schedule, works perfectly now

What the General Page Architecture:
- Home page: Simple hero page, about us, etc.
- Login/register: Upgrade from guest to user
- Schedule uploader: Limited to 1 upload as guest 
- Schedule library, show uploaded schedules: Won’t be available to view as guest

Must haves:
- I'll be having a dark mode, light mode switch, so make sure to utilize globals.css as much as possible, and use those colors in the tailwinds, ex: --background is a color, and use bg-background in pages when necessary. This is so switching between modes is seamless, one click will change the colors globally, hence the name
- Remove the modal when clicking on the class block, that was placeholder, we'll have side panel view instead

Weekly Schedule Viewer Architecture:
- Use suffolk university in universities.ts for now, it has all the data you need for this implementation, you'll get what I mean, I only have this so this project is not hardcoded to be only suffolk, I can always add more universities
- Weather up top in Boston
    - I'll implement the functionality later, for now show a placeholder temperature
- View classes in a neat Sunday to Saturday layout with times (done)
- Class block:
    - Color coded based on index (done), with building’s image as cover opacity 50%
    - Clickable to show a side view with:
        - Class details
        - Building images
        - Add note
        - Button saying “I am attending”
            - Right now, there is no backend for storage, so clicking does nothing
    - Mouse hover to see quick desc details
- Gaps above the first class block and below the last class block:
    - Nearest train stations, green line, red line etc.
    - Nearest parking garages

Current Tech Stack Used:
- Typescript
- React.js
- Next.js
- TailwindCSS

Current Dependencies Used:
- “xlsx” library to parse .xlsx files

Let me know if anything is missing in univerisites data, Ill add it later