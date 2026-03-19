import { apiDocs } from "../../utils/apiDocs.js";

export const apiDocsController = (req, res) => {
  const getColor = (method) => {
    switch (method) {
      case "GET": return "#3b82f6";     // Blue
      case "POST": return "#22c55e";    // Green
      case "PUT": return "#f59e0b";     // Orange
      case "DELETE": return "#ef4444";  // Red
      default: return "#64748b";         // Gray
    }
  };

  let idCounter = 0;

  const html = `
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${apiDocs.title} - API Documentation</title>
    <style>
      /* Reset */
      * {
        box-sizing: border-box;
      }

      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #f9fafb;
        color: #334155;
        margin: 0;
        padding: 30px 20px;
        line-height: 1.6;
      }

      .container {
        max-width: 900px;
        margin: auto;
      }

      h1 {
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 5px;
      }

      h2 {
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 8px;
        margin-top: 40px;
        margin-bottom: 20px;
        color: #1e293b;
        font-weight: 600;
      }

      p.base-url {
        font-size: 0.9rem;
        color: #64748b;
        margin-bottom: 30px;
        font-style: italic;
      }

      .endpoint {
        background: #fff;
        box-shadow: 0 2px 8px rgb(100 116 139 / 0.15);
        border-radius: 10px;
        margin-bottom: 15px;
        overflow: hidden;
        transition: box-shadow 0.3s ease;
      }

      .endpoint:hover {
        box-shadow: 0 6px 16px rgb(100 116 139 / 0.3);
      }

      .header {
        display: flex;
        align-items: center;
        padding: 14px 20px;
        cursor: pointer;
        user-select: none;
      }

      .header:hover {
        background: #f1f5f9;
      }

      .method {
        color: white;
        font-weight: 700;
        padding: 7px 14px;
        border-radius: 6px;
        margin-right: 15px;
        min-width: 65px;
        text-align: center;
        font-size: 0.85rem;
        letter-spacing: 0.05em;
        box-shadow: 0 1px 3px rgb(0 0 0 / 0.15);
      }

      .path {
        font-family: 'Source Code Pro', monospace, monospace;
        font-weight: 600;
        font-size: 1rem;
        color: #334155;
        flex-grow: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .payload-inline {
        padding-left: 100px;
        padding-top: 8px;
        padding-bottom: 8px;
        background: #f3f4f6;
        font-size: 0.9rem;
        color: #1e293b;
        border-top: 1px solid #e2e8f0;
      }

      .payload-inline strong {
        margin-right: 8px;
        font-weight: 600;
      }

      .field {
        display: inline-block;
        background: #d1fae5;
        color: #065f46;
        font-weight: 600;
        padding: 3px 10px;
        border-radius: 9999px;
        margin: 0 6px 6px 0;
        font-size: 0.8rem;
        box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
      }

      .body {
        max-height: 0;
        overflow: hidden;
        background: #f9fafb;
        transition: max-height 0.4s ease, padding 0.3s ease;
        padding: 0 20px;
      }

      .body.open {
        max-height: 1000px; /* enough for content */
        padding: 16px 20px 20px 20px;
      }

      .body strong {
        display: block;
        margin-bottom: 8px;
        font-weight: 700;
        color: #334155;
      }

      pre {
        background: #1e293b;
        color: #e0e7ff;
        padding: 15px 20px;
        border-radius: 10px;
        font-family: 'Source Code Pro', monospace, monospace;
        font-size: 0.9rem;
        line-height: 1.4;
        overflow-x: auto;
        margin-top: 0;
      }

      /* Responsive */
      @media (max-width: 600px) {
        .header {
          flex-wrap: wrap;
          gap: 6px;
        }
        .payload-inline {
          padding-left: 20px;
        }
        .method {
          min-width: 50px;
          padding: 6px 10px;
        }
      }
    </style>
  </head>

  <body>
    <div class="container">
      <h1>${apiDocs.title} <small style="font-weight:400; font-size: 0.8rem; color:#64748b;">v${apiDocs.version}</small></h1>
      <p class="base-url">Base URL: <code>${apiDocs.baseUrl}</code></p>

      ${apiDocs.routes.map(module => `
        <section>
          <h2>${module.module}</h2>

          ${module.endpoints.map(ep => {
            const id = idCounter++;
            return `
              <article class="endpoint">

                <header class="header" onclick="toggle(${id})" role="button" tabindex="0" aria-expanded="false" aria-controls="details-${id}">
                  <div class="method" style="background: ${getColor(ep.method)};">${ep.method}</div>
                  <div class="path" title="${ep.path}">${ep.path}</div>
                </header>

                ${
                  (ep.method === "POST" || ep.method === "PUT") && ep.body
                    ? `<div class="payload-inline" aria-label="Request payload fields">
                        <strong>Payload:</strong>
                        ${ep.body.map(f => `<span class="field">${f}</span>`).join('')}
                       </div>`
                    : ''
                }

                <section class="body" id="details-${id}" aria-hidden="true">
                  ${ep.body ? `
                    <strong>Request Body:</strong>
                    <pre>${JSON.stringify(ep.body, null, 2)}</pre>
                  ` : ''}
                  <strong>Response:</strong>
                  <pre>${JSON.stringify(ep.response, null, 2)}</pre>
                </section>

              </article>
            `;
          }).join('')}
        </section>
      `).join('')}
    </div>

    <script>
      function toggle(id) {
        const details = document.getElementById('details-' + id);
        const isOpen = details.classList.toggle('open');
        const header = details.previousElementSibling;
        header.setAttribute('aria-expanded', isOpen);
        details.setAttribute('aria-hidden', !isOpen);
      }

      // Make headers keyboard accessible
      document.querySelectorAll('.header').forEach(header => {
        header.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            header.click();
          }
        });
      });
    </script>
  </body>
  </html>
  `;

  res.send(html);
};