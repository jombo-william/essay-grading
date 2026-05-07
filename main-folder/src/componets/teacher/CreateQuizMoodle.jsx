import { useState } from "react";
import { apiFetch } from "./api.js";

export default function CreateQuizMoodle({ 
  isOpen, 
  onClose, 
  onQuizCreated, 
  moodleToken, 
  moodleSiteUrl, 
  moodleCourses,
  showToast 
}) {
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    course_id: '',
    time_limit_minutes: '',
    shuffle_questions: false,
    shuffle_answers: false,
    questions: [
      {
        question_text: '',
        question_type: 'multiple_choice',
        points: 1.0,
        options: [
          { text: '', is_correct: false },
          { text: '', is_correct: false }
        ],
        correct_answer: ''
      }
    ]
  });
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          question_text: '',
          question_type: 'multiple_choice',
          points: 1.0,
          options: [
            { text: '', is_correct: false },
            { text: '', is_correct: false }
          ],
          correct_answer: ''
        }
      ]
    });
  };

  const removeQuestion = (index) => {
    if (quizData.questions.length === 1) {
      showToast("You must have at least one question", "error");
      return;
    }
    const newQuestions = [...quizData.questions];
    newQuestions.splice(index, 1);
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...quizData.questions];
    if (field === 'question_type') {
      newQuestions[index].question_type = value;
      if (value === 'multiple_choice') {
        newQuestions[index].options = [
          { text: '', is_correct: false },
          { text: '', is_correct: false }
        ];
        newQuestions[index].correct_answer = '';
      } else if (value === 'true_false') {
        newQuestions[index].correct_answer = '';
        newQuestions[index].options = null;
      } else {
        newQuestions[index].options = null;
        newQuestions[index].correct_answer = '';
      }
    } else if (field === 'points') {
      newQuestions[index].points = parseFloat(value);
    } else {
      newQuestions[index][field] = value;
    }
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const addOption = (qIndex) => {
    const newQuestions = [...quizData.questions];
    if (!newQuestions[qIndex].options) {
      newQuestions[qIndex].options = [];
    }
    newQuestions[qIndex].options.push({ text: '', is_correct: false });
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const removeOption = (qIndex, optIndex) => {
    const newQuestions = [...quizData.questions];
    if (newQuestions[qIndex].options.length <= 2) {
      showToast("Multiple choice questions need at least 2 options", "error");
      return;
    }
    newQuestions[qIndex].options.splice(optIndex, 1);
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const updateOption = (qIndex, optIndex, field, value) => {
    const newQuestions = [...quizData.questions];
    if (field === 'is_correct') {
      if (value) {
        newQuestions[qIndex].options.forEach((opt, idx) => {
          opt.is_correct = idx === optIndex;
        });
      } else {
        newQuestions[qIndex].options[optIndex].is_correct = false;
      }
    } else {
      newQuestions[qIndex].options[optIndex][field] = value;
    }
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!quizData.title.trim()) {
      showToast("Please enter a quiz title", "error");
      return;
    }
    
    const submitData = {
      title: quizData.title,
      description: quizData.description || "",
      course_id: quizData.course_id ? parseInt(quizData.course_id) : null,
      time_limit_minutes: quizData.time_limit_minutes ? parseInt(quizData.time_limit_minutes) : null,
      shuffle_questions: quizData.shuffle_questions,
      shuffle_answers: quizData.shuffle_answers,
      questions: quizData.questions.map(q => {
        const questionData = {
          question_text: q.question_text,
          question_type: q.question_type,
          points: parseFloat(q.points) || 1.0
        };
        
        if (q.question_type === 'multiple_choice' && q.options) {
          questionData.options = q.options.map(opt => ({
            text: opt.text,
            is_correct: opt.is_correct
          }));
        } else if (q.correct_answer) {
          questionData.correct_answer = q.correct_answer;
        }
        
        return questionData;
      })
    };
    
    for (let i = 0; i < submitData.questions.length; i++) {
      const q = submitData.questions[i];
      if (!q.question_text.trim()) {
        showToast(`Question ${i + 1} has no text`, "error");
        return;
      }
      if (q.question_type === 'multiple_choice') {
        const hasCorrect = q.options?.some(opt => opt.is_correct) || false;
        if (!hasCorrect) {
          showToast(`Question ${i + 1} needs a correct answer selected`, "error");
          return;
        }
      }
    }
    
    setLoading(true);
    try {
      const response = await apiFetch('/moodle/create-quiz', {
        method: 'POST',
        body: submitData,
        params: { 
          moodle_token: moodleToken || '',
          site_url: moodleSiteUrl || ''
        }
      });
      
      if (response.success) {
        showToast(`✅ Quiz created!`, "success");
        onQuizCreated(response);
        onClose();
        setQuizData({
          title: '',
          description: '',
          course_id: '',
          time_limit_minutes: '',
          shuffle_questions: false,
          shuffle_answers: false,
          questions: [{
            question_text: '',
            question_type: 'multiple_choice',
            points: 1.0,
            options: [{ text: '', is_correct: false }, { text: '', is_correct: false }],
            correct_answer: ''
          }]
        });
      }
    } catch (error) {
      showToast(error.message || "Failed to create quiz", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflowY: 'auto', padding: '20px' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '20px', maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        <div style={{ position: 'sticky', top: 0, backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>🎯 Create New Quiz</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer' }}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '24px' }}>
            <div>
              <label style={{ fontWeight: '700', fontSize: '13px', marginBottom: '6px', display: 'block' }}>Quiz Title *</label>
              <input type="text" style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', marginBottom: '16px', boxSizing: 'border-box' }} value={quizData.title} onChange={(e) => setQuizData({ ...quizData, title: e.target.value })} required />
            </div>
            
            <div>
              <label style={{ fontWeight: '700', fontSize: '13px', marginBottom: '6px', display: 'block' }}>Moodle Course (Optional)</label>
              <select style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', marginBottom: '16px' }} value={quizData.course_id || ''} onChange={(e) => setQuizData({ ...quizData, course_id: e.target.value })}>
                <option value="">Local Only (No Moodle Sync)</option>
                {moodleCourses.map(course => (
                  <option key={course.id} value={course.id}>{course.fullname || course.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ fontWeight: '700', fontSize: '13px', marginBottom: '6px', display: 'block' }}>Time Limit (minutes)</label>
              <input type="number" style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', marginBottom: '16px' }} value={quizData.time_limit_minutes} onChange={(e) => setQuizData({ ...quizData, time_limit_minutes: e.target.value })} placeholder="Leave empty for no time limit" />
            </div>
            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <label><input type="checkbox" checked={quizData.shuffle_questions} onChange={(e) => setQuizData({ ...quizData, shuffle_questions: e.target.checked })} /> Shuffle Questions</label>
              <label><input type="checkbox" checked={quizData.shuffle_answers} onChange={(e) => setQuizData({ ...quizData, shuffle_answers: e.target.checked })} /> Shuffle Answers</label>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <strong>📝 Questions</strong>
                <button type="button" onClick={addQuestion} style={{ padding: '8px 16px', backgroundColor: '#fff', color: '#6366f1', border: '1.5px solid #6366f1', borderRadius: '8px', cursor: 'pointer' }}>+ Add Question</button>
              </div>
              
              {quizData.questions.map((question, qIndex) => (
                <div key={qIndex} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '16px', background: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <strong>Question {qIndex + 1}</strong>
                    <button type="button" onClick={() => removeQuestion(qIndex)} style={{ padding: '4px 12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Remove</button>
                  </div>
                  
                  <textarea style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '12px', boxSizing: 'border-box' }} rows="2" value={question.question_text} onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)} placeholder="Question text" required />
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <select value={question.question_type} onChange={(e) => updateQuestion(qIndex, 'question_type', e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="true_false">True/False</option>
                      <option value="short_answer">Short Answer</option>
                      <option value="essay">Essay</option>
                    </select>
                    <input type="number" step="0.5" value={question.points} onChange={(e) => updateQuestion(qIndex, 'points', e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="Points" />
                  </div>
                  
                  {question.question_type === 'multiple_choice' && question.options && (
                    <div>
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                          <input type="text" style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }} value={option.text} onChange={(e) => updateOption(qIndex, optIndex, 'text', e.target.value)} placeholder={`Option ${optIndex + 1}`} required />
                          <label><input type="radio" name={`correct_${qIndex}`} checked={option.is_correct} onChange={() => updateOption(qIndex, optIndex, 'is_correct', true)} /> Correct</label>
                          {question.options.length > 2 && <button type="button" onClick={() => removeOption(qIndex, optIndex)} style={{ padding: '4px 8px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>×</button>}
                        </div>
                      ))}
                      <button type="button" onClick={() => addOption(qIndex)} style={{ padding: '6px 12px', backgroundColor: '#fff', color: '#6366f1', border: '1px solid #6366f1', borderRadius: '6px', cursor: 'pointer' }}>+ Add Option</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ position: 'sticky', bottom: 0, backgroundColor: '#fff', borderTop: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', backgroundColor: '#94a3b8', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>{loading ? "Creating..." : "✨ Create Quiz"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
