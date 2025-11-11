import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Education() {
  const education = [
    {
      school: "VIT Vellore",
      period: "2022-2026, Expected",
      degree: "B.Tech in Computer Science",
      details: [
        "CGPA: 9.13",
        "S Grade in Basic Electrical Engineering, Technical English, Java Programming, Operating Systems and Embedded Systems",
        "Core Committee Member of Blockchain Community and VIT Model United Nations Society",
        "Member of Google Developers Student Club & Apple Developers Group"
      ]
    },
    {
      school: "Delhi Public School, Gurgaon",
      period: "2013-2022",
      degree: "Class 12th: 92% | Class 10th: 98.4%",
      details: [
        "School House Captain",
        "Active Member of Model United Nations Society",
        "Participated in inter-school debates and leadership programs",
        "National Topper in Mathematics & IT"
      ]
    }
  ];

  return (
    <section id="education" className="min-h-screen flex items-center justify-center p-4">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-background" />

      <div className="max-w-4xl w-full">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-8 text-center"
        >
          Education
        </motion.h2>
        <div className="space-y-6">
          {education.map((edu, index) => (
            <motion.div
              key={edu.school}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8,
                delay: index * 0.2,
                type: "spring",
                stiffness: 100
              }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-background to-primary/5">
                <CardHeader>
                  <CardTitle className="text-primary">{edu.school}</CardTitle>
                  <p className="text-muted-foreground">{edu.period}</p>
                  <p className="font-medium">{edu.degree}</p>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {edu.details.map((detail, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3 + (i * 0.1) }}
                      >
                        {detail}
                      </motion.li>
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