import React, { useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector, useDispatch } from 'react-redux'
import { useChat } from '../hooks/useChat'
import remarkGfm from 'remark-gfm'
import { useAuth } from '../../auth/hook/useAuth'
import { setChats, setCurrentChatId } from '../chat.slice'

// ─── Theme Context ────────────────────────────────────────────────────────────
const ThemeContext = React.createContext()

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('perplexity-theme') || 'dark')
  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('perplexity-theme', next)
      return next
    })
  }
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div data-theme={theme} className={theme === 'dark' ? 'theme-dark' : 'theme-light'} style={{ height: '100%' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

const useTheme = () => React.useContext(ThemeContext)

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const IconSun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)
const IconMoon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)
const IconSend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)
const IconChat = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)
const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)
const IconSparkle = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
  </svg>
)
const IconStop = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <rect x="4" y="4" width="16" height="16" rx="2" />
  </svg>
)
const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
)
const IconLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)
const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
const IconChevronUp = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
)

// ─── Global CSS ───────────────────────────────────────────────────────────────
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --font-main: 'Sora', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --radius-sm: 10px;
    --radius-md: 16px;
    --radius-lg: 24px;
    --radius-xl: 32px;
    --transition: 0.2s ease;
  }

  .theme-dark {
    --bg-root: #080c14;
    --bg-sidebar: #0a0f1a;
    --bg-main: #080c14;
    --bg-input: #0f1420;
    --bg-message-user: rgba(99,179,237,0.12);
    --bg-message-ai: transparent;
    --bg-hover: rgba(255,255,255,0.05);
    --bg-active: rgba(99,179,237,0.1);
    --bg-btn-primary: #1a73e8;
    --bg-btn-primary-hover: #1557c0;
    --bg-code: rgba(0,0,0,0.4);
    --border-color: rgba(255,255,255,0.07);
    --border-input: rgba(255,255,255,0.12);
    --border-focus: rgba(99,179,237,0.5);
    --text-primary: #f0f4ff;
    --text-secondary: rgba(240,244,255,0.55);
    --text-muted: rgba(240,244,255,0.3);
    --text-accent: #63b3ed;
    --accent: #63b3ed;
    --accent-glow: rgba(99,179,237,0.15);
    --scrollbar: rgba(255,255,255,0.08);
    --logo-gradient: linear-gradient(135deg, #63b3ed 0%, #a78bfa 50%, #f472b6 100%);
    --shadow-sm: 0 2px 8px rgba(0,0,0,0.3);
    --shadow-md: 0 4px 24px rgba(0,0,0,0.4);
    --bg-gradient-1: radial-gradient(ellipse 80% 50% at 20% 10%, rgba(99,179,237,0.07) 0%, transparent 60%);
    --bg-gradient-2: radial-gradient(ellipse 60% 40% at 80% 80%, rgba(167,139,250,0.07) 0%, transparent 60%);
    --bg-gradient-3: radial-gradient(ellipse 50% 30% at 50% 50%, rgba(244,114,182,0.04) 0%, transparent 70%);
    --user-avatar-bg: linear-gradient(135deg, #1a73e8, #a78bfa);
    --danger: rgba(239,68,68,0.8);
    --danger-hover: rgba(239,68,68,1);
    --danger-bg: rgba(239,68,68,0.1);
  }

  .theme-light {
    --bg-root: #f0f4ff;
    --bg-sidebar: #ffffff;
    --bg-main: #f0f4ff;
    --bg-input: #ffffff;
    --bg-message-user: rgba(26,115,232,0.08);
    --bg-message-ai: transparent;
    --bg-hover: rgba(0,0,0,0.04);
    --bg-active: rgba(26,115,232,0.08);
    --bg-btn-primary: #1a73e8;
    --bg-btn-primary-hover: #1557c0;
    --bg-code: rgba(0,0,0,0.06);
    --border-color: rgba(0,0,0,0.08);
    --border-input: rgba(0,0,0,0.14);
    --border-focus: rgba(26,115,232,0.4);
    --text-primary: #111827;
    --text-secondary: rgba(17,24,39,0.6);
    --text-muted: rgba(17,24,39,0.38);
    --text-accent: #1a73e8;
    --accent: #1a73e8;
    --accent-glow: rgba(26,115,232,0.1);
    --scrollbar: rgba(0,0,0,0.1);
    --logo-gradient: linear-gradient(135deg, #1a73e8 0%, #7c3aed 50%, #db2777 100%);
    --shadow-sm: 0 2px 8px rgba(0,0,0,0.08);
    --shadow-md: 0 4px 24px rgba(0,0,0,0.12);
    --bg-gradient-1: radial-gradient(ellipse 80% 50% at 20% 10%, rgba(26,115,232,0.06) 0%, transparent 60%);
    --bg-gradient-2: radial-gradient(ellipse 60% 40% at 80% 80%, rgba(124,58,237,0.05) 0%, transparent 60%);
    --bg-gradient-3: radial-gradient(ellipse 50% 30% at 50% 50%, rgba(219,39,119,0.04) 0%, transparent 70%);
    --user-avatar-bg: linear-gradient(135deg, #1a73e8, #7c3aed);
    --danger: rgba(220,38,38,0.8);
    --danger-hover: rgba(220,38,38,1);
    --danger-bg: rgba(220,38,38,0.08);
  }

  html, body, #root { height: 100%; font-family: var(--font-main); }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--scrollbar); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--accent); }

  .plex-root {
    display: flex;
    height: 100vh;
    background: var(--bg-root);
    overflow: hidden;
    transition: background var(--transition);
    position: relative;
  }

  /* ── Animated background gradients ── */
  .plex-root::before,
  .plex-root::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }
  .plex-root::before {
    background: var(--bg-gradient-1), var(--bg-gradient-2);
  }
  .plex-root::after {
    background: var(--bg-gradient-3);
  }

  .sidebar, .main { position: relative; z-index: 1; }

  /* ── Sidebar ── */
  .sidebar {
    width: 260px;
    min-width: 260px;
    height: 100vh;
    background: var(--bg-sidebar);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease, background var(--transition);
    z-index: 100;
    flex-shrink: 0;
  }

  .sidebar-mobile-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 99;
  }

  @media (max-width: 768px) {
    .sidebar {
      position: fixed;
      left: 0; top: 0; bottom: 0;
      transform: translateX(-100%);
    }
    .sidebar.open { transform: translateX(0); }
    .sidebar-mobile-overlay.open { display: block; }
  }

  .sidebar-header {
    padding: 20px 16px 12px;
    border-bottom: 1px solid var(--border-color);
  }

  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }

  .sidebar-logo-icon {
    width: 28px;
    height: 28px;
    background: var(--logo-gradient);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }

  .sidebar-logo-text {
    font-size: 17px;
    font-weight: 700;
    background: var(--logo-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.3px;
  }

  .btn-new-chat {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background: var(--bg-hover);
    color: var(--text-primary);
    font-family: var(--font-main);
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition);
    text-align: left;
  }

  .btn-new-chat:hover {
    background: var(--accent-glow);
    border-color: var(--accent);
    color: var(--accent);
  }

  .btn-new-chat .btn-new-chat-icon {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    background: var(--accent);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform var(--transition);
  }

  .btn-new-chat:hover .btn-new-chat-icon { transform: rotate(90deg); }

  /* ── Chat history ── */
  .sidebar-section-title {
    padding: 16px 16px 8px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .chat-history {
    flex: 1;
    overflow-y: auto;
    padding: 0 8px;
  }

  /* Chat item with delete button */
  .chat-history-item-wrap {
    position: relative;
    display: flex;
    align-items: center;
    border-radius: var(--radius-sm);
    transition: background var(--transition);
  }

  .chat-history-item-wrap:hover { background: var(--bg-hover); }
  .chat-history-item-wrap:hover .btn-delete-chat { opacity: 1; }

  .chat-history-item {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    padding: 9px 10px;
    border: none;
    background: transparent;
    color: var(--text-secondary);
    font-family: var(--font-main);
    font-size: 13px;
    font-weight: 400;
    cursor: pointer;
    transition: color var(--transition);
    text-align: left;
    min-width: 0;
    border-radius: var(--radius-sm);
  }

  .chat-history-item .icon { flex-shrink: 0; opacity: 0.5; }
  .chat-history-item span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .chat-history-item-wrap:hover .chat-history-item { color: var(--text-primary); }
  .chat-history-item-wrap:hover .chat-history-item .icon { opacity: 1; }

  .chat-history-item-wrap.active .chat-history-item {
    color: var(--text-accent);
    font-weight: 500;
  }

  .chat-history-item-wrap.active .chat-history-item .icon { opacity: 1; color: var(--accent); }
  .chat-history-item-wrap.active { background: var(--bg-active); }

  /* Delete button */
  .btn-delete-chat {
    flex-shrink: 0;
    width: 26px;
    height: 26px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: all var(--transition);
    margin-right: 6px;
  }

  .btn-delete-chat:hover {
    background: var(--danger-bg);
    color: var(--danger-hover);
  }

  /* ── Sidebar Footer ── */
  .sidebar-footer {
    padding: 12px 16px;
    border-top: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  /* ── User section in sidebar ── */
  .user-section {
    position: relative;
  }

  .user-card {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 12px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background: transparent;
    cursor: pointer;
    transition: all var(--transition);
    text-align: left;
  }

  .user-card:hover {
    background: var(--bg-hover);
    border-color: var(--accent);
  }

  .user-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: var(--user-avatar-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: 600;
    flex-shrink: 0;
    font-family: var(--font-main);
  }

  .user-info { flex: 1; min-width: 0; }

  .user-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-email {
    font-size: 11px;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-chevron {
    color: var(--text-muted);
    transition: transform var(--transition);
    flex-shrink: 0;
  }

  .user-section.open .user-chevron { transform: rotate(180deg); }

  /* User dropdown */
  .user-dropdown {
    position: absolute;
    bottom: calc(100% + 6px);
    left: 0;
    right: 0;
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    overflow: hidden;
    animation: slideUp 0.15s ease;
    z-index: 200;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .user-dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 14px;
    border: none;
    background: transparent;
    color: var(--text-secondary);
    font-family: var(--font-main);
    font-size: 13px;
    cursor: pointer;
    transition: all var(--transition);
    text-align: left;
  }

  .user-dropdown-item:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  .user-dropdown-item.danger { color: var(--danger); }
  .user-dropdown-item.danger:hover { background: var(--danger-bg); color: var(--danger-hover); }

  .user-dropdown-divider {
    height: 1px;
    background: var(--border-color);
    margin: 4px 0;
  }

  /* ── Theme toggle ── */
  .theme-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 10px 14px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background: transparent;
    color: var(--text-secondary);
    font-family: var(--font-main);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition);
  }

  .theme-toggle:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
    border-color: var(--text-secondary);
  }

  .theme-toggle-track {
    margin-left: auto;
    width: 36px;
    height: 20px;
    border-radius: 10px;
    background: var(--accent);
    position: relative;
    transition: background var(--transition);
    flex-shrink: 0;
  }

  .theme-light .theme-toggle-track { background: #e2e8f0; }

  .theme-toggle-thumb {
    position: absolute;
    top: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    transition: transform 0.2s ease;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }

  .theme-dark .theme-toggle-thumb { transform: translateX(18px); }
  .theme-light .theme-toggle-thumb { transform: translateX(2px); }

  /* ── Main area ── */
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    background: transparent;
    transition: background var(--transition);
    position: relative;
  }

  /* ── Topbar (mobile) ── */
  .topbar {
    display: none;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-sidebar);
  }

  @media (max-width: 768px) {
    .topbar { display: flex; }
  }

  .topbar-logo {
    font-size: 16px;
    font-weight: 700;
    background: var(--logo-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .icon-btn {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-color);
    background: transparent;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition);
  }

  .icon-btn:hover { background: var(--bg-hover); color: var(--text-primary); }

  /* ── Messages ── */
  .messages-area {
    flex: 1;
    overflow-y: auto;
    padding: 0 0 120px;
  }

  .messages-inner {
    max-width: 720px;
    margin: 0 auto;
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .message-row {
    display: flex;
    flex-direction: column;
    animation: fadeUp 0.3s ease forwards;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .message-bubble {
    padding: 12px 16px;
    border-radius: var(--radius-md);
    font-size: 14.5px;
    line-height: 1.65;
    color: var(--text-primary);
  }

  .message-bubble.user {
    background: var(--bg-message-user);
    border: 1px solid rgba(99,179,237,0.15);
    align-self: flex-end;
    max-width: 80%;
    border-bottom-right-radius: 4px;
  }

  .theme-light .message-bubble.user { border-color: rgba(26,115,232,0.15); }

  .message-bubble.ai {
    background: var(--bg-message-ai);
    align-self: flex-start;
    width: 100%;
    padding: 16px 0;
  }

  .ai-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-accent);
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .ai-label-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  .markdown-body p { margin-bottom: 10px; }
  .markdown-body p:last-child { margin-bottom: 0; }
  .markdown-body ul, .markdown-body ol { margin-bottom: 10px; padding-left: 20px; }
  .markdown-body li { margin-bottom: 4px; }
  .markdown-body code {
    font-family: var(--font-mono);
    font-size: 12.5px;
    background: var(--bg-code);
    padding: 2px 6px;
    border-radius: 5px;
  }
  .markdown-body pre {
    background: var(--bg-code);
    border-radius: var(--radius-sm);
    padding: 14px;
    margin-bottom: 12px;
    overflow-x: auto;
    border: 1px solid var(--border-color);
  }
  .markdown-body pre code { background: none; padding: 0; }
  .markdown-body h1, .markdown-body h2, .markdown-body h3 {
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--text-primary);
  }
  .markdown-body a { color: var(--accent); }
  .markdown-body blockquote {
    border-left: 3px solid var(--accent);
    padding-left: 12px;
    color: var(--text-secondary);
    margin: 10px 0;
  }
  .markdown-body table { border-collapse: collapse; width: 100%; margin-bottom: 10px; }
  .markdown-body th, .markdown-body td {
    border: 1px solid var(--border-color);
    padding: 8px 12px;
    text-align: left;
    font-size: 13.5px;
  }
  .markdown-body th { background: var(--bg-hover); font-weight: 600; }

  /* ── Typing indicator ── */
  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 12px 0;
  }

  .typing-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
    animation: typing 1.2s ease infinite;
  }

  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes typing {
    0%, 100% { opacity: 0.3; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.1); }
  }

  /* ── Home screen ── */
  .home-screen {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    text-align: center;
    animation: fadeUp 0.5s ease;
  }

  .home-logo-wrap {
    position: relative;
    margin-bottom: 24px;
  }

  .home-logo-bg {
    width: 72px;
    height: 72px;
    border-radius: 22px;
    background: var(--logo-gradient);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 8px 32px var(--accent-glow);
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  .home-title {
    font-size: clamp(32px, 6vw, 52px);
    font-weight: 700;
    background: var(--logo-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -1px;
    line-height: 1.1;
    margin-bottom: 12px;
  }

  .home-subtitle {
    font-size: 15px;
    color: var(--text-secondary);
    margin-bottom: 36px;
    max-width: 420px;
  }

  .home-suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    max-width: 600px;
  }

  .suggestion-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 9px 16px;
    border-radius: 999px;
    border: 1px solid var(--border-color);
    background: var(--bg-input);
    color: var(--text-secondary);
    font-family: var(--font-main);
    font-size: 13px;
    cursor: pointer;
    transition: all var(--transition);
    white-space: nowrap;
  }

  .suggestion-chip:hover {
    background: var(--accent-glow);
    border-color: var(--accent);
    color: var(--accent);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }

  /* ── Input area ── */
  .input-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px 20px 20px;
    background: linear-gradient(to top, var(--bg-main) 75%, transparent);
  }

  .input-container {
    max-width: 720px;
    margin: 0 auto;
    background: var(--bg-input);
    border: 1.5px solid var(--border-input);
    border-radius: var(--radius-xl);
    padding: 14px 16px;
    box-shadow: var(--shadow-md);
    transition: border-color var(--transition), box-shadow var(--transition);
  }

  .input-container:focus-within {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 4px var(--accent-glow), var(--shadow-md);
  }

  .input-textarea {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    color: var(--text-primary);
    font-family: var(--font-main);
    font-size: 15px;
    line-height: 1.5;
    resize: none;
    min-height: 24px;
    max-height: 160px;
    overflow-y: auto;
  }

  .input-textarea::placeholder { color: var(--text-muted); }

  .input-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
  }

  .input-hint {
    font-size: 11.5px;
    color: var(--text-muted);
  }

  .btn-send {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    border: none;
    background: var(--bg-btn-primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition);
    flex-shrink: 0;
  }

  .btn-send:hover:not(:disabled) {
    background: var(--bg-btn-primary-hover);
    transform: scale(1.05);
  }

  .btn-send:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    transform: none;
  }

  .btn-stop { background: #ef4444; }
  .btn-stop:hover:not(:disabled) { background: #dc2626; }

  .input-footer-note {
    text-align: center;
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 10px;
    max-width: 720px;
    margin-left: auto;
    margin-right: auto;
  }

  /* ── Empty history ── */
  .empty-history {
    padding: 20px 16px;
    text-align: center;
    color: var(--text-muted);
    font-size: 12.5px;
    line-height: 1.6;
  }

  .messages-area::-webkit-scrollbar { width: 3px; }

  /* ── Delete confirm toast ── */
  .delete-confirm {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: var(--shadow-md);
    z-index: 9999;
    animation: fadeUp 0.2s ease;
    white-space: nowrap;
  }

  .delete-confirm-text { font-size: 13px; color: var(--text-primary); }

  .delete-confirm-btn {
    padding: 6px 14px;
    border-radius: 8px;
    border: none;
    font-family: var(--font-main);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition);
  }

  .delete-confirm-btn.cancel {
    background: var(--bg-hover);
    color: var(--text-secondary);
  }
  .delete-confirm-btn.cancel:hover { background: var(--border-color); color: var(--text-primary); }

  .delete-confirm-btn.confirm {
    background: var(--danger-bg);
    color: var(--danger-hover);
    border: 1px solid var(--danger);
  }
  .delete-confirm-btn.confirm:hover { background: var(--danger); color: white; }
`

// ─── Suggestion chips data ─────────────────────────────────────────────────
const SUGGESTIONS = [
  { icon: '🔭', text: 'Explain quantum entanglement' },
  { icon: '💻', text: 'Debug my JavaScript code' },
  { icon: '✍️', text: 'Write a cover letter' },
  { icon: '📊', text: 'Analyze market trends' },
  { icon: '🌍', text: 'Plan a trip to Japan' },
  { icon: '🧬', text: 'How does CRISPR work?' },
]

// ─── Dashboard ────────────────────────────────────────────────────────────────
const DashboardInner = () => {
  const chat = useChat()
  const auth = useAuth()
  const dispatch = useDispatch()
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null) // chatId to delete
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const user = useSelector((state) => state.auth.user)
  const { theme, toggleTheme } = useTheme()
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const userMenuRef = useRef(null)

  const currentMessages = chats[currentChatId]?.messages || []
  const hasMessages = currentMessages.length > 0

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages, isTyping])

  const autoResize = (e) => {
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
  }

  const handleSubmitMessage = async (e) => {
    e?.preventDefault()
    const trimmed = chatInput.trim()
    if (!trimmed || isTyping) return
    setChatInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setIsTyping(true)
    try {
      await chat.handleSendMessage({ message: trimmed, chatId: currentChatId })
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmitMessage()
    }
  }

  const handleSuggestion = (text) => {
    setChatInput(text)
    textareaRef.current?.focus()
  }

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats)
    setSidebarOpen(false)
  }

  const startNewChat = () => {
    window.location.reload()
  }

  // ── Delete chat ──
  const handleDeleteRequest = (e, chatId) => {
    e.stopPropagation()
    setDeleteConfirm(chatId)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return
    const data = await chat.handleDeleteChat(deleteConfirm, chats, currentChatId)
    if (data) {
      setDeleteConfirm(null)
    }
  }

  // ── Logout ──
  const handleLogout = async () => {
    await auth.handleLogout()
    localStorage.removeItem('token')
    dispatch(setChats({}))
    dispatch(setCurrentChatId(null))
    window.location.href = '/login'
  }

  const handleGoToLogin = () => {
    window.location.href = '/login'
  }

  const handleGoToRegister = () => {
    window.location.href = '/register'
  }

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const chatList = Object.values(chats)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalStyle }} />

      <div className="plex-root">
        {/* Mobile overlay */}
        <div
          className={`sidebar-mobile-overlay ${sidebarOpen ? 'open' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* ── Sidebar ─────────────────────────────────────────── */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <div className="sidebar-logo-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
                </svg>
              </div>
              <span className="sidebar-logo-text">Perplexity</span>
            </div>

            <button className="btn-new-chat" onClick={startNewChat}>
              <span className="btn-new-chat-icon"><IconPlus /></span>
              New Chat
            </button>
          </div>

          {chatList.length > 0 && (
            <p className="sidebar-section-title">Recent</p>
          )}

          <div className="chat-history">
            {chatList.length === 0 ? (
              <div className="empty-history">
                No chats yet.<br />Start a conversation below.
              </div>
            ) : (
              chatList.map((c, i) => (
                <div
                  key={c.id || i}
                  className={`chat-history-item-wrap ${currentChatId === c.id ? 'active' : ''}`}
                >
                  <button
                    onClick={() => openChat(c.id)}
                    className="chat-history-item"
                  >
                    <span className="icon"><IconChat /></span>
                    <span>{c.title || 'Untitled Chat'}</span>
                  </button>
                  <button
                    className="btn-delete-chat"
                    onClick={(e) => handleDeleteRequest(e, c.id)}
                    title="Delete chat"
                  >
                    <IconTrash />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* ── Sidebar Footer: user + theme ── */}
          <div className="sidebar-footer">
            {/* User section */}
            <div className="user-section" ref={userMenuRef}>
              {userMenuOpen && (
                <div className="user-dropdown">
                  {!user ? (
                    <>
                      <button className="user-dropdown-item" onClick={handleGoToLogin}>
                        <IconUser /> Sign in
                      </button>
                      <button className="user-dropdown-item" onClick={handleGoToRegister}>
                        <IconPlus /> Create account
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="user-dropdown-item" onClick={handleGoToLogin}>
                        <IconUser /> Profile
                      </button>
                      <div className="user-dropdown-divider" />
                      <button className="user-dropdown-item danger" onClick={handleLogout}>
                        <IconLogout /> Log out
                      </button>
                    </>
                  )}
                </div>
              )}

              <button
                className="user-card"
                onClick={() => setUserMenuOpen(prev => !prev)}
              >
                <div className="user-avatar">
                  {user ? getInitials(user.username || user.email) : <IconUser />}
                </div>
                <div className="user-info">
                  <div className="user-name">
                    {user ? (user.username || 'User') : 'Guest'}
                  </div>
                  <div className="user-email">
                    {user ? user.email : 'Sign in to save chats'}
                  </div>
                </div>
                <span className={`user-chevron ${userMenuOpen ? 'open' : ''}`}>
                  <IconChevronUp />
                </span>
              </button>
            </div>

            {/* Theme toggle */}
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'dark' ? <IconMoon /> : <IconSun />}
              <span>{theme === 'dark' ? 'Dark mode' : 'Light mode'}</span>
              <div className="theme-toggle-track">
                <div className="theme-toggle-thumb" />
              </div>
            </button>
          </div>
        </aside>

        {/* ── Main ─────────────────────────────────────────────── */}
        <main className="main">
          {/* Mobile topbar */}
          <div className="topbar">
            <button className="icon-btn" onClick={() => setSidebarOpen(true)}>
              <IconMenu />
            </button>
            <span className="topbar-logo">Perplexity</span>
            <button className="icon-btn" onClick={startNewChat}>
              <IconPlus />
            </button>
          </div>

          {/* Messages or Home screen */}
          {!hasMessages && !isTyping ? (
            <div className="home-screen">
              <div className="home-logo-wrap">
                <div className="home-logo-bg">
                  <IconSparkle />
                </div>
              </div>
              <h1 className="home-title">Perplexity</h1>
              <p className="home-subtitle">Ask anything. Get instant, precise answers with real-time web access.</p>
              <div className="home-suggestions">
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} className="suggestion-chip" onClick={() => handleSuggestion(s.text)}>
                    <span>{s.icon}</span>
                    <span>{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="messages-area">
              <div className="messages-inner">
                {currentMessages.map((message, idx) => (
                  <div key={idx} className="message-row">
                    {message.role === 'user' ? (
                      <div className="message-bubble user">
                        {message.content}
                      </div>
                    ) : (
                      <div className="message-bubble ai">
                        <div className="ai-label">
                          <div className="ai-label-dot" />
                          Perplexity
                        </div>
                        <div className="markdown-body">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => <p>{children}</p>,
                              ul: ({ children }) => <ul>{children}</ul>,
                              ol: ({ children }) => <ol>{children}</ol>,
                              li: ({ children }) => <li>{children}</li>,
                              code: ({ children }) => <code>{children}</code>,
                              pre: ({ children }) => <pre>{children}</pre>,
                              h1: ({ children }) => <h1>{children}</h1>,
                              h2: ({ children }) => <h2>{children}</h2>,
                              h3: ({ children }) => <h3>{children}</h3>,
                              a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
                              blockquote: ({ children }) => <blockquote>{children}</blockquote>,
                              table: ({ children }) => <table>{children}</table>,
                              th: ({ children }) => <th>{children}</th>,
                              td: ({ children }) => <td>{children}</td>,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="message-row">
                    <div className="message-bubble ai">
                      <div className="ai-label">
                        <div className="ai-label-dot" />
                        Perplexity
                      </div>
                      <div className="typing-indicator">
                        <div className="typing-dot" />
                        <div className="typing-dot" />
                        <div className="typing-dot" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* ── Input area ── */}
          <div className="input-wrapper">
            <div className="input-container">
              <textarea
                ref={textareaRef}
                rows={1}
                value={chatInput}
                onChange={(e) => { setChatInput(e.target.value); autoResize(e) }}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                className="input-textarea"
              />
              <div className="input-actions">
                <span className="input-hint">
                  {isTyping ? 'Generating response...' : 'Shift + Enter for new line'}
                </span>
                <button
                  onClick={isTyping ? undefined : handleSubmitMessage}
                  disabled={!chatInput.trim() && !isTyping}
                  className={`btn-send ${isTyping ? 'btn-stop' : ''}`}
                  title={isTyping ? 'Stop generating' : 'Send message'}
                >
                  {isTyping ? <IconStop /> : <IconSend />}
                </button>
              </div>
            </div>
            <p className="input-footer-note">
              Perplexity can make mistakes. Consider checking important information.
            </p>
          </div>
        </main>

        {/* ── Delete confirmation toast ── */}
        {deleteConfirm && (
          <div className="delete-confirm">
            <span className="delete-confirm-text">Delete this chat?</span>
            <button className="delete-confirm-btn cancel" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </button>
            <button className="delete-confirm-btn confirm" onClick={handleDeleteConfirm}>
              Delete
            </button>
          </div>
        )}
      </div>
    </>
  )
}

const Dashboard = () => (
  <ThemeProvider>
    <DashboardInner />
  </ThemeProvider>
)

export default Dashboard
