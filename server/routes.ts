import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import fs from "fs";
import { generateChatResponse as generateGeminiResponse } from "./gemini";
import { generateChatResponse as generateLocalResponse } from "./localQA";
import { emailService } from "./emailService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from the public directory
  app.use('/public', express.static(path.join(process.cwd(), 'public')));
  
  // Add an explicit route for resume.pdf
  app.get('/resume.pdf', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'resume.pdf'));
  });
  

  // Get resume content from the text file for the chatbot context
  const resumeFilePath = path.join(process.cwd(), 'public', 'resume_content.txt');
  let resumeContent = "";
  
  try {
    if (fs.existsSync(resumeFilePath)) {
      resumeContent = fs.readFileSync(resumeFilePath, 'utf8');
    } else {
      // If the resume content file doesn't exist, create it from the attached_assets
      const attachedResumePath = path.join(process.cwd(), 'attached_assets', 'vedansh_resume.pdf');
      if (fs.existsSync(attachedResumePath)) {
        // For now, we'll just extract the text manually since this is a PDF
        resumeContent = `
Vedansh Dhawan
Email: vedanshd04@gmail.com
Mobile: +91 9599036305
linkedin.com/in/vedansh-dhawan-50a860323

Summary:
Ambitious Computer Science student at VIT with experience as a Software Intern at Ericsson. Skilled in Python, Java, and Linux, with a strong foundation in telecommunication fundamentals and network infrastructure. Passionate about applying new technologies to solve real-world problems, with a focus on AI, machine learning, and full-stack development.

Education:
Vellore Institute of Technology (VIT), Vellore, Tamil Nadu
Bachelor of Technology in Computer Science; CGPA: 9.15 (Sep 2022 – Aug 2026 Expected)
Achievements: Achieved S grade (highest possible) in Basic Electrical Engineering, Technical English, Java Programming, and Operating Systems
Activities: Core Committee Member of Blockchain Community and VIT Model United Nations Society; Member of Google Developers Student Club and Apple Developers Group

Delhi Public School, Gurgaon
Class 12th - 90%, Class 10th - 98.4% (Apr 2013 – Apr 2022)
Achievements: National Topper in Mathematics & IT; Gold Medalist for Academic Excellence
Activities: 2nd Prize in Photography and Editing Competition; Active participant in Model United Nations (MUN); Leader of the school tech club

Experience:
Ericsson, Noida, Uttar Pradesh
Software Intern (May 2024 – Jul 2024)
- Telecommunication Knowledge: Developed a strong understanding of network operations and mobile communication protocols
- Linux Proficiency: Enhanced skills in Linux operations and command-line interfaces
- Python Programming: Mastered Python for automation scripts, data analysis, and software development
- Cross-Functional Collaboration: Worked with diverse teams to troubleshoot and optimize network performance
- Software Testing: Developed and executed test cases to validate system functionality

Projects:
GenHack Hackathon – 4th Place, Gen AI Medical Chatbot (Feb 2024)
Technologies: OpenAI, FastAPI, React, AWS Lambda
- Development: Developed an AI-powered medical chatbot using open-source NLP models
- NLP Implementation: Implemented sentiment analysis & intent recognition for accurate medical responses
- Full-Stack Integration: Integrated FastAPI backend with a React-based frontend, hosted on AWS Lambda
- Achievement: Secured 4th place out of 100+ teams in GenHack, an ISA-VIT organized Gen AI Hackathon

Skills:
- Programming Languages: Python, Java, JavaScript, C++
- Web Development: React.js, FastAPI, Full-Stack Development
- Cloud & DevOps: Amazon Web Services (AWS), Linux
- AI & Machine Learning: Natural Language Processing (NLP), Generative AI, Azure AI Studio
- Databases: Oracle Database
- Other Technologies: Android Development, Computer Networking, Data Structures
- Soft Skills: Communication, Analytical Skills, Problem-solving

Certifications:
- Career Essentials in Generative AI: Microsoft and LinkedIn (Feb 2025)
- Microsoft Azure AI Essentials Professional Certificate: Microsoft and LinkedIn (Feb 2025)

Honors & Awards:
- Gold Medal: Continuous academic excellence in high school, Delhi Public School Gurgaon (Jul 2022)
- National Topper, Mathematics and IT: Achieved full marks in national final exams in class 10th board exams (Jul 2022)
- Photography and Editing Competition: 2nd Prize, Blue Bells Public School, Gurgaon (May 2019)
        `;
        
        // Save the extracted content to the file
        fs.writeFileSync(resumeFilePath, resumeContent);
      }
    }
  } catch (error) {
    console.error("Error reading resume content:", error);
  }

  // Chatbot API endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const response = await generateChatResponse(message, resumeContent);
      res.json({ response });
    } catch (error) {
      console.error("Error in chat API:", error);
      res.status(500).json({ error: "Failed to process chat request" });
    }
  });

  // Contact form API endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Log the contact form submission
      console.log("📧 Contact form submission:", {
        name,
        email,
        subject,
        timestamp: new Date().toISOString()
      });

      // Send email using the email service
      const emailSent = await emailService.sendContactEmail({
        name,
        email,
        message: `Subject: ${subject}\n\n${message}`
      });

      if (emailSent) {
        console.log("✅ Contact email sent successfully");
        res.json({ success: true, message: "Thank you for your message! I'll get back to you soon." });
      } else {
        console.log("❌ Failed to send contact email");
        res.json({ success: true, message: "Message received! I'll get back to you soon." }); // Still show success to user
      }
    } catch (error) {
      console.error("❌ Error in contact API:", error);
      res.status(500).json({ error: "Failed to process contact request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Using Gemini AI with fallback to local Q&A
async function generateChatResponse(message: string, resumeContent: string): Promise<string> {
  // Try Gemini first
  try {
    console.log('Attempting Gemini response');
    const geminiResponse = await generateGeminiResponse(message, resumeContent);

    if (geminiResponse && !geminiResponse.includes('AI chat service is not currently configured') && !geminiResponse.includes('Sorry, I encountered an error')) {
      return geminiResponse;
    }
    console.log('Gemini did not return a valid response, falling back to local QA');
  } catch (gErr) {
    console.log('Gemini API error, falling back to local QA:', gErr);
  }

  console.log('Using local Q&A system');
  return await generateLocalResponse(message, resumeContent);
}
