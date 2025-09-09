const ProductCard = ({ zoo }) => {
return (
  <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-8 shadow-lg border-0 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm">
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
        <span className="text-xl font-light text-slate-800 tracking-wide">
          {zoo.name}
        </span>
        <span className="text-xs text-slate-400 bg-slate-100/70 px-3 py-1 rounded-full ml-auto">
          {zoo.id}
        </span>
      </div>

      {zoo.animals?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {zoo.animals.map((animal, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 border border-emerald-200/50 hover:shadow-lg hover:scale-[1.03] transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-200/40 to-transparent rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="font-semibold text-slate-800 group-hover:text-emerald-800 transition-colors">
                    {animal.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 bg-white/70 px-3 py-1 rounded-full border border-emerald-200/30">
                    {animal.species}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {zoo.worker?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {zoo.worker.map((worker, idx) => (
            <span
              key={idx}
              className="text-sm bg-gradient-to-r from-blue-50 to-indigo-50 text-slate-700 px-4 py-2 rounded-full border border-blue-100/50 hover:shadow-sm transition-all duration-200"
            >
              {worker.name}
            </span>
          ))}
        </div>
      )}

      {zoo.enclosure?.length > 0 && (
        <div className="space-y-3">
          {zoo.enclosure.map((enclosure, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-amber-100/30"
            >
              <div className="font-medium text-slate-700 mb-1">
                {enclosure.name}
              </div>
              {enclosure.animals?.length > 0 && (
                <div className="text-sm text-slate-500 italic">
                  {enclosure.animals.map((a) => a.name).join(" • ")}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

};

export default ProductCard;
