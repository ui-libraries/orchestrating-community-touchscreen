/**
 * Quiz Data and Scoring Logic
 * Orchestrating Community - Interactive Concert Quiz
 * 
 * Scoring System:
 * Each answer awards points (1-4) to each result type based on weighted preferences.
 * Higher score = stronger match to that concert type.
 */

const RESULT_TYPES = {
    PATRIOTIC: 'patriotic',
    POPS: 'pops',
    CHAMBER: 'chamber',
    GRAND: 'grand',
    UNKNOWN: 'unknown'
};

/**
 * Result definitions with descriptions and metadata
 */
const RESULTS = {
    [RESULT_TYPES.PATRIOTIC]: {
        id: RESULT_TYPES.PATRIOTIC,
        title: "A Patriotic Salute Concert",
        shortTitle: "Patriotic Salute",
        description: "Sousa marches, an Armed Forces salute medley, and fireworks at the close make for a rousing evening of music. You and your fellow concertgoers are rockin' the red, white, and blue, ready to stand with hand over heart during \"The Star-Spangled Banner,\" sung by a local choir teacher.",
        icon: "🎺",
        color: "#c41e3a", // Deep red
        accentColor: "#002868", // Navy blue
        // Placeholder for James Dixon image
        image: null
    },
    [RESULT_TYPES.POPS]: {
        id: RESULT_TYPES.POPS,
        title: "A Seasonal Pops Concert",
        shortTitle: "Seasonal Pops",
        description: "The show begins with familiar movie themes and peppers in some classical music that featured in a Looney Tunes cartoon. You await with anticipation your favorite John Williams melody, and munch on complimentary popcorn. The audience is mostly families and people young-at-heart, enjoying the soaring sounds of the orchestra in a lighter atmosphere.",
        icon: "🍿",
        color: "#e07c24", // Warm orange
        accentColor: "#8b5a2b", // Brown
        image: null
    },
    [RESULT_TYPES.CHAMBER]: {
        id: RESULT_TYPES.CHAMBER,
        title: "A Chatty Chamber Concert",
        shortTitle: "Chatty Chamber",
        description: "There's a trio playing that you saw on NPR's Tiny Desk series three months ago, and you're hoping they'll repeat your favorite piece from that set. The setting is a small festival, and the stage is in the woods—you're glad you remembered the bug spray. You settle back in your camp chair and enjoy the sounds of the strings and winds hovering in the summer air.",
        icon: "🌲",
        color: "#2d5a27", // Forest green
        accentColor: "#8fbc8f", // Sage
        image: null
    },
    [RESULT_TYPES.GRAND]: {
        id: RESULT_TYPES.GRAND,
        title: "A Seriously Grand Orchestra Concert",
        shortTitle: "Seriously Grand",
        description: "If there isn't extra brass, lots of percussion, and probably a chorus on stage, then you'll wait until next year. You've heard Carmina Burana live five times, and you're only three symphonies short of the entire Mahler cycle. You've splurged for tickets in your preferred place in the dark, cavernous concert hall, and when tuning starts, you close your eyes and wait for the conductor to signal the first note.",
        icon: "🎭",
        color: "#1a1a2e", // Deep navy
        accentColor: "#c9a227", // Gold
        image: null
    },
    [RESULT_TYPES.UNKNOWN]: {
        id: RESULT_TYPES.UNKNOWN,
        title: "A Great Unknown Concert",
        shortTitle: "The Great Unknown",
        description: "Like Austin, Texas, you keep it weird. You like it when someone incorporates a household appliance as an instrument (wow, you didn't know it could make that noise), and pianos should only be prepared. The last concert you attended featured Danger Music #17, performed by three kids in harem pants screaming as loudly as possible for five minutes. Simply divine.",
        icon: "🔮",
        color: "#4a0e4e", // Deep purple
        accentColor: "#ff6b6b", // Coral
        image: null
    }
};

/**
 * Quiz questions with answers and scoring weights
 * 
 * Each answer has a 'scores' object mapping result types to point values (1-4)
 * 4 = strongest match, 1 = weakest match
 */
const QUESTIONS = [
    {
        id: 'section',
        question: "Pick a section of the orchestra",
        answers: [
            {
                id: 'strings',
                text: "Strings",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 1,
                    [RESULT_TYPES.POPS]: 1,
                    [RESULT_TYPES.CHAMBER]: 4,
                    [RESULT_TYPES.GRAND]: 4,
                    [RESULT_TYPES.UNKNOWN]: 3
                }
            },
            {
                id: 'brass',
                text: "Brass",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 4,
                    [RESULT_TYPES.POPS]: 3,
                    [RESULT_TYPES.CHAMBER]: 2,
                    [RESULT_TYPES.GRAND]: 3,
                    [RESULT_TYPES.UNKNOWN]: 2
                }
            },
            {
                id: 'woodwinds',
                text: "Woodwinds",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 2,
                    [RESULT_TYPES.POPS]: 4,
                    [RESULT_TYPES.CHAMBER]: 3,
                    [RESULT_TYPES.GRAND]: 2,
                    [RESULT_TYPES.UNKNOWN]: 1
                }
            },
            {
                id: 'percussion',
                text: "Percussion",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 3,
                    [RESULT_TYPES.POPS]: 2,
                    [RESULT_TYPES.CHAMBER]: 1,
                    [RESULT_TYPES.GRAND]: 1,
                    [RESULT_TYPES.UNKNOWN]: 4
                }
            }
        ]
    },
    {
        id: 'mood',
        question: "Pick a composer mood",
        answers: [
            {
                id: 'beethoven',
                text: "Soul-stirring Beethoven",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 4,
                    [RESULT_TYPES.POPS]: 3,
                    [RESULT_TYPES.CHAMBER]: 2,
                    [RESULT_TYPES.GRAND]: 3,
                    [RESULT_TYPES.UNKNOWN]: 1
                }
            },
            {
                id: 'mozart',
                text: "Manic Mozart",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 2,
                    [RESULT_TYPES.POPS]: 4,
                    [RESULT_TYPES.CHAMBER]: 4,
                    [RESULT_TYPES.GRAND]: 1,
                    [RESULT_TYPES.UNKNOWN]: 2
                }
            },
            {
                id: 'mahler',
                text: "Somber Mahler",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 3,
                    [RESULT_TYPES.POPS]: 2,
                    [RESULT_TYPES.CHAMBER]: 1,
                    [RESULT_TYPES.GRAND]: 4,
                    [RESULT_TYPES.UNKNOWN]: 3
                }
            },
            {
                id: 'wuorinen',
                text: "Happy Kitty Wuorinen",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 1,
                    [RESULT_TYPES.POPS]: 1,
                    [RESULT_TYPES.CHAMBER]: 3,
                    [RESULT_TYPES.GRAND]: 2,
                    [RESULT_TYPES.UNKNOWN]: 4
                }
            }
        ]
    },
    {
        id: 'venue',
        question: "Pick a concert venue",
        answers: [
            {
                id: 'hall',
                text: "Dark Haunted concert hall",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 2,
                    [RESULT_TYPES.POPS]: 1,
                    [RESULT_TYPES.CHAMBER]: 3,
                    [RESULT_TYPES.GRAND]: 4,
                    [RESULT_TYPES.UNKNOWN]: 3
                }
            },
            {
                id: 'bandshell',
                text: "Midwest park band shell",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 4,
                    [RESULT_TYPES.POPS]: 4,
                    [RESULT_TYPES.CHAMBER]: 1,
                    [RESULT_TYPES.GRAND]: 2,
                    [RESULT_TYPES.UNKNOWN]: 2
                }
            },
            {
                id: 'cafetorium',
                text: "High School Cafetorium",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 3,
                    [RESULT_TYPES.POPS]: 3,
                    [RESULT_TYPES.CHAMBER]: 2,
                    [RESULT_TYPES.GRAND]: 1,
                    [RESULT_TYPES.UNKNOWN]: 1
                }
            },
            {
                id: 'woods',
                text: "Woodsey Musical Retreat",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 1,
                    [RESULT_TYPES.POPS]: 2,
                    [RESULT_TYPES.CHAMBER]: 4,
                    [RESULT_TYPES.GRAND]: 3,
                    [RESULT_TYPES.UNKNOWN]: 4
                }
            }
        ]
    },
    {
        id: 'occasion',
        question: "Pick an occasion",
        answers: [
            {
                id: 'july4',
                text: "Fourth of July",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 4,
                    [RESULT_TYPES.POPS]: 2,
                    [RESULT_TYPES.CHAMBER]: 1,
                    [RESULT_TYPES.GRAND]: 2,
                    [RESULT_TYPES.UNKNOWN]: 1
                }
            },
            {
                id: 'soloist',
                text: "Famous soloist",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 2,
                    [RESULT_TYPES.POPS]: 3,
                    [RESULT_TYPES.CHAMBER]: 3,
                    [RESULT_TYPES.GRAND]: 4,
                    [RESULT_TYPES.UNKNOWN]: 2
                }
            },
            {
                id: 'premiere',
                text: "Premiere new work",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 1,
                    [RESULT_TYPES.POPS]: 1,
                    [RESULT_TYPES.CHAMBER]: 4,
                    [RESULT_TYPES.GRAND]: 3,
                    [RESULT_TYPES.UNKNOWN]: 4
                }
            },
            {
                id: 'cabaret',
                text: "Cabaret",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 3,
                    [RESULT_TYPES.POPS]: 4,
                    [RESULT_TYPES.CHAMBER]: 2,
                    [RESULT_TYPES.GRAND]: 1,
                    [RESULT_TYPES.UNKNOWN]: 3
                }
            }
        ]
    },
    {
        id: 'outfit',
        question: "Pick an outfit",
        answers: [
            {
                id: 'stripes',
                text: "Stars and Stripes Forever",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 4,
                    [RESULT_TYPES.POPS]: 2,
                    [RESULT_TYPES.CHAMBER]: 1,
                    [RESULT_TYPES.GRAND]: 2,
                    [RESULT_TYPES.UNKNOWN]: 1
                }
            },
            {
                id: 'tux',
                text: "Tux with tails",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 3,
                    [RESULT_TYPES.POPS]: 3,
                    [RESULT_TYPES.CHAMBER]: 2,
                    [RESULT_TYPES.GRAND]: 4,
                    [RESULT_TYPES.UNKNOWN]: 3
                }
            },
            {
                id: 'glitter',
                text: "Glitter",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 1,
                    [RESULT_TYPES.POPS]: 4,
                    [RESULT_TYPES.CHAMBER]: 4,
                    [RESULT_TYPES.GRAND]: 1,
                    [RESULT_TYPES.UNKNOWN]: 2
                }
            },
            {
                id: 'bohemian',
                text: "Bohemian black",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 2,
                    [RESULT_TYPES.POPS]: 1,
                    [RESULT_TYPES.CHAMBER]: 3,
                    [RESULT_TYPES.GRAND]: 3,
                    [RESULT_TYPES.UNKNOWN]: 4
                }
            }
        ]
    },
    {
        id: 'budget',
        question: "Pick a budget",
        answers: [
            {
                id: 'free',
                text: "Free",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 4,
                    [RESULT_TYPES.POPS]: 1,
                    [RESULT_TYPES.CHAMBER]: 1,
                    [RESULT_TYPES.GRAND]: 1,
                    [RESULT_TYPES.UNKNOWN]: 3
                }
            },
            {
                id: 'economy',
                text: "Economy",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 3,
                    [RESULT_TYPES.POPS]: 4,
                    [RESULT_TYPES.CHAMBER]: 4,
                    [RESULT_TYPES.GRAND]: 2,
                    [RESULT_TYPES.UNKNOWN]: 1
                }
            },
            {
                id: 'firstclass',
                text: "First Class",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 2,
                    [RESULT_TYPES.POPS]: 3,
                    [RESULT_TYPES.CHAMBER]: 3,
                    [RESULT_TYPES.GRAND]: 3,
                    [RESULT_TYPES.UNKNOWN]: 4
                }
            },
            {
                id: 'vip',
                text: "VIP",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 1,
                    [RESULT_TYPES.POPS]: 2,
                    [RESULT_TYPES.CHAMBER]: 2,
                    [RESULT_TYPES.GRAND]: 4,
                    [RESULT_TYPES.UNKNOWN]: 2
                }
            }
        ]
    },
    {
        id: 'plusone',
        question: "Pick a plus one",
        answers: [
            {
                id: 'grandparent',
                text: "Grandma or Grandpa",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 4,
                    [RESULT_TYPES.POPS]: 3,
                    [RESULT_TYPES.CHAMBER]: 2,
                    [RESULT_TYPES.GRAND]: 4,
                    [RESULT_TYPES.UNKNOWN]: 1
                }
            },
            {
                id: 'bestie',
                text: "Bestie",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 1,
                    [RESULT_TYPES.POPS]: 2,
                    [RESULT_TYPES.CHAMBER]: 4,
                    [RESULT_TYPES.GRAND]: 3,
                    [RESULT_TYPES.UNKNOWN]: 3
                }
            },
            {
                id: 'child',
                text: "Son or Daughter",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 3,
                    [RESULT_TYPES.POPS]: 4,
                    [RESULT_TYPES.CHAMBER]: 3,
                    [RESULT_TYPES.GRAND]: 1,
                    [RESULT_TYPES.UNKNOWN]: 2
                }
            },
            {
                id: 'nemesis',
                text: "Nemesis",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 2,
                    [RESULT_TYPES.POPS]: 1,
                    [RESULT_TYPES.CHAMBER]: 1,
                    [RESULT_TYPES.GRAND]: 2,
                    [RESULT_TYPES.UNKNOWN]: 4
                }
            }
        ]
    },
    {
        id: 'conductor',
        question: "Pick a conductor",
        answers: [
            {
                id: 'hair',
                text: "Glorious hair",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 3,
                    [RESULT_TYPES.POPS]: 3,
                    [RESULT_TYPES.CHAMBER]: 3,
                    [RESULT_TYPES.GRAND]: 2,
                    [RESULT_TYPES.UNKNOWN]: 3
                }
            },
            {
                id: 'general',
                text: "Field General",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 4,
                    [RESULT_TYPES.POPS]: 2,
                    [RESULT_TYPES.CHAMBER]: 1,
                    [RESULT_TYPES.GRAND]: 4,
                    [RESULT_TYPES.UNKNOWN]: 1
                }
            },
            {
                id: 'auteur',
                text: "Auteur",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 1,
                    [RESULT_TYPES.POPS]: 1,
                    [RESULT_TYPES.CHAMBER]: 4,
                    [RESULT_TYPES.GRAND]: 1,
                    [RESULT_TYPES.UNKNOWN]: 4
                }
            },
            {
                id: 'rizz',
                text: "Rizz",
                scores: {
                    [RESULT_TYPES.PATRIOTIC]: 2,
                    [RESULT_TYPES.POPS]: 4,
                    [RESULT_TYPES.CHAMBER]: 2,
                    [RESULT_TYPES.GRAND]: 3,
                    [RESULT_TYPES.UNKNOWN]: 2
                }
            }
        ]
    }
];

/**
 * Calculate quiz results based on user answers
 * @param {Array} userAnswers - Array of answer objects with question id and answer id
 * @returns {Object} - Result object with scores and winner
 */
function calculateResult(userAnswers) {
    // Initialize scores
    const scores = {
        [RESULT_TYPES.PATRIOTIC]: 0,
        [RESULT_TYPES.POPS]: 0,
        [RESULT_TYPES.CHAMBER]: 0,
        [RESULT_TYPES.GRAND]: 0,
        [RESULT_TYPES.UNKNOWN]: 0
    };

    // Tally scores from each answer
    userAnswers.forEach(userAnswer => {
        const question = QUESTIONS.find(q => q.id === userAnswer.questionId);
        if (question) {
            const answer = question.answers.find(a => a.id === userAnswer.answerId);
            if (answer) {
                Object.keys(answer.scores).forEach(resultType => {
                    scores[resultType] += answer.scores[resultType];
                });
            }
        }
    });

    // Find the winner (highest score)
    let maxScore = 0;
    let winner = RESULT_TYPES.POPS; // Default fallback
    
    Object.keys(scores).forEach(resultType => {
        if (scores[resultType] > maxScore) {
            maxScore = scores[resultType];
            winner = resultType;
        }
    });

    return {
        scores,
        maxScore,
        winner,
        result: RESULTS[winner]
    };
}

// Export for use in app.js
window.QuizData = {
    RESULT_TYPES,
    RESULTS,
    QUESTIONS,
    calculateResult
};
