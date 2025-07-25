import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import ReadingTask1 from './components/ReadingTask1';
import ReadingTask2 from './components/ReadingTask2';
import ReadingTask3 from './components/ReadingTask3';
import ReadingTask4 from './components/ReadingTask4';
import ListeningPart1 from './components/ListeningPart1';
import ListeningPart2 from './components/ListeningPart2';
import ListeningPart3 from './components/ListeningPart3';
import ListeningPart4 from './components/ListeningPart4';
import ListeningPart5 from './components/ListeningPart5';
import ListeningPart6 from './components/ListeningPart6';
import WritingTask1 from './components/WritingTask1';
import WritingTask2 from './components/WritingTask2';
import SpeakingTask1 from './components/SpeakingTask1';
import SpeakingTask2 from './components/SpeakingTask2';
import SpeakingTask3 from './components/SpeakingTask3';
import SpeakingTask4 from './components/SpeakingTask4';
import SpeakingTask5 from './components/SpeakingTask5';
import SpeakingTask6 from './components/SpeakingTask6';
import SpeakingTask7 from './components/SpeakingTask7';
import SpeakingTask8 from './components/SpeakingTask8';
import './App.css';

type CurrentView = 'dashboard' | 'reading-task1' | 'reading-task2' | 'reading-task3' | 'reading-task4' | 'listening-part1' | 'listening-part2' | 'listening-part3' | 'listening-part4' | 'listening-part5' | 'listening-part6' | 'writing-task1' | 'writing-task2' | 'speaking-task1' | 'speaking-task2' | 'speaking-task3' | 'speaking-task4' | 'speaking-task5' | 'speaking-task6' | 'speaking-task7' | 'speaking-task8';

function App() {
  const [currentView, setCurrentView] = useState<CurrentView>('dashboard');

  const handleSkillSelect = (skill: string) => {
    if (skill === 'reading-task1') {
      setCurrentView('reading-task1');
    } else if (skill === 'reading-task2') {
      setCurrentView('reading-task2');
    } else if (skill === 'reading-task3') {
      setCurrentView('reading-task3');
    } else if (skill === 'reading-task4') {
      setCurrentView('reading-task4');
    } else if (skill === 'listening-part1') {
      setCurrentView('listening-part1');
    } else if (skill === 'listening-part2') {
      setCurrentView('listening-part2');
    } else if (skill === 'listening-part3') {
      setCurrentView('listening-part3');
    } else if (skill === 'listening-part4') {
      setCurrentView('listening-part4');
    } else if (skill === 'listening-part5') {
      setCurrentView('listening-part5');
    } else if (skill === 'listening-part6') {
      setCurrentView('listening-part6');
    } else if (skill === 'writing-task1') {
      setCurrentView('writing-task1');
    } else if (skill === 'writing-task2') {
      setCurrentView('writing-task2');
    } else if (skill === 'speaking-task1') {
      setCurrentView('speaking-task1');
    } else if (skill === 'speaking-task2') {
      setCurrentView('speaking-task2');
    } else if (skill === 'speaking-task3') {
      setCurrentView('speaking-task3');
    } else if (skill === 'speaking-task4') {
      setCurrentView('speaking-task4');
    } else if (skill === 'speaking-task5') {
      setCurrentView('speaking-task5');
    } else if (skill === 'speaking-task6') {
      setCurrentView('speaking-task6');
    } else if (skill === 'speaking-task7') {
      setCurrentView('speaking-task7');
    } else if (skill === 'speaking-task8') {
      setCurrentView('speaking-task8');
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  return (
    <div className="App">
      {currentView === 'dashboard' && (
        <Dashboard onSkillSelect={handleSkillSelect} />
      )}
      {currentView === 'reading-task1' && (
        <ReadingTask1 onBackToDashboard={handleBackToDashboard} />
      )}
      {currentView === 'reading-task2' && (
        <ReadingTask2 onBackToDashboard={handleBackToDashboard} />
      )}
      {currentView === 'reading-task3' && (
        <ReadingTask3 onBackToDashboard={handleBackToDashboard} />
      )}
      {currentView === 'reading-task4' && (
        <ReadingTask4 onBackToDashboard={handleBackToDashboard} />
      )}
      {currentView === 'listening-part1' && (
        <ListeningPart1 onBackToDashboard={handleBackToDashboard} />
      )}
      {currentView === 'listening-part2' && (
        <ListeningPart2 onBackToDashboard={handleBackToDashboard} />
      )}
      {currentView === 'listening-part3' && (
        <ListeningPart3 onBackToDashboard={handleBackToDashboard} />
      )}
      {currentView === 'listening-part4' && (
        <ListeningPart4 onBackToDashboard={handleBackToDashboard} />
      )}
      {currentView === 'listening-part5' && (
        <ListeningPart5 onBackToDashboard={handleBackToDashboard} />
      )}
      {currentView === 'listening-part6' && (
        <ListeningPart6 onBackToDashboard={handleBackToDashboard} />
      )}
      {currentView === 'writing-task1' && (
        <WritingTask1 onBackToDashboard={handleBackToDashboard} />
      )}
      {currentView === 'writing-task2' && (
        <WritingTask2 onBackToDashboard={handleBackToDashboard} />
      )}
      {currentView === 'speaking-task1' && (
        <SpeakingTask1 onBackToDashboard={handleBackToDashboard} />
      )}
      {currentView === 'speaking-task2' && (
        <SpeakingTask2 onBackToDashboard={handleBackToDashboard} />
      )}
      {currentView === 'speaking-task3' && (
        <SpeakingTask3 onBackToDashboard={handleBackToDashboard} />
      )}
      {currentView === 'speaking-task4' && (
        <SpeakingTask4 onBackToDashboard={handleBackToDashboard} />
      )}
      {currentView === 'speaking-task5' && (
        <SpeakingTask5 onBackToDashboard={handleBackToDashboard} />
      )}
      {currentView === 'speaking-task6' && (
        <SpeakingTask6 onBackToDashboard={handleBackToDashboard} />
      )}
      {currentView === 'speaking-task7' && (
        <SpeakingTask7 onBackToDashboard={handleBackToDashboard} />
      )}
      {currentView === 'speaking-task8' && (
        <SpeakingTask8 onBackToDashboard={handleBackToDashboard} />
      )}
    </div>
  );
}

export default App;
