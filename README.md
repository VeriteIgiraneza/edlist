# EdList

A mobile task management and productivity app built for students. Organize tasks into color-coded folders, set due dates and reminders, and power through your to-do list with timed Focus Sessions.

## Features

### Task Management
- Create, edit, and delete tasks with swipe gestures
- Organize tasks into color-coded folders
- Set due dates and reminders with notifications
- Visual due date indicators — overdue (red), due today (orange), upcoming (green)
- Marquee scrolling for long task names
- Mark tasks complete by swiping left

### Focus Sessions
- Batch tasks by time period — Today, This Week, or This Month
- Assign start and end times to each task
- Real-time countdown timer that syncs with your clock
- Progress tracking across multiple tasks
- Session summary with completed task count and total time spent

### Timer System
- Per-task timer with pause/resume controls
- Pomodoro technique option (25 min work + 5 min break)
- Active timer bar displayed across the app
- Quick time presets (15, 25, 30, 45, 60, 90, 120 min)

### UI & Design
- Dark theme with card-based layout
- 15 folder color options
- Platform-aware spacing for iOS and Android
- Bell icon indicator for tasks with reminders

## Tech Stack

- **Framework:** React Native with TypeScript
- **Build Tool:** Expo (SDK 54)
- **Navigation:** React Navigation (Stack)
- **Gestures:** React Native Gesture Handler
- **UI Components:** React Native Paper, MaterialCommunityIcons
- **Date Handling:** date-fns, @react-native-community/datetimepicker
- **Storage:** Expo SQLite (local), MongoDB Atlas (planned sync)
- **Notifications:** Expo Notifications

## Getting Started

### Prerequisites
- Node.js
- Expo CLI
- Expo Go app (for development testing)

### Installation

```bash
git clone https://github.com/VeriteIgiraneza/Edulist.git
cd Edulist
npm install
```

### Running the App

```bash
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS).

## Project Structure

```
src/
├── components/
│   ├── focus/              # Focus Session components
│   │   ├── ActiveSessionView.tsx
│   │   ├── FocusTaskItem.tsx
│   │   ├── PlanningView.tsx
│   │   └── StatsCards.tsx
│   ├── ActiveTimerBar.tsx
│   ├── ColorPicker.tsx
│   ├── FolderCard.tsx
│   ├── FolderSelectorModal.tsx
│   ├── SwipeableTask.tsx
│   ├── TaskCard.tsx
│   └── TimerModal.tsx
├── constants/
│   ├── colors.ts
│   └── config.ts
├── contexts/
│   ├── FolderContext.tsx
│   └── TaskContext.tsx
├── data/
│   └── mockData.ts
├── database/
│   └── DatabaseService.ts
├── hooks/
│   └── useSessionTimer.ts
├── screens/
│   ├── AllTasksScreen.tsx
│   ├── EditTaskScreen.tsx
│   ├── FocusSessionScreen.tsx
│   ├── FoldersScreen.tsx
│   ├── NewFolderScreen.tsx
│   ├── NewTaskScreen.tsx
│   └── TasksScreen.tsx
├── types/
│   ├── Folder.ts
│   ├── Task.ts
│   └── index.ts
└── utils/
    ├── colorUtils.ts
    ├── dateUtils.ts
    └── notificationUtils.ts
```

## Roadmap

- [ ] Live data sync via MongoDB Atlas
- [ ] Push notifications (requires development build)
- [ ] Folder name and timer icon inside task cards
- [ ] Task sorting and filtering options
- [ ] Statistics and productivity insights
