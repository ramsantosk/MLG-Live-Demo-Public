# Micro-Lesson Generator — Portfolio Showcase

**Selected-source showcase** for the interactive **Micro-Lesson Generator** e-learning demonstration.

[**Try the live React/Vite demo**](https://mlg-live-demo.vercel.app/) · [**Developer GitHub profile**](https://github.com/ramsantosk)

## About the project

The original Micro-Lesson Generator was developed as a **freelance PHP/MySQL e-learning system** for a university thesis. The publicly accessible React/Vite demo is a separate portfolio recreation designed to demonstrate representative workflows. It is **not** the complete production system.

The demo showcases student and instructor views, course and micro-lesson navigation, quizzes, progress tracking, and sequential content unlocking. It uses browser-local data; no original database, client records, or production authentication is connected.

## Selected source files

| File | What it demonstrates |
| --- | --- |
| [`selected-source/lessonAccess.js`](selected-source/lessonAccess.js) | Sequential lesson access based on lesson completion and previously passed quizzes |
| [`selected-source/StudentProgress.jsx`](selected-source/StudentProgress.jsx) | Student progress display, SVG charts, quiz score trends, and learning recommendations |

**Scope:** These are selected code samples from the portfolio demo, not a complete runnable application. Other imported modules and styles are intentionally omitted. The progress screen is a development snapshot with a missing import restored for clarity. It may differ slightly from the latest private build.

## Key implementation concepts

- Role-based **demo navigation** for students and instructors (not production authentication)
- Browser-local course, lesson, quiz, and progress data
- Lesson-unlocking rules that require completing earlier lessons and passing their associated quizzes where present
- Quiz results and visual progress summaries

## Source Code Availability

This public repository contains **selected code samples only** from a portfolio recreation of a freelance-developed system. The complete original PHP/MySQL production source, database, and client-specific configuration are **not publicly distributed**. The full React/Vite demo source is kept in a separate private repository.

For further information about the implementation or development work, **please contact the developer through the [GitHub profile](https://github.com/ramsantosk) or developer portfolio**.

## Screenshots

Approved screenshots can be added to [`screenshots/`](screenshots/). Screenshots are intentionally omitted from this package pending a privacy review.

## Disclaimer

This is a **portfolio demonstration only**. Some original features are simplified or unavailable, and stored demo data does not synchronize between browsers or devices. The original client-developed application is separate from this showcase.
