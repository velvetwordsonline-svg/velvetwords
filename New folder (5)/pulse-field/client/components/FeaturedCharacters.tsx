import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Character {
  id: string;
  name: string;
  gender: "male" | "female";
  trait: string;
  description: string;
  image: string;
}

const characters: Character[] = [
  {
    id: "1",
    name: "Aarohi",
    gender: "female",
    trait: "Passionate",
    description: "A fierce woman who knows what she wants and isn't afraid to take it.",
    image: "/character/aarohi.png"
  },
  {
    id: "2", 
    name: "Abbas",
    gender: "male",
    trait: "Mysterious",
    description: "A brooding figure with secrets that unravel slowly through every chapter.",
    image: "/character/abbas.png"
  },
  {
    id: "3",
    name: "Akshath", 
    gender: "male",
    trait: "Analytical",
    description: "A UI/UX designer who finds logic more intoxicating than any aesthetic.",
    image: "/character/akshath.png"
  },
  {
    id: "4",
    name: "Alisha",
    gender: "female", 
    trait: "Intriguing",
    description: "A mysterious woman who draws everyone into her captivating world.",
    image: "/character/alisha.png"
  },
  {
    id: "5",
    name: "Ananya",
    gender: "female", 
    trait: "Ambitious",
    description: "A driven professional who never settles for less than perfection.",
    image: "/character/ananya.png"
  },
  {
    id: "6",
    name: "Arjun",
    gender: "male", 
    trait: "Disciplined",
    description: "An army officer whose control masks a deep vulnerability.",
    image: "/character/Arjun.png"
  },
  {
    id: "7",
    name: "Kanav",
    gender: "male", 
    trait: "Charming",
    description: "A charismatic man who effortlessly draws people into his orbit.",
    image: "/character/kanav.png"
  },
  {
    id: "8",
    name: "Meera",
    gender: "female", 
    trait: "Elegant",
    description: "A sophisticated woman with grace that commands attention.",
    image: "/character/meera.png"
  },
  {
    id: "9",
    name: "Riya",
    gender: "female", 
    trait: "Spirited",
    description: "A vibrant soul who brings energy to every room she enters.",
    image: "/character/riya.png"
  },
  {
    id: "10",
    name: "Sana",
    gender: "female", 
    trait: "Thoughtful",
    description: "A reflective woman who sees beauty in life's quiet moments.",
    image: "/character/sana.png"
  },
  {
    id: "11",
    name: "Shankar",
    gender: "male", 
    trait: "Strong",
    description: "A powerful presence whose strength lies in his gentle heart.",
    image: "/character/shankar.png"
  },
  {
    id: "12",
    name: "Sia",
    gender: "female", 
    trait: "Creative",
    description: "An artistic soul who paints her world in vibrant colors.",
    image: "/character/sia.png"
  }
];

export default function FeaturedCharacters() {
  const navigate = useNavigate();
  const displayedCharacters = characters.slice(0, 4);

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-12">Featured Characters</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedCharacters.map((character) => (
            <div key={character.id} className="group relative cursor-pointer">
              <div className="relative rounded-lg overflow-hidden bg-[#050505] border-[3px] transition-all duration-300 transform border-white/20">
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-800">
                  <img 
                    src={character.image} 
                    alt={character.name} 
                    className="w-full h-full object-cover transition-transform duration-500 scale-100"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                </div>
                <div className="p-4 bg-gradient-to-t from-black to-transparent">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-white font-bold text-base">{character.name}</h3>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="w-4 h-4 text-purple-400" 
                      aria-hidden="true"
                    >
                      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                    </svg>
                  </div>
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 bg-purple-600/20 text-purple-400 text-xs font-semibold rounded-full">
                      {character.trait}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs line-clamp-2">{character.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-8">
          <button 
            onClick={() => navigate('/categories')}
            className="px-8 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-600/90 transition-colors"
          >
            View More
          </button>
        </div>
      </div>
    </section>
  );
}