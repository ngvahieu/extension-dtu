// Background Service Worker for Hieu Pro
// Handles API requests to bypass Content Security Policy (CSP) and CORS restrictions on target websites

const API_URL = 'https://vinkaycaptcha.onrender.com/api/solve';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
        const isSafari = (typeof chrome !== 'undefined' && chrome.runtime && typeof chrome.runtime.getURL === 'function' && chrome.runtime.getURL('').startsWith('safari-extension://'));
        if (isSafari) {
            return promise;
        }
        return true;
    }
});
