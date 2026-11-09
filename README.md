# 運彩模擬實驗（純模擬記錄，未下注）

GitHub Pages 頁面內容以 AES-GCM 加密，需輸入密碼才能看。

更新方式（由排程執行）：
1. 把實驗資料匯出成 /tmp/data.json（格式：`{"lastRun": "...", "tickets": [exp...], "tickets2": [exp2...], "tickets3": [exp3...]}`，明文只放 /tmp，不要放進 repo）。
2. `SITE_PASSWORD=<密碼> node build.mjs /tmp/data.json` 產生加密的 index.html。
3. commit index.html 並 push 到 main。

密碼不寫進 repo 任何檔案。
