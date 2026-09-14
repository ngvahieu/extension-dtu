// Background Service Worker for Hieu Pro
// Handles API requests to bypass Content Security Policy (CSP) and CORS restrictions on target websites

const API_URL = 'https://vinkaycaptcha.onrender.com/api/solve';
const loginWatchdogs = new Map();

function clearLoginWatchdog(tabId) {
    const timer = loginWatchdogs.get(tabId);
    if (timer) {
        clearTimeout(timer);
        loginWatchdogs.delete(tabId);
    }
}

function reloadLoginTab(tabId, loginUrl) {
    let targetUrl;
    try {
        const url = new URL(loginUrl);
        url.hash = '';
        url.searchParams.set('_hieu_retry', Date.now().toString());
        targetUrl = url.toString();
    } catch (error) {
        console.error('[Hieu Background] URL đăng nhập không hợp lệ:', error);
        chrome.tabs.reload(tabId);
        return;
    }

    chrome.tabs.update(tabId, { url: targetUrl }, () => {
        if (chrome.runtime.lastError) {
            console.error('[Hieu Background] Không thể tải lại tab đăng nhập:', chrome.runtime.lastError.message);
            return;
        }
        console.log('[Hieu Background] Đã tải lại tab đăng nhập sau khi watchdog hết hạn.');
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startLoginWatchdog') {
        const tabId = sender.tab && sender.tab.id;
        if (typeof tabId !== 'number') {
            sendResponse({ success: false, error: 'Không xác định được tab đăng nhập.' });
            return false;
        }

        clearLoginWatchdog(tabId);
        const requestedTimeout = Number(request.timeoutMs);
        const timeoutMs = Number.isFinite(requestedTimeout)
            ? Math.max(0, Math.min(requestedTimeout, 60000))
            : 5000;
        const loginUrl = request.loginUrl || sender.tab.url;
        const timer = setTimeout(() => {
            loginWatchdogs.delete(tabId);
            console.log('[Hieu Background] Hết thời gian đăng nhập, tải lại tab:', tabId);
            reloadLoginTab(tabId, loginUrl);
        }, timeoutMs);
        loginWatchdogs.set(tabId, timer);
        sendResponse({ success: true });
        return false;
    }

    if (request.action === 'cancelLoginWatchdog') {
        const tabId = sender.tab && sender.tab.id;
        if (typeof tabId === 'number') {
            clearLoginWatchdog(tabId);
            console.log('[Hieu Background] Đã hủy watchdog vì đăng nhập thành công:', tabId);
        }
        sendResponse({ success: true });
        return false;
    }

    if (request.action === 'solveCaptcha') {
        console.log('[Hieu Background] Nhận được yêu cầu giải captcha, đang gọi API...');
        
        const promise = fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: request.image
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('[Hieu Background] API phản hồi thành công:', data);
            const res = { success: true, data: data };
            sendResponse(res);
            return res;
        })
        .catch(error => {
            console.error('[Hieu Background] Lỗi khi gọi API:', error);
            const res = { success: false, error: error.message };
            sendResponse(res);
            return res;
        });

        // Trên Safari, trả về Promise để giữ Service Worker sống. Trên Chrome, trả về true.
        const extensionBaseUrl = (typeof chrome !== 'undefined' && chrome.runtime && typeof chrome.runtime.getURL === 'function')
            ? chrome.runtime.getURL('')
            : '';
        const isSafari = extensionBaseUrl.startsWith('safari-extension://') ||
                          extensionBaseUrl.startsWith('safari-web-extension://');
        if (isSafari) {
            return promise;
        }
        return true;
    }
});

if (chrome.tabs && chrome.tabs.onRemoved) {
    chrome.tabs.onRemoved.addListener(tabId => clearLoginWatchdog(tabId));
}
