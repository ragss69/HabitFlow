import React, { useState } from 'react';
import { Goal } from '../types';
import GoalCard from './GoalCard';
import AddGoalModal, { GoalFormData } from './AddGoalModal';

interface GoalSectionProps {
  goals: Goal[];
  onEditGoal?: (goal: Goal) => void;
  onDeleteGoal?: (goalId: string) => void;
  onAddGoal?: (goalData: GoalFormData) => void;
}

const GoalSection: React.FC<GoalSectionProps> = ({ 
  goals, 
  onEditGoal, 
  onDeleteGoal, 
  onAddGoal 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddGoal = () => {
    setIsModalOpen(true);
  };

  const handleSubmitGoal = (goalData: GoalFormData) => {
    if (onAddGoal) {
      onAddGoal(goalData);
    }
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Goals</h2>
        <button
          onClick={handleAddGoal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Goal
        </button>
      </div>
      
      {goals.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No goals yet. Create your first goal to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={onEditGoal}
              onDelete={onDeleteGoal}
            />
          ))}
        </div>
      )}

      <AddGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitGoal}
      />
    </section>
  );
};

export default GoalSection;
