'use client';

import { useState } from 'react';
import { 
  greetingApi, 
  weatherApi, 
  GreetingResponse, 
  WeatherResponse,
  ApiError 
} from '@/lib/api';

export default function Home() {
  // ============ State ============
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState<GreetingResponse | null>(null);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState<'greet' | 'weather' | null>(null);
  const [error, setError] = useState('');

  // ============ Handlers ============
  const handleFetchGreeting = async () => {
    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }
    
    setLoading('greet');
    setError('');
    
    try {
      const data = await greetingApi.getGreeting(name);
      setGreeting(data);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Unknown error';
      setError(message);
      setGreeting(null);
    } finally {
      setLoading(null);
    }
  };

  const handleFetchWeather = async () => {
    setLoading('weather');
    setError('');
    
    try {
      const data = await weatherApi.getWeather();
      setWeather(data);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Unknown error';
      setError(message);
      setWeather(null);
    } finally {
      setLoading(null);
    }
  };

  // ============ Render ============
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 font-sans dark:bg-black">
      <h1 className="mb-8 text-3xl font-bold text-gray-800 dark:text-white">
        Hello! This is Melo!
      </h1>

      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-md dark:bg-zinc-900">
        {/* Greeting Section */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Greet API
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetchGreeting()}
              className="flex-1 rounded border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
            <button
              onClick={handleFetchGreeting}
              disabled={loading === 'greet'}
              className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'greet' ? 'Loading...' : 'Greet'}
            </button>
          </div>
          {greeting && (
            <div className="rounded bg-green-100 p-3 text-green-800 dark:bg-green-900 dark:text-green-200">
              <p className="font-medium">{greeting.message}</p>
            </div>
          )}
        </section>

        <hr className="border-gray-200 dark:border-zinc-700" />

        {/* Weather Section */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Weather API
          </h2>
          <button
            onClick={handleFetchWeather}
            disabled={loading === 'weather'}
            className="w-full rounded bg-purple-600 px-4 py-2 text-white transition hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'weather' ? 'Loading...' : 'Get Weather'}
          </button>
          {weather && (
            <div className="rounded bg-blue-50 p-4 text-sm text-blue-900 dark:bg-blue-900/30 dark:text-blue-200">
              <div className="grid grid-cols-2 gap-2">
                <p><span className="font-medium">City:</span> {weather.city}</p>
                <p><span className="font-medium">Date:</span> {weather.date}</p>
                <p><span className="font-medium">Weather:</span> {weather.weather}</p>
                <p><span className="font-medium">Temp:</span> {weather.temperature}°C</p>
                <p><span className="font-medium">Humidity:</span> {weather.humidity}%</p>
                <p><span className="font-medium">Wind:</span> {weather.wind_speed} km/h</p>
              </div>
            </div>
          )}
        </section>

        {/* Error Message */}
        {error && (
          <div className="rounded bg-red-100 p-3 text-red-800 dark:bg-red-900 dark:text-red-200">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
