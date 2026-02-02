import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Story, Chapter, ReadingProgress } from "@/lib/mockData";
import { defaultUser } from "@/lib/mockData";

// API Configuration
const API_BASE = "http://localhost:5001/api";

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  stories: Story[];
  getStoryById: (id: string) => Promise<Story | undefined>;
  getChaptersByStoryId: (storyId: string) => Chapter[];
  getChapterById: (storyId: string, chapterId: string) => Chapter | undefined;
  verifyPhoneNumber: (phone: string) => void;
  selectSubscription: (plan: "weekly" | "monthly" | "3-month") => void;
  logout: () => void;
  updateReadingProgress: (storyId: string, chapterNumber: number, position: number, percentage: number) => void;
  getReadingProgress: (storyId: string) => ReadingProgress | undefined;
  canAccessChapter: (chapterNumber: number) => boolean;
  refreshStories: () => void;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [stories, setStories] = useState<Story[]>([
    {
      id: "1",
      categoryId: "everyday-chemistry",
      title: "Between Staying and Leaving",
      author: "Unknown Author",
      description: "Two ambitious professionals defy distance and deadlines, choosing connection over logic, merging hearts across continents and corporate hierarchies.",
      coverImage: "/assets/Between-Staying-and-Leaving.png",
      rating: 4.8,
      reviewCount: 156,
      totalChapters: 3,
      genre: "Everyday chemistry",
      isTrending: true,
      createdAt: new Date().toISOString()
    },
    {
      id: "2",
      categoryId: "slow-emotional",
      title: "The Silence We Didn't Break",
      author: "Unknown Author",
      description: "Two men, parallel yet close, navigate unspoken desire in a high-tech world, finding connection through silence, code, and subtle intimacy.",
      coverImage: "/assets/The-Silence-We-Didnt-Break.png",
      rating: 4.5,
      reviewCount: 89,
      totalChapters: 3,
      genre: "Slow & emotional",
      isTrending: false,
      createdAt: new Date().toISOString()
    },
    {
      id: "3",
      categoryId: "travel-temporary",
      title: "Two Nights Before Goodbye",
      author: "Unknown Author",
      description: "A fleeting, intense romance blooms between a wandering travel blogger and a disciplined army officer, showing how brief encounters can leave permanent imprints on the heart.",
      coverImage: "/assets/Two-Nights-Before-Goodbye.png",
      rating: 4.7,
      reviewCount: 124,
      totalChapters: 3,
      genre: "Travel & Temporary love",
      isTrending: true,
      createdAt: new Date().toISOString()
    },
    {
      id: "4",
      categoryId: "forbidden-risky",
      title: "When Desire Learned Patience",
      author: "Unknown Author",
      description: "A widowed professor and his brilliant young student navigate desire, patience, and societal judgment to find love across time and distance.",
      coverImage: "/assets/When-Desire-Learned-Patience.png",
      rating: 4.6,
      reviewCount: 98,
      totalChapters: 5,
      genre: "Age Gap Romance",
      isTrending: false,
      createdAt: new Date().toISOString()
    }
  ]);
  const [chapters, setChapters] = useState<{ [key: string]: Chapter[] }>({
    "1": [
      {
        id: "ch1",
        storyId: "1",
        number: 1,
        title: "The Architecture of a Deal",
        content: `Story 1: Between Staying and Leaving
Characters: Siddharth (35, Corporate Lawyer) & Ishita (31, HR/PR Head)
Category: Office Chemistry / Power & Control
Setting: Gurgaon / London

Chapter 1: The Architecture of a Deal
POV: Third Person
The boardroom on the 42nd floor of the Cyber City tower was a masterpiece of glass and intimidation. Outside, the Gurgaon skyline was a hazy mosaic of steel and dust, but inside, the air was filtered, chilled to a crisp 19°C, and smelled faintly of expensive floor wax and pressurized ambition.

Siddharth adjusted his cufflinks—silver, minimalist, sharp. He didn't look like a man who had been awake for forty-eight hours, though the faint tension in his jaw betrayed him. Across the table sat the acquisition team for the textile conglomerate, and at their center was Ishita.

Siddharth had spent a decade dismantling companies and rebuilding them in his image. He was used to being the most formidable person in any room. He was used to people flinching when he tapped his fountain pen against a legal pad. But Ishita didn't flinch. She was currently dissecting Clause 14.2 of the merger agreement with the precision of a diamond cutter.

"The employee retention program is non-negotiable, Siddharth," she said. Her voice wasn't loud, but it possessed a resonant clarity that cut through the low hum of the server room nearby. "You're looking at these people as liabilities on a balance sheet. I'm looking at them as the intellectual capital that actually makes this company worth the $400 million you're paying for it."

Siddharth leaned back, his leather chair creaking softly. He allowed a ghost of a smile to touch his lips—a predatory expression that usually signaled the end of a negotiation. "Intellectual capital is a poetic term for a variable cost, Ishita. My client is buying infrastructure and market share. We aren't buying a social club."

"If you gut the middle management in the first quarter, you lose the culture," Ishita countered, leaning forward. She wore a sharp, tailored blazer in a shade of deep emerald that made her look like a splash of life in a room designed for sterility. "And without the culture, the infrastructure is just a collection of empty warehouses. You know I'm right. That's why you're stalling."

The room went silent. The junior associates on both sides of the table suddenly found their tablets very interesting. No one talked to Siddharth like that.

Siddharth didn't look away. He found himself cataloging the details he shouldn't be noticing: the way she tucked a stray strand of dark hair behind her ear, the slight smudge of ink on her thumb, the way her eyes—sharp and observant—refused to yield. For three weeks, this had been their ritual. They were the two suns in this corporate solar system, and everything else was just orbiting their friction.

"Let's take fifteen," Siddharth said abruptly, standing up.

The room cleared in record time. When the heavy oak doors clicked shut, only the two of them remained. The silence was heavy, charged with the kind of energy that precedes a lightning strike.

"You're being difficult for the sake of it," Siddharth said, walking toward the floor-to-ceiling window. "Is this a PR play? Are you trying to prove you're the 'People's Champion' before the London office takes you away?"

Ishita stood up, walking toward the credenza to pour herself a glass of water. Her movements were fluid, graceful, and entirely unimpressed by his stature. "I don't perform for an audience, Siddharth. And I'm not 'difficult.' I'm thorough. Something you usually appreciate in your colleagues, or so I've heard."

She walked over to the window, standing a few feet away from him. From this height, the cars below looked like frantic insects.

"London is a big move," he said, his tone shifting. The "Closer" was gone, replaced by something more human, though no less intense.

"It's a promotion," she replied. "The kind you don't turn down. Head of Global Strategy."

"It's a long way from Gurgaon."

"Is that a legal observation or a personal one?" Ishita turned her head to look at him.

Siddharth felt the air in his lungs grow heavy. He was a man of logic, of structures and precedents. But there was no precedent for the way his pulse spiked when she challenged him. He reached out, his hand hovering near the glass, close enough to feel the warmth radiating from her arm.

"Personal," he admitted, the word sounding foreign in his own mouth. "The firm won't be the same without someone to keep me in check."

"You'll find someone else to fight with within a week," she whispered, though she didn't move away.

"I don't want someone else," he said. The admission was a breach of contract, a violation of every professional boundary he had spent fifteen years building. He turned to face her fully. "Ishita, the deal closes tomorrow. The papers are finalized. There is no more 'us' in a professional capacity after 5 PM."

"I know," she said, her voice dropping to a breathy silver of sound.

He took a step closer. The gap between them was barely an inch—the space between staying and leaving. He could see the slight tremor in her hands. He could hear the rhythm of her breathing, mirroring his own. For a moment, the $400 million deal, the London promotion, and the corporate hierarchy vanished. There was only the heat of her presence and the terrifying realization that he was about to lose the only person who truly saw him.

"Stay for dinner," he said. It wasn't a command. It was a plea.

Ishita looked at him, her eyes searching his for a sign of the mask. She found none. "Siddharth... the flight is at 6 AM."

"I know," he repeated. "Stay anyway."`,
        estimatedReadTime: 8,
        images: [],
        isLocked: false,
        createdAt: new Date().toISOString()
      }
    ],
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
  const [loading, setLoading] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("velvetWords_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error loading user:", error);
      }
    }
  }, []);

  const saveUserToStorage = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("velvetWords_user", JSON.stringify(updatedUser));
  };

  const verifyPhoneNumber = (phone: string) => {
    const newUser: User = {
      ...defaultUser,
      phone,
      isVerified: true,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    saveUserToStorage(newUser);
  };

  const selectSubscription = (plan: "weekly" | "monthly" | "3-month") => {
    if (!user) return;

    const daysToAdd = plan === "weekly" ? 7 : plan === "monthly" ? 30 : 90;
    const expiresAt = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();

    const updatedUser: User = {
      ...user,
      subscription: {
        plan,
        expiresAt,
        isActive: true,
      },
    };

    saveUserToStorage(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem("velvetWords_user");
    setUser(null);
  };

  const updateReadingProgress = (
    storyId: string,
    chapterNumber: number,
    position: number,
    percentage: number
  ) => {
    if (!user) return;

    const existingProgress = user.readingHistory.find((rp) => rp.storyId === storyId);
    const newProgress: ReadingProgress = {
      storyId,
      lastChapterRead: chapterNumber,
      lastReadPosition: position,
      progressPercentage: percentage,
      lastReadAt: new Date().toISOString(),
    };

    const updatedHistory = existingProgress
      ? user.readingHistory.map((rp) => (rp.storyId === storyId ? newProgress : rp))
      : [...user.readingHistory, newProgress];

    const updatedUser: User = {
      ...user,
      readingHistory: updatedHistory,
    };

    saveUserToStorage(updatedUser);
  };

  const getReadingProgress = (storyId: string): ReadingProgress | undefined => {
    return user?.readingHistory.find((rp) => rp.storyId === storyId);
  };

  const canAccessChapter = (chapterNumber: number): boolean => {
    // Chapter 1 is always free
    if (chapterNumber === 1) return true;
    
    // Special access for specific phone number
    if (user && user.phone === "8923529921") return true;
    
    // For chapters 2+, check if user is logged in and has active subscription
    if (!user || !user.isVerified) return false;
    
    if (!user.subscription.isActive) return false;

    if (user.subscription.expiresAt) {
      const expiresAt = new Date(user.subscription.expiresAt);
      return expiresAt > new Date();
    }

    return false;
  };

  const refreshStories = () => {
    // No-op for mock data
  };

  const getStoryById = async (id: string): Promise<Story | undefined> => {
    return stories.find(story => story.id === id);
  };

  const getChaptersByStoryId = (storyId: string): Chapter[] => {
    return chapters[storyId] || [];
  };

  const getChapterById = (storyId: string, chapterId: string): Chapter | undefined => {
    return chapters[storyId]?.find((c) => c.id === chapterId);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn: user !== null && user.isVerified,
        stories,
        getStoryById,
        getChaptersByStoryId,
        getChapterById,
        verifyPhoneNumber,
        selectSubscription,
        logout,
        updateReadingProgress,
        getReadingProgress,
        canAccessChapter,
        refreshStories,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}