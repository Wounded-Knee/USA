# Whitepine - Civic Platform

A civic platform rooted in the Great Tree of Peace, carrying forward the tradition of consensus, unity, and strength into the digital age. Built with Next.js 15, Express.js, and MongoDB Atlas, featuring a modern civic interface with Federal Standard color palette.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── sandgraph/         # SandGraph route
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
server/
├── models/                # MongoDB models
├── routes/                # API endpoints
├── middleware/            # Express middleware
├── utils/                 # Utility functions
└── index.js              # Express server
```

## Getting Started

### Development

Run the full-stack development server:

```bash
npm run dev:full
```

This starts both the frontend (port 3000) and backend (port 5000) concurrently.

### Frontend Only

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Backend Only

```bash
npm run server:dev
```

## Technologies

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, App Router
- **Backend**: Express.js with MongoDB Atlas integration
- **Database**: MongoDB Atlas with Mongoose ODM
- **Styling**: Federal Standard color palette with Tailwind CSS
- **Fonts**: Geist font family optimized with next/font

## Features

- Civic platform for collective decision-making
- Testimonies and consensus building tools
- Federal Standard color palette implementation
- Responsive design with Tailwind CSS
- Interactive statistics and community engagement
- Full-stack architecture with Express backend
- MongoDB Atlas database integration

## Color System

This project implements a comprehensive Federal Standard color palette with 36 distinct colors. See `FEDERAL_COLORS_README.md` for detailed color documentation and usage examples.
