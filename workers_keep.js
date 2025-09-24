addEventListener('scheduled', event => {
  event.waitUntil(handleScheduled());
});

addEventListener('fetch', event => {
  event.respondWith(handleFetch());
});

const urlString = '保活地址1 保活地址2';
const urls = urlString.split(/[\s,，]+/);
const TIMEOUT = 5000;

// 全局状态
let lastRunTime = null;
let lastResult = { success: 0, fail: 0 };

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    await fetch(url, { signal: controller.signal });
    console.log(`✅ 成功: ${url}`);
    return true;
  } catch (error) {
    console.warn(`❌ 访问失败: ${url}, 错误: ${error.message}`);
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

async function handleScheduled() {
  console.log('⏳ 任务开始');
  lastRunTime = new Date().toISOString();

  let success = 0, fail = 0;

  const results = await Promise.all(urls.map(fetchWithTimeout));
  for (const r of results) {
    if (r) success++; else fail++;
  }

  lastResult = { success, fail };

  console.log(`📊 任务结束 | 成功: ${success}, 失败: ${fail}`);
}

async function handleFetch() {
  const html = `
  <html>
    <head><title>OTC 保活状态</title></head>
    <body style="font-family: sans-serif; padding: 20px;">
      <h2>🌐 OTC 保活状态页</h2>
      <p>保活网址数量: <b>${urls.length}</b></p>
      <p>上次执行时间: <b>${lastRunTime ? lastRunTime : '尚未执行'}</b></p>
      <p>最近结果: ✅ ${lastResult.success} 成功, ❌ ${lastResult.fail} 失败</p>
      <hr>
      <p><b>网址列表:</b></p>
      <ul>
        ${urls.map(u => `<li>${u}</li>`).join('')}
      </ul>
    </body>
  </html>
  `;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}
