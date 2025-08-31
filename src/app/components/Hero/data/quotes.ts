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
    backgroundIds: ['nature-bear', 'redwood-forest'],
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
    backgroundIds: ['us-capitol', 'yosemite-valley'],
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
    backgroundIds: ['yosemite-valley', 'redwood-forest', 'california-coast'],
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
    backgroundIds: ['us-capitol'],
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
    backgroundIds: ['redwood-forest'],
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
    backgroundIds: ['us-capitol', 'nature-bear'],
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
    backgroundIds: ['us-capitol', 'california-coast'],
    tags: ['california', 'american-dream', 'opportunity', 'innovation']
  }
];
