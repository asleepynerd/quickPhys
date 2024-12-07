# quickPhys

A particle physics sandbox built from scratch, only using Vite for the build process.

## Features

- 2D physics simulation
- Particle creation and destruction
- Black holes that attract particles
- Sand, fire, and metal tools
- Interactive controls for manipulating particles
- Temperature-based reactions between particles
- Visual representation of particles and their interactions
- Back to main button when accessed through a proxied URL

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/asleepynerd/quickPhys.git
   cd quickPhys
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

### Running the Application

To start the development server, run:

```bash
npm run dev
```

This will start the Vite development server, and you can access the application at `http://localhost:5173`.

### Building for Production

To build the application for production, run:

```bash
npm run build
```

This will create a `dist` folder with the production-ready files.

### Previewing the Build

To preview the production build, run:

```bash
npm run preview
```

This will serve the files from the `dist` folder.

## Usage

Once the application is running, you can interact with the simulation using the controls provided. You can create different types of particles, manipulate their properties, and observe their interactions in real-time.

### Controls

- **Particle Types**: Select from various particle types (sand, water, acid, etc.) to create them in the simulation.
- **Temperature Tools**: Use the cool and heat buttons to change the temperature of particles in the grid.
- **Clear All**: Remove all particles from the simulation.
- **Pause**: Pause the simulation to analyze the current state.

### Back to Main

If you access the application through the proxied URL (`https://sleepy.engineer/quickphys`), a "Back to Main" button will appear, allowing you to easily navigate back to the main site.

## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
