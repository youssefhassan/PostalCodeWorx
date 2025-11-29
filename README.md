# 🧤 PostalCodeWorx - Glove Finder

A community platform for reuniting lost gloves with their owners, powered by AI.

## Features

- **Upload Found Gloves**: Take a photo, and Claude AI identifies brand, color, size
- **Search Lost Gloves**: Filter by postal code, brand, color, size, date
- **Secure Contact**: Pay a small finder's fee to connect with the finder
- **Berlin Focus**: MVP supports Berlin postal codes (5-digit format)

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python), SQLAlchemy
- **Database**: PostgreSQL
- **AI**: Anthropic Claude API
- **Infrastructure**: Docker Compose

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Anthropic API key

### Setup

1. Clone the repo and navigate to the project:
   ```bash
   cd PostalCodeWorx
   ```

2. Copy environment file and add your Anthropic API key:
   ```bash
   cp .env.example .env
   # Edit .env and add your ANTHROPIC_API_KEY
   ```

3. Start all services:
   ```bash
   docker-compose up --build
   ```

4. Open in browser:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Development

### Backend Only
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Only
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/gloves/upload` | Upload a found glove |
| GET | `/api/gloves/search` | Search for gloves |
| GET | `/api/gloves/{id}` | Get glove details |
| POST | `/api/gloves/{id}/contact` | Pay fee and contact finder |
| POST | `/api/gloves/{id}/report` | Report a listing |
| POST | `/api/analyze-image` | Analyze glove image with Claude |

## Postaal Coin Economy

- Users start with 10 Postaal coins
- Upload a glove: Free (earns coins when claimed)
- Contact a finder: Pay finder's fee
  - Postaal coins: Direct transfer
  - Euro (€): 20% platform fee

## License

MIT



