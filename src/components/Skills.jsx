import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'

const skillCategories = [
  {
    id: 'ai',
    title: 'AI / LLM Evaluation',
    theme: 'ai',
    skills: ['RLHF', 'SFT', 'RAG', 'Prompt Engineering', 'AI Ethics'],
  },
  {
    id: 'tech',
    title: 'Tech Stack',
    theme: 'tech',
    skills: ['HTML', 'CSS', 'JavaScript', 'C++'],
  },
  {
    id: 'qc',
    title: 'Quality Control',
    theme: 'qc',
    skills: [
      'Annotation Validation',
      'AI Response Evaluation',
      'Data Integrity',
      'QA Testing',
      'Workflow Optimization',
    ],
  },
  {
    id: 'content',
    title: 'Content Creation',
    theme: 'content',
    skills: [
      'Instagram Reels',
      'Short-form Content',
      'Visual Storytelling',
      'Social Media Creativity',
      'Creative Direction',
    ],
  },
]

const tileClass = {
  ai: 'skill-tile skill-tile-ai',
  tech: 'skill-tile skill-tile-tech',
  qc: 'skill-tile skill-tile-qc',
  content: 'skill-tile skill-tile-content',
}

const categoryClass = {
  ai: 'skills-category skills-category-ai',
  tech: 'skills-category skills-category-tech',
  qc: 'skills-category skills-category-qc',
  content: 'skills-category skills-category-content',
}

const tileMotion = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
}

const gridMotion = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const blockMotion = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

function SkillTile({ name, theme }) {
  return (
    <motion.li
      variants={tileMotion}
      className={tileClass[theme]}
      whileHover={{ scale: 1.04, y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
    >
      <span>
        <span className="relative z-[2]">{name}</span>
      </span>
    </motion.li>
  )
}

function SkillCategoryBlock({ category }) {
  return (
    <motion.div
      className={categoryClass[category.theme]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={blockMotion}
    >
      {category.theme === 'ai' && (
        <div className="neural-grid absolute inset-0 pointer-events-none" aria-hidden="true" />
      )}

      <h3 className="skills-category-title font-playfair text-2xl md:text-3xl text-cream mb-6">
        {category.title}
      </h3>

      <motion.ul
        className="skills-tile-grid"
        variants={gridMotion}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-20px' }}
      >
        {category.skills.map((skill) => (
          <SkillTile key={skill} name={skill} theme={category.theme} />
        ))}
      </motion.ul>

      {category.theme === 'content' && (
        <a
          href="https://instagram.com/ashxgt_"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex mt-8 font-inter text-xs tracking-widest uppercase text-cream/50 hover:text-accent transition-colors cursor-none relative z-10"
        >
          @ashxgt_ on Instagram →
        </a>
      )}
    </motion.div>
  )
}

export default function Skills() {
  return (
    <section
      id="skills"
      className="py-32 px-8 md:px-16 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050505 0%, #060810 40%, #050505 100%)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 20%, rgba(3,88,185,0.1) 0%, transparent 50%)`,
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <SectionHeader
          label="Expertise"
          title="Skills & Expertise"
          subtitle="AI systems, creative technology, and modern digital craftsmanship."
        />

        <div className="space-y-12 md:space-y-16">
          {skillCategories.map((category) => (
            <SkillCategoryBlock key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  )
}
