// routes/quizRewardEngine.js
import express from 'express';
const router = express.Router();

export const TARGET_PAYOUT_WALLET = "UQDlOTSlGL73BFgqkrYbBH2qZjPGtjhT0V41bv6ObdhpWgrG";
export const BASE_MAX_QUIZ_REWARD_USDT = 0.50; // Increased base reward pool

router.post('/api/quiz/verify-and-claim', async (req, res) => {
  const { userId, userAnswers, totalQuestions, userWallet } = req.body || {};

  if (!userAnswers || !totalQuestions || totalQuestions === 0) {
    return res.status(400).json({ success: false, message: "Invalid submission data." });
  }

  // Calculate percentage score
  const correctCount = userAnswers.filter(ans => ans.isCorrect === true).length;
  const scoreRatio = correctCount / totalQuestions;

  let rewardMultiplier = 0;
  if (scoreRatio === 1.0) {
    rewardMultiplier = 1.0;  // 100% Score -> $0.50 USDT
  } else if (scoreRatio >= 0.8) {
    rewardMultiplier = 0.8;  // 80%+ Score  -> $0.40 USDT
  } else if (scoreRatio >= 0.5) {
    rewardMultiplier = 0.5;  // 50%+ Score  -> $0.25 USDT
  } else {
    rewardMultiplier = 0.1;  // Participation Tier -> $0.05 USDT
  }

  const finalEarnedAmount = Number((BASE_MAX_QUIZ_REWARD_USDT * rewardMultiplier).toFixed(2));

  const rewardPayload = {
    txId: `quiz-reward-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    network: "TON",
    recipient: userWallet || TARGET_PAYOUT_WALLET,
    amount: finalEarnedAmount,
    currency: "USDT",
    scorePercentage: `${(scoreRatio * 100).toFixed(0)}%`,
    timestamp: new Date().toISOString()
  };

  // Determine port/host for server-side telemetry sync
  const baseUrl = `http://127.0.0.1:${process.env.PORT || 3000}`;

  // Dispatch yield telemetry to unified ledger
  await fetch(`${baseUrl}/api/intelligence/telemetry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: "TIERED_QUIZ_REWARD_CLAIM",
      ledgerData: rewardPayload,
      activeKey: "5dd2...ecb2"
    })
  }).catch(err => console.warn("Quiz telemetry sync warning:", err));

  return res.json({ 
    success: true, 
    score: `${correctCount}/${totalQuestions}`, 
    earnedUSDT: finalEarnedAmount, 
    reward: rewardPayload 
  });
});

export default router;
