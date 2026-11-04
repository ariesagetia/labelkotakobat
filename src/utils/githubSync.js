import { parseExcelArrayBuffer } from './excelParser';

export const GITHUB_CONFIG = {
  owner: 'ariesagetia',
  repo: 'labelkotakobat',
  branch: 'main',
  filePath: 'public/data_obat_default.xlsx',
  rawUrl: 'https://raw.githubusercontent.com/ariesagetia/labelkotakobat/main/public/data_obat_default.xlsx',
  repoUploadUrl: 'https://github.com/ariesagetia/labelkotakobat/upload/main/public',
  repoFileUrl: 'https://github.com/ariesagetia/labelkotakobat/blob/main/public/data_obat_default.xlsx'
};

/**
 * Fetch default Excel dataset from GitHub repository or local fallback
 */
export async function fetchDefaultDataFromGitHub() {
  const timestamp = Date.now();
  // Try remote raw GitHub URL first, then fallback to relative URL
  const urls = [
    `${GITHUB_CONFIG.rawUrl}?t=${timestamp}`,
    `/data_obat_default.xlsx?t=${timestamp}`
  ];

  let lastError = null;

  for (const url of urls) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const parsed = parseExcelArrayBuffer(arrayBuffer);
      return {
        ...parsed,
        sourceUrl: url,
        source: 'github',
        fetchedAt: new Date().toISOString()
      };
    } catch (err) {
      console.warn(`Gagal fetch data obat dari ${url}:`, err);
      lastError = err;
    }
  }

  throw lastError || new Error('Gagal mengunduh file default dari GitHub');
}

/**
 * Push an updated Excel file directly to GitHub using GitHub REST API
 * @param {File|Blob|ArrayBuffer} fileData
 * @param {string} token - GitHub Personal Access Token (PAT)
 * @param {string} commitMessage - Optional commit message
 */
export async function pushExcelToGitHub(fileData, token, commitMessage = 'Update data_obat_default.xlsx via Apotek Label Master') {
  if (!token || !token.trim()) {
    throw new Error('Token GitHub diperlukan untuk melakukan upload langsung ke repositori.');
  }

  // 1. Convert fileData to base64 safely
  let base64Content = '';
  if (fileData instanceof ArrayBuffer) {
    base64Content = arrayBufferToBase64(fileData);
  } else if (fileData instanceof Blob || fileData instanceof File) {
    const buffer = await fileData.arrayBuffer();
    base64Content = arrayBufferToBase64(buffer);
  } else {
    throw new Error('Format file tidak didukung.');
  }

  const apiUrl = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.filePath}`;

  // 2. Get current file SHA (required by GitHub API to update an existing file)
  let existingSha = null;
  try {
    const getRes = await fetch(`${apiUrl}?ref=${GITHUB_CONFIG.branch}&t=${Date.now()}`, {
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    if (getRes.ok) {
      const getData = await getRes.json();
      existingSha = getData.sha;
    }
  } catch (err) {
    console.warn('Gagal membaca SHA file eksisting:', err);
  }

  // 3. Send PUT request to create/update file in GitHub
  const payload = {
    message: commitMessage,
    content: base64Content,
    branch: GITHUB_CONFIG.branch
  };
  if (existingSha) {
    payload.sha = existingSha;
  }

  const putRes = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token.trim()}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!putRes.ok) {
    const errBody = await putRes.json().catch(() => ({}));
    throw new Error(errBody.message || `Gagal upload ke GitHub (Status ${putRes.status})`);
  }

  return await putRes.json();
}

/**
 * Helper to convert ArrayBuffer to Base64 safely without call stack overflow
 */
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binary += String.fromCharCode.apply(null, chunk);
  }
  return window.btoa(binary);
}

export function getSavedGitHubToken() {
  try {
    return localStorage.getItem('apotek_github_token') || '';
  } catch {
    return '';
  }
}

export function saveGitHubToken(token) {
  try {
    if (token) {
      localStorage.setItem('apotek_github_token', token.trim());
    } else {
      localStorage.removeItem('apotek_github_token');
    }
  } catch {}
}
