# G8 Evolved - Yamaha G8 Golf Cart Conversion Documentation

A comprehensive, interactive documentation site for the complete electronics upgrade of a Yamaha G8 golf cart. This project includes interactive wiring diagrams, detailed component specifications, and a step-by-step build guide.

## Overview

This Next.js application provides an interactive platform to document the end-to-end upgrade of a Yamaha G8 golf cart, replacing all original electronics with modern components including:

- 48V Lithium-Ion battery pack with BMS
- High-efficiency motor controller
- Digital dashboard and monitoring system
- LED lighting system
- Advanced safety features
- Regenerative braking capability

## Features

- **Interactive Wiring Diagrams**: Built with JointJS, allowing users to click on components and connections for detailed specifications
- **Component Database**: Complete parts list with specifications and cost breakdown
- **Build Guide**: Phased approach with detailed steps, timeline, and safety information
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode**: Automatic theme switching based on system preferences

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Diagrams**: JointJS (@joint/core)
- **Deployment Ready**: Optimized for Vercel, Netlify, or any Node.js hosting

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/g8-evolved.git
cd g8-evolved

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
g8-evolved/
├── app/                    # Next.js app directory
│   ├── components/        # Component specs page
│   ├── guide/            # Build guide page
│   ├── wiring/           # Interactive wiring diagrams
│   ├── layout.tsx        # Root layout with navigation
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # React components
│   └── WiringDiagram.tsx # Interactive diagram component
└── public/              # Static assets
```

## Key Pages

- **Home** (`/`): Project overview and key features
- **Wiring Diagrams** (`/wiring`): Interactive electrical diagrams
- **Components** (`/components`): Complete parts list and specifications
- **Build Guide** (`/guide`): Step-by-step installation instructions

## Interactive Wiring Diagrams

The wiring diagrams are built using JointJS and include:

- Clickable components showing detailed specifications
- Clickable connections showing wire gauge and color codes
- Drag-and-drop functionality for custom arrangements
- Visual representation of the complete electrical system

## Safety Notice

⚠️ **WARNING**: This project involves working with high-voltage electrical systems. Always:
- Disconnect all power before working
- Use properly rated tools and safety equipment
- Follow local electrical codes
- Consult a professional if unsure

## Contributing

Contributions are welcome! Areas for improvement:

- Additional wiring diagrams (charging, lighting, safety systems)
- More detailed component reviews
- Video tutorials
- Community builds showcase
- Troubleshooting guide

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Yamaha G8 owner community for inspiration
- JointJS team for the excellent diagramming library
- All contributors and testers

## Contact

For questions or contributions, please open an issue on GitHub.

---

Built with ❤️ for the golf cart enthusiast community
