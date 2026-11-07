// 用法：SITE_PASSWORD=xxx node build.mjs <data.json>
// data.json = { "updated": "...", "lastRun": "...", "tickets": [exp 文件...] }
// 產生 index.html（內容以 AES-GCM 加密，密碼只在執行時由環境變數提供，不寫進 repo）
import { readFileSync, writeFileSync } from 'node:fs';
import { webcrypto as crypto } from 'node:crypto';

const pw = process.env.SITE_PASSWORD;
if (!pw) { console.error('缺少 SITE_PASSWORD'); process.exit(1); }
const src = process.argv[2];
if (!src) { console.error('用法: node build.mjs <data.json>'); process.exit(1); }
const plain = readFileSync(src, 'utf8');
JSON.parse(plain); // 確認是合法 JSON

const enc = new TextEncoder();
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const ITER = 250000;
const base = await crypto.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveKey']);
const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plain)));
const b64 = u => Buffer.from(u).toString('base64');
const payload = JSON.stringify({ s: b64(salt), i: b64(iv), n: ITER, c: b64(ct) });

const tpl = readFileSync(new URL('./template.html', import.meta.url), 'utf8');
writeFileSync(new URL('./index.html', import.meta.url), tpl.replace('__PAYLOAD__', payload));
console.log('index.html 已產生');
