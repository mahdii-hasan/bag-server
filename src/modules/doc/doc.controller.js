import { apiDocs } from "../../utils/apiDocs.js";

export const apiDocsController = (req, res) => {
  const getColor = (method) => {
    switch (method) {
      case "GET": return "#3b82f6";
      case "POST": return "#22c55e";
      case "PUT": return "#f59e0b";
      case "DELETE": return "#ef4444";
      default: return "#64748b";
    }
  };

  let idCounter = 0;

  const html = `
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${apiDocs.title} - API Docs</title>

    <style>
      * { box-sizing: border-box; }

      body {
        font-family: 'Segoe UI', sans-serif;
        background: #f9fafb;
        color: #334155;
        margin: 0;
        padding: 30px 20px;
      }

      .container {
        max-width: 900px;
        margin: auto;
      }

      h1 { color: #0f172a; }
      h2 {
        margin-top: 40px;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 6px;
      }

      .endpoint {
        background: #fff;
        border-radius: 10px;
        margin-bottom: 15px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        overflow: hidden;
      }

      .header {
        display: flex;
        align-items: center;
        padding: 14px 20px;
        cursor: pointer;
      }

      .header:hover {
        background: #f1f5f9;
      }

      .method {
        color: #fff;
        font-weight: bold;
        padding: 6px 12px;
        border-radius: 6px;
        margin-right: 10px;
        font-size: 0.85rem;
      }

      .path {
        font-family: monospace;
        font-weight: 600;
        flex-grow: 1;
        cursor: pointer;
        position: relative;
      }

      .path:hover {
        color: #2563eb;
      }

      .copied {
        position: absolute;
        right: 0;
        top: -18px;
        font-size: 0.75rem;
        color: #16a34a;
        display: none;
      }

      .payload-inline {
        padding: 10px 20px;
        background: #f3f4f6;
        border-top: 1px solid #e2e8f0;
      }

      .field {
        display: inline-block;
        background: #d1fae5;
        color: #065f46;
        padding: 3px 8px;
        border-radius: 999px;
        margin: 3px;
        font-size: 0.8rem;
      }

      .body {
        max-height: 0;
        overflow: hidden;
        transition: all 0.3s ease;
        padding: 0 20px;
      }

      .body.open {
        max-height: 1000px;
        padding: 15px 20px;
      }

      pre {
        background: #1e293b;
        color: #e0e7ff;
        padding: 12px;
        border-radius: 8px;
        overflow-x: auto;
        font-size: 0.85rem;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <h1>${apiDocs.title} (v${apiDocs.version})</h1>
      <p>Base URL: <code>${apiDocs.baseUrl}</code></p>

      ${apiDocs.routes.map(module => `
        <section>
          <h2>${module.module}</h2>

          ${module.endpoints.map(ep => {
            const id = idCounter++;

            // ✅ Normalize body (array OR object → array)
            const bodyFields = ep.body
              ? Array.isArray(ep.body)
                ? ep.body
                : Object.keys(ep.body)
              : null;

            const hasPayload =
              (ep.method === "POST" || ep.method === "PUT") && bodyFields;

            return `
              <article class="endpoint">

                <div class="header" onclick="toggle(${id})">
                  <div class="method" style="background:${getColor(ep.method)}">
                    ${ep.method}
                  </div>

                  <div class="path"
                       onclick="copyToClipboard(event, '${apiDocs.baseUrl}${ep.path}', ${id})">
                    ${ep.path}
                    <span class="copied" id="copied-${id}">Copied!</span>
                  </div>
                </div>

                ${hasPayload ? `
                  <div class="payload-inline">
                    <strong>Payload:</strong>
                    ${bodyFields.map(f => `<span class="field">${f}</span>`).join('')}
                  </div>
                ` : ''}

                <div class="body" id="details-${id}">
                  ${ep.body ? `
                    <strong>Request Body:</strong>
                    <pre>${JSON.stringify(ep.body, null, 2)}</pre>
                  ` : ''}

                  <strong>Response:</strong>
                  <pre>${JSON.stringify(ep.response, null, 2)}</pre>
                </div>

              </article>
            `;
          }).join('')}
        </section>
      `).join('')}
    </div>

    <script>
      function toggle(id) {
        const el = document.getElementById('details-' + id);
        el.classList.toggle('open');
      }

      function copyToClipboard(e, text, id) {
        e.stopPropagation(); // prevent toggle

        if (navigator.clipboard) {
          navigator.clipboard.writeText(text);
        } else {
          const temp = document.createElement("input");
          temp.value = text;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand("copy");
          document.body.removeChild(temp);
        }

        const el = document.getElementById('copied-' + id);
        el.style.display = 'inline';

        setTimeout(() => {
          el.style.display = 'none';
        }, 1200);
      }
    </script>
  </body>
  </html>
  `;

  res.send(html);
};