import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [zoos, setZoos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchZooData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/zoo/all'); // Replace with your actual endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch zoo data');
        }
        const data = await response.json();
        setZoos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchZooData();
  }, []);



  const handleRedirect=(path) =>{
    navigate(path);

  }


  const stats = {
    totalZoos: zoos.length,
    totalAnimals: zoos.reduce((sum, zoo) => sum + (zoo.animals?.length || 0), 0),
    totalWorkers: zoos.reduce((sum, zoo) => sum + (zoo.worker?.length || 0), 0),
    totalEnclosures: zoos.reduce((sum, zoo) => sum + (zoo.enclosure?.length || 0), 0)
  };

  const navigationItems = [
    {
      title: "Manage Zoos",
      description: "View and edit zoo information",
      icon: "🏛️",
      color: "from-emerald-100 to-teal-100",
      borderColor: "border-emerald-200/50",
      onClick: () => {handleRedirect("/zoos")}
    },
    {
      title: "Animal Directory",
      description: "Browse all animals across zoos",
      icon: "🦁",
      color: "from-orange-100 to-amber-100",
      borderColor: "border-orange-200/50",
      onClick: () => {handleRedirect("/animals")}
    },
    {
      title: "Staff Management",
      description: "Manage workers and assignments",
      icon: "👥",
      color: "from-blue-100 to-indigo-100",
      borderColor: "border-blue-200/50",
      onClick: () => {}
    },
    {
      title: "Enclosures",
      description: "View and manage animal habitats",
      icon: "🏞️",
      color: "from-purple-100 to-pink-100",
      borderColor: "border-purple-200/50",
      onClick: () => {}
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading zoo data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">Error loading data: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full animate-pulse"></div>
            <h1 className="text-4xl font-light text-slate-800 tracking-wide">Welcome back</h1>
          </div>
          <p className="text-lg text-slate-600 ml-8">Your zoo management overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-6 shadow-lg border border-emerald-100/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏛️</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-800">{stats.totalZoos}</div>
                <div className="text-sm text-slate-500">Total Zoos</div>
              </div>
            </div>
            <div className="w-full bg-emerald-100 rounded-full h-2">
              <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full" style={{width: '75%'}}></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-6 shadow-lg border border-orange-100/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🦁</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-800">{stats.totalAnimals}</div>
                <div className="text-sm text-slate-500">Total Animals</div>
              </div>
            </div>
            <div className="w-full bg-orange-100 rounded-full h-2">
              <div className="bg-gradient-to-r from-orange-400 to-amber-500 h-2 rounded-full" style={{width: '92%'}}></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-800">{stats.totalWorkers}</div>
                <div className="text-sm text-slate-500">Total Workers</div>
              </div>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full" style={{width: '68%'}}></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-lg border border-purple-100/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏞️</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-800">{stats.totalEnclosures}</div>
                <div className="text-sm text-slate-500">Total Enclosures</div>
              </div>
            </div>
            <div className="w-full bg-purple-100 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full" style={{width: '84%'}}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {navigationItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.color} border ${item.borderColor} p-6 text-left hover:shadow-lg hover:scale-[1.02] transition-all duration-300`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">{item.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 group-hover:text-slate-700 transition-colors">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-500 group-hover:text-slate-600 transition-colors">
                  <span className="text-sm">Explore</span>
                  <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}