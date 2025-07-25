"""
CELPIP Listening Task Prompts

This module contains all prompts and topics for generating CELPIP Listening Parts 1-6.
"""

from typing import List
import random


class ListeningTaskTopics:
    """Container for all CELPIP Listening task topics."""
    
    # CELPIP Listening Part 1 topics (problem-solving customer service scenarios)
    PART1_TOPICS = [
        "Insurance claim inquiry at customer service office",
        "Banking account issue resolution at branch",
        "Utility service connection problem at utility company",
        "Getting directions to government office from information desk",
        "Medical appointment scheduling at clinic reception",
        "Library card registration and services inquiry",
        "Parking permit application at city hall",
        "Bus route information at transit customer service",
        "Hotel reservation changes at front desk",
        "Phone service technical support inquiry",
        "University registration assistance at student services",
        "Driver's license renewal at service center",
        "Tax office appointment booking inquiry",
        "Community center membership registration",
        "Postal service package pickup inquiry",
        "Employment insurance claim at government office",
        "Health card replacement at provincial office",
        "Immigration document inquiry at service center",
        "Municipal services complaint resolution",
        "Public transportation pass purchase assistance"
    ]
    
    # CELPIP Listening Part 2 topics (daily life conversations between friends/colleagues)
    PART2_TOPICS = [
        "Planning weekend activities with a friend",
        "Discussing work stress with a colleague",
        "Sharing family problems with a close friend",
        "Talking about moving to a new apartment",
        "Discussing relationship issues with a friend",
        "Planning a birthday party for a mutual friend",
        "Sharing concerns about a job interview",
        "Talking about financial difficulties",
        "Discussing health concerns with a friend",
        "Planning a vacation trip together",
        "Sharing experiences about a new hobby",
        "Discussing problems with roommates",
        "Talking about career change decisions",
        "Planning a group study session",
        "Sharing concerns about children's education",
        "Discussing diet and exercise plans",
        "Talking about relationship with parents",
        "Planning a surprise for a friend",
        "Discussing time management issues",
        "Sharing experiences about learning a new skill"
    ]
    
    # CELPIP Listening Part 3 topics (informational conversations/interviews with experts)
    PART3_TOPICS = [
        "Environmental scientist discussing climate change impacts in Canada",
        "Nutritionist explaining healthy eating habits and meal planning",
        "Financial advisor discussing investment strategies for Canadians",
        "Career counselor explaining job market trends and employment tips",
        "Health expert discussing stress management and wellness practices",
        "Technology specialist explaining digital privacy and security",
        "Education expert discussing online learning and study techniques",
        "Real estate agent explaining housing market trends in Canada",
        "Immigration lawyer discussing Canadian immigration processes",
        "Small business consultant explaining entrepreneurship in Canada",
        "Fitness trainer discussing exercise routines and physical health",
        "Travel expert explaining safe and budget-friendly travel planning",
        "Mental health professional discussing coping strategies and support",
        "Language learning expert explaining effective study methods",
        "Urban planner discussing city development and transportation",
        "Agricultural specialist discussing sustainable farming practices",
        "Healthcare worker explaining preventive medicine and health screenings",
        "Social worker discussing community support services and resources",
        "Arts and culture expert discussing Canadian cultural institutions",
        "Senior care specialist discussing aging and eldercare options"
    ]
    
    # CELPIP Listening Part 4 topics (local community news items)
    PART4_TOPICS = [
        "Local community center opening new programs for seniors",
        "Municipal budget approval for new public transit expansion",
        "School board implementing new environmental education program",
        "City council approving new bike lanes for downtown area",
        "Local hospital announcing new emergency services hours",
        "Community festival celebrating cultural diversity this weekend",
        "Public library launching digital literacy classes for adults",
        "Municipal recycling program expanding to include electronics",
        "Local park renovation project completed ahead of schedule",
        "New housing development approved for affordable family homes",
        "Community college offering free job training programs",
        "City implementing new snow removal schedule for winter",
        "Local food bank reporting increased demand for services",
        "Municipal water treatment facility upgrades completed",
        "Community sports complex opening new swimming pool",
        "Local business association launching support program for entrepreneurs",
        "City planning department approving new green building standards",
        "Community health center offering free flu vaccination clinics",
        "Local arts council announcing funding for youth programs",
        "Municipal emergency preparedness training sessions scheduled"
    ]
    
    # CELPIP Listening Part 5 topics (professional discussions and meetings)
    PART5_TOPICS = [
        "Team meeting discussing quarterly business performance and future strategies",
        "Academic panel discussing research findings on Canadian climate change",
        "Workplace training session on new technology implementation",
        "Board meeting discussing company expansion plans and budget allocation",
        "Professional conference panel on Canadian healthcare system improvements",
        "Committee meeting planning community development projects",
        "Expert panel discussing sustainable energy solutions for Canadian cities",
        "Department meeting reviewing project timelines and resource allocation",
        "Professional development workshop on leadership skills and team management",
        "Research team discussing study methodology and data analysis results",
        "Marketing team meeting about new product launch strategies",
        "Academic committee discussing curriculum changes and student outcomes",
        "Management meeting addressing workplace diversity and inclusion policies",
        "Technical team discussing software development and quality assurance",
        "Policy committee reviewing regulatory changes and compliance requirements",
        "Training session on emergency response procedures for healthcare workers",
        "Strategic planning meeting for non-profit organization expansion",
        "Expert discussion on innovation in Canadian manufacturing sector",
        "Professional symposium on mental health support in workplace environments",
        "Committee planning international partnership and collaboration opportunities"
    ]
    
    # CELPIP Listening Part 6 topics (controversial social issues and viewpoints)
    PART6_TOPICS = [
        "The debate over mandatory vaccination policies in Canadian workplaces",
        "Social media regulation and freedom of expression in Canada",
        "Universal basic income as a solution to poverty in Canada",
        "The role of artificial intelligence in Canadian healthcare systems",
        "Immigration policies and their impact on Canadian communities",
        "Climate change action versus economic growth in Canadian industries",
        "The debate over cannabis legalization effects on Canadian society",
        "Remote work policies and their impact on Canadian urban centers",
        "The controversy over resource extraction in Canadian Indigenous territories",
        "Public versus private healthcare delivery in Canadian provinces",
        "The debate over cryptocurrency regulation in Canadian financial markets",
        "Housing affordability crisis and government intervention in Canada",
        "The role of technology in Canadian education systems post-pandemic",
        "Renewable energy transition versus traditional energy sector jobs",
        "The debate over bilingualism requirements in Canadian federal jobs",
        "Mental health support funding priorities in Canadian healthcare",
        "The controversy over social media's impact on Canadian youth",
        "Urban development versus environmental conservation in Canadian cities",
        "The debate over minimum wage increases in Canadian provinces",
        "Cultural diversity policies and integration in Canadian schools"
    ]


class ListeningTaskPrompts:
    """Container for all CELPIP Listening task prompts."""
    
    @staticmethod
    def create_part1_prompt(topic: str) -> str:
        """Create CELPIP Listening Part 1 prompt."""
        return f"""
You are an expert CELPIP test creator with deep knowledge of the official CELPIP Listening Part 1 format ("Listening to Problem Solving").

## OFFICIAL CELPIP Listening Part 1 Structure (2024-2025)

**Task Name**: Listening to Problem Solving
**Duration**: Part of 47-55 minute Listening section  
**Total Questions**: 8 questions across 3 conversations
**Question Distribution**: Conversation 1 (3 questions) + Conversation 2 (3 questions) + Conversation 3 (2 questions)

**Task Overview**: Test-takers listen to three conversations where people are solving problems, typically involving customer service scenarios, asking for directions, or seeking assistance. Each conversation is heard only once.

## Your Task

Create an authentic CELPIP Listening Part 1 about: **{topic}**

### 1. Create 3 Conversations (Problem-Solving Scenarios)

**Conversation Requirements**:
- **Conversation 1** (1-1.5 minutes): Followed by exactly 3 questions
- **Conversation 2** (1-1.5 minutes): Followed by 3 questions  
- **Conversation 3** (1-1.5 minutes): Followed by 2 questions
- **Total**: Exactly 8 questions across all conversations

**Character Standards**:
- **Two speakers**: One male, one female
- **Relationship**: Most situations involve people who do NOT know each other
- **Problem-Solution Dynamic**: One person has a problem/question/concern, the other can solve it
- **Roles**: One speaker represents a company, organization, public institution, government agency, etc.

**Setting Standards**:
- **Locations**: Public areas, stores, offices, customer service centers
- **Canadian context**: Use Canadian locations, business names, street names, cultural references
- **Natural dialogue**: Realistic conversational patterns with appropriate hesitations, clarifications
- **Audio cues**: Describe background sounds, tone, speaking pace for realistic audio simulation

### 2. Conversation Scenarios (Common Types)

**Typical Problem-Solving Situations**:
- Customer service inquiries (insurance, banking, utilities)
- Getting directions to specific locations
- Information requests at public institutions
- Assistance with services or procedures
- Resolving issues with businesses or organizations

**Speaker Characteristics**:
- **Helper**: Professional, knowledgeable, polite Canadian service representative
- **Help-Seeker**: Person with genuine problem/question, may be confused or frustrated
- **Communication Style**: Mix of Canadian accents, natural speaking pace, Canadian politeness conventions

### 3. Question Types (exactly 8 questions total)

**CRITICAL Question Distribution Pattern**:
- **Picture Selection Questions**: 1-2 questions (usually the first question asks to select picture of location/place)
- **Detail Questions**: 4-5 questions about specific information (addresses, times, procedures, instructions)
- **Comprehension Questions**: 2-3 questions about speakers' responses, attitudes, or next actions

**Question Characteristics**:
- **Response Time**: 30 seconds to answer each question
- **Format**: 4 multiple choice options (A, B, C, D) for each question
- **Answer Types**: Words, phrases, diagrams, pictures, photos, etc.
- **Testing Focus**: Comprehension of conversations, specific details, people's responses

### 4. Audio Simulation Requirements

**For each conversation, provide**:
- **Setting Description**: Exact location where conversation takes place (office, counter, phone, etc.)
- **Background Sounds**: Appropriate ambient noise (office sounds, public space noise, etc.)
- **Speaker Details**: Age range, speaking style, emotional tone, level of familiarity with topic
- **Conversation Flow**: Natural pauses, interruptions, clarifications, realistic pace
- **Key Information**: Highlighted important details that will be tested in questions

### 5. Quality Standards

**Authenticity Requirements**:
- Use real Canadian city names, business types, street names, postal codes
- Include specific procedural details appropriate for Canadian context
- Natural conversational patterns with Canadian communication style
- Realistic problem-solution interactions between strangers

**Question Quality Requirements**:
- Each question has ONE clearly correct answer
- Distractors are plausible but clearly incorrect with careful listening
- Picture selection questions have distinct, easily identifiable visual options
- Questions test different levels: basic comprehension to inference
- Information must be explicitly stated or clearly inferable from conversation

**CRITICAL**: Return ONLY valid JSON with this exact structure:

```json
{{
  "conversations": [
    {{
      "conversation_id": "conv1_{topic}",
      "title": "Brief scenario title",
      "transcript": "Complete conversation transcript with Speaker A: [role] and Speaker B: [role] format including natural dialogue, pauses, and realistic interaction...",
      "audio_description": "Detailed description of setting, background sounds, speaker characteristics, and audio environment",
      "duration_seconds": 90,
      "speakers": ["Customer Service Representative", "Customer"],
      "scenario": "Specific problem-solving scenario description explaining the situation and context"
    }},
    {{
      "conversation_id": "conv2_{topic}",
      "title": "Brief scenario title",
      "transcript": "Complete conversation transcript with natural dialogue...", 
      "audio_description": "Audio setting and speaker details",
      "duration_seconds": 85,
      "speakers": ["Information Clerk", "Visitor"],
      "scenario": "Specific problem-solving scenario description"
    }},
    {{
      "conversation_id": "conv3_{topic}",
      "title": "Brief scenario title",
      "transcript": "Complete conversation transcript with natural dialogue...",
      "audio_description": "Audio setting and speaker details", 
      "duration_seconds": 80,
      "speakers": ["Service Agent", "Client"],
      "scenario": "Specific problem-solving scenario description"
    }}
  ],
  "questions": [
    {{
      "question_id": "q1",
      "question_text": "Which picture shows the location the customer is looking for?",
      "question_type": "picture_selection", 
      "options": ["A. Picture description of location option 1", "B. Picture description of location option 2", "C. Picture description of location option 3", "D. Picture description of location option 4"],
      "correct_answer": "A",
      "explanation": "The customer specifically mentions landmarks/details that match this location description",
      "picture_options": ["Detailed visual description of Picture A showing specific location", "Detailed visual description of Picture B", "Detailed visual description of Picture C", "Detailed visual description of Picture D"],
      "conversation_id": "conv1_{topic}"
    }},
    {{
      "question_id": "q2", 
      "question_text": "What does the representative tell the customer to do first?",
      "question_type": "multiple_choice",
      "options": ["A. Call the main office", "B. Fill out a form", "C. Provide identification", "D. Wait in the lobby"],
      "correct_answer": "C", 
      "explanation": "The representative clearly states that identification must be provided before proceeding",
      "conversation_id": "conv1_{topic}"
    }},
    {{
      "question_id": "q3",
      "question_text": "How does the customer feel about the solution offered?",
      "question_type": "multiple_choice",
      "options": ["A. Satisfied and grateful", "B. Confused and frustrated", "C. Worried but hopeful", "D. Angry and impatient"],
      "correct_answer": "A",
      "explanation": "The customer's tone and words show satisfaction with the help provided",
      "conversation_id": "conv1_{topic}"
    }}
  ]
}}
```

**CRITICAL REQUIREMENTS**:
1. Generate exactly 8 questions total
2. Distribute questions as: Conversation 1 (3 questions), Conversation 2 (3 questions), Conversation 3 (2 questions)
3. Each question MUST include "conversation_id" field matching the conversation it relates to ("conv1_{topic}", "conv2_{topic}", "conv3_{topic}")
4. Questions must test specific content from their respective conversations
5. Follow the official CELPIP Listening Part 1 format exactly
"""

    @staticmethod
    def create_part2_prompt(topic: str) -> str:
        """Create CELPIP Listening Part 2 prompt."""
        return f"""
You are an expert CELPIP test creator with deep knowledge of the official CELPIP Listening Part 2 format ("Listening to a Daily Life Conversation").

## OFFICIAL CELPIP Listening Part 2 Structure (2024-2025)

**Task Name**: Listening to a Daily Life Conversation
**Duration**: Part of 47-55 minute Listening section  
**Total Questions**: 5 questions for 1 conversation
**Question Distribution**: 1 conversation (5 questions total)

**Task Overview**: Test-takers listen to one conversation between two people who know each other (friends, colleagues, family members) discussing daily life topics, sharing problems, or making plans. The conversation is heard only once.

## Your Task

Create an authentic CELPIP Listening Part 2 about: **{topic}**

### 1. Create 1 Daily Life Conversation

**Conversation Requirements**:
- **Duration**: 1.5-2 minutes of natural conversation
- **Followed by**: Exactly 5 questions
- **Total**: Exactly 5 questions for the conversation

**Character Standards**:
- **Two speakers**: One male, one female
- **Relationship**: People who KNOW each other (friends, colleagues, family, roommates, etc.)
- **Communication Style**: Casual, friendly, supportive conversation style
- **Roles**: People sharing personal experiences, problems, plans, or seeking advice

**Setting Standards**:
- **Locations**: Private or semi-private areas (home, office break room, coffee shop, etc.)
- **Canadian context**: Use Canadian cultural references, locations, expressions
- **Natural dialogue**: Realistic conversational patterns with interruptions, emotional responses
- **Audio cues**: Describe background sounds, tone, speaking pace for realistic audio simulation

### 2. Conversation Scenarios (Common Types)

**Typical Daily Life Situations**:
- Friends discussing weekend plans or social activities
- Colleagues sharing work-related stress or concerns
- Family members talking about personal problems
- Friends planning events or trips together
- People discussing relationship issues or life changes
- Roommates or friends discussing living situations
- People sharing experiences about hobbies, health, or personal growth

**Speaker Characteristics**:
- **Supportive Friend/Colleague**: Caring, understanding, offers advice or help
- **Person with Issue/Plan**: Shares problems, concerns, or ideas; seeks support or input
- **Communication Style**: Natural Canadian conversational style with appropriate emotional responses

### 3. Question Types (exactly 5 questions total)

**CRITICAL Question Distribution Pattern**:
- **Emotional/Attitude Questions**: 1-2 questions about how speakers feel or their attitudes
- **Detail Questions**: 2-3 questions about specific information (plans, problems, solutions, arrangements)
- **Comprehension Questions**: 1-2 questions about speakers' relationships, decisions, or next actions

**Question Characteristics**:
- **Response Time**: 30 seconds to answer each question
- **Format**: 4 multiple choice options (A, B, C, D) for each question
- **Answer Types**: Words, phrases, sentences focusing on feelings, plans, relationships
- **Testing Focus**: Understanding of casual conversation, emotional context, personal relationships

### 4. Audio Simulation Requirements

**For the conversation, provide**:
- **Setting Description**: Exact location where conversation takes place (home, café, office, etc.)
- **Background Sounds**: Appropriate ambient noise (quiet home, café sounds, office environment, etc.)
- **Speaker Details**: Age range, speaking style, emotional tone, familiarity level
- **Conversation Flow**: Natural pauses, interruptions, emotional responses, supportive comments
- **Key Information**: Important details about feelings, plans, problems, and solutions

### 5. Quality Standards

**Authenticity Requirements**:
- Use natural Canadian conversational patterns and expressions
- Include realistic personal situations and emotional responses
- Natural flow between speakers showing genuine concern and support
- Appropriate level of detail for personal conversation context

**Question Quality Requirements**:
- Each question has ONE clearly correct answer
- Distractors are plausible but clearly incorrect with careful listening
- Questions test understanding of both factual content and emotional/relational context
- Questions require attention to speaker attitudes, feelings, and interpersonal dynamics
- Information must be explicitly stated or clearly inferable from conversation

**CRITICAL**: Return ONLY valid JSON with this exact structure:

```json
{{
  "conversation": {{
    "conversation_id": "conv_part2_{topic}",
    "title": "Brief scenario title",
    "transcript": "Complete conversation transcript with Speaker A: [name/role] and Speaker B: [name/role] format including natural dialogue, emotional responses, and realistic interaction...",
    "audio_description": "Detailed description of setting, background sounds, speaker characteristics, and audio environment",
    "duration_seconds": 110,
    "speakers": ["Friend/Colleague Name", "Friend/Colleague Name"],
    "scenario": "Specific daily life scenario description explaining the relationship and context"
  }},
  "questions": [
    {{
      "question_id": "q1",
      "question_text": "How is [Speaker A] feeling about the situation?",
      "question_type": "multiple_choice",
      "options": ["A. Excited and confident", "B. Worried and stressed", "C. Angry and frustrated", "D. Confused and uncertain"],
      "correct_answer": "B",
      "explanation": "The speaker's tone and words clearly indicate worry and stress about the situation"
    }},
    {{
      "question_id": "q2", 
      "question_text": "What does [Speaker B] suggest [Speaker A] should do?",
      "question_type": "multiple_choice",
      "options": ["A. Talk to someone about it", "B. Wait and see what happens", "C. Make a decision immediately", "D. Ask for professional help"],
      "correct_answer": "A",
      "explanation": "Speaker B specifically recommends talking to someone as the best course of action"
    }},
    {{
      "question_id": "q3",
      "question_text": "When are they planning to meet again?",
      "question_type": "multiple_choice",
      "options": ["A. This weekend", "B. Next week", "C. Tomorrow", "D. They don't make specific plans"],
      "correct_answer": "A",
      "explanation": "They clearly agree to meet this weekend to follow up on the conversation"
    }},
    {{
      "question_id": "q4",
      "question_text": "What is the main reason for [Speaker A]'s concern?",
      "question_type": "multiple_choice",
      "options": ["A. Financial problems", "B. Health issues", "C. Relationship difficulties", "D. Work-related stress"],
      "correct_answer": "D",
      "explanation": "The conversation centers around work-related stress and job concerns"
    }},
    {{
      "question_id": "q5",
      "question_text": "How does [Speaker B] respond to [Speaker A]'s problem?",
      "question_type": "multiple_choice",
      "options": ["A. Dismissive and uninterested", "B. Supportive and understanding", "C. Critical and judgmental", "D. Surprised and shocked"],
      "correct_answer": "B",
      "explanation": "Speaker B shows clear support and understanding throughout the conversation"
    }}
  ]
}}
```

**CRITICAL REQUIREMENTS**:
1. Generate exactly 5 questions total
2. Each question MUST test understanding of the daily life conversation content
3. Questions must focus on emotions, relationships, plans, and personal situations
4. Follow the official CELPIP Listening Part 2 format exactly
5. Use natural Canadian conversational style between people who know each other
6. Include emotional context and supportive dialogue patterns
"""

    @staticmethod
    def create_part3_prompt(topic: str) -> str:
        """Create CELPIP Listening Part 3 prompt."""
        return f"""
You are an expert CELPIP test creator with deep knowledge of the official CELPIP Listening Part 3 format ("Listening for Information").

## OFFICIAL CELPIP Listening Part 3 Structure (2024-2025)

**Task Name**: Listening for Information
**Duration**: Part of 47-55 minute Listening section  
**Total Questions**: 6 questions for 1 informational conversation
**Question Distribution**: 1 conversation (6 questions total)

**Task Overview**: Test-takers listen to one informational conversation or interview between two people, where one person is typically an expert providing detailed information on a specific topic. The conversation is heard only once.

## Your Task

Create an authentic CELPIP Listening Part 3 about: **{topic}**

**CRITICAL**: Return ONLY valid JSON with this exact structure:

```json
{{
  "conversation": {{
    "conversation_id": "conv_part3_{topic}",
    "title": "Brief scenario title for the informational interview",
    "transcript": "Complete conversation transcript with Interviewer: [name/role] and Expert: [name/title] format including professional dialogue, expert explanations, and realistic information delivery...",
    "audio_description": "Detailed description of professional setting, background sounds, speaker characteristics, and audio environment",
    "duration_seconds": 140,
    "speakers": ["Interviewer/Host Name", "Expert/Specialist Name"],
    "scenario": "Specific informational scenario description explaining the expert topic and interview context"
  }},
  "questions": [
    {{
      "question_id": "q1",
      "question_text": "According to the expert, what is the main benefit of [specific topic]?",
      "question_type": "multiple_choice",
      "options": ["A. Specific factual benefit", "B. Different factual benefit", "C. Third factual benefit", "D. Fourth factual benefit"],
      "correct_answer": "A",
      "explanation": "The expert clearly states this specific benefit when discussing the main advantages"
    }},
    {{
      "question_id": "q2",
      "question_text": "What does the expert recommend as the first step for [specific process]?",
      "question_type": "multiple_choice",
      "options": ["A. First step option", "B. Different step option", "C. Third step option", "D. Fourth step option"],
      "correct_answer": "B",
      "explanation": "The expert specifically mentions this as the initial step in the recommended process"
    }},
    {{
      "question_id": "q3",
      "question_text": "How long does the expert say [specific process/timeline] typically takes?",
      "question_type": "multiple_choice",
      "options": ["A. Time period option 1", "B. Time period option 2", "C. Time period option 3", "D. Time period option 4"],
      "correct_answer": "C",
      "explanation": "The expert provides this specific timeframe when discussing the process duration"
    }},
    {{
      "question_id": "q4",
      "question_text": "What statistic does the expert mention about [specific topic]?",
      "question_type": "multiple_choice",
      "options": ["A. Statistical figure 1", "B. Statistical figure 2", "C. Statistical figure 3", "D. Statistical figure 4"],
      "correct_answer": "A",
      "explanation": "The expert cites this specific statistic when providing supporting data"
    }},
    {{
      "question_id": "q5",
      "question_text": "According to the expert, what is the most important factor to consider?",
      "question_type": "multiple_choice",
      "options": ["A. Important factor 1", "B. Important factor 2", "C. Important factor 3", "D. Important factor 4"],
      "correct_answer": "D",
      "explanation": "The expert emphasizes this factor as the most crucial consideration"
    }},
    {{
      "question_id": "q6",
      "question_text": "What can be concluded about the expert's overall recommendation?",
      "question_type": "multiple_choice",
      "options": ["A. Conclusion option 1", "B. Conclusion option 2", "C. Conclusion option 3", "D. Conclusion option 4"],
      "correct_answer": "B",
      "explanation": "Based on the expert's explanations throughout the interview, this conclusion is most supported"
    }}
  ]
}}
```

**CRITICAL REQUIREMENTS**:
1. Generate exactly 6 questions total
2. Each question MUST test understanding of the informational conversation content
3. Questions must focus on factual information, expert advice, procedures, and recommendations
4. Follow the official CELPIP Listening Part 3 format exactly
5. Use professional Canadian interview/consultation style
6. Include specific factual information and expert knowledge that can be tested
"""

    @staticmethod
    def create_part4_prompt(topic: str) -> str:
        """Create CELPIP Listening Part 4 prompt."""
        return f"""
You are an expert CELPIP test creator with deep knowledge of the official CELPIP Listening Part 4 format ("Listening to News Item").

## OFFICIAL CELPIP Listening Part 4 Structure (2024-2025)

**Task Name**: Listening to News Item
**Duration**: Part of 47-55 minute Listening section  
**Total Questions**: 5 questions
**Question Type**: Multiple choice with dropdown menus

**Task Overview**: Test-takers listen to a news item about local community events, typically 1.5-2 minutes long. The news item is heard only once. After listening, 5 questions appear with dropdown menus where students choose the most appropriate option to complete statements.

## Your Task

Create an authentic CELPIP Listening Part 4 about: **{topic}**

**CRITICAL**: Return ONLY valid JSON with this exact structure:

```json
{{
  "news_item": {{
    "news_id": "news_item_unique_id",
    "title": "Brief news headline",
    "content": "Full news broadcast transcript (1.5-2 minutes when read aloud)",
    "audio_description": "Description of news broadcast setting and delivery style",
    "duration_seconds": 100,
    "topic": "Brief topic description",
    "location": "Canadian city/region where news occurred",
    "date": "Date of news event",
    "reporter": "News anchor/reporter name"
  }},
  "questions": [
    {{
      "question_id": "q1",
      "question_text": "Question statement with blank to complete",
      "question_type": "multiple_choice",
      "options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
      "correct_answer": "A",
      "explanation": "Brief explanation of why this answer is correct"
    }},
    {{
      "question_id": "q2",
      "question_text": "Question statement with blank to complete",
      "question_type": "multiple_choice",
      "options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
      "correct_answer": "B",
      "explanation": "Brief explanation of why this answer is correct"
    }},
    {{
      "question_id": "q3",
      "question_text": "Question statement with blank to complete",
      "question_type": "multiple_choice",
      "options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
      "correct_answer": "C",
      "explanation": "Brief explanation of why this answer is correct"
    }},
    {{
      "question_id": "q4",
      "question_text": "Question statement with blank to complete",
      "question_type": "multiple_choice",
      "options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
      "correct_answer": "A",
      "explanation": "Brief explanation of why this answer is correct"
    }},
    {{
      "question_id": "q5",
      "question_text": "Question statement with blank to complete",
      "question_type": "multiple_choice",
      "options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
      "correct_answer": "D",
      "explanation": "Brief explanation of why this answer is correct"
    }}
  ]
}}
```

**CRITICAL REQUIREMENTS**:
1. Generate exactly 5 questions total
2. Each question MUST test specific factual information from the news item
3. News content must include multiple testable details (dates, locations, costs, procedures, etc.)
4. Follow the official CELPIP Listening Part 4 format exactly
5. Use professional Canadian news broadcasting style
6. Include specific factual information and details that can be tested in dropdown menu format
"""

    @staticmethod
    def create_part5_prompt(topic: str) -> str:
        """Create CELPIP Listening Part 5 prompt."""
        return f"""
You are an expert CELPIP test creator with deep knowledge of the official CELPIP Listening Part 5 format ("Listening to a Discussion").

## OFFICIAL CELPIP Listening Part 5 Structure (2024-2025)

**Task Name**: Listening to a Discussion
**Duration**: Part of 47-55 minute Listening section  
**Total Questions**: 8 questions
**Question Type**: Multiple choice questions

**Task Overview**: Test-takers watch a 2-minute video discussion between multiple speakers (typically 3-4 people) in professional or academic settings. The video is shown only once. After watching, 8 questions appear and students have 4 minutes to answer all questions.

## Your Task

Create an authentic CELPIP Listening Part 5 about: **{topic}**

**CRITICAL**: Return ONLY valid JSON with this exact structure:

```json
{{
  "discussion": {{
    "discussion_id": "discussion_unique_id",
    "title": "Discussion topic/meeting title",
    "transcript": "Full transcript with speaker labels (Speaker 1, Speaker 2, Speaker 3, etc. - 2 minutes when spoken)",
    "video_description": "Description of video setting, participants, and visual elements",
    "duration_seconds": 120,
    "speakers": ["Speaker role 1", "Speaker role 2", "Speaker role 3"],
    "setting": "Professional meeting location",
    "topic": "Main discussion topic",
    "key_points": ["Key point 1", "Key point 2", "Key point 3"]
  }},
  "questions": [
    {{
      "question_id": "q1",
      "question_text": "Question about the discussion content",
      "question_type": "multiple_choice",
      "options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
      "correct_answer": "A",
      "explanation": "Brief explanation of why this answer is correct"
    }},
    {{
      "question_id": "q2",
      "question_text": "Question about the discussion content",
      "question_type": "multiple_choice",
      "options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
      "correct_answer": "B",
      "explanation": "Brief explanation of why this answer is correct"
    }},
    {{
      "question_id": "q3",
      "question_text": "Question about the discussion content",
      "question_type": "multiple_choice",
      "options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
      "correct_answer": "C",
      "explanation": "Brief explanation of why this answer is correct"
    }},
    {{
      "question_id": "q4",
      "question_text": "Question about the discussion content",
      "question_type": "multiple_choice",
      "options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
      "correct_answer": "A",
      "explanation": "Brief explanation of why this answer is correct"
    }},
    {{
      "question_id": "q5",
      "question_text": "Question about the discussion content",
      "question_type": "multiple_choice",
      "options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
      "correct_answer": "D",
      "explanation": "Brief explanation of why this answer is correct"
    }},
    {{
      "question_id": "q6",
      "question_text": "Question about the discussion content",
      "question_type": "multiple_choice",
      "options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
      "correct_answer": "B",
      "explanation": "Brief explanation of why this answer is correct"
    }},
    {{
      "question_id": "q7",
      "question_text": "Question about the discussion content",
      "question_type": "multiple_choice",
      "options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
      "correct_answer": "C",
      "explanation": "Brief explanation of why this answer is correct"
    }},
    {{
      "question_id": "q8",
      "question_text": "Question about the discussion content",
      "question_type": "multiple_choice",
      "options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
      "correct_answer": "A",
      "explanation": "Brief explanation of why this answer is correct"
    }}
  ]
}}
```

**CRITICAL REQUIREMENTS**:
1. Generate exactly 8 questions total
2. Each question MUST test understanding of the multi-speaker discussion
3. Discussion must include multiple perspectives and interactive dialogue
4. Follow the official CELPIP Listening Part 5 format exactly
5. Use professional Canadian workplace/academic discussion style
6. Include specific information and details that can be tested across different question types
7. Ensure questions distinguish between different speakers' contributions and perspectives
"""

    @staticmethod
    def create_part6_prompt(topic: str) -> str:
        """Create CELPIP Listening Part 6 prompt."""
        return f"""
You are an expert CELPIP test creator with deep knowledge of the official CELPIP Listening Part 6 format ("Listening to Viewpoints").

## OFFICIAL CELPIP Listening Part 6 Structure (2024-2025)

**Task Name**: Listening to Viewpoints
**Duration**: Part of 47-55 minute Listening section  
**Total Questions**: 6 questions
**Question Type**: Multiple choice with dropdown menus

**Task Overview**: Test-takers listen to a single speaker presenting their viewpoint on a controversial social issue. The presentation is 3-3.5 minutes long and is heard only once. After listening, 6 questions appear with dropdown menus, and students have 8 minutes to answer all questions.

## Your Task

Create an authentic CELPIP Listening Part 6 about: **{topic}**

**CRITICAL**: Return ONLY valid JSON with this exact structure:

```json
{{
  "viewpoint": {{
    "viewpoint_id": "viewpoint_unique_id",
    "title": "Viewpoint presentation title",
    "content": "Full viewpoint presentation transcript (3-3.5 minutes when spoken)",
    "audio_description": "Description of speaker and presentation delivery style",
    "duration_seconds": 200,
    "speaker": "Speaker name and credentials/role",
    "topic": "Main controversial issue",
    "position": "Speaker's clear stance on the issue",
    "key_arguments": ["Argument 1", "Argument 2", "Argument 3"],
    "supporting_evidence": ["Evidence 1", "Evidence 2", "Evidence 3"]
  }},
  "questions": [
    {{
      "question_id": "q1",
      "question_text": "Question statement about the viewpoint",
      "question_type": "multiple_choice",
      "options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
      "correct_answer": "A",
      "explanation": "Brief explanation of why this answer is correct"
    }},
    {{
      "question_id": "q2",
      "question_text": "Question statement about the viewpoint",
      "question_type": "multiple_choice",
      "options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
      "correct_answer": "B",
      "explanation": "Brief explanation of why this answer is correct"
    }},
    {{
      "question_id": "q3",
      "question_text": "Question statement about the viewpoint",
      "question_type": "multiple_choice",
      "options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
      "correct_answer": "C",
      "explanation": "Brief explanation of why this answer is correct"
    }},
    {{
      "question_id": "q4",
      "question_text": "Question statement about the viewpoint",
      "question_type": "multiple_choice",
      "options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
      "correct_answer": "A",
      "explanation": "Brief explanation of why this answer is correct"
    }},
    {{
      "question_id": "q5",
      "question_text": "Question statement about the viewpoint",
      "question_type": "multiple_choice",
      "options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
      "correct_answer": "D",
      "explanation": "Brief explanation of why this answer is correct"
    }},
    {{
      "question_id": "q6",
      "question_text": "Question statement about the viewpoint",
      "question_type": "multiple_choice",
      "options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
      "correct_answer": "B",
      "explanation": "Brief explanation of why this answer is correct"
    }}
  ]
}}
```

**CRITICAL REQUIREMENTS**:
1. Generate exactly 6 questions total
2. Each question MUST test understanding of the speaker's viewpoint and arguments
3. Presentation must be a clear opinion piece with strong position and supporting evidence
4. Follow the official CELPIP Listening Part 6 format exactly
5. Use Canadian social issues and controversial topics
6. Include specific evidence, statistics, and examples that can be tested in dropdown format
7. Ensure questions test different aspects: main position, supporting evidence, reasoning, and details
"""