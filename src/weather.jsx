import React, { useState, useEffect, useRef } from "react";
import {
  FaLinkedin,
  FaGithub,
  FaLaptop,
  FaInstagram,
  FaSearch,
  FaMapMarkerAlt,
  FaMoon,
  FaSun,
  FaCloudRain,
  FaTemperatureHigh,
  FaTint,
  FaWind,
} from "react-icons/fa";
import {
  WiDaySunny,
  WiRain,
  WiCloudy,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from "react-icons/wi";
import { ImSpinner9 } from "react-icons/im";
import html2canvas from "html2canvas";
import { motion } from "framer-motion";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState("default");
  const cardRef = useRef(null);

  const apiKey = "01fa927cb5f85e92ee612fee22b42a84";

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeatherByCoords(latitude, longitude);
        fetchForecastByCoords(latitude, longitude);
      },
      () => {
        fetchWeatherByCoords(51.5074, -0.1278);
        fetchForecastByCoords(51.5074, -0.1278);
      }
    );
  }, []);

  useEffect(() => {
    if (weatherData) {
      const weatherMain = weatherData.weather[0].main;
      if (["Rain", "Drizzle", "Thunderstorm"].includes(weatherMain)) {
        setTheme("rainy");
      } else if (weatherMain === "Clear") {
        setTheme("sunny");
      } else if (weatherMain === "Clouds") {
        setTheme("default");
      } else {
        setTheme("dark");
      }
    }
  }, [weatherData]);

  const fetchWeatherByCoords = (lat, lon) => {
    setLoading(true);
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.cod === 200) {
          setWeatherData(data);
          setCity(data.name);
          updateHistory(data);
        } else {
          setError("Failed to fetch weather data");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to connect to weather service");
        setLoading(false);
      });
  };

  const fetchForecastByCoords = (lat, lon) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.cod === "200") {
          const dailyForecast = data.list
            .filter((_, index) => index % 8 === 0)
            .slice(0, 7);
          setForecastData(dailyForecast);
        }
      });
  };

  const getWeather = () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    setWeatherData(null);
    setForecastData(null);

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.cod === 200) {
          setWeatherData(data);
          fetchForecastByCity(data.coord.lat, data.coord.lon);
        } else {
          setError("City not found");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching weather data");
        setLoading(false);
      });
  };

  const fetchForecastByCity = (lat, lon) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.cod === "200") {
          const dailyForecast = data.list
            .filter((_, index) => index % 8 === 0)
            .slice(0, 7);
          setForecastData(dailyForecast);
        }
      });
  };

  const updateHistory = (data) => {
    const newEntry = {
      name: data.name,
      temp: data.main.temp,
      weather: data.weather[0].main,
      description: data.weather[0].description,
      time: new Date().toLocaleTimeString(),
    };
    setHistory((prev) => [newEntry, ...prev].slice(0, 7));
  };

  const downloadScreenshot = () => {
    if (!cardRef.current) return;
    html2canvas(cardRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.download = `${city}_weather.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const getDayName = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" });
  };

  const getWeatherIcon = (weather) => {
    switch (weather) {
      case "Clear": return <WiDaySunny className="text-5xl" />;
      case "Clouds": return <WiCloudy className="text-5xl" />;
      case "Rain": return <WiRain className="text-5xl" />;
      case "Snow": return <WiSnow className="text-5xl" />;
      case "Thunderstorm": return <WiThunderstorm className="text-5xl" />;
      case "Drizzle": return <WiRain className="text-5xl" />;
      case "Mist": return <WiFog className="text-5xl" />;
      default: return <WiDaySunny className="text-5xl" />;
    }
  };

  const getThemeStyles = () => {
    const themes = {
      default: {
        bg: "from-blue-400 to-blue-600",
        card: "bg-white/90 text-gray-800",
        button: "bg-blue-600 hover:bg-blue-700",
        metric: "bg-blue-100/80",
        text: "text-gray-800",
        icon: "text-blue-500",
        error: "bg-red-500/90",
      },
      sunny: {
        bg: "from-amber-400 to-orange-500",
        card: "bg-amber-50/90 text-amber-900",
        button: "bg-amber-500 hover:bg-amber-600",
        metric: "bg-amber-100/80",
        text: "text-amber-900",
        icon: "text-amber-500",
        error: "bg-red-600",
      },
      rainy: {
        bg: "from-blue-600 to-indigo-800",
        card: "bg-blue-50/90 text-blue-900",
        button: "bg-blue-600 hover:bg-blue-700",
        metric: "bg-blue-100/80",
        text: "text-blue-900",
        icon: "text-blue-500",
        error: "bg-blue-700/90",
      },
      dark: {
        bg: "from-gray-800 to-gray-900",
        card: "bg-gray-800/90 text-gray-100",
        button: "bg-gray-700 hover:bg-gray-600",
        metric: "bg-gray-700/80",
        text: "text-gray-100",
        icon: "text-gray-400",
        error: "bg-gray-700/90",
      },
    };
    return themes[theme] || themes.default;
  };

  const themeStyles = getThemeStyles();

  return (
    <div className={`relative min-h-screen bg-gradient-to-br ${themeStyles.bg} flex flex-col ${themeStyles.text} font-sans`} style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <button 
          onClick={() => setTheme("dark")} 
          className={`p-2 rounded-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-500/30"} hover:bg-gray-700 transition-colors`}
          title="Dark Mode"
        >
          <FaMoon />
        </button>
        <button 
          onClick={() => setTheme("sunny")} 
          className={`p-2 rounded-full ${theme === "sunny" ? "bg-amber-500" : "bg-amber-500/30"} hover:bg-amber-500 transition-colors`}
          title="Sunny Mode"
        >
          <FaSun />
        </button>
        <button 
          onClick={() => setTheme("rainy")} 
          className={`p-2 rounded-full ${theme === "rainy" ? "bg-blue-600" : "bg-blue-500/30"} hover:bg-blue-600 transition-colors`}
          title="Rainy Mode"
        >
          <FaCloudRain />
        </button>
      </div>

      {/* Weather Animations */}
      {theme === "sunny" && (
        <>
          <div className="absolute top-20 right-20 w-24 h-24 bg-yellow-300 rounded-full filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-yellow-300 rounded-full filter blur-xl opacity-10 animate-pulse"></div>
        </>
      )}
      {theme === "rainy" && (
        <>
          {[...Array(15)].map((_, i) => (
            <div 
              key={i}
              className="absolute top-0 h-1 bg-blue-300 rounded-full animate-rain"
              style={{
                left: `${Math.random() * 100}vw`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: Math.random() * 0.4 + 0.2,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 15 + 5}px`,
              }}
            />
          ))}
        </>
      )}
      {theme === "dark" && (
        <>
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute bg-white rounded-full animate-twinkle"
              style={{
                top: `${Math.random() * 100}vh`,
                left: `${Math.random() * 100}vw`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                opacity: Math.random(),
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto w-full px-4 sm:px-6 py-4">
        <motion.div
          className="w-full max-w-4xl mx-auto flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
            {getWeatherIcon(weatherData?.weather[0].main || "Clear")} Weather Forecast
          </h1>

          {/* Search Section */}
          <div className={`${themeStyles.card} backdrop-blur-md rounded-xl shadow-lg w-full max-w-md p-4 mb-6`}>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Enter city name..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && getWeather()}
                  className="w-full pl-10 p-3 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
                />
              </div>
              <button
                onClick={getWeather}
                className={`${themeStyles.button} text-white px-4 py-3 rounded-lg shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2`}
              >
                <FaSearch /> Search
              </button>
            </div>

            {loading && (
              <div className="flex justify-center py-4">
                <ImSpinner9 className="animate-spin text-3xl" />
              </div>
            )}

            {error && (
              <div className={`${themeStyles.error} text-white px-4 py-2 rounded-lg text-center mt-2 text-sm`}>
                {error}
              </div>
            )}
          </div>

          {/* Current Weather */}
          {weatherData && (
            <motion.div
              ref={cardRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`${themeStyles.card} w-full max-w-md p-5 rounded-xl shadow-xl mb-8`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <FaMapMarkerAlt className="text-red-500" />
                    {weatherData.name}, {weatherData.sys.country}
                  </h2>
                  <p className="text-sm opacity-80">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-4xl">
                  {getWeatherIcon(weatherData.weather[0].main)}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className={`${themeStyles.metric} p-3 rounded-lg flex flex-col items-center`}>
                  <FaTemperatureHigh className="text-xl mb-1" />
                  <p className="text-sm">Temp</p>
                  <p className="text-xl font-bold">{Math.round(weatherData.main.temp)}°C</p>
                </div>
                <div className={`${themeStyles.metric} p-3 rounded-lg flex flex-col items-center`}>
                  <FaTint className="text-xl mb-1" />
                  <p className="text-sm">Humidity</p>
                  <p className="text-xl font-bold">{weatherData.main.humidity}%</p>
                </div>
                <div className={`${themeStyles.metric} p-3 rounded-lg flex flex-col items-center`}>
                  <FaWind className="text-xl mb-1" />
                  <p className="text-sm">Wind</p>
                  <p className="text-xl font-bold">{weatherData.wind.speed} m/s</p>
                </div>
              </div>

              <div className={`${themeStyles.metric} p-3 rounded-lg text-center`}>
                <p className="text-sm">Conditions</p>
                <p className="text-lg font-medium capitalize">
                  {weatherData.weather[0].description}
                </p>
              </div>

              <button
                onClick={downloadScreenshot}
                className={`w-full mt-4 ${themeStyles.button} text-white py-2 px-4 rounded-lg transition-all hover:scale-[1.02] shadow-md`}
              >
                📸 Download Weather Card
              </button>
            </motion.div>
          )}

          {/* Forecast & History */}
          <div className="w-full space-y-6">
            {/* 7-Day Forecast */}
            {forecastData && (
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <h2 className="text-xl font-semibold mb-3 text-center">5-Day Forecast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {forecastData.map((day, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className={`${themeStyles.metric} p-2 rounded-lg flex flex-col items-center`}
                    >
                      <p className="font-medium text-sm">{getDayName(day.dt_txt)}</p>
                      <div className="my-1">
                        {getWeatherIcon(day.weather[0].main)}
                      </div>
                      <p className="font-bold">{Math.round(day.main.temp)}°</p>
                      <p className="text-xs opacity-80 capitalize">
                        {day.weather[0].description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Search History */}
            {history.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <h2 className="text-xl font-semibold mb-3 text-center">Recent Searches</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {history.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className={`${themeStyles.card} p-3 rounded-lg shadow-sm`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <FaMapMarkerAlt
                          className={
                            theme === "sunny"
                              ? "text-amber-500"
                              : theme === "rainy"
                              ? "text-blue-500"
                              : theme === "dark"
                              ? "text-gray-400"
                              : "text-blue-500"
                          }
                        />
                        <h3 className="font-bold">{item.name}</h3>
                      </div>
                      <div className="flex justify-between text-sm">
                        <p>{Math.round(item.temp)}°C</p>
                        <p className="capitalize">{item.description}</p>
                      </div>
                      <p className="text-xs opacity-60 mt-1">⏰ {item.time}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Fixed Footer */}
      <footer className="w-full py-4 bg-white/10 backdrop-blur-md border-t border-white/20">
        <div className="flex flex-col items-center">
          <div className="flex gap-4 text-xl mb-2">
            <a
              href="https://abishek-s-2002-portfolio-57dab.web.app/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-yellow-300 hover:scale-110 transition-transform"
              title="Portfolio"
            >
              <FaLaptop />
            </a>
            <a
              href="https://www.linkedin.com/in/abishek04/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-300 hover:scale-110 transition-transform"
              title="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com/abisheksathiyan"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gray-300 hover:scale-110 transition-transform"
              title="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.instagram.com/entabilogist_abi/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-400 hover:scale-110 transition-transform"
              title="Instagram"
            >
              <FaInstagram />
            </a>
          </div>
          <p className="text-sm opacity-80">
            © {new Date().getFullYear()} Abishek S
          </p>
        </div>
      </footer>

      {/* Animations CSS */}
      <style>
        {`
          @keyframes rain {
            0% { transform: translateY(-100px); }
            100% { transform: translateY(100vh); }
          }
          .animate-rain { animation: rain linear infinite; }
          
          @keyframes twinkle {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
          }
          .animate-twinkle { animation: twinkle 5s infinite; }

          /* Custom scrollbar */
          .overflow-y-auto {
            scrollbar-width: thin;
            scrollbar-color: rgba(255,255,255,0.3) transparent;
          }
          .overflow-y-auto::-webkit-scrollbar {
            width: 6px;
          }
          .overflow-y-auto::-webkit-scrollbar-track {
            background: transparent;
          }
          .overflow-y-auto::-webkit-scrollbar-thumb {
            background-color: rgba(255,255,255,0.3);
            border-radius: 3px;
          }
        `}
      </style>
    </div>
  );
};

export default Weather;