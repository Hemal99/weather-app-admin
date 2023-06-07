import React from "react";
import "./dashboard.css";

export default function Dashboard(props) {
  //search

  return (
    <div class="container">
      <div class="weather-side">
        <div class="weather-gradient"></div>
        <div class="date-container">
          <h2 class="date-dayname">Tuesday</h2>
          <span class="date-day">15 Jan 2019</span>
          <i class="location-icon" data-feather="map-pin"></i>
          <span class="location">Paris, FR</span>
        </div>
        <div class="weather-container">
          <i class="weather-icon" data-feather="sun"></i>
          <h1 class="weather-temp">29°C</h1>
          <h3 class="weather-desc">Sunny</h3>
        </div>
      </div>
      <div class="info-side">
        <div class="today-info-container">
          <div class="today-info">
            <div class="precipitation">
              {" "}
              <span class="title">PRECIPITATION</span>
              <span class="value">0 %</span>
              <div class="clear"></div>
            </div>
            <div class="humidity">
              {" "}
              <span class="title">HUMIDITY</span>
              <span class="value">34 %</span>
              <div class="clear"></div>
            </div>
            <div class="wind">
              {" "}
              <span class="title">WIND</span>
              <span class="value">0 km/h</span>
              <div class="clear"></div>
            </div>
          </div>
        </div>
        <div class="week-container">
          <ul class="week-list">
            <li>
              <i class="day-icon" data-feather="sun"></i>
              <span class="day-name">Tue</span>
              <span class="day-temp">29°C</span>
            </li>
            <li>
              <i class="day-icon" data-feather="cloud"></i>
              <span class="day-name">Wed</span>
              <span class="day-temp">21°C</span>
            </li>
            <li>
              <i class="day-icon" data-feather="cloud-snow"></i>
              <span class="day-name">Thu</span>
              <span class="day-temp">08°C</span>
            </li>
            <li>
              <i class="day-icon" data-feather="cloud-rain"></i>
              <span class="day-name">Fry</span>
              <span class="day-temp">19°C</span>
            </li>
            <li>
              <i class="day-icon" data-feather="cloud-rain"></i>
              <span class="day-name">Fry</span>
              <span class="day-temp">19°C</span>
            </li>
            <li>
              <i class="day-icon" data-feather="cloud-rain"></i>
              <span class="day-name">Fry</span>
              <span class="day-temp">19°C</span>
            </li>
            <li>
              <i class="day-icon" data-feather="cloud-rain"></i>
              <span class="day-name">Fry</span>
              <span class="day-temp">19°C</span>
            </li>
            <div class="clear"></div>
          </ul>
        </div>
        <div class="location-container">
          <input
     
            type="text"
            class="location-input"
            placeholder="Enter Latitude"
          />
          <input
            type="text"
            class="location-input"
            placeholder="Enter Longitude"
          />

          <button class="location-button">
            {" "}
            <i data-feather="map-pin"></i>
            <span>Change location</span>
          </button>
        </div>
      </div>
    </div>
  );
}
