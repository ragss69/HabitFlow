import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goalData: any) => void;
}

export interface GoalFormData {
  title: string;
  description: string;
  goalType: 'counter' | 'checklist' | 'dropdown';
  unit?: string;
  targetPerDay?: string;
  customOptions: string[];
}

const AddGoalModal: React.FC<AddGoalModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<GoalFormData>({
    title: '',
    description: '',
    goalType: 'counter',
    unit: '',
    targetPerDay: '',
    customOptions: []
  });

  const [newOption, setNewOption] = useState('');
  
  // Debug logging
  useEffect(() => {
    console.log('Modal isOpen:', isOpen);
  }, [isOpen]);

  const goalTypes = [
    { value: 'counter', label: 'Counter-based', description: 'Track quantities (water, steps, etc.)' },
    { value: 'checklist', label: 'Checklist-based', description: 'Simple yes/no tracking' },
    { value: 'dropdown', label: 'Dropdown Selection', description: 'Choose from predefined options' }
  ];

  const presetOptions = {
    water: ['250ml', '500ml', '1L', '1.5L'],
    exercise: ['Push Day', 'Pull Day', 'Leg Day', 'Cardio', 'Rest Day'],
    reading: ['15 minutes', '30 minutes', '1 hour', '2 hours']
  };

  const handleInputChange = (field: keyof GoalFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCustomOption = () => {
    if (newOption.trim() && !formData.customOptions.includes(newOption.trim())) {
      setFormData(prev => ({
        ...prev,
        customOptions: [...prev.customOptions, newOption.trim()]
      }));
      setNewOption('');
    }
  };

  const removeCustomOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customOptions: prev.customOptions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Goal created:', formData);
    
    // Convert to the expected format for the API
    const apiGoalData = {
      title: formData.title,
      description: formData.description,
      goalType: formData.goalType === 'counter' ? 'quantitative' : 'checklist',
      unit: formData.unit,
      targetPerDay: formData.targetPerDay ? parseInt(formData.targetPerDay) : undefined,
      checklistItems: formData.goalType === 'dropdown' ? formData.customOptions : [''],
      completionLogic: 'all' as const
    };
    
    onSubmit(apiGoalData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      goalType: 'counter',
      unit: '',
      targetPerDay: '',
      customOptions: []
    });
    setNewOption('');
    onClose();
  };

  const getPresetForTitle = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('water') || lowerTitle.includes('drink')) return 'water';
    if (lowerTitle.includes('gym') || lowerTitle.includes('exercise') || lowerTitle.includes('workout')) return 'exercise';
    if (lowerTitle.includes('read') || lowerTitle.includes('book')) return 'reading';
    return null;
  };

  if (!isOpen) {
    console.log('Modal not rendering - isOpen is false');
    return null;
  }

  console.log('Modal rendering with isOpen:', isOpen);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 9999
      }}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '448px',
          maxHeight: '90vh',
          overflowY: 'auto',
          fontFamily: 'Manrope, "Noto Sans", sans-serif'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
            margin: 0
          }}>
            Add New Goal
          </h2>
          <button
            onClick={handleClose}
            style={{
              padding: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Title */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Title
            </label>
            <input
              type="text"
              placeholder="e.g., Exercise Regularly"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.boxShadow = 'none';
              }}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Description (optional)
            </label>
            <textarea
              placeholder="Add a brief description of your goal"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                resize: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Goal Type */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '12px'
            }}>
              Goal Type
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {goalTypes.map((type) => (
                <label key={type.value} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="goalType"
                    value={type.value}
                    checked={formData.goalType === type.value}
                    onChange={(e) => handleInputChange('goalType', e.target.value)}
                    style={{
                      marginTop: '2px',
                      width: '16px',
                      height: '16px',
                      accentColor: '#3b82f6'
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: '500', color: '#111827', marginBottom: '2px' }}>{type.label}</div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>{type.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Conditional Fields Based on Goal Type */}
          {formData.goalType === 'counter' && (
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Unit
              </label>
              <input
                type="text"
                placeholder="e.g., Minutes, Steps, Liters"
                value={formData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          )}

          {formData.goalType === 'dropdown' && (
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Options
              </label>
              
              {/* Preset Options */}
              {getPresetForTitle(formData.title) && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Suggested options:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {presetOptions[getPresetForTitle(formData.title)!].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          if (!formData.customOptions.includes(option)) {
                            setFormData(prev => ({
                              ...prev,
                              customOptions: [...prev.customOptions, option]
                            }));
                          }
                        }}
                        style={{
                          padding: '4px 12px',
                          fontSize: '14px',
                          backgroundColor: '#eff6ff',
                          color: '#1d4ed8',
                          border: 'none',
                          borderRadius: '999px',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                      >
                        + {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Options */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="Add custom option"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomOption())}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={addCustomOption}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Added Options */}
              {formData.customOptions.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {formData.customOptions.map((option, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      backgroundColor: '#f9fafb', 
                      padding: '8px 12px', 
                      borderRadius: '6px' 
                    }}>
                      <span style={{ color: '#374151' }}>{option}</span>
                      <button
                        type="button"
                        onClick={() => removeCustomOption(index)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '2px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#dc2626'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#ef4444'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Daily Target */}
          {(formData.goalType === 'counter' || formData.goalType === 'dropdown') && (
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Target Per Day (optional)
              </label>
              <input
                type="text"
                placeholder={formData.goalType === 'counter' ? 'e.g., 30, 1000' : 'e.g., 2 (number of selections)'}
                value={formData.targetPerDay}
                onChange={(e) => handleInputChange('targetPerDay', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px 16px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
          >
            Save Goal
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGoalModal;