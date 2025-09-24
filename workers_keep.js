addEventListener('scheduled', event => {
  event.waitUntil(handleScheduled());
});

addEventListener('fetch', event => {
  event.respondWith(handleFetch());
});

const urlString = '保活地址1 保活地址2';
const urls = urlString.split(/[\s,，]+/);
const TIMEOUT = 5000;

// 全局状态（给定时任务用，也给网页访问用）
let lastRunTime = null;
let lastResult = { success: 0, fail: 0, details: [] };

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const res = await fetch(url, { signal: controller.signal });
    const ok = res.status === 200;
    return { url, status: res.status, ok };
  } catch (error) {
    return { url, status: "ERR", ok: false };
  } finally {
    clearTimeout(timeout);
  }
}

async function handleScheduled() {
  lastRunTime = new Date().toISOString();
  const results = await Promise.all(urls.map(fetchWithTimeout));
  let success = results.filter(r => r.ok).length;
  let fail = results.length - success;
  lastResult = { success, fail, details: results };
}

async function handleFetch() {
  // 每次访问自动执行一次检测
  await handleScheduled();

  const html = `
  <html>
    <head><title>Worker 保活状态</title></head>
    <body style="font-family: sans-serif; padding: 20px;">
      <h2>🌐 Worker 保活状态页</h2>
      <p>保活网址数量: <b>${urls.length}</b></p>
      <p>检测时间: <b>${lastRunTime}</b></p>
      <p>结果统计: ✅ ${lastResult.success} 成功, ❌ ${lastResult.fail} 失败</p>
      <hr>
      <p><b>网址状态:</b></p>
      <ul>
        ${lastResult.details.map(d =>
          `<li><a href="${d.url}" target="_blank">${d.url}</a> → ${d.ok ? "✅ 200 正常" : "❌ " + d.status}</li>`
        ).join('')}
      </ul>
    </body>
  </html>
  `;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}
