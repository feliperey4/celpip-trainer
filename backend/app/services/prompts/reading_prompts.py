"""
CELPIP Reading Task Prompts

This module contains all prompts and topics for generating CELPIP Reading Tasks 1-4.
"""

from typing import List, Optional
import random


class ReadingTaskTopics:
    """Container for all CELPIP Reading task topics."""
    
    # CELPIP Reading Task 1 topics (realistic Canadian contexts)
    TASK1_TOPICS = [
        "Family reunion planning",
        "Apartment rental inquiry", 
        "Medical appointment confirmation",
        "Birthday party invitation",
        "Work schedule changes",
        "Travel arrangements",
        "Club membership information",
        "Community event announcement",
        "School parent-teacher meeting",
        "Gym membership inquiry",
        "Library book club invitation",
        "Volunteer opportunity notice",
        "Neighborhood watch meeting",
        "Car maintenance appointment",
        "Insurance claim follow-up",
        "Job interview scheduling",
        "University course registration",
        "Moving services inquiry",
        "Professional conference invitation",
        "Hockey tournament registration"
    ]
    
    TASK1_CONTEXT_TYPES = [
        "daily_life",
        "family_events", 
        "work_related",
        "community_activities",
        "personal_services",
        "educational",
        "recreational"
    ]
    
    # CELPIP Reading Task 2 topics (informational articles)
    TASK2_TOPICS = [
        "Climate change impacts in Canada",
        "Indigenous Canadian culture and traditions",
        "Canadian healthcare system",
        "Wildlife conservation in Canada",
        "Canadian immigration policies",
        "Renewable energy in Canada",
        "Canadian education system",
        "Arctic exploration and research",
        "Canadian food and agriculture",
        "Technology innovation in Canada",
        "Canadian transportation systems",
        "Urban planning in Canadian cities",
        "Canadian arts and literature",
        "Environmental protection laws",
        "Canadian economic development",
        "Mental health awareness",
        "Sustainable tourism in Canada",
        "Canadian scientific research",
        "Social media impact on society",
        "Canadian multicultural society"
    ]
    
    # CELPIP Reading Task 3 topics (academic/informational articles)
    TASK3_TOPICS = [
        "History of Canadian Confederation",
        "Canadian wildlife migration patterns",
        "Evolution of Canadian banking system",
        "Development of Canadian provinces",
        "Canadian space research programs",
        "History of Canadian railways",
        "Canadian marine ecosystem protection",
        "Development of Canadian universities",
        "Canadian mineral resources and mining",
        "History of Canadian labor movements",
        "Canadian agricultural innovations",
        "Development of Canadian legal system",
        "Canadian renewable energy projects",
        "History of Canadian broadcasting",
        "Canadian urban development patterns",
        "Evolution of Canadian healthcare",
        "Canadian Arctic sovereignty issues",
        "Development of Canadian tourism industry",
        "Canadian technological achievements",
        "History of Canadian cultural policies"
    ]
    
    # CELPIP Reading Task 4 topics (news articles with viewpoints)
    TASK4_TOPICS = [
        "Remote work vs office work debate",
        "Electric vehicles vs traditional cars",
        "Online learning vs classroom education",
        "Social media impact on society",
        "Renewable energy vs fossil fuels",
        "Public transportation funding debates",
        "Healthcare system privatization",
        "Immigration policy reforms",
        "Housing affordability crisis",
        "Minimum wage increase debates",
        "Climate change action policies",
        "Technology in education",
        "Food security and local farming",
        "Mental health support funding",
        "Urban development vs green spaces",
        "Artificial intelligence in workplace",
        "Cultural diversity in schools",
        "Senior care system reforms",
        "Youth unemployment solutions",
        "Environmental protection regulations"
    ]


class ReadingTaskPrompts:
    """Container for all CELPIP Reading task prompts."""
    
    @staticmethod
    def create_task1_prompt(topic: Optional[str] = None, context_type: Optional[str] = None) -> str:
        """Create CELPIP Reading Task 1 prompt."""
        if topic is None:
            topic = random.choice(ReadingTaskTopics.TASK1_TOPICS)
        if context_type is None:
            context_type = random.choice(ReadingTaskTopics.TASK1_CONTEXT_TYPES)
        
        return f"""
You are an expert CELPIP test creator with deep knowledge of the CELPIP Reading Task 1 format and Canadian cultural contexts.

## CELPIP Reading Task 1 Structure

**CRITICAL**: This task has TWO distinct parts with different question types:

### Part 1 (Questions 1-6): Reading Comprehension
- Direct multiple-choice questions about the EMAIL/MESSAGE content
- Test understanding of: main purpose, specific details, dates, times, people, locations
- Questions directly answerable from the original message

### Part 2 (Questions 7-11): Response Completion  
- You are given a REPLY/RESPONSE to the original message
- The reply has 5 blanks that need to be filled
- Each blank is a multiple-choice question (4 options A, B, C, D)
- Test ability to complete appropriate responses in context

## Your Task

Create a realistic CELPIP Reading Task 1 about: **{topic}**
Context: {context_type} | Difficulty: high difficult (professional Canadian English level)

### 1. Original Email/Message
- Must have 300-400 words
- Include specific Canadian details: dates, times, places, names, phone numbers
- Use natural, conversational tone appropriate for the context
- Include enough detail to support 6 comprehension questions
- Make it authentic to Canadian daily life situations

### 2. Part 1 Questions (1-6): About the Original Message
Create 6 multiple-choice questions testing:
- Main purpose/intent
- Specific factual details (who, what, when, where)
- Implicit information and logical inferences
- Tone and context understanding

### 3. Reply Message with Blanks (7-11 questions)
- Must have 100-150 words
- Create a realistic REPLY to the original message
- Include 5 strategic blanks (____) with the question number at the end of the lines that test:
  - Appropriate vocabulary in context
  - Grammar and sentence structure
  - Logical flow and coherence
  - Politeness and tone consistency
  - Cultural appropriateness

### 4. Part 2 Questions (7-11): Complete the Reply
For each blank, provide 4 options that test:
- Contextually appropriate word choice
- Grammatical correctness
- Logical coherence with the message flow
- Canadian English expressions and formality levels

## Quality Standards
- Use realistic Canadian names, places, and contexts
- Include specific details: exact dates, times, addresses, phone numbers
- Ensure questions have ONE clearly correct answer
- Make distractors plausible but clearly incorrect
- Use authentic Canadian English expressions and cultural references

**CRITICAL**: Return ONLY valid JSON with this exact structure:

```json
{{
  "passage": {{
    "title": "Email subject line",
    "content": "Complete original email/message content here... (MUST have 300-370 words)",
    "passage_type": "email",
    "context": "{context_type}"
  }},
  "reply_passage": {{
    "content": "Complete reply message with 5 blanks marked as _____(7), _____(8), _____(9), _____(10), _____(11) (MUST have 100-140 words)"
  }},
  "questions": [
    {{
      "question_id": "q1",
      "question_text": "Question 1 about original message",
      "options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
      "correct_answer": "A",
      "explanation": "Why this answer is correct"
    }},
    {{
      "question_id": "q7",
      "question_text": "Question 7: Choose the best option for blank 1 in the reply",
      "options": ["A. Option for blank", "B. Option for blank", "C. Option for blank", "D. Option for blank"],
      "correct_answer": "B",
      "explanation": "Why this option fits the context"
    }}
  ]
}}
```

**Important**
- Generate exactly 11 questions total: 6 for the original message + 5 for completing the reply.

"""

    @staticmethod
    def create_task2_prompt(topic: str) -> str:
        """Create CELPIP Reading Task 2 prompt."""
        return f"""
You are an expert CELPIP test creator with deep knowledge of the official CELPIP Reading Task 2 format ("Reading to Apply a Diagram").

## OFFICIAL CELPIP Reading Task 2 Structure

**Task Name**: Reading to Apply a Diagram
**Duration**: 9 minutes total
**Total Questions**: 8 questions (5 blank completion + 3 statement completion)

**Task Overview**: This task relates a diagram to an email. Test-takers must understand information from a diagram and apply it to complete an email, then answer statements about the email content.

## Your Task

Create an authentic CELPIP Reading Task 2 about: **{topic}**

### 1. Create a Diagram (in MARKDOWN format)

**Diagram Requirements**:
- Must contain organized information relevant to {topic}
- Include 5+ specific data points that can be referenced in the email
- Use MARKDOWN formatting: tables, lists, headings, bold text
- Present information in a structured format (table, flowchart, comparison chart, etc.)
- Include Canadian context where relevant

**Markdown Formatting Examples**:
- Use `| Header 1 | Header 2 | Header 3 |` for tables
- Use `- Item 1`, `- Item 2` for lists
- Use `**bold text**` for emphasis
- Use `## Heading` for section headers

**Example Diagram Types**:
- Transportation options with class, price, duration (as markdown table)
- Service plans with features, costs, availability (as markdown table)
- Educational programs with requirements, duration, fees (as markdown table)
- Product comparisons with specifications, prices, ratings (as markdown table)
- Event schedules with times, locations, costs (as markdown table)

### 2. Create an Email (200-300 words)

**Email Requirements**:
- Personal or work-related context
- Contains exactly 5 blanks that must be filled using diagram information with the question number at the end of the lines
- Blanks should correspond directly to specific information in the diagram
- Natural, conversational tone appropriate for the context
- Canadian cultural context and expressions
- Clear relationship between email content and diagram data

**Email Structure**:
- Appropriate subject line
- Greeting and context setup
- Main content with 5 strategically placed blanks
- Closing that connects to the overall purpose

### 3. Question Structure (exactly 8 questions)

**Part A - Fill in the Blanks (5 questions)**:
- Each blank corresponds to specific information in the diagram
- 4 multiple choice options (A, B, C, D) for each blank
- Options should include data directly from the diagram
- One clearly correct answer based on context and diagram information

**Part B - Statement Completion (3 questions)**:
- Statements about the email content and context
- Require inference and understanding beyond just diagram data
- Test comprehension of the email's purpose, tone, or implications
- 4 multiple choice options (A, B, C, D) for each statement

### 4. Quality Standards

**Diagram Integration**:
- Blanks must logically connect to diagram information
- Information should be clearly identifiable in the diagram
- Avoid ambiguous or unclear connections

**Email Authenticity**:
- Natural flow and realistic purpose
- Appropriate formality level for the context
- Canadian cultural references and communication style

**Question Quality**:
- Clear, unambiguous correct answers
- Plausible distractors that require careful reading
- Progressive difficulty throughout the task

**CRITICAL**: Return ONLY valid JSON with this exact structure:

```json
{{
  "passage": {{
    "title": "Email subject line",
    "content": "Complete email with exactly 5 blanks marked as _____(1), _____(2), _____(3), _____(4), _____(5)",
    "passage_type": "email_with_diagram",
    "topic": "{topic}",
    "word_count": 250
  }},
  "diagram_description": "Detailed description of the diagram in MARKDOWN format with tables, lists, and proper formatting for easy reading",
  "questions": [
    {{
      "question_id": "q1",
      "question_text": "Blank 1: Choose the best option to complete the email",
      "options": ["A. Option from diagram", "B. Option from diagram", "C. Option from diagram", "D. Option from diagram"],
      "correct_answer": "A",
      "explanation": "Explanation referencing specific diagram information"
    }},
    {{
      "question_id": "q2",
      "question_text": "Blank 2: Choose the best option to complete the email",
      "options": ["A. Option", "B. Option", "C. Option", "D. Option"],
      "correct_answer": "B",
      "explanation": "Explanation with diagram reference"
    }},
    {{
      "question_id": "q3",
      "question_text": "Blank 3: Choose the best option to complete the email",
      "options": ["A. Option", "B. Option", "C. Option", "D. Option"],
      "correct_answer": "C",
      "explanation": "Explanation with diagram reference"
    }},
    {{
      "question_id": "q4",
      "question_text": "Blank 4: Choose the best option to complete the email",
      "options": ["A. Option", "B. Option", "C. Option", "D. Option"],
      "correct_answer": "A",
      "explanation": "Explanation with diagram reference"
    }},
    {{
      "question_id": "q5",
      "question_text": "Blank 5: Choose the best option to complete the email",
      "options": ["A. Option", "B. Option", "C. Option", "D. Option"],
      "correct_answer": "D",
      "explanation": "Explanation with diagram reference"
    }},
    {{
      "question_id": "q6",
      "question_text": "Statement 1: Based on the email, what can be concluded about...",
      "options": ["A. Inference option", "B. Inference option", "C. Inference option", "D. Inference option"],
      "correct_answer": "B",
      "explanation": "Explanation based on email context and content"
    }},
    {{
      "question_id": "q7",
      "question_text": "Statement 2: The purpose of this email is to...",
      "options": ["A. Purpose option", "B. Purpose option", "C. Purpose option", "D. Purpose option"],
      "correct_answer": "A",
      "explanation": "Explanation based on email analysis"
    }},
    {{
      "question_id": "q8",
      "question_text": "Statement 3: According to the email, the writer feels...",
      "options": ["A. Feeling/tone option", "B. Feeling/tone option", "C. Feeling/tone option", "D. Feeling/tone option"],
      "correct_answer": "C",
      "explanation": "Explanation based on tone and context analysis"
    }}
  ]
}}
```

Generate exactly 8 questions following the official CELPIP Reading Task 2 format: 5 blank completion + 3 statement completion.
"""

    @staticmethod
    def create_task3_prompt(topic: str) -> str:
        """Create CELPIP Reading Task 3 prompt."""
        return f"""
You are an expert CELPIP test creator with deep knowledge of the official CELPIP Reading Task 3 format ("Reading for Information").

## OFFICIAL CELPIP Reading Task 3 Structure

**Task Name**: Reading for Information
**Duration**: 10 minutes total
**Total Questions**: 9 statements to match to paragraphs

**Task Overview**: Test-takers read a longer, more academic passage divided into 4 labeled paragraphs (A, B, C, D) and match 9 statements to the correct paragraph. Option E means "information not given in any paragraph."

## Your Task

Create an authentic CELPIP Reading Task 3 about: **{topic}**

### 1. Create an Academic Article (500-700 words total)

**Article Structure**: Exactly 4 paragraphs labeled A, B, C, D

**Paragraph Requirements**:
- **Paragraph A** (125-175 words): Introduction and overview of the topic
- **Paragraph B** (125-175 words): First main aspect/subtopic with specific details
- **Paragraph C** (125-175 words): Second main aspect/subtopic with specific details  
- **Paragraph D** (125-175 words): Third main aspect/conclusions/future implications

**Content Standards**:
- **Academic tone**: Formal, objective, informative writing style
- **Canadian context**: Include Canadian examples, statistics, institutions, or perspectives
- **Specific details**: Include dates, numbers, percentages, names, locations
- **Complex vocabulary**: University-level terminology appropriate for advanced readers
- **Clear structure**: Each paragraph should focus on distinct aspects of the topic
- **Factual information**: Present information that can be clearly identified and located

**Topics suitable for Task 3**:
- Science and technology
- History and current events  
- Health and lifestyle
- Education and business
- Environmental issues
- Social and cultural topics

### 2. Create 9 Matching Statements

**Statement Requirements**:
- Each statement tests ability to locate specific information in the passage
- 2-3 statements should match to each paragraph (A, B, C, D)
- 1-2 statements should be "E" (information not given)
- Statements should require careful reading and comprehension
- Include a mix of factual details and inferential information

**Statement Distribution**:
- **Paragraph A matches** (2 statements): Information from introduction/overview
- **Paragraph B matches** (2-3 statements): Information from first main section
- **Paragraph C matches** (2-3 statements): Information from second main section  
- **Paragraph D matches** (2 statements): Information from conclusions/implications
- **Option E** (1-2 statements): Information not mentioned anywhere in the passage

**Question Types**:
- Specific facts (dates, numbers, names, locations)
- Main ideas and purposes
- Cause and effect relationships
- Comparisons and contrasts
- Examples and supporting details
- Future predictions or implications

**Quality Standards**:
- Each statement should have ONE clearly correct answer
- Distractors (incorrect options) should be plausible but clearly wrong
- Information should be explicitly stated or clearly inferable
- Avoid ambiguous or unclear connections

**CRITICAL**: Return ONLY valid JSON with this exact structure:

```json
{{
  "passage": {{
    "title": "Academic article title about {topic}",
    "paragraph_a": "Complete paragraph A content (125-175 words)...",
    "paragraph_b": "Complete paragraph B content (125-175 words)...", 
    "paragraph_c": "Complete paragraph C content (125-175 words)...",
    "paragraph_d": "Complete paragraph D content (125-175 words)...",
    "passage_type": "informational",
    "topic": "{topic}",
    "word_count": 600
  }},
  "questions": [
    {{
      "question_id": "q1",
      "statement": "Statement 1 about specific information in the passage",
      "correct_answer": "A",
      "explanation": "This information is found in paragraph A where it states..."
    }},
    {{
      "question_id": "q2",
      "statement": "Statement 2 about different information in the passage", 
      "correct_answer": "B",
      "explanation": "This information is found in paragraph B where it mentions..."
    }},
    {{
      "question_id": "q3",
      "statement": "Statement 3 about information not mentioned in the passage",
      "correct_answer": "E", 
      "explanation": "This information is not provided anywhere in the passage"
    }}
  ]
}}
```

Generate exactly 9 statements following the official CELPIP Reading Task 3 format with proper distribution across paragraphs A-D and option E.
"""

    @staticmethod
    def create_task4_prompt(topic: str) -> str:
        """Create CELPIP Reading Task 4 prompt."""
        return f"""
You are an expert CELPIP test creator with deep knowledge of the official CELPIP Reading Task 4 format ("Reading for Viewpoints").

## OFFICIAL CELPIP Reading Task 4 Structure

**Task Name**: Reading for Viewpoints
**Duration**: 13 minutes total
**Total Questions**: 10 questions (5 about article content + 5 fill-in-the-blank for comment)

**Task Overview**: Test-takers read a news article presenting multiple viewpoints on a topic, then answer questions about different perspectives. Additionally, they complete a reader's comment by filling in blanks.

## Your Task

Create an authentic CELPIP Reading Task 4 about: **{topic}**

### 1. Create a News Article (400-500 words)

**Article Structure**: 4-5 paragraphs with multiple viewpoints

**Paragraph Requirements**:
- **Paragraph 1** (100-120 words): Introduction to the topic and overview of the debate
- **Paragraph 2** (100-120 words): First person's viewpoint with specific arguments and reasoning
- **Paragraph 3** (100-120 words): Second person's contrasting viewpoint with different arguments
- **Paragraph 4** (100-120 words): Third perspective or additional considerations
- **Paragraph 5** (80-100 words): Conclusion or summary of the different positions

**Content Standards**:
- **News article format**: Professional journalism style with clear attribution
- **Multiple speakers**: Include 2-3 named individuals with distinct viewpoints
- **Canadian context**: Include Canadian examples, references, or perspectives
- **Contrasting opinions**: Ensure viewpoints clearly oppose or differ from each other
- **Specific details**: Include facts, statistics, quotes, and concrete examples
- **Clear attribution**: Make it clear who holds which viewpoint

### 2. Create a Reader's Comment (150-200 words)

**Comment Requirements**:
- Written as if posted by a website visitor responding to the article
- Contains exactly 5 strategic blanks marked as _____(6), _____(7), _____(8), _____(9), _____(10)
- Natural, informal tone appropriate for online comments
- References specific points from the article
- Expresses a clear opinion on the topic
- Blanks should test vocabulary, tone, and logical flow

### 3. Article Questions (Questions 1-5)

Create 5 multiple-choice questions testing:
- **Viewpoint identification**: "According to [Person X], what is the main benefit of..."
- **Perspective comparison**: "How do [Person A] and [Person B] differ in their views on..."
- **Supporting evidence**: "What evidence does [Person Y] provide for their position?"
- **Implied meaning**: "What can be inferred about [Person Z]'s attitude toward..."
- **Main arguments**: "The primary concern expressed by [Person W] is..."

### 4. Comment Completion Questions (Questions 6-10)

For each blank in the comment, provide 4 options that test:
- **Appropriate tone**: Formal vs informal language suitable for comments
- **Logical flow**: Words/phrases that maintain coherence
- **Opinion expression**: Language that conveys the commenter's stance
- **Contextual fit**: Vocabulary that connects to the article content

### Quality Standards

**Authentic Format**:
- Realistic news article structure with proper headlines
- Natural comment section language and style
- Clear distinction between different speakers' viewpoints

**Question Quality**:
- Each question has ONE clearly correct answer
- Distractors are plausible but clearly incorrect
- Questions require careful reading and understanding of perspectives
- Comment blanks test natural language flow and appropriateness

**CRITICAL**: Return ONLY valid JSON with this exact structure:

```json
{{
  "passage": {{
    "title": "News article headline about {topic}",
    "article_content": "Complete news article with multiple viewpoints and clear speaker attribution...",
    "comment_content": "Reader's comment with exactly 5 blanks marked as _____(6), _____(7), _____(8), _____(9), _____(10)",
    "passage_type": "news_viewpoints",
    "topic": "{topic}",
    "word_count": 650
  }},
  "questions": [
    {{
      "question_id": "q1",
      "question_text": "According to [Speaker 1], what is the main advantage of...",
      "question_type": "article",
      "options": ["A. First viewpoint option", "B. Second viewpoint option", "C. Third viewpoint option", "D. Fourth viewpoint option"],
      "correct_answer": "A",
      "explanation": "Explanation referencing specific part of the article"
    }},
    {{
      "question_id": "q6",
      "question_text": "Choose the best option for blank 1 in the comment",
      "question_type": "comment",
      "options": ["A. Comment option", "B. Comment option", "C. Comment option", "D. Comment option"],
      "correct_answer": "B",
      "explanation": "Explanation of why this option fits the tone and context",
      "blank_position": 1
    }}
  ]
}}
```

Generate exactly 10 questions following the official CELPIP Reading Task 4 format: 5 questions about article viewpoints + 5 questions for comment completion.
"""