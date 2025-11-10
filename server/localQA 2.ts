/**
 * Local keyword-based Q&A system to replace OpenAI functionality
 * This file implements a simple pattern matching system to answer questions
 * about resume content without external API dependencies.
 */

// Define categories and keywords for different sections of the resume
interface CategoryKeywords {
  [category: string]: {
    keywords: string[];
    patterns: RegExp[];
    responseFormatter: (content: string) => string;
  };
}

// Function to generate chat responses based on resume content
export async function generateChatResponse(query: string, resumeContent: string): Promise<string> {
  // Convert query to lowercase for case-insensitive matching
  const lowercaseQuery = query.toLowerCase().trim();

  // Define categories with their associated keywords and patterns
  const categories: CategoryKeywords = {
    education: {
      keywords: ['education', 'school', 'college', 'university', 'degree', 'vit', 'vellore', 'cgpa', 'gpa', 'academic', 'study', 'student', 'grade', 'class', 'delhi public school', 'dps'],
      patterns: [
        /education|school|college|university|degree|vit|vellore|cgpa|gpa|academic|study|student|grades?|class/i,
        /where did you (study|graduate)/i,
        /what (college|university|school)/i,
        /tell me about your education/i
      ],
      responseFormatter: (content) => {
        const educationSection = extractSection(content, 'Education:', 'Experience:');
        return `## Education

${educationSection}

I completed my schooling at Delhi Public School, Gurgaon with outstanding academic performance, and I'm currently pursuing a Bachelor of Technology in Computer Science at Vellore Institute of Technology (VIT) with a CGPA of 9.15.`;
      }
    },
    experience: {
      keywords: ['experience', 'work', 'job', 'intern', 'internship', 'ericsson', 'company', 'professional', 'career', 'telecommunication'],
      patterns: [
        /experience|work|job|intern(ship)?|ericsson|company|professional|career|employment|telecommunication/i,
        /where (did|have) you work(ed)?/i,
        /tell me about your (work|professional|job)/i
      ],
      responseFormatter: (content) => {
        const experienceSection = extractSection(content, 'Experience:', 'Projects:');
        return `## Work Experience

${experienceSection}

I worked as a Software Intern at Ericsson in Noida, where I developed skills in telecommunication technologies, Linux operations, Python programming, and cross-functional collaboration.`;
      }
    },
    skills: {
      keywords: ['skills', 'programming', 'language', 'python', 'java', 'javascript', 'react', 'frontend', 'backend', 'fullstack', 'aws', 'cloud', 'web', 'development', 'ai', 'machine learning', 'nlp'],
      patterns: [
        /skills?|programming|languages?|tech(nical)?|python|java|javascript|react|front.?end|back.?end|full.?stack|aws|cloud|web|development|ai|machine learning|nlp/i,
        /what (can you|are you able to) do/i,
        /what (languages|technologies|frameworks) (do you know|are you familiar with)/i,
        /tell me about your (skills|technical abilities)/i
      ],
      responseFormatter: (content) => {
        const skillsSection = extractSection(content, 'Skills:', 'Certifications:');
        return `## Technical Skills

${skillsSection}

My core technical skills include Python, Java, JavaScript, and C++ programming languages. I'm proficient in web development with React.js and FastAPI, and have experience with AWS cloud services, AI and machine learning technologies.`;
      }
    },
    projects: {
      keywords: ['projects', 'personal projects', 'hackathon', 'genhack', 'chatbot', 'ai', 'portfolio'],
      patterns: [
        /projects?|hackathon|genhack|chatbot|portfolio|built|created|developed|made/i,
        /what (have you|did you) (build|create|develop|make)/i,
        /tell me about your projects/i
      ],
      responseFormatter: (content) => {
        const projectsSection = extractSection(content, 'Projects:', 'Skills:');
  return `## Projects

${projectsSection}

I participated in the GenHack Hackathon and secured 4th place out of 100+ teams by developing an AI-powered medical chatbot using open-source NLP models, with a FastAPI backend and React frontend, hosted on AWS Lambda.`;
      }
    },
    contact: {
      keywords: ['contact', 'email', 'phone', 'number', 'mobile', 'reach', 'linkedin', 'social'],
      patterns: [
        /contact|email|phone|number|mobile|reach|linkedin|social|get in touch/i,
        /how (can|do) I (contact|reach) you/i,
        /what('s| is) your (email|phone|number|contact)/i
      ],
      responseFormatter: (content) => {
        return `## Contact Information

You can reach me via:
- Email: vedanshd04@gmail.com
- Mobile: +91 9599036305
- LinkedIn: [linkedin.com/in/vedansh-dhawan-50a860323](https://linkedin.com/in/vedansh-dhawan-50a860323)

Feel free to connect with me on LinkedIn or send me an email for any inquiries.`;
      }
    },
    personal: {
      keywords: ['about you', 'about yourself', 'introduction', 'background', 'summary', 'who are you', 'tell me about you'],
      patterns: [
        /about (you|yourself)|introduction|background|summary|who are you|personal/i,
        /tell me about (you|yourself)/i,
        /who is vedansh/i,
        /introduce yourself/i
      ],
      responseFormatter: (content) => {
        const summarySection = extractSection(content, 'Summary:', 'Education:');
        return `## About Me

${summarySection}

I'm Vedansh Dhawan, an ambitious Computer Science student at VIT with hands-on experience at Ericsson. I'm passionate about AI, machine learning, and full-stack development, and I enjoy applying new technologies to solve real-world problems.`;
      }
    },
    achievements: {
      keywords: ['achievements', 'awards', 'honors', 'recognition', 'accomplishments', 'medal', 'prize', 'certification'],
      patterns: [
        /achievements?|awards?|honors?|recognition|accomplishments?|medal|prize|certification/i,
        /what (have you|did you) (achieve|accomplish|win)/i,
        /tell me about your (achievements|awards|accomplishments)/i
      ],
      responseFormatter: (content) => {
        const honorsSection = extractSection(content, 'Honors & Awards:', 'Certifications:');
        const certificationsSection = extractSection(content, 'Certifications:', 'Honors & Awards:');
        
        return `## Achievements and Certifications

${honorsSection}

${certificationsSection}

I've earned a Gold Medal for continuous academic excellence, was a National Topper in Mathematics and IT, and have professional certifications in Generative AI and Microsoft Azure AI.`;
      }
    }
  };

  // Check if query matches any category
  for (const [category, data] of Object.entries(categories)) {
    // Check if any keywords from this category are in the query
    const hasKeyword = data.keywords.some(keyword => lowercaseQuery.includes(keyword));
    
    // Check if any patterns from this category match the query
    const matchesPattern = data.patterns.some(pattern => pattern.test(lowercaseQuery));
    
    if (hasKeyword || matchesPattern) {
      return data.responseFormatter(resumeContent);
    }
  }

  // If no category matches, provide a fallback response
  return generateFallbackResponse(lowercaseQuery, resumeContent);
}

// Helper function to extract a section from the resume content
function extractSection(content: string, startMarker: string, endMarker: string): string {
  const startIndex = content.indexOf(startMarker);
  if (startIndex === -1) return '';
  
  const endIndex = content.indexOf(endMarker, startIndex);
  if (endIndex === -1) return content.substring(startIndex);
  
  return content.substring(startIndex, endIndex).trim();
}

// Generate a fallback response when no specific match is found
function generateFallbackResponse(query: string, resumeContent: string): string {
  // Define generic fallback messages
  const fallbackMessages = [
    "I'm sorry, I don't have specific information about that in my resume. Could you ask about my education, work experience, skills, or projects instead?",
    "I don't seem to have details related to that query in my resume. Feel free to ask about my education at VIT, my internship at Ericsson, my technical skills, or my projects.",
    "That's not something I have information about. Would you like to know about my educational background, work experience, technical skills, or projects instead?",
    "I don't have that specific information in my resume. Is there something else you'd like to know about my professional background or skills?"
  ];
  
  // Return a random fallback message
  return fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
}

