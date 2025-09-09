import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Animals = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoos, setZoos] = useState([]);
  const [isAddingAnimal, setIsAddingAnimal] = useState(false);
  const [newAnimalName, setNewAnimalName] = useState("");
  const [newAnimalSpecies, setNewAnimalSpecies] = useState("");
  const [newAnimalAge, setNewAnimalAge] = useState("");
  const [selectedZooId, setSelectedZooId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const animalsResponse = await fetch(
          "http://localhost:8000/animals/all"
        );
        if (!animalsResponse.ok) {
          throw new Error("Failed to fetch animal data");
        }
        const animalsData = await animalsResponse.json();
        setAnimals(animalsData);

        const zoosResponse = await fetch("http://localhost:8000/zoo/all");
        if (!zoosResponse.ok) {
          throw new Error("Failed to fetch zoo data");
        }
        const zoosData = await zoosResponse.json();
        setZoos(zoosData);

        if (zoosData.length > 0) {
          setSelectedZooId(zoosData[0].id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddAnimal = async (e) => {
    e.preventDefault();
    if (!newAnimalName || !newAnimalSpecies || !selectedZooId || !newAnimalAge)
      return;

    try {
      setIsAddingAnimal(true);
      const animalData = {
        name: newAnimalName,
        species: newAnimalSpecies,
        age: Number(newAnimalAge),
        zoo_id: selectedZooId,
        date: new Date().toISOString(),
      };

      const response = await fetch(
        `http://localhost:8000/animals/${selectedZooId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(animalData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add animal");
      }

      const newAnimal = await response.json();
      setAnimals([...animals, newAnimal]);
      setNewAnimalName("");
      setNewAnimalSpecies("");
      setNewAnimalAge("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAddingAnimal(false);
    }
  };

  const handleDeleteAnimal = async (animalId) => {
    if (!window.confirm("Are you sure you want to delete this animal?")) return;

    try {
      const response = await fetch(`http://localhost:8000/animals/${animalId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete animal");
      }

      setAnimals(animals.filter((animal) => animal.id !== animalId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRedirect = (path) => {
    navigate(path);
  };

  const stats = {
    totalAnimals: animals.length,
    uniqueSpecies: [...new Set(animals.map((animal) => animal.species))].length,
    averageAge:
      animals.length > 0
        ? (
            animals.reduce((sum, animal) => sum + (animal.age || 0), 0) /
            animals.length
          ).toFixed(1)
        : 0,
    animalsPerZoo: zoos.reduce((acc, zoo) => {
      const zooAnimals = animals.filter((animal) => animal.zoo_id === zoo.id);
      return zooAnimals.length > 0
        ? [...acc, { name: zoo.name, count: zooAnimals.length }]
        : acc;
    }, []),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading animal data...</p>
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
            <h1 className="text-4xl font-light text-slate-800 tracking-wide">
              Animal Directory
            </h1>
          </div>
          <p className="text-lg text-slate-600 ml-8">
            Manage all animals across your zoos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-6 shadow-lg border border-emerald-100/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🦁</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-800">
                  {stats.totalAnimals}
                </div>
                <div className="text-sm text-slate-500">Total Animals</div>
              </div>
            </div>
            <div className="w-full bg-emerald-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full"
                style={{
                  width: `${Math.min(100, (stats.totalAnimals / 50) * 100)}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-6 shadow-lg border border-orange-100/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🐾</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-800">
                  {stats.uniqueSpecies}
                </div>
                <div className="text-sm text-slate-500">Unique Species</div>
              </div>
            </div>
            <div className="w-full bg-orange-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-400 to-amber-500 h-2 rounded-full"
                style={{
                  width: `${Math.min(100, (stats.uniqueSpecies / 20) * 100)}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-800">
                  {stats.averageAge}
                </div>
                <div className="text-sm text-slate-500">Avg. Age</div>
              </div>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full"
                style={{
                  width: `${Math.min(100, (stats.averageAge / 30) * 100)}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-lg border border-purple-100/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏛️</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-800">
                  {zoos.length}
                </div>
                <div className="text-sm text-slate-500">Zoos</div>
              </div>
            </div>
            <div className="w-full bg-purple-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full"
                style={{ width: `${Math.min(100, (zoos.length / 10) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-6 shadow-lg border border-emerald-100/50 mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-3">
            <span className="text-2xl">➕</span>
            Add New Animal
          </h2>
          <form
            onSubmit={handleAddAnimal}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            <div>
              <input
                type="text"
                value={newAnimalName}
                onChange={(e) => setNewAnimalName(e.target.value)}
                placeholder="Animal Name"
                className="w-full px-4 py-3 rounded-xl border border-emerald-200/50 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400"
                disabled={isAddingAnimal}
              />
            </div>
            <div>
              <input
                type="text"
                value={newAnimalSpecies}
                onChange={(e) => setNewAnimalSpecies(e.target.value)}
                placeholder="Species"
                className="w-full px-4 py-3 rounded-xl border border-emerald-200/50 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400"
                disabled={isAddingAnimal}
              />
            </div>
            <div>
              <input
                type="number"
                value={newAnimalAge}
                onChange={(e) => setNewAnimalAge(e.target.value)}
                placeholder="Age"
                min="0"
                className="w-full px-4 py-3 rounded-xl border border-emerald-200/50 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400"
                disabled={isAddingAnimal}
              />
            </div>
            <div>
              <select
                value={selectedZooId}
                onChange={(e) => setSelectedZooId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-emerald-200/50 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-slate-800"
                disabled={isAddingAnimal || zoos.length === 0}
              >
                {zoos.map((zoo) => (
                  <option key={zoo.id} value={zoo.id}>
                    {zoo.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                type="submit"
                disabled={
                  isAddingAnimal ||
                  !newAnimalName.trim() ||
                  !newAnimalSpecies.trim() ||
                  !newAnimalAge ||
                  !selectedZooId
                }
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isAddingAnimal ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Adding...
                  </div>
                ) : (
                  "Add Animal"
                )}
              </button>
            </div>
          </form>
        </div>

        {animals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🦒</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No animals yet
            </h3>
            <p className="text-slate-500">
              Add your first animal to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {animals.map((animal) => {
              const zoo = zoos.find((z) => z.id === animal.zoo_id);
              const animalEmoji = animal.species?.toLowerCase().includes("lion")
                ? "🦁"
                : animal.species?.toLowerCase().includes("tiger")
                ? "🐯"
                : animal.species?.toLowerCase().includes("bear")
                ? "🐻"
                : animal.species?.toLowerCase().includes("elephant")
                ? "🐘"
                : animal.species?.toLowerCase().includes("giraffe")
                ? "🦒"
                : animal.species?.toLowerCase().includes("monkey")
                ? "🐵"
                : animal.species?.toLowerCase().includes("snake")
                ? "🐍"
                : animal.species?.toLowerCase().includes("bird")
                ? "🐦"
                : "🐾";

              return (
                <div
                  key={animal.id}
                  className="group relative overflow-hidden bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 shadow-lg border border-slate-200/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-200/40 to-transparent rounded-full -translate-y-6 translate-x-6"></div>

                  <div className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">{animalEmoji}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-slate-800 group-hover:text-emerald-800 transition-colors">
                          {animal.name}
                        </h3>
                        <p className="text-sm text-slate-500 capitalize">
                          {animal.species}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-2 bg-white/50 rounded-lg">
                        <div className="text-xs text-slate-500">Age</div>
                        <div className="text-sm font-medium text-slate-800">
                          {animal.age || "Unknown"} years
                        </div>
                      </div>
                      <div className="p-2 bg-white/50 rounded-lg">
                        <div className="text-xs text-slate-500">Zoo</div>
                        <div className="text-sm font-medium text-slate-800">
                          {zoo?.name || "Unknown"}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-emerald-100 text-emerald-700 py-2 px-4 rounded-lg font-medium hover:bg-emerald-200 transition-colors text-sm">
                        View Details
                      </button>
                      <button
                        onClick={() => handleDeleteAnimal(animal.id)}
                        className="bg-red-100 text-red-700 py-2 px-4 rounded-lg font-medium hover:bg-red-200 transition-colors text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <button
            onClick={() => handleRedirect("/")}
            className="flex items-center gap-2 bg-slate-100 text-slate-700 py-2 px-6 rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Animals;
