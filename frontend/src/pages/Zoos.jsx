import React, { useState, useEffect } from "react";

const Zoos = () => {
  const [zoos, setZoos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingZoo, setIsAddingZoo] = useState(false);
  const [newZooName, setNewZooName] = useState("");

  useEffect(() => {
    const fetchZoos = async () => {
      try {
        const response = await fetch("http://localhost:8000/zoo/all");
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch");
        setZoos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchZoos();
  }, []);


  const handleRedirect = (path) => {
    navigate(path);
  };

  const handleAddZoo = async (e) => {
    e.preventDefault();
    if (!newZooName.trim()) return;

    try {
      setIsAddingZoo(true);
      const response = await fetch("http://localhost:8000/zoo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newZooName }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add zoo");
      setZoos([...zoos, data]);
      setNewZooName("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAddingZoo(false);
    }
  };

  const handleDeleteZoo = async (zooId) => {
    if (!window.confirm("Are you sure you want to delete this zoo?")) return;

    try {
      const response = await fetch(`http://localhost:8000/zoo/${zooId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete zoo");
      setZoos(zoos.filter((zoo) => zoo.id !== zooId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading zoos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">Error: {error}</p>
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full animate-pulse"></div>
            <h1 className="text-4xl font-light text-slate-800 tracking-wide">
              Zoo Management
            </h1>
          </div>
          <p className="text-lg text-slate-600 ml-8">
            Manage your zoo locations
          </p>
        </div>

        <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-6 shadow-lg border border-emerald-100/50 mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-3">
            <span className="text-2xl">➕</span>
            Add New Zoo
          </h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={newZooName}
                onChange={(e) => setNewZooName(e.target.value)}
                placeholder="Enter zoo name..."
                className="w-full px-4 py-3 rounded-xl border border-emerald-200/50 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400"
                disabled={isAddingZoo}
                onKeyPress={(e) => e.key === "Enter" && handleAddZoo(e)}
              />
            </div>
            <button
              onClick={handleAddZoo}
              disabled={isAddingZoo || !newZooName.trim()}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isAddingZoo ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Adding...
                </div>
              ) : (
                "Add Zoo"
              )}
            </button>
          </div>
        </div>

        {zoos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏛️</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No zoos yet
            </h3>
            <p className="text-slate-500">Add your first zoo to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {zoos.map((zoo) => (
              <div
                key={zoo.id}
                className="group relative overflow-hidden bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 shadow-lg border border-slate-200/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-200/40 to-transparent rounded-full -translate-y-6 translate-x-6"></div>

                <div className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🏛️</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-800 group-hover:text-emerald-800 transition-colors">
                        {zoo.name}
                      </h3>
                      <p className="text-sm text-slate-500">ID: {zoo.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-2 bg-white/50 rounded-lg">
                      <div className="text-sm font-medium text-slate-800">
                        {zoo.animals?.length || 0}
                      </div>
                      <div className="text-xs text-slate-500">Animals</div>
                    </div>
                    <div className="text-center p-2 bg-white/50 rounded-lg">
                      <div className="text-sm font-medium text-slate-800">
                        {zoo.worker?.length || 0}
                      </div>
                      <div className="text-xs text-slate-500">Staff</div>
                    </div>
                    <div className="text-center p-2 bg-white/50 rounded-lg">
                      <div className="text-sm font-medium text-slate-800">
                        {zoo.enclosure?.length || 0}
                      </div>
                      <div className="text-xs text-slate-500">Enclosures</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-emerald-100 text-emerald-700 py-2 px-4 rounded-lg font-medium hover:bg-emerald-200 transition-colors text-sm">
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeleteZoo(zoo.id)}
                      className="bg-red-100 text-red-700 py-2 px-4 rounded-lg font-medium hover:bg-red-200 transition-colors text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {zoos.length > 0 && (
          <div className="mt-8 bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 shadow-lg border border-slate-200/50">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Quick Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {zoos.length}
                </div>
                <div className="text-sm text-slate-500">Total Zoos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {zoos.reduce(
                    (sum, zoo) => sum + (zoo.animals?.length || 0),
                    0
                  )}
                </div>
                <div className="text-sm text-slate-500">Total Animals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {zoos.reduce(
                    (sum, zoo) => sum + (zoo.worker?.length || 0),
                    0
                  )}
                </div>
                <div className="text-sm text-slate-500">Total Staff</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {zoos.reduce(
                    (sum, zoo) => sum + (zoo.enclosure?.length || 0),
                    0
                  )}
                </div>
                <div className="text-sm text-slate-500">Total Enclosures</div>
              </div>
            </div>
          </div>
        )}
      </div>
      <button
        onClick={() => handleRedirect("/")}
        className="flex items-center gap-2 bg-slate-100 text-slate-700 py-2 px-6 rounded-lg font-medium hover:bg-slate-200 transition-colors"
      >
        ← Back to Dashboard
      </button>
    </div>
  );
};

export default Zoos;
