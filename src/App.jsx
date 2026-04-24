import { useState } from 'react'
import { GRADES, UNITS } from './questions.js'
import { QUESTIONS_J1 } from './questions_j1.js'
import { QUESTIONS_J2 } from './questions_j2.js'
import { QUESTIONS_J3 } from './questions_j3_full.js'
import SelectScreen from './screens/SelectScreen.jsx'
import GameScreen from './screens/GameScreen.jsx'
import ResultScreen from './screens/ResultScreen.jsx'

const ALL_QUESTIONS = {
  ...QUESTIONS_J1,
  ...QUESTIONS_J2,
  ...QUESTIONS_J3,
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function App() {
  const [screen, setScreen] = useState('select')
  const [selectedGrade, setSelectedGrade] = useState('j1')
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [questionCount, setQuestionCount] = useState(10)
  const [currentQuestions, setCurrentQuestions] = useState([])
  const [result, setResult] = useState(null)

  function handleStart(grade, unit, count) {
    setSelectedGrade(grade)
    setSelectedUnit(unit)
    setQuestionCount(count)
    const pool = ALL_QUESTIONS[unit] || []
    const picked = shuffle(pool).slice(0, count)
    setCurrentQuestions(picked)
    setScreen('game')
  }

  function handleComplete(score, total, answers) {
    setResult({ score, total, answers })
    setScreen('result')
  }

  function handleRetry() {
    const pool = ALL_QUESTIONS[selectedUnit] || []
    const picked = shuffle(pool).slice(0, questionCount)
    setCurrentQuestions(picked)
    setResult(null)
    setScreen('game')
  }

  function handleBack() {
    setScreen('select')
    setResult(null)
  }

  const unitLabel = selectedUnit
    ? (UNITS[selectedGrade] || []).find(u => u.id === selectedUnit)?.label || ''
    : ''

  return (
    <>
      {screen === 'select' && (
        <SelectScreen
          grades={GRADES}
          units={UNITS}
          onStart={handleStart}
          selectedGrade={selectedGrade}
          onGradeChange={(g) => { setSelectedGrade(g); setSelectedUnit(null); }}
        />
      )}
      {screen === 'game' && (
        <GameScreen
          questions={currentQuestions}
          unitLabel={unitLabel}
          onComplete={handleComplete}
          onBack={handleBack}
        />
      )}
      {screen === 'result' && (
        <ResultScreen
          result={result}
          unitLabel={unitLabel}
          onRetry={handleRetry}
          onBack={handleBack}
        />
      )}
    </>
  )
}
