export interface LibraryDocument {
  title: string
  filename: string
  excerpt: string
  category: string
  date?: string
  section: string
}

export interface LibrarySection {
  id: string
  name: string
  description: string
  backgroundImage: string
  categories: string[]
}

export const librarySections: LibrarySection[] = [
  {
    id: 'project-specs',
    name: 'Project Specs',
    description: 'Technical specifications, feature guides, and development guidelines for the Whitepine platform.',
    backgroundImage: '/hero/qotd/yosemite-valley.webp',
    categories: ['Platform Features', 'Technical Documentation', 'System Architecture', 'Database Design', 'API Documentation', 'Media Management']
  },
  {
    id: 'whimsy',
    name: 'Whimsy',
    description: 'Philosophical musings, cultural analyses, and imaginative explorations of democracy, technology, and human nature.',
    backgroundImage: '/hero/qotd/0725_Nature_bear.jpg',
    categories: [
      'Cultural Analysis',
      'Philosophy',
      'Political Thought',
      'Constitutional Thought',
      'Political Analysis',
      'Indigenous Wisdom',
      'Historical Analysis',
      'Literary Analysis',
      'Constitutional Innovation',
      'Media Studies',
      'American Mythology'
    ]
  }
]

export const libraryDocuments: LibraryDocument[] = [
  // Project Specs Documents
  {
    title: "US Government Database System",
    filename: "US_Government_Database_System.md",
    excerpt: "A comprehensive MongoDB-based data model representing the entire structure of the United States government with hierarchical jurisdictions, governing bodies, offices, positions, elections, and legislation.",
    category: "Database Design",
    section: "project-specs"
  },
  {
    title: "User Role System",
    filename: "User_Role_System.md",
    excerpt: "Role-based access control (RBAC) system providing Developer, Admin, Moderator, and User roles with specific permissions and API endpoints for role management.",
    category: "System Architecture",
    section: "project-specs"
  },
  {
    title: "User Profile System",
    filename: "User_Profile_System.md",
    excerpt: "Comprehensive user management interface with avatars, voting history, capital tracking, and profile editing capabilities integrated with the authentication system.",
    category: "Platform Features",
    section: "project-specs"
  },
  {
    title: "Authentication System Setup Guide",
    filename: "Authentication_System.md",
    excerpt: "Complete setup guide for local and Google OAuth authentication with JWT tokens, React Context, and comprehensive API endpoints for user management.",
    category: "Technical Documentation",
    section: "project-specs"
  },
  {
    title: "Political Capital Economic System",
    filename: "Political Capital.md",
    excerpt: "A civic currency system designed to give citizens fungible, rationed influence that works alongside Vigor to create a dual-currency democracy where both passion and patience have weight.",
    category: "Platform Features",
    section: "project-specs"
  },
  {
    title: "Vigor vs. Capital",
    filename: "Vigor vs. Capital.md",
    excerpt: "A concise comparison of how Vigor (immediate passion) and Political Capital (stored influence) work together as complementary forms of civic influence in the democratic process.",
    category: "Platform Features",
    section: "project-specs"
  },
  {
    title: "Vigor Feature Guide",
    filename: "Vigor_Feature_Guide.md",
    excerpt: "Comprehensive guide to the Vigor feature - a revolutionary system that allows users to channel emotional conviction into their votes through shake, voice, and statement activities.",
    category: "Platform Features",
    section: "project-specs"
  },
  {
    title: "Media Management System",
    filename: "media-management-system.md",
    excerpt: "Comprehensive media management system for government entities including file upload, storage, linking, and management of seals, flags, headshots, logos, and other media types.",
    category: "Media Management",
    section: "project-specs"
  },

  // Whimsy Documents
  {
    title: "Back to the Future as Prophetic Media",
    filename: "Back to the Future II.md",
    excerpt: "A dissertation exploring how Back to the Future Part II functioned as cultural foresight, with Biff Tannen's character eerily predicting Donald Trump's political rise through subconscious pattern recognition.",
    category: "Media Studies",
    section: "whimsy"
  },
  {
    title: "Back to the Future",
    filename: "Back to the Future.md",
    excerpt: "Further exploration of the prophetic nature of the Back to the Future franchise and its cultural significance as a time capsule of collective foresight.",
    category: "Media Studies",
    section: "whimsy"
  },
  {
    title: "Moral Evaluation",
    filename: "Moral_Evaluation.md",
    excerpt: "Philosophical exploration of moral evaluation systems and their role in democratic processes and civic engagement.",
    category: "Philosophy",
    section: "whimsy"
  },
  {
    title: "Ron Paul",
    filename: "Ron Paul.md",
    excerpt: "Reflections on Ron Paul's political philosophy and libertarian principles in the context of American democracy.",
    category: "Political Thought",
    section: "whimsy"
  },
  {
    title: "John Wayne #1",
    filename: "John Wayne #1.md",
    excerpt: "Cultural analysis of John Wayne's impact on American identity and political mythology in the 20th century.",
    category: "American Mythology",
    section: "whimsy"
  },
  {
    title: "Federalist #86",
    filename: "Federalist #86.md",
    excerpt: "Contemporary interpretation of Federalist Paper #86 proposing a Civilian Voice Branch as a fourth branch of government to amplify the people's voice.",
    category: "Constitutional Innovation",
    section: "whimsy"
  },
  {
    title: "Donald Trump",
    filename: "Donald Trump.md",
    excerpt: "Analysis of Donald Trump's political phenomenon and its cultural implications for American democracy.",
    category: "Political Analysis",
    section: "whimsy"
  },
  {
    title: "Federalist #87",
    filename: "Federalist #87.md",
    excerpt: "Modern reading of Federalist Paper #87 and its application to current political challenges and constitutional governance.",
    category: "Constitutional Thought",
    section: "whimsy"
  },
  {
    title: "Sitting Bull",
    filename: "Sitting Bull.md",
    excerpt: "Reflections on Sitting Bull's leadership and the intersection of indigenous wisdom with democratic principles and governance.",
    category: "Indigenous Wisdom",
    section: "whimsy"
  },
  {
    title: "Davy Crockett",
    filename: "Davy Crockett.md",
    excerpt: "Exploration of Davy Crockett's legacy and the American frontier mythos in shaping national identity.",
    category: "American Mythology",
    section: "whimsy"
  },
  {
    title: "Vietnam #1",
    filename: "Vietnam #1.md",
    excerpt: "Analysis of the Vietnam War's impact on American political consciousness and democratic institutions in the modern era.",
    category: "Historical Analysis",
    section: "whimsy"
  },
  {
    title: "Twain #1",
    filename: "Twain #1.md",
    excerpt: "Mark Twain's insights on democracy, human nature, and the American experiment through literary analysis.",
    category: "Literary Analysis",
    section: "whimsy"
  },
  {
    title: "A. Lincoln",
    filename: "A. Lincoln.md",
    excerpt: "Abraham Lincoln's vision for a Civilian Voice Branch - a new branch of government to amplify the people's voice and ensure government serves the people.",
    category: "Constitutional Innovation",
    section: "whimsy"
  }
]

export const getDocumentsBySection = (sectionId: string): LibraryDocument[] => {
  return libraryDocuments.filter(doc => doc.section === sectionId)
}

export const getCategoriesBySection = (sectionId: string): string[] => {
  const section = librarySections.find(s => s.id === sectionId)
  return section ? section.categories : []
}
