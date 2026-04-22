import './ResultScreen.css'

export default function ResultScreen({ result, unitLabel, onRetry, onBack }) {
  const { score, total, answers } = result
  const pct = Math.round((score / total) * 100)
  const msg = pct === 100 ? '🏆 パーフェクト！' : pct >= 80 ? '🎉 すばらしい！' : pct >= 60 ? '👍 よくできました！' : '💪 もう一度チャレンジ！'

  return (
    <div className="result-screen">
      <div className="result-hero">
        <div className="result-msg">{msg}</div>
        <div className="score-circle">
          <div className="score-num">{score}</div>
          <div className="score-total">/ {total}</div>
        </div>
        <div className="score-pct">{pct}%正解</div>
        <div className="result-unit">{unitLabel}</div>
      </div>

      <div className="result-actions">
        <button className="retry-btn" onClick={onRetry}>もう一度</button>
        <button className="back-result-btn" onClick={onBack}>単元を選び直す</button>
      </div>

      <div className="review-section">
        <div className="review-title">振り返り</div>
        {answers.map((a, i) => (
          <div key={i} className={`review-item ${a.correct ? 'review-correct' : 'review-wrong'}`}>
            <div className="review-header">
              <span className="review-icon">{a.correct ? '✅' : '❌'}</span>
              <span className="review-japanese">{a.question.japanese}</span>
            </div>
            {!a.correct && (
              <div className="review-answers">
                <div className="your-answer">
                  <span className="answer-label">あなたの答え：</span>
                  <span>{a.userAnswer || '（未回答）'}</span>
                </div>
                <div className="correct-answer">
                  <span className="answer-label">正解：</span>
                  <span>{a.correctAnswer}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
