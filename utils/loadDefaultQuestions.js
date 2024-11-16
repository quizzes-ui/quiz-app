// Simulated default questions
const defaultQuestions = [
  {
    "title": "Quiz on the Islamic Golden Age",
    "questions": [
      {
        "id": "1",
        "texte": "What was the original purpose of the site where the Great Mosque of Damascus is located?",
        "answerA": "A Roman temple",
        "answerB": "A Persian marketplace",
        "answerC": "A Greek library",
        "correctAnswer": "A",
        "justification": "The Great Mosque of Damascus in Syria is one of the largest and oldest mosques in the world. It was placed on the site of an ancient Roman temple and later Christian church."
      },
      {
        "id": "2",
        "texte": "During which caliph's reign is the Islamic Golden Age traditionally considered to have begun?",
        "answerA": "Umar ibn al-Khattab",
        "answerB": "Harun al-Rashid",
        "answerC": "Al-Ma'mun",
        "correctAnswer": "B",
        "justification": "The Islamic Golden Age is traditionally understood to have begun during the reign of the Abbasid caliph Harun al-Rashid."
      },
      {
        "id": "3",
        "texte": "What was the main purpose of the House of Wisdom in Baghdad?",
        "answerA": "To train soldiers",
        "answerB": "To translate classical knowledge into Arabic",
        "answerC": "To store religious texts",
        "correctAnswer": "B",
        "justification": "Scholars from various parts of the world with different cultural backgrounds were mandated to gather and translate all of the world’s classical knowledge into the Arabic language at the House of Wisdom."
      },
      {
        "id": "4",
        "texte": "Which city was NOT one of the main intellectual centers during the Islamic Golden Age?",
        "answerA": "Baghdad",
        "answerB": "Córdoba",
        "answerC": "Mecca",
        "correctAnswer": "C",
        "justification": "The major Islamic capital cities of Baghdad, Cairo, and Córdoba became the main intellectual centers for science, philosophy, medicine, and education."
      },
      {
        "id": "5",
        "texte": "Which instrument was developed by Muslim astronomers for star mapping?",
        "answerA": "Astrolabe",
        "answerB": "Sundial",
        "answerC": "Compass",
        "correctAnswer": "A",
        "justification": "Muslim astronomers developed and refined scientific instruments, including the astrolabe, which serves as a star chart and physical model of visible heavenly bodies."
      },
      {
        "id": "6",
        "texte": "What was one of the purposes for studying astronomy in the Islamic Golden Age?",
        "answerA": "To predict agricultural seasons",
        "answerB": "To determine prayer times and direction of Mecca",
        "answerC": "To enhance navigation at sea",
        "correctAnswer": "B",
        "justification": "Astronomy was driven by needs such as determining prayer times and the direction of Mecca."
      },
      {
        "id": "7",
        "texte": "What duty, encouraged by the Qur’an, contributed to the development of hospitals?",
        "answerA": "Defending the faith",
        "answerB": "Giving to charity",
        "answerC": "Respecting scholars",
        "correctAnswer": "B",
        "justification": "The Qur’an encourages Muslims to give money to charity, and in medieval times, some of this money was used to pay for hospitals to be built."
      },
      {
        "id": "8",
        "texte": "Why is Islamic medicine of this era considered advanced compared to Europe?",
        "answerA": "It used animal-based medicines",
        "answerB": "It avoided surgery",
        "answerC": "It developed new ideas, surgeries, and treatments",
        "correctAnswer": "C",
        "justification": "Islamic medicine at this time is seen as having been more advanced than medicine in Europe due to new ideas, surgeries, and treatments."
      },
      {
        "id": "9",
        "texte": "Which mathematician wrote a pioneering book on algebra?",
        "answerA": "Al-Biruni",
        "answerB": "Muhammad ibn Musa al-Khwarizmi",
        "answerC": "Ibn Sina",
        "correctAnswer": "B",
        "justification": "Islamic contributions to mathematics began around AD 825, when the Baghdad mathematician Muhammad ibn Musa al-Khwarizmi wrote the first book that developed into algebra."
      },
      {
        "id": "10",
        "texte": "What unique mathematical concept did Islamic scholars add to the Indian numeration system?",
        "answerA": "Complex fractions",
        "answerB": "Decimal fractions",
        "answerC": "Negative numbers",
        "correctAnswer": "B",
        "justification": "Islamic scholars added decimal fractions to the Indian system of numeration."
      },
      {
        "id": "11",
        "texte": "The Great Mosque of Damascus was originally the site of a:",
        "answerA": "Byzantine palace",
        "answerB": "Roman temple",
        "answerC": "Jewish synagogue",
        "correctAnswer": "B",
        "justification": "It was placed on the site of an ancient Roman temple and later Christian church."
      },
      {
        "id": "12",
        "texte": "Which city had a 3D model made to represent its appearance during the Abbasid period?",
        "answerA": "Cairo",
        "answerB": "Damascus",
        "answerC": "Baghdad",
        "correctAnswer": "C",
        "justification": "A 3D model of Baghdad under the Abbasids was created based on archaeological evidence."
      },
      {
        "id": "13",
        "texte": "Islamic advancements in medicine were partly motivated by the duty to:",
        "answerA": "Defend the community",
        "answerB": "Care for the sick",
        "answerC": "Educate the young",
        "correctAnswer": "B",
        "justification": "The Qur’an tells Muslims they have a duty to care for people who are sick."
      },
      {
        "id": "14",
        "texte": "What type of map from the Abbasid era is shown in the documents?",
        "answerA": "Trade routes map",
        "answerB": "Population density map",
        "answerC": "Battlefield locations map",
        "correctAnswer": "A",
        "justification": "A map of Muslim trade routes during the Abbasid caliphate is shown."
      },
      {
        "id": "15",
        "texte": "The House of Wisdom in Baghdad was known primarily for its work in:",
        "answerA": "Building astronomical observatories",
        "answerB": "Military training",
        "answerC": "Translating classical knowledge",
        "correctAnswer": "C",
        "justification": "Scholars gathered and translated all of the world’s classical knowledge into Arabic at the House of Wisdom."
      },
      {
        "id": "16",
        "texte": "Which scientific field did Muslim scholars contribute to by refining instruments?",
        "answerA": "Anatomy",
        "answerB": "Astronomy",
        "answerC": "Geography",
        "correctAnswer": "B",
        "justification": "Muslim astronomers developed and refined scientific instruments to cater to astronomical requirements."
      },
      {
        "id": "17",
        "texte": "The mathematical study of which type of equations was central to Islamic mathematicians?",
        "answerA": "Linear equations",
        "answerB": "Quadratic equations",
        "answerC": "Differential equations",
        "correctAnswer": "B",
        "justification": "A systematic study of methods for solving quadratic equations constituted a central concern of Islamic mathematicians."
      },
      {
        "id": "18",
        "texte": "Islamic scholars used the astrolabe primarily for what purpose?",
        "answerA": "Calculating distances between cities",
        "answerB": "Star mapping and modeling heavenly bodies",
        "answerC": "Measuring atmospheric pressure",
        "correctAnswer": "B",
        "justification": "The astrolabe serves as a star chart and physical model of visible heavenly bodies."
      },
      {
        "id": "19",
        "texte": "The Golden Age of Islam spanned from the 8th century to approximately which century?",
        "answerA": "10th century",
        "answerB": "13th century",
        "answerC": "15th century",
        "correctAnswer": "B",
        "justification": "The Islamic Golden Age refers to a period traditionally dated from the 8th century to the 13th century."
      },
      {
        "id": "20",
        "texte": "Who was one of the prominent translators at the House of Wisdom?",
        "answerA": "Hunayn ibn Ishaq",
        "answerB": "Al-Battani",
        "answerC": "Al-Farabi",
        "correctAnswer": "A",
        "justification": "The government patronized scholars like Hunayn ibn Ishaq, who were notable translators at the House of Wisdom."
      },
      {
        "id": "21",
        "texte": "What was the Great Mosque of Damascus originally built on?",
        "answerA": "An ancient Roman temple and later a Christian church",
        "answerB": "A marketplace",
        "answerC": "An open field",
        "correctAnswer": "A",
        "justification": "The Great Mosque of Damascus in Syria is one of the largest and oldest mosques in the world. It was placed on the site of an ancient Roman temple and later Christian church."
      },
      {
        "id": "22",
        "texte": "Which city became the intellectual hub during the Islamic Golden Age?",
        "answerA": "Mecca",
        "answerB": "Baghdad",
        "answerC": "Istanbul",
        "correctAnswer": "B",
        "justification": "During the Golden Age, the major Islamic capital cities of Baghdad, Cairo, and Córdoba became the main intellectual centers for science, philosophy, medicine, and education."
      },
      {
        "id": "23",
        "texte": "Who was the Abbasid caliph associated with the inauguration of the House of Wisdom?",
        "answerA": "Harun al-Rashid",
        "answerB": "Al-Mansur",
        "answerC": "Al-Mamun",
        "correctAnswer": "A",
        "justification": "This period is traditionally understood to have begun during the reign of the Abbasid caliph Harun al-Rashid (786–809) with the inauguration of the House of Wisdom in Baghdad."
      },
      {
        "id": "24",
        "texte": "What scientific instrument did Muslim astronomers refine?",
        "answerA": "Telescope",
        "answerB": "Astrolabe",
        "answerC": "Sextant",
        "correctAnswer": "B",
        "justification": "Muslim astronomers developed and refined scientific instruments to cater to these requirements, including the astrolabe, which serves as a star chart and physical model of visible heavenly bodies."
      },
      {
        "id": "25",
        "texte": "What major contribution to mathematics was made by Muḥammad ibn Mūsā al-Khwārizmī?",
        "answerA": "The invention of calculus",
        "answerB": "The development of algebra",
        "answerC": "The concept of zero",
        "correctAnswer": "B",
        "justification": "Islamic contributions to mathematics began around AD 825, when the Baghdad mathematician Muḥammad ibn Mūsā al-Khwārizmī wrote the first book that developed into algebra."
      },
      {
        "id": "26",
        "texte": "What need drove Muslim astronomers to advance their study of the heavens?",
        "answerA": "Predicting eclipses",
        "answerB": "Determining prayer times and the direction of Mecca",
        "answerC": "Navigation",
        "correctAnswer": "B",
        "justification": "Muslim astronomers, driven by such needs as determining prayer times and the direction of Mecca, developed and refined scientific instruments."
      },
      {
        "id": "27",
        "texte": "What does the Qur’an encourage Muslims to do regarding the sick?",
        "answerA": "Create medical schools",
        "answerB": "Donate money to hospitals",
        "answerC": "Provide herbal remedies",
        "correctAnswer": "B",
        "justification": "The Qur’an tells Muslims they have a duty to care for people who are sick. In medieval times, some of this money was used to pay for hospitals to be built."
      },
      {
        "id": "28",
        "texte": "What was a central concern of Islamic mathematicians?",
        "answerA": "Calculating pi",
        "answerB": "Solving quadratic equations",
        "answerC": "Geometry in architecture",
        "correctAnswer": "B",
        "justification": "A systematic study of methods for solving quadratic equations constituted a central concern of Islamic mathematicians."
      },
      {
        "id": "29",
        "texte": "What was a cultural achievement of Islamic scholars during the Golden Age?",
        "answerA": "Development of Gothic architecture",
        "answerB": "Translation of classical knowledge into Arabic",
        "answerC": "Creating Renaissance art",
        "correctAnswer": "B",
        "justification": "Scholars from various parts of the world with different cultural backgrounds were mandated to gather and translate all of the world’s classical knowledge into the Arabic language."
      },
      {
        "id": "30",
        "texte": "What major economic activity is shown by the map of the Abbasid caliphate?",
        "answerA": "Warfare",
        "answerB": "Trade",
        "answerC": "Agriculture",
        "correctAnswer": "B",
        "justification": "Document 4: Map of Muslim trade routes during the Abbasid caliphate."
      },
  {
        "id": "31",
        "texte": "What role did the House of Wisdom in Baghdad play during the Islamic Golden Age?",
        "answerA": "It was a place for military training",
        "answerB": "It was a center for translating and gathering knowledge",
        "answerC": "It served as a royal palace",
        "correctAnswer": "B",
        "justification": "The House of Wisdom in Baghdad was where scholars from various parts of the world with different cultural backgrounds were mandated to gather and translate all of the world’s classical knowledge into the Arabic language."
      },
      {
        "id": "32",
        "texte": "What motivated the refinement of scientific instruments like the astrolabe?",
        "answerA": "Enhancing maritime trade",
        "answerB": "Astrological predictions",
        "answerC": "Religious practices",
        "correctAnswer": "C",
        "justification": "Muslim astronomers developed and refined scientific instruments to cater to these requirements, including determining prayer times and the direction of Mecca."
      },
      {
        "id": "33",
        "texte": "What was a key feature of the cities like Baghdad during the Golden Age?",
        "answerA": "They were primarily industrial hubs",
        "answerB": "They were intellectual centers for various fields of study",
        "answerC": "They were isolated from cultural influences",
        "correctAnswer": "B",
        "justification": "Baghdad, along with Cairo and Córdoba, became the main intellectual centers for science, philosophy, medicine, and education."
      },
      {
        "id": "34",
        "texte": "What ancient sources did Islamic astronomers build upon?",
        "answerA": "Only pre-Islamic Arabian sources",
        "answerB": "Babylonian, Greek, Indian, and pre-Islamic Arabian sources",
        "answerC": "Chinese sources",
        "correctAnswer": "B",
        "justification": "Scientists and thinkers in the Islamic world built on Babylonian, Greek, Indian and pre-Islamic Arabian sources translated into Arabic to make huge advances in the study of the heavens."
      },
      {
        "id": "35",
        "texte": "What was one of the cultural impacts of Islamic mathematical contributions?",
        "answerA": "The development of calculus",
        "answerB": "The introduction of decimal fractions",
        "answerC": "The use of Roman numerals",
        "correctAnswer": "B",
        "justification": "Islamic mathematicians added decimal fractions (fractions such as 0.125, or 1/8) to the Indian system of numeration."
      },
      {
        "id": "36",
        "texte": "Why were hospitals significant during the Islamic Golden Age?",
        "answerA": "They served as places for religious rituals",
        "answerB": "They reflected the duty to care for the sick encouraged by Islam",
        "answerC": "They were only for royalty",
        "correctAnswer": "B",
        "justification": "The Qur’an tells Muslims they have a duty to care for people who are sick. In medieval times, some of this money was used to pay for hospitals to be built."
      },
      {
        "id": "37",
        "texte": "What does the 3D model of Baghdad under the Abbasids represent?",
        "answerA": "Military defenses",
        "answerB": "Architectural and urban sophistication",
        "answerC": "Agricultural advancements",
        "correctAnswer": "B",
        "justification": "The 3D model of Baghdad under the Abbasids shows the architectural and urban sophistication based on archaeological evidence."
      },
      {
        "id": "38",
        "texte": "How did Islamic scholars finance their work during the Golden Age?",
        "answerA": "Through independent patronage",
        "answerB": "Government support and patronage",
        "answerC": "Trade profits",
        "correctAnswer": "B",
        "justification": "The government heavily patronized scholars, and the best scholars and notable translators had salaries equivalent to those of professional athletes today."
      },
      {
        "id": "39",
        "texte": "What was the focus of early Islamic advancements in surgery?",
        "answerA": "Cosmetic surgeries",
        "answerB": "Developing new ideas and treatments",
        "answerC": "Mass-producing medicine",
        "correctAnswer": "B",
        "justification": "Muslim doctors were encouraged by their faith to develop new ideas, surgeries, and treatments, making Islamic medicine more advanced than in Europe at the time."
      },
      {
        "id": "40",
        "texte": "What does the map of Muslim trade routes indicate about the Abbasid Caliphate?",
        "answerA": "It focused on local markets",
        "answerB": "It had extensive international trade connections",
        "answerC": "It relied solely on agriculture",
        "correctAnswer": "B",
        "justification": "Document 4 shows the extensive trade routes during the Abbasid caliphate."
      }
  
    ]
  }
  
]

export function loadDefaultQuestions() {
  return defaultQuestions.map(quiz => ({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    title: quiz.title,
    data: quiz,
    isActive: false
  }))
}