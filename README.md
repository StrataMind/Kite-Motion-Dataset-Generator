# Kite Motion Dataset Generator

A web application for generating synthetic kite motion datasets with realistic statistical properties for machine learning and data analysis.

## Live Demo

Visit the live application: [Kite Motion Dataset Generator](https://surajsk2003.github.io/Kite-Motion-Dataset-Generator)

## Features

- Generate synthetic kite motion datasets with configurable row counts
- Statistical properties based on real-world kite flight data
- Download generated datasets as CSV files
- Interactive UI with dataset preview
- Parameter statistics visualization

## Dataset Parameters

The generator includes the following parameter types:

- **Base Parameters**: Yaw, Pitch, Roll, Altitude, Latitude, Longitude, Calibration values, Wind speed
- **Synthetic Parameters**: Temperature, Humidity, Pressure, and other environmental factors

## How It Works

The application uses the Box-Muller transform to generate normally distributed values with statistical properties (mean, standard deviation, min, max) derived from real kite motion data. Values are clipped to maintain realistic bounds.

## Technologies Used

- React.js
- CSS with modern animations and responsive design
- Lucide React for icons

## Local Development

1. Clone the repository
```
git clone https://github.com/surajsk2003/Kite-Motion-Dataset-Generator.git
```

2. Install dependencies
```
cd kite-dataset-generator
npm install
```

3. Start the development server
```
npm start
```

4. Build for production
```
npm run build
```

## Deployment

The application is deployed using GitHub Pages. To deploy updates:

```
npm run deploy
```

## License

MIT