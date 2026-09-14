(function() {
    'use strict';
    window.alert = function(msg) {
        console.log('[Hieu Pro] Tự động đóng alert:', msg);
        try {
            window.dispatchEvent(new CustomEvent('hieu_alert_event', { detail: msg }));
        } catch (e) {}
    };
    window.confirm = function(msg) {
        console.log('[Hieu Pro] Tự động confirm:', msg);
        try {
            window.dispatchEvent(new CustomEvent('hieu_confirm_event', { detail: msg }));
        } catch (e) {}
        return true;
    };
    window.Confirm = function(msg) {
        console.log('[Hieu Pro] Tự động Confirm:', msg);
        try {
            window.dispatchEvent(new CustomEvent('hieu_confirm_event', { detail: msg }));
        } catch (e) {}
        return true;
    };
})();
