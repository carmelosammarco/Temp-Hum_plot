import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

function App() {
  const [chartData, setChartData] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          if (Array.isArray(jsonData)) {
            const timestamps = jsonData.map(item => item.timestamp);
            const temperatures = jsonData.map(item => item.temperature);
            const humidities = jsonData.map(item => item.humidity);

            setChartData({
              labels: timestamps,
              datasets: [
                {
                  label: 'Temperature (°C)',
                  data: temperatures,
                  borderColor: 'rgb(255, 99, 132)',
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  yAxisID: 'temperatureAxis',
                },
                {
                  label: 'Humidity (%)',
                  data: humidities,
                  borderColor: 'rgb(54, 162, 235)',
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  yAxisID: 'humidityAxis',
                },
              ],
            });
          } else {
            alert('JSON data must be an array of objects.');
          }
        } catch (error) {
          alert('Error parsing JSON file: ' + error);
        }
      };
      reader.readAsText(file);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          parser: 'dd/MM/yyyy, HH:mm:ss',
          tooltipFormat: 'dd/MM/yyyy, HH:mm:ss',
          displayFormats: {
            millisecond: 'HH:mm:ss.SSS',
            second: 'HH:mm:ss',
            minute: 'HH:mm',
            hour: 'HH',
            day: 'dd',
            week: 'MM/DD',
            month: 'MM',
            quarter: 'MM/yyyy',
            year: 'yyyy'
          }
        },
        title: {
          display: true,
          text: 'Timestamp',
          color: darkMode ? 'white' : 'black'
        },
        ticks: {
          color: darkMode ? 'white' : 'black'
        }
      },
      temperatureAxis: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Temperature (°C)',
          color: darkMode ? 'white' : 'black'
        },
        grid: {
          display: false
        },
        ticks: {
          color: darkMode ? 'white' : 'black'
        }
      },
      humidityAxis: {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Humidity (%)',
          color: darkMode ? 'white' : 'black'
        },
        grid: {
          display: false
        },
        ticks: {
          color: darkMode ? 'white' : 'black'
        }
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Temperature and Humidity Over Time',
        color: darkMode ? 'white' : 'black'
      },
      legend: {
        labels: {
          color: darkMode ? 'white' : 'black'
        }
      }
    },
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <div className="toggle-container">
        <span className="toggle-label">Dark Mode</span>
        <label className="switch">
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="app-container">
        <h1>Temperature and Humidity Plot</h1>
        <div className="input-container">
          <input type="file" accept=".json" onChange={handleFileChange} />
        </div>
        {chartData && (
          <div className="chart-container">
            <Line options={chartOptions} data={chartData} />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
