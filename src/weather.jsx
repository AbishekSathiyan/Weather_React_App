import React, { useState } from "react";
import { FaLinkedin, FaGithub, FaLaptop, FaInstagram } from "react-icons/fa";

function Weather() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = "01fa927cb5f85e92ee612fee22b42a84";

  const getWeather = () => {
    if (city.trim() === "") {
      alert("Please enter a city name");
      return;
    }

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.cod === 200) {
          setWeatherData(data);
        } else {
          alert("City not found");
          setWeatherData(null);
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  };

  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-500 min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="font-bold text-3xl md:text-5xl lg:text-6xl p-5 m-6 text-center">Abi Weather App</h1>

      <div className="bg-white p-6 md:p-8 rounded-xl w-full max-w-md shadow-lg">
        <h1 className="font-bold text-2xl md:text-4xl mb-4 text-center text-gray-800">
          🌤️ Weather Report
        </h1>
        <p className="text-gray-700 text-center mb-4 text-sm md:text-base">
          Get real-time weather updates of your city!
        </p>

        <input
          type="text"
          placeholder="Enter City Name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="mt-2 border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
        />

        <button
          onClick={getWeather}
          className="mt-4 bg-blue-600 text-white p-3 rounded-md w-full hover:bg-blue-700 transition duration-300 cursor-pointer text-base"
        >
          Get Weather
        </button>

        {weatherData && (
          <div className="mt-6 text-gray-800 bg-green-100 p-4 rounded-md shadow-inner">
            <h2 className="font-bold text-lg mb-2">📍 {weatherData.name}</h2>
            <p>
              <span className="font-semibold">Weather:</span> {weatherData.weather[0].main}
            </p>
            <p>
              <span className="font-semibold">Temperature:</span> {weatherData.main.temp} °C
            </p>
            <p>
              <span className="font-semibold">Description:</span> {weatherData.weather[0].description}
            </p>
          </div>
        )}
      </div>

      {/* Social Media Icons */}
      <div className="mt-8 flex gap-6 md:gap-8 text-white text-2xl md:text-3xl">
        <a href="https://abisheksathiyan.github.io/Abishek_Portfolio/" target="_blank" rel="noreferrer" className="hover:text-yellow-200">
          <FaLaptop />
        </a>
        <a href="https://www.linkedin.com/in/abishek04/" target="_blank" rel="noreferrer" className="hover:text-blue-600">
          <FaLinkedin />
        </a>
        <a href="https://github.com/abisheksathiyan" target="_blank" rel="noreferrer" className="hover:text-black">
          <FaGithub />
        </a>
        <a href="https://www.instagram.com/entabilogist_abi/" target="_blank" rel="noreferrer" className="hover:text-pink-500">
          <FaInstagram />
        </a>
      </div>

      <p className="mt-4 text-white text-xs md:text-sm">© 2025 Abishek S</p>
    </div>
  );
}

export default Weather;
