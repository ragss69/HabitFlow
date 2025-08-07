# Goal Modal Implementation

## Overview
This implementation adds a modal form for creating new goals with two types: **Quantitative** and **Checklist**.

## Features

### Modal Design
- **80% width modal** with backdrop blur effect
- **Clean, modern UI** matching the provided design
- **Responsive design** with proper mobile support
- **Smooth animations** and transitions

### Goal Types

#### 1. Quantitative Goals
- **Title**: Required field for goal name
- **Description**: Optional detailed description
- **Unit**: Required field (e.g., "Minutes", "Steps", "Pages")
- **Target Per Day**: Optional numeric target

#### 2. Checklist Goals
- **Title**: Required field for goal name
- **Description**: Optional detailed description
- **Checklist Items**: Dynamic list of tasks/items
- **Completion Logic**: Choose between:
  - **All items**: Goal completed when ALL checklist items are checked
  - **Any item**: Goal completed when ANY checklist item is checked

### Form Validation
- Title is required for all goals
- Unit is required for quantitative goals
- At least one checklist item is required for checklist goals
- Proper error messages for validation failures

## Database Schema Updates

The Prisma schema has been updated to support the new goal structure:

```prisma
model Goal {
  id              String   @id @default(cuid())
  name            String
  description     String?
  color           String
  icon            String
  isDefault       Boolean  @default(false)
  goalType        String   @default("quantitative") // 'quantitative' | 'checklist'
  unit            String?  // For quantitative goals
  targetPerDay    Int?     // For quantitative goals
  checklistItems  String?  // JSON string for checklist items
  completionLogic String   @default("all") // 'all' | 'any' for checklist goals
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  userId          String

  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  components  Component[]
  entries     Entry[]
  streak      Streak?

  @@map("goals")
}
```

## API Endpoint

The `/api/goals` POST endpoint has been updated to handle the new goal structure:

```typescript
// Example request body
{
  "title": "Exercise Regularly",
  "description": "Stay fit and healthy",
  "goalType": "quantitative",
  "unit": "Minutes",
  "targetPerDay": 30
}

// Or for checklist goals
{
  "title": "Morning Routine",
  "description": "Complete daily morning tasks",
  "goalType": "checklist",
  "checklistItems": ["Brush teeth", "Drink water", "Exercise"],
  "completionLogic": "all"
}
```

## Components

### AddGoalModal
- **Location**: `src/components/AddGoalModal.tsx`
- **Props**: `isOpen`, `onClose`, `onSubmit`
- **Features**: Form validation, dynamic fields, checklist management

### GoalSection
- **Location**: `src/components/GoalSection.tsx`
- **Updated**: Now includes modal integration
- **Features**: Handles modal state and goal submission

## Usage

1. **Click "Add Goal" button** in the dashboard
2. **Fill out the form** with goal details
3. **Choose goal type** (Quantitative or Checklist)
4. **Add specific details** based on goal type
5. **Submit the form** to create the goal

## Styling

The modal uses Tailwind CSS classes for consistent styling:
- **Backdrop**: `bg-black bg-opacity-50 backdrop-blur-sm`
- **Modal**: `bg-white rounded-2xl shadow-2xl`
- **Form fields**: `border-2 border-gray-200 rounded-lg`
- **Buttons**: `bg-blue-600 text-white rounded-lg`

## Future Enhancements

- [ ] Add goal editing functionality
- [ ] Implement goal progress tracking
- [ ] Add goal categories/tags
- [ ] Include goal templates
- [ ] Add goal sharing features 