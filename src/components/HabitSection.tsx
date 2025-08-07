import React from 'react';
import HabitCard from './HabitCard';

interface Habit {
  id: string;
  name: string;
  description?: string;
  completed: boolean;
}

interface HabitSectionProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  onEditHabit?: (id: string) => void;
  onDeleteHabit?: (id: string) => void;
  onAddHabit?: () => void;
}

const HabitSection: React.FC<HabitSectionProps> = ({ 
  habits, 
  onToggleHabit, 
  onEditHabit, 
  onDeleteHabit, 
  onAddHabit 
}) => {
  const completedHabits = habits.filter(habit => habit.completed).length;
  const totalHabits = habits.length;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Habits</h2>
          <p className="text-sm text-gray-600">
            {completedHabits} of {totalHabits} completed
          </p>
        </div>
        {onAddHabit && (
          <button
            onClick={onAddHabit}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Habit
          </button>
        )}
      </div>
      
      {habits.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No habits yet. Create your first habit to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              id={habit.id}
              name={habit.name}
              description={habit.description}
              completed={habit.completed}
              onToggle={onToggleHabit}
              onEdit={onEditHabit}
              onDelete={onDeleteHabit}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HabitSection;
