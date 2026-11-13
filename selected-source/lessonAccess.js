// Selected source sample from the MLG React/Vite portfolio demo.
// See README.md: this file is a reference excerpt, not a standalone app.

/**
 * A lesson is available when all earlier lessons in its course are completed,
 * and any published quizzes attached to those earlier lessons have been passed.
 * Completed lessons remain available for review.
 */
export function getLessonStatus(
  lesson,
  index,
  orderedLessons,
  completedIds,
  quizzes,
  quizAttempts
) {
  if (completedIds.has(lesson.id)) return "completed";

  const prerequisitesMet = orderedLessons
    .slice(0, index)
    .every((previousLesson) => {
      if (!completedIds.has(previousLesson.id)) return false;

      const quiz = quizzes.find(
        (item) => item.lessonId === previousLesson.id
      );
      if (!quiz) return true;

      return quizAttempts.some(
        (attempt) =>
          attempt.quizId === quiz.id &&
          attempt.passed === true
      );
    });

  return prerequisitesMet ? "ongoing" : "locked";
}
