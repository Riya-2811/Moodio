import React, { useState, useEffect } from 'react';

/**
 * Did You Know Component
 * Displays interesting, proven facts about emotional health, psychology, and the human mind
 * Shows a new random fact on each page load/visit
 */
const DidYouKnow = () => {
  const [currentFact, setCurrentFact] = useState(null);

  // Array of unique, proven facts about emotional health, psychology, and the human mind
  const facts = [
    {
      fact: "Smiling can actually trick your brain into feeling happier, even if you're not initially in a good mood. This is called the facial feedback hypothesis.",
      source: "Psychological Science"
    },
    {
      fact: "Regular exercise is as effective as antidepressants for treating mild to moderate depression, according to multiple studies.",
      source: "Harvard Medical School"
    },
    {
      fact: "Writing about your emotions for just 15-20 minutes can significantly reduce stress and improve mental health. This is called expressive writing therapy.",
      source: "Journal of Clinical Psychology"
    },
    {
      fact: "The human brain processes negative information faster than positive information - this is called negativity bias, an evolutionary survival mechanism.",
      source: "Psychological Review"
    },
    {
      fact: "Listening to music releases dopamine in the brain, the same chemical released during eating and sex, which explains why music can improve mood.",
      source: "Nature Neuroscience"
    },
    {
      fact: "Practicing gratitude regularly can rewire your brain to be more optimistic and can increase happiness by up to 25% over time.",
      source: "Journal of Personality and Social Psychology"
    },
    {
      fact: "Deep breathing activates the parasympathetic nervous system, which helps reduce stress and anxiety by slowing your heart rate and lowering blood pressure.",
      source: "Harvard Health Publishing"
    },
    {
      fact: "Social connections are as important to your health as not smoking, exercising, and maintaining a healthy weight. Loneliness can be as harmful as smoking 15 cigarettes a day.",
      source: "Brigham Young University Study"
    },
    {
      fact: "The brain's neuroplasticity means you can literally rewire your brain through new experiences and learning, even in adulthood. Your brain continues to change throughout your life.",
      source: "Nature Reviews Neuroscience"
    },
    {
      fact: "Crying releases oxytocin and endorphins, which are natural painkillers and mood elevators. This is why you often feel better after a good cry.",
      source: "Frontiers in Psychology"
    },
    {
      fact: "Meditation can physically change your brain structure in just 8 weeks, increasing gray matter in areas associated with memory, empathy, and stress regulation.",
      source: "Psychiatry Research: Neuroimaging"
    },
    {
      fact: "Sleep deprivation affects emotional regulation more than cognitive function. Just one night of poor sleep can make you 60% more reactive to negative events.",
      source: "Journal of Sleep Research"
    },
    {
      fact: "The placebo effect is so powerful that your brain can produce real physiological changes just from believing something will help, even if it's a sugar pill.",
      source: "Nature Reviews Neuroscience"
    },
    {
      fact: "Acts of kindness trigger the release of serotonin in both the giver and receiver, creating a 'helper's high' that boosts mood and well-being.",
      source: "Journal of Social Psychology"
    },
    {
      fact: "Your gut produces 90% of your body's serotonin, the 'happiness hormone.' This is why gut health directly impacts mental health - the gut-brain connection is real.",
      source: "Harvard Medical School"
    },
    {
      fact: "Spending time in nature can reduce cortisol (stress hormone) levels by up to 21% and improve mood significantly, even in urban parks.",
      source: "Environmental Science & Technology"
    },
    {
      fact: "The average person has about 6,000 thoughts per day, and research suggests that 80% of them are negative. Mindfulness helps break this pattern.",
      source: "National Science Foundation"
    },
    {
      fact: "Laughing for just 10-15 minutes can burn up to 40 calories and increase your heart rate similar to light exercise, while also reducing stress hormones.",
      source: "International Journal of Obesity"
    },
    {
      fact: "Hugging someone for 20 seconds releases oxytocin, which can lower blood pressure, reduce stress, and improve your immune system.",
      source: "University of North Carolina Study"
    },
    {
      fact: "The '5-4-3-2-1' grounding technique (naming 5 things you see, 4 you can touch, etc.) works because it forces your brain to focus on the present moment, interrupting anxious thoughts.",
      source: "Cognitive Behavioral Therapy Research"
    },
    {
      fact: "Your brain processes emotional pain in the same regions as physical pain. Heartbreak and physical injury activate similar neural pathways.",
      source: "Proceedings of the National Academy of Sciences"
    },
    {
      fact: "Practicing self-compassion activates the same brain regions as when you feel compassion for others, and it's linked to greater resilience and well-being.",
      source: "Journal of Clinical Psychology"
    },
    {
      fact: "The 'butterflies in your stomach' feeling is real - your gut has its own nervous system with over 100 million neurons, often called the 'second brain.'",
      source: "Scientific American"
    },
    {
      fact: "Color psychology shows that blue and green can reduce stress and anxiety, while yellow can boost mood and energy. This is why nature feels calming.",
      source: "Color Research and Application"
    },
    {
      fact: "The 'fresh start effect' is real - people are more motivated to make positive changes on temporal landmarks like Mondays, the first of the month, or after birthdays.",
      source: "Management Science"
    }
  ];

  useEffect(() => {
    // Select a random fact on component mount
    const randomIndex = Math.floor(Math.random() * facts.length);
    setCurrentFact(facts[randomIndex]);
  }, []); // Empty dependency array means this runs once on mount

  if (!currentFact) {
    return null; // Don't render until fact is selected
  }

  return (
    <div className="bg-gradient-to-br from-warm-pink/40 via-calm-purple/30 to-soft-green/40 dark:from-purple-600/20 dark:via-accent-blue/20 dark:to-green-500/20 rounded-softer p-6 md:p-8 shadow-lg border-2 border-calm-purple/30 dark:border-accent-blue/40 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-calm-purple to-warm-pink dark:from-accent-blue dark:to-purple-600 flex items-center justify-center text-2xl shadow-md">
            💡
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800 dark:text-gray-100">
            Did you know?
          </h3>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-3 italic">
            "{currentFact.fact}"
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-right">
            — {currentFact.source}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DidYouKnow;

