// src/Weather.js
import React, { useState } from 'react';
import './Weather.css';

function Weather() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const apiKey = '88a45f81372cb5012698ee6b6cd0bd31'; // Replace with your actual OpenWeather API key

  const fetchWeather = async () => {
    try {
      setError('');
      setWeatherData(null);

      if (!city) {
        setError('Please enter a city name');
        return;
      }

      // Step 1: Get latitude and longitude for the city
    const geoResponse = await fetch(
      `https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    );

      if (!geoResponse.ok) {
        throw new Error('City not found');
      }

      const geoData = await geoResponse.json();

      if (geoData.length === 0) {
        throw new Error('City not found');
      }

      const { lat, lon } = geoData[0];

      // Step 2: Use latitude and longitude to get detailed weather data
      const weatherResponse = await fetch(
        `https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );

      if (!weatherResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const weatherData = await weatherResponse.json();
      setWeatherData({
        temperature: weatherData.main.temp,
        condition: weatherData.weather[0].main,
        description: weatherData.weather[0].description,
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        windSpeed: weatherData.wind.speed,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="weather-container">
      <h1 className="app-title">Weather Now</h1>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
        className="city-input"
      />
      <button onClick={fetchWeather} className="fetch-button">Get Weather</button>
      
      {error && <p className="error-message">{error}</p>}
      
      {weatherData && (
        <div className="weather-info">
          <h2>Weather in {city}</h2>
          <p><strong>Temperature:</strong> {weatherData.temperature}°C</p>
          <p><strong>Humidity:</strong> {weatherData.humidity}%</p>
          <p><strong>Pressure:</strong> {weatherData.pressure} hPa</p>
          <p><strong>Wind Speed:</strong> {weatherData.windSpeed} m/s</p>
          <p><strong>Condition:</strong> {weatherData.condition} ({weatherData.description})</p>
        </div>
      )}
    </div>
  );
}

export default Weather;
