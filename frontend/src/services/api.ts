import axios from 'axios';

//const API_BASE_URL = window.location.origin + "/api"; //process.env.REACT_APP_API_URL || 'http://localhost:8000';
// const API_BASE_URL = window.location.origin.replace("3000", "8000"); //process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: "/api",//API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ReadingQuestion {
  question_id: string;
  question_text: string;
  question_type: 'multiple_choice';
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface ReadingPassage {
  passage_id: string;
  title: string;
  content: string;
  passage_type: string;
  context: string;
}

export interface ReplyPassage {
  content: string;
}

export interface ReadingTask1 {
  task_id: string;
  passage: ReadingPassage;
  reply_passage: ReplyPassage;
  questions: ReadingQuestion[];
  time_limit_minutes: number;
  difficulty_level: string;
}

export interface ReadingTask1Response {
  success: boolean;
  task?: ReadingTask1;
  error_message?: string;
  generation_time_seconds?: number;
}

export interface ReadingTask2Passage {
  passage_id: string;
  title: string;
  content: string;
  passage_type: string;
  topic: string;
  word_count: number;
}

export interface ReadingTask2 {
  task_id: string;
  passage: ReadingTask2Passage;
  questions: ReadingQuestion[];
  time_limit_minutes: number;
  difficulty_level: string;
  question_count: number;
  diagram_description?: string;
}

export interface ReadingTask2Response {
  success: boolean;
  task?: ReadingTask2;
  error_message?: string;
  generation_time_seconds?: number;
}

export interface ReadingTask3Question {
  question_id: string;
  statement: string;
  correct_answer: string;
  explanation: string;
}

export interface ReadingTask3Passage {
  passage_id: string;
  title: string;
  paragraph_a: string;
  paragraph_b: string;
  paragraph_c: string;
  paragraph_d: string;
  passage_type: string;
  topic: string;
  word_count: number;
}

export interface ReadingTask3 {
  task_id: string;
  passage: ReadingTask3Passage;
  questions: ReadingTask3Question[];
  time_limit_minutes: number;
  difficulty_level: string;
  question_count: number;
}

export interface ReadingTask3Response {
  success: boolean;
  task?: ReadingTask3;
  error_message?: string;
  generation_time_seconds?: number;
}

export interface ReadingTask4Question {
  question_id: string;
  question_text: string;
  question_type: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
  blank_position?: number;
}

export interface ReadingTask4Passage {
  passage_id: string;
  title: string;
  article_content: string;
  comment_content: string;
  passage_type: string;
  topic: string;
  word_count: number;
}

export interface ReadingTask4 {
  task_id: string;
  passage: ReadingTask4Passage;
  questions: ReadingTask4Question[];
  time_limit_minutes: number;
  difficulty_level: string;
  question_count: number;
}

export interface ReadingTask4Response {
  success: boolean;
  task?: ReadingTask4;
  error_message?: string;
  generation_time_seconds?: number;
}

// Listening Task Types
export interface ListeningQuestion {
  question_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'picture_selection' | 'true_false';
  options: string[];
  correct_answer: string;
  explanation: string;
  picture_options?: string[];
  conversation_id?: string;
}

export interface ListeningConversation {
  conversation_id: string;
  title: string;
  transcript: string;
  audio_description: string;
  duration_seconds: number;
  speakers: string[];
  scenario: string;
}

export interface ListeningPart1 {
  task_id: string;
  conversations: ListeningConversation[];
  questions: ListeningQuestion[];
  time_limit_minutes: number;
  difficulty_level: string;
  instructions: string;
}

export interface ListeningPart1Response {
  success: boolean;
  task?: ListeningPart1;
  error_message?: string;
  generation_time_seconds?: number;
}

export interface ListeningPart2 {
  task_id: string;
  conversation: ListeningConversation;
  questions: ListeningQuestion[];
  time_limit_minutes: number;
  difficulty_level: string;
  instructions: string;
}

export interface ListeningPart2Response {
  success: boolean;
  task?: ListeningPart2;
  error_message?: string;
  generation_time_seconds?: number;
}

export interface ListeningPart3 {
  task_id: string;
  conversation: ListeningConversation;
  questions: ListeningQuestion[];
  time_limit_minutes: number;
  difficulty_level: string;
  instructions: string;
}

export interface ListeningPart3Response {
  success: boolean;
  task?: ListeningPart3;
  error_message?: string;
  generation_time_seconds?: number;
}

export interface ListeningNewsItem {
  news_id: string;
  title: string;
  content: string;
  audio_description: string;
  duration_seconds: number;
  topic: string;
  location: string;
  date: string;
  reporter: string;
}

export interface ListeningPart4 {
  task_id: string;
  news_item: ListeningNewsItem;
  questions: ListeningQuestion[];
  time_limit_minutes: number;
  difficulty_level: string;
  instructions: string;
}

export interface ListeningPart4Response {
  success: boolean;
  task?: ListeningPart4;
  error_message?: string;
  generation_time_seconds?: number;
}

export interface ListeningDiscussion {
  discussion_id: string;
  title: string;
  transcript: string;
  video_description: string;
  duration_seconds: number;
  speakers: string[];
  setting: string;
  topic: string;
  key_points: string[];
}

export interface ListeningPart5 {
  task_id: string;
  discussion: ListeningDiscussion;
  questions: ListeningQuestion[];
  time_limit_minutes: number;
  difficulty_level: string;
  instructions: string;
}

export interface ListeningPart5Response {
  success: boolean;
  task?: ListeningPart5;
  error_message?: string;
  generation_time_seconds?: number;
}

export interface ListeningViewpoint {
  viewpoint_id: string;
  title: string;
  content: string;
  audio_description: string;
  duration_seconds: number;
  speaker: string;
  topic: string;
  position: string;
  key_arguments: string[];
  supporting_evidence: string[];
}

export interface ListeningPart6 {
  task_id: string;
  viewpoint: ListeningViewpoint;
  questions: ListeningQuestion[];
  time_limit_minutes: number;
  difficulty_level: string;
  instructions: string;
}

export interface ListeningPart6Response {
  success: boolean;
  task?: ListeningPart6;
  error_message?: string;
  generation_time_seconds?: number;
}

// Writing Task Types
export interface WritingTask1Scenario {
  scenario_id: string;
  title: string;
  context: string;
  recipient: string;
  purpose: string;
  key_points: string[];
  tone: string;
  relationship: string;
}

export interface WritingTask1 {
  task_id: string;
  scenario: WritingTask1Scenario;
  time_limit_minutes: number;
  word_count_min: number;
  word_count_max: number;
  task_type: string;
  difficulty_level: string;
  instructions: string;
}

export interface WritingTask1Response {
  success: boolean;
  task?: WritingTask1;
  error_message?: string;
  generation_time_seconds?: number;
}

// Writing Review Types
export interface WritingCriteriaScore {
  score: number;
  feedback: string;
  strengths: string[];
  areas_for_improvement: string[];
  examples: string[];
}

export interface WritingTask1Review {
  overall_score: number;
  content_coherence: WritingCriteriaScore;
  vocabulary: WritingCriteriaScore;
  readability: WritingCriteriaScore;
  task_fulfillment: WritingCriteriaScore;
  overall_feedback: string;
  improvement_strategies: string[];
  word_count: number;
  is_word_count_appropriate: boolean;
  key_achievements: string[];
  priority_improvements: string[];
}

export interface WritingTask1ReviewRequest {
  task_id: string;
  user_text: string;
  scenario: WritingTask1Scenario;
}

export interface WritingTask1ReviewResponse {
  success: boolean;
  review?: WritingTask1Review;
  error_message?: string;
  review_time_seconds?: number;
}

// Writing Task 2 Types
export interface WritingTask2Survey {
  survey_id: string;
  title: string;
  description: string;
  question: string;
  options: string[];
  additional_considerations: string[];
}

export interface WritingTask2 {
  task_id: string;
  survey: WritingTask2Survey;
  time_limit_minutes: number;
  word_count_min: number;
  word_count_max: number;
  task_type: string;
  difficulty_level: string;
  instructions: string;
}

export interface WritingTask2Response {
  success: boolean;
  task?: WritingTask2;
  error_message?: string;
  generation_time_seconds?: number;
}

export interface WritingTask2Review {
  overall_score: number;
  content_coherence: WritingCriteriaScore;
  vocabulary: WritingCriteriaScore;
  readability: WritingCriteriaScore;
  task_fulfillment: WritingCriteriaScore;
  overall_feedback: string;
  improvement_strategies: string[];
  word_count: number;
  is_word_count_appropriate: boolean;
  key_achievements: string[];
  priority_improvements: string[];
  chosen_option: string;
  option_support_quality: string;
}

export interface WritingTask2ReviewRequest {
  task_id: string;
  user_text: string;
  survey: WritingTask2Survey;
  chosen_option: string;
}

export interface WritingTask2ReviewResponse {
  success: boolean;
  review?: WritingTask2Review;
  error_message?: string;
  review_time_seconds?: number;
}

export const readingApi = {
  generateTask1: async (): Promise<ReadingTask1Response> => {
    const response = await api.post<ReadingTask1Response>('/reading/task1/generate');
    return response.data;
  },

  generateTask2: async (): Promise<ReadingTask2Response> => {
    const response = await api.post<ReadingTask2Response>('/reading/task2/generate');
    return response.data;
  },

  generateTask3: async (): Promise<ReadingTask3Response> => {
    const response = await api.post<ReadingTask3Response>('/reading/task3/generate');
    return response.data;
  },

  generateTask4: async (): Promise<ReadingTask4Response> => {
    const response = await api.post<ReadingTask4Response>('/reading/task4/generate');
    return response.data;
  },

  healthCheck: async (): Promise<{ status: string; gemini_api: string }> => {
    const response = await api.get('/reading/health');
    return response.data;
  },
};

export const listeningApi = {
  generatePart1: async (): Promise<ListeningPart1Response> => {
    const response = await api.post<ListeningPart1Response>('/listening/part1/generate');
    return response.data;
  },

  generatePart2: async (): Promise<ListeningPart2Response> => {
    const response = await api.post<ListeningPart2Response>('/listening/part2/generate');
    return response.data;
  },

  generatePart3: async (): Promise<ListeningPart3Response> => {
    const response = await api.post<ListeningPart3Response>('/listening/part3/generate');
    return response.data;
  },

  generatePart4: async (): Promise<ListeningPart4Response> => {
    const response = await api.post<ListeningPart4Response>('/listening/part4/generate');
    return response.data;
  },

  generatePart5: async (): Promise<ListeningPart5Response> => {
    const response = await api.post<ListeningPart5Response>('/listening/part5/generate');
    return response.data;
  },

  generatePart6: async (): Promise<ListeningPart6Response> => {
    const response = await api.post<ListeningPart6Response>('/listening/part6/generate');
    return response.data;
  },

  healthCheck: async (): Promise<{ status: string; gemini_api: string; service: string }> => {
    const response = await api.get('/listening/health');
    return response.data;
  },
};

export const writingApi = {
  generateTask1: async (): Promise<WritingTask1Response> => {
    const response = await api.post<WritingTask1Response>('/writing/task1/generate');
    return response.data;
  },

  reviewTask1: async (reviewRequest: WritingTask1ReviewRequest): Promise<WritingTask1ReviewResponse> => {
    const response = await api.post<WritingTask1ReviewResponse>('/writing/task1/review', reviewRequest);
    return response.data;
  },

  generateTask2: async (): Promise<WritingTask2Response> => {
    const response = await api.post<WritingTask2Response>('/writing/task2/generate');
    return response.data;
  },

  reviewTask2: async (reviewRequest: WritingTask2ReviewRequest): Promise<WritingTask2ReviewResponse> => {
    const response = await api.post<WritingTask2ReviewResponse>('/writing/task2/review', reviewRequest);
    return response.data;
  },

  healthCheck: async (): Promise<{ status: string; gemini_api: string; service: string }> => {
    const response = await api.get('/writing/health');
    return response.data;
  },
};

// Speaking Task Types
export interface SpeakingTask1Scenario {
  scenario_id: string;
  title: string;
  situation: string;
  context: string;
  person_description: string;
  advice_topic: string;
  image_description?: string;
}

export interface SpeakingTask1Instructions {
  preparation_time_seconds: number;
  speaking_time_seconds: number;
  task_description: string;
  evaluation_criteria: string[];
  tips: string[];
}

export interface SpeakingTask1 {
  task_id: string;
  task_type: 'giving_advice';
  scenario: SpeakingTask1Scenario;
  instructions: SpeakingTask1Instructions;
  difficulty_level: string;
  estimated_duration_minutes: number;
}

export interface SpeakingTask1Response {
  success: boolean;
  task?: SpeakingTask1;
  error_message?: string;
  generation_time_seconds?: number;
}

export interface AudioSubmission {
  audio_data: string;
  audio_format: string;
  duration_seconds: number;
  recording_quality?: string;
}

export interface SpeakingTask1Submission {
  task_id: string;
  user_id?: string;
  audio: AudioSubmission;
  task_context: SpeakingTask1;
  preparation_time_used?: number;
  speaking_time_used?: number;
  submission_timestamp?: string;
}

export interface SpeakingScoreBreakdown {
  content_score: number;
  vocabulary_score: number;
  language_use_score: number;
  task_fulfillment_score: number;
  overall_score: number;
}

export interface SpeakingFeedback {
  strengths: string[];
  improvements: string[];
  specific_suggestions: string[];
  pronunciation_notes?: string;
  fluency_notes?: string;
}

export interface SpeakingTask1Score {
  task_id: string;
  submission_id: string;
  scores: SpeakingScoreBreakdown;
  feedback: SpeakingFeedback;
  transcript?: string;
  confidence_level?: number;
  processing_time_seconds?: number;
}

export interface SpeakingTask1ScoreResponse {
  success: boolean;
  score?: SpeakingTask1Score;
  error_message?: string;
}

// Speaking Task 2 Types
export interface SpeakingTask2Scenario {
  scenario_id: string;
  title: string;
  topic: string;
  context: string;
  experience_type: string;
  guiding_questions: string[];
  image_description?: string;
}

export interface SpeakingTask2Instructions {
  preparation_time_seconds: number;
  speaking_time_seconds: number;
  task_description: string;
  evaluation_criteria: string[];
  tips: string[];
}

export interface SpeakingTask2 {
  task_id: string;
  task_type: 'talking_about_personal_experience';
  scenario: SpeakingTask2Scenario;
  instructions: SpeakingTask2Instructions;
  difficulty_level: string;
  estimated_duration_minutes: number;
}

export interface SpeakingTask2Response {
  success: boolean;
  task?: SpeakingTask2;
  error_message?: string;
  generation_time_seconds?: number;
}

export interface SpeakingTask2Submission {
  task_id: string;
  user_id?: string;
  audio: AudioSubmission;
  task_context: SpeakingTask2;
  preparation_time_used?: number;
  speaking_time_used?: number;
  submission_timestamp?: string;
}

export interface SpeakingTask2Score {
  task_id: string;
  submission_id: string;
  scores: SpeakingScoreBreakdown;
  feedback: SpeakingFeedback;
  transcript?: string;
  confidence_level?: number;
  processing_time_seconds?: number;
}

export interface SpeakingTask2ScoreResponse {
  success: boolean;
  score?: SpeakingTask2Score;
  error_message?: string;
}

// Speaking Task 3 Types (Describing a Scene)
export interface SpeakingTask3Scenario {
  scenario_id: string;
  title: string;
  scene_description: string;
  context: string;
  scene_type: string;
  key_elements: string[];
  spatial_layout: string;
  image_description?: string;
}

export interface SpeakingTask3Instructions {
  preparation_time_seconds: number;
  speaking_time_seconds: number;
  task_description: string;
  evaluation_criteria: string[];
  tips: string[];
}

export interface SpeakingTask3 {
  task_id: string;
  task_type: string;
  scenario: SpeakingTask3Scenario;
  instructions: SpeakingTask3Instructions;
  difficulty_level: string;
  estimated_duration_minutes: number;
  scene_image?: string;
}

export interface SpeakingTask3Response {
  success: boolean;
  task?: SpeakingTask3;
  error_message?: string;
  generation_time_seconds?: number;
}

export interface SpeakingTask3Submission {
  task_id: string;
  user_id?: string;
  audio: AudioSubmission;
  task_context: SpeakingTask3;
  preparation_time_used?: number;
  speaking_time_used?: number;
  submission_timestamp?: string;
}

export interface SpeakingTask3Score {
  task_id: string;
  submission_id: string;
  scores: SpeakingScoreBreakdown;
  feedback: SpeakingFeedback;
  transcript?: string;
  confidence_level?: number;
  processing_time_seconds?: number;
}

export interface SpeakingTask3ScoreResponse {
  success: boolean;
  score?: SpeakingTask3Score;
  error_message?: string;
}

// Speaking Task 4 Types (Making Predictions)
export interface SpeakingTask4Scenario {
  scenario_id: string;
  title: string;
  scene_description: string;
  context: string;
  scene_type: string;
  current_situation: string;
  key_characters: string[];
  prediction_elements: string[];
  possible_outcomes: string[];
  image_description?: string;
}

export interface SpeakingTask4Instructions {
  preparation_time_seconds: number;
  speaking_time_seconds: number;
  task_description: string;
  evaluation_criteria: string[];
  tips: string[];
}

export interface SpeakingTask4 {
  task_id: string;
  task_type: string;
  scenario: SpeakingTask4Scenario;
  instructions: SpeakingTask4Instructions;
  difficulty_level: string;
  estimated_duration_minutes: number;
  scene_image?: string;
}

export interface SpeakingTask4Response {
  success: boolean;
  task?: SpeakingTask4;
  error_message?: string;
  generation_time_seconds?: number;
}

export interface SpeakingTask4Submission {
  task_id: string;
  user_id?: string;
  audio: AudioSubmission;
  task_context: SpeakingTask4;
  preparation_time_used?: number;
  speaking_time_used?: number;
  submission_timestamp?: string;
}

export interface SpeakingTask4Score {
  task_id: string;
  submission_id: string;
  scores: SpeakingScoreBreakdown;
  feedback: SpeakingFeedback;
  transcript?: string;
  confidence_level?: number;
  processing_time_seconds?: number;
}

export interface SpeakingTask4ScoreResponse {
  success: boolean;
  score?: SpeakingTask4Score;
  error_message?: string;
}

// Speaking Task 5 Types (Comparing and Persuading)
export interface SpeakingTask5Option {
  option_id: string;
  title: string;
  description: string;
  specifications: string[];
  price?: string;
  pros: string[];
  cons: string[];
  image_description?: string;
}

export interface SpeakingTask5Scenario {
  scenario_id: string;
  title: string;
  context: string;
  decision_maker: string;
  category: string;
  option_a: SpeakingTask5Option;
  option_b: SpeakingTask5Option;
  persuasion_context: string;
}

export interface SpeakingTask5Instructions {
  selection_time_seconds: number;
  preparation_time_seconds: number;
  speaking_time_seconds: number;
  task_description: string;
  evaluation_criteria: string[];
  tips: string[];
}

export interface SpeakingTask5 {
  task_id: string;
  task_type: string;
  scenario: SpeakingTask5Scenario;
  instructions: SpeakingTask5Instructions;
  difficulty_level: string;
  estimated_duration_minutes: number;
  option_a_image?: string;
  option_b_image?: string;
}

export interface SpeakingTask5Response {
  success: boolean;
  task?: SpeakingTask5;
  error_message?: string;
  generation_time_seconds?: number;
}

export interface SpeakingTask5Submission {
  task_id: string;
  user_id?: string;
  selected_option: string;
  audio: {
    audio_data: string;
    audio_format: string;
    duration_seconds: number;
    recording_quality?: string;
  };
  task_context: SpeakingTask5;
  selection_time_used?: number;
  preparation_time_used?: number;
  speaking_time_used?: number;
  submission_timestamp?: string;
}

export interface SpeakingTask5Score {
  task_id: string;
  submission_id: string;
  scores: {
    content_score: number;
    vocabulary_score: number;
    language_use_score: number;
    task_fulfillment_score: number;
    overall_score: number;
  };
  feedback: {
    strengths: string[];
    improvements: string[];
    specific_suggestions: string[];
    pronunciation_notes?: string;
    fluency_notes?: string;
  };
  transcript?: string;
  confidence_level?: number;
  processing_time_seconds?: number;
  selected_option_analysis?: string;
  persuasion_effectiveness?: string;
}

export interface SpeakingTask5ScoreResponse {
  success: boolean;
  score?: SpeakingTask5Score;
  error_message?: string;
}

// Speaking Task 7 Types (Expressing Opinions)
export interface SpeakingTask7Scenario {
  scenario_id: string;
  title: string;
  topic_statement: string;
  context: string;
  position_options: string[];
  supporting_points: string[];
  considerations: string[];
  image_description?: string;
}

export interface SpeakingTask7Instructions {
  preparation_time_seconds: number;
  speaking_time_seconds: number;
  task_description: string;
  evaluation_criteria: string[];
  tips: string[];
}

export interface SpeakingTask7 {
  task_id: string;
  task_type: 'expressing_opinions';
  scenario: SpeakingTask7Scenario;
  instructions: SpeakingTask7Instructions;
  difficulty_level: string;
  estimated_duration_minutes: number;
}

export interface SpeakingTask7Response {
  success: boolean;
  task?: SpeakingTask7;
  error_message?: string;
  generation_time_seconds?: number;
}

export interface SpeakingTask7Submission {
  task_id: string;
  user_id?: string;
  audio: AudioSubmission;
  task_context: SpeakingTask7;
  chosen_position?: string;
  preparation_time_used?: number;
  speaking_time_used?: number;
  submission_timestamp?: string;
}

export interface SpeakingTask7Score {
  task_id: string;
  submission_id: string;
  scores: SpeakingScoreBreakdown;
  feedback: SpeakingFeedback;
  transcript?: string;
  confidence_level?: number;
  processing_time_seconds?: number;
}

export interface SpeakingTask7ScoreResponse {
  success: boolean;
  score?: SpeakingTask7Score;
  error_message?: string;
}

// Speaking Task 6 Types (Dealing with Difficult Situations)
export interface SpeakingTask6Scenario {
  scenario_id: string;
  title: string;
  situation_description: string;
  context: string;
  involved_parties: string[];
  dilemma_explanation: string;
  communication_options: string[];
  relationship_context: string;
  image_description?: string;
}

export interface SpeakingTask6Instructions {
  preparation_time_seconds: number;
  speaking_time_seconds: number;
  task_description: string;
  evaluation_criteria: string[];
  tips: string[];
}

export interface SpeakingTask6 {
  task_id: string;
  task_type: 'dealing_with_difficult_situation';
  scenario: SpeakingTask6Scenario;
  instructions: SpeakingTask6Instructions;
  difficulty_level: string;
  estimated_duration_minutes: number;
}

export interface SpeakingTask6Response {
  success: boolean;
  task?: SpeakingTask6;
  error_message?: string;
  generation_time_seconds?: number;
}

export interface SpeakingTask6Submission {
  task_id: string;
  user_id?: string;
  audio: AudioSubmission;
  task_context: SpeakingTask6;
  chosen_option?: string;
  preparation_time_used?: number;
  speaking_time_used?: number;
  submission_timestamp?: string;
}

export interface SpeakingTask6Score {
  task_id: string;
  submission_id: string;
  scores: SpeakingScoreBreakdown;
  feedback: SpeakingFeedback;
  transcript?: string;
  confidence_level?: number;
  processing_time_seconds?: number;
}

export interface SpeakingTask6ScoreResponse {
  success: boolean;
  score?: SpeakingTask6Score;
  error_message?: string;
}

// Speaking Task 8 Types (Describing an Unusual Situation)
export interface SpeakingTask8Scenario {
  scenario_id: string;
  title: string;
  situation_description: string;
  context: string;
  unusual_elements: string[];
  possible_explanations: string[];
  descriptive_focus: string;
  image_description?: string;
}

export interface SpeakingTask8Instructions {
  preparation_time_seconds: number;
  speaking_time_seconds: number;
  task_description: string;
  evaluation_criteria: string[];
  tips: string[];
}

export interface SpeakingTask8 {
  task_id: string;
  task_type: string;
  scenario: SpeakingTask8Scenario;
  instructions: SpeakingTask8Instructions;
  difficulty_level: string;
  estimated_duration_minutes: number;
  situation_image?: string;
}

export interface SpeakingTask8Response {
  success: boolean;
  task?: SpeakingTask8;
  error_message?: string;
  generation_time_seconds?: number;
}

export interface SpeakingTask8Submission {
  task_id: string;
  user_id?: string;
  audio: AudioSubmission;
  task_context: SpeakingTask8;
  preparation_time_used?: number;
  speaking_time_used?: number;
  submission_timestamp?: string;
}

export interface SpeakingTask8Score {
  task_id: string;
  submission_id: string;
  scores: SpeakingScoreBreakdown;
  feedback: SpeakingFeedback;
  transcript?: string;
  confidence_level?: number;
  processing_time_seconds?: number;
}

export interface SpeakingTask8ScoreResponse {
  success: boolean;
  score?: SpeakingTask8Score;
  error_message?: string;
}

// Image Generation Types
export interface ImageGenerationRequest {
  prompt: string;
  style?: 'realistic' | 'cartoon' | 'professional' | 'casual' | 'educational' | 'diagram';
  size?: '256x256' | '512x512' | '1024x1024' | '1024x512' | '512x1024';
  quality?: string;
  context?: string;
  negative_prompt?: string;
  task_type?: string;
}

export interface ImageGenerationResponse {
  success: boolean;
  image_url?: string;
  image_data?: string;
  error_message?: string;
  generation_time_seconds?: number;
  prompt_used?: string;
  style_applied?: string;
  size_generated?: string;
}

export const speakingApi = {
  generateTask1: async (): Promise<SpeakingTask1Response> => {
    const response = await api.post<SpeakingTask1Response>('/speaking/task1/generate');
    return response.data;
  },

  scoreTask1: async (submission: SpeakingTask1Submission): Promise<SpeakingTask1ScoreResponse> => {
    const response = await api.post<SpeakingTask1ScoreResponse>('/speaking/task1/score', submission);
    return response.data;
  },

  generateTask2: async (): Promise<SpeakingTask2Response> => {
    const response = await api.post<SpeakingTask2Response>('/speaking/task2/generate');
    return response.data;
  },

  scoreTask2: async (submission: SpeakingTask2Submission): Promise<SpeakingTask2ScoreResponse> => {
    const response = await api.post<SpeakingTask2ScoreResponse>('/speaking/task2/score', submission);
    return response.data;
  },

  generateTask3: async (): Promise<SpeakingTask3Response> => {
    const response = await api.post<SpeakingTask3Response>('/speaking/task3/generate');
    return response.data;
  },

  scoreTask3: async (submission: SpeakingTask3Submission): Promise<SpeakingTask3ScoreResponse> => {
    const response = await api.post<SpeakingTask3ScoreResponse>('/speaking/task3/score', submission);
    return response.data;
  },

  generateTask4: async (): Promise<SpeakingTask4Response> => {
    const response = await api.post<SpeakingTask4Response>('/speaking/task4/generate');
    return response.data;
  },

  scoreTask4: async (submission: SpeakingTask4Submission): Promise<SpeakingTask4ScoreResponse> => {
    const response = await api.post<SpeakingTask4ScoreResponse>('/speaking/task4/score', submission);
    return response.data;
  },

  generateTask5: async (): Promise<SpeakingTask5Response> => {
    const response = await api.post<SpeakingTask5Response>('/speaking/task5/generate');
    return response.data;
  },

  scoreTask5: async (submission: SpeakingTask5Submission): Promise<SpeakingTask5ScoreResponse> => {
    const response = await api.post<SpeakingTask5ScoreResponse>('/speaking/task5/score', submission);
    return response.data;
  },

  generateTask6: async (): Promise<SpeakingTask6Response> => {
    const response = await api.post<SpeakingTask6Response>('/speaking/task6/generate');
    return response.data;
  },

  scoreTask6: async (submission: SpeakingTask6Submission): Promise<SpeakingTask6ScoreResponse> => {
    const response = await api.post<SpeakingTask6ScoreResponse>('/speaking/task6/score', submission);
    return response.data;
  },

  generateTask7: async (): Promise<SpeakingTask7Response> => {
    const response = await api.post<SpeakingTask7Response>('/speaking/task7/generate');
    return response.data;
  },

  scoreTask7: async (submission: SpeakingTask7Submission): Promise<SpeakingTask7ScoreResponse> => {
    const response = await api.post<SpeakingTask7ScoreResponse>('/speaking/task7/score', submission);
    return response.data;
  },

  generateTask8: async (): Promise<SpeakingTask8Response> => {
    const response = await api.post<SpeakingTask8Response>('/speaking/task8/generate');
    return response.data;
  },

  scoreTask8: async (submission: SpeakingTask8Submission): Promise<SpeakingTask8ScoreResponse> => {
    const response = await api.post<SpeakingTask8ScoreResponse>('/speaking/task8/score', submission);
    return response.data;
  },

  healthCheck: async (): Promise<{ status: string; llm_service: string; speech_service: string }> => {
    const response = await api.get('/speaking/health');
    return response.data;
  },
};

export const imageApi = {
  generateImage: async (request: ImageGenerationRequest): Promise<ImageGenerationResponse> => {
    const response = await api.post<ImageGenerationResponse>('/images/generate', request);
    return response.data;
  },

  healthCheck: async (): Promise<{ status: string; llm_service: string; image_generation_service: string }> => {
    const response = await api.get('/images/health');
    return response.data;
  },
};

export const generalApi = {
  healthCheck: async (): Promise<{ status: string; service: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;