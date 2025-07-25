import React from 'react';
import { BookOpen, Headphones, PenTool, Mic, Play, Lock, Star, TrendingUp, Award, Users, Mail, Radio } from 'lucide-react';

interface SkillCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  taskCount: number;
  isAvailable: boolean;
  gradient: string;
  onClick?: () => void;
}

const SkillCard: React.FC<SkillCardProps> = ({
  title,
  icon,
  description,
  taskCount,
  isAvailable,
  gradient,
  onClick
}) => {
  const getButtonClass = (gradientType: string) => {
    switch (gradientType) {
      case 'from-emerald-500 to-teal-600':
        return 'bg-emerald-600 hover:bg-emerald-700';
      case 'from-blue-500 to-indigo-600':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'from-purple-500 to-violet-600':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'from-orange-500 to-red-600':
        return 'bg-orange-600 hover:bg-orange-700';
      case 'from-blue-500 to-cyan-600':
        return 'bg-cyan-600 hover:bg-cyan-700';
      case 'from-rose-500 to-pink-600':
        return 'bg-rose-600 hover:bg-rose-700';
      case 'from-amber-500 to-orange-600':
        return 'bg-amber-600 hover:bg-amber-700';
      case 'from-green-500 to-emerald-600':
        return 'bg-green-600 hover:bg-green-700';
      case 'from-indigo-500 to-purple-600':
        return 'bg-indigo-600 hover:bg-indigo-700';
      case 'from-purple-500 to-purple-600':
        return 'bg-purple-600 hover:bg-purple-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };
  
  const getIconClass = (gradientType: string) => {
    switch (gradientType) {
      case 'from-emerald-500 to-teal-600':
        return 'bg-emerald-600';
      case 'from-blue-500 to-indigo-600':
        return 'bg-blue-600';
      case 'from-purple-500 to-violet-600':
        return 'bg-purple-600';
      case 'from-orange-500 to-red-600':
        return 'bg-orange-600';
      case 'from-blue-500 to-cyan-600':
        return 'bg-cyan-600';
      case 'from-rose-500 to-pink-600':
        return 'bg-rose-600';
      case 'from-amber-500 to-orange-600':
        return 'bg-amber-600';
      case 'from-green-500 to-emerald-600':
        return 'bg-green-600';
      case 'from-indigo-500 to-purple-600':
        return 'bg-indigo-600';
      case 'from-purple-500 to-purple-600':
        return 'bg-purple-600';
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <div 
      className={`group relative rounded-2xl shadow-lg border border-gray-100 p-8 transition-all duration-500 animate-fade-in overflow-hidden min-h-96 flex flex-col ${
        isAvailable 
          ? 'bg-white hover:shadow-2xl hover:-translate-y-3 hover:border-gray-200 cursor-pointer' 
          : 'opacity-70 cursor-not-allowed bg-gray-50'
      }`}
      onClick={isAvailable ? onClick : undefined}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      


      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className={`p-5 rounded-2xl transition-all duration-500 shadow-md ${
            isAvailable 
              ? `${getIconClass(gradient)} shadow-xl group-hover:shadow-2xl group-hover:scale-105 group-hover:-rotate-3` 
              : 'bg-gray-200 border border-gray-300'
          }`}>
            <div className={`transition-colors duration-300 w-8 h-8 flex items-center justify-center ${isAvailable ? 'text-white' : 'text-gray-500'}`}>
              {icon}
            </div>
          </div>
          {!isAvailable && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-xl">
              <Lock className="w-5 h-5 text-red-400" />
            </div>
          )}
          {isAvailable && (
            <div className="flex items-center bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
              <Star className="w-4 h-4 mr-2" />
              Available
            </div>
          )}
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300 leading-tight">{title}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed text-base flex-grow group-hover:text-gray-700 transition-colors duration-300">{description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">{taskCount}</span>
            <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">
              {taskCount === 1 ? 'Task' : 'Tasks'}
            </span>
          </div>
          {isAvailable && (
            <button className={`flex items-center gap-3 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 font-bold text-sm ${getButtonClass(gradient)}`}>
              <Play className="w-5 h-5" />
              <span>Start Practice</span>
            </button>
          )}
          {!isAvailable && (
            <div className="bg-gray-100 border border-gray-200 text-gray-500 px-8 py-4 rounded-xl text-sm font-bold">
              Coming Soon
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface DashboardProps {
  onSkillSelect: (skill: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSkillSelect }) => {
  const skillGroups = {
    reading: {
      title: 'Reading Skills',
      description: 'Master all four reading tasks with authentic CELPIP scenarios',
      color: 'emerald',
      icon: <BookOpen className="w-8 h-8 text-white" />,
      tasks: [
        {
          id: 'reading-task1',
          title: 'Task 1: Correspondence',
          icon: <Mail className="w-6 h-6" />,
          description: 'Read correspondence and emails. Complete 11 questions including reply completion.',
          taskCount: 1,
          isAvailable: true,
          gradient: 'from-emerald-500 to-teal-600'
        },
        {
          id: 'reading-task2',
          title: 'Task 2: Diagrams',
          icon: <TrendingUp className="w-6 h-6" />,
          description: 'Apply diagram information to complete emails. Fill 5 blanks and answer 3 questions.',
          taskCount: 1,
          isAvailable: true,
          gradient: 'from-blue-500 to-indigo-600'
        },
        {
          id: 'reading-task3',
          title: 'Task 3: Information',
          icon: <BookOpen className="w-6 h-6" />,
          description: 'Read academic passages and match statements to paragraphs. 9 matching questions.',
          taskCount: 1,
          isAvailable: true,
          gradient: 'from-purple-500 to-violet-600'
        },
        {
          id: 'reading-task4',
          title: 'Task 4: Viewpoints',
          icon: <Users className="w-6 h-6" />,
          description: 'Read news articles with viewpoints and complete comments. 10 comprehension questions.',
          taskCount: 1,
          isAvailable: true,
          gradient: 'from-orange-500 to-red-600'
        }
      ]
    },
    listening: {
      title: 'Listening Skills',
      description: 'Develop comprehension through authentic Canadian conversations',
      color: 'blue',
      icon: <Headphones className="w-8 h-8 text-white" />,
      tasks: [
        {
          id: 'listening-part1',
          title: 'Part 1: Problem Solving',
          icon: <Headphones className="w-6 h-6" />,
          description: 'Listen to conversations where people ask for directions and solve problems. 3 conversations with 8 questions.',
          taskCount: 1,
          isAvailable: true,
          gradient: 'from-blue-500 to-cyan-600'
        },
        {
          id: 'listening-part2',
          title: 'Part 2: Daily Life',
          icon: <Users className="w-6 h-6" />,
          description: 'Listen to daily life conversations between friends or colleagues. 1 conversation with 5 questions.',
          taskCount: 1,
          isAvailable: true,
          gradient: 'from-purple-500 to-violet-600'
        },
        {
          id: 'listening-part3',
          title: 'Part 3: Information',
          icon: <BookOpen className="w-6 h-6" />,
          description: 'Listen to informational conversations and interviews with experts. 1 conversation with 6 questions.',
          taskCount: 1,
          isAvailable: true,
          gradient: 'from-green-500 to-emerald-600'
        },
        {
          id: 'listening-part4',
          title: 'Part 4: News Item',
          icon: <Radio className="w-6 h-6" />,
          description: 'Listen to local community news broadcasts. 1 news item with 5 questions.',
          taskCount: 1,
          isAvailable: true,
          gradient: 'from-amber-500 to-orange-600'
        },
        {
          id: 'listening-part5',
          title: 'Part 5: Discussion',
          icon: <Users className="w-6 h-6" />,
          description: 'Watch professional video discussions between multiple speakers. 1 discussion with 8 questions.',
          taskCount: 1,
          isAvailable: true,
          gradient: 'from-indigo-500 to-purple-600'
        },
        {
          id: 'listening-part6',
          title: 'Part 6: Viewpoints',
          icon: <Mic className="w-6 h-6" />,
          description: 'Listen to opinion presentations on controversial topics. 1 viewpoint with 6 questions.',
          taskCount: 1,
          isAvailable: true,
          gradient: 'from-rose-500 to-pink-600'
        }
      ]
    },
    writing: {
      title: 'Writing Skills',
      description: 'Express your ideas clearly in emails and essays',
      color: 'rose',
      icon: <PenTool className="w-8 h-8 text-white" />,
      tasks: [
        {
          id: 'writing-task1',
          title: 'Task 1: Email Writing',
          icon: <PenTool className="w-6 h-6" />,
          description: 'Write emails responding to realistic scenarios. 150-200 words in 27 minutes.',
          taskCount: 1,
          isAvailable: true,
          gradient: 'from-rose-500 to-pink-600'
        },
        {
          id: 'writing-task2',
          title: 'Task 2: Survey Response',
          icon: <PenTool className="w-6 h-6" />,
          description: 'Express opinions and respond to survey questions. 150-200 words in 26 minutes.',
          taskCount: 1,
          isAvailable: true,
          gradient: 'from-pink-500 to-rose-600'
        }
      ]
    },
    speaking: {
      title: 'Speaking Skills',
      description: 'Build confidence in verbal communication and presentations',
      color: 'amber',
      icon: <Mic className="w-8 h-8 text-white" />,
      tasks: [
        {
          id: 'speaking-task1',
          title: 'Task 1: Giving Advice',
          icon: <Mic className="w-6 h-6" />,
          description: 'Give advice to a friend facing a decision. 90 seconds preparation + 90 seconds speaking.',
          taskCount: 1,
          isAvailable: true,
          gradient: 'from-amber-500 to-orange-600'
        },
        {
          id: 'speaking-task2',
          title: 'Task 2: Personal Experience',
          icon: <Mic className="w-6 h-6" />,
          description: 'Talk about a personal experience related to a given topic. 30 seconds preparation + 60 seconds speaking.',
          taskCount: 1,
          isAvailable: true,
          gradient: 'from-orange-500 to-red-600'
        },
        {
          id: 'speaking-task3',
          title: 'Task 3: Describing a Scene',
          icon: <Mic className="w-6 h-6" />,
          description: 'Describe what you see in a picture or scene. 30 seconds preparation + 60 seconds speaking.',
          taskCount: 1,
          isAvailable: true,
          gradient: 'from-orange-500 to-orange-600'
        },
        {
          id: 'speaking-task4',
          title: 'Task 4: Making Predictions',
          icon: <Mic className="w-6 h-6" />,
          description: 'Make predictions about what will happen next in a scene. Use future tenses and logical reasoning. 30 seconds preparation + 60 seconds speaking.',
          taskCount: 1,
          isAvailable: true,
          gradient: 'from-pink-500 to-purple-600'
        },
        {
          id: 'speaking-task5',
          title: 'Task 5: Comparing and Persuading',
          icon: <Mic className="w-6 h-6" />,
          description: 'Compare options and persuade someone to choose one. 60 seconds selection + 60 seconds preparation + 60 seconds speaking.',
          taskCount: 1,
          isAvailable: true,
          gradient: 'from-purple-500 to-indigo-600'
        },
        {
          id: 'speaking-task6',
          title: 'Task 6: Dealing with Difficult Situations',
          icon: <Mic className="w-6 h-6" />,
          description: 'Handle challenging situations with diplomacy. Choose communication options and explain your approach. 60 seconds preparation + 60 seconds speaking.',
          taskCount: 1,
          isAvailable: true,
          gradient: 'from-indigo-500 to-blue-600'
        },
        {
          id: 'speaking-task7',
          title: 'Task 7: Expressing Opinions',
          icon: <Mic className="w-6 h-6" />,
          description: 'Express and defend your opinions on various topics. 30 seconds preparation + 90 seconds speaking.',
          taskCount: 1,
          isAvailable: true,
          gradient: 'from-blue-500 to-cyan-600'
        },
        {
          id: 'speaking-task8',
          title: 'Task 8: Describing an Unusual Situation',
          icon: <Mic className="w-6 h-6" />,
          description: 'Describe an unusual situation and offer creative explanations. 30 seconds preparation + 60 seconds speaking.',
          taskCount: 1,
          isAvailable: true,
          gradient: 'from-purple-500 to-purple-600'
        }
      ]
    }
  };

  return (
    <div className="min-h-screen celpip-gradient-bg py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-white to-blue-50 rounded-full shadow-xl mb-6 animate-float">
              <BookOpen className="w-12 h-12 text-blue-600" />
            </div>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-1 w-16 bg-gradient-to-r from-transparent to-white/30 rounded"></div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Award className="w-4 h-4 text-yellow-300 mr-2" />
                <span className="text-white/90 text-sm font-medium">Official CELPIP Format</span>
              </div>
              <div className="h-1 w-16 bg-gradient-to-l from-transparent to-white/30 rounded"></div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            CELPIP Trainer
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow mb-8">
            Master all four language skills with realistic test scenarios. 
            Build confidence for your Canadian English Language Proficiency Index Program exam.
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20">
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 text-white mr-3" />
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">4</div>
                  <div className="text-white/80 text-sm">Reading Tasks</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-green-300 mr-3" />
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-white/80 text-sm">Authentic Format</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-300 mr-3" />
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">∞</div>
                  <div className="text-white/80 text-sm">Practice Tests</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section - Grouped by Type */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Choose Your CELPIP Practice</h2>
            <p className="text-white/80 max-w-3xl mx-auto text-lg">
              Master all four language skills with our comprehensive practice modules designed to mirror the official CELPIP test experience
            </p>
          </div>
          
          {/* Skill Groups */}
          <div className="space-y-16">
            {Object.entries(skillGroups).map(([skillKey, skillGroup], groupIndex) => (
              <div key={skillKey} className={`animate-fade-in rounded-3xl p-8 ${
                skillKey === 'reading' ? 'bg-emerald-50/50 border border-emerald-100' :
                skillKey === 'listening' ? 'bg-blue-50/50 border border-blue-100' :
                skillKey === 'writing' ? 'bg-rose-50/50 border border-rose-100' :
                'bg-amber-50/50 border border-amber-100'
              }`} style={{ animationDelay: `${groupIndex * 200}ms` }}>
                {/* Skill Group Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full shadow-xl mb-4 ${
                    skillKey === 'reading' ? 'bg-emerald-600' :
                    skillKey === 'listening' ? 'bg-blue-600' :
                    skillKey === 'writing' ? 'bg-rose-600' :
                    'bg-amber-600'
                  }`}>
                    <div className="w-8 h-8 flex items-center justify-center text-white">
                      {skillGroup.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{skillGroup.title}</h3>
                  <p className="text-white/70 max-w-2xl mx-auto">{skillGroup.description}</p>
                </div>
                
                {/* Tasks Grid */}
                <div className={`grid grid-cols-1 ${skillGroup.tasks.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : skillGroup.tasks.length > 1 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-1 lg:grid-cols-1 max-w-md mx-auto'} gap-6`}>
                  {skillGroup.tasks.map((task, taskIndex) => (
                    <div 
                      key={task.id}
                      style={{ animationDelay: `${(groupIndex * 200) + (taskIndex * 100)}ms` }}
                      className="animate-fade-in"
                    >
                      <SkillCard
                        title={task.title}
                        icon={task.icon}
                        description={task.description}
                        taskCount={task.taskCount}
                        isAvailable={task.isAvailable}
                        gradient={task.gradient}
                        onClick={() => task.isAvailable && onSkillSelect(task.id)}
                      />
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="px-4 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Features Card */}
          <div className="celpip-card p-8 animate-fade-in">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-full mr-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Why Choose CELPIP Trainer?</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3 mt-1">
                  <Award className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Authentic Format</h3>
                  <p className="text-gray-600 text-sm">Exact replica of official CELPIP test interface and structure</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">AI-Powered Content</h3>
                  <p className="text-gray-600 text-sm">Dynamic question generation with realistic scenarios</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-orange-100 p-2 rounded-full mr-3 mt-1">
                  <Users className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Canadian Context</h3>
                  <p className="text-gray-600 text-sm">Content focused on Canadian culture and scenarios</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Start Card */}
          <div className="celpip-card p-8 animate-fade-in">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-full mr-4">
                <Play className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Quick Start Guide</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
                <span className="text-gray-700">Choose a Reading Task (1-4)</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
                <span className="text-gray-700">Complete all questions</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
                <span className="text-gray-700">Review your results</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">4</div>
                <span className="text-gray-700">Practice again for improvement</span>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="celpip-card p-8 animate-fade-in bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg animate-pulse">
                <Play className="w-10 h-10 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Ready to Excel?</h3>
            <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
              Choose your practice and start building the skills you need for CELPIP success. 
              Each task is designed to mirror the official test experience.
            </p>
            
            {/* Featured Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-10 gap-4 max-w-7xl mx-auto">
              <button 
                onClick={() => onSkillSelect('reading-task1')}
                className="group bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1"
              >
                <div className="flex flex-col items-center">
                  <Mail className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Task 1: Correspondence</span>
                </div>
              </button>
              <button 
                onClick={() => onSkillSelect('reading-task2')}
                className="group bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1"
              >
                <div className="flex flex-col items-center">
                  <TrendingUp className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Task 2: Diagrams</span>
                </div>
              </button>
              <button 
                onClick={() => onSkillSelect('reading-task3')}
                className="group bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1"
              >
                <div className="flex flex-col items-center">
                  <BookOpen className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Task 3: Information</span>
                </div>
              </button>
              <button 
                onClick={() => onSkillSelect('reading-task4')}
                className="group bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1"
              >
                <div className="flex flex-col items-center">
                  <Users className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Task 4: Viewpoints</span>
                </div>
              </button>
              <button 
                onClick={() => onSkillSelect('listening-part1')}
                className="group bg-cyan-600 hover:bg-cyan-700 text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1"
              >
                <div className="flex flex-col items-center">
                  <Headphones className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Listening Part 1</span>
                </div>
              </button>
              <button 
                onClick={() => onSkillSelect('listening-part2')}
                className="group bg-violet-600 hover:bg-violet-700 text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1"
              >
                <div className="flex flex-col items-center">
                  <Users className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Listening Part 2</span>
                </div>
              </button>
              <button 
                onClick={() => onSkillSelect('listening-part3')}
                className="group bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1"
              >
                <div className="flex flex-col items-center">
                  <BookOpen className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Listening Part 3</span>
                </div>
              </button>
              <button 
                onClick={() => onSkillSelect('listening-part4')}
                className="group bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1"
              >
                <div className="flex flex-col items-center">
                  <Radio className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Listening Part 4</span>
                </div>
              </button>
              <button 
                onClick={() => onSkillSelect('listening-part5')}
                className="group bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1"
              >
                <div className="flex flex-col items-center">
                  <Users className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Listening Part 5</span>
                </div>
              </button>
              <button 
                onClick={() => onSkillSelect('listening-part6')}
                className="group bg-rose-600 hover:bg-rose-700 text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1"
              >
                <div className="flex flex-col items-center">
                  <Mic className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Listening Part 6</span>
                </div>
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                💡 <strong>Pro Tip:</strong> Start with Reading Task 1 or Listening Part 1 if you're new to CELPIP, or jump to any task to focus on specific skills.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;