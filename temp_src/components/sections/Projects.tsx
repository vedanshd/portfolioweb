import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Projects() {
  const project = {
    name: "GenHack Hackathon – 4th Place | Gen AI Medical Chatbot",
    date: "Feb 2024",
    details: [
      "Built an AI-powered medical chatbot using open-source NLP models",
      "Implemented sentiment analysis & intent recognition for accurate responses",
      "Developed a full-stack solution using FastAPI (backend), React (frontend), and AWS Lambda (deployment)",
      "Ranked 4th out of 100+ teams in the GenHack AI Hackathon (ISA-VIT Organized)"
    ]
  };

  return (
    <section id="projects" className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <p className="text-muted-foreground">{project.date}</p>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {project.details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
