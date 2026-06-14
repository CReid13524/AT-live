# Auckland Infrastructure Realtime Display

Auckland Infrastructure Realtime Display is a realtime geospatial dashboard that visualizes Auckland's transport and infrastructure systems through an interactive map and analytics interface.

The platform combines public datasets from Auckland Transport, Auckland Council, NZTA, weather services, and GIS data providers to create a live operational view of the city.

## Features

### Public Transport
- Live bus locations
- Route visualization
- Transport stops
- Service alerts
- Route metadata

### Traffic & Roads
- Road network visualization
- Traffic incidents
- Road closures
- Congestion overlays
- Infrastructure disruptions

### Urban Infrastructure
- Roadworks
- Construction zones
- Parking infrastructure
- Cycling infrastructure
- Transport facilities

### Environmental Data
- Weather overlays
- Rain radar
- Severe weather alerts

### Geospatial Visualization
- Interactive map interface
- Layer controls
- Realtime updates
- High-performance rendering using Deck.gl

---

## Architecture

The system is built around three core data layers:

### Geometry Layer
Represents the physical city infrastructure.

Examples:
- Roads
- Motorways
- Bus route polylines
- Infrastructure assets

### Logic Layer
Represents how transport systems operate.

Examples:
- Routes
- Stops
- Trips
- Schedules

### State Layer
Represents live city conditions.

Examples:
- Vehicle positions
- Delays
- Incidents
- Congestion
- Service disruptions

---

## Technology Stack

### Frontend
- React
- TypeScript
- Mapbox GL JS
- Deck.gl
- Tailwind CSS

### Backend
- Node.js / FastAPI
- Redis
- PostgreSQL
- PostGIS
- WebSockets

### Data Sources
- Auckland Transport APIs
- AT GIS Open Data
- NZTA Traffic APIs
- Auckland Council Open Data
- LINZ Data Service
- OpenStreetMap
- MetService

---

## Project Structure
