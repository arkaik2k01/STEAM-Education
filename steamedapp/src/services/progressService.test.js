import { progressService } from './progressService';

describe('progressService', () => {
  test('calculateProgress should return correct percentage', () => {
    expect(progressService.calculateProgress(1, 5)).toBe(40); // Example: 4 out of 10 lessons
  });

  test('getNextLesson should return next lesson correctly', () => {
    expect(progressService.getNextLesson(1, 10)).toEqual({ module: 2, lesson: 1 }); // Move to next module
    expect(progressService.getNextLesson(1, 5)).toEqual({ module: 1, lesson: 6 }); // Next lesson in the same module
  });
}); 