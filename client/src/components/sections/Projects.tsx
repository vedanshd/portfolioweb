import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Projects() {
  const projects = [
    {
      name: "VDreamScape – AI-Powered Dream Analysis App",
      date: "2024",
      technologies: "AI, OpenAI API, React, FastAPI",
      details: [
        "Built a full-stack dream analysis platform using AI to analyze and interpret user-submitted dreams into psychological narratives",
        "Symbol analysis and interactive reflection prompts to encourage deeper self-understanding",
        "Responsive UI with light/dark theme support",
        "Implemented OpenAI API integration with fallback mocks to maintain high availability (99.9% uptime)"
      ]
    },
    {
      name: "Personal Portfolio Website",
      date: "2024",
      technologies: "React, TypeScript, Tailwind CSS, Express.js, PostgreSQL, OpenAI API, Framer Motion",
      details: [
        "Voice navigation for enhanced accessibility",
        "Dark/light theme toggle with smooth transitions",
        "AI-powered chatbot for interactive user engagement",
        "Animated UI components using Framer Motion",
        "Contact form with backend integration and email notifications",
        "Fully SEO-optimized and deployed via Vercel"
      ]
    },
    {
      name: "LinkedIn Résumé Forge",
      date: "2024",
      technologies: "Python, Flask, Gemini API, Selenium, BeautifulSoup, ReportLab, HTML/CSS/JS",
      details: [
        "AI-driven LinkedIn profile parser that extracts structured profile data",
        "Zero-scraping privacy mode and regex-based smart fallbacks for robustness",
        "Generates professional PDF résumés instantly (ReportLab) with a sleek interactive web UI",
        "Local Flask deployment with optional Gemini API integration for intelligent résumé creation"
      ]
    },
    {
      name: "Advanced Health News Analysis Platform – AI-Powered NLP & Analytics",
      date: "2024",
      technologies: "Python, Streamlit, Hugging Face Transformers, NLTK, Scikit-learn, Plotly, BeautifulSoup",
      details: [
        "End-to-end platform to analyze health news (URL, file, or text) with abstractive summarization using PEGASUS and transformer models",
        "Designed a 9-stage NLP pipeline: normalization, TF-IDF, embeddings, model inference, and evaluation",
        "Evaluated models using 29 metrics (ROUGE, semantic similarity, efficiency) and provided detailed error analysis",
        "Interactive dashboards with radar charts, word clouds, and GPT-powered semantic search for intelligent querying"
      ]
    }
  ];

  return (
    <section id="projects" className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>
        <div className="space-y-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-primary">{project.name}</CardTitle>
                  <p className="text-muted-foreground text-sm">{project.date}</p>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    <strong>Technologies:</strong> {project.technologies}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {project.details.map((detail, i) => (
                      <li key={i} className="text-sm leading-relaxed">{detail}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
