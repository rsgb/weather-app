// HINTS:
// Import express and axios
import express from "express"; // É isto que permite toda a toolbox: GET/PUT/PATCH/etc, middleware, EJS, etc.
import axios from "axios";
import bodyParser from "body-parser";

// Create an express app and set the port number.
const app = express();
const port = 3000;

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Use the public folder for static files.
app.use(express.static("public"));

// API Variables
const API_GEO_URL = "https://api.openweathermap.org/geo/1.0/direct?";
const API_OPEN_URL = "https://api.openweathermap.org/data/2.5/weather?";
const API_Key = "0f153af8e0dabb1f0e98e6ea075558f2";

// When the user goes to the home page it should render the index.ejs file.

app.get("/", (req, res) => {
  res.render("index.ejs", {
    weather: null,
    description: null,
    temp: null,
    userCity: null,
    userCountry: null,
    error: null,
  });
});

// Receive user input: city, country
app.post("/", async (req, res) => {
  const userCity = req.body.city;
  const userCountry = req.body.country;

  // Passes user input to Geo for getting lattitude and longitude
  try {
    const result = await axios.get(
      `${API_GEO_URL}q=${userCity},${userCountry}&limit=1&appid=${API_Key}`
    );

    const lat = result.data[0].lat;
    const lon = result.data[0].lon;

    // Passes on lattitude and longitude to OpenWeather to get weather [!]
    const getWeather = await axios.get(
      `${API_OPEN_URL}lat=${lat}&lon=${lon}&units=metric&appid=${API_Key}`
    );

    const weatherMain = getWeather.data.weather[0].main;
    const weatherDescription = getWeather.data.weather[0].description;
    const weatherTemp = getWeather.data.main.temp;

    res.render("index.ejs", {
      weather: weatherMain,
      description: weatherDescription,
      temp: weatherTemp,
      country: userCountry,
      city: userCity,
      error: null,
    });
  } catch (error) {
    res.render("index.ejs", {
      weather: null,
      description: null,
      temp: null,
      userCity: null,
      userCountry: null,
      error: "Insert a valid location",
    });
  }
});

// Listen on your predefined port and start the server.
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
