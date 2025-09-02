export interface Quote {
  id: string;
  text: {
    abbreviated: string;
    direct: string;
  };
  source: {
    name: string;
    url?: string;
  };
  attribution: {
    name: string;
    url?: string;
  };
  date: string; // ISO date string
  explanation: string;
  backgroundIds: string[]; // References to background IDs
  tags: string[];
}

export const quotes: Quote[] = [
  {
    id: 'tree-of-peace',
    text: {
      abbreviated: "The tree shelters us all.",
      direct: "The tree shelters us all. Beneath its branches, all voices find shelter and all nations find harmony."
    },
    source: {
      name: "Haudenosaunee Tradition",
      url: "https://en.wikipedia.org/wiki/Great_Law_of_Peace"
    },
    attribution: {
      name: "Great Tree of Peace",
      url: "https://en.wikipedia.org/wiki/Great_Law_of_Peace"
    },
    date: "1142-01-01",
    explanation: "This quote from Haudenosaunee tradition represents the Great Tree of Peace, symbolizing unity, consensus, and the sheltering of all nations under one canopy of harmony and understanding.",
    backgroundIds: ['whitepine-tree'],
    tags: ['peace', 'unity', 'consensus', 'harmony']
  },
  {
    id: 'many-voices',
    text: {
      abbreviated: "Many voices, one tree.",
      direct: "Many voices, one tree. Each bead strengthens the belt, each testimony strengthens the whole."
    },
    source: {
      name: "Whitepine Philosophy",
      url: "#"
    },
    attribution: {
      name: "Whitepine Civic Platform",
      url: "#"
    },
    date: "2024-01-01",
    explanation: "This quote embodies the Whitepine philosophy of collective strength through individual contributions, where every voice matters and contributes to the greater whole, like beads in a wampum belt.",
    backgroundIds: ['whitepine-tree'],
    tags: ['collective', 'individual', 'strength', 'unity']
  },
  {
    id: 'roots-every-direction',
    text: {
      abbreviated: "Roots in every direction.",
      direct: "Roots in every direction, inviting all to stand under the canopy of democracy and transparency."
    },
    source: {
      name: "Whitepine Mission",
      url: "#"
    },
    attribution: {
      name: "Whitepine Civic Platform",
      url: "#"
    },
    date: "2024-01-01",
    explanation: "This quote represents the inclusive nature of the Whitepine platform, extending access and transparency across all communities and inviting everyone to participate in democratic processes.",
    backgroundIds: ['whitepine-tree'],
    tags: ['inclusion', 'transparency', 'democracy', 'access']
  },
  {
    id: 'freedom-rebellion',
    text: {
      abbreviated: "Become so absolutely free that your very existence is an act of rebellion.",
      direct: "The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion."
    },
    source: {
      name: "The Myth of Sisyphus",
      url: "https://en.wikipedia.org/wiki/The_Myth_of_Sisyphus"
    },
    attribution: {
      name: "Albert Camus",
      url: "https://en.wikipedia.org/wiki/Albert_Camus"
    },
    date: "1942-01-01",
    explanation: "This quote from Camus' philosophical essay explores the concept of freedom in the face of an absurd world, emphasizing individual agency and the power of personal choice as a form of resistance.",
    backgroundIds: ['redwood-forest', 'nature-bear'],
    tags: ['freedom', 'rebellion', 'philosophy', 'individualism']
  },
  {
    id: 'democracy-people',
    text: {
      abbreviated: "Democracy is the government of the people, by the people, for the people.",
      direct: "Government of the people, by the people, for the people, shall not perish from the earth."
    },
    source: {
      name: "Gettysburg Address",
      url: "https://en.wikipedia.org/wiki/Gettysburg_Address"
    },
    attribution: {
      name: "Abraham Lincoln",
      url: "https://en.wikipedia.org/wiki/Abraham_Lincoln"
    },
    date: "1863-11-19",
    explanation: "Lincoln's iconic phrase from the Gettysburg Address defines democracy as a system where power ultimately resides with the people, emphasizing the fundamental principle of popular sovereignty.",
    backgroundIds: ['us-capitol'],
    tags: ['democracy', 'government', 'people', 'freedom']
  },
  {
    id: 'nature-liberty',
    text: {
      abbreviated: "In wildness is the preservation of the world.",
      direct: "In wildness is the preservation of the world. Every tree sends its fibres forth in search of the Wild."
    },
    source: {
      name: "Walking",
      url: "https://en.wikipedia.org/wiki/Walking_(Thoreau)"
    },
    attribution: {
      name: "Henry David Thoreau",
      url: "https://en.wikipedia.org/wiki/Henry_David_Thoreau"
    },
    date: "1862-01-01",
    explanation: "Thoreau's observation about the importance of wilderness and natural spaces for human well-being and the preservation of freedom, emphasizing the connection between nature and liberty.",
    backgroundIds: ['redwood-forest', 'yosemite-valley'],
    tags: ['nature', 'wilderness', 'preservation', 'freedom']
  },
  {
    id: 'us-capitol-opportunity',
    text: {
      abbreviated: "The Golden Gate is not just a bridge, it's a gateway to opportunity.",
      direct: "The Golden Gate Bridge is not just a bridge, it's a gateway to opportunity, a symbol of what we can achieve when we work together."
    },
    source: {
      name: "California Dreaming",
      url: "#"
    },
    attribution: {
      name: "California State Motto",
      url: "#"
    },
    date: "1937-05-27",
    explanation: "This quote celebrates the Golden Gate Bridge as a symbol of California's spirit of innovation and opportunity, representing the state's role as a gateway to new possibilities.",
    backgroundIds: ['california-coast'],
    tags: ['opportunity', 'innovation', 'california', 'progress']
  },
  {
    id: 'bear-strength',
    text: {
      abbreviated: "As strong as the California grizzly, as free as the mountain wind.",
      direct: "We are as strong as the California grizzly, as free as the mountain wind, and as determined as the pioneers who settled this land."
    },
    source: {
      name: "California State Heritage",
      url: "#"
    },
    attribution: {
      name: "California Heritage",
      url: "#"
    },
    date: "1850-09-09",
    explanation: "This quote draws inspiration from the California grizzly bear on the state flag, symbolizing strength, freedom, and the pioneering spirit that built California.",
    backgroundIds: ['nature-bear'],
    tags: ['strength', 'freedom', 'california', 'pioneer']
  },
  {
    id: 'redwood-legacy',
    text: {
      abbreviated: "Like the redwoods, our democracy stands tall through the ages.",
      direct: "Like the ancient redwoods that have stood for thousands of years, our democracy stands tall through the ages, rooted in the principles of liberty and justice for all."
    },
    source: {
      name: "California Conservation",
      url: "#"
    },
    attribution: {
      name: "Environmental Heritage",
      url: "#"
    },
    date: "1968-10-02",
    explanation: "This quote compares the enduring nature of California's ancient redwood forests to the lasting strength of democratic principles, emphasizing the importance of preserving both natural and political heritage.",
    backgroundIds: ['redwood-forest', 'us-capitol'],
    tags: ['democracy', 'endurance', 'nature', 'heritage']
  },
  {
    id: 'coast-freedom',
    text: {
      abbreviated: "Where the land meets the sea, freedom finds its home.",
      direct: "Where the land meets the sea, freedom finds its home, and the spirit of exploration continues to guide us forward."
    },
    source: {
      name: "Pacific Heritage",
      url: "#"
    },
    attribution: {
      name: "Coastal Wisdom",
      url: "#"
    },
    date: "1848-01-24",
    explanation: "This quote celebrates California's unique geography where the Pacific Ocean meets the continent, symbolizing the state's role as a frontier of freedom and exploration.",
    backgroundIds: ['california-coast'],
    tags: ['freedom', 'exploration', 'geography', 'pacific']
  },
  {
    id: 'yosemite-inspiration',
    text: {
      abbreviated: "In Yosemite's grandeur, we find inspiration for our highest ideals.",
      direct: "In Yosemite's grandeur, we find inspiration for our highest ideals, reminding us that beauty and majesty are essential to the human spirit."
    },
    source: {
      name: "Yosemite Legacy",
      url: "#"
    },
    attribution: {
      name: "John Muir",
      url: "https://en.wikipedia.org/wiki/John_Muir"
    },
    date: "1890-10-01",
    explanation: "This quote reflects John Muir's philosophy about the spiritual and inspirational value of natural wonders like Yosemite, emphasizing how nature can elevate human aspirations.",
    backgroundIds: ['yosemite-valley'],
    tags: ['inspiration', 'nature', 'beauty', 'spirituality']
  },
  {
    id: 'democracy-participation',
    text: {
      abbreviated: "Democracy is not a spectator sport.",
      direct: "Democracy is not a spectator sport. It requires active participation, engagement, and the courage to stand up for what is right."
    },
    source: {
      name: "Civic Engagement",
      url: "#"
    },
    attribution: {
      name: "Civic Wisdom",
      url: "#"
    },
    date: "1776-07-04",
    explanation: "This quote emphasizes that democracy requires active citizen participation rather than passive observation, highlighting the responsibility of each citizen in maintaining democratic values.",
    backgroundIds: ['us-capitol'],
    tags: ['democracy', 'participation', 'civic-duty', 'engagement']
  },
  {
    id: 'california-dream',
    text: {
      abbreviated: "The California dream is the American dream amplified.",
      direct: "The California dream is the American dream amplified, where opportunity meets innovation and where the impossible becomes possible."
    },
    source: {
      name: "California Dreaming",
      url: "#"
    },
    attribution: {
      name: "California Spirit",
      url: "#"
    },
    date: "1849-01-01",
    explanation: "This quote captures the essence of California's unique role in American culture as a place where dreams are magnified and possibilities expanded, representing the state's innovative spirit.",
    backgroundIds: ['california-coast', 'us-capitol'],
    tags: ['california', 'american-dream', 'opportunity', 'innovation']
  },
  {
    id: 'roosevelt-nature-sacred',
    text: {
      abbreviated: "There is nothing so American as our national parks.",
      direct: "There is nothing so American as our national parks. The fundamental idea behind the parks is that the country belongs to the people, that it is in process of making for the enrichment of the lives of all of us."
    },
    source: {
      name: "Speech at Grand Canyon",
      url: "https://en.wikipedia.org/wiki/Theodore_Roosevelt"
    },
    attribution: {
      name: "Theodore Roosevelt",
      url: "https://en.wikipedia.org/wiki/Theodore_Roosevelt"
    },
    date: "1903-05-06",
    explanation: "Roosevelt's words emphasize the democratic nature of national parks as public lands that belong to all Americans, reflecting his conservation philosophy and the connection between nature preservation and democratic values.",
    backgroundIds: ['yellowstone-bison', 'yosemite-valley', 'redwood-forest'],
    tags: ['national-parks', 'democracy', 'conservation', 'public-lands', 'roosevelt']
  },
  {
    id: 'roosevelt-wilderness-preservation',
    text: {
      abbreviated: "The nation behaves well if it treats the natural resources as assets which it must turn over to the next generation increased, and not impaired in value.",
      direct: "The nation behaves well if it treats the natural resources as assets which it must turn over to the next generation increased, and not impaired in value. Conservation means development as much as it does protection."
    },
    source: {
      name: "New Nationalism Speech",
      url: "https://en.wikipedia.org/wiki/New_Nationalism_(Theodore_Roosevelt)"
    },
    attribution: {
      name: "Theodore Roosevelt",
      url: "https://en.wikipedia.org/wiki/Theodore_Roosevelt"
    },
    date: "1910-08-31",
    explanation: "This quote reflects Roosevelt's forward-thinking conservation philosophy, emphasizing that natural resources are a trust for future generations and that conservation involves both protection and sustainable development.",
    backgroundIds: ['yellowstone-bison', 'redwood-forest', 'yosemite-valley'],
    tags: ['conservation', 'future-generations', 'sustainability', 'stewardship', 'roosevelt']
  },
  {
    id: 'roosevelt-yosemite-grandeur',
    text: {
      abbreviated: "Yosemite Valley is the grandest of all the special temples of Nature.",
      direct: "Yosemite Valley is the grandest of all the special temples of Nature. It is the greatest glory of Nature. The work of the glacier is written in unmistakable letters."
    },
    source: {
      name: "Visit to Yosemite",
      url: "https://en.wikipedia.org/wiki/Theodore_Roosevelt"
    },
    attribution: {
      name: "Theodore Roosevelt",
      url: "https://en.wikipedia.org/wiki/Theodore_Roosevelt"
    },
    date: "1903-05-06",
    explanation: "Roosevelt's awe at Yosemite's natural beauty reflects his deep appreciation for wilderness and his commitment to preserving such natural wonders for future generations to experience and enjoy.",
    backgroundIds: ['yosemite-valley'],
    tags: ['yosemite', 'nature', 'beauty', 'wilderness', 'roosevelt', 'california']
  },
  {
    id: 'roosevelt-conservation-duty',
    text: {
      abbreviated: "Conservation is a great moral issue, for it involves the patriotic duty of ensuring the safety and continuance of the nation.",
      direct: "Conservation is a great moral issue, for it involves the patriotic duty of ensuring the safety and continuance of the nation. The natural resources of our country are in danger of exhaustion if we permit the old wasteful methods of exploiting them to continue."
    },
    source: {
      name: "Conservation as a National Duty",
      url: "https://en.wikipedia.org/wiki/Theodore_Roosevelt"
    },
    attribution: {
      name: "Theodore Roosevelt",
      url: "https://en.wikipedia.org/wiki/Theodore_Roosevelt"
    },
    date: "1908-05-13",
    explanation: "Roosevelt frames conservation as a patriotic and moral obligation, connecting environmental stewardship to national security and the well-being of future generations.",
    backgroundIds: ['yellowstone-bison', 'us-capitol', 'redwood-forest'],
    tags: ['conservation', 'patriotism', 'moral-duty', 'national-security', 'roosevelt']
  },
  {
    id: 'roosevelt-redwoods-eternal',
    text: {
      abbreviated: "The groves of giant sequoias and redwoods are the most impressive of all the monuments of the ages.",
      direct: "The groves of giant sequoias and redwoods are the most impressive of all the monuments of the ages. They are the most majestic of all the living things on earth."
    },
    source: {
      name: "California Conservation",
      url: "https://en.wikipedia.org/wiki/Theodore_Roosevelt"
    },
    attribution: {
      name: "Theodore Roosevelt",
      url: "https://en.wikipedia.org/wiki/Theodore_Roosevelt"
    },
    date: "1903-05-06",
    explanation: "Roosevelt's reverence for California's ancient redwood forests reflects his understanding of their ecological and spiritual significance, emphasizing the need to preserve these natural monuments.",
    backgroundIds: ['redwood-forest'],
    tags: ['redwoods', 'sequoias', 'ancient-forests', 'conservation', 'roosevelt', 'california']
  },
  {
    id: 'roosevelt-public-lands',
    text: {
      abbreviated: "The public lands belong to the people, not to the government.",
      direct: "The public lands belong to the people, not to the government. The government is merely the trustee of these lands, holding them for the benefit of all the people."
    },
    source: {
      name: "Public Lands Policy",
      url: "https://en.wikipedia.org/wiki/Theodore_Roosevelt"
    },
    attribution: {
      name: "Theodore Roosevelt",
      url: "https://en.wikipedia.org/wiki/Theodore_Roosevelt"
    },
    date: "1907-12-03",
    explanation: "This quote emphasizes Roosevelt's democratic vision of public lands as a common heritage that government must steward on behalf of all citizens, not exploit for private gain.",
    backgroundIds: ['yellowstone-bison', 'us-capitol', 'redwood-forest'],
    tags: ['public-lands', 'democracy', 'stewardship', 'government-trust', 'roosevelt']
  },
  {
    id: 'muir-wilderness-soul',
    text: {
      abbreviated: "In every walk with nature one receives far more than he seeks.",
      direct: "In every walk with nature one receives far more than he seeks. The clearest way into the Universe is through a forest wilderness."
    },
    source: {
      name: "John of the Mountains",
      url: "https://en.wikipedia.org/wiki/John_Muir"
    },
    attribution: {
      name: "John Muir",
      url: "https://en.wikipedia.org/wiki/John_Muir"
    },
    date: "1916-01-01",
    explanation: "Muir's words capture the spiritual and transformative power of wilderness experiences, emphasizing how nature provides unexpected gifts and insights to those who venture into wild places.",
    backgroundIds: ['redwood-forest', 'yosemite-valley', 'yellowstone-bison'],
    tags: ['wilderness', 'spirituality', 'nature', 'discovery', 'muir', 'california']
  },
  {
    id: 'emerson-nature-freedom',
    text: {
      abbreviated: "Nature always wears the colors of the spirit.",
      direct: "Nature always wears the colors of the spirit. In the presence of nature, a wild delight runs through the man, in spite of real sorrows."
    },
    source: {
      name: "Nature",
      url: "https://en.wikipedia.org/wiki/Nature_(essay)"
    },
    attribution: {
      name: "Ralph Waldo Emerson",
      url: "https://en.wikipedia.org/wiki/Ralph_Waldo_Emerson"
    },
    date: "1836-01-01",
    explanation: "Emerson's transcendentalist philosophy connects the human spirit with the natural world, suggesting that nature reflects our inner state and provides joy and freedom even in difficult times.",
    backgroundIds: ['redwood-forest', 'yosemite-valley', 'california-coast'],
    tags: ['transcendentalism', 'spirit', 'nature', 'freedom', 'joy', 'philosophy']
  },
  {
    id: 'jefferson-democracy-nature',
    text: {
      abbreviated: "The earth belongs to the living generation.",
      direct: "The earth belongs to the living generation. We may consider each generation as a distinct nation, with a right, by the will of the majority, to bind themselves, but none to bind the succeeding generation."
    },
    source: {
      name: "Letter to James Madison",
      url: "https://en.wikipedia.org/wiki/Thomas_Jefferson"
    },
    attribution: {
      name: "Thomas Jefferson",
      url: "https://en.wikipedia.org/wiki/Thomas_Jefferson"
    },
    date: "1789-09-06",
    explanation: "Jefferson's democratic philosophy extends to natural resources, emphasizing that each generation has rights and responsibilities regarding the earth, connecting democratic principles with environmental stewardship.",
    backgroundIds: ['us-capitol', 'yellowstone-bison'],
    tags: ['democracy', 'generations', 'rights', 'responsibility', 'jefferson', 'stewardship']
  }
];
