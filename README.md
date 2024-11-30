# GoMaps

GoMaps is a web-based application that allows users to search for nearby places such as cafés, restaurants, hotels, and more. It utilizes the Leaflet library for interactive maps and integrates with various APIs to fetch location data, providing a seamless user experience for exploring local amenities.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

- **Interactive Map**: Users can view and interact with a map to find nearby places, zoom in/out, and click on locations for more information.
- **Search Functionality**: Users can search for specific locations by name, making it easy to find desired places quickly.
- **Filter Options**: Users can filter search results by categories such as cafés, restaurants, hotels, pharmacies, and hospitals, allowing for tailored searches.
- **Radius Selector**: Users can select a search radius (from 100m to 10km) to find nearby places, enhancing the relevance of search results.
- **Place Information**: Users can view detailed information about selected places, including images, ratings, contact details, and addresses.
- **Directions**: Users can get directions from their current location to a selected place, making navigation straightforward.
- **Responsive Design**: The application is designed to be responsive, ensuring usability on both desktop and mobile devices.

## Technologies Used

- **Frontend**: 
  - **HTML**: Structure of the web application.
  - **CSS**: Styling and layout of the application.
  - **JavaScript**: Interactivity and dynamic content management.
- **Map Library**: 
  - **Leaflet.js**: A leading open-source JavaScript library for mobile-friendly interactive maps.
- **APIs**: 
  - **OpenStreetMap**: For geocoding and reverse geocoding services.
  - **Google Places API**: For fetching nearby places and detailed information about them.
- **Backend**: 
  - **Java**: The application is built using Java, leveraging the Jetty server for handling HTTP requests and serving static resources.

## Installation

To set up the GoMaps project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/faiz-oussama/gomaps.git
   cd gomaps
   ```

2. **Ensure you have the following installed**:
   - **Java 17**: Download and install from [Oracle](https://www.oracle.com/java/technologies/javase-jdk17-downloads.html) or use a package manager.
   - **Maven**: Download and install from [Maven's official site](https://maven.apache.org/download.cgi).

3. **Build the project**:
   ```bash
   mvn clean install
   ```

4. **Run the application**:
   ```bash
   mvn javafx:run
   ```

5. **Access the application**:
   Open your browser and navigate to `http://localhost:8080` to access the GoMaps application.

## Usage

Once the application is running, you can use it as follows:

- **Search for a Place**: Enter a place name in the search bar and click the search button. The application will display relevant results on the map and in the results table.
- **Filter Results**: Use the dropdown menu to select a filter category (e.g., Café, Restaurant) to narrow down your search results.
- **Adjust Search Radius**: Use the radius slider to set the distance within which to search for places. The results will update dynamically based on the selected radius.
- **View Place Details**: Click on a place in the results to view detailed information, including images, ratings, and contact information.
- **Get Directions**: Click the "Get Directions" button to view the route from your current location to the selected place.

## API Integration

GoMaps integrates with several APIs to provide its functionality:

- **OpenStreetMap API**: Used for geocoding (converting addresses into geographic coordinates) and reverse geocoding (finding addresses from geographic coordinates).
- **Google Places API**: Used to fetch nearby places based on user queries and to retrieve detailed information about specific places, including photos, ratings, and reviews.

### API Keys

To use the Google Places API, you will need to obtain an API key. Follow these steps:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to the "APIs & Services" dashboard.
4. Enable the "Places API" for your project.
5. Create credentials (API key) and restrict it to your application's domain for security.

Make sure to replace the placeholder API key in the `main.js` file with your actual API key.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with clear messages.
4. Push your changes to your forked repository.
5. Open a pull request to the main repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Leaflet.js**: For providing a powerful and easy-to-use mapping library.
- **OpenStreetMap**: For offering free geographic data and mapping services.
- **Google Places API**: For enabling rich place data and location services.
- **Jetty**: For serving the application and handling HTTP requests efficiently.

---

Feel free to reach out if you have any questions or need assistance with the project!
