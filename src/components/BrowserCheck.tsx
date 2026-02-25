'use client';

import { useState, useEffect } from 'react';

interface BrowserInfo {
  name: string;
  version: number;
  isSupported: boolean;
}

function detectBrowser(): BrowserInfo {
  if (typeof window === 'undefined') {
    return { name: 'unknown', version: 0, isSupported: true };
  }

  const userAgent = navigator.userAgent;
  let browserName = 'unknown';
  let browserVersion = 0;

  // Check for Edge (Chromium-based)
  if (userAgent.includes('Edg/')) {
    browserName = 'Edge';
    const match = userAgent.match(/Edg\/(\d+)/);
    if (match) browserVersion = parseInt(match[1], 10);
  }
  // Check for Chrome
  else if (userAgent.includes('Chrome/') && !userAgent.includes('Chromium/')) {
    browserName = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+)/);
    if (match) browserVersion = parseInt(match[1], 10);
  }
  // Check for Firefox
  else if (userAgent.includes('Firefox/')) {
    browserName = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+)/);
    if (match) browserVersion = parseInt(match[1], 10);
  }
  // Check for Safari (must be after Chrome check since Chrome UA contains Safari)
  else if (userAgent.includes('Safari/') && !userAgent.includes('Chrome/')) {
    browserName = 'Safari';
    const match = userAgent.match(/Version\/(\d+)/);
    if (match) browserVersion = parseInt(match[1], 10);
  }
  // Check for Opera
  else if (userAgent.includes('OPR/') || userAgent.includes('Opera/')) {
    browserName = 'Opera';
    const match = userAgent.match(/(?:OPR|Opera)\/(\d+)/);
    if (match) browserVersion = parseInt(match[1], 10);
  }

  // Determine if browser is supported
  let isSupported = false;
  
  if (browserName === 'Chrome' || browserName === 'Edge' || browserName === 'Opera') {
    // Chrome, Edge, Opera (Chromium-based) need version >= 120
    isSupported = browserVersion >= 120;
  } else if (browserName === 'Firefox') {
    // Firefox needs version >= 115
    isSupported = browserVersion >= 115;
  } else if (browserName === 'Safari') {
    // Safari - allow version >= 17 (released 2023)
    isSupported = browserVersion >= 17;
  }
  // Unknown browsers are not supported

  return { name: browserName, version: browserVersion, isSupported };
}

// Inline styles for maximum browser compatibility (no modern CSS features)
const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '16px',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    maxWidth: '500px',
    width: '100%',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#dc2626',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerIcon: {
    width: '32px',
    height: '32px',
    color: '#ffffff',
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: 'bold' as const,
    color: '#ffffff',
    margin: 0,
  },
  content: {
    padding: '20px',
  },
  browserInfo: {
    marginBottom: '16px',
    fontSize: '14px',
    color: '#374151',
  },
  browserName: {
    fontWeight: 'bold' as const,
    color: '#111827',
  },
  description: {
    fontSize: '14px',
    color: '#4b5563',
    marginBottom: '16px',
  },
  requirementsBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: '6px',
    padding: '16px',
    marginBottom: '16px',
  },
  requirementsTitle: {
    fontWeight: 'bold' as const,
    color: '#1f2937',
    marginBottom: '8px',
    fontSize: '14px',
  },
  requirementsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  requirementItem: {
    fontSize: '13px',
    color: '#4b5563',
    marginBottom: '6px',
    paddingLeft: '16px',
    position: 'relative' as const,
  },
  downloadBox: {
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '6px',
    padding: '16px',
  },
  downloadText: {
    fontSize: '13px',
    color: '#1e40af',
    marginBottom: '12px',
  },
  downloadButton: {
    display: 'block',
    width: '100%',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontWeight: 'bold' as const,
    fontSize: '14px',
    padding: '12px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    textAlign: 'center' as const,
  },
  warningBox: {
    backgroundColor: '#fef3c7',
    border: '1px solid #f59e0b',
    borderRadius: '6px',
    padding: '12px 16px',
    marginTop: '16px',
  },
  warningText: {
    fontSize: '12px',
    color: '#92400e',
    margin: 0,
  },
};

export default function BrowserCheck() {
  const [showWarning, setShowWarning] = useState(false);
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);

  useEffect(() => {
    const info = detectBrowser();
    setBrowserInfo(info);

    if (!info.isSupported) {
      setShowWarning(true);
    }
  }, []);

  const handleDownload = () => {
    window.location.href = '/googlechromestandaloneenterprise64.msi';
  };

  if (!showWarning || !browserInfo) {
    return null;
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <svg
            style={styles.headerIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 style={styles.headerTitle}>
            Trình duyệt không được hỗ trợ
          </h2>
        </div>

        {/* Content */}
        <div style={styles.content}>
          <div style={styles.browserInfo}>
            <p>
              Trình duyệt của bạn:{' '}
              <span style={styles.browserName}>
                {browserInfo.name === 'unknown'
                  ? 'Không xác định'
                  : `${browserInfo.name} phiên bản ${browserInfo.version}`}
              </span>
            </p>
          </div>

          <p style={styles.description}>
            Trình duyệt của bạn không được hỗ trợ. Vui lòng tải và cài đặt trình duyệt mới để sử dụng ứng dụng này.
          </p>

          <div style={styles.requirementsBox}>
            <div style={styles.requirementsTitle}>Yêu cầu tối thiểu:</div>
            <ul style={styles.requirementsList}>
              <li style={styles.requirementItem}>
                • Google Chrome phiên bản 120 trở lên
              </li>
              <li style={styles.requirementItem}>
                • Microsoft Edge phiên bản 120 trở lên
              </li>
              <li style={styles.requirementItem}>
                • Mozilla Firefox phiên bản 115 trở lên
              </li>
            </ul>
          </div>

          <div style={styles.downloadBox}>
            <p style={styles.downloadText}>
              <strong>Bắt buộc:</strong> Tải và cài đặt Google Chrome Enterprise để tiếp tục sử dụng ứng dụng.
            </p>
            <button
              onClick={handleDownload}
              style={styles.downloadButton}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }}
            >
              ⬇ Tải Google Chrome Enterprise
            </button>
          </div>

          <div style={styles.warningBox}>
            <p style={styles.warningText}>
              ⚠ Bạn không thể sử dụng ứng dụng cho đến khi cài đặt trình duyệt được hỗ trợ. 
              Sau khi cài đặt, vui lòng mở lại ứng dụng bằng trình duyệt mới.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
