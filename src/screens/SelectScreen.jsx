import { useState } from 'react'
import './SelectScreen.css'

export default function SelectScreen({ grades, units, onStart, selectedGrade: initGrade, onGradeChange, j3Loading }) {
  const [grade, setGrade] = useState(initGrade || 'j1')
  const [unit, setUnit] = useState(null)
  const [count, setCount] = useState(10)
  const [mode, setMode] = useState('normal')

  const currentUnits = units[grade] || []

  function handleGradeChange(g) {
    setGrade(g)
    setUnit(null)
    onGradeChange && onGradeChange(g)
  }

  function handleStart() {
    if (!unit) return
    const finalCount = mode === 'test' ? 10 : count
    onStart(grade, unit, finalCount, mode)
  }

  return (
    <div className="select-screen">
      <div className="select-hero">
        <h1 className="app-title">英語<br/>並び替えパズル</h1>
        <p className="app-sub">English Word Order Puzzle</p>
      </div>

      <div className="select-card">
        <div className="section-label">モードを選ぶ</div>
        <div className="mode-tabs">
          <button
            className={`mode-tab ${mode === 'normal' ? 'active' : ''}`}
            onClick={() => setMode('normal')}
          >
            <span className="mode-icon">🎮</span>
            <span className="mode-name">通常モード</span>
            <span className="mode-desc">自由に練習</span>
          </button>
          <button
            className={`mode-tab mode-tab-test ${mode === 'test' ? 'active' : ''}`}
            onClick={() => setMode('test')}
          >
            <span className="mode-icon">📝</span>
            <span className="mode-name">単元別テスト</span>
            <span className="mode-desc">10問・満点で合格</span>
          </button>
        </div>
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

      {mode === 'normal' && (
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
      )}

      {mode === 'test' && (
        <div className="test-info-banner">
          📝 ランダム10問・全問正解で合格
        </div>
      )}

      <button
        className={`start-btn ${mode === 'test' ? 'start-btn-test' : ''}`}
        disabled={!unit}
        onClick={handleStart}
      >
        {!unit ? '単元を選んでください' : mode === 'test' ? 'テスト開始！' : 'スタート！'}
      </button>
    </div>
  )
}
