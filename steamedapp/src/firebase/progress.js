const MODULES = {
  1: { lessons: 12, startLesson: 1 },
  2: { lessons: 9, startLesson: 13 },
  3: { lessons: 4, startLesson: 22 },
  4: { lessons: 6, startLesson: 26 },
  5: { lessons: 5, startLesson: 32 }
};

const TOTAL_LESSONS = 36;

export const progressService = {
  calculateProgress: (module, lesson) => {
    if (module === 5 && lesson === 5) return 100;
    
    const completedLessons = MODULES[module].startLesson + lesson - 2;
    return Math.round((completedLessons / TOTAL_LESSONS) * 100);
  },

  getNextLesson: (currentModule, currentLesson) => {
    const moduleInfo = MODULES[currentModule];
    
    if (currentLesson < moduleInfo.lessons) {
      return { module: currentModule, lesson: currentLesson + 1 };
    }
    
    const nextModule = currentModule + 1;
    return { module: nextModule, lesson: 1 };
  }
};