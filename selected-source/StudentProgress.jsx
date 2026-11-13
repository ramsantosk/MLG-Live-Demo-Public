import { useState } from "react";
import { getStudentCatalog } from "../utils/connectedDemoCatalog";
import { getDemoProgress } from "../utils/demoProgress";
import { getLessonStatus } from "../utils/lessonAccess";
import "../styles/mlg_student_progress_scoped.css";

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

// Simple SVG charts keep the public demo static-hostable.
// No Chart.js dependency or remote database is required.
function QuizPerformanceChart({ attempts, quizzes }) {
  if (!attempts.length) {
    return <p className="chart-empty">No quiz attempts recorded yet. Complete a demo quiz to see your results.</p>;
  }

  const recent = attempts.slice(-8);
  const chartLeft = 60;
  const chartWidth = 585;
  const chartBottom = 218;
  const chartHeight = 164;
  const slotWidth = chartWidth / recent.length;
  const barWidth = Math.min(48, slotWidth * 0.6);

  return (
    <div className="chart-wrapper">
      <svg viewBox="0 0 700 270" role="img" aria-label={`Quiz scores by attempt, from oldest to newest: ${recent.map((attempt) => `${attempt.score}%`).join(", ")}`}>
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = chartBottom - (tick / 100) * chartHeight;
          return (
            <g key={tick}>
              <line x1={chartLeft} x2={chartLeft + chartWidth} y1={y} y2={y} stroke="#E2E8F0" strokeWidth="1" />
              <text x={chartLeft - 10} y={y + 4} fontSize="12" fill="#64748B" textAnchor="end">{tick}</text>
            </g>
          );
        })}
        {recent.map((attempt, index) => {
          const x = chartLeft + index * slotWidth + (slotWidth - barWidth) / 2;
          const height = (Math.max(0, Math.min(100, attempt.score)) / 100) * chartHeight;
          const quizName =
  quizzes.find((quiz) => quiz.id === attempt.quizId)?.title ??
  "Previous quiz";
          return (
            <g key={`${attempt.quizId}-${index}`}>
              <title>{`${quizName}: ${attempt.score}%`}</title>
              <rect x={x} y={chartBottom - height} width={barWidth} height={height} rx="5" fill="#3B82F6" />
              <text x={x + barWidth / 2} y={Math.max(17, chartBottom - height - 8)} textAnchor="middle" fontSize="12" fontWeight="600" fill="#1E40AF">{attempt.score}%</text>
              <text x={x + barWidth / 2} y={chartBottom + 22} textAnchor="middle" fontSize="12" fill="#64748B">{`#${attempts.length - recent.length + index + 1}`}</text>
            </g>
          );
        })}
        <text x="350" y="264" textAnchor="middle" fill="#64748B" fontSize="12">Quiz attempt</text>
      </svg>
    </div>
  );
}

function DifficultyTrendChart({ counts }) {
  const maxCount = Math.max(1, ...counts);
  const xPoints = [110, 350, 590];
  const chartBottom = 213;
  const chartHeight = 160;
  const yOf = (count) => chartBottom - (count / maxCount) * chartHeight;

  return (
    <div className="chart-wrapper">
      <svg viewBox="0 0 700 275" role="img" aria-label={`Completed lessons by difficulty: ${DIFFICULTIES.map((label, index) => `${label} ${counts[index]}`).join(", ")}`}>
        {[0, 0.5, 1].map((fraction) => {
          const y = chartBottom - fraction * chartHeight;
          return (
            <g key={fraction}>
              <line x1="60" x2="645" y1={y} y2={y} stroke="#E2E8F0" strokeWidth="1" />
              <text x="50" y={y + 4} fontSize="12" textAnchor="end" fill="#64748B">{Number((maxCount * fraction).toFixed(1))}</text>
            </g>
          );
        })}
        <polyline
          points={counts.map((count, index) => `${xPoints[index]},${yOf(count)}`).join(" ")}
          fill="none" stroke="#2563EB" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"
        />
        {counts.map((count, index) => (
          <g key={DIFFICULTIES[index]}>
            <circle cx={xPoints[index]} cy={yOf(count)} r="6" fill="#2563EB" stroke="white" strokeWidth="2" />
            <text x={xPoints[index]} y={Math.max(25, yOf(count) - 14)} textAnchor="middle" fontWeight="600" fontSize="13" fill="#1E40AF">{count}</text>
            <text x={xPoints[index]} y="245" textAnchor="middle" fontSize="12" fill="#64748B">{DIFFICULTIES[index]}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}



export default function StudentProgress({
  onBackToDashboard,
  onOpenCourses,
  onOpenQuizzes,
  onLogout,
}) {


  const [profileOpen, setProfileOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const progress = getDemoProgress();
  const studentCatalog = getStudentCatalog();
  const completedIds = new Set(progress.completedLessonIds);
  const attempts = progress.quizAttempts;
  const averageScore = attempts.length
    ? attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length
    : null;
  const latestQuiz = attempts.at(-1) ?? null;

  // Use the same per-course sequential status logic as MicroLessons.jsx.
  

const lessonRows = progress.enrolledCourses.flatMap(
  (course) => {
    const lessons = studentCatalog.lessons
      .filter(
        (lesson) => lesson.courseId === course.id
      )
      .sort(
        (a, b) =>
          (a.orderNo ?? 0) - (b.orderNo ?? 0) ||
          a.id - b.id
      );

    return lessons.map((lesson, index) => {
      const status = getLessonStatus(
        lesson,
        index,
        lessons,
        completedIds,
        studentCatalog.quizzes,
        progress.quizAttempts
      );

      return {
        ...lesson,
        courseTitle: course.title,
        status,
      };
    });
  }
);



  const completedLessons = lessonRows.filter((lesson) => lesson.status === "completed");
  const difficultyCounts = DIFFICULTIES.map((difficulty) =>
    completedLessons.filter((lesson) => lesson.difficulty.toLowerCase() === difficulty.toLowerCase()).length
  );

  // The original PHP page used fixed score bands for recommendations.
  // This demo reproduces those rules without describing them as live AI.
  let recommendation = "Keep learning to see a recommendation based on your latest quiz.";
  if (latestQuiz) {
    if (latestQuiz.score < 70) {
      recommendation = "You may need to review the last lesson before moving on.";
    } else if (latestQuiz.score < 85) {
      recommendation = "You're doing good! Try practicing intermediate exercises.";
    } else {
      recommendation = "Excellent performance! You're ready for more advanced content.";
    }
  }

  function comingSoon(feature) {
    setProfileOpen(false);
    setNotice(`${feature} will be connected in a later step.`);
  }

  return (
    <div className="mlg-student-progress">
      <nav className="navbar" aria-label="Student navigation">
        <div className="nav-left">
          <h2 className="logo">E-Learning</h2>
          <ul className="nav-links">
            <li><button type="button" onClick={() => onBackToDashboard?.()}>Dashboard</button></li>
            <li><button type="button" onClick={() => onOpenCourses?.()}>My Courses</button></li>
            <li><button type="button" onClick={() => onOpenQuizzes?.()}>Quizzes</button></li>
            <li className="active" aria-current="page">Progress</li>
          </ul>
        </div>
        <div className="profile-wrapper">
          <button
            type="button"
            className="profile-circle"
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((open) => !open)}
          >A</button>
          <div className={`profile-menu ${profileOpen ? "show" : ""}`}>
            <button type="button" onClick={() => comingSoon("My Profile")}>My Profile</button>
            <button type="button" onClick={() => comingSoon("Edit Profile")}>Edit Profile</button>
            <button type="button" onClick={() => onLogout?.()}>Logout</button>
          </div>
        </div>
      </nav>

      <main className="content">
        <header className="page-header">
          <h1>Your Learning Progress</h1>
          <p className="sub">Track your improvement and achievements over time.</p>
        </header>

        <section className="summary-grid" aria-label="Learning summary">
          <div className="summary-card">
            <h3>Overall Completion</h3>
            <div className="big-progress" role="progressbar" aria-label="Lessons completed" aria-valuenow={progress.overallProgress} aria-valuemin="0" aria-valuemax="100">
              <div className="big-progress-fill" style={{ width: `${progress.overallProgress}%` }} />
            </div>
            <p className="percent">{progress.overallProgress}% Completed</p>
            <p className="difficulty-sub">{progress.completedLessonCount} of {progress.totalLessons} enrolled lessons</p>
          </div>
          <div className="summary-card">
            <h3>Average Quiz Score</h3>
            <p className="difficulty-label">{averageScore === null ? "—" : `${averageScore.toFixed(1)}%`}</p>
            <p className="difficulty-sub">{attempts.length ? `Across ${attempts.length} quiz attempt${attempts.length === 1 ? "" : "s"}` : "No quiz attempts yet"}</p>
          </div>
          <div className="summary-card">
            <h3>Learning Streak</h3>
            <p className="streak-count">—</p>
            <p className="streak-small">Not tracked in this browser demo</p>
          </div>
        </section>

        <section className="chart-grid" aria-label="Performance charts">
          <div className="chart-card">
            <h3>Quiz Performance</h3>
            <QuizPerformanceChart
  attempts={attempts}
  quizzes={studentCatalog.quizzes}
/>
          </div>
          <div className="chart-card">
            <h3>Completed Lessons by Difficulty</h3>
            {completedLessons.length
              ? <DifficultyTrendChart counts={difficultyCounts} />
              : <p className="chart-empty">Complete a lesson to see your Completed Lessons by Difficulty.</p>}
          </div>
        </section>

        <section className="completed-section">
          <h3>Lesson Status</h3>
          {lessonRows.length === 0 ? (
            <p className="chart-empty">Enroll in a demo course to view its lessons.</p>
          ) : lessonRows.map((lesson) => (
            <div className="lesson-row" key={lesson.id}>
              <div>
                <strong>{lesson.title}</strong>
                <p className="sub">{lesson.courseTitle} · {lesson.difficulty}</p>
              </div>
              <span className={`status ${lesson.status}`}>
                {lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
              </span>
            </div>
          ))}
        </section>

        <section className="recommend-card">
          <h3>Learning Recommendation</h3>
          <p>{recommendation}</p>
          <p className="highlight">
            {latestQuiz ? `Latest Quiz Score: ${latestQuiz.score}%` : "No quiz results yet."}
          </p>
          <p style={{ fontSize: "12px" }}>This recommendation uses simple demo score rules; it is not AI-generated.</p>
        </section>

        {notice && (
          <p role="status" style={{ marginTop: "20px", padding: "14px", borderRadius: "8px", background: "#DBEAFE", color: "#1E40AF" }}>
            {notice}
          </p>
        )}
      </main>
    </div>
  );
}
