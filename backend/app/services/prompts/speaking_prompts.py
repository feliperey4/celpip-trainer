"""
Speaking Task Prompts for CELPIP

This module contains prompts for generating CELPIP speaking tasks.
"""

import random
from typing import List


class SpeakingTaskTopics:
    """Topics and scenarios for CELPIP speaking tasks."""
    
    TASK1_ADVICE_SCENARIOS = [
        "A friend wants to start a new hobby but can't decide between painting and photography",
        "A colleague is considering changing careers but is worried about job security",
        "A family member wants to adopt a pet but lives in a small apartment",
        "A neighbor is planning to renovate their house but has a limited budget",
        "A friend is thinking about moving to a new city but doesn't know anyone there",
        "A classmate wants to improve their English but struggles with speaking practice",
        "A coworker is considering taking a part-time job while studying",
        "A friend wants to learn to cook but has never cooked before",
        "A relative is planning a family vacation but can't decide on the destination",
        "A neighbor wants to start exercising but has a busy schedule",
        "A friend is thinking about buying their first car but has no experience",
        "A colleague wants to improve their work-life balance",
        "A family member is considering taking online courses to upgrade their skills",
        "A friend wants to organize a surprise party but needs help with planning",
        "A neighbor is thinking about starting a small garden in their backyard",
        "A classmate wants to join a club or organization but is shy",
        "A coworker is considering volunteering but doesn't know where to start",
        "A friend wants to save money for a big purchase but struggles with budgeting",
        "A relative is planning to redecorate their living room",
        "A neighbor wants to learn a new language but doesn't know the best approach"
    ]
    
    PERSON_DESCRIPTIONS = [
        "A close friend who values your opinion",
        "A university classmate who trusts your judgment",
        "A work colleague who respects your experience",
        "A family member who often asks for your advice",
        "A neighbor who has become a good friend",
        "A study partner who knows you well",
        "A former coworker who stayed in touch",
        "A community member who knows your background",
        "A friend from your hobby group",
        "A person you mentor or help regularly"
    ]
    
    ADVICE_CONTEXTS = [
        "personal development",
        "career advancement",
        "lifestyle changes",
        "financial planning",
        "health and wellness",
        "education and learning",
        "relationships and social life",
        "hobbies and interests",
        "home and living",
        "work-life balance"
    ]
    
    TASK2_EXPERIENCE_TOPICS = [
        "a special place you went to as a child",
        "a time when you had to suddenly change a plan",
        "a time when you interacted with an animal",
        "a book you've read recently",
        "a trip you took recently",
        "a time when you lost something important",
        "a memorable birthday celebration",
        "a special event in your life",
        "a journey that was particularly tough or challenging",
        "a holiday that is most special to you",
        "a time when you gave someone a surprise",
        "a time when you learned something new",
        "a person who influenced your life",
        "a difficult decision you had to make",
        "a moment when you felt proud of yourself",
        "a cultural tradition that is important to you",
        "a time when you helped someone",
        "an experience that changed your perspective",
        "a childhood memory that stands out",
        "a time when you overcame a fear"
    ]
    
    EXPERIENCE_TYPES = [
        "Travel and exploration",
        "Education and learning",
        "Career and work",
        "Family and relationships",
        "Personal achievement",
        "Cultural experience",
        "Challenge and growth",
        "Community involvement",
        "Creative expression",
        "Health and wellness"
    ]
    
    TASK3_SCENE_TYPES = [
        "Outdoor public space",
        "Indoor workplace",
        "Social gathering",
        "Educational setting",
        "Recreation area",
        "Transportation hub",
        "Commercial establishment",
        "Community event",
        "Healthcare facility",
        "Cultural venue",
        "Residential area",
        "Natural environment",
        "Sports facility",
        "Entertainment venue",
        "Government building",
        "Religious building",
        "Market or shopping area",
        "Restaurant or cafe",
        "Library or study space",
        "Emergency situation"
    ]
    
    TASK3_SCENE_SETTINGS = [
        "Park on a sunny weekend afternoon",
        "Busy office during working hours",
        "Family celebration or party",
        "University campus during class time",
        "Swimming pool or beach area",
        "Airport terminal or train station",
        "Grocery store or supermarket",
        "Community festival or fair",
        "Hospital waiting room",
        "Museum or art gallery",
        "Suburban neighborhood street",
        "Forest hiking trail",
        "Gym or fitness center",
        "Movie theater lobby",
        "City hall or courthouse",
        "Church or community center",
        "Farmers market or bazaar",
        "Coffee shop during peak hours",
        "Public library reading area",
        "Fire drill or safety demonstration"
    ]
    
    # Task 4 specific scenarios (predictions based on Task 3 scenes)
    TASK4_PREDICTION_SCENARIOS = [
        "Elementary school classroom during math lesson",
        "Community park playground on Saturday morning",
        "Downtown street market during lunch hour",
        "Hospital emergency room waiting area",
        "University student center during exam period",
        "Shopping mall food court during weekend",
        "Public library children's section during story time",
        "Office meeting room during team presentation",
        "Restaurant kitchen during dinner rush",
        "Airport departure gate before boarding",
        "Beach volleyball court during tournament",
        "City bus stop during morning commute",
        "Grocery store checkout line during peak hours",
        "Community center during senior activities",
        "Construction site during work hours",
        "Sports stadium before game starts",
        "Wedding reception during cake cutting",
        "School cafeteria during lunch break",
        "Pet store during adoption event",
        "Fire station during emergency call"
    ]
    
    TASK4_PREDICTION_ELEMENTS = [
        "people's actions and movements",
        "upcoming events or activities",
        "environmental changes",
        "social interactions",
        "completed tasks or projects",
        "potential problems or challenges",
        "emotional reactions",
        "time-based changes",
        "cause and effect relationships",
        "behavioral patterns"
    ]
    
    TASK8_UNUSUAL_SITUATIONS = [
        "A person wearing winter coat and scarf on a hot beach day",
        "Someone reading a book upside down in a library",
        "A businessman in a suit riding a children's tricycle to work",
        "A chef cooking food on a barbecue grill in a snowstorm",
        "People having a picnic inside a car during sunny weather",
        "A person walking their pet fish in a bowl on a leash",
        "Someone wearing swimwear while shopping in a grocery store",
        "A student taking notes with a giant oversized pencil",
        "People playing beach volleyball in formal evening wear",
        "A person brushing their teeth with a toilet brush",
        "Someone using an umbrella indoors on a clear day",
        "A family having dinner while standing on their heads",
        "A person wearing multiple pairs of sunglasses at once",
        "Someone trying to fit a large couch through a tiny door",
        "A person painting a wall with a toothbrush instead of a brush",
        "Children playing with toys that are much too big for them",
        "Someone watering plants with a coffee cup instead of a watering can",
        "A person wearing shoes on their hands and gloves on their feet",
        "Someone trying to eat soup with a fork at a restaurant",
        "A person carrying a ladder to climb a very small step"
    ]
    
    TASK8_UNUSUAL_CONTEXTS = [
        "Urban street scene during daytime",
        "Indoor office environment",
        "Public park or recreation area",
        "Shopping mall or commercial space",
        "Residential neighborhood",
        "Beach or waterfront location",
        "School or educational facility",
        "Restaurant or dining establishment",
        "Sports facility or gymnasium",
        "Airport or transportation hub",
        "Hospital or medical facility",
        "Library or study space",
        "Construction site or work area",
        "Market or shopping area",
        "Community center or public building"
    ]
    
    TASK7_OPINION_TOPICS = [
        "Children should not be allowed to use smartphones until they are 16 years old",
        "All employees should be required to work from home at least two days per week",
        "Public transportation should be completely free for all citizens",
        "Social media companies should be responsible for fact-checking all content",
        "University education should be free for all students",
        "People should be required to retire at age 65",
        "Fast food restaurants should be banned from advertising to children",
        "All plastic bags should be banned from stores",
        "Professional athletes are paid too much money",
        "Online shopping is better than shopping in physical stores",
        "People should be required to vote in all elections",
        "Traditional books are better than e-books",
        "All public places should be smoke-free",
        "People should be allowed to work a four-day work week",
        "All students should be required to learn a second language",
        "Homework should be banned for elementary school students",
        "All cars should be electric by 2030",
        "People should not be allowed to own exotic pets",
        "All restaurants should be required to display calorie information",
        "Social media has more negative effects than positive effects on society"
    ]
    
    TASK7_CONTEXT_TYPES = [
        "social policy debate",
        "workplace policy discussion",
        "educational policy consideration",
        "environmental policy debate",
        "technology regulation discussion",
        "health policy consideration",
        "consumer protection debate",
        "transportation policy discussion",
        "media regulation consideration",
        "community policy debate",
        "economic policy discussion",
        "safety regulation consideration",
        "cultural policy debate",
        "lifestyle policy discussion",
        "business regulation consideration"
    ]
    
    TASK6_DIFFICULT_SITUATIONS = [
        "Your friend borrowed your car and got into an accident, now insurance won't cover the damage",
        "Two close friends are having a conflict and both expect you to take their side",
        "Your neighbor's dog keeps barking at night but they're elderly and the dog is their only companion",
        "You promised to help with two different events happening at the same time",
        "Your roommate's boyfriend/girlfriend stays over too often without contributing to expenses",
        "A family member asks you to lie to their spouse about their spending habits",
        "Your colleague takes credit for your work but confronting them might hurt team dynamics",
        "You accidentally damaged something expensive at a friend's house during a party",
        "Your sibling wants to borrow money but hasn't paid back previous loans",
        "A friend asks you to be a reference for a job but you know they're not qualified",
        "Your landlord wants to increase rent but you can't afford it and moving is difficult",
        "You found out a friend's partner is cheating but don't know if you should tell them",
        "Your boss assigns you work that should be done by a higher-paid colleague",
        "A family gathering conflicts with an important work commitment",
        "Your friend's lifestyle choices are affecting their health but they get defensive when you try to help",
        "You need to cancel vacation plans with friends due to a family emergency",
        "Your study partner for an important exam isn't pulling their weight",
        "A relative wants to stay at your place but you need privacy for an important project",
        "Your friend asks you to babysit but their child is very difficult to manage",
        "You received two wedding invitations for the same weekend from close friends"
    ]
    
    TASK6_RELATIONSHIP_CONTEXTS = [
        "close family members",
        "longtime friends",
        "work colleagues",
        "romantic partners",
        "roommates or housemates",
        "neighbors in community",
        "classmates or study partners",
        "extended family relatives",
        "professional acquaintances",
        "community group members",
        "childhood friends",
        "new acquaintances",
        "mentor-mentee relationships",
        "landlord-tenant situations",
        "team or group project members"
    ]
    
    # Task 5 specific scenarios (Comparing and Persuading)
    TASK5_COMPARISON_SCENARIOS = [
        "Choosing between two houses to buy",
        "Selecting between two cars to purchase",
        "Deciding between two vacation destinations",
        "Choosing between two job offers",
        "Selecting between two smartphones",
        "Deciding between two universities",
        "Choosing between two apartments to rent",
        "Selecting between two laptops for work",
        "Deciding between two restaurants for dinner",
        "Choosing between two gym memberships",
        "Selecting between two childcare centers",
        "Deciding between two investment options",
        "Choosing between two insurance plans",
        "Selecting between two wedding venues",
        "Deciding between two computer chairs",
        "Choosing between two kitchen appliances",
        "Selecting between two television models",
        "Deciding between two camping sites",
        "Choosing between two office spaces",
        "Selecting between two bicycle models"
    ]
    
    TASK5_DECISION_MAKERS = [
        "family member",
        "spouse or partner",
        "friend",
        "colleague",
        "business partner",
        "roommate",
        "sibling",
        "parent",
        "boss or supervisor",
        "team member",
        "neighbor",
        "study partner",
        "travel companion",
        "investment advisor",
        "committee member"
    ]
    
    TASK5_CATEGORIES = [
        "Real Estate",
        "Automotive",
        "Technology",
        "Education",
        "Travel",
        "Employment",
        "Entertainment",
        "Health & Fitness",
        "Food & Dining",
        "Home & Garden",
        "Finance",
        "Services",
        "Sports & Recreation",
        "Shopping",
        "Business"
    ]


class SpeakingTaskPrompts:
    """Prompts for generating CELPIP speaking tasks."""
    
    @staticmethod
    def create_task1_prompt(scenario: str, person_description: str, advice_context: str) -> str:
        """Create a prompt for CELPIP Speaking Task 1 (Giving Advice)."""
        return f"""
Generate a realistic CELPIP Speaking Task 1 (Giving Advice) in JSON format.

SCENARIO: {scenario}
PERSON: {person_description}
CONTEXT: {advice_context}

TASK REQUIREMENTS:
- Task Type: Giving Advice
- Preparation Time: 30 seconds
- Speaking Time: 90 seconds
- Canadian English context
- Age-appropriate and culturally sensitive
- Realistic everyday situation
- Use common Canadian names
- The situation must have 50 - 55 words

RESPONSE FORMAT (JSON):
{{
  "task_id": "unique_task_id",
  "task_type": "giving_advice",
  "scenario": {{
    "scenario_id": "unique_scenario_id",
    "title": "brief_title_of_scenario",
    "situation": "detailed_description_of_situation_requiring_advice",
    "context": "background_information_and_setting",
    "person_description": "description_of_person_asking_for_advice",
    "advice_topic": "main_topic_category",
    "image_description": "optional_description_of_relevant_image_if_applicable"
  }},
  "instructions": {{
    "preparation_time_seconds": 30,
    "speaking_time_seconds": 90,
    "task_description": "clear_description_of_what_test_taker_should_do",
    "evaluation_criteria": [
      "Content and ideas",
      "Vocabulary",
      "Language use",
      "Task fulfillment"
    ],
    "tips": [
      "tip1_for_success",
      "tip2_for_success",
      "tip3_for_success"
    ]
  }},
  "difficulty_level": "intermediate",
  "estimated_duration_minutes": 3
}}

CONTENT GUIDELINES:
1. Create a realistic Canadian scenario that requires thoughtful advice
2. The situation should be relatable to test-takers of various backgrounds
3. Include specific details that make the scenario authentic
4. The advice needed should allow for personal opinion and experience
5. Keep language clear and appropriate for intermediate-level speakers
6. Include an image description if it would enhance the scenario

EVALUATION FOCUS:
- Content: Relevance, depth, and helpfulness of advice
- Vocabulary: Appropriate word choice and variety
- Language use: Grammar, sentence structure, and fluency
- Task fulfillment: Addressing the specific advice request

Provide realistic, engaging content that reflects authentic Canadian situations and cultural context.
"""

    @staticmethod
    def create_image_generation_prompt(scenario_description: str, context: str) -> str:
        """Create a prompt for generating images for speaking tasks."""
        return f"""
Create a realistic image for a CELPIP Speaking Task scenario.

SCENARIO: {scenario_description}
CONTEXT: {context}

IMAGE REQUIREMENTS:
- Professional, clean, and educational style
- Culturally appropriate for Canadian context
- Clear and easy to understand
- Supportive of the speaking task scenario
- No text or words in the image
- Appropriate for all ages and backgrounds

STYLE GUIDELINES:
- Realistic but not overly detailed
- Warm and approachable tone
- Good lighting and composition
- Neutral colors that don't distract
- Focus on the main elements of the scenario

Generate an image that helps test-takers visualize the situation and provides context for giving advice.
"""

    @staticmethod
    def create_speech_evaluation_prompt(transcript: str, task_scenario: str, task_instructions: str, timing_info: str = "") -> str:
        """Create a prompt for evaluating speech responses."""
        return f"""
Evaluate this CELPIP Speaking Task 1 response according to official CELPIP criteria.

TASK SCENARIO: {task_scenario}

TASK INSTRUCTIONS: {task_instructions}

TIMING INFORMATION: {timing_info}

TRANSCRIPT: {transcript}

EVALUATION CRITERIA (1-12 scale for each):

1. CONTENT (1-12):
   - Relevance to the task
   - Depth and quality of advice
   - Appropriateness of suggestions
   - Personal insight and experience

2. VOCABULARY (1-12):
   - Range and variety of vocabulary
   - Appropriateness of word choice
   - Precision and effectiveness
   - Idiomatic expressions

3. LANGUAGE USE (1-12):
   - Grammar accuracy
   - Sentence structure variety
   - Fluency and coherence
   - Pronunciation clarity

4. TASK FULFILLMENT (1-12):
   - Addressing the specific advice request
   - Completeness of response
   - Organization and structure
   - Time management

RESPONSE FORMAT (JSON):
{{
  "scores": {{
    "content_score": 0.0,
    "vocabulary_score": 0.0,
    "language_use_score": 0.0,
    "task_fulfillment_score": 0.0,
    "overall_score": 0.0
  }},
  "feedback": {{
    "strengths": [
      "specific_strength_1",
      "specific_strength_2",
      "specific_strength_3"
    ],
    "improvements": [
      "specific_improvement_1",
      "specific_improvement_2",
      "specific_improvement_3"
    ],
    "specific_suggestions": [
      "actionable_suggestion_1",
      "actionable_suggestion_2",
      "actionable_suggestion_3"
    ],
    "pronunciation_notes": "specific_notes_about_pronunciation_if_applicable",
    "fluency_notes": "specific_notes_about_fluency_and_pacing"
  }},
  "confidence_level": 0.85
}}

EVALUATION GUIDELINES:
- Be fair and constructive
- Provide specific, actionable feedback
- Consider the intermediate level of CELPIP test-takers
- Focus on communication effectiveness
- Balance criticism with encouragement
- Reference specific examples from the transcript
"""

    @staticmethod
    def create_task2_prompt(experience_topic: str, experience_type: str) -> str:
        """Create a prompt for CELPIP Speaking Task 2 (Talking about Personal Experience)."""
        return f"""
Generate a realistic CELPIP Speaking Task 2 (Talking about Personal Experience) in JSON format following the official CELPIP format.

TOPIC: {experience_topic}
EXPERIENCE TYPE: {experience_type}

OFFICIAL TASK REQUIREMENTS:
- Task Type: Talking about Personal Experience
- Preparation Time: 30 seconds (to brainstorm and take notes)
- Speaking Time: 60 seconds (shorter than Task 1)
- Past tense dominance (describing past experiences)
- Address the 5 W's: Who, What, When, Where, Why
- Canadian English context and cultural appropriateness

OFFICIAL QUESTION FORMAT (3-part structure):
1. Main topic introduction: "Talk about [experience topic]..."
2. Example suggestions: "You could talk about [specific examples]..."
3. Specific aspects to address: "Describe [what], explain [why], and mention [specific details]"

RESPONSE FORMAT (JSON):
{{
  "task_id": "unique_task_id",
  "task_type": "talking_about_personal_experience",
  "scenario": {{
    "scenario_id": "unique_scenario_id",
    "title": "Talk about [brief title of the experience type]",
    "topic": "Main instruction following format: Talk about [experience topic]. You could talk about [example 1], [example 2], [example 3], or [example 4]. [Specific instruction 1], [specific instruction 2], and [specific instruction 3].",
    "context": "Brief context about this type of personal experience and why it's meaningful to share",
    "experience_type": "category_of_experience",
    "guiding_questions": [
      "First specific aspect test-taker must address",
      "Second specific aspect test-taker must address", 
      "Third specific aspect test-taker must address"
    ],
    "image_description": "optional_description_if_applicable"
  }},
  "instructions": {{
    "preparation_time_seconds": 30,
    "speaking_time_seconds": 60,
    "task_description": "Talk about a personal experience from your past. Use the 30 seconds to brainstorm and take notes. Address all the specific aspects mentioned in the question within 60 seconds.",
    "evaluation_criteria": [
      "Content/Coherence: Organized and coherent personal experience",
      "Vocabulary: Appropriate and relevant vocabulary for the topic",
      "Listenability: Pronunciation, intonation, and natural speech patterns",
      "Task Fulfillment: Complete answer addressing all question parts within 60 seconds"
    ],
    "tips": [
      "Use past tense since you're describing past experiences",
      "Address the 5 W's: Who, What, When, Where, Why (aim for at least 3)",
      "Take notes during the 30-second preparation time",
      "Be specific and give details to make your story memorable",
      "Use the full 60 seconds and include a proper conclusion",
      "It's okay to be creative - invent details if needed for a complete story"
    ]
  }},
  "difficulty_level": "intermediate",
  "estimated_duration_minutes": 2
}}

CONTENT GUIDELINES (Based on Official Format):
1. Follow the 3-part question structure exactly as in official CELPIP tests
2. **title**: Short description like "Talk about a special place from childhood"
3. **topic**: Full question with all 3 parts - main topic + examples + specific instructions
4. Include 4 specific examples in the "You could talk about..." section
5. End with 3 clear instructions about what aspects to address
6. Focus on universal experiences that test-takers can relate to or adapt
7. Ensure the experience can be told effectively in 60 seconds
8. Use authentic Canadian English and cultural references where appropriate

OFFICIAL SAMPLE STRUCTURE EXAMPLES:
- "Talk about a special place you went to as a child. You could talk about an amusement park, a festival, a beach, or a park. Describe the place, say who you went there with, and mention why it was so memorable."
- "Talk about a time when you had to suddenly change a plan. You could talk about a travel arrangement, a plan for a special event, or a job-related plan. What were you originally planning, why did you have to change it, and how did everything turn out in the end?"

EVALUATION FOCUS (Official CELPIP Criteria):
- Content/Coherence: Personal experience organized in appropriate chronological order
- Vocabulary: Range and appropriateness of vocabulary for describing past experiences
- Listenability: Clear pronunciation, natural intonation, and speech flow
- Task Fulfillment: Complete response addressing all question parts within time limit

Generate authentic CELPIP-style questions that allow test-takers to share meaningful personal experiences while demonstrating their English speaking abilities.
"""

    @staticmethod
    def create_task2_evaluation_prompt(transcript: str, task_scenario: str, task_instructions: str, timing_info: str = "") -> str:
        """Create a prompt for evaluating Speaking Task 2 responses."""
        return f"""
Evaluate this CELPIP Speaking Task 2 response according to official CELPIP criteria.

TASK SCENARIO: {task_scenario}

TASK INSTRUCTIONS: {task_instructions}

TIMING INFORMATION: {timing_info}

TRANSCRIPT: {transcript}

EVALUATION CRITERIA (1-12 scale for each):

1. CONTENT (1-12):
   - Personal experience details and depth
   - Relevance to the topic
   - Engaging and meaningful story
   - Completeness of narrative

2. VOCABULARY (1-12):
   - Range and variety of vocabulary
   - Descriptive and narrative language
   - Appropriateness of word choice
   - Precision and effectiveness

3. LANGUAGE USE (1-12):
   - Grammar accuracy
   - Sentence structure variety
   - Narrative flow and coherence
   - Pronunciation clarity

4. TASK FULFILLMENT (1-12):
   - Telling a complete personal story
   - Addressing the specific topic
   - Organization and chronological structure
   - Time management and completeness

RESPONSE FORMAT (JSON):
{{
  "scores": {{
    "content_score": 0.0,
    "vocabulary_score": 0.0,
    "language_use_score": 0.0,
    "task_fulfillment_score": 0.0,
    "overall_score": 0.0
  }},
  "feedback": {{
    "strengths": [
      "specific_strength_1",
      "specific_strength_2", 
      "specific_strength_3"
    ],
    "improvements": [
      "specific_improvement_1",
      "specific_improvement_2",
      "specific_improvement_3"
    ],
    "specific_suggestions": [
      "actionable_suggestion_1",
      "actionable_suggestion_2",
      "actionable_suggestion_3"
    ],
    "pronunciation_notes": "specific_notes_about_pronunciation_if_applicable",
    "fluency_notes": "specific_notes_about_fluency_and_narrative_flow"
  }},
  "confidence_level": 0.85
}}

EVALUATION GUIDELINES:
- Focus on storytelling and personal narrative skills
- Consider the authenticity and engagement of the personal experience
- Evaluate the ability to organize and present a coherent story
- Assess descriptive language and narrative vocabulary
- Be constructive and encouraging about personal sharing
- Reference specific examples from the transcript
"""

    @staticmethod
    def create_task3_prompt(scene_type: str, scene_setting: str) -> str:
        """Create a prompt for CELPIP Speaking Task 3 (Describing a Scene)."""
        return f"""
Generate a realistic CELPIP Speaking Task 3 (Describing a Scene) in JSON format following the official CELPIP format.

SCENE TYPE: {scene_type}
SCENE SETTING: {scene_setting}

OFFICIAL TASK REQUIREMENTS:
- Task Type: Describing a Scene
- Preparation Time: 30 seconds (to observe and take notes)
- Speaking Time: 60 seconds (shorter than Tasks 1 and 2)
- Present tense dominance (describing what you see)
- Address spatial relationships and details (Who, What, Where, Why)
- Canadian English context and cultural appropriateness

OFFICIAL TASK FORMAT:
The test-taker sees an image and must describe it to someone who cannot see it. They should imagine describing the scene over the phone or to a blind person. Focus on general description first, then specific details.

RESPONSE FORMAT (JSON):
{{
  "task_id": "unique_task_id",
  "task_type": "describing_scene",
  "scenario": {{
    "scenario_id": "unique_scenario_id",
    "title": "Describe the scene in the picture",
    "scene_description": "Detailed description of what would be shown in the image - this is the reference for what test-takers should describe",
    "context": "Brief context about this type of scene and why descriptive skills are important",
    "scene_type": "category_of_scene",
    "key_elements": [
      "First key element to describe (people, objects, actions)",
      "Second key element to describe",
      "Third key element to describe",
      "Fourth key element to describe"
    ],
    "spatial_layout": "Description of how elements are positioned relative to each other (foreground, background, left, right, center)",
    "image_description": "optional_technical_description_of_image"
  }},
  "instructions": {{
    "preparation_time_seconds": 30,
    "speaking_time_seconds": 60,
    "task_description": "Describe some things that are happening in the picture as well as you can. The person whom you are speaking to cannot see the picture.",
    "evaluation_criteria": [
      "Content/Coherence: Clear and organized description of the scene",
      "Vocabulary: Appropriate descriptive vocabulary and spatial terms",
      "Listenability: Clear pronunciation and natural speech flow",
      "Task Fulfillment: Complete scene description within 60 seconds"
    ],
    "tips": [
      "Start with a general overview of the scene",
      "Use spatial words like 'in the foreground', 'behind', 'to the left'",
      "Describe what people are doing, wearing, and their expressions",
      "Include details about the setting, weather, and atmosphere",
      "Focus on 3-4 main elements rather than trying to describe everything",
      "Use present tense since you're describing what you see now"
    ]
  }},
  "difficulty_level": "intermediate",
  "estimated_duration_minutes": 2
}}

CONTENT GUIDELINES (Based on Official Format):
1. Create a vivid, realistic scene that test-takers can easily visualize and describe
2. **scene_description**: Detailed reference description of what the image would show
3. Include people engaged in realistic activities appropriate to the setting
4. Ensure good mix of foreground, middle ground, and background elements
5. Include clear spatial relationships that test-takers can describe using directional language
6. Focus on observable details: actions, clothing, expressions, objects, environment
7. Make the scene culturally appropriate for Canadian context
8. Ensure the scene has enough detail for 60 seconds of description but not overwhelming

OFFICIAL SAMPLE STRUCTURE EXAMPLES:
- Outdoor park scene: "This is a picture of a busy park on a weekend. In the foreground, there's a family having a picnic..."
- Office workplace: "This image shows a modern office space. In the center, several people are working at their desks..."
- Community event: "The scene depicts a community festival. In the background, there's a stage with performers..."

EVALUATION FOCUS (Official CELPIP Criteria):
- Content/Coherence: Logical organization from general to specific details
- Vocabulary: Range and accuracy of descriptive and spatial vocabulary
- Listenability: Clear delivery that helps listener visualize the scene
- Task Fulfillment: Comprehensive description addressing key scene elements within time limit

Generate authentic CELPIP-style scene descriptions that test descriptive language skills while being engaging and realistic for Canadian test-takers.
"""

    @staticmethod
    def create_task4_prompt(prediction_scenario: str, prediction_element: str) -> str:
        """Create a prompt for CELPIP Speaking Task 4 (Making Predictions)."""
        return f"""
Generate a realistic CELPIP Speaking Task 4 (Making Predictions) in JSON format following the official CELPIP format.

PREDICTION SCENARIO: {prediction_scenario}
PREDICTION ELEMENT: {prediction_element}

OFFICIAL TASK REQUIREMENTS:
- Task Type: Making Predictions
- Preparation Time: 30 seconds (to analyze scene and think about future possibilities)
- Speaking Time: 60 seconds (shorter than Tasks 1 and 2)
- Future tense dominance (predicting what will happen next)
- Use same picture from Task 3 but predict future outcomes
- Address logical predictions with explanations (Why will this happen?)
- Canadian English context and cultural appropriateness

OFFICIAL TASK FORMAT:
The test-taker looks at the same picture from Task 3 and predicts what will happen next. They should make 2-3 specific predictions about different people or elements in the scene, using future tenses and providing logical explanations. The goal is to demonstrate future tense usage and logical reasoning skills.

RESPONSE FORMAT (JSON):
{{
  "task_id": "unique_task_id",
  "task_type": "making_predictions",
  "scenario": {{
    "scenario_id": "unique_scenario_id",
    "title": "Predict what will happen next in the picture",
    "scene_description": "Detailed description of the current scene that was described in Task 3",
    "context": "Brief context about the setting and current situation",
    "scene_type": "category_of_scene",
    "current_situation": "Description of what is currently happening in the scene",
    "key_characters": [
      "First person or group in the scene",
      "Second person or group in the scene",
      "Third person or group in the scene",
      "Fourth person or group in the scene"
    ],
    "prediction_elements": [
      "First element that suggests future action or change",
      "Second element that indicates upcoming events",
      "Third element that shows potential outcomes",
      "Fourth element that hints at future developments"
    ],
    "possible_outcomes": [
      "First likely prediction with logical reasoning",
      "Second possible prediction with explanation",
      "Third potential prediction with justification",
      "Fourth alternative prediction with reasoning"
    ],
    "image_description": "optional_technical_description_of_image"
  }},
  "instructions": {{
    "preparation_time_seconds": 30,
    "speaking_time_seconds": 60,
    "task_description": "Look at the same picture from the previous task. Now, predict what will happen next. Make 2-3 specific predictions about different people or elements in the scene.",
    "evaluation_criteria": [
      "Content/Coherence: Logical predictions with clear reasoning",
      "Vocabulary: Appropriate future tense vocabulary and prediction language",
      "Listenability: Clear pronunciation and natural speech flow",
      "Task Fulfillment: Complete predictions with explanations within 60 seconds"
    ],
    "tips": [
      "Use future tenses: will, going to, might, may, probably, likely",
      "Make 2-3 specific predictions about different people or elements",
      "Explain WHY you think each prediction will happen",
      "Base predictions on visual clues from the current scene",
      "Use phrases like 'I predict...', 'I think...will happen', 'It's likely that...'",
      "Be creative but logical - predictions should make sense"
    ]
  }},
  "difficulty_level": "intermediate",
  "estimated_duration_minutes": 2
}}

CONTENT GUIDELINES (Based on Official Format):
1. Create a scene with clear current actions that suggest future developments
2. **scene_description**: Detailed description of the current moment frozen in time
3. Include people engaged in activities that have logical next steps
4. Ensure multiple prediction possibilities for different elements
5. Focus on observable details that suggest future outcomes
6. Make predictions testable against logical reasoning
7. Ensure the scene allows for creative but realistic predictions
8. Use authentic Canadian English and cultural references where appropriate

OFFICIAL SAMPLE STRUCTURE EXAMPLES:
- Classroom scene: "I can see students working on math problems. I predict that the boy in the blue shirt will..."
- Park scene: "There's a family having a picnic. I think the children will..."
- Market scene: "The vendor is preparing to close. I believe she will..."

EVALUATION FOCUS (Official CELPIP Criteria):
- Content/Coherence: Logical predictions with clear reasoning and explanations
- Vocabulary: Range and accuracy of future tense and prediction vocabulary
- Listenability: Clear delivery that helps listener understand the predictions
- Task Fulfillment: Complete predictions addressing multiple scene elements within time limit

Generate authentic CELPIP-style prediction scenarios that test future tense usage, logical reasoning, and creative thinking while being engaging and realistic for Canadian test-takers.
"""

    @staticmethod
    def create_task4_evaluation_prompt(transcript: str, task_scenario: str, task_instructions: str, timing_info: str = "") -> str:
        """Create a prompt for evaluating Speaking Task 4 responses."""
        return f"""
Evaluate this CELPIP Speaking Task 4 response according to official CELPIP criteria.

TASK SCENARIO: {task_scenario}

TASK INSTRUCTIONS: {task_instructions}

TIMING INFORMATION: {timing_info}

TRANSCRIPT: {transcript}

EVALUATION CRITERIA (1-12 scale for each):

1. CONTENT (1-12):
   - Logical and realistic predictions made
   - Clear reasoning and explanations provided
   - Creativity balanced with plausibility
   - Appropriate number of predictions for time limit

2. VOCABULARY (1-12):
   - Range and accuracy of future tense vocabulary
   - Use of prediction and speculation language
   - Appropriate expressions for uncertainty and probability
   - Precision in describing future scenarios

3. LANGUAGE USE (1-12):
   - Grammar accuracy in future tense constructions
   - Sentence structure variety
   - Natural flow and coherence
   - Pronunciation clarity

4. TASK FULFILLMENT (1-12):
   - Making predictions about the scene
   - Providing logical explanations for predictions
   - Addressing multiple elements or people
   - Effective use of preparation and speaking time

RESPONSE FORMAT (JSON):
{{
  "scores": {{
    "content_score": 0.0,
    "vocabulary_score": 0.0,
    "language_use_score": 0.0,
    "task_fulfillment_score": 0.0,
    "overall_score": 0.0
  }},
  "feedback": {{
    "strengths": [
      "specific_strength_1",
      "specific_strength_2", 
      "specific_strength_3"
    ],
    "improvements": [
      "specific_improvement_1",
      "specific_improvement_2",
      "specific_improvement_3"
    ],
    "specific_suggestions": [
      "actionable_suggestion_1",
      "actionable_suggestion_2",
      "actionable_suggestion_3"
    ],
    "pronunciation_notes": "specific_notes_about_pronunciation_if_applicable",
    "fluency_notes": "specific_notes_about_prediction_flow_and_logical_reasoning"
  }},
  "confidence_level": 0.85
}}

EVALUATION GUIDELINES:
- Focus on prediction accuracy and logical reasoning
- Consider how well predictions are supported with explanations
- Evaluate use of appropriate future tense and prediction vocabulary
- Assess organization and logical flow of predictions
- Be constructive about reasoning techniques and creative thinking
- Reference specific examples from the transcript
"""

    @staticmethod
    def create_task5_prompt(comparison_scenario: str, decision_maker: str, category: str) -> str:
        """Create a prompt for CELPIP Speaking Task 5 (Comparing and Persuading)."""
        return f"""
Generate a realistic CELPIP Speaking Task 5 (Comparing and Persuading) in JSON format following the official CELPIP format.

COMPARISON SCENARIO: {comparison_scenario}
DECISION MAKER: {decision_maker}
CATEGORY: {category}

OFFICIAL TASK REQUIREMENTS:
- Task Type: Comparing and Persuading
- Selection Time: 60 seconds (to choose between two options)
- Preparation Time: 60 seconds (to prepare persuasive arguments)
- Speaking Time: 60 seconds (to persuade the decision maker)
- Three-phase structure: Selection → Preparation → Speaking
- Two options/images presented with detailed information
- Must choose one option and persuade someone specific
- Use comparative language and persuasive techniques
- Canadian English context and cultural appropriateness

OFFICIAL TASK FORMAT:
The test-taker will see two pictures with accompanying information. They first choose one option (60 seconds), then prepare their persuasive arguments (60 seconds), and finally speak to persuade a specific person that their choice is better by comparing the two options (60 seconds).

RESPONSE FORMAT (JSON):
{{
  "task_id": "unique_task_id",
  "task_type": "comparing_and_persuading",
  "scenario": {{
    "scenario_id": "unique_scenario_id",
    "title": "brief_title_of_comparison_scenario",
    "context": "background_information_about_the_decision_situation",
    "decision_maker": "who_needs_to_be_persuaded",
    "category": "category_of_items_being_compared",
    "option_a": {{
      "option_id": "option_a_id",
      "title": "name_or_title_of_option_a",
      "description": "detailed_description_of_option_a",
      "specifications": [
        "key_specification_1",
        "key_specification_2",
        "key_specification_3",
        "key_specification_4"
      ],
      "price": "price_information_if_applicable",
      "pros": [
        "positive_aspect_1",
        "positive_aspect_2",
        "positive_aspect_3"
      ],
      "cons": [
        "negative_aspect_1",
        "negative_aspect_2"
      ],
      "image_description": "description_of_option_a_image"
    }},
    "option_b": {{
      "option_id": "option_b_id",
      "title": "name_or_title_of_option_b",
      "description": "detailed_description_of_option_b",
      "specifications": [
        "key_specification_1",
        "key_specification_2",
        "key_specification_3",
        "key_specification_4"
      ],
      "price": "price_information_if_applicable",
      "pros": [
        "positive_aspect_1",
        "positive_aspect_2",
        "positive_aspect_3"
      ],
      "cons": [
        "negative_aspect_1",
        "negative_aspect_2"
      ],
      "image_description": "description_of_option_b_image"
    }},
    "persuasion_context": "why_persuasion_is_needed_in_this_scenario"
  }},
  "instructions": {{
    "selection_time_seconds": 60,
    "preparation_time_seconds": 60,
    "speaking_time_seconds": 60,
    "task_description": "clear_description_of_what_test_taker_should_do",
    "evaluation_criteria": [
      "Content/Coherence: Well-organized response with clear comparison",
      "Vocabulary: Appropriate comparative and persuasive language",
      "Listenability: Clear pronunciation and natural speech flow",
      "Task Fulfillment: Complete persuasive response within 60 seconds"
    ],
    "tips": [
      "Use comparative language (more/less, better/worse, -er/-est)",
      "Address the specific person you're persuading",
      "Compare both options, not just promote your choice",
      "Give clear reasons why your choice is better",
      "Use persuasive language and techniques",
      "Stay within the 60-second time limit"
    ]
  }},
  "difficulty_level": "intermediate",
  "estimated_duration_minutes": 3
}}

GENERATION GUIDELINES:
- Create realistic Canadian scenarios with appropriate details
- Make both options viable but with clear differentiating factors
- Include specific numerical data, prices, or measurements when relevant
- Ensure cultural appropriateness and realistic context
- Generate authentic comparative scenarios
- Focus on practical decision-making situations
- Use common Canadian names and locations
- Make the persuasion context realistic and relatable
"""

    @staticmethod
    def create_task5_evaluation_prompt(transcript: str, task_scenario: str, task_instructions: str, selected_option: str, timing_info: str = "") -> str:
        """Create a prompt for evaluating Speaking Task 5 responses."""
        return f"""
Evaluate this CELPIP Speaking Task 5 response according to official CELPIP criteria.

TASK SCENARIO: {task_scenario}

TASK INSTRUCTIONS: {task_instructions}

SELECTED OPTION: {selected_option}

TIMING INFORMATION: {timing_info}

TRANSCRIPT: {transcript}

OFFICIAL CELPIP EVALUATION CRITERIA:

1. CONTENT/COHERENCE (1-12):
   - Clear introduction addressing the specific person
   - Logical comparison between both options
   - Strong persuasive arguments with specific reasons
   - Appropriate conclusion and call to action
   - Well-organized response structure

2. VOCABULARY (1-12):
   - Appropriate comparative vocabulary (more/less, better/worse, superior/inferior)
   - Persuasive language and techniques
   - Specific descriptive terms related to the options
   - Natural expressions and collocations
   - Variety in word choice

3. LISTENABILITY (1-12):
   - Clear pronunciation and articulation
   - Natural rhythm and intonation
   - Appropriate stress and emphasis for persuasion
   - Smooth transitions between ideas
   - Engaging delivery style

4. TASK FULFILLMENT (1-12):
   - Clear choice made between the two options
   - Effective comparison of both options
   - Persuasive approach addressing the specific person
   - Complete response within the 60-second time limit
   - Appropriate use of comparative and persuasive techniques

RESPONSE FORMAT (JSON):
{{
  "scores": {{
    "content_score": 0.0,
    "vocabulary_score": 0.0,
    "language_use_score": 0.0,
    "task_fulfillment_score": 0.0,
    "overall_score": 0.0
  }},
  "feedback": {{
    "strengths": [
      "specific_strength_1",
      "specific_strength_2", 
      "specific_strength_3"
    ],
    "improvements": [
      "specific_improvement_1",
      "specific_improvement_2",
      "specific_improvement_3"
    ],
    "specific_suggestions": [
      "actionable_suggestion_1",
      "actionable_suggestion_2",
      "actionable_suggestion_3"
    ],
    "pronunciation_notes": "specific_notes_about_pronunciation_if_applicable",
    "fluency_notes": "specific_notes_about_comparative_and_persuasive_language_use"
  }},
  "selected_option_analysis": "analysis_of_the_option_choice_and_its_suitability",
  "persuasion_effectiveness": "evaluation_of_how_persuasive_the_response_was",
  "confidence_level": 0.85
}}

EVALUATION GUIDELINES:
- Focus on comparative language and persuasive techniques
- Consider how well the response addresses the specific decision maker
- Evaluate use of appropriate comparative and persuasive vocabulary
- Assess logical reasoning and evidence provided
- Be constructive about persuasion techniques and comparative analysis
- Reference specific examples from the transcript
"""

    @staticmethod
    def create_task3_evaluation_prompt(transcript: str, task_scenario: str, task_instructions: str, timing_info: str = "") -> str:
        """Create a prompt for evaluating Speaking Task 3 responses."""
        return f"""
Evaluate this CELPIP Speaking Task 3 response according to official CELPIP criteria.

TASK SCENARIO: {task_scenario}

TASK INSTRUCTIONS: {task_instructions}

TIMING INFORMATION: {timing_info}

TRANSCRIPT: {transcript}

EVALUATION CRITERIA (1-12 scale for each):

1. CONTENT (1-12):
   - Clarity and completeness of scene description
   - Logical organization from general to specific
   - Appropriate level of detail for the time limit
   - Accuracy in describing spatial relationships

2. VOCABULARY (1-12):
   - Range and accuracy of descriptive vocabulary
   - Use of spatial and directional terms
   - Appropriate adjectives and descriptive language
   - Precision in describing visual elements

3. LANGUAGE USE (1-12):
   - Grammar accuracy in descriptive language
   - Sentence structure variety
   - Natural flow and coherence
   - Pronunciation clarity

4. TASK FULFILLMENT (1-12):
   - Describing scene for someone who cannot see it
   - Addressing key visual elements
   - Effective use of preparation and speaking time
   - Creating a clear mental picture for the listener

RESPONSE FORMAT (JSON):
{{
  "scores": {{
    "content_score": 0.0,
    "vocabulary_score": 0.0,
    "language_use_score": 0.0,
    "task_fulfillment_score": 0.0,
    "overall_score": 0.0
  }},
  "feedback": {{
    "strengths": [
      "specific_strength_1",
      "specific_strength_2", 
      "specific_strength_3"
    ],
    "improvements": [
      "specific_improvement_1",
      "specific_improvement_2",
      "specific_improvement_3"
    ],
    "specific_suggestions": [
      "actionable_suggestion_1",
      "actionable_suggestion_2",
      "actionable_suggestion_3"
    ],
    "pronunciation_notes": "specific_notes_about_pronunciation_if_applicable",
    "fluency_notes": "specific_notes_about_descriptive_flow_and_organization"
  }},
  "confidence_level": 0.85
}}

EVALUATION GUIDELINES:
- Focus on descriptive communication and spatial awareness
- Consider how well the description helps someone visualize the scene
- Evaluate use of appropriate descriptive and spatial vocabulary
- Assess organization and logical flow of description
- Be constructive about descriptive techniques and visual communication
- Reference specific examples from the transcript
"""

    @staticmethod
    def create_task8_prompt(unusual_situation: str, context: str) -> str:
        """Create a prompt for CELPIP Speaking Task 8 (Describing an Unusual Situation)."""
        return f"""
Generate a realistic CELPIP Speaking Task 8 (Describing an Unusual Situation) in JSON format following the official CELPIP format.

UNUSUAL SITUATION: {unusual_situation}
CONTEXT: {context}

OFFICIAL TASK REQUIREMENTS:
- Task Type: Describing an Unusual Situation
- Preparation Time: 30 seconds (to observe and think about explanations)
- Speaking Time: 60 seconds (describe the unusual situation)
- Present tense dominance (describing what you see)
- Address why the situation is unusual and provide possible explanations
- Canadian English context and cultural appropriateness

OFFICIAL TASK FORMAT:
The test-taker sees an image showing something unexpected or unusual. They must describe the unusual situation to someone who cannot see it, explaining what makes it strange and offering possible explanations. The goal is to paint a clear picture that allows the listener to understand both the situation and why it's unusual.

RESPONSE FORMAT (JSON):
{{
  "task_id": "unique_task_id",
  "task_type": "describing_unusual_situation",
  "scenario": {{
    "scenario_id": "unique_scenario_id",
    "title": "Describe the unusual situation in the picture",
    "situation_description": "Detailed description of the unusual situation shown in the image",
    "context": "Brief context about the setting where this unusual situation is taking place",
    "unusual_elements": [
      "First unusual element that makes the situation strange",
      "Second unusual element that contributes to the oddness",
      "Third unusual element that stands out",
      "Fourth unusual element that catches attention"
    ],
    "possible_explanations": [
      "First plausible explanation for why this situation might be occurring",
      "Second possible reason for this unusual circumstance",
      "Third potential explanation that could make sense",
      "Fourth alternative explanation for the situation"
    ],
    "descriptive_focus": "What aspects should be emphasized when describing this unusual situation",
    "image_description": "optional_technical_description_of_image"
  }},
  "instructions": {{
    "preparation_time_seconds": 30,
    "speaking_time_seconds": 60,
    "task_description": "Describe the unusual situation in the picture to someone who cannot see it. Explain what makes it unusual and suggest possible explanations.",
    "evaluation_criteria": [
      "Content/Coherence: Clear description of the unusual situation and logical explanations",
      "Vocabulary: Appropriate descriptive vocabulary and expressions of speculation",
      "Listenability: Clear pronunciation and natural speech flow",
      "Task Fulfillment: Complete description with explanations within 60 seconds"
    ],
    "tips": [
      "Start with a general overview of what you see",
      "Clearly explain what makes the situation unusual or unexpected",
      "Use phrases like 'This is strange because...' or 'What's unusual here is...'",
      "Offer 2-3 possible explanations using phrases like 'Perhaps...' or 'It's possible that...'",
      "Be creative but realistic in your explanations",
      "Use descriptive language to help the listener visualize the scene"
    ]
  }},
  "difficulty_level": "intermediate",
  "estimated_duration_minutes": 2
}}

CONTENT GUIDELINES (Based on Official Format):
1. Create a genuinely unusual but believable situation that test-takers can describe
2. **situation_description**: Detailed reference description of the unusual situation
3. Include elements that are clearly out of place or unexpected
4. Ensure the situation allows for creative but logical explanations
5. Make it visually interesting and engaging for description
6. Focus on observable unusual details that can be clearly described
7. Make the situation culturally appropriate for Canadian context
8. Ensure the situation has enough unusual elements for 60 seconds of description

OFFICIAL SAMPLE STRUCTURE EXAMPLES:
- Unusual behavior: "This picture shows someone doing something very unusual. They are..."
- Inappropriate objects: "What's strange about this image is that there's a person using..."
- Unexpected context: "The unusual thing about this scene is that someone is..."

EVALUATION FOCUS (Official CELPIP Criteria):
- Content/Coherence: Logical description of unusual elements and creative explanations
- Vocabulary: Range and accuracy of descriptive and speculative vocabulary
- Listenability: Clear delivery that helps listener understand the unusual situation
- Task Fulfillment: Comprehensive description addressing unusual elements and explanations within time limit

Generate authentic CELPIP-style unusual situations that test descriptive language skills, creative thinking, and speculation while being engaging and realistic for Canadian test-takers.
"""

    @staticmethod
    def create_task8_evaluation_prompt(transcript: str, task_scenario: str, task_instructions: str, timing_info: str = "") -> str:
        """Create a prompt for evaluating Speaking Task 8 responses."""
        return f"""
Evaluate this CELPIP Speaking Task 8 response according to official CELPIP criteria.

TASK SCENARIO: {task_scenario}

TASK INSTRUCTIONS: {task_instructions}

TIMING INFORMATION: {timing_info}

TRANSCRIPT: {transcript}

EVALUATION CRITERIA (1-12 scale for each):

1. CONTENT (1-12):
   - Clarity and completeness of unusual situation description
   - Logical identification of unusual elements
   - Creative and plausible explanations provided
   - Appropriate level of detail for the time limit

2. VOCABULARY (1-12):
   - Range and accuracy of descriptive vocabulary
   - Use of speculative language (perhaps, maybe, it's possible)
   - Appropriate adjectives and descriptive language
   - Precision in describing unusual elements

3. LANGUAGE USE (1-12):
   - Grammar accuracy in descriptive and speculative language
   - Sentence structure variety
   - Natural flow and coherence
   - Pronunciation clarity

4. TASK FULFILLMENT (1-12):
   - Describing unusual situation for someone who cannot see it
   - Identifying what makes the situation unusual
   - Providing reasonable explanations for the unusual situation
   - Effective use of preparation and speaking time

RESPONSE FORMAT (JSON):
{{
  "scores": {{
    "content_score": 0.0,
    "vocabulary_score": 0.0,
    "language_use_score": 0.0,
    "task_fulfillment_score": 0.0,
    "overall_score": 0.0
  }},
  "feedback": {{
    "strengths": [
      "specific_strength_1",
      "specific_strength_2", 
      "specific_strength_3"
    ],
    "improvements": [
      "specific_improvement_1",
      "specific_improvement_2",
      "specific_improvement_3"
    ],
    "specific_suggestions": [
      "actionable_suggestion_1",
      "actionable_suggestion_2",
      "actionable_suggestion_3"
    ],
    "pronunciation_notes": "specific_notes_about_pronunciation_if_applicable",
    "fluency_notes": "specific_notes_about_descriptive_flow_and_creative_explanations"
  }},
  "confidence_level": 0.85
}}

EVALUATION GUIDELINES:
- Focus on descriptive communication and creative thinking
- Consider how well the description helps someone understand the unusual situation
- Evaluate use of appropriate descriptive and speculative vocabulary
- Assess organization and logical flow of description and explanations
- Be constructive about descriptive techniques and creative problem-solving
- Reference specific examples from the transcript
"""

    @staticmethod
    def create_task7_prompt(opinion_topic: str, context_type: str) -> str:
        """Create a prompt for CELPIP Speaking Task 7 (Expressing Opinions)."""
        return f"""
Generate a realistic CELPIP Speaking Task 7 (Expressing Opinions) in JSON format following the official CELPIP format.

OPINION TOPIC: {opinion_topic}
CONTEXT TYPE: {context_type}

OFFICIAL TASK REQUIREMENTS:
- Task Type: Expressing Opinions
- Preparation Time: 30 seconds (to choose position and organize thoughts)
- Speaking Time: 60-90 seconds (varies by complexity)
- Present tense dominance (expressing current opinions)
- Address the topic with clear position, supporting arguments, and examples
- Canadian English context and cultural appropriateness

OFFICIAL TASK FORMAT:
The test-taker is presented with a statement or question about a current issue. They must quickly choose a position (agree, disagree, or neutral) and provide 2-3 supporting arguments with examples. The goal is to express a clear opinion with logical reasoning and personal insights.

RESPONSE FORMAT (JSON):
{{
  "task_id": "unique_task_id",
  "task_type": "expressing_opinions",
  "scenario": {{
    "scenario_id": "unique_scenario_id",
    "title": "Express your opinion on [topic]",
    "topic_statement": "Clear statement of the opinion topic that requires taking a position",
    "context": "Brief context about why this topic is relevant and important to discuss",
    "position_options": [
      "Agree",
      "Disagree",
      "Partially agree"
    ],
    "supporting_points": [
      "First potential supporting argument for any position",
      "Second potential supporting argument",
      "Third potential supporting argument",
      "Fourth potential supporting argument"
    ],
    "considerations": [
      "First important factor to consider when forming an opinion",
      "Second important factor to consider",
      "Third important factor to consider"
    ],
    "image_description": "optional_description_if_applicable"
  }},
  "instructions": {{
    "preparation_time_seconds": 30,
    "speaking_time_seconds": 90,
    "task_description": "Express your opinion on the given topic. Choose a clear position and support it with 2-3 logical arguments and examples from your experience or knowledge.",
    "evaluation_criteria": [
      "Content/Coherence: Clear opinion with logical supporting arguments",
      "Vocabulary: Appropriate vocabulary for expressing opinions and arguments",
      "Listenability: Clear pronunciation and natural speech flow",
      "Task Fulfillment: Complete opinion expression with position and support within time limit"
    ],
    "tips": [
      "Choose your position quickly - don't change your mind during speaking",
      "Provide 2-3 clear supporting arguments for your position",
      "Use personal examples or general knowledge to support your points",
      "Use opinion expressions like 'I believe', 'In my opinion', 'I think'",
      "Address potential counterarguments if you have time",
      "Conclude with a strong restatement of your position"
    ]
  }},
  "difficulty_level": "intermediate",
  "estimated_duration_minutes": 2
}}

CONTENT GUIDELINES (Based on Official Format):
1. Create a controversial but appropriate topic that allows for multiple valid positions
2. **topic_statement**: Clear, concise statement that requires taking a position
3. Include topics relevant to Canadian society and current issues
4. Ensure the topic allows for personal experience and general knowledge arguments
5. Focus on topics that intermediate speakers can discuss confidently
6. Make the topic engaging and thought-provoking for test-takers
7. Ensure the topic can be discussed effectively in 60-90 seconds
8. Use authentic Canadian English and cultural references where appropriate

OFFICIAL SAMPLE STRUCTURE EXAMPLES:
- Social issue: "Some people believe that [statement]. Do you agree or disagree?"
- Policy topic: "It has been suggested that [policy]. What is your opinion?"
- Lifestyle topic: "Many people think that [lifestyle choice]. What do you think?"

EVALUATION FOCUS (Official CELPIP Criteria):
- Content/Coherence: Clear position with logical supporting arguments and examples
- Vocabulary: Range and appropriateness of vocabulary for expressing opinions and arguments
- Listenability: Clear delivery that effectively communicates the opinion and reasoning
- Task Fulfillment: Complete opinion expression addressing the topic within time limit

Generate authentic CELPIP-style opinion topics that test argumentative language skills, critical thinking, and personal expression while being engaging and accessible for Canadian test-takers.
"""

    @staticmethod
    def create_task7_evaluation_prompt(transcript: str, task_scenario: str, task_instructions: str, timing_info: str = "") -> str:
        """Create a prompt for evaluating Speaking Task 7 responses."""
        return f"""
Evaluate this CELPIP Speaking Task 7 response according to official CELPIP criteria.

TASK SCENARIO: {task_scenario}

TASK INSTRUCTIONS: {task_instructions}

TIMING INFORMATION: {timing_info}

TRANSCRIPT: {transcript}

EVALUATION CRITERIA (1-12 scale for each):

1. CONTENT (1-12):
   - Clarity and strength of opinion/position
   - Logical supporting arguments provided
   - Use of relevant examples and evidence
   - Depth of reasoning and critical thinking

2. VOCABULARY (1-12):
   - Range and accuracy of opinion-expressing vocabulary
   - Use of argumentative and persuasive language
   - Appropriate connectors and transition words
   - Precision in expressing viewpoints

3. LANGUAGE USE (1-12):
   - Grammar accuracy in opinion and argument structures
   - Sentence structure variety
   - Natural flow and coherence
   - Pronunciation clarity

4. TASK FULFILLMENT (1-12):
   - Clear position taken on the topic
   - Adequate supporting arguments provided
   - Effective use of preparation and speaking time
   - Complete opinion expression with logical structure

RESPONSE FORMAT (JSON):
{{
  "scores": {{
    "content_score": 0.0,
    "vocabulary_score": 0.0,
    "language_use_score": 0.0,
    "task_fulfillment_score": 0.0,
    "overall_score": 0.0
  }},
  "feedback": {{
    "strengths": [
      "specific_strength_1",
      "specific_strength_2", 
      "specific_strength_3"
    ],
    "improvements": [
      "specific_improvement_1",
      "specific_improvement_2",
      "specific_improvement_3"
    ],
    "specific_suggestions": [
      "actionable_suggestion_1",
      "actionable_suggestion_2",
      "actionable_suggestion_3"
    ],
    "pronunciation_notes": "specific_notes_about_pronunciation_if_applicable",
    "fluency_notes": "specific_notes_about_argumentative_flow_and_opinion_expression"
  }},
  "confidence_level": 0.85
}}

EVALUATION GUIDELINES:
- Focus on argumentative communication and opinion expression
- Consider how well the opinion is supported with logical arguments
- Evaluate use of appropriate opinion-expressing and argumentative vocabulary
- Assess organization and logical flow of arguments
- Be constructive about reasoning techniques and persuasive communication
- Reference specific examples from the transcript
"""

    @staticmethod
    def create_task6_prompt(difficult_situation: str, relationship_context: str) -> str:
        """Create a prompt for CELPIP Speaking Task 6 (Dealing with Difficult Situations)."""
        return f"""
Generate a realistic CELPIP Speaking Task 6 (Dealing with Difficult Situations) in JSON format following the official CELPIP format.

DIFFICULT SITUATION: {difficult_situation}
RELATIONSHIP CONTEXT: {relationship_context}

OFFICIAL TASK REQUIREMENTS:
- Task Type: Dealing with Difficult Situations
- Preparation Time: 60 seconds (to read scenario and choose option)
- Speaking Time: 60 seconds (shorter than most other tasks)
- Choice-based format (choose between two communication options)
- Address interpersonal conflicts with diplomacy
- Canadian English context and cultural appropriateness

OFFICIAL TASK FORMAT:
The test-taker is presented with a difficult interpersonal situation involving multiple parties. They must read the scenario, choose between two communication options (usually who to talk to), and then explain their choice with diplomatic language. The goal is to demonstrate conflict resolution and communication skills.

RESPONSE FORMAT (JSON):
{{
  "task_id": "unique_task_id",
  "task_type": "dealing_with_difficult_situation",
  "scenario": {{
    "scenario_id": "unique_scenario_id",
    "title": "Brief title of the difficult situation",
    "situation_description": "Detailed description of the complex interpersonal situation",
    "context": "Background context about the situation and relationships involved",
    "involved_parties": [
      "First party involved in the situation",
      "Second party involved in the situation",
      "Third party if applicable"
    ],
    "dilemma_explanation": "Explanation of why this situation is difficult and what makes it challenging",
    "communication_options": [
      "Option 1: Talk to [specific person]. Explain [specific approach/message]",
      "Option 2: Talk to [different person]. Explain [different approach/message]"
    ],
    "relationship_context": "Description of relationships between the parties and why they matter",
    "image_description": "optional_description_if_applicable"
  }},
  "instructions": {{
    "preparation_time_seconds": 60,
    "speaking_time_seconds": 60,
    "task_description": "Choose one of the two options and explain your choice. In your response, provide context about the situation and relationships, explain why you chose that option, and use diplomatic language.",
    "evaluation_criteria": [
      "Content/Coherence: Clear explanation of choice with logical reasoning",
      "Vocabulary: Appropriate diplomatic and conflict resolution vocabulary",
      "Listenability: Clear pronunciation and natural speech flow",
      "Task Fulfillment: Complete response addressing the situation within time limit"
    ],
    "tips": [
      "Read the scenario carefully and choose the option that gives you more to talk about",
      "Provide context about the relationships and why the situation is difficult",
      "Use diplomatic and apologetic language when appropriate",
      "Explain your reasoning for choosing that communication approach",
      "Consider the feelings and perspectives of all parties involved",
      "Give specific details about what you would say and why"
    ]
  }},
  "difficulty_level": "intermediate",
  "estimated_duration_minutes": 2
}}

CONTENT GUIDELINES (Based on Official Format):
1. Create realistic interpersonal conflicts that require diplomatic communication
2. **situation_description**: Detailed scenario involving 2-3 people with competing interests
3. Include relationships that matter in Canadian cultural context
4. Ensure both communication options are viable but require different approaches
5. Focus on situations that test empathy, diplomacy, and problem-solving
6. Make the dilemma genuinely difficult with no perfect solution
7. Ensure the situation can be addressed effectively in 60 seconds
8. Use authentic Canadian English and cultural references where appropriate

OFFICIAL SAMPLE STRUCTURE EXAMPLES:
- Relationship conflict: "You are caught between two friends who are in conflict..."
- Family situation: "Your family members have different expectations and you must choose..."
- Work dilemma: "A workplace situation requires you to address competing demands..."

EVALUATION FOCUS (Official CELPIP Criteria):
- Content/Coherence: Clear explanation of choice with logical reasoning and empathy
- Vocabulary: Range and appropriateness of diplomatic and interpersonal vocabulary
- Listenability: Clear delivery that demonstrates understanding of interpersonal dynamics
- Task Fulfillment: Complete response addressing the difficult situation within time limit

Generate authentic CELPIP-style difficult situations that test diplomatic communication skills, empathy, and conflict resolution while being culturally appropriate for Canadian test-takers.
"""

    @staticmethod
    def create_task6_evaluation_prompt(transcript: str, task_scenario: str, task_instructions: str, timing_info: str = "") -> str:
        """Create a prompt for evaluating Speaking Task 6 responses."""
        return f"""
Evaluate this CELPIP Speaking Task 6 response according to official CELPIP criteria.

TASK SCENARIO: {task_scenario}

TASK INSTRUCTIONS: {task_instructions}

TIMING INFORMATION: {timing_info}

TRANSCRIPT: {transcript}

EVALUATION CRITERIA (1-12 scale for each):

1. CONTENT (1-12):
   - Clear explanation of chosen communication approach
   - Logical reasoning for the choice made
   - Understanding of interpersonal dynamics
   - Empathy and consideration for all parties

2. VOCABULARY (1-12):
   - Range and accuracy of diplomatic vocabulary
   - Use of conflict resolution and interpersonal language
   - Appropriate expressions for difficult situations
   - Precision in describing relationships and emotions

3. LANGUAGE USE (1-12):
   - Grammar accuracy in explanatory and diplomatic language
   - Sentence structure variety
   - Natural flow and coherence
   - Pronunciation clarity

4. TASK FULFILLMENT (1-12):
   - Clear choice made between communication options
   - Adequate explanation of reasoning and approach
   - Effective use of preparation and speaking time
   - Complete response addressing the difficult situation

RESPONSE FORMAT (JSON):
{{
  "scores": {{
    "content_score": 0.0,
    "vocabulary_score": 0.0,
    "language_use_score": 0.0,
    "task_fulfillment_score": 0.0,
    "overall_score": 0.0
  }},
  "feedback": {{
    "strengths": [
      "specific_strength_1",
      "specific_strength_2", 
      "specific_strength_3"
    ],
    "improvements": [
      "specific_improvement_1",
      "specific_improvement_2",
      "specific_improvement_3"
    ],
    "specific_suggestions": [
      "actionable_suggestion_1",
      "actionable_suggestion_2",
      "actionable_suggestion_3"
    ],
    "pronunciation_notes": "specific_notes_about_pronunciation_if_applicable",
    "fluency_notes": "specific_notes_about_diplomatic_communication_and_interpersonal_skills"
  }},
  "confidence_level": 0.85
}}

EVALUATION GUIDELINES:
- Focus on diplomatic communication and conflict resolution skills
- Consider how well the response demonstrates empathy and understanding
- Evaluate use of appropriate interpersonal and diplomatic vocabulary
- Assess logical reasoning for the chosen communication approach
- Be constructive about interpersonal communication techniques
- Reference specific examples from the transcript
"""