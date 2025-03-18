export const progressService = {
  /**
   * Calculate the progress percentage based on the current module and lesson.
   * @param {number} currentModule - The current module number.
   * @param {number} currentLesson - The current lesson number.
   * @returns {number} - The calculated progress percentage.
   */
  calculateProgress: (currentModule, currentLesson) => {
    // Example logic: Assume each module has 10 lessons
    const totalLessons = 10;
    const progress = ((currentLesson - 1) / totalLessons) * 100;
    return Math.min(progress, 100); // Ensure progress does not exceed 100%
  },

  /**
   * Determine the next module and lesson for a student.
   * @param {number} currentModule - The current module number.
   * @param {number} currentLesson - The current lesson number.
   * @returns {Object} - An object containing the next module and lesson numbers.
   */
  getNextLesson: (currentModule, currentLesson) => {
    // Example logic: Move to the next lesson, or next module if the last lesson is completed
    const totalLessons = 10;
    let nextModule = currentModule;
    let nextLesson = currentLesson + 1;

    if (nextLesson > totalLessons) {
      nextModule += 1;
      nextLesson = 1;
    }

    return { module: nextModule, lesson: nextLesson };
  }
}; 