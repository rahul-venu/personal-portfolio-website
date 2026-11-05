/* ================= NEURAL PCB CIRCUIT CONSTELLATION (js/skills-circuit.js) =================
   - Renders 8 Domain Tabs and all 62 Skill Nodes across 8 PCB cluster zones.
   - Draws 45-degree angled SVG circuit traces, junction vias, and traveling pulse packets.
   - Caches node coordinates to prevent synchronous layout reflows during hover/activation.
   - Supports hover and lock selection with 8 distinct cyber-neon color palettes.
*/

import { rafThrottle } from './config.js';

export function initSkillsCircuit() {
  const tabsMount = document.getElementById('skills-domain-tabs');
  const nodesMount = document.getElementById('skills-nodes-mount');
  const svgLayer = document.getElementById('skills-circuit-svg');
  const board = document.getElementById('skills-circuit-board');

  if (!tabsMount || !nodesMount || !svgLayer || !board) return;

  // Complete domain definitions and skill cluster mapping
  const DOMAINS = [
    {
      id: 'agentic',
      num: '01',
      label: 'Agentic AI',
      color: '#a855f7', // Electric Cyber Violet
      glow: 'rgba(168, 85, 247, 0.55)',
      gridArea: 'lg:col-start-2 lg:col-end-4 lg:row-start-2 lg:row-end-3',
      skills: [
        { name: 'LangGraph', icon: 'git-commit', hub: true },
        { name: 'Tool Calling', icon: 'wrench', hub: true },
        { name: 'AI Agents', icon: 'bot', hub: true },
        { name: 'LangChain', icon: 'link' },
        { name: 'Google ADK', icon: 'cpu' },
        { name: 'Autonomous Workflows', icon: 'workflow' },
        { name: 'LLM Orchestration', icon: 'network' },
        { name: 'Context & Memory', icon: 'database' },
        { name: 'Multi-Step Reasoning', icon: 'brain' }
      ]
    },
    {
      id: 'nlp',
      num: '02',
      label: 'NLP & GenAI',
      color: '#00f0ff', // Neon Cyber Cyan
      glow: 'rgba(0, 240, 255, 0.55)',
      gridArea: 'lg:col-start-2 lg:col-end-4 lg:row-start-1 lg:row-end-2',
      skills: [
        { name: 'RAG', icon: 'layers', hub: true },
        { name: 'LLMs', icon: 'sparkles', hub: true },
        { name: 'Vector Embeddings', icon: 'boxes' },
        { name: 'Semantic Search', icon: 'search' },
        { name: 'Prompt Engineering', icon: 'message-square' },
        { name: 'HuggingFace', icon: 'smile' },
        { name: 'BERT', icon: 'binary' },
        { name: 'spaCy', icon: 'code-2' },
        { name: 'NLTK', icon: 'file-text' },
        { name: 'Regex', icon: 'terminal' }
      ]
    },
    {
      id: 'dl',
      num: '03',
      label: 'Deep Learning',
      color: '#6366f1', // Hyper Electric Indigo
      glow: 'rgba(99, 102, 241, 0.6)',
      gridArea: 'lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-2',
      skills: [
        { name: 'PyTorch', icon: 'flame', hub: true },
        { name: 'TensorFlow', icon: 'cpu' },
        { name: 'Transformers [HF]', icon: 'sparkles', hub: true },
        { name: 'Model Fine-Tuning', icon: 'sliders' },
        { name: 'LoRA / QLoRA', icon: 'zap' },
        { name: 'Quantization', icon: 'minimize-2' },
        { name: 'Neural Networks', icon: 'share-2' },
        { name: 'Attention Mechanisms', icon: 'eye' }
      ]
    },
    {
      id: 'ml',
      num: '04',
      label: 'Machine Learning',
      color: '#00ff9d', // Matrix Neon Emerald
      glow: 'rgba(0, 255, 157, 0.5)',
      gridArea: 'lg:col-start-4 lg:col-end-5 lg:row-start-1 lg:row-end-2',
      skills: [
        { name: 'Scikit-learn', icon: 'activity', hub: true },
        { name: 'XGBoost / LightGBM', icon: 'zap', hub: true },
        { name: 'Feature Engineering', icon: 'wand-2' },
        { name: 'Regression', icon: 'trending-up' },
        { name: 'Classification', icon: 'git-branch' },
        { name: 'Model Evaluation', icon: 'check-circle-2' },
        { name: 'Hyper Para. Tuning', icon: 'sliders-horizontal' },
        { name: 'Cross-Validation', icon: 'repeat' },
        { name: 'Supervised / Unsupervised', icon: 'layers' }
      ]
    },
    {
      id: 'prog',
      num: '05',
      label: 'Programming',
      color: '#38bdf8', // Laser Ice Cobalt
      glow: 'rgba(56, 189, 248, 0.55)',
      gridArea: 'lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-3',
      skills: [
        { name: 'Python', icon: 'terminal', hub: true },
        { name: 'Relational SQL', icon: 'database', hub: true },
        { name: 'HTML [Basic]', icon: 'code' },
        { name: 'CSS [Basic]', icon: 'palette' }
      ]
    },
    {
      id: 'data',
      num: '06',
      label: 'Data & Tools',
      color: '#ffb800', // Solar Cyber Amber
      glow: 'rgba(255, 184, 0, 0.55)',
      gridArea: 'lg:col-start-2 lg:col-end-4 lg:row-start-3 lg:row-end-4',
      skills: [
        { name: 'Pandas', icon: 'table', hub: true },
        { name: 'NumPy', icon: 'grid', hub: true },
        { name: 'PySpark', icon: 'flame' },
        { name: 'Jupyter', icon: 'book-open' },
        { name: 'Git | GitHub', icon: 'git-branch' },
        { name: 'VS Code | PyCharm', icon: 'monitor' }
      ]
    },
    {
      id: 'app',
      num: '07',
      label: 'App & Visuals',
      color: '#ff2a85', // Plasma Neon Pink
      glow: 'rgba(255, 42, 133, 0.55)',
      gridArea: 'lg:col-start-4 lg:col-end-5 lg:row-start-2 lg:row-end-3',
      skills: [
        { name: 'Streamlit', icon: 'layout', hub: true },
        { name: 'Gradio', icon: 'box' },
        { name: 'Plotly', icon: 'bar-chart-2', hub: true },
        { name: 'Interactive Dashboards', icon: 'pie-chart' },
        { name: 'Matplotlib', icon: 'line-chart' },
        { name: 'Seaborn', icon: 'activity' }
      ]
    },
    {
      id: 'mlops',
      num: '08',
      label: 'MLOps',
      color: '#00ffd5', // Ultraviolet Electric Teal
      glow: 'rgba(0, 255, 213, 0.55)',
      gridArea: 'lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4',
      skills: [
        { name: 'FastAPI', icon: 'zap', hub: true },
        { name: 'Docker', icon: 'box', hub: true },
        { name: 'MLflow', icon: 'activity' },
        { name: 'LangSmith', icon: 'eye' },
        { name: 'Azure Cloud', icon: 'cloud' },
        { name: 'ZenML', icon: 'layers' },
        { name: 'GitHub Actions', icon: 'play-circle' },
        { name: 'Model Versioning', icon: 'git-merge' }
      ]
    }
  ];

  // Scoped styling for circuit nodes, trace lines, and animated pulse packets
  const style = document.createElement('style');
  style.textContent = `
    #skills-circuit-board {
      --circuit-color: #a855f7;
      --circuit-glow: rgba(168, 85, 247, 0.55);
    }

    .sk-tab {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 9999px;
      background: #121214;
      border: 1px solid rgba(255, 255, 255, 0.08);
      font-family: var(--font-magnify), sans-serif;
      font-size: 12px;
      font-weight: 500;
      color: #71717a;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
      user-select: none;
    }

    .sk-tab .sk-tab-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10.5px;
      color: #52525b;
      transition: color 0.25s ease;
    }

    .sk-tab:hover,
    .sk-tab.is-active {
      color: #ffffff;
      background: #16161a;
      border-color: var(--tab-color, #ffffff);
      box-shadow: 0 0 14px -2px var(--tab-glow, rgba(255,255,255,0.25));
    }

    .sk-tab.is-active .sk-tab-num {
      color: var(--tab-color, #ffffff);
      font-weight: 700;
    }

    #skills-nodes-mount {
      display: grid;
      grid-template-columns: repeat(1, minmax(0, 1fr));
      gap: 12px;
    }

    @media (min-width: 1024px) {
      #skills-nodes-mount {
        grid-template-columns: 1.25fr 1fr 1fr 1.25fr;
        grid-template-rows: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 0.95fr);
        gap: 14px 22px;
        align-items: center;
        height: 100%;
        padding: 4px 2px;
      }
    }

    .sk-cluster {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 10px 12px;
      padding: 4px 6px;
      border-radius: 14px;
      transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .sk-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 9999px;
      background: #111114;
      border: 1px solid rgba(255, 255, 255, 0.08);
      font-family: var(--font-magnify), sans-serif;
      font-weight: 500;
      font-size: 11.5px;
      line-height: 1.2;
      color: rgba(161, 161, 170, 0.55);
      white-space: nowrap;
      cursor: pointer;
      transition:
        color 0.3s ease,
        background-color 0.3s ease,
        border-color 0.3s ease,
        box-shadow 0.3s ease,
        transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.3s ease;
    }

    .sk-pill svg {
      width: 11px;
      height: 11px;
      stroke-width: 2;
      opacity: 0.45;
      transition: opacity 0.3s ease, color 0.3s ease;
    }

    .sk-cluster.is-active .sk-pill {
      color: #ffffff;
      background: #16161d;
      border-color: var(--circuit-color);
      box-shadow:
        0 0 14px -3px var(--circuit-glow),
        inset 0 0 8px -4px var(--circuit-glow);
      opacity: 1;
    }

    .sk-cluster.is-active .sk-pill.is-hub {
      padding: 4px 10.5px;
      font-size: 11.5px;
      box-shadow:
        0 0 18px -2px var(--circuit-glow),
        inset 0 0 10px -3px var(--circuit-glow);
      transform: scale(1.03);
    }

    .sk-cluster.is-active .sk-pill svg {
      opacity: 1;
      color: var(--circuit-color);
    }

    .sk-pill:hover {
      color: #ffffff !important;
      border-color: var(--circuit-color) !important;
      transform: translateY(-1px) scale(1.04) !important;
    }

    .pcb-trace-bg {
      fill: none;
      stroke: rgba(255, 255, 255, 0.05);
      stroke-width: 1;
      stroke-linejoin: round;
    }

    .pcb-trace-active {
      fill: none;
      stroke: var(--circuit-color);
      stroke-width: 1.4;
      stroke-opacity: 0.65;
      filter: drop-shadow(0 0 5px var(--circuit-glow));
    }

    .pcb-pulse-packet {
      fill: none;
      stroke: #ffffff;
      stroke-width: 2.2;
      stroke-linecap: round;
      stroke-dasharray: 0.08 0.92;
      filter: drop-shadow(0 0 6px var(--circuit-color));
      animation: pcbPacketRun 2.2s linear infinite;
    }

    .pcb-node-dot {
      fill: #121214;
      stroke: rgba(255, 255, 255, 0.14);
      stroke-width: 1;
    }

    .pcb-node-dot.is-active {
      fill: var(--circuit-color);
      stroke: #ffffff;
      filter: drop-shadow(0 0 6px var(--circuit-color));
    }

    @keyframes pcbPacketRun {
      0%   { stroke-dashoffset: 1; }
      100% { stroke-dashoffset: 0; }
    }
  `;
  document.head.appendChild(style);

  // 1. Mount Domain Filter Tabs
  tabsMount.innerHTML = DOMAINS.map(
    (d, i) => `
      <button 
        type="button" 
        class="sk-tab ${i === 0 ? 'is-active' : ''}" 
        data-domain="${d.id}"
        style="--tab-color: ${d.color}; --tab-glow: ${d.glow};"
      >
        <span class="sk-tab-num">${d.num}</span>
        <span>${d.label}</span>
      </button>
    `
  ).join('');

  // 2. Mount Cluster Zones and Skill Pills
  const areaOverrides = {
    mlops:   'lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-2',
    nlp:     'lg:col-start-2 lg:col-end-4 lg:row-start-1 lg:row-end-2',
    data:    'lg:col-start-4 lg:col-end-5 lg:row-start-1 lg:row-end-2',
    prog:    'lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-3',
    agentic: 'lg:col-start-2 lg:col-end-4 lg:row-start-2 lg:row-end-3',
    app:     'lg:col-start-4 lg:col-end-5 lg:row-start-2 lg:row-end-3',
    dl:      'lg:col-start-1 lg:col-end-3 lg:row-start-3 lg:row-end-4',
    ml:      'lg:col-start-3 lg:col-end-5 lg:row-start-3 lg:row-end-4'
  };

  nodesMount.innerHTML = DOMAINS.map(
    (d, i) => `
      <div class="sk-cluster ${areaOverrides[d.id]} ${i === 0 ? 'is-active' : ''}" data-cluster="${d.id}">
        ${d.skills
          .map(
            (s) => `
            <div class="sk-pill ${s.hub ? 'is-hub' : ''}" data-domain="${d.id}">
              <i data-lucide="${s.icon.toLowerCase()}"></i>
              <span>${s.name}</span>
            </div>
          `
          )
          .join('')}
      </div>
    `
  ).join('');

  if (window.lucide) {
    window.lucide.createIcons({ root: nodesMount });
  }

  let activeDomainId = 'agentic';

  // 45-degree chamfered PCB routing geometry generator
  function createPcbPath(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);
    const diag = Math.min(adx, ady) * 0.65;
    const sx = dx >= 0 ? 1 : -1;
    const sy = dy >= 0 ? 1 : -1;

    const midX1 = x1 + (adx - diag) * 0.5 * sx;
    const midY1 = y1;
    const midX2 = midX1 + diag * sx;
    const midY2 = y1 + diag * sy;

    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${midX1.toFixed(1)} ${midY1.toFixed(1)} L ${midX2.toFixed(1)} ${midY2.toFixed(1)} L ${x2.toFixed(1)} ${midY2.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }

  // Pre-cached coordinates storage to eliminate synchronous layout reflows on hover
  let cachedBoardWidth = 0;
  let cachedBoardHeight = 0;
  let cachedPillPoints = {};
  let cachedClusterCenters = {};

  function measureNodeCoordinates() {
    if (window.innerWidth < 1024) return;
    const boardRect = board.getBoundingClientRect();
    if (!boardRect.width || !boardRect.height) return;

    cachedBoardWidth = boardRect.width;
    cachedBoardHeight = boardRect.height;
    cachedPillPoints = {};
    cachedClusterCenters = {};

    DOMAINS.forEach((d) => {
      const clusterEl = nodesMount.querySelector(`.sk-cluster[data-cluster="${d.id}"]`);
      if (!clusterEl) return;
      const pills = Array.from(clusterEl.querySelectorAll('.sk-pill'));
      if (!pills.length) return;

      const points = pills.map((p) => {
        const r = p.getBoundingClientRect();
        return {
          x: r.left - boardRect.left + r.width / 2,
          y: r.top - boardRect.top + r.height / 2
        };
      });

      cachedPillPoints[d.id] = points;
      cachedClusterCenters[d.id] = points[0];
    });
  }

  // Renders circuit paths directly from cached points
  function renderCircuitLines() {
    if (window.innerWidth < 1024) return;
    if (!cachedBoardWidth || !cachedBoardHeight) {
      measureNodeCoordinates();
    }
    if (!cachedBoardWidth || !cachedBoardHeight) return;

    svgLayer.setAttribute('viewBox', `0 0 ${cachedBoardWidth} ${cachedBoardHeight}`);

    let bgPaths = '';
    let activePaths = '';
    let dots = '';

    // Intracluster PCB traces
    DOMAINS.forEach((d) => {
      const points = cachedPillPoints[d.id];
      if (!points || !points.length) return;

      for (let i = 1; i < points.length; i++) {
        const pt = points[i];
        const prev = points[Math.floor((i - 1) / 2)];
        const dPath = createPcbPath(prev.x, prev.y, pt.x, pt.y);

        if (d.id === activeDomainId) {
          activePaths += `
            <path class="pcb-trace-active" d="${dPath}" />
            <path class="pcb-pulse-packet" pathLength="1" style="animation-delay: -${(i * 0.28).toFixed(2)}s" d="${dPath}" />
          `;
          dots += `<circle class="pcb-node-dot is-active" cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="2.2" />`;
        } else {
          bgPaths += `<path class="pcb-trace-bg" d="${dPath}" />`;
          dots += `<circle class="pcb-node-dot" cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="1.6" />`;
        }
      }
    });

    // Cross-cluster bridge lines from active domain hub to neighbors
    const activeCenter = cachedClusterCenters[activeDomainId];
    if (activeCenter) {
      Object.keys(cachedClusterCenters).forEach((otherId, idx) => {
        if (otherId === activeDomainId) return;
        const target = cachedClusterCenters[otherId];
        const bridgePath = createPcbPath(activeCenter.x, activeCenter.y, target.x, target.y);
        bgPaths += `<path class="pcb-trace-bg" d="${bridgePath}" />`;

        if (idx % 2 === 0) {
          activePaths += `
            <path class="pcb-trace-active" style="stroke-opacity: 0.32;" d="${bridgePath}" />
            <path class="pcb-pulse-packet" pathLength="1" style="animation-duration: 3.1s; animation-delay: -${(idx * 0.4).toFixed(2)}s" d="${bridgePath}" />
          `;
        }
      });
    }

    svgLayer.innerHTML = bgPaths + activePaths + dots;
  }

  // Switches active domain colors and updates circuit rendering
  function activateDomain(domainId) {
    if (activeDomainId === domainId && tabsMount.querySelector('.sk-tab.is-active')) return;
    const domain = DOMAINS.find((d) => d.id === domainId);
    if (!domain) return;
    activeDomainId = domainId;

    board.style.setProperty('--circuit-color', domain.color);
    board.style.setProperty('--circuit-glow', domain.glow);

    tabsMount.querySelectorAll('.sk-tab').forEach((tab) => {
      tab.classList.toggle('is-active', tab.dataset.domain === domainId);
    });

    nodesMount.querySelectorAll('.sk-cluster').forEach((cluster) => {
      cluster.classList.toggle('is-active', cluster.dataset.cluster === domainId);
    });

    renderCircuitLines();
  }

  // Domain tab triggers
  tabsMount.querySelectorAll('.sk-tab').forEach((tab) => {
    const id = tab.dataset.domain;
    tab.addEventListener('mouseenter', () => activateDomain(id));
    tab.addEventListener('click', () => activateDomain(id));
  });

  // Direct pill triggers
  nodesMount.querySelectorAll('.sk-pill').forEach((pill) => {
    const id = pill.dataset.domain;
    pill.addEventListener('mouseenter', () => {
      if (activeDomainId !== id) activateDomain(id);
    });
    pill.addEventListener('click', () => activateDomain(id));
  });

  // Throttled recalculation on layout resize
  const handleBoardResize = rafThrottle(() => {
    measureNodeCoordinates();
    renderCircuitLines();
  });

  setTimeout(() => {
    measureNodeCoordinates();
    renderCircuitLines();
  }, 120);

  window.addEventListener('resize', handleBoardResize, { passive: true });
  if ('ResizeObserver' in window) {
    new ResizeObserver(handleBoardResize).observe(board);
  }
}