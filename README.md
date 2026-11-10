# 運彩模擬實驗（純模擬記錄，未下注）

GitHub Pages 頁面內容以 AES-GCM 加密，需輸入密碼才能看。

更新方式（由排程執行）：
1. 把實驗資料匯出成 /tmp/data.json（格式：`{"lastRun": "...", "tickets": [exp...], "tickets2": [exp2...], "tickets3": [exp3...], "tickets4": [exp4...]}`，明文只放 /tmp，不要放進 repo）。
2. `SITE_PASSWORD=<密碼> node build.mjs /tmp/data.json` 產生加密的 index.html。
3. commit index.html 並 push 到 main。

密碼不寫進 repo 任何檔案。

## 建議新增：逐場紀錄 `matches`（排程端要存，網頁之後才能算校準指標）

目前資料只有「被選進串關的那一關」，沒有各來源對每場比賽的預測，所以算不出 Brier score / log loss。
建議排程在 data.json 另外存一份（可選欄位，沒有也不影響現有頁面）：

```json
"matches": [{
  "id": "2026-11-11|兵工廠 vs 赫爾城|不讓分",
  "league": "epl", "start": "2026-11-11T23:00:00+08:00", "market": "不讓分(90分鐘)",
  "predictedAt": "2026-11-11T06:51:00+08:00",
  "signals": { "A": 0.62, "B": 0.55, "C": "主勝", "D": 0.66, "E": null },
  "claude": 0.64,
  "outcome": "home"
}]
```

- `predictedAt` 必須是賽前時間，且寫入後不可改（防止看到賽果後回填）。
- `outcome` 賽後才補，其餘欄位寫入後不改。
- 累積 200 場以上再依 Brier score / log loss 調整權重；樣本少時用等權重或偏重 D 國外盤口。
