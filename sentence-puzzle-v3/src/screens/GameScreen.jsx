import { useState, useEffect, useCallback } from 'react'
import './GameScreen.css'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 句読点かどうか判定
function isPunct(word) {
  return ['.', '?', '!', ','].includes(word)
}

export default function GameScreen({ questions, unitLabel, onComplete, onBack }) {
  const [qIdx, setQIdx] = useState(0)
  const [chips, setChips] = useState([])
  const [selected, setSelected] = useState([])
  const [checked, setChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [answers, setAnswers] = useState([])

  const q = questions[qIdx]

  useEffect(() => {
    if (!q) return
    // 句読点も含めてシャッフル対象に
    const words = q.answer.map((w, i) => ({ word: w, id: i }))
    setChips(shuffle(words))
    setSelected([])
    setChecked(false)
    setIsCorrect(false)
  }, [qIdx, q])

  const handleChip = useCallback((chip) => {
    if (checked) return
    setChips(prev => prev.filter(c => c.id !== chip.id))
    setSelected(prev => [...prev, chip])
  }, [checked])

  const handleRemove = useCallback((chip) => {
    if (checked) return
    setSelected(prev => prev.filter(c => c.id !== chip.id))
    setChips(prev => [...prev, chip])
  }, [checked])

  function handleCheck() {
    const userAnswer = selected.map(c => c.word).join(' ')
    const correctAnswer = q.answer.join(' ')
    const correct = userAnswer === correctAnswer
    setChecked(true)
    setIsCorrect(correct)
    setAnswers(prev => [...prev, { question: q, userAnswer, correctAnswer, correct }])
  }

  function handleNext() {
    if (qIdx + 1 >= questions.length) {
      const all = [...answers]
      const score = all.filter(a => a.correct).length
      onComplete(score, all.length, all)
    } else {
      setQIdx(prev => prev + 1)
    }
  }

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Enter') {
        if (!checked && selected.length > 0) handleCheck()
        else if (checked) handleNext()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [checked, selected, handleCheck])

  if (!q) return null

  const progress = (qIdx / questions.length) * 100

  return (
    <div className="game-screen">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>← 戻る</button>
        <div className="progress-info">
          <span className="q-count">{qIdx + 1} / {questions.length}</span>
        </div>
      </div>

      <div className="progress-bar-wrap">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <div className="unit-label-small">{unitLabel}</div>

      <div className="japanese-card">
        <p className="japanese-text">{q.japanese}</p>
      </div>

      <div className={`answer-area ${checked ? (isCorrect ? 'correct-area' : 'wrong-area') : ''}`}>
        <div className="answer-chips">
          {selected.length === 0 ? (
            <span className="placeholder">ここに単語を並べよう</span>
          ) : (
            selected.map(chip => (
              <button
                key={chip.id}
                className={`chip selected-chip ${isPunct(chip.word) ? 'punct-chip' : ''} ${checked ? (isCorrect ? 'chip-correct' : 'chip-wrong') : ''}`}
                onClick={() => handleRemove(chip)}
                disabled={checked}
              >
                {chip.word}
              </button>
            ))
          )}
        </div>
      </div>

      {checked && (
        <div className={`feedback ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
          <div className="feedback-top">
            <span className="feedback-icon">{isCorrect ? '🎉' : '❌'}</span>
            <div className="feedback-main">
              <div className="feedback-label">{isCorrect ? '正解！' : '不正解'}</div>
              {!isCorrect && (
                <div className="correct-sentence">
                  <span className="correct-label">正解：</span>
                  {q.answer.join(' ')}
                </div>
              )}
            </div>
          </div>
          {q.explanation && (
            <div className="explanation-box">
              <span className="explanation-icon">💡</span>
              <span className="explanation-text">{q.explanation}</span>
            </div>
          )}
        </div>
      )}

      <div className="word-pool">
        {chips.map(chip => (
          <button
            key={chip.id}
            className={`chip pool-chip ${isPunct(chip.word) ? 'punct-chip' : ''}`}
            onClick={() => handleChip(chip)}
            disabled={checked}
          >
            {chip.word}
          </button>
        ))}
      </div>

      <div className="game-actions">
        {!checked ? (
          <button
            className="check-btn"
            onClick={handleCheck}
            disabled={selected.length === 0}
          >
            答え合わせ (Enter)
          </button>
        ) : (
          <button className="next-btn" onClick={handleNext}>
            {qIdx + 1 >= questions.length ? '結果を見る' : '次の問題'} →
          </button>
        )}
      </div>
    </div>
  )
}
