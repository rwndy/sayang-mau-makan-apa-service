# Sayang Mau Makan Apa - Backend Service

An AI-powered food recommendation service that helps you decide what to eat based on your location and preferences. This service integrates with OpenStreetMap to find nearby restaurants and uses OpenAI's GPT-4 to provide intelligent food recommendations.

## Features

- **Location-based Recommendations**: Get food suggestions based on your current location (latitude/longitude)
- **Category Filtering**: Filter recommendations by food category (e.g., Italian, Chinese, Fast Food)
- **AI-Powered Suggestions**: Utilizes OpenAI GPT-4o-mini to provide intelligent recommendations based on relevance, distance, and popularity
- **Recommendation History**: Track and retrieve past recommendations
- **Standardized API Responses**: Consistent response structure for all endpoints with proper HTTP status codes
- **Comprehensive Error Handling**: Robust error handling with detailed error messages and proper status codes
- **Request Timeout Protection**: Global timeout middleware to prevent hanging requests
- **Environment Validation**: Validates required environment variables on startup
- **RESTful API**: Clean and well-documented API endpoints
- **Swagger Documentation**: Interactive API documentation available at `/docs`
- **Docker Support**: Easy deployment with Docker and Docker Compose
- **Type Safety**: Built with TypeScript for enhanced code quality
- **Database Persistence**: PostgreSQL database with Prisma ORM

## Tech Stack

### Core
- **Node.js** - Runtime environment
- **TypeScript** - Type-safe JavaScript
- **Express.js** - Web framework
- **Prisma** - Modern database ORM
- **PostgreSQL** - Relational database

### AI & External Services
- **OpenAI API** - GPT-4o-mini for intelligent recommendations
- **OpenStreetMap (Nominatim)** - Location and place data

### Development Tools
- **Biome** - Fast linting and formatting
- **Husky** - Git hooks
- **lint-staged** - Run linters on staged files
- **Jest** - Testing framework
- **Supertest** - HTTP assertions
- **Swagger UI** - API documentation

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Prerequisites

Before running this project, make sure you have:

- **Node.js** v18 or higher
- **pnpm** v10.25.0 (specified in package.json)
- **PostgreSQL** (or use Docker Compose)
- **OpenAI API Key** - Get one from [OpenAI Platform](https://platform.openai.com/)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/rwndy/sayang-mau-makan-apa-service.git
cd sayang-mau-makan-apa-service
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://food:food@localhost:5432/food"
OPENAI_KEY="your-openai-api-key-here"
```

**Environment Variables:**
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_KEY`: Your OpenAI API key

### 4. Database Setup

Generate Prisma client and run migrations:

```bash
pnpm prisma:generate
pnpm prisma:migrate
```

### 5. Start the development server

```bash
pnpm dev
```

The server will start on `http://localhost:3000`

## Running with Docker

### Using Docker Compose (Recommended)

The easiest way to run the entire stack (app + database):

```bash
docker-compose up
```

This will:
- Start a PostgreSQL database on port 5432
- Build and start the application on port 3000

### Building Docker Image Manually

```bash
docker build -t sayang-mau-makan-apa-be .
docker run -p 3000:3000 --env-file .env sayang-mau-makan-apa-be
```

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Documentation
Interactive API documentation is available at:
```
http://localhost:3000/docs
```

### Endpoints

#### 1. Get Food Recommendation

**POST** `/food/recommend`

Get AI-powered food recommendations based on location and category.

**Request Body:**
```json
{
  "lat": 40.7128,
  "lon": -74.0060,
  "category": "Italian",
  "radius": 1000
}
```

**Parameters:**
- `lat` (required): Latitude of your location
- `lon` (required): Longitude of your location
- `category` (optional): Food category preference
- `radius` (optional): Search radius in meters

**Response:**
```json
{
  "status": 200,
  "message": "success",
  "data": {
    "recommendations": [
      {
        "food": "Margherita Pizza",
        "place": "Antonio's Italian Restaurant",
        "reason": "Authentic Italian cuisine with excellent reviews, located just 200m away"
      },
      {
        "food": "Pasta Carbonara",
        "place": "La Bella Vita",
        "reason": "Popular spot known for traditional pasta dishes, 350m distance"
      }
    ]
  }
}
```

#### 2. Get Recommendation History

**GET** `/food/histories`

Retrieve all past food recommendations.

**Response:**
```json
{
  "status": 200,
  "message": "success",
  "data": [
    {
      "id": "uuid",
      "lat": 40.7128,
      "lon": -74.0060,
      "category": "Italian",
      "result": {
        "recommendations": [...]
      },
      "createdAt": "2024-01-18T10:30:00Z"
    }
  ]
}
```

## Database Schema

### RecommendationHistory

Stores all recommendation requests and results.

```prisma
model RecommendationHistory {
  id        String   @id @default(uuid())
  lat       Float
  lon       Float
  category  String
  result    Json
  createdAt DateTime @default(now())
}
```

## Available Scripts

```bash
# Development
pnpm dev              # Start development server with ts-node

# Building
pnpm build            # Compile TypeScript to JavaScript

# Production
pnpm start            # Run compiled JavaScript

# Code Quality
pnpm lint             # Check code with Biome
pnpm format           # Format code with Biome

# Testing
pnpm test             # Run Jest tests

# Database
pnpm prisma:generate  # Generate Prisma client
pnpm prisma:migrate   # Run database migrations

# Git Hooks
pnpm prepare          # Setup Husky git hooks
```

## Project Structure

```
sayang-mau-makan-apa-be/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   ├── env.ts            # Environment configuration & validation
│   │   ├── openai.ts         # OpenAI client setup
│   │   └── prisma.ts         # Prisma client setup
│   ├── controllers/
│   │   └── food.controller.ts # Food recommendation controller
│   ├── docs/
│   │   └── swagger.ts        # Swagger/OpenAPI documentation
│   ├── middlewares/
│   │   ├── error.middleware.ts    # Error handling
│   │   ├── timeout.middleware.ts  # Request timeout handling
│   │   └── validate.middleware.ts # Request validation
│   ├── routes/
│   │   ├── food.route.ts     # Food routes
│   │   └── index.ts          # Route aggregator
│   ├── services/
│   │   ├── ai.service.ts     # OpenAI integration
│   │   ├── history.service.ts # Database operations
│   │   └── osm.service.ts    # OpenStreetMap integration
│   ├── utils/
│   │   └── response.util.ts  # Standardized API response helpers
│   ├── app.ts                # Express app setup
│   └── server.ts             # Server entry point
├── tests/
│   └── food.test.ts          # API tests
├── .husky/                   # Git hooks
├── biome.json                # Biome configuration
├── docker-compose.yml        # Docker Compose config
├── Dockerfile                # Docker image definition
├── jest.config.js            # Jest configuration
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## Development Workflow

### Code Quality

This project uses several tools to maintain code quality:

1. **Biome** for linting and formatting
2. **Husky** for git hooks
3. **lint-staged** to run checks on staged files

Before committing, the following checks run automatically:
- Code linting with Biome
- Code formatting with Biome

### Testing

Run tests with:

```bash
pnpm test
```

Tests are located in the `tests/` directory and use Jest with Supertest for HTTP testing.

### Making Changes

1. Create a new branch for your feature
2. Make your changes
3. Run `pnpm lint` to check for issues
4. Run `pnpm test` to ensure tests pass
5. Commit your changes (pre-commit hooks will run automatically)
6. Push and create a pull request

## Response Structure

All API responses follow a standardized structure for consistency:

### Success Response
```json
{
  "status": 200,
  "message": "success",
  "data": { /* actual response data */ }
}
```

### Error Response
```json
{
  "status": 400,
  "message": "Error description",
  "data": null
}
```

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request (missing or invalid parameters)
- `404` - Not Found (no restaurants or records found)
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error
- `502` - Bad Gateway (external service error)
- `504` - Gateway Timeout

### Error Examples

**Validation Error:**
```json
{
  "status": 400,
  "message": "Validation Error",
  "data": null,
  "errors": [
    {
      "field": "lat",
      "message": "Required"
    }
  ]
}
```

**Location Required:**
```json
{
  "status": 400,
  "message": "Location required",
  "data": null
}
```

**No Restaurants Found:**
```json
{
  "status": 404,
  "message": "No restaurants found in this area. Try increasing the radius.",
  "data": null
}
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Author

Created with love by the development team

## Acknowledgments

- OpenAI for providing the GPT API
- OpenStreetMap for location data
- The open-source community for amazing tools

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Made with ❤️ for people who can never decide what to eat
