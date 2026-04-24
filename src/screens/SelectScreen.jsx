import { useState } from 'react'
import './SelectScreen.css'

export default function SelectScreen({ grades, units, onStart, selectedGrade: initGrade, onGradeChange, j3Loading }) {
  const [grade, setGrade] = useState(initGrade || 'j1')
  const [unit, setUnit] = useState(null)
  const [count, setCount] = useState(10)

  const currentUnits = units[grade] || []

  function handleGradeChange(g) {
    setGrade(g)
    setUnit(null)
    onGradeChange && onGradeChange(g)
  }

  function handleStart() {
    if (!unit) return
    onStart(grade, unit, count)
  }

  return (
    <div className="select-screen">
      <div className="select-hero">
        <h1 className="app-title">英語<br/>並び替えパズル</h1>
        <p className="app-sub">English Word Order Puzzle</p>
      </div>

      <div className="select-card">
        <div className="section-label">学年を選ぶ</div>
        <div className="grade-tabs">
          {grades.map(g => (
            <button
              key={g.id}
              className={`grade-tab ${grade === g.id ? 'active' : ''}`}
              onClick={() => handleGradeChange(g.id)}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="select-card">
        <div className="section-label">
          単元を選ぶ
          {grade === 'j3' && j3Loading && <span className="loading-badge">読み込み中…</span>}
        </div>
        <div className="unit-list">
          {currentUnits.map(u => (
            <button
              key={u.id}
              className={`unit-item ${unit === u.id ? 'active' : ''}`}
              onClick={() => setUnit(u.id)}
            >
              <span className="unit-name">{u.label}</span>
              <span className="unit-count">{u.count}問</span>
            </button>
          ))}
        </div>
      </div>

      <div className="select-card">
        <div className="section-label">問題数を選ぶ</div>
        <div className="count-pills">
          {[5, 10, 15, 20].map(n => (
            <button
              key={n}
              className={`count-pill ${count === n ? 'active' : ''}`}
              onClick={() => setCount(n)}
            >
              {n}問
            </button>
          ))}
        </div>
      </div>

      <button
        className="start-btn"
        disabled={!unit}
        onClick={handleStart}
      >
        {unit ? 'スタート！' : '単元を選んでください'}
      </button>
    </div>
  )
}
