// src/components/Main.js
import React, { useState } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import '../styles/Main.css'; // Import the custom CSS file

function Main() {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);

  const apiKey = '5c9b1a982ab142ffa67115514242205'; // Replace with your actual API key

  const getWeather = async () => {
    setError(null);

    try {
      const response = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no&alerts=no`);
      setWeather(response.data.current);
      setForecast(response.data.forecast.forecastday);
    } catch (error) {
      console.error('Error fetching the weather data', error);
      setError('Error fetching the weather data');
    }
  };

  // Autosuggest will call this function every time you need to update suggestions.
  const onSuggestionsFetchRequested = async ({ value }) => {
    try {
      const response = await axios.get(`http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${value}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions', error);
      setSuggestions([]);
    }
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  // When suggestion is selected, this function will be called.
  const onSuggestionSelected = (event, { suggestion }) => {
    setCity(suggestion.name);
  };

  // Use your imagination to render suggestions.
  const renderSuggestion = suggestion => (
    <div className="suggestion-item">
      {suggestion.name}, {suggestion.region}, {suggestion.country}
    </div>
  );

  const inputProps = {
    placeholder: 'Enter city',
    value: city,
    onChange: (event, { newValue }) => setCity(newValue),
  };

  return (

      <div className="card custom-card">
        <div className="card-body">
          <h3 className="card-title text-center">Weather Forecast</h3>
          <div className="input-group my-3">
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={onSuggestionsFetchRequested}
              onSuggestionsClearRequested={onSuggestionsClearRequested}
              onSuggestionSelected={onSuggestionSelected}
              getSuggestionValue={suggestion => suggestion.name}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
              theme={{
                input: 'form-control',
                suggestionsContainer: 'suggestions-container',
                suggestion: 'suggestion-item',
                suggestionHighlighted: 'suggestion-item--highlighted',
              }}
            />
            <button className="btn btn-primary custom-btn" type="button" onClick={getWeather}>
              Check
            </button>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          {weather && (
            <div className="current-weather mb-4">
              <div className="row">
                <div className="col-md-6">
                  <h4>{city}</h4>
                  <p>Temperature: <strong>{weather.temp_c}°C</strong></p>
                  <p>Feels like: <strong>{weather.feelslike_c}°C</strong></p>
                  <p>Humidity: <strong>{weather.humidity}%</strong></p>
                  <p>Wind Speed: <strong>{weather.wind_kph} kph</strong></p>
                  <p>Pressure: <strong>{weather.pressure_mb} mb</strong></p>
                  <p>UV Index: <strong>{weather.uv}</strong></p>
                </div>
                <div className="col-md-6">
                  <p>Visibility: <strong>{weather.vis_km} km</strong></p>
                  <p>Precipitation: <strong>{weather.precip_mm} mm</strong></p>
                  <p>Cloud Cover: <strong>{weather.cloud}%</strong></p>
                  <p>Wind Gust: <strong>{weather.gust_kph} kph</strong></p>
                  <div className="d-flex justify-content-center">
                    <p className="me-2">{weather.condition.text}</p>
                    <img src={weather.condition.icon} alt="Weather icon" />
                  </div>
                </div>
              </div>
            </div>
          )}
          {forecast && (
            <div className="forecast">
              <h4>3-Day Forecast</h4>
              <div className="row">
                {forecast.map(day => (
                  <div key={day.date} className="col-md-4 forecast-day">
                    <h5>{day.date}</h5>
                    <p>Max Temp: <strong>{day.day.maxtemp_c}°C</strong></p>
                    <p>Min Temp: <strong>{day.day.mintemp_c}°C</strong></p>
                    <p>Avg Temp: <strong>{day.day.avgtemp_c}°C</strong></p>
                    <p>Max Wind: <strong>{day.day.maxwind_kph} kph</strong></p>
                    <p>Precipitation: <strong>{day.day.totalprecip_mm} mm</strong></p>
                    <p>Humidity: <strong>{day.day.avghumidity}%</strong></p>
                    <div className="d-flex justify-content-center">
                      <p className="me-2">{day.day.condition.text}</p>
                      <img src={day.day.condition.icon} alt="Weather icon" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

  );
}

export default Main;
