import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StoryDetailSlider from "@/components/StoryDetailSlider";
import { getStoriesByCategory, getCategories } from "@/lib/api";

export default function Categories() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [language, setLanguage] = useState("en");
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<any | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [chapters, setChapters] = useState<{ [key: string]: any[] }>({
    "2": [
      {
        id: "ch1",
        storyId: "2",
        number: 1,
        title: "The Geometry of Proximity",
        content: `The hum of the HITEC City traffic is a muted roar fourteen floors below, but inside the "Nexus Hub," the only sound is the rhythmic, aggressive clicking of Neel's mechanical keyboard. It's a sound I've grown to map like a heartbeat.

I am a UI/UX designer. My life is dedicated to the visual—to the way a curve feels to the eye, to the emotional resonance of a color palette, to the "flow" of a user's journey. Neel, however, is a creature of the back-end. He is a data analyst who moonlights as a dev, a man who lives in the skeletal, logical world of Python scripts and raw databases. We share a long, oak-finished "hot desk" near the window. For eight hours a day, we are exactly twenty-four inches apart.

I know things about him that I shouldn't. I know he drinks exactly three cups of black coffee before noon, and that he starts tapping his left foot when he hits a recursive loop in his code. I know he prefers sandalwood incense—I can smell it clinging to his linen shirts—and that he has a small, barely visible scar just under his jawline that catches the light when he tilts his head back in frustration.

"Is the gradient too much?" I ask, my voice sounding unnaturally loud in the quiet space. I point to my monitor, where a prototype for a high-end meditation app is glowing in shades of twilight purple and deep indigo.

Neel doesn't look at the screen immediately. He finishes his line of code, hits enter, and then slowly turns his chair. He doesn't just look; he observes. His eyes are analytical, stripped of the fluff I usually deal with in marketing meetings.

"The saturation is high for a meditation app," he says, his voice a low, steady thrum. "If the goal is to lower the heart rate, the visual stimulation shouldn't compete with the intent. Shift the hex code three points toward the gray scale. It'll feel more grounded."

He's right. He's always right. "Thanks," I mutter, turning back to my screen.

"Akshath?"

I freeze. He rarely uses my name. "Yeah?"

"You've been staring at that same layer for twenty minutes. Is it the design, or is it something else?"

My heart does a nervous skip-rope jump. I can feel the heat rising in my neck. I want to tell him that the "something else" is the way his sleeve is rolled up to his elbow, revealing the lean muscle of his forearm. I want to tell him that I find his logic more intoxicating than any aesthetic I've ever created.

"Just a creative block," I lie.

"Logically," Neel says, turning back to his terminal, "a block is just a lack of data. Maybe you need a different environment."

He doesn't offer to go with me. He never does. We are two parallel lines—perfectly aligned, perpetually close, but mathematically destined never to touch. I go back to my twilight purple, shifting the hex codes exactly where he suggested. The design improves instantly. My pulse, however, remains stubbornly high.`,
        estimatedReadTime: 8,
        images: [],
        isLocked: false,
        createdAt: new Date().toISOString()
      }
    ],
    "3": [
      {
        id: "ch1",
        storyId: "3",
        number: 1,
        title: "The Geometry of a Brief Encounter",
        content: `You didn't go to Goa to find a story; you went to bury one. As a travel blogger, your life is a curated series of "top ten" lists and filtered sunsets, but your soul is a messy transit lounge. You were three weeks into a solo stint, sitting at a shack called The Tipsy Seagull, watching the tide pull the Arabian Sea away from the shore, when you first saw him.

He wasn't a backpacker. You could tell by the way he sat—spine straight, shoulders square, eyes scanning the perimeter as if the palm trees might launch an ambush. He was wearing a plain olive t-shirt that looked like it had been washed in a river, and his hair was cropped with a severity that screamed "Indian Army."

He looked like a man who lived by a clock you didn't own.

"The wind is picking up," he said. It wasn't an opening line. It was an observation of fact. He was looking at the way the plastic menus were beginning to flap.

"It's Goa," you replied, swirling the ice in your glass. "The wind does what it wants. That's the point of being here."

He turned his head then. His eyes were the color of dark tea, intense and unblinking. "Some people come here to lose control. Others come here because they've been in control for too long and they want to see if they still know how to breathe."

"Which one are you, Major?" you asked, guessing his rank by the quiet authority in his posture.

A small, surprised smile twitched at the corner of his mouth. "Arjun. And I'm just a man on ten days of mandated leave. And you? You look like someone who is already halfway to the next destination."

"Tara," you said. "And I'm exactly where I'm supposed to be. For the next forty-eight hours, anyway."

You both knew the rules. In places like this, people are like ghosts passing through walls. You don't ask for a last name or a five-year plan. You talk about the salt in the air and the way the fish curry tastes like home even if you've never lived by the sea.

By the time the moon rose, you were walking along the shoreline. The water was warm, foamy white against your ankles. Arjun walked beside you, his presence steady and grounding. He told you about the Siachen Glacier, about the silence of the snow that was so loud it could drive a man mad. You told him about the neon lights of Tokyo and the cobblestones of Prague.

"You move so much," he remarked. "Do you ever worry that you're just thinning yourself out? Like a piece of gold leaf spread over too much surface?"

The question stung because it was true. "Maybe. But you... you're a rock. You stay until you're told to move. Don't you worry about becoming a part of the landscape? About disappearing into the uniform?"

He stopped walking and looked out at the horizon. "Every day. That's why I'm here. To remember what I look like when no one is saluting."

You reached out, your fingers grazing his forearm. The skin was hot, scarred in places, and real. In that moment, the "forty-eight hours" felt like a lifetime and a heartbeat all at once. You weren't a blogger and he wasn't a soldier. You were just two people standing on the edge of a vast, dark ocean, realizing that you had found the right person at the absolute wrong time.`,
        estimatedReadTime: 8,
        images: [],
        isLocked: false,
        createdAt: new Date().toISOString()
      }
    ],
    "4": [
      {
        id: "ch1",
        storyId: "4",
        number: 1,
        title: "The Weight of Ink and Stone",
        content: `The winter in Shimla did not arrive with a bang; it seeped into the bones of the city like a slow, cold realization. For Professor Raghav, winter was the most honest season. It stripped the trees of their pretenses and forced the world into the sanctuary of indoors.

Raghav sat in his study, a room lined with floor-to-ceiling bookshelves that smelled of vanilla-scented old paper and woodsmoke. At forty-two, he had cultivated a life of quiet, scholarly solitude. Since the death of his wife five years ago, he had moved through the world with a careful, detached grace. He was a man of "The Middle Path"—neither too happy nor too sad, living mostly within the margins of the classic literature he taught at the university.

Then there was Naina.

She was currently sitting on the floor of his study, surrounded by a chaotic sea of photocopied manuscripts. She was twenty-three, a whirlwind of intellectual fire and youthful impatience. While other students were content with the syllabus, Naina chased the footnotes. She wanted to know why the poets suffered, not just what they wrote.

"You're over-analyzing the silence in the third stanza, Naina," Raghav said, his voice a low, disciplined baritone. He didn't look up from the essay he was grading, but he was acutely aware of her. He knew the way she chewed on the end of her pen when she was frustrated. He knew that she preferred sitting on the rug rather than the perfectly good armchair he had offered.

"Silence isn't just an absence of sound, Professor," she countered, tossing a strand of hair back. "In this context, it's a choice. It's the poet holding his breath because he knows that if he speaks, he'll destroy the illusion. Why are you so afraid of the subtext?"

Raghav finally put his pen down. He looked at her over the rim of his reading glasses. "Subtext is a dangerous place to live, Naina. It's where people find things they aren't prepared to handle."

"Is that why you live in the text?" she asked, her eyes bold and searching. "Because it's safe? Because the ending is already written?"

The air in the room shifted. It was a conversation they had been having in fragments for months—a dance around the edges of something that neither of them was supposed to acknowledge. Raghav was her mentor, her senior by nearly two decades, and a man who had already seen the end of a love story. Naina was the beginning of a story he wasn't sure he had the right to read.

"I live in the text because I value clarity," Raghav said, though his heart was beginning to beat with a traitorous rhythm.

"I think you live there because you're waiting," Naina whispered, standing up slowly. She walked toward his desk, the wooden floorboards creaking under her light footsteps. She stopped just on the other side of the mahogany divide. "The question is, what are you waiting for? For the winter to end? Or for someone to tell you it's okay to feel something that isn't in a book?"

Raghav looked at her hand, resting on his desk. Her skin was smooth, her nails unpolished, her life ahead of her like an unread volume. He felt a sudden, sharp pang of desire—not the reckless heat of his twenties, but something deeper, more patient, and far more terrifying.

"I think," Raghav said, his voice dropping an octave, "that you should go home. The fog is coming in, and the roads will be slick."

Naina didn't move for a long moment. She searched his face for the mask, but for the first time, the Professor's mask was cracked. "I'm not afraid of the fog, Raghav," she said, using his name for the first time. "I'm only afraid of the silence we don't break."

When she left, the room felt cavernous. Raghav picked up his pen, but the ink had dried. He looked out at the Shimla mist, realizing that his "Middle Path" had just hit a fork in the road.`,
        estimatedReadTime: 8,
        images: [],
        isLocked: false,
        createdAt: new Date().toISOString()
      }
    ]
  });
  const [categories, setCategories] = useState<any[]>([]);

  // Manual stories data
  const mockStories = [
    {
      id: 1,
      title: "Between Staying and Leaving",
      author: "Unknown Author",
      description: "Two ambitious professionals defy distance and deadlines, choosing connection over logic, merging hearts across continents and corporate hierarchies.",
      category: "Everyday chemistry",
      subcategory: "Office Chemistry",
      totalChapters: 3,
      coverImage: "/assets/Between-Staying-and-Leaving.png",
      characters: "Siddharth (35, Corporate Lawyer) & Ishita (31, HR/PR Head)",
      setting: "Gurgaon / London"
    },
    {
      id: 2,
      title: "The Silence We Didn't Break",
      author: "Unknown Author",
      description: "Two men, parallel yet close, navigate unspoken desire in a high-tech world, finding connection through silence, code, and subtle intimacy.",
      category: "Slow & emotional",
      subcategory: "Office Chemistry",
      totalChapters: 1,
      // coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
      coverImage: "/assets/The-Silence-We-Didnt-Break.png",
      characters: "Two men in tech",
      setting: "High-tech office"
    },
    {
      id: 3,
      title: "Two Nights Before Goodbye",
      author: "Unknown Author",
      description: "A fleeting, intense romance blooms between a wandering travel blogger and a disciplined army officer, showing how brief encounters can leave permanent imprints on the heart.",
      category: "Travel & Temporary love",
      subcategory: "One Last Goodbye",
      totalChapters: 3,
      coverImage: "/assets/Two-Nights-Before-Goodbye.png",
      characters: "Tara (26, Travel Blogger) & Arjun (30, Army Officer)",
      setting: "Palolem Beach, Goa"
    },
    {
      id: 4,
      title: "When Desire Learned Patience",
      author: "Unknown Author",
      description: "A widowed professor and his brilliant young student navigate desire, patience, and societal judgment to find love across time and distance.",
      category: "Age Gap Romance",
      subcategory: "Forbidden & risky desire",
      totalChapters: 5,
      coverImage: "/assets/When-Desire-Learned-Patience.png",
      characters: "Raghav (42, Professor/Widower) & Naina (23, Literature Student)",
      setting: "Shimla, Himachal Pradesh"
    },
    {
      id: 5,
      title: "The City That Watched Us Fall",
      author: "Unknown Author",
      description: "Two cynical Mumbaikars—film critic and PR manager—navigate honesty, ambition, and desire before finding truth beyond the city's scrutiny.",
      category: "Slow & emotional",
      subcategory: "City Love Story",
      totalChapters: 5,
      coverImage: "/assets/The-City-That-Watched-Us-Fall.png",
      characters: "Vihaan (31, Film Critic) & Aarohi (26, PR Manager)",
      setting: "Mumbai (Colaba, Marine Drive, and Andheri)"
    }
  ];

  const mockCategories = [
    { id: "everyday-chemistry", name: "Everyday chemistry", count: 1 },
    { id: "slow-emotional", name: "Slow & emotional", count: 1 },
    { id: "travel-temporary", name: "Travel & Temporary love", count: 1 },
    { id: "age-gap-romance", name: "Age Gap Romance", count: 1 }
  ];

  const mockCharacters = [
    { id: 1, name: "Aarohi", image: "/character/aarohi.png" },
    { id: 2, name: "Abbas", image: "/character/abbas.png" },
    { id: 3, name: "Akshath", image: "/character/akshath.png" },
    { id: 4, name: "Alisha", image: "/character/alisha.png" },
    { id: 5, name: "Ananya", image: "/character/ananya.png" },
    { id: 6, name: "Arjun", image: "/character/Arjun.png" },
    { id: 7, name: "Kanav", image: "/character/kanav.png" },
    { id: 8, name: "Meera", image: "/character/meera.png" },
    { id: 9, name: "Riya", image: "/character/riya.png" },
    { id: 10, name: "Sana", image: "/character/sana.png" },
    { id: 11, name: "Shankar", image: "/character/shankar.png" },
    { id: 12, name: "Sia", image: "/character/sia.png" }
  ];

  useEffect(() => {
    loadData();
  }, [activeCategory, language]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'stories') {
        loadData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    const handleCustomStorage = () => {
      loadData();
    };
    
    window.addEventListener('storageUpdate', handleCustomStorage);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storageUpdate', handleCustomStorage);
    };
  }, [activeCategory, language]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Use mock data instead of API calls
      let filteredStories = mockStories;
      if (activeCategory) {
        filteredStories = mockStories.filter(story => 
          story.category.toLowerCase().replace(/\s+/g, '-') === activeCategory.toLowerCase()
        );
      }
      
      setStories(filteredStories);
      setCategories(mockCategories);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = (story: any) => {
    setSelectedStory(story);
    setIsSliderOpen(true);
  };

  const handleCloseSlider = () => {
    setIsSliderOpen(false);
    setTimeout(() => setSelectedStory(null), 350);
  };

  return (
    <div className="bg-black min-h-screen">
      <Navigation />
      
      {/* Gradient divider line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-purple-600 to-transparent opacity-50" />
      
      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="max-w-[1300px] mx-auto">
          
          {/* Featured Characters Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Featured Characters</h2>
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-4 mt-8">
              {mockCharacters.map((character) => (
                <div key={character.id} className="flex flex-col items-center group cursor-pointer">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-600/50 group-hover:border-purple-600 transition-all duration-300 group-hover:scale-110">
                    <img
                      src={character.image}
                      alt={character.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <p className="text-white text-xs mt-2 group-hover:text-purple-300 transition-colors">{character.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Category Filter Dropdown */}
          <div className="flex justify-center mb-16 gap-4">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="
                  px-8 py-3 rounded-full border-[1.5px] font-medium text-sm
                  transition-all duration-300 ease-in-out
                  border-purple-600 bg-purple-600/20 text-white 
                  shadow-[0_0_20px_rgba(124,58,237,0.5)]
                  hover:bg-purple-600/30 hover:shadow-[0_0_30px_rgba(124,58,237,0.7)]
                  active:scale-95
                  flex items-center gap-2
                "
              >
                {activeCategory ? categories.find(c => c.id === activeCategory)?.name : "All Categories"}
                <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full mt-2 w-80 bg-[#050505] border border-purple-600 rounded-xl shadow-[0_0_30px_rgba(124,58,237,0.6)] z-50">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setActiveCategory(null);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-purple-600/20 text-white transition-colors"
                    >
                      <div className="font-medium">All Categories</div>
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setActiveCategory(category.id);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-purple-600/20 text-white transition-colors"
                      >
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-gray-400">{category.count} Stories</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={loadData}
              className="px-4 py-3 rounded-full border border-purple-600 text-purple-400 hover:bg-purple-600/20 transition-colors"
              title="Refresh Stories"
            >
              🔄
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          )}

          {/* Story Cards Grid */}
          {!loading && stories.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {stories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => handleStoryClick(story)}
                  className="
                    group relative
                    bg-[#050505] rounded-xl border-[1.5px] border-purple-600
                    cursor-pointer
                    transition-all duration-300 ease-in-out
                    hover:scale-[1.02]
                    shadow-[0_0_15px_rgba(124,58,237,0.3)]
                    hover:shadow-[0_0_30px_rgba(124,58,237,0.6)]
                    overflow-hidden
                    h-[36rem] flex flex-col
                  "
                >
                  {/* Thumbnail */}
                  <div className="relative w-full h-90 bg-gray-800 overflow-hidden rounded-t-xl">
                    <img
                      src={story.coverImage || '/placeholder.svg'}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                  </div>
                  {/* Story Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h3 className="text-white text-lg font-medium mb-2 line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">by {story.author}</p>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{story.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span className="bg-purple-600/20 px-2 py-1 rounded text-purple-300">{story.category}</span>
                      <span className="font-medium">{story.totalChapters || 1} chapters</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && stories.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No stories found in this category
            </div>
          )}
        </div>
      </section>
      
      {/* Story Detail Slider */}
      <StoryDetailSlider
        isOpen={isSliderOpen}
        onClose={handleCloseSlider}
        story={selectedStory}
        // chapters={selectedStory ? chapters[selectedStory.id] || [] : []}
      />
      
      <Footer />
    </div>
  );
}