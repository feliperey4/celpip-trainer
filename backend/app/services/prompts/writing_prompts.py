"""
CELPIP Writing Task Prompts

This module contains all prompts and topics for generating CELPIP Writing Tasks.
"""

from typing import List
import random


class WritingTaskTopics:
    """Container for all CELPIP Writing task topics."""
    
    # CELPIP Writing Task 1 scenarios (email writing with Canadian contexts)
    TASK1_SCENARIOS = [
        {
            "context": "Housing/Accommodation Issues",
            "scenarios": [
                "Elevator in apartment building out of service for over a week",
                "Heating system malfunction in winter apartment",
                "Noisy neighbors disrupting sleep in condo building",
                "Parking space assignment issue in residential building",
                "Water damage from upstairs apartment unit",
                "Request for air conditioning repair in rental unit",
                "Complaint about delayed snow removal in parking lot",
                "Request for building security improvement measures",
                "Garbage disposal system problems in apartment complex",
                "Request for common area renovation approval"
            ]
        },
        {
            "context": "Travel and Tourism",
            "scenarios": [
                "Inquiring about northern lights tour package to Yellowknife",
                "Requesting information about Banff National Park hiking tours",
                "Booking family vacation package to Prince Edward Island",
                "Inquiry about whale watching tours in Newfoundland",
                "Planning ski trip to Whistler for winter holidays",
                "Requesting travel insurance information for cross-Canada trip",
                "Booking guided tour of Parliament Hill in Ottawa",
                "Inquiry about ice fishing experience in Manitoba",
                "Planning weekend getaway to Niagara Falls",
                "Requesting information about Aurora viewing in Northwest Territories"
            ]
        },
        {
            "context": "Professional/Business",
            "scenarios": [
                "Requesting time off for family emergency",
                "Organizing team-building event at local adventure park",
                "Complaint about office equipment malfunction",
                "Requesting workplace accommodation for medical condition",
                "Proposing flexible work arrangement for better work-life balance",
                "Following up on job interview conducted last week",
                "Requesting professional development training opportunity",
                "Complaint about workplace harassment incident",
                "Requesting reference letter from previous employer",
                "Proposing cost-saving initiative for company operations"
            ]
        },
        {
            "context": "Educational/Academic",
            "scenarios": [
                "International student requesting library book replacement after loss",
                "Requesting extension for assignment due to family circumstances",
                "Complaint about course registration system technical issues",
                "Inquiry about scholarship opportunities for next semester",
                "Requesting information about co-op program placement",
                "Complaint about cafeteria food quality and service",
                "Requesting accommodation for exam due to medical condition",
                "Inquiry about changing major program requirements",
                "Requesting transcript for graduate school application",
                "Complaint about parking fees increase on campus"
            ]
        },
        {
            "context": "Community Services",
            "scenarios": [
                "Complaint about delayed garbage collection in neighborhood",
                "Requesting information about community center swimming classes",
                "Inquiry about volunteer opportunities at local food bank",
                "Complaint about streetlight outage affecting neighborhood safety",
                "Requesting dog park installation in residential area",
                "Inquiry about municipal recycling program expansion",
                "Complaint about public transit schedule changes",
                "Requesting community garden space allocation",
                "Inquiry about snow removal schedule for winter",
                "Requesting speed bump installation for traffic safety"
            ]
        },
        {
            "context": "Healthcare Services",
            "scenarios": [
                "Requesting appointment rescheduling due to work conflict",
                "Complaint about long waiting times at walk-in clinic",
                "Inquiry about specialist referral process and timeline",
                "Requesting medical records transfer to new province",
                "Complaint about prescription medication error at pharmacy",
                "Inquiry about provincial health card renewal process",
                "Requesting second opinion consultation for medical condition",
                "Complaint about billing error for medical services",
                "Inquiry about mental health counseling services coverage",
                "Requesting interpretation services for medical appointment"
            ]
        },
        {
            "context": "Personal/Social",
            "scenarios": [
                "Thanking friend for help during difficult time",
                "Apologizing for missing important birthday celebration",
                "Inviting family to holiday dinner gathering",
                "Declining wedding invitation due to prior commitment",
                "Congratulating friend on job promotion success",
                "Requesting advice about relationship problems",
                "Informing about moving to different city",
                "Organizing surprise party for mutual friend",
                "Sharing exciting news about engagement announcement",
                "Requesting favor for pet-sitting during vacation"
            ]
        },
        {
            "context": "Financial Services",
            "scenarios": [
                "Complaint about unauthorized charges on credit card",
                "Inquiry about mortgage pre-approval process",
                "Requesting bank account closure procedures",
                "Complaint about ATM machine malfunction",
                "Inquiry about investment portfolio performance review",
                "Requesting credit limit increase on existing account",
                "Complaint about banking fees increase notification",
                "Inquiry about RRSP contribution limits and benefits",
                "Requesting loan application status update",
                "Complaint about online banking security concerns"
            ]
        },
        {
            "context": "Consumer Services",
            "scenarios": [
                "Returning defective electronics purchased online",
                "Complaint about delayed delivery of important package",
                "Requesting refund for cancelled gym membership",
                "Inquiry about warranty coverage for appliance repair",
                "Complaint about poor customer service experience",
                "Requesting product exchange for wrong size clothing",
                "Inquiry about loyalty program benefits and rewards",
                "Complaint about misleading advertisement claims",
                "Requesting price match for competitor's offer",
                "Inquiry about extended warranty options available"
            ]
        },
        {
            "context": "Employment",
            "scenarios": [
                "Following up on job application submitted online",
                "Requesting salary negotiation discussion meeting",
                "Declining job offer due to better opportunity",
                "Requesting recommendation letter from former supervisor",
                "Inquiry about benefits package details and coverage",
                "Complaint about workplace discrimination incident",
                "Requesting interview rescheduling due to emergency",
                "Thanking interviewer for time and consideration",
                "Inquiry about remote work policy options",
                "Requesting performance review feedback meeting"
            ]
        }
    ]
    
    # CELPIP Writing Task 2 survey topics (responding to survey questions)
    TASK2_SURVEYS = [
        {
            "category": "Education & Learning",
            "surveys": [
                {
                    "title": "Online vs. Traditional Learning",
                    "description": "A Canadian education organization is studying learning preferences.",
                    "question": "Which learning method do you prefer for professional development?",
                    "options": [
                        "Online courses with flexible scheduling",
                        "Traditional classroom instruction with face-to-face interaction"
                    ]
                },
                {
                    "title": "Study Abroad Programs",
                    "description": "A university is planning international exchange programs.",
                    "question": "What type of study abroad experience would benefit students most?",
                    "options": [
                        "One-year full immersion in a foreign university",
                        "Short-term summer programs with cultural activities"
                    ]
                },
                {
                    "title": "Educational Technology",
                    "description": "A school board is investing in new learning technologies.",
                    "question": "Which technology investment would most improve student learning?",
                    "options": [
                        "Individual tablets for each student",
                        "Interactive smart boards in every classroom"
                    ]
                }
            ]
        },
        {
            "category": "Work & Career",
            "surveys": [
                {
                    "title": "Work-Life Balance Policies",
                    "description": "A company is reviewing employee wellness policies.",
                    "question": "Which policy would most improve employee satisfaction?",
                    "options": [
                        "Four-day work week with longer daily hours",
                        "Flexible daily hours with five working days"
                    ]
                },
                {
                    "title": "Professional Development",
                    "description": "An employer is planning professional development programs.",
                    "question": "What type of training would most benefit your career growth?",
                    "options": [
                        "Leadership and management skills training",
                        "Technical skills and industry certification programs"
                    ]
                },
                {
                    "title": "Remote Work Options",
                    "description": "A company is establishing remote work policies.",
                    "question": "Which remote work arrangement would you prefer?",
                    "options": [
                        "Fully remote work from home",
                        "Hybrid model with 2-3 office days per week"
                    ]
                }
            ]
        },
        {
            "category": "Community & Environment",
            "surveys": [
                {
                    "title": "Public Transportation",
                    "description": "The city is planning transportation improvements.",
                    "question": "Which transportation project should the city prioritize?",
                    "options": [
                        "Expanding bus routes to serve more neighborhoods",
                        "Building a light rail system for faster commutes"
                    ]
                },
                {
                    "title": "Green Energy Initiatives",
                    "description": "A municipality is investing in renewable energy projects.",
                    "question": "Which green energy initiative would benefit the community most?",
                    "options": [
                        "Solar panel installation on public buildings",
                        "Wind farm development in surrounding areas"
                    ]
                },
                {
                    "title": "Community Recreation",
                    "description": "The city is planning new recreational facilities.",
                    "question": "Which facility would best serve community needs?",
                    "options": [
                        "Multi-purpose community center with meeting rooms",
                        "Outdoor sports complex with playing fields"
                    ]
                }
            ]
        },
        {
            "category": "Health & Lifestyle",
            "surveys": [
                {
                    "title": "Healthcare Accessibility",
                    "description": "A health authority is improving patient services.",
                    "question": "Which improvement would most benefit patients?",
                    "options": [
                        "Extended clinic hours including evenings and weekends",
                        "More specialists available for faster referrals"
                    ]
                },
                {
                    "title": "Fitness and Wellness",
                    "description": "A wellness organization is studying exercise preferences.",
                    "question": "Which approach to fitness would you find most motivating?",
                    "options": [
                        "Group fitness classes with social interaction",
                        "Individual training programs with personal goals"
                    ]
                },
                {
                    "title": "Mental Health Support",
                    "description": "A workplace is enhancing mental health services.",
                    "question": "Which mental health resource would be most helpful?",
                    "options": [
                        "On-site counseling services during work hours",
                        "Mental health apps and online support tools"
                    ]
                }
            ]
        },
        {
            "category": "Technology & Innovation",
            "surveys": [
                {
                    "title": "Smart City Technology",
                    "description": "A city is implementing smart technology initiatives.",
                    "question": "Which smart city feature would improve daily life most?",
                    "options": [
                        "Smart traffic lights that reduce commute times",
                        "City-wide free WiFi in all public spaces"
                    ]
                },
                {
                    "title": "Digital Payment Systems",
                    "description": "A business association is studying payment preferences.",
                    "question": "Which payment method do you prefer for daily purchases?",
                    "options": [
                        "Contactless mobile payments using smartphones",
                        "Traditional credit and debit cards with chip technology"
                    ]
                },
                {
                    "title": "Artificial Intelligence",
                    "description": "A research institute is studying AI implementation preferences.",
                    "question": "In which area should AI technology be prioritized?",
                    "options": [
                        "Healthcare diagnostics and treatment planning",
                        "Transportation systems and autonomous vehicles"
                    ]
                }
            ]
        },
        {
            "category": "Housing & Urban Planning",
            "surveys": [
                {
                    "title": "Affordable Housing Solutions",
                    "description": "A city planning department is addressing housing needs.",
                    "question": "Which housing approach would best address affordability?",
                    "options": [
                        "Building more high-density apartment complexes",
                        "Providing subsidies for first-time home buyers"
                    ]
                },
                {
                    "title": "Neighborhood Development",
                    "description": "A municipality is planning neighborhood improvements.",
                    "question": "Which development priority would most improve quality of life?",
                    "options": [
                        "More parks and green spaces for recreation",
                        "Shopping centers and commercial services nearby"
                    ]
                },
                {
                    "title": "Heritage Preservation",
                    "description": "A city is balancing development with heritage conservation.",
                    "question": "How should the city approach heritage buildings?",
                    "options": [
                        "Preserve historic buildings and adapt them for modern use",
                        "Replace old buildings with modern, energy-efficient structures"
                    ]
                }
            ]
        }
    ]
    
    # Email recipients and relationships
    RECIPIENTS = {
        "formal": [
            "Property Manager",
            "Customer Service Representative", 
            "HR Manager",
            "Academic Advisor",
            "City Councillor",
            "Healthcare Provider",
            "Bank Manager",
            "Insurance Agent",
            "Service Provider",
            "Supervisor"
        ],
        "informal": [
            "Best Friend",
            "Close Friend",
            "Family Member",
            "Roommate",
            "Colleague",
            "Neighbor",
            "Classmate",
            "Study Partner",
            "Team Member",
            "Workout Buddy"
        ]
    }
    
    # Email purposes and tones
    PURPOSES = [
        "complaint", "inquiry", "request", "invitation", "apology", 
        "congratulations", "information seeking", "follow-up", 
        "suggestion", "thank you", "notification", "cancellation"
    ]


class WritingTaskPrompts:
    """Container for all CELPIP Writing task prompts."""
    
    @staticmethod
    def create_task1_prompt() -> str:
        """Create CELPIP Writing Task 1 prompt."""
        
        # Select random scenario
        context_group = random.choice(WritingTaskTopics.TASK1_SCENARIOS)
        context = context_group["context"]
        scenario = random.choice(context_group["scenarios"])
        
        # Determine formality based on context
        if context in ["Professional/Business", "Educational/Academic", "Healthcare Services", "Financial Services", "Consumer Services"]:
            formality = "formal"
        else:
            formality = random.choice(["formal", "informal"])
        
        recipient = random.choice(WritingTaskTopics.RECIPIENTS[formality])
        purpose = random.choice(WritingTaskTopics.PURPOSES)
        
        return f"""
You are an expert CELPIP test creator with deep knowledge of the official CELPIP Writing Task 1 format ("Writing an Email").

## OFFICIAL CELPIP Writing Task 1 Structure (2024-2025)

**Task Name**: Writing an Email
**Duration**: 27 minutes total
**Word Count**: 150-200 words (recommended ~190-200 words for full development)
**Task Type**: Email writing response to a given situation

**Task Overview**: Test-takers must write an email responding to a specific situation. The email must address all key points from the prompt, use appropriate tone and format, and demonstrate clear communication skills in Canadian English context.

## Your Task

Create an authentic CELPIP Writing Task 1 about: **{scenario}**
Context: {context} | Recipient: {recipient} | Purpose: {purpose}

### Key Requirements for Email Task Generation

**Scenario Development**:
- Create a realistic Canadian context that requires an email response
- Include specific details that test-takers must address
- Provide clear relationship context (formal/informal, personal/professional)
- Include 3-4 specific points that must be covered in the response

**Email Structure Requirements**:
- **Greeting**: Appropriate for relationship and formality level
- **Introduction**: Clear statement of purpose 
- **Body**: 2-3 paragraphs addressing all key points
- **Conclusion**: Appropriate closing and next steps
- **Sign-off**: Professional or personal based on context

**Tone and Language**:
- Must match the relationship (formal for business, informal for friends)
- Canadian English expressions and cultural context
- Professional communication standards where appropriate
- Natural, conversational flow for personal emails

**Assessment Criteria**:
- **Content**: Addresses all required points completely
- **Organization**: Clear structure with logical flow
- **Language Use**: Appropriate vocabulary and grammar
- **Tone**: Matches situation and recipient appropriately

### Quality Standards

**Authenticity Requirements**:
- Use realistic Canadian scenarios and cultural references
- Include specific details that require thoughtful response
- Natural communication situations people encounter in Canada
- Appropriate level of formality for the context

**Task Complexity**:
- Multiple points to address (typically 3-4 key elements)
- Requires decision-making and personal response
- Tests both language skills and practical communication
- Situations that allow for individual voice and style

**CRITICAL**: Return ONLY valid JSON with this exact structure:

```json
{{
  "scenario": {{
    "scenario_id": "scenario_unique_id",
    "title": "Brief scenario title (e.g., 'Apartment Heating Issue')",
    "context": "Detailed situation description explaining the circumstances, what happened, and why an email response is needed. Include specific details, dates, and relevant background information (100-150 words).",
    "recipient": "{recipient}",
    "purpose": "{purpose}",
    "key_points": [
      "First specific point that must be addressed in the email",
      "Second specific point that must be addressed in the email", 
      "Third specific point that must be addressed in the email",
      "Fourth specific point that must be addressed in the email (if applicable)"
    ],
    "tone": "{'formal' if formality == 'formal' else 'informal/friendly'}",
    "relationship": "{'professional' if formality == 'formal' else 'personal'}"
  }}
}}
```

**CRITICAL REQUIREMENTS**:
1. Create a realistic Canadian scenario requiring email response
2. Include 3-4 specific points that must be addressed
3. Ensure tone and formality match the recipient and situation
4. Provide sufficient detail for test-takers to write 150-200 words
5. Follow authentic CELPIP Writing Task 1 format exactly
6. Use Canadian cultural context and communication norms
"""

    @staticmethod
    def get_random_scenario() -> dict:
        """Get a random writing scenario for quick generation."""
        context_group = random.choice(WritingTaskTopics.TASK1_SCENARIOS)
        context = context_group["context"]
        scenario = random.choice(context_group["scenarios"])
        
        # Determine formality
        if context in ["Professional/Business", "Educational/Academic", "Healthcare Services", "Financial Services", "Consumer Services"]:
            formality = "formal"
        else:
            formality = random.choice(["formal", "informal"])
        
        recipient = random.choice(WritingTaskTopics.RECIPIENTS[formality])
        purpose = random.choice(WritingTaskTopics.PURPOSES)
        
        return {
            "context": context,
            "scenario": scenario,
            "recipient": recipient,
            "purpose": purpose,
            "formality": formality
        }
    
    @staticmethod
    def create_review_prompt(user_text: str, scenario_title: str, scenario_context: str, 
                           recipient: str, purpose: str, tone: str, key_points: list, 
                           word_count_min: int, word_count_max: int) -> str:
        """Create CELPIP Writing Task 1 review prompt."""
        
        key_points_str = "\n".join([f"- {point}" for point in key_points])
        
        return f"""
You are an expert CELPIP Writing Task 1 assessor with deep knowledge of the official CELPIP scoring rubric and assessment criteria.

## OFFICIAL CELPIP Writing Task 1 Assessment Criteria

### **Scoring Scale**: 1-12 (matching official CELPIP scale)
- **1-2**: Inadequate
- **3-4**: Developing  
- **5-6**: Adequate
- **7-8**: Good
- **9-10**: Very Good
- **11-12**: Excellent

### **Four Assessment Dimensions**:

#### **1. Content & Coherence (25%)**
- **Adequacy of content**: All key points addressed completely
- **Unity and focus**: Clear central theme maintained
- **Logical development**: Ideas flow naturally and logically
- **Relevance**: Content directly addresses the task requirements

#### **2. Vocabulary (25%)**
- **Range**: Variety of vocabulary used appropriately
- **Precision**: Exact word choice for intended meaning
- **Idiomatic usage**: Natural, colloquial expressions
- **Appropriateness**: Vocabulary matches tone and context

#### **3. Readability (25%)**
- **Grammar**: Correct verb tenses, sentence structure
- **Mechanics**: Spelling, punctuation, capitalization
- **Sentence variety**: Mix of simple and complex structures
- **Clarity**: Easy to understand and follow

#### **4. Task Fulfillment (25%)**
- **Format**: Proper email structure and conventions
- **Tone**: Appropriate for recipient and situation
- **Completeness**: All required elements included
- **Register**: Formal/informal language matches context

## **Original Task Requirements**

**Scenario**: {scenario_title}
**Context**: {scenario_context}
**Recipient**: {recipient}
**Purpose**: {purpose}
**Required Tone**: {tone}
**Word Count**: {word_count_min}-{word_count_max} words

**Key Points to Address**:
{key_points_str}

## **User's Email Submission**

```
{user_text}
```

## **Your Assessment Task**

Provide a comprehensive CELPIP Writing Task 1 assessment following the official scoring rubric. Analyze the submission against all four criteria and provide actionable feedback.

**CRITICAL**: Return ONLY valid JSON with this exact structure:

```json
{{
  "overall_score": 8,
  "content_coherence": {{
    "score": 8,
    "feedback": "Detailed analysis of content quality, organization, and coherence",
    "strengths": ["Specific strength 1", "Specific strength 2"],
    "areas_for_improvement": ["Specific area to improve 1", "Specific area to improve 2"],
    "examples": ["Quote from text showing strength/weakness"]
  }},
  "vocabulary": {{
    "score": 7,
    "feedback": "Analysis of vocabulary range, precision, and appropriateness",
    "strengths": ["Vocabulary strength 1", "Vocabulary strength 2"],
    "areas_for_improvement": ["Vocabulary improvement 1", "Vocabulary improvement 2"],
    "examples": ["Example of good/weak vocabulary use"]
  }},
  "readability": {{
    "score": 8,
    "feedback": "Assessment of grammar, mechanics, and sentence structure",
    "strengths": ["Grammar strength 1", "Grammar strength 2"],
    "areas_for_improvement": ["Grammar improvement 1", "Grammar improvement 2"],
    "examples": ["Example of correct/incorrect grammar"]
  }},
  "task_fulfillment": {{
    "score": 9,
    "feedback": "Evaluation of format, tone, completeness, and register",
    "strengths": ["Task fulfillment strength 1", "Task fulfillment strength 2"],
    "areas_for_improvement": ["Task improvement 1", "Task improvement 2"],
    "examples": ["Example of good/poor task fulfillment"]
  }},
  "overall_feedback": "Comprehensive summary of the email's strengths and areas for improvement, with specific focus on CELPIP test performance",
  "improvement_strategies": [
    "Specific strategy 1 with actionable steps",
    "Specific strategy 2 with actionable steps",
    "Specific strategy 3 with actionable steps"
  ],
  "word_count": 185,
  "is_word_count_appropriate": true,
  "key_achievements": [
    "Major strength 1 that demonstrates writing competency",
    "Major strength 2 that shows effective communication",
    "Major strength 3 that indicates good task understanding"
  ],
  "priority_improvements": [
    "Top priority improvement with specific examples",
    "Second priority improvement with clear guidance",
    "Third priority improvement with actionable steps"
  ]
}}
```

**Assessment Guidelines**:

1. **Score each dimension 1-12** based on official CELPIP standards
2. **Overall score** should reflect the average but consider critical weaknesses
3. **Provide specific examples** from the user's text to support assessments
4. **Focus on actionable feedback** that helps improve future performance
5. **Consider Canadian English context** and cultural appropriateness
6. **Address word count** as a task fulfillment factor
7. **Highlight both strengths and improvements** for balanced feedback

**Scoring Considerations**:
- **6-7**: Adequate performance, meets basic requirements
- **8-9**: Good performance, clear communication with minor issues
- **10-11**: Very good performance, effective communication with minimal issues
- **12**: Excellent performance, exceptional communication skills

Be thorough, fair, and constructive in your assessment to help the test-taker improve their CELPIP Writing Task 1 performance.
"""

    @staticmethod
    def create_task2_prompt() -> str:
        """Create CELPIP Writing Task 2 prompt."""
        
        # Select random survey
        category_group = random.choice(WritingTaskTopics.TASK2_SURVEYS)
        category = category_group["category"]
        survey_data = random.choice(category_group["surveys"])
        
        # Add additional considerations for more depth
        additional_considerations = [
            "Cost and budget implications",
            "Long-term sustainability and benefits",
            "Impact on different age groups",
            "Environmental considerations",
            "Accessibility for all community members",
            "Implementation timeline and feasibility"
        ]
        
        # Select 2-3 random additional considerations
        selected_considerations = random.sample(additional_considerations, random.randint(2, 3))
        
        return f"""
You are an expert CELPIP test creator with deep knowledge of the official CELPIP Writing Task 2 format ("Responding to Survey Questions").

## OFFICIAL CELPIP Writing Task 2 Structure (2024-2025)

**Task Name**: Responding to Survey Questions
**Duration**: 26 minutes total
**Word Count**: 150-200 words (recommended ~190-200 words for full development)
**Task Type**: Opinion essay responding to a survey question with multiple choice options

**Task Overview**: Test-takers must choose ONE option from a survey question and provide a well-reasoned response explaining their choice. The response must demonstrate clear reasoning, supporting details, and persuasive argument structure.

## Your Task

Create an authentic CELPIP Writing Task 2 about: **{survey_data['title']}**
Category: {category}

### Key Requirements for Survey Response Task Generation

**Survey Structure**:
- Present a realistic Canadian survey scenario
- Provide clear context and background for the survey
- Include 2-3 distinct, viable options for the respondent
- Ensure options are balanced and equally defensible
- Include relevant considerations that test-takers should address

**Response Requirements**:
- **Option Selection**: Clear statement of chosen option
- **Reasoning**: 2-3 main reasons supporting the choice
- **Supporting Details**: Specific examples and explanations
- **Organization**: Introduction, body paragraphs, conclusion
- **Persuasion**: Convincing arguments that demonstrate critical thinking

**Assessment Criteria**:
- **Content**: Clear position with well-developed reasoning
- **Organization**: Logical structure with smooth transitions
- **Language Use**: Appropriate vocabulary and grammar
- **Task Fulfillment**: Directly addresses survey question and requirements

### Quality Standards

**Authenticity Requirements**:
- Use realistic Canadian survey contexts
- Present balanced options that reflect real choices people face
- Include relevant considerations that add depth to the decision
- Ensure the topic is appropriate for diverse test-takers

**Task Complexity**:
- Options should require thoughtful analysis to choose between
- Include multiple factors to consider in the decision
- Allow for different valid perspectives and reasoning
- Test both logical reasoning and persuasive writing skills

**CRITICAL**: Return ONLY valid JSON with this exact structure:

```json
{{
  "survey": {{
    "survey_id": "survey_unique_id",
    "title": "{survey_data['title']}",
    "description": "{survey_data['description']}",
    "question": "{survey_data['question']}",
    "options": {survey_data['options']},
    "additional_considerations": {selected_considerations}
  }}
}}
```

**CRITICAL REQUIREMENTS**:
1. Create a realistic Canadian survey scenario requiring thoughtful choice
2. Ensure both/all options are equally viable and defensible
3. Include specific considerations that add depth to the decision
4. Provide sufficient context for test-takers to write 150-200 words
5. Follow authentic CELPIP Writing Task 2 format exactly
6. Use Canadian cultural context and contemporary issues
"""

    @staticmethod
    def create_task2_review_prompt(user_text: str, survey_title: str, survey_description: str,
                                 survey_question: str, survey_options: list, chosen_option: str,
                                 additional_considerations: list, word_count_min: int, word_count_max: int) -> str:
        """Create CELPIP Writing Task 2 review prompt."""
        
        options_str = "\n".join([f"- {option}" for option in survey_options])
        considerations_str = "\n".join([f"- {consideration}" for consideration in additional_considerations])
        
        return f"""
You are an expert CELPIP Writing Task 2 assessor with deep knowledge of the official CELPIP scoring rubric and assessment criteria for survey response tasks.

## OFFICIAL CELPIP Writing Task 2 Assessment Criteria

### **Scoring Scale**: 1-12 (matching official CELPIP scale)
- **1-2**: Inadequate
- **3-4**: Developing  
- **5-6**: Adequate
- **7-8**: Good
- **9-10**: Very Good
- **11-12**: Excellent

### **Four Assessment Dimensions**:

#### **1. Content & Coherence (25%)**
- **Position clarity**: Clear statement of chosen option
- **Reasoning development**: Well-developed arguments supporting the choice
- **Logical support**: Relevant examples and explanations
- **Unity and focus**: Consistent support for the chosen position

#### **2. Vocabulary (25%)**
- **Range**: Variety of vocabulary used appropriately
- **Precision**: Exact word choice for persuasive writing
- **Academic language**: Appropriate for survey response format
- **Appropriateness**: Vocabulary matches formal survey context

#### **3. Readability (25%)**
- **Grammar**: Correct verb tenses and sentence structure
- **Mechanics**: Spelling, punctuation, capitalization
- **Sentence variety**: Mix of simple and complex structures for persuasion
- **Clarity**: Easy to follow reasoning and arguments

#### **4. Task Fulfillment (25%)**
- **Option selection**: Clear choice from available options
- **Survey response format**: Appropriate structure for opinion essay
- **Completeness**: All aspects of the question addressed
- **Persuasiveness**: Convincing arguments that support the chosen option

## **Original Survey Requirements**

**Survey**: {survey_title}
**Context**: {survey_description}
**Question**: {survey_question}
**Word Count**: {word_count_min}-{word_count_max} words

**Available Options**:
{options_str}

**Additional Considerations**:
{considerations_str}

**User's Chosen Option**: {chosen_option}

## **User's Survey Response**

```
{user_text}
```

## **Your Assessment Task**

Provide a comprehensive CELPIP Writing Task 2 assessment following the official scoring rubric. Analyze how well the response addresses the survey question and supports the chosen option.

**CRITICAL**: Return ONLY valid JSON with this exact structure:

```json
{{
  "overall_score": 8,
  "content_coherence": {{
    "score": 8,
    "feedback": "Detailed analysis of position clarity, reasoning development, and logical support",
    "strengths": ["Specific strength 1", "Specific strength 2"],
    "areas_for_improvement": ["Specific area to improve 1", "Specific area to improve 2"],
    "examples": ["Quote from text showing strength/weakness"]
  }},
  "vocabulary": {{
    "score": 7,
    "feedback": "Analysis of vocabulary range, precision, and appropriateness for survey response",
    "strengths": ["Vocabulary strength 1", "Vocabulary strength 2"],
    "areas_for_improvement": ["Vocabulary improvement 1", "Vocabulary improvement 2"],
    "examples": ["Example of good/weak vocabulary use"]
  }},
  "readability": {{
    "score": 8,
    "feedback": "Assessment of grammar, mechanics, and sentence structure for persuasive writing",
    "strengths": ["Grammar strength 1", "Grammar strength 2"],
    "areas_for_improvement": ["Grammar improvement 1", "Grammar improvement 2"],
    "examples": ["Example of correct/incorrect grammar"]
  }},
  "task_fulfillment": {{
    "score": 9,
    "feedback": "Evaluation of option selection, survey format, and persuasiveness",
    "strengths": ["Task fulfillment strength 1", "Task fulfillment strength 2"],
    "areas_for_improvement": ["Task improvement 1", "Task improvement 2"],
    "examples": ["Example of good/poor task fulfillment"]
  }},
  "overall_feedback": "Comprehensive summary of the survey response's effectiveness and areas for improvement, with specific focus on CELPIP test performance",
  "improvement_strategies": [
    "Specific strategy 1 for improving survey response writing",
    "Specific strategy 2 for strengthening persuasive arguments",
    "Specific strategy 3 for better task fulfillment"
  ],
  "word_count": 185,
  "is_word_count_appropriate": true,
  "key_achievements": [
    "Major strength 1 demonstrating effective survey response writing",
    "Major strength 2 showing persuasive argument skills",
    "Major strength 3 indicating good understanding of the task"
  ],
  "priority_improvements": [
    "Top priority improvement with specific examples",
    "Second priority improvement with clear guidance",
    "Third priority improvement with actionable steps"
  ],
  "chosen_option": "{chosen_option}",
  "option_support_quality": "Assessment of how effectively the user supported their chosen option with reasoning and examples"
}}
```

**Assessment Guidelines**:

1. **Score each dimension 1-12** based on official CELPIP standards for survey responses
2. **Overall score** should reflect the average but consider critical weaknesses
3. **Evaluate option support** - how well the user justified their choice
4. **Assess persuasiveness** - how convincing the arguments are
5. **Consider survey format** - appropriate structure for opinion response
6. **Focus on reasoning quality** - logical development of supporting arguments
7. **Address word count** as a task fulfillment factor

**Scoring Considerations for Survey Responses**:
- **6-7**: Adequate choice with basic reasoning
- **8-9**: Good choice with clear, well-developed arguments
- **10-11**: Very good choice with sophisticated reasoning and strong support
- **12**: Excellent choice with compelling, well-structured persuasive arguments

Be thorough, fair, and constructive in your assessment to help the test-taker improve their CELPIP Writing Task 2 performance.
"""