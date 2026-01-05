import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Book, Calendar, Target, Award, Menu, X } from 'lucide-react';

const IELTSStudyTracker = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentWeek, setCurrentWeek] = useState(1);
  const [completedTasks, setCompletedTasks] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load progress from storage
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const weekResult = await window.storage.get('current-week');
        if (weekResult?.value) {
          setCurrentWeek(parseInt(weekResult.value));
        }
        
        const tasksResult = await window.storage.get('completed-tasks');
        if (tasksResult?.value) {
          setCompletedTasks(JSON.parse(tasksResult.value));
        }
      } catch (error) {
        console.log('First time loading - no saved progress yet');
      } finally {
        setLoading(false);
      }
    };
    
    loadProgress();
  }, []);

  // Save progress to storage
  const saveProgress = async (week, tasks) => {
    try {
      await window.storage.set('current-week', week.toString());
      await window.storage.set('completed-tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const toggleTask = (taskId) => {
    const newCompletedTasks = {
      ...completedTasks,
      [taskId]: !completedTasks[taskId]
    };
    setCompletedTasks(newCompletedTasks);
    saveProgress(currentWeek, newCompletedTasks);
  };

  const changeWeek = (newWeek) => {
    setCurrentWeek(newWeek);
    saveProgress(newWeek, completedTasks);
  };

  const lightDaySchedule = [
    { time: '30 Min', activity: 'Active Listening', task: 'Podcast: The Economist, HBR IdeaCast, or IELTS Energy. Write down 3 phrases you hear.' },
    { time: '45 Min', activity: 'Focused Skill', task: 'Tue/Thu: Reading (1 passage + summarize). Wed/Fri: Listening (2 sections).' },
    { time: '15 Min', activity: 'Vocab Review', task: 'Review flashcards. Create 1 sentence for each new word relating to Dublin/Marketing.' },
    { time: '30 Min', activity: 'Speaking (Shadowing)', task: 'Shadow a Band 9 video. Record yourself and compare.' }
  ];

  const heavyDaySchedule = [
    { time: '60 Min', activity: 'Writing Task 2', task: '15 min plan (PEEL method) + 40 min write + 5 min check grammar.' },
    { time: '60 Min', activity: 'Full Practice Test', task: 'Sat: Reading Full Test. Sun: Listening. Mon: Writing Task 1.' },
    { time: '60 Min', activity: 'Review & Analysis', task: 'Analyze mistakes. Why wrong? Vocab? Logic? Distraction?' },
    { time: '45 Min', activity: 'Speaking Part 2 & 3', task: 'Record Cue Card (2 mins). Listen back. Re-record until perfect.' }
  ];

  const roadmap = [
    { month: 'Month 1 (Jan)', title: 'Foundation & Accuracy', goal: 'Stop making "silly" mistakes (singular/plural, tenses)', focus: 'Review Articles (a/an/the) and Subject-Verb Agreement' },
    { month: 'Month 2 (Feb)', title: 'Lexical Resource & Structure', goal: 'Inject "Less Common" vocabulary', focus: 'Replace basic words with precise ones. Master cohesion and signposting.' },
    { month: 'Month 3 (Mar)', title: 'Speed & Critical Thinking', goal: 'Speed up Reading/Writing', focus: 'Practice skimming vs scanning. 5-minute essay plans. Intelligent stalling.' },
    { month: 'Month 4 (Apr)', title: 'Exam Mode', goal: 'Build stamina', focus: 'Full 2hr 40min tests every Sunday. Perfect what you know.' }
  ];

  const getCurrentMonthInfo = () => {
    const monthIndex = Math.floor((currentWeek - 1) / 4);
    return roadmap[Math.min(monthIndex, 3)];
  };

  const getWeekProgress = () => {
    const weekTasks = Object.keys(completedTasks).filter(key => 
      key.startsWith(`week${currentWeek}-`)
    );
    const completed = weekTasks.filter(key => completedTasks[key]).length;
    return { completed, total: 7 }; // 4 light days + 3 heavy days
  };

  const DashboardView = () => {
    const monthInfo = getCurrentMonthInfo();
    const weekProgress = getWeekProgress();
    const progressPercent = (weekProgress.completed / weekProgress.total) * 100;

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">Week {currentWeek} of 16</h2>
          <p className="text-blue-100">{monthInfo.month}: {monthInfo.title}</p>
          <div className="mt-4 bg-white/20 rounded-full h-3">
            <div 
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-sm mt-2 text-blue-100">{weekProgress.completed} of {weekProgress.total} days completed this week</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="text-green-600" size={24} />
              <h3 className="text-lg font-semibold">Light Days</h3>
            </div>
            <p className="text-gray-600 text-sm mb-2">Tue, Wed, Thu, Fri</p>
            <p className="text-gray-700">1.5-2 hours: Input, vocab, maintenance</p>
            <button 
              onClick={() => setCurrentView('light-days')}
              className="mt-3 text-green-600 font-medium hover:underline"
            >
              View Schedule →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-3">
              <Target className="text-orange-600" size={24} />
              <h3 className="text-lg font-semibold">Heavy Days</h3>
            </div>
            <p className="text-gray-600 text-sm mb-2">Sat, Sun, Mon</p>
            <p className="text-gray-700">3-4 hours: Output, critical thinking, full tests</p>
            <button 
              onClick={() => setCurrentView('heavy-days')}
              className="mt-3 text-orange-600 font-medium hover:underline"
            >
              View Schedule →
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="text-purple-600" size={24} />
            <h3 className="text-lg font-semibold">Current Month Focus</h3>
          </div>
          <div className="space-y-2">
            <div>
              <span className="font-medium text-gray-700">Goal:</span>
              <p className="text-gray-600">{monthInfo.goal}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Focus:</span>
              <p className="text-gray-600">{monthInfo.focus}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Remember:</strong> Moving from 6.0 to 7.0 requires shifting from "understanding" to "analyzing" English. Use Dublin as your lab!
          </p>
        </div>
      </div>
    );
  };

  const LightDaysView = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
        <h3 className="font-semibold text-green-900 mb-2">Light Days: Tue, Wed, Thu, Fri</h3>
        <p className="text-green-800 text-sm">Total Time: 1.5 - 2 Hours | Focus: Input, Vocab Accumulation, Maintenance</p>
      </div>

      {lightDaySchedule.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-start gap-4">
            <button
              onClick={() => toggleTask(`week${currentWeek}-light-${index}`)}
              className="flex-shrink-0 mt-1"
            >
              {completedTasks[`week${currentWeek}-light-${index}`] ? (
                <CheckCircle className="text-green-500" size={24} />
              ) : (
                <Circle className="text-gray-300" size={24} />
              )}
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {item.time}
                </span>
                <h4 className="font-semibold text-gray-800">{item.activity}</h4>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{item.task}</p>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Light Days Tip</h4>
        <p className="text-blue-800 text-sm">Consistency is key! Even 90 minutes daily builds momentum. Treat your commute and DBS lectures as English practice opportunities.</p>
      </div>
    </div>
  );

  const HeavyDaysView = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
        <h3 className="font-semibold text-orange-900 mb-2">Heavy Days: Sat, Sun, Mon</h3>
        <p className="text-orange-800 text-sm">Total Time: 3 - 4 Hours | Focus: Output, Critical Thinking, Full Simulations</p>
      </div>

      {heavyDaySchedule.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-start gap-4">
            <button
              onClick={() => toggleTask(`week${currentWeek}-heavy-${index}`)}
              className="flex-shrink-0 mt-1"
            >
              {completedTasks[`week${currentWeek}-heavy-${index}`] ? (
                <CheckCircle className="text-orange-500" size={24} />
              ) : (
                <Circle className="text-gray-300" size={24} />
              )}
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  {item.time}
                </span>
                <h4 className="font-semibold text-gray-800">{item.activity}</h4>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{item.task}</p>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="font-semibold text-red-900 mb-2">🎯 Heavy Days Reminder</h4>
        <p className="text-red-800 text-sm">The Review & Analysis hour is THE MOST IMPORTANT. Understanding why you made mistakes is how you improve from 6.0 to 7.0.</p>
      </div>
    </div>
  );

  const PEELView = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
        <h3 className="font-semibold text-purple-900 mb-2">The PEEL + Counter Method</h3>
        <p className="text-purple-800 text-sm">Critical thinking framework for Band 7.0+ in Writing & Speaking</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-400">
          <h4 className="font-bold text-blue-900 mb-2">P - Point</h4>
          <p className="text-gray-700">State your main idea clearly</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-400">
          <h4 className="font-bold text-green-900 mb-2">E - Explanation</h4>
          <p className="text-gray-700">Why is this true? Use "This is because..."</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-yellow-400">
          <h4 className="font-bold text-yellow-900 mb-2">E - Example</h4>
          <p className="text-gray-700">Real-world evidence. Use your Hospitality/Marketing knowledge!</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-orange-400">
          <h4 className="font-bold text-orange-900 mb-2">L - Link</h4>
          <p className="text-gray-700">Connect back to the original question</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-red-400">
          <h4 className="font-bold text-red-900 mb-2">C - Counter (Optional for 7.0+)</h4>
          <p className="text-gray-700">"However, some argue X, but this is flawed because..."</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-5">
        <h4 className="font-semibold text-gray-800 mb-3">Example Comparison</h4>
        
        <div className="space-y-4">
          <div className="bg-white/70 rounded p-4">
            <p className="text-sm font-medium text-red-600 mb-2">❌ Basic (6.0)</p>
            <p className="text-gray-700 italic">"Remote work is good because people save time."</p>
          </div>

          <div className="bg-white/70 rounded p-4">
            <p className="text-sm font-medium text-green-600 mb-2">✅ Critical Thinking (7.0)</p>
            <p className="text-gray-700 italic">
              "Remote work enhances productivity <span className="font-semibold">(Point)</span> because it eliminates the daily commute, reducing physical fatigue <span className="font-semibold">(Explanation)</span>. For instance, a digital marketer in Dublin saves 10 hours a week avoiding the M50 traffic, using that time for upskilling <span className="font-semibold">(Example)</span>."
            </p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2">✏️ Practice Exercise</h4>
        <p className="text-yellow-800 text-sm mb-3">Pick a Writing Task 2 topic. Spend 10 minutes planning using PEEL. Don't write the essay yet - just the plan!</p>
        <p className="text-yellow-800 text-sm">Use your Hospitality Management background and DBS Marketing knowledge for examples.</p>
      </div>
    </div>
  );

  const RoadmapView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 p-4 rounded">
        <h3 className="font-semibold text-indigo-900 mb-2">16-Week Roadmap (Jan 6 - Apr 26)</h3>
        <p className="text-indigo-800 text-sm">Your journey from 6.0 to 7.0</p>
      </div>

      {roadmap.map((month, index) => (
        <div 
          key={index} 
          className={`bg-white rounded-lg shadow-md p-5 border-l-4 ${
            index === Math.floor((currentWeek - 1) / 4) 
              ? 'border-indigo-500 ring-2 ring-indigo-200' 
              : 'border-gray-300'
          }`}
        >
          <div className="flex items-start gap-3 mb-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              index === Math.floor((currentWeek - 1) / 4)
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {index + 1}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800">{month.month}</h4>
              <p className="text-lg font-semibold text-indigo-600">{month.title}</p>
            </div>
          </div>
          
          <div className="ml-13 space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-700">Goal:</span>
              <p className="text-sm text-gray-600">{month.goal}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Focus:</span>
              <p className="text-sm text-gray-600">{month.focus}</p>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">🎯 Final Week Tip</h4>
        <p className="text-green-800 text-sm">Stop learning new complex words 1 week before the exam. Focus on using what you know perfectly.</p>
      </div>
    </div>
  );

  const ResourcesView = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h3 className="font-semibold text-blue-900 mb-2">Essential Resources</h3>
        <p className="text-blue-800 text-sm">Get these before starting your 16-week journey</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-md p-5">
          <h4 className="font-semibold text-gray-800 mb-3">📚 Cambridge IELTS Books</h4>
          <p className="text-gray-600 text-sm mb-2">Cambridge IELTS Academic Books 15-18</p>
          <p className="text-gray-500 text-xs">The gold standard for practice tests</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <h4 className="font-semibold text-gray-800 mb-3">📝 Vocabulary Notebook</h4>
          <p className="text-gray-600 text-sm mb-2">Physical notebook or Anki App</p>
          <p className="text-gray-500 text-xs">Organize by topic: Environment, Technology, Marketing, Hospitality</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <h4 className="font-semibold text-gray-800 mb-3">✍️ Writing Corrections</h4>
          <p className="text-gray-600 text-sm mb-2">Teacher, peer, or AI tool for feedback</p>
          <p className="text-gray-500 text-xs">You cannot improve writing alone - get feedback!</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <h4 className="font-semibold text-gray-800 mb-3">🎧 Recommended Podcasts</h4>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>• The Economist</li>
            <li>• HBR IdeaCast (perfect for your Marketing degree!)</li>
            <li>• IELTS Energy</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <h4 className="font-semibold text-gray-800 mb-3">🎥 YouTube Resources</h4>
          <p className="text-gray-600 text-sm">Search for "IELTS Band 9 Speaking" videos for shadowing practice</p>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-semibold text-purple-900 mb-2">🌍 Dublin Context</h4>
        <p className="text-purple-800 text-sm">Use your daily life in Dublin as a lab! Listen to DBS lecturers' transitions, practice vocabulary in coffee shops, shadow Irish accents.</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your study tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Book className="text-indigo-600" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">IELTS 6.0 → 7.0</h1>
                <p className="text-sm text-gray-600">16-Week Study Tracker</p>
              </div>
            </div>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Desktop Week Selector */}
            <div className="hidden lg:flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Week:</label>
              <select
                value={currentWeek}
                onChange={(e) => changeWeek(parseInt(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
              >
                {[...Array(16)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>Week {i + 1}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile Week Selector */}
          <div className="lg:hidden mt-3">
            <select
              value={currentWeek}
              onChange={(e) => changeWeek(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
            >
              {[...Array(16)].map((_, i) => (
                <option key={i + 1} value={i + 1}>Week {i + 1}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`bg-white border-b border-gray-200 ${mobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:space-x-1">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'light-days', label: 'Light Days' },
              { id: 'heavy-days', label: 'Heavy Days' },
              { id: 'peel', label: 'PEEL Method' },
              { id: 'roadmap', label: 'Roadmap' },
              { id: 'resources', label: 'Resources' }
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => {
                  setCurrentView(id);
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  currentView === id
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'light-days' && <LightDaysView />}
        {currentView === 'heavy-days' && <HeavyDaysView />}
        {currentView === 'peel' && <PEELView />}
        {currentView === 'roadmap' && <RoadmapView />}
        {currentView === 'resources' && <ResourcesView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>Your journey from 6.0 to 7.0 | Jan 6 - Apr 26, 2026</p>
          <p className="mt-1 text-xs text-gray-500">Progress is saved automatically</p>
        </div>
      </footer>
    </div>
  );
};

export default IELTSStudyTracker;