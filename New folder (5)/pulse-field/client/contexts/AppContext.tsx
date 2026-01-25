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
      totalChapters: 1,
      genre: "Slow & emotional",
      isTrending: true,
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
    },
    {
      id: "5",
      categoryId: "slow-emotional",
      title: "The City That Watched Us Fall",
      author: "Unknown Author",
      description: "Two cynical Mumbaikars—film critic and PR manager—navigate honesty, ambition, and desire before finding truth beyond the city's scrutiny.",
      coverImage: "/assets/The-City-That-Watched-Us-Fall.png",
      rating: 4.6,
      reviewCount: 112,
      totalChapters: 5,
      genre: "City Love Story",
      isTrending: true,
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
      },
      {
        id: "ch2",
        storyId: "1",
        number: 2,
        title: "The Midnight Clause",
        content: `Chapter 2: The Midnight Clause
POV: First Person (Siddharth)
I have always lived my life by the clock. Six minutes for a billable hour. Forty-five minutes for a workout. Two hours for a due-diligence review. My world is a series of boxes, neatly checked, ensuring that nothing unexpected ever leaks through the cracks.

But as I sat across from Ishita in a dimly lit bistro in South Point Mall, the clock felt like an enemy.

The restaurant was nearly empty. The staff were moving chairs in the background, but they didn't dare disturb us. Ishita had changed out of her blazer. In a simple silk blouse, she looked softer, yet somehow more dangerous. She was dissecting a piece of sea bass with the same focus she used on a merger.

"You're doing it again," she said, looking up.

"Doing what?"

"Calculating. I can see the gears turning, Siddharth. You're trying to figure out the ROI of this dinner."

I put my fork down. "Actually, I was wondering how I missed the fact that you take your coffee black and your humor dry for three whole weeks."

"We were busy trying to kill each other's clauses," she smiled. It was a devastatingly beautiful smile—one I hadn't seen in the boardroom. "It doesn't leave much room for small talk."

"I don't like small talk," I said. "It's inefficient."

"And what do you like?"

I leaned forward, the candlelight dancing in the reflection of her eyes. "I like things that are real. I like the way you don't back down when you know you're right. I like that you're the only person in this city who isn't afraid of me."

Ishita's expression softened. She reached across the table, her fingers grazing the back of my hand. Her skin was cool, a sharp contrast to the heat rising in my chest. "I'm not afraid of you, Siddharth. But I am afraid of this."

"Of what?"

"Of the fact that I'm leaving in five hours, and I'm sitting here wondering if I should have asked for a later flight."

The honesty of it hit me harder than any legal defeat ever could. I turned my hand over, interlacing my fingers with hers. Her hand fit perfectly in mine—a physical alignment that felt more "right" than any contract I had ever drafted.

"Don't," I said.

"Don't what?"

"Don't change the flight. Go to London. Take the promotion. Build the empire you've been talking about for twenty-one days."

She looked disappointed, pulling her hand back slightly. "Right. The logical choice."

"No," I said, my voice roughening. "Listen to me. If you stay because of a feeling we found in the middle of a merger, you'll eventually hate me for it. You'll look at me and see the thing that clipped your wings."

"So what is this, then?" she asked, gesturing between us. "A nice memory for the flight?"

I signaled for the check. "No. It's an opening statement."

We walked out into the cool Gurgaon night. The humidity had dropped, and the air felt electric. I drove her back to her apartment in silence. Not the awkward silence of strangers, but the heavy, charged silence of two people who had run out of words and were left only with intentions.

At her door, she turned to me. The yellow hallway light was unforgiving, showing the exhaustion and the longing on both our faces.

"Goodbye, Siddharth," she said.

I didn't say goodbye. I reached out, cupping her face with both hands. I kissed her with a ferocity that surprised us both. It was a kiss that tasted of "stay" and "don't go" and "I'll find you." It was the most honest thing I had done in years.

When I pulled away, she was breathless, her eyes wide.

"I'll see you in the morning," I said.

"Siddharth, I'm going to the airport at 4 AM."

"I know," I said, stepping back into the elevator. "I'm a lawyer, Ishita. I never miss a deadline."`,
        estimatedReadTime: 7,
        images: [],
        isLocked: false,
        createdAt: new Date().toISOString()
      },
      {
        id: "ch3",
        storyId: "1",
        number: 3,
        title: "The London Addendum",
        content: `Chapter 3: The London Addendum
POV: Third Person
The Indira Gandhi International Airport at 4:30 AM is a liminal space—a world of weary travelers, glowing duty-free shops, and the persistent hum of jet engines.

Ishita checked her luggage in a daze. Her lips still felt the ghost of Siddharth's kiss, and her mind was a chaotic loop of his final words. I'll see you in the morning. What did that even mean? Was he coming to the airport? Was he going to make a scene like a character in a movie she would usually mock for being unrealistic?

She made it through security and immigration. She sat at the gate, clutching a cup of lukewarm tea. Every time a man in a suit walked by, her heart hammered against her ribs. But as the "Boarding" sign began to flash for Flight BA142, Siddharth was nowhere to be seen.

A wave of cold reality washed over her. Of course he isn't here, she thought. He's a pragmatist. He gave me a kiss to remember, and now he's probably back at his desk, billing hours.

She stood up, adjusted her carry-on, and walked toward the jet bridge. She felt a profound sense of loss, a weight in her stomach that had nothing to do with the early hour.

As she took her seat in Business Class, she pulled out the final "Closing Folder" Siddharth had handed her as she left the office the previous evening. She had been too emotional to look at it then.

She flipped through the dry legal pages—the signatures, the stamps, the power of attorney. Then, she reached the very last page.

It wasn't a legal document. It was a printed flight confirmation.

Passenger Name: Siddharth Mehra
Flight: BA142 – Delhi to London Heathrow
Seat: 4B

Ishita's breath hitched. She looked at her own boarding pass. Seat: 4A.

She looked up just as a man in a dark charcoal suit stowed his briefcase in the overhead bin across the aisle. He didn't look like he had slept at all. He sat down, buckled his seatbelt, and pulled out a legal pad.

"You're late," Ishita whispered, her eyes stinging with sudden, happy tears.

Siddharth didn't turn his head, but he reached across the armrest, taking her hand and squeezing it tightly. "I had to file a few motions before I left. It turns out the firm has a very strict policy about senior partners taking sudden leaves of absence."

"And?"

He turned to her then, his eyes bright with a mixture of exhaustion and triumph. "I told them I was investigating a potential merger in London. A very high-stakes, long-term acquisition."

"Is that so?" Ishita smiled, leaning her head on his shoulder as the plane began to push back from the gate. "And what are the terms of this merger?"

Siddharth kissed the top of her head. "No exit clause," he murmured. "Infinite renewals. And a very high requirement for daily communication."

As the engines roared and the plane lifted off, leaving the smog of Gurgaon for the clouds, Ishita realized that the space between staying and leaving wasn't a distance at all. It was a choice. And for the first time in both their lives, they had chosen something that couldn't be quantified on a balance sheet.`,
        estimatedReadTime: 6,
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
      },
      {
        id: "ch2",
        storyId: "2",
        number: 2,
        title: "The Monsoon Protocol",
        content: `The sky over Hyderabad didn't just break; it shattered. By 6 PM, the "Orange Alert" had turned the city into a sprawling lake. Most of the co-working space had cleared out early, people scrambling to get to Gachibowli or Jubilee Hills before the roads became rivers.

I stayed because I had a deadline. Neel stayed because, as I've come to realize, Neel has nowhere he'd rather be than inside a problem he can solve.

At 9:30 PM, the lights flickered and died. The backup generators kicked in, but only for the essential servers. The floor-to-ceiling windows were pelted with rain so violent it sounded like gravel. The office was plunged into a dim, amber emergency glow.

"The server's down," Neel said into the darkness. I could see the silhouette of his shoulders relaxing. For the first time in months, he wasn't tethered to his machine.

"I think we're trapped," I said, leaning back. "The security guard said the basement parking is flooded."

"Statistically, we're safer here than in a car," Neel replied. He got up and walked to the small breakroom area, returning with a bottle of wine someone had left in the communal fridge and two paper coffee cups. "It's a cheap Cabernet, but it beats the vending machine tea."

We sat on the floor by the window, the city lights blurred into bokeh circles of gold and red through the rain. The wine was acidic, but it warmed the chill that had settled in my bones.

"Why do you do it?" Neel asked suddenly. "The design. The 'faking' of reality to make it look better?"

"It's not faking," I defended, feeling the wine loosen my tongue. "It's empathy. It's trying to understand what a human feels when they touch a screen. It's about making a cold machine feel like a home. Why do you do the opposite? Why hide in the numbers?"

Neel stayed silent for a long time. He took a slow sip of his wine. "Numbers don't lie, Akshath. People do. My parents spent twenty years pretending they were happy because the 'data' of their lives—the house, the social standing—looked good. But the back-end was broken. I like things that are true at the core."

I looked at him then. The emergency light caught the bridge of his nose and the curve of his lips. The silence between us, usually so clinical, began to throb with a different kind of frequency. It was a silence filled with the things we didn't say in the daylight.

"Is this true?" I whispered, gesturing to the space between us.

Neel looked at me, his intense gaze stripping away my UI/UX masks, my polished exterior, my chosen silence. He reached out, his hand hovering in the air. For a second, I thought he was going to touch my face. I wanted him to. I needed him to break the logic of our arrangement.

His fingers brushed my wrist—a brief, searing contact that felt more significant than a confession. "The data is inconclusive," he murmured, his voice cracking slightly.

He pulled his hand back. The silence returned, heavier and more suffocating than before. We had come to the edge of the cliff, looked over, and stepped back. We spent the rest of the night talking about meaningless things—movies, childhoods, the weather—while the real conversation screamed in the background, unheard.`,
        estimatedReadTime: 7,
        images: [],
        isLocked: false,
        createdAt: new Date().toISOString()
      },
      {
        id: "ch3",
        storyId: "2",
        number: 3,
        title: "The Cumulative Error",
        content: `The morning brought a grey, washed-out sky and the sound of distant sirens. The water had receded enough for cabs to move.

We cleaned up the paper cups and the wine bottle like two conspirators erasing evidence of a crime. Neel was back at his desk by 8 AM, his mechanical keyboard resuming its rhythmic clicking as if the night before had been a glitch in the system.

But I couldn't go back. Every time I looked at my screen, I saw the reflection of his hand reaching for mine. Every time I checked a color palette, I thought of his "shift toward the gray scale."

I realized then that our silence wasn't a choice anymore; it was a cage. We had built a perfect professional relationship on the foundation of what we didn't say. If I spoke now, the structure would collapse. He was a man who hated "broken back-ends," and our attraction was the ultimate bug in his code.

I packed my bag mid-afternoon.

"Leaving early?" Neel asked, not looking up from his screen.

"I'm moving to a different hub," I said, the words tasting like lead. "A firm in Banjara Hills. Closer to home."

The clicking stopped. The silence that followed was the loudest one yet. Neel turned his chair slowly. His face was a mask of data-driven neutrality, but his eyes... his eyes were full of a sudden, sharp panic.

"Is the infrastructure better there?" he asked.

"No," I said, looking him directly in the eye. "But the user interface is too confusing here. I can't find the 'home' button, Neel."

He stood up, his tall frame casting a shadow over my desk. For a moment, I thought he would stop me. I thought he would finally break the silence and say something—anything—that wasn't a logical observation.

"Check your email," he said instead.

I frowned, pulling out my phone. An email had just arrived from his personal account. No subject. Just an attachment. It was a file named ideal_interface.svg.

I opened it. It wasn't a script or a database. It was a vector drawing—a minimalist, perfect rendering of two chairs, side by side, with a single line connecting them. Underneath, in the code comments of the file, he had written:

// Error: Variable 'Desire' is persistent and cannot be deleted.
// Action: Await user input. Please don't go.

I looked up from my phone. Neel was standing there, his hands shoved deep into his pockets, looking like a man who had just handed over the keys to his most private vault.

"The data is finally conclusive," he whispered.

I didn't say anything. I didn't need to. I walked back to my chair, unpacked my laptop, and sat down. I opened my design software and sent him a file back. A simple twilight purple circle.

// Input received. Staying.

We didn't break the silence that day. We just finally learned how to live inside it, together.`,
        estimatedReadTime: 6,
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
      },
      {
        id: "ch2",
        storyId: "3",
        number: 2,
        title: "The Art of Borrowed Time",
        content: `The second day—your last full day—began with the sound of a Royal Enfield idling outside your guesthouse. You opened the door to find Arjun leaning against the bike, two helmets dangling from the handlebars.

"I heard there's a fort," he said. "One where the view makes you forget you have to leave."

You climbed onto the back of the bike, your chest pressing against the sturdy line of his back. As you sped through the winding roads of South Goa, past emerald paddy fields and sleepy colorful villas, you let yourself do something dangerous: you let yourself feel like you belonged to him.

At Chapora Fort, you sat on the crumbling stone walls, the wind whipping your hair across your face. Arjun sat close enough that your knees touched. The silence between you wasn't empty; it was heavy with the knowledge of the "Goodbye" that was waiting for you at the airport.

"I have to be back at the Cantt by Monday," he said, staring at the vista. "There's a new posting. North-East. I won't have a phone signal for weeks."

"I have a flight to Prague tomorrow night," you said. "A brand deal with a luxury hotel chain. I have to be 'on' for five days straight."

He turned to you, his expression unreadable. "It's a strange thing, isn't it? We spent thirty hours together, and I feel like I know the way your mind works better than I know the men I've served with for years."

"Because there's no tomorrow to protect," you whispered. "When you know someone is leaving, you don't bother with the armor. You just... show up."

You spent the afternoon in a haze of intimacy. You ate at a roadside shack where the owner didn't speak English. You swam in a hidden cove where the water was so clear you could see your own shadows on the sandy bottom. For a few hours, you pretended that the suitcase in your room was empty and the uniform in his was just a costume.

That night, back at the beach, the atmosphere shifted. The playfulness was gone, replaced by a raw, aching desire. You went back to his room. It was sparse—just a bed, a ceiling fan, and his olive-green rucksack.

When he kissed you, it wasn't the tentative kiss of a first date. It was a claim. It was the way a man kisses a woman when he knows he's losing her to a map. His hands were rough but incredibly gentle, tracing the lines of your body as if he were memorizing a landscape he would never see again.

"Tara," he breathed against your neck. "Stay. Just for one more week. Call the hotel, tell them you're sick."

You closed your eyes, the temptation so strong it felt like a physical weight. You could stay. You could see what happened when the sun came up and the "holiday" was over. But you looked at his rucksack, perfectly packed, ready for the front line. And you thought of your passport, full of stamps that were your only identity.

"I can't," you whispered, a tear escaping and disappearing into his hair. "And you wouldn't want me if I did. You love the wanderer, Arjun. Not the girl who hides in a hotel room."

He didn't argue. He just held you tighter, his heart beating a frantic, steady rhythm against your own, a drumbeat of "Not enough time, not enough time."`,
        estimatedReadTime: 7,
        images: [],
        isLocked: false,
        createdAt: new Date().toISOString()
      },
      {
        id: "ch3",
        storyId: "3",
        number: 3,
        title: "The Ghost of Palolem",
        content: `The Goa airport is a sterile, fluorescent purgatory. You stood at the entrance of the departures gate, your backpack feeling like a hundred kilos of regret. Arjun stood opposite you, his posture back to that rigid, military perfection. He was already back in his world.

"I don't even have a photo of you," he said, a ghost of a smile on his face. "Just the one in my head."

"Photos are for tourists," you said, your voice trembling. "We weren't tourists, Arjun."

He reached into his pocket and pulled out a small, brass button—a spare from his uniform. He pressed it into your palm. "Keep this. It's a bit of the weight I carry. Maybe it'll keep you from flying too far away."

You took it, the metal warm from his body. You wanted to scream. You wanted to drop your bag and tell him you'd follow him to the North-East, that you'd live in a tent if it meant waking up to that tea-colored gaze. But you were Tara. You were movement. You were the girl who never stayed.

"Goodbye, Arjun," you said.

"See you around, Tara," he replied. He used the lie because it was kinder than the truth.

You walked through the glass doors. You didn't look back. You went through security, got your boarding pass, and sat at the gate. You opened your laptop to start your "Goa Highlights" post. You typed: Goa is a place of magic and recovery...

Then you stopped. You looked at the brass button in your hand. You looked at the "Prague" sign on the monitor.

Suddenly, the travel, the blogging, the endless movement felt like a hollow performance. You realized that for years, you hadn't been traveling to things; you had been traveling away from the possibility of being known. And in forty-eight hours, a man with a buzz cut and a scarred arm had dismantled everything you thought you knew about freedom.

As the plane took off, you looked down at the tiny lights of the coast. Somewhere down there, he was on a bus or a train, heading toward a border. You realized that some goodbyes don't end when the plane leaves the tarmac. They just become a permanent part of the itinerary.

You pulled out your phone and did something you never do. You didn't post a picture. You didn't tag a location. You just wrote a single sentence in your notes app, a message to a man who might never read it: I'm still holding the button.

Then, you closed your eyes and started planning your way back, even as you flew ten thousand miles away.`,
        estimatedReadTime: 6,
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
      },
      {
        id: "ch2",
        storyId: "4",
        number: 2,
        title: "The Anatomy of a Pause",
        content: `I have spent my life studying the anatomy of language. I know how a metaphor can bridge the gap between two disparate ideas. But I do not know how to bridge the gap between forty-two and twenty-three.

Naina didn't come to the study for three days. The silence she left behind wasn't the peaceful solitude I was used to; it was an echoing void. I found myself walking through the university halls, my eyes scanning for a flash of her mustard-colored shawl or the sound of her laugh.

When she finally appeared in my lecture on Romanticism, she sat in the back row. She didn't raise her hand. She didn't challenge my interpretation of Keats. She simply watched me. Her gaze was a physical weight, a constant reminder of the conversation we had left unfinished in my study.

After the lecture, the students filed out, their chatter fading into the hallway. I gathered my notes, my hands trembling slightly.

"Are we back to the text, then?" she asked from the doorway.

I looked up. She looked tired, as if she hadn't slept any more than I had. "The text is where the rules are, Naina."

"Rules are just boundaries we draw because we're scared of the vastness," she said, walking toward the lectern. "You told me once that Keats wrote about 'negative capability'—the ability to be in uncertainties, mysteries, and doubts without any irritable reaching after fact and reason. Why can't you apply that to us?"

"Because 'us' is a mystery that could ruin you," I said, finally letting the wall crumble. I walked around the lectern, standing in the well of the lecture hall. "Look at me, Naina. I have a life that is mostly behind me. I have memories that take up more space than my dreams. You... you are all potential. You should be with someone who can grow with you, not someone who is already rooted in the past."

"You think you're a tree," she said, a small, sad smile touching her lips. "Fixed and unchanging. But I see the way you look at the mountains. I see the way you still find wonder in a single line of poetry. You aren't rooted, Raghav. You're just holding your breath."

She reached out and touched the lapel of my tweed coat. It was a small gesture, but it felt like an earthquake. I wanted to pull her to me, to bury my face in the crook of her neck and forget about the university, the gossip, the age, and the grief.

"Patience," I whispered, more to myself than to her.

"How much longer?" she asked.

"Until I am sure that I am a choice you are making, not a sanctuary you are seeking," I said. "Until I know that if I take your hand, I am not stealing your youth, but sharing it."

I saw the frustration in her eyes, the beautiful, reckless impatience of being twenty-three. She wanted the climax now. She didn't understand that the best parts of a story are often found in the slow-build, in the tension of the unsaid.

"I am not a child, Raghav," she said firmly.

"I know," I replied. "That's why this is so difficult."`,
        estimatedReadTime: 7,
        images: [],
        isLocked: false,
        createdAt: new Date().toISOString()
      },
      {
        id: "ch3",
        storyId: "4",
        number: 3,
        title: "The Winter Solstice",
        content: `The university closed for the winter break. Shimla was buried under a foot of fresh snow, turning the Mall Road into a postcard of white and gold. Raghav spent his days by the fire, but his mind was in a constant state of revision. He found himself writing letters to Naina that he never intended to send—pages and pages of thoughts about life, loss, and the strange, late-flowering of hope.

On the night of the solstice, there was a knock at his door.

He opened it to find Naina standing there, wrapped in a heavy wool coat, her nose red from the cold. She wasn't carrying books. She was carrying a small box of sweets.

"My mother sent these from home," she said, her breath hitching in the frosty air. "I thought... I thought you might be lonely."

Raghav stepped aside, ushering her into the warmth. "You shouldn't have walked in this, Naina. The paths are treacherous."

"I told you," she said, shedding her coat. "I'm not afraid of the path."

They sat by the fire, the orange light dancing on the walls. The house felt different with her in it—less like a museum and more like a home. They spoke of small things—the taste of the sweets, the way the snow muffled the sound of the world. But the air was thick with the magnetic pull of their proximity.

"I'm graduating in three months," Naina said suddenly, staring into the flames. "I've been offered a fellowship in Delhi."

Raghav felt a coldness that had nothing to do with the winter outside. "That's a wonderful opportunity, Naina. You should take it."

"I will," she said, turning to look at him. "But I wanted to know... if I go, will you come and see me? Or will this stay here, in this house, like one of your old manuscripts?"

Raghav looked at her, and for the first time, he let himself see the future. He saw himself on a train to Delhi. He saw them walking through Lodhi Garden. He saw the scandal it would cause, and the quiet joy that would outweigh it. He realized that his patience wasn't just about waiting for her to grow; it was about waiting for himself to be brave enough to live again.

"I will come," he said. The words were a vow.

Naina leaned over, resting her head on his shoulder. Raghav didn't pull away. He rested his hand on hers, feeling the steady, vibrant pulse of her life against his.

"You're finally in the subtext," she whispered.

"No," Raghav said, closing his eyes. "I think we're finally starting a new chapter."`,
        estimatedReadTime: 6,
        images: [],
        isLocked: false,
        createdAt: new Date().toISOString()
      },
      {
        id: "ch4",
        storyId: "4",
        number: 4,
        title: "The Fellowship of Distance",
        content: `Delhi was a shock to the system. After the quiet, thin air of Shimla, the capital felt like a fever dream—loud, hot, and relentlessly fast. I threw myself into my fellowship, researching the intersections of gender and folklore, but every night, I returned to my small apartment in CR Park and waited for the phone to ring.

Raghav was a man of the old school. He didn't like texting; he liked letters. Every Tuesday, a thick, cream-colored envelope would arrive in my mailbox. His handwriting was elegant and precise, filled with observations about the books he was reading, the changing of the seasons in the mountains, and the quiet ways he missed my presence in his study.

"The deodars look heavy with the rain today," he wrote in one. "I found myself making two cups of tea this afternoon. One for the text, and one for the memory of the subtext."

I loved his letters, but I craved his presence. I wanted to see the way his eyes crinkled when he smiled. I wanted to see the Professor lose his composure in the middle of a crowded Delhi market.

I invited him for the spring festival at the university. I didn't think he would come. I thought he would find a logical reason to stay in his fortress of books.

But on a Friday afternoon in March, I found him standing at the gates of the Metro station. He looked entirely out of place in his tweed jacket, holding a single, slightly wilted rose he had bought from a street vendor.

"The humidity here is a pedagogical disaster," he said as I ran into his arms.

I didn't care about the humidity. I didn't care about the people staring at the young woman hugging the older man. I just smelled the woodsmoke and sandalwood that followed him everywhere.

"You came," I said, pulling back to look at him.

"I told you I would," he said, his hand lingering on my cheek. "Patience is only a virtue if there's a destination, Naina. I think I've reached mine."

That weekend, the age gap didn't feel like a chasm; it felt like a bridge. He brought the wisdom of his years to my frantic energy, and I brought the light of my world to his shadows. We walked through the ruins of Hauz Khas, and for the first time, we weren't Professor and student. We were just two people, figuring out how to be together in a world that wanted to categorize us.`,
        estimatedReadTime: 7,
        images: [],
        isLocked: false,
        createdAt: new Date().toISOString()
      },
      {
        id: "ch5",
        storyId: "4",
        number: 5,
        title: "The Unwritten Ending",
        content: `Six months later, the scandal had broken and then faded, as scandals do. The university in Shimla had whispered, and some of Raghav's colleagues had turned their backs, but he found he didn't mind the silence anymore. He had retired early, taking a position as an editor for a prestigious literary journal—a job he could do from anywhere.

He was currently sitting in a small cafe in Delhi, waiting for Naina to finish her seminar.

When she walked in, she looked different—more confident, her eyes less frantic but no less bright. She sat down across from him and reached for his coffee, taking a sip just like she used to in his study.

"I finished the first draft of my paper," she said, her face glowing. "I think I'm going to dedicate it to Keats."

"Only Keats?" Raghav teased.

Naina smiled, and this time, there was no shadow of doubt in it. She reached across the table and took his hand. "To Keats, for the philosophy. And to you, for the patience."

Raghav looked at their joined hands. He was forty-three now, and she was twenty-four. The numbers hadn't changed, but the meaning had. They were no longer at the beginning or the end. They were in the middle—the long, beautiful, complicated middle of a story that didn't need a neat conclusion.

"The fog is clearing," Raghav said, looking out at the sun-drenched Delhi street.

"It's about time," Naina replied.

They walked out into the heat, two people who had learned that sometimes, the best things in life are the ones you have to wait for—the ones that require the silence to be broken not by a shout, but by a steady, enduring "yes."`,
        estimatedReadTime: 5,
        images: [],
        isLocked: false,
        createdAt: new Date().toISOString()
      }
    ],
    "5": [
      {
        id: "ch1",
        storyId: "5",
        number: 1,
        title: "The Red Carpet Requiem",
        content: `Mumbai is a city built on the sweat of people who want to be someone else. I am one of the few who makes a living by telling them why they failed. As a film critic for a major national daily, I spend my life in dark rooms, dissecting the dreams of others. I am cynical by trade and detached by choice. My parents' marriage was a masterclass in emotional coldness, a script with no dialogue and a lot of subtext. I learned early on that it's safer to sit in the audience than to be on the screen.

Then I met Aarohi at the premiere of Midnight in Versova.

The lobby of Liberty Cinema was a sea of velvet, cheap champagne, and expensive perfumes. Aarohi was at the center of the storm, a PR manager for the studio. She was wearing a silk dress the color of a bruised plum, her hair pulled back into a knot that looked like it required military precision. She was holding a clipboard as if it were a shield, directing celebrities and fending off photographers with a smile that never reached her eyes.

I watched her for ten minutes before I approached the guest list desk. She was fixing a crisis—a minor starlet was throwing a tantrum about her seating. Aarohi leaned in, whispered something that made the actress instantly quiet, and then turned to me.

"Name?" she asked, her voice efficient and honey-coated.

"Vihaan. The man who is going to give this movie two stars," I said.

She paused, her pen hovering over the paper. She looked up, and for a split second, the PR mask slipped. I saw the exhaustion beneath the concealer, the raw intelligence behind the practiced charm.

"Two stars is generous for this drivel, don't you think?" she whispered, her voice barely audible over the jazz band.

I was stunned. "You're representing the studio. You're supposed to tell me it's a masterpiece."

"I'm paid to make sure you think it's a masterpiece," she corrected, marking my name with a sharp flick of her wrist. "What I think is irrelevant. Enjoy the show, Vihaan. Try not to fall asleep in the second act; the pacing is terrible."

I went into the theater, but for the first time in my career, I didn't care about the cinematography or the sound design. I kept thinking about the woman in the plum dress who hated the product she was selling. She was the most honest thing in a room full of beautiful lies.`,
        estimatedReadTime: 6,
        images: [],
        isLocked: false,
        createdAt: new Date().toISOString()
      },
      {
        id: "ch2",
        storyId: "5",
        number: 2,
        title: "The Salt of Marine Drive",
        content: `The premiere ended at 1 AM. The reviews were already being drafted on phones in the lobby, but Vihaan found himself lingering by the exit. The crowds thinned until only the cleaning crew and a few stragglers remained.

He saw Aarohi leaning against one of the pillars outside, her heels in her hand, her bare feet pressing against the cool marble. She looked smaller without the clipboard.

"The two stars stand," Vihaan said, walking up to her.

Aarohi laughed, a tired, genuine sound. "Only two? The director will have my head. I'll have to spin it as an 'arthouse experiment' tomorrow morning."

"You could just quit," Vihaan suggested. "You're too smart to be a professional liar."

"In this city? Honesty doesn't pay the rent in Andheri, Vihaan. And besides, who would I be if I wasn't fixing things?" She looked out at the street. The rain had started—a light, misty drizzle that turned the streetlights into glowing halos. "I'm going to Marine Drive. I need to smell something that isn't hairspray."

"I'll drive," Vihaan said.

They sat on the tetrapods for three hours. The waves of the Arabian Sea crashed against the stones, sending salt spray into the air. Mumbai at 3 AM is a graveyard of ambitions, but it's also the only time the city feels like it's breathing.

Aarohi talked about her childhood in a small town in Karnataka, about the pressure to be the "successful one" in the family. She talked about how she had become a ghost in her own life, a woman who existed only to manage the images of others.

"Everyone wants something from me," she said, her voice cracking. "A better headline, a covered-up scandal, a way to look human for the cameras. But no one actually wants to see the human."

Vihaan looked at her. He thought about his own life—the columns he wrote, the distance he kept from everyone. He realized they were two sides of the same coin. She managed the fiction; he critiqued it. Neither of them actually lived in the real world.

"I see you," he said.

Aarohi turned to him, the salt spray clinging to her eyelashes. For a long moment, the only sound was the ocean. The city watched them from behind a thousand lit windows, but in that moment, they were the only two people who weren't performing.

When he kissed her, it tasted of salt and coffee and the terrifying realization that he was no longer an observer. He was finally in the scene.`,
        estimatedReadTime: 7,
        images: [],
        isLocked: false,
        createdAt: new Date().toISOString()
      },
      {
        id: "ch3",
        storyId: "5",
        number: 3,
        title: "The Mid-Season Twist",
        content: `Falling in love with a critic is like inviting a fire inspector to live in a house made of matchsticks. Vihaan doesn't know how to turn it off. He analyzes everything—the way I make tea, the way I avoid eye contact when I'm lying to my boss, the way the "PR voice" creeps back into my tone when I'm stressed.

"You're doing it again," he said one evening. We were at a small Irani cafe in Colaba, the ceiling fans whirring lazily above us.

"Doing what?" I asked, looking up from my phone. My agency was in the middle of a crisis involving a superstar's DUI.

"You're curating yourself. You're giving me the 'supportive girlfriend' monologue instead of telling me that you're overwhelmed and you want to throw your phone into the harbor."

I slammed my phone onto the table. "Maybe I like being curated, Vihaan! Maybe it's easier than being a mess. Not everyone can afford to be a cynical observer like you. Some of us have to keep the world spinning."

"I don't want you to keep the world spinning," he said, reaching across the table to take my hand. "I want you to let it stop for a minute. With me."

I felt the tears prickling. He was the only person who saw through the "Aarohi the Fixer" facade. It was exhausting and exhilarating all at once. But the city doesn't like it when you stop. The city demands your time, your image, your soul.

My boss called me ten minutes later. The superstar had been spotted at a club. The narrative was falling apart. I had to go.

"I have to fix this," I said, standing up.

Vihaan didn't move. He just looked at me with that analytical, disappointed gaze. "Is that the headline, Aarohi? 'PR Manager chooses fiction over reality'?"

"It's not fiction, Vihaan! It's my job!" I walked out, the bell of the cafe door ringing behind me like a funeral knell. I spent the night in a van with a crying actor and a team of lawyers, but all I could think about was the look on Vihaan's face. He was right. I was a professional liar, and I was starting to lie to myself.`,
        estimatedReadTime: 6,
        images: [],
        isLocked: false,
        createdAt: new Date().toISOString()
      },
      {
        id: "ch4",
        storyId: "5",
        number: 4,
        title: "The Final Edit",
        content: `The breakup didn't happen with a shout; it happened with a review.

Three months later, the big-budget biopic Aarohi had spent her life on was released. It was a vanity project, a hollow piece of propaganda for a fading star. She had worked twenty-hour days to ensure the press was favorable. She had begged, pleaded, and traded favors to keep the critics at bay.

She didn't ask Vihaan for a favor. She knew him too well.

On Friday morning, she opened the paper. Vihaan's column was on the front of the arts section. The headline read: "The Death of the Truth: Why We Keep Buying the Lies We're Sold."

He didn't just pan the movie; he panned the entire machine. He wrote about the PR teams that manufactured "heart" where there was only ego. He wrote about the "curators of shadow" who hid the reality of the people behind the stars. It was a brilliant, scathing piece of writing. It was also a direct attack on her world.

Aarohi went to his apartment in Bandra. She didn't knock; she had a key. He was sitting at his desk, staring at a blank screen.

"Was it worth it?" she asked, throwing the paper onto his lap.

Vihaan didn't look up. "It was the truth, Aarohi. You told me you wanted the truth."

"You destroyed my career, Vihaan! Every studio in this city knows we're together. They think I leaked the production issues to you. They think I'm the 'insider source'!"

"I didn't need an insider source," he said, finally looking at her. His eyes were red-rimmed. "I just had to look at you. I saw how much this movie was killing you. I saw how much you hated yourself for defending it. I did it for you."

"For me?" Aarohi laughed bitterly. "You did it for your ego. You did it so you could feel superior to the 'liars' again. You don't know how to love a person, Vihaan. You only know how to love a perspective."

She took her key off the ring and placed it on the desk.

"I'm leaving Mumbai," she said. "I got a job at a small non-profit in Bangalore. No red carpets. No clipboards. No lies."

"Aarohi..."

"Don't," she said. "You've already written the ending. Don't try to edit the scene now."

She walked out. The city that watched them fall was silent for once, muffled by the sound of the rain that always seemed to follow them.`,
        estimatedReadTime: 7,
        images: [],
        isLocked: false,
        createdAt: new Date().toISOString()
      },
      {
        id: "ch5",
        storyId: "5",
        number: 5,
        title: "The Post-Credit Scene",
        content: `A year later.

Mumbai is still here. The traffic is worse, the movies are just as bad, and the salt spray still ruins my suits. I'm still a critic, but my writing is different now. Less cynical. More aware of the human cost behind the frames.

I went to Bangalore for a film festival. I told myself I wouldn't call her. I told myself that the story was over. But some narratives have a way of looping back.

I found the NGO office. It was a small, dusty building near Cubbon Park. I stood at the window and saw her. She was wearing a simple cotton kurta, her hair loose, talking to a group of women about a literacy program. She wasn't holding a clipboard. She was holding a child's hand.

She looked up and saw me.

She didn't reach for a mask. She didn't look for a camera. She just looked at me.

"Two stars?" she asked as she stepped out into the hallway.

"Four," I said, my voice thick. "Maybe five. It's a completely different genre."

"I'm not fixing anything here, Vihaan," she said, leaning against the doorframe. "It's messy. It's loud. And sometimes it fails."

"Good," I said. "I'm tired of the polished version anyway."

We walked through Cubbon Park, the trees forming a green canopy that felt a thousand miles away from the neon lights of Mumbai. The city had watched us fall, but here, in the quiet, we were finally learning how to stand up.

"Are you going to write about this?" she asked, her hand brushing mine.

"No," I said. "This one is just for us. No audience. No reviews."

For the first time in my life, I didn't care about the ending. I was just happy to be in the middle of the story.`,
        estimatedReadTime: 6,
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
    // Return mock story if ID matches
    if (id === "1") {
      return {
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
      };
    }
    
    if (id === "2") {
      return {
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
      };
    }
    
    if (id === "3") {
      return {
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
      };
    }
    
    if (id === "4") {
      return {
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
      };
    }
    
    if (id === "5") {
      return {
        id: "5",
        categoryId: "slow-emotional",
        title: "The City That Watched Us Fall",
        author: "Unknown Author",
        description: "Two cynical Mumbaikars—film critic and PR manager—navigate honesty, ambition, and desire before finding truth beyond the city's scrutiny.",
        coverImage: "/assets/The-City-That-Watched-Us-Fall.png",
        rating: 4.6,
        reviewCount: 112,
        totalChapters: 5,
        genre: "City Love Story",
        isTrending: true,
        createdAt: new Date().toISOString()
      };
    }
    
    return undefined;
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