Build a modern full-stack mobile-first web application called "AccessCoimbatore".

PROJECT PURPOSE:
AccessCoimbatore helps wheelchair users and people with mobility impairments in Coimbatore find reliable, recently verified accessibility information about clinics, hospitals, shops, offices, colleges, restaurants, bus stops and other public places before travelling.

CORE PROBLEM:
Users often cannot know whether a place is genuinely wheelchair accessible before travelling. A place may have a ramp but it may be too steep, blocked, damaged or unsafe. Accessible toilets may be locked or used for storage. Footpaths may be broken or occupied. Online listings usually do not contain detailed or recent accessibility information.

CORE VALUE:
"Don't just tell me that a place is accessible. Tell me what I will actually face when I get there."

IMPORTANT:
This is NOT just a normal map application.
The application must combine:
1. Accessibility information
2. User-generated reports
3. Photos
4. GPS location
5. Verification
6. Accessibility score
7. Confidence score
8. Wheelchair-friendly route information

==================================================
USER TYPES
==================================================

1. ACCESSIBILITY SEEKER
Mainly wheelchair users and people with mobility impairments.

They can:
- Search places
- View accessibility information
- View recent photos
- View accessibility score
- View confidence score
- View accessibility problems
- View wheelchair-friendly route information
- Save/favourite places
- Report accessibility issues

2. CONTRIBUTOR
Any registered user can contribute accessibility information.

They can:
- Upload photos
- Report accessibility problems
- Verify existing reports
- Update outdated information
- Earn contribution points and badges

3. BUSINESS / PLACE OWNER
Can claim their business/place and submit official accessibility information.

4. ADMIN
Can moderate reports, photos, users, businesses and verification status.

==================================================
MAIN FEATURES
==================================================

A. AUTHENTICATION

Create:
- Sign up
- Login
- Logout
- Forgot password
- User profile

During signup allow user to choose:
- Accessibility Seeker
- Contributor
- Business Owner

Do NOT ask sensitive medical information.

==================================================
B. HOME PAGE
==================================================

Create a clean modern homepage.

Hero section:

"Find places you can access with confidence."

Subtitle:
"Discover real accessibility conditions in Coimbatore before you travel."

Search bar:
"Search clinics, shops, offices, colleges, restaurants..."

Buttons:
- Explore Accessibility Map
- Report an Accessibility Issue

Show quick categories:
- Hospitals
- Clinics
- Restaurants
- Shops
- Colleges
- Offices
- Bus Stops
- Public Places

Show nearby accessible places.

==================================================
C. ACCESSIBILITY MAP
==================================================

Create an interactive map focused on Coimbatore.

Use:
- OpenStreetMap + Leaflet OR another suitable map library.
- Do not hardcode fake map data.

Map markers:
GREEN = Mostly accessible
YELLOW = Partially accessible
RED = Accessibility problems
GREY = Not verified

Users can:
- Search location
- Filter by category
- Filter by accessibility score
- Filter by specific facilities
- View nearby places
- Click a marker to open the place profile

Filters:
- Step-free entrance
- Ramp
- Lift
- Accessible toilet
- Accessible parking
- Wheelchair-friendly path
- Public transport access
- Recently verified

==================================================
D. PLACE ACCESSIBILITY PROFILE
==================================================

Each place should have a detailed accessibility profile.

Example:

ABC Clinic
Coimbatore

Accessibility Score:
82 / 100

Confidence:
94%

Last verified:
2 days ago

Facilities:

Entrance:
GREEN - Step free

Ramp:
YELLOW - Available but steep

Lift:
GREEN - Available

Accessible Toilet:
GREEN - Available

Parking:
YELLOW - Limited

Footpath:
RED - Partially blocked

Door:
GREEN - Wheelchair friendly

Show:
- Recent photos
- Accessibility reports
- User verification count
- Last verified date
- Report history
- Comments

IMPORTANT:
Do NOT simply show "Accessible".
Show exactly WHY a location receives its score.

==================================================
E. ACCESSIBILITY SCORE
==================================================

Create a score from 0–100.

Example weighted factors:

Entrance: 20%
Ramp/path: 20%
Toilet: 15%
Lift: 10%
Parking: 10%
Door/access width: 10%
Footpath: 10%
Transport access: 5%

Make the scoring system configurable in the backend.

Display:
0–39 = Poor
40–59 = Limited
60–79 = Moderate
80–100 = Good

Clearly explain that this is a platform-generated score and not an official accessibility certification.

==================================================
F. CONFIDENCE SCORE
==================================================

This is a key unique feature.

Accessibility Score and Confidence Score must be separate.

Example:

Accessibility Score: 78/100
Information Confidence: 93%

Calculate confidence using factors such as:
- Number of recent reports
- Number of independent verifications
- Recency of photos
- Recency of reports
- Agreement/disagreement between users
- Business verification

Example:

12 reports
8 verified
5 recent photos
Last verified 2 days ago

=> High confidence

Old information:
=> Lower confidence

Show:
"Last verified 2 days ago"

==================================================
G. REPORT ACCESSIBILITY ISSUE
==================================================

Create a prominent "Report Issue" button.

User selects:

Issue category:
- Ramp blocked
- Ramp too steep
- Broken footpath
- Blocked footpath
- Steps at entrance
- Toilet locked
- Toilet used for storage
- Lift unavailable
- Parking blocked
- Narrow entrance
- Heavy door
- Construction
- Waterlogging
- Other

User can:
- Take/upload photo
- Add description
- Automatically capture GPS location
- Select place
- Submit report

Automatically store:
- User ID
- Place ID
- GPS coordinates
- Timestamp
- Photo
- Issue type
- Description

Show:
"Report submitted successfully."

==================================================
H. PHOTO SYSTEM
==================================================

Users can upload accessibility photos.

Each photo should store:
- Place
- User
- Timestamp
- GPS coordinates
- Category

Categories:
- Entrance
- Ramp
- Toilet
- Parking
- Footpath
- Lift
- Door
- Transport
- Other

Show recent photos first.

Clearly display:
"Photo uploaded 2 days ago"

Allow users to report inappropriate/fake photos.

==================================================
I. COMMUNITY VERIFICATION
==================================================

Users can verify reports.

For each report:

"Is this accessibility information still accurate?"

Buttons:
YES - Confirm
NO - Report outdated

Example:

Ramp blocked
Reported 2 days ago

12 users confirmed
2 users disagreed

Update confidence score based on verification.

Prevent one user from repeatedly verifying the same report.

==================================================
J. CONTRIBUTOR POINTS
==================================================

Create a contribution system.

Users earn points for:
- Uploading useful accessibility photos
- Reporting valid accessibility problems
- Confirming accurate reports
- Updating outdated information

Create badges:

Accessibility Contributor
Trusted Reporter
Community Helper
Accessibility Champion

Create leaderboard optionally.

Avoid making the system competitive in a harmful way.

==================================================
K. WHEELCHAIR-FRIENDLY ROUTE
==================================================

Create a route feature.

User selects:
Start location
Destination

Show:
Normal route
Wheelchair-friendly route

The wheelchair-friendly route should prioritize:
- Step-free paths
- Accessible entrances
- Known accessible footpaths
- Verified accessible locations

If complete wheelchair routing cannot be implemented in MVP, create the UI and architecture for it and clearly label route information as "beta".

Do NOT falsely claim that every route is wheelchair accessible.

==================================================
L. TIME-BASED ACCESSIBILITY
==================================================

Accessibility can change.

Example:

Today:
Ramp = Accessible

Tomorrow:
Ramp = Blocked due to construction

Store historical reports.

Show:
"Current status"
"Last verified"
"Recent changes"

If an issue is old and no longer verified, mark it:
"Needs re-verification"

==================================================
M. WEATHER / TEMPORARY CONDITIONS
==================================================

Allow reports for temporary problems:

- Waterlogging
- Mud
- Slippery ramp
- Construction
- Temporary blockage

These reports should have an expiry/re-verification period.

==================================================
N. BUSINESS OWNER DASHBOARD
==================================================

Business owners can:

- Claim a place
- Add accessibility facilities
- Upload official photos
- Update information
- Respond to reports
- Request re-verification

Show:
"Business verified"

But business verification must NOT automatically mean accessibility verification.

==================================================
O. USER PROFILE
==================================================

Show:

Name
Profile photo
Contribution points
Badges
Reports
Photos
Verified contributions
Saved places

Allow:
Edit profile
Delete account

==================================================
P. ADMIN DASHBOARD
==================================================

Admin can manage:

Users
Places
Reports
Photos
Verification requests
Business claims
Categories

Admin can:
- Approve/reject reports
- Remove inappropriate photos
- Suspend users
- Mark information as verified
- Resolve disputes
- View analytics

Dashboard statistics:

Total places
Total reports
Verified reports
Active contributors
Accessibility issues
Recently updated locations

==================================================
Q. AI FEATURE
==================================================

Add an AI-assisted photo analysis module.

When a user uploads a photo, AI can attempt to detect:

- Ramp
- Steps
- Wheelchair
- Blocked pathway
- Vehicle obstruction
- Narrow entrance
- Toilet
- Lift
- Waterlogging
- Construction obstruction

AI output example:

"Possible ramp detected."
"Possible obstruction detected."

IMPORTANT:
AI must NOT make a final accessibility certification.

Display:
"AI-assisted observation — community verification required."

Design the backend so an AI vision API can be integrated later.

==================================================
R. DATABASE
==================================================

Use a proper relational database such as MangoDB

Suggested tables:

users
places
place_categories
accessibility_features
accessibility_reports
photos
verifications
business_claims
saved_places
contributor_points
badges
user_badges
notifications
route_reports

Relationships must be properly normalized.

==================================================
S. TECH STACK
==================================================

Use:

Frontend:
React + Vite
bootstraps

Backend:
Node.js
Express.js

Database:
mangodb

Authentication:
JWT + secure password hashing

Maps:
Leaflet + OpenStreetMap

Image storage:
Use a proper cloud/object storage abstraction.

API:
REST API

Keep the architecture modular so AI and advanced routing can be added later.

==================================================
T. UI / UX
==================================================

Design should feel:

Accessible
Modern
Trustworthy
Simple
Mobile-first

Use:
- Large buttons
- High contrast
- Clear icons
- Large readable text
- Keyboard accessibility
- Screen-reader friendly labels
- Avoid relying only on color
- WCAG-inspired accessible UI

Main navigation:

Home
Map
Report
Saved
Profile

Use cards for accessibility information.

Example badge:

♿ Step-free
🛗 Lift
🚻 Accessible Toilet
🅿️ Accessible Parking

==================================================
U. IMPORTANT SAFETY / TRUST RULES
==================================================

Never claim a place is officially accessible unless there is an official certification source.

Use wording such as:
"Community reported"
"Recently verified"
"Business provided"
"AI-assisted observation"

Always show:
Last verified date.

If information conflicts:
Show:
"Conflicting reports — verification required."

Do not expose private user information.

==================================================
V. MVP DEVELOPMENT ORDER
==================================================

Build the project in this order:

PHASE 1:
Authentication
Database
Home page
Place search
Place details

PHASE 2:
Accessibility Map
Accessibility score
Accessibility feature details

PHASE 3:
Photo upload
Accessibility issue reporting
GPS + timestamp

PHASE 4:
Community verification
Confidence score
Contributor points

PHASE 5:
Business dashboard
Admin dashboard

PHASE 6:
AI photo analysis

PHASE 7:
Wheelchair-friendly routing
Temporary/weather-based accessibility

Do not try to build all advanced features before the basic system works.

==================================================
FINAL REQUIREMENT
==================================================

Create a fully functional MVP, not just static UI screens.

Include:
- Clean folder structure
- Database schema
- API routes
- Authentication
- CRUD operations
- Validation
- Error handling
- Responsive UI
- Seed data for a few DEMO locations in Coimbatore clearly marked as DEMO DATA
- README with setup instructions
- .env.example

Do not hardcode real accessibility claims about actual Coimbatore businesses.

The final product should clearly communicate:

"AccessCoimbatore helps people discover accessible places and accessible journeys with recent, community-verified information."