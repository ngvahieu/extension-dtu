//
//  ViewController.swift
//  Shared (App)
//
//  Created by hieudev on 17/7/26.
//

import WebKit

#if os(iOS)
import UIKit
typealias PlatformViewController = UIViewController
#elseif os(macOS)
import Cocoa
import SafariServices
typealias PlatformViewController = NSViewController
#endif

let extensionBundleIdentifier = "com.yourCompany.Hieu-Extension-pro.Extension"

class ViewController: PlatformViewController, WKNavigationDelegate, WKUIDelegate, WKScriptMessageHandler {

    @IBOutlet var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()

        self.webView.navigationDelegate = self
        self.webView.uiDelegate = self

#if os(iOS)
        self.webView.scrollView.isScrollEnabled = true
        self.webView.scrollView.bounces = true
        self.webView.scrollView.pinchGestureRecognizer?.isEnabled = false
        self.webView.scrollView.maximumZoomScale = 1.0
        self.webView.scrollView.minimumZoomScale = 1.0
        self.webView.scrollView.bouncesZoom = false
        self.webView.isOpaque = false
        self.webView.backgroundColor = .white

        let disableZoomScript = """
        var meta = document.querySelector('meta[name="viewport"]');
        if (meta) {
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover';
        }
        document.addEventListener('gesturestart', function(e) { e.preventDefault(); }, { passive: false });
        """
        let userScript = WKUserScript(source: disableZoomScript, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
        self.webView.configuration.userContentController.addUserScript(userScript)
#elseif os(macOS)
        self.webView.allowsMagnification = false
        self.webView.autoresizingMask = [.width, .height]
        self.webView.frame = self.view.bounds
#endif

        self.webView.configuration.userContentController.add(self, name: "controller")
        self.webView.configuration.userContentController.add(self, name: "openExternalURL")

        if let popupURL = Bundle.main.url(forResource: "popup", withExtension: "html") {
            self.webView.loadFileURL(popupURL, allowingReadAccessTo: Bundle.main.resourceURL!)
        } else if let mainURL = Bundle.main.url(forResource: "Main", withExtension: "html") {
            self.webView.loadFileURL(mainURL, allowingReadAccessTo: Bundle.main.resourceURL!)
        }
    }

#if os(macOS)
    override func viewWillAppear() {
        super.viewWillAppear()
        if let window = self.view.window {
            window.title = "Hieu Extension pro"
            window.setContentSize(NSSize(width: 400, height: 640))
            window.minSize = NSSize(width: 380, height: 520)
            window.center()
        }
    }
#endif

    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        if let url = navigationAction.request.url {
            let scheme = url.scheme?.lowercased() ?? ""
            if scheme == "http" || scheme == "https" || scheme == "tel" || scheme == "mailto" {
                #if os(iOS)
                UIApplication.shared.open(url, options: [:], completionHandler: nil)
                #elseif os(macOS)
                NSWorkspace.shared.open(url)
                #endif
                decisionHandler(.cancel)
                return
            }
        }
        decisionHandler(.allow)
    }

    func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        if let url = navigationAction.request.url {
            let scheme = url.scheme?.lowercased() ?? ""
            if scheme == "http" || scheme == "https" || scheme == "tel" || scheme == "mailto" {
                #if os(iOS)
                UIApplication.shared.open(url, options: [:], completionHandler: nil)
                #elseif os(macOS)
                NSWorkspace.shared.open(url)
                #endif
            }
        }
        return nil
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
#if os(iOS)
        webView.evaluateJavaScript("document.documentElement.classList.add('ios-app'); if (typeof show === 'function') { show('ios'); }")
#elseif os(macOS)
        webView.evaluateJavaScript("document.documentElement.classList.add('mac-app'); if (typeof show === 'function') { show('mac'); }")

        SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: extensionBundleIdentifier) { (state, error) in
            guard let state = state, error == nil else {
                return
            }

            DispatchQueue.main.async {
                if #available(macOS 13, *) {
                    webView.evaluateJavaScript("if (typeof show === 'function') { show('mac', \(state.isEnabled), true); }")
                } else {
                    webView.evaluateJavaScript("if (typeof show === 'function') { show('mac', \(state.isEnabled), false); }")
                }
            }
        }
#endif
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "openExternalURL", let urlString = message.body as? String, let url = URL(string: urlString) {
            #if os(iOS)
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
            #elseif os(macOS)
            NSWorkspace.shared.open(url)
            #endif
            return
        }

#if os(macOS)
        if message.name == "controller" && (message.body as? String == "open-preferences") {
            SFSafariApplication.showPreferencesForExtension(withIdentifier: extensionBundleIdentifier) { error in
                guard error == nil else {
                    return
                }

                DispatchQueue.main.async {
                    NSApp.terminate(self)
                }
            }
        }
#endif
    }

}
