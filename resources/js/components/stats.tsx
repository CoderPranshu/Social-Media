   import React from 'react'
  const stats = [
    { 
      id: 1, 
      image: "https://i.pinimg.com/736x/a6/36/cf/a636cfed02d42bc5439d1648c033b3a0.jpg",
      count: "12K+", 
      label: "Predictions", 
      subtext: "Shared by community", 
      color: "from-amber-500/10 to-orange-500/5" 
    },
    { 
      id: 2, 
      image: "https://i.pinimg.com/736x/a6/36/cf/a636cfed02d42bc5439d1648c033b3a0.jpg", 
      count: "5K+", 
      label: "Members", 
      subtext: "Active users", 
      color: "from-amber-500/10 to-orange-500/5" 
    },
    { 
      id: 3, 
      image: "https://i.pinimg.com/736x/a6/36/cf/a636cfed02d42bc5439d1648c033b3a0.jpg", 
      count: "150+", 
      label: "Topics", 
      subtext: "Across all categories", 
      color: "from-amber-500/10 to-orange-500/5" 
    },
    { 
      id: 4, 
      image: "https://i.pinimg.com/736x/a6/36/cf/a636cfed02d42bc5439d1648c033b3a0.jpg", 
      count: "50K+", 
      label: "Comments", 
      subtext: "Meaningful discussions", 
      color: "from-amber-500/10 to-orange-500/5" 
    }
  ]; 
 

 
 const statsection = () => {
   return (
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => (
            <div 
              key={stat.id} 
              className="group relative grid grid-cols-12 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl overflow-hidden border border-gray-100 dark:border-zinc-800/80 min-h-[110px]"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-30">
                <div className={`absolute inset-0 p-[2px] bg-gradient-to-r ${stat.color} rounded-3xl [mask-image:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:exclude]`} />
              </div>

              {/* Left Bleeding Image Container */}
              <div className="col-span-5 relative h-full flex items-center justify-start overflow-hidden">
                {stat.id === 2 ? (
                  <div className="w-full h-full relative">
                    <img src={stat.image} alt={stat.label} className="w-full h-full object-cover object-left transition-transform duration-700 ease-out group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-white dark:to-zinc-900 z-10" />
                  </div>
                ) : stat.id === 4 ? (
                  <div className="absolute -left-4 w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden">
                    <img src={stat.image} alt={stat.label} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                  </div>
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 ml-4 rounded-full overflow-hidden border border-gray-100/50 dark:border-zinc-800 shadow-md">
                    <img src={stat.image} alt={stat.label} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                  </div>
                )}
              </div>

              {/* Right Aligned Content Container */}
              <div className="col-span-7 relative z-10 pr-4 pl-2 flex flex-col justify-center min-w-0">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {stat.count}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 tracking-wide truncate">
                  {stat.label}
                </p>
                <p className="text-[11px] sm:text-xs font-medium text-gray-400 dark:text-zinc-500 mt-0.5 leading-tight truncate">
                  {stat.subtext}
                </p>
              </div>
            </div>
          ))}
        </div>
   )
 }
 
 export default statsection
