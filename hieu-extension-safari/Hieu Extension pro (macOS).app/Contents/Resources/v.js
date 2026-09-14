if (typeof chrome === 'undefined' || !chrome.storage) {
  window.chrome = {
    storage: {
      local: {
        get: (keys, cb) => {
          const res = {};
          try {
            if (typeof keys === 'string') {
              const val = localStorage.getItem(keys);
              if (val !== null) {
                try { res[keys] = JSON.parse(val); } catch (e) { res[keys] = val; }
              }
            } else if (Array.isArray(keys)) {
              keys.forEach(k => {
                const val = localStorage.getItem(k);
                if (val !== null) {
                  try { res[k] = JSON.parse(val); } catch (e) { res[k] = val; }
                }
              });
            } else if (typeof keys === 'object' && keys !== null) {
              Object.keys(keys).forEach(k => {
                const val = localStorage.getItem(k);
                if (val !== null) {
                  try { res[k] = JSON.parse(val); } catch (e) { res[k] = val; }
                } else {
                  res[k] = keys[k];
                }
              });
            } else {
              for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                const val = localStorage.getItem(k);
                try { res[k] = JSON.parse(val); } catch (e) { res[k] = val; }
              }
            }
          } catch (e) { }
          if (cb) cb(res);
          return Promise.resolve(res);
        },
        set: (data, cb) => {
          try {
            if (data && typeof data === 'object') {
              Object.keys(data).forEach(k => {
                localStorage.setItem(k, JSON.stringify(data[k]));
              });
            }
          } catch (e) { }
          if (cb) cb();
          return Promise.resolve();
        },
        remove: (keys, cb) => {
          try {
            const list = Array.isArray(keys) ? keys : [keys];
            list.forEach(k => localStorage.removeItem(k));
          } catch (e) { }
          if (cb) cb();
          return Promise.resolve();
        }
      },
      onChanged: {
        addListener: () => { }
      }
    },
    tabs: {
      query: (opts, cb) => {
        const tabs = [{ id: 1, url: window.location.href, title: document.title }];
        if (cb) cb(tabs);
        return Promise.resolve(tabs);
      },
      create: (opts, cb) => {
        const targetUrl = (opts && opts.url) ? opts.url : '';
        if (targetUrl) {
          if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.openExternalURL) {
            window.webkit.messageHandlers.openExternalURL.postMessage(targetUrl);
          } else {
            window.open(targetUrl, '_blank');
          }
        }
        const tab = { id: 9999, url: targetUrl };
        if (cb) cb(tab);
        return Promise.resolve(tab);
      }
    },
    runtime: {
      getURL: (path) => path,
      onMessage: {
        addListener: () => { }
      }
    }
  };
}

// Chặn thu phóng (pinch-to-zoom) trên iOS WebKit
document.addEventListener('gesturestart', function (e) {
  e.preventDefault();
});
document.addEventListener('gesturechange', function (e) {
  e.preventDefault();
});
document.addEventListener('gestureend', function (e) {
  e.preventDefault();
});

const COURSE_URL =
  "https://mydtu.duytan.edu.vn/sites/index.aspx?p=home_semester&functionid=35";
const EXAM_URL = "https://tidtu.pages.dev/pdaotao/examlist";
const TRANSCRIPT_URL =
  "https://mydtu.duytan.edu.vn/sites/index.aspx?p=home_bangdiem&functionid=14";
const DETAILED_TRANSCRIPT_URL =
  "https://mydtu.duytan.edu.vn/sites/index.aspx?p=home_grading_classbysemester&functionid=82";
const CURRICULUM_URL =
  "https://mydtu.duytan.edu.vn/sites/index.aspx?p=home_listcurriculum&functionid=37";
const SAKAI_URL =
  "https://mydtu.duytan.edu.vn/Elearning.aspx?v=new&t=639200963240176318";
let openQuickLinkTimeout = null;
async function openQuickLink(targetUrl) {
  if (openQuickLinkTimeout) return;
  openQuickLinkTimeout = true;
  setTimeout(() => {
    openQuickLinkTimeout = null;
  }, 1000);
  chrome.storage.local.set({ pendingRedirectUrl: targetUrl }, async () => {
    if (targetUrl === SAKAI_URL) {
      await chrome.tabs.create({ url: "https://mydtu.duytan.edu.vn/" });
    } else {
      await chrome.tabs.create({ url: targetUrl });
    }
  });
}
const DEFAULT_ANSWERS = `1A 2A 3A 4A 5C 6A 7A 8A 9B 10C
11C 12B 13A 14A 15D 16C 17A 18C 19A 20B
21C 22D 23D 24C 25B 26C 27A 28C 29B 30A`;
const TOOL_META = {
  autoquiz: { action: "view", view: "autoQuizView" },
  teacher: { action: "view", view: "teacherEvalView" },
  courses: { action: "view", view: "coursesView" },
  exam: { action: "url", url: EXAM_URL },
  menu: { action: "view", view: "menuListView" },
  quiz: { action: "url", url: "https://vinkaylearn.vercel.app" },
};
const views = [...document.querySelectorAll(".view")];
const answersInput = document.getElementById("answersInput");
const delayInput = document.getElementById("delayInput");
const autoQuizStatus = document.getElementById("autoQuizStatus");
const teacherStatus = document.getElementById("teacherStatus");
const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
const settingsStatus = document.getElementById("settingsStatus");
const autoReloadInput = document.getElementById("autoReloadInput");
const accountSelect = document.getElementById("accountSelect");
const addAccountBtn = document.getElementById("addAccountBtn");
const deleteAccountBtn = document.getElementById("deleteAccountBtn");
const coursesInputSection = document.getElementById("coursesInputSection");
const coursesListSection = document.getElementById("coursesListSection");
const courseCodesTextarea = document.getElementById("courseCodesTextarea");
const coursesGrid = document.getElementById("coursesGrid");
const coursesStatus = document.getElementById("coursesStatus");

function saveAnswers(value) {
  chrome.storage.local.set({ answers: value });
}

function saveNotes(value) {
  chrome.storage.local.set({ note: value }, () => {
    const noteStatus = document.getElementById("noteStatus");
    if (noteStatus) {
      noteStatus.textContent = "Đã lưu tự động!";
      noteStatus.className = "status-box ok";
      noteStatus.style.display = "block";
      setTimeout(() => {
        noteStatus.style.display = "none";
      }, 2000);
    }
  });
}

function showView(viewId) {
  views.forEach((v) => v.classList.remove("active-view"));
  const target = document.getElementById(viewId);
  if (target) {
    target.classList.add("active-view");
  }
}

function setStatus(el, message, type = "") {
  if (!el) return;
  el.textContent = message;
  el.className = `status-box ${type}`.trim();
}

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function isBlockedUrl(url = "") {
  return (
    url.startsWith("chrome://") ||
    url.startsWith("edge://") ||
    url.startsWith("about:") ||
    url.startsWith("chrome-extension://")
  );
}

async function runInCurrentTab(func, args = [], options = {}) {
  const tab = await getCurrentTab();
  if (!tab || !tab.id) {
    throw new Error("Không tìm thấy tab đang mở.");
  }
  if (isBlockedUrl(tab.url)) {
    throw new Error("Không thể thao tác trên trang này của trình duyệt.");
  }
  try {
    if (options.allFrames) {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        func,
        args,
      });
      return result?.result;
    } else {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func,
        args,
      });
      return result?.result;
    }
  } catch (error) {
    throw new Error(error.message || "Không thể thực thi trên trang này.");
  }
}

async function openTool(toolKey) {
  const meta = TOOL_META[toolKey];
  if (!meta) return;
  if (meta.action === "view") {
    showView(meta.view);
  } else if (meta.action === "url") {
    await openQuickLink(meta.url);
  }
}

function sanitizeAccounts(raw) {
  if (!Array.isArray(raw)) return [];
  const valid = [];
  const seen = new Set();
  raw.forEach((item) => {
    if (!item) return;
    let username = "";
    let password = "";
    let note = "";
    if (typeof item === "string") {
      username = item.trim();
    } else if (typeof item === "object") {
      username = (item.username || item.user || item.name || item.account || "").toString().trim();
      password = (item.password || item.pass || "").toString().trim();
      note = (item.note || "").toString().trim();
    }
    if (
      username &&
      username.toLowerCase() !== "undefined" &&
      username.toLowerCase() !== "null" &&
      !seen.has(username)
    ) {
      seen.add(username);
      valid.push({ username, password, ...(note ? { note } : {}) });
    }
  });
  return valid;
}

function renderAccountSelect(rawAccounts = [], currentActiveUser = "") {
  if (!accountSelect) return;
  const accounts = sanitizeAccounts(rawAccounts);
  accountSelect.innerHTML =
    '<option value="">-- Thêm tài khoản mới --</option>';
  accounts.forEach((acc) => {
    const option = document.createElement("option");
    option.value = acc.username;
    option.textContent = `${acc.username}${acc.note ? ` (${acc.note})` : ""}`;
    accountSelect.appendChild(option);
  });
  const validActive = (currentActiveUser && currentActiveUser !== "undefined" && currentActiveUser !== "null") ? currentActiveUser : "";
  accountSelect.value = validActive;
}

function onAccountSelectChange() {
  const selectedUser = accountSelect.value;
  if (!selectedUser || selectedUser === "undefined" || selectedUser === "null") {
    usernameInput.value = "";
    passwordInput.value = "";
    if (deleteAccountBtn) deleteAccountBtn.style.display = "none";
    chrome.storage.local.set({
      activeUser: "",
      username: "",
      password: "",
      myDtuUser: "",
      myDtuPass: "",
    });
    return;
  }
  chrome.storage.local.get(["accounts"], (data) => {
    const accounts = sanitizeAccounts(data.accounts || []);
    const acc = accounts.find((a) => a.username === selectedUser);
    if (acc) {
      usernameInput.value = acc.username || "";
      passwordInput.value = acc.password || "";
      if (deleteAccountBtn) deleteAccountBtn.style.display = "flex";
      chrome.storage.local.set({
        activeUser: acc.username,
        username: acc.username,
        password: acc.password,
        myDtuUser: acc.username,
        myDtuPass: acc.password,
      });
    }
  });
}

function addNewAccountClick() {
  if (accountSelect) accountSelect.value = "";
  usernameInput.value = "";
  passwordInput.value = "";
  usernameInput.focus();
  if (deleteAccountBtn) deleteAccountBtn.style.display = "none";
  chrome.storage.local.set({
    activeUser: "",
    username: "",
    password: "",
    myDtuUser: "",
    myDtuPass: "",
  });
}

function deleteAccountClick() {
  const targetUser =
    (accountSelect ? accountSelect.value : "") || usernameInput.value.trim();
  if (!targetUser || targetUser === "undefined" || targetUser === "null") {
    chrome.storage.local.get(["accounts"], (data) => {
      let accounts = sanitizeAccounts(data.accounts || []);
      chrome.storage.local.set({
        accounts,
        activeUser: "",
        username: "",
        password: "",
        myDtuUser: "",
        myDtuPass: "",
      }, () => {
        renderAccountSelect(accounts, "");
        usernameInput.value = "";
        passwordInput.value = "";
        if (deleteAccountBtn) deleteAccountBtn.style.display = "none";
        setStatus(settingsStatus, "Đã làm sạch dữ liệu tài khoản.", "ok");
      });
    });
    return;
  }
  if (!confirm(`Bạn có chắc muốn xóa tài khoản "${targetUser}"?`)) return;

  chrome.storage.local.get(["accounts"], (data) => {
    let accounts = sanitizeAccounts(data.accounts || []);
    accounts = accounts.filter((a) => a.username !== targetUser);

    const nextUser = accounts.length > 0 ? accounts[0].username : "";
    const nextPass = accounts.length > 0 ? accounts[0].password : "";

    chrome.storage.local.set(
      {
        accounts,
        activeUser: nextUser,
        username: nextUser,
        password: nextPass,
        myDtuUser: nextUser,
        myDtuPass: nextPass,
      },
      () => {
        renderAccountSelect(accounts, nextUser);
        usernameInput.value = nextUser;
        passwordInput.value = nextPass;
        if (deleteAccountBtn) {
          deleteAccountBtn.style.display = nextUser ? "flex" : "none";
        }
        setStatus(settingsStatus, `Đã xóa tài khoản ${targetUser}.`, "ok");
      }
    );
  });
}

function bindUi() {
  initTwistingRibbon();

  // Main tool cards
  document.querySelectorAll("[data-tool]").forEach((btn) => {
    btn.addEventListener("click", () => openTool(btn.dataset.tool));
  });

  // Back to menu buttons (All views)
  document.querySelectorAll(".back-btn, [data-back-to-menu], [data-back]").forEach((btn) => {
    btn.addEventListener("click", () => showView("menuView"));
  });

  // Header quick buttons
  const btnSakai = document.getElementById("btnSakaiHeader") || document.getElementById("btnSakai");
  if (btnSakai) {
    btnSakai.addEventListener("click", () => {
      openQuickLink(SAKAI_URL);
    });
  }

  const btnMydtu = document.getElementById("btnMydtuHeader") || document.getElementById("btnMydtu");
  if (btnMydtu) {
    btnMydtu.addEventListener("click", () => {
      openQuickLink("https://mydtu.duytan.edu.vn/");
    });
  }

  const btnSetting = document.getElementById("settingsBtn") || document.getElementById("btnSetting");
  if (btnSetting) {
    btnSetting.addEventListener("click", () => {
      showView("settingsView");
    });
  }

  const btnNote = document.getElementById("noteBtn") || document.getElementById("btnNote");
  if (btnNote) {
    btnNote.addEventListener("click", () => {
      showView("noteView");
    });
  }

  // Menu screen buttons
  const btnTranscript = document.getElementById("btnTranscript");
  if (btnTranscript) {
    btnTranscript.addEventListener("click", () => {
      openQuickLink(TRANSCRIPT_URL);
    });
  }

  const btnDetailedTranscript = document.getElementById("btnDetailedTranscript");
  if (btnDetailedTranscript) {
    btnDetailedTranscript.addEventListener("click", () => {
      openQuickLink(DETAILED_TRANSCRIPT_URL);
    });
  }

  const btnCurriculum = document.getElementById("btnCurriculum");
  if (btnCurriculum) {
    btnCurriculum.addEventListener("click", () => {
      openQuickLink(CURRICULUM_URL);
    });
  }

  const btnAutoQuizMenu = document.getElementById("btnAutoQuizMenu");
  if (btnAutoQuizMenu) {
    btnAutoQuizMenu.addEventListener("click", () => {
      showView("autoQuizView");
    });
  }

  const btnTeacherEvalMenu = document.getElementById("btnTeacherEvalMenu");
  if (btnTeacherEvalMenu) {
    btnTeacherEvalMenu.addEventListener("click", () => {
      showView("teacherEvalView");
    });
  }

  // AutoQuiz inputs
  if (answersInput) {
    answersInput.addEventListener("input", () => saveAnswers(answersInput.value));
    answersInput.addEventListener("change", () => saveAnswers(answersInput.value));
    answersInput.addEventListener("paste", () => setTimeout(() => saveAnswers(answersInput.value), 0));
  }

  const pasteBtn = document.getElementById("pasteAnswers");
  if (pasteBtn) pasteBtn.addEventListener("click", pasteAnswers);

  const clearBtn = document.getElementById("clearAnswers");
  if (clearBtn) clearBtn.addEventListener("click", clearAnswers);

  const runQuizBtn = document.getElementById("runAutoQuiz");
  if (runQuizBtn) runQuizBtn.addEventListener("click", runAutoQuiz);

  // Teacher Eval buttons
  document.querySelectorAll("[data-level], [data-eval-level]").forEach((btn) => {
    btn.addEventListener("click", runTeacherEval);
  });

  const autoBtn = document.getElementById("autoTeacherEval");
  if (autoBtn) {
    autoBtn.addEventListener("click", runAutoTeacherEval);
  }

  // Settings screen buttons
  const saveSettingsBtn = document.getElementById("saveCredentials") || document.getElementById("saveSettings");
  if (saveSettingsBtn) saveSettingsBtn.addEventListener("click", saveCredentials);

  const toggleBtn = document.getElementById("togglePasswordBtn") || document.getElementById("togglePassword");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", togglePasswordVisibility);
  }

  const extensionToggle = document.getElementById("extensionToggle");
  if (extensionToggle) {
    extensionToggle.addEventListener("change", (e) => {
      const isEnabled = e.target.checked;
      chrome.storage.local.set({ extensionEnabled: isEnabled });
    });
  }

  // Notes screen
  const noteInput = document.getElementById("noteInput");
  if (noteInput) {
    noteInput.addEventListener("input", (e) => {
      saveNotes(e.target.value);
    });
  }

  // Courses screen buttons
  const btnCoursesSubmit = document.getElementById("saveCoursesBtn") || document.getElementById("btnCoursesSubmit");
  if (btnCoursesSubmit) btnCoursesSubmit.addEventListener("click", saveCourses);

  const btnCoursesReset = document.getElementById("resetCoursesBtn") || document.getElementById("btnCoursesReset");
  if (btnCoursesReset) btnCoursesReset.addEventListener("click", resetCourses);

  const openRegBtns = [
    document.getElementById("openRegistrationBtn"),
    document.getElementById("openRegistrationBtnInput"),
    ...document.querySelectorAll(".courses-quick-btn")
  ];
  openRegBtns.forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", () => {
        openQuickLink(COURSE_URL);
      });
    }
  });

  // Account buttons
  if (accountSelect)
    accountSelect.addEventListener("change", onAccountSelectChange);
  if (addAccountBtn)
    addAccountBtn.addEventListener("click", addNewAccountClick);
  if (deleteAccountBtn)
    deleteAccountBtn.addEventListener("click", deleteAccountClick);

  initCustomLinks();
}

async function pasteAnswers() {
  try {
    const text = await navigator.clipboard.readText();
    if (!text.trim()) {
      setStatus(autoQuizStatus, "Clipboard trống.", "err");
      return;
    }
    answersInput.value = text;
    saveAnswers(text);
    setStatus(autoQuizStatus, "Đã dán đáp án từ clipboard.", "ok");
  } catch (error) {
    setStatus(
      autoQuizStatus,
      "Không thể đọc clipboard. Hãy dán bằng Ctrl+V / Cmd+V.",
      "err",
    );
  }
}

function clearAnswers() {
  answersInput.value = "";
  saveAnswers("");
  setStatus(autoQuizStatus, "Đã xoá đáp án.", "ok");
}

async function runAutoQuiz() {
  const rawAnswers = answersInput.value.trim();
  const delay = Number(delayInput.value) || 80;
  if (!rawAnswers) {
    setStatus(autoQuizStatus, "Vui lòng nhập đáp án.", "err");
    return;
  }
  setStatus(autoQuizStatus, "Đang chạy chọn đáp án...");
  try {
    saveAnswers(rawAnswers);
    const result = await runInCurrentTab(autoQuizScript, [rawAnswers, delay]);
    if (!result) {
      setStatus(autoQuizStatus, "Không tìm thấy câu hỏi trắc nghiệm.", "err");
      return;
    }
    const { matched, total } = result;
    setStatus(
      autoQuizStatus,
      `Đã chọn ${matched}/${total} câu hỏi trắc nghiệm.`,
      "ok",
    );
  } catch (error) {
    setStatus(autoQuizStatus, error.message, "err");
  }
}

function updateAutoEvalButtonUi(enabled) {
  const autoBtn = document.getElementById("autoTeacherEval");
  if (!autoBtn) return;
  if (enabled) {
    autoBtn.classList.remove("pink");
    autoBtn.classList.add("green");
    autoBtn.textContent = "BẬT TỰ ĐỘNG ĐÁNH GIÁ (1)";
  } else {
    autoBtn.classList.remove("green");
    autoBtn.classList.add("pink");
    autoBtn.textContent = "TẮT TỰ ĐỘNG ĐÁNH GIÁ (1)";
  }
}

async function runAutoTeacherEval() {
  chrome.storage.local.get(["autoTeacherEvalEnabled"], async (data) => {
    const currentState = !!data.autoTeacherEvalEnabled;
    const newState = !currentState;
    chrome.storage.local.set({ autoTeacherEvalEnabled: newState }, async () => {
      updateAutoEvalButtonUi(newState);
      if (newState) {
        setStatus(teacherStatus, "Đang chạy đánh giá tự động (Mức 1)...");
        try {
          const result = await runInCurrentTab(teacherEvalScript, [1], {
            allFrames: true,
          });
          if (!result) {
            setStatus(
              teacherStatus,
              "Đã bật tự động. Không tìm thấy form đánh giá trên trang hiện tại.",
              "ok",
            );
            return;
          }
          setStatus(
            teacherStatus,
            `Đã tự động đánh giá: ${result.radioCount} câu radio, điền ${result.textCount} ô nhận xét.`,
            "ok",
          );
        } catch (error) {
          setStatus(teacherStatus, `Đã bật tự động: ${error.message}`, "ok");
        }
      } else {
        setStatus(teacherStatus, "Đã tắt tính năng tự động đánh giá.", "ok");
      }
    });
  });
}

async function runTeacherEval(event) {
  const level = Number(event.currentTarget.dataset.level || event.currentTarget.dataset.evalLevel || 1);
  setStatus(teacherStatus, `Đang đánh giá theo mức ${level}...`);
  try {
    const result = await runInCurrentTab(teacherEvalScript, [level], {
      allFrames: true,
    });
    if (!result) {
      setStatus(teacherStatus, "Không tìm thấy form đánh giá giảng viên.", "err");
      return;
    }
    const { radioCount, textCount } = result;
    setStatus(
      teacherStatus,
      `Đã đánh giá mức ${level}: tick ${radioCount} radio, điền ${textCount} nhận xét.`,
      "ok",
    );
  } catch (error) {
    setStatus(teacherStatus, error.message, "err");
  }
}

function saveCredentials() {
  const user = usernameInput.value.trim();
  const pass = passwordInput.value.trim();
  const autoReload = !!autoReloadInput?.checked;

  if (user.toLowerCase() === "undefined" || user.toLowerCase() === "null") {
    setStatus(settingsStatus, "Tên đăng nhập không hợp lệ.", "err");
    return;
  }

  chrome.storage.local.get(["accounts"], (data) => {
    let accounts = sanitizeAccounts(data.accounts || []);
    if (user && pass) {
      const existingIdx = accounts.findIndex((a) => a.username === user);
      if (existingIdx >= 0) {
        accounts[existingIdx].password = pass;
      } else {
        accounts.push({ username: user, password: pass });
      }
    }
    chrome.storage.local.set(
      {
        accounts,
        activeUser: user,
        username: user,
        password: pass,
        myDtuUser: user,
        myDtuPass: pass,
        autoReload,
        autoReloadEnabled: autoReload,
      },
      () => {
        renderAccountSelect(accounts, user);
        if (deleteAccountBtn) {
          deleteAccountBtn.style.display = user ? "flex" : "none";
        }
        setStatus(settingsStatus, "Đã lưu cài đặt!", "ok");
      },
    );
  });
}

function togglePasswordVisibility() {
  const textEl = document.getElementById("togglePasswordText");
  const signEl = document.getElementById("togglePasswordSign");
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  if (textEl) {
    textEl.textContent = isPassword ? "Ẩn" : "Hiện";
  }
  if (signEl) {
    if (isPassword) {
      signEl.innerHTML = '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/><path d="M11.297 9.174a3.5 3.5 0 0 0-4.47-4.47l.802.802a2.5 2.5 0 0 1 2.866 2.866zm-5.066-5.066a7 7 0 0 0-5.12 3.892s3 5.5 8 5.5a7 7 0 0 0 3.657-.962l.745.745a8 8 0 0 1-4.402 1.217C3.079 14.5 0 8 0 8a13 13 0 0 1 3.172-4.992z"/><path d="M13.646 14.354l-12-12 .708-.708 12 12z"/></svg>';
    } else {
      signEl.innerHTML = '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/></svg>';
    }
  }
}

function loadState() {
  chrome.storage.local.get(
    [
      "answers",
      "username",
      "password",
      "myDtuUser",
      "myDtuPass",
      "accounts",
      "activeUser",
      "autoReload",
      "autoReloadEnabled",
      "extensionEnabled",
      "customCourses",
      "successCourses",
      "clickedCourses",
      "autoTeacherEvalEnabled",
      "autoEvalEnabled",
      "note",
      "customLinks",
    ],
    (data) => {
      if (typeof data.answers === "string") {
        answersInput.value = data.answers || DEFAULT_ANSWERS;
      } else {
        answersInput.value = DEFAULT_ANSWERS;
      }

      let rawAccounts = data.accounts;
      let accounts = sanitizeAccounts(rawAccounts);
      let activeUser = (data.activeUser || data.username || data.myDtuUser || "").toString().trim();
      if (activeUser.toLowerCase() === "undefined" || activeUser.toLowerCase() === "null") {
        activeUser = "";
      }
      let username = (data.username || data.myDtuUser || "").toString().trim();
      if (username.toLowerCase() === "undefined" || username.toLowerCase() === "null") {
        username = "";
      }
      let password = (data.password || data.myDtuPass || "").toString().trim();
      if (password.toLowerCase() === "undefined" || password.toLowerCase() === "null") {
        password = "";
      }

      // Automatically clean up corrupted storage if needed
      const needsCleanup =
        (Array.isArray(rawAccounts) && rawAccounts.length !== accounts.length) ||
        data.activeUser !== activeUser ||
        data.username !== username ||
        data.password !== password;

      if (needsCleanup) {
        chrome.storage.local.set({
          accounts,
          activeUser,
          username,
          password,
          myDtuUser: username,
          myDtuPass: password,
        });
      }

      renderAccountSelect(accounts, activeUser);
      if (activeUser) {
        const found = accounts.find((a) => a.username === activeUser);
        if (found) {
          usernameInput.value = found.username || "";
          passwordInput.value = found.password || "";
        } else {
          usernameInput.value = username;
          passwordInput.value = password;
        }
        if (deleteAccountBtn) deleteAccountBtn.style.display = "flex";
      } else {
        usernameInput.value = username;
        passwordInput.value = password;
        if (deleteAccountBtn) {
          deleteAccountBtn.style.display = username ? "flex" : "none";
        }
      }
      if (autoReloadInput) {
        autoReloadInput.checked = !!(data.autoReload ?? data.autoReloadEnabled);
      }
      const noteInput = document.getElementById("noteInput");
      if (noteInput && data.note !== undefined) {
        noteInput.value = data.note;
      }
      const extensionToggle = document.getElementById("extensionToggle");
      if (extensionToggle) {
        extensionToggle.checked = data.extensionEnabled !== false;
      }
      const codes = data.customCourses || [];
      renderCoursesUi(codes, data.successCourses || [], data.clickedCourses || []);
      updateAutoEvalButtonUi(!!(data.autoTeacherEvalEnabled ?? data.autoEvalEnabled));
      const customLinks = data.customLinks || [];
      renderCustomLinks(customLinks);
    },
  );
}

function renderCoursesUi(codes, successCourses = [], clickedCourses = []) {
  if (!coursesInputSection || !coursesListSection || !coursesGrid) return;
  if (!codes || codes.length === 0) {
    coursesInputSection.style.display = "block";
    coursesListSection.style.display = "none";
    if (courseCodesTextarea) courseCodesTextarea.value = "";
    coursesGrid.innerHTML = "";
    return;
  }
  coursesInputSection.style.display = "none";
  coursesListSection.style.display = "block";
  coursesGrid.innerHTML = "";

  codes.forEach((code) => {
    const item = document.createElement("div");
    const isSuccess = successCourses.includes(code);
    const isClicked = clickedCourses.includes(code);
    let stateClass = "";
    if (isSuccess) stateClass = "success";
    else if (isClicked) stateClass = "clicked";

    item.className = `course-item ${stateClass}`;
    item.innerHTML = `
      <div class="course-code">${code}</div>
      <div class="course-actions">
        <button class="course-btn-fill" title="Điền mã và gửi captcha">Điền mã</button>
        <button class="course-btn-del" title="Xóa môn này">×</button>
      </div>
    `;

    const fillBtn = item.querySelector(".course-btn-fill");
    fillBtn.addEventListener("click", () => {
      runSingleCourseFill(code);
    });

    const delBtn = item.querySelector(".course-btn-del");
    delBtn.addEventListener("click", () => {
      removeSingleCourse(code);
    });

    coursesGrid.appendChild(item);
  });
}

function removeSingleCourse(code) {
  chrome.storage.local.get(
    ["customCourses", "successCourses", "clickedCourses"],
    (data) => {
      let codes = data.customCourses || [];
      let success = data.successCourses || [];
      let clicked = data.clickedCourses || [];

      codes = codes.filter((c) => c !== code);
      success = success.filter((c) => c !== code);
      clicked = clicked.filter((c) => c !== code);

      chrome.storage.local.set(
        {
          customCourses: codes,
          successCourses: success,
          clickedCourses: clicked,
        },
        () => {
          renderCoursesUi(codes, success, clicked);
          setStatus(coursesStatus, `Đã xóa mã môn: ${code}`, "ok");
        },
      );
    },
  );
}

function saveCourses() {
  if (!courseCodesTextarea) return;
  const rawText = courseCodesTextarea.value.trim();
  if (!rawText) {
    setStatus(coursesStatus, "Vui lòng nhập ít nhất 1 mã môn học.", "err");
    return;
  }
  const codes = rawText
    .split(/[\n,;]+/)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  const uniqueCodes = [...new Set(codes)];
  chrome.storage.local.set(
    {
      customCourses: uniqueCodes,
      successCourses: [],
      clickedCourses: [],
    },
    () => {
      renderCoursesUi(uniqueCodes, [], []);
      setStatus(coursesStatus, `Đã lưu ${uniqueCodes.length} môn học!`, "ok");
    },
  );
}

function resetCourses() {
  chrome.storage.local.set(
    {
      customCourses: [],
      successCourses: [],
      clickedCourses: [],
    },
    () => {
      renderCoursesUi([], [], []);
      setStatus(coursesStatus, "Đã xóa toàn bộ danh sách môn học.", "ok");
    },
  );
}

async function runSingleCourseFill(code) {
  setStatus(coursesStatus, `Đang xử lý môn: ${code}...`);
  try {
    const tab = await getCurrentTab();
    if (!tab || !tab.url || !tab.url.includes("mydtu.duytan.edu.vn")) {
      setStatus(
        coursesStatus,
        "Vui lòng mở tab Đăng ký môn học của MyDTU trước khi nhấn Điền mã.",
        "err",
      );
      return;
    }
    const result = await runInCurrentTab(fillSingleCourseCodeScript, [code], {
      allFrames: true,
    });
    if (result && result.success) {
      chrome.storage.local.get(["clickedCourses"], (data) => {
        const clicked = data.clickedCourses || [];
        if (!clicked.includes(code)) {
          clicked.push(code);
          chrome.storage.local.set({ clickedCourses: clicked });
        }
      });
      setStatus(coursesStatus, `Đã điền mã môn: ${code}`, "ok");
    } else {
      setStatus(
        coursesStatus,
        result?.message || "Không tìm thấy ô nhập mã môn trên trang này.",
        "err",
      );
    }
  } catch (err) {
    setStatus(coursesStatus, err.message, "err");
  }
}

function fillSingleCourseCodeScript(code) {
  const SELECTORS = [
    "#txtSubjectCode",
    "#txtMaMH",
    "#txtCourseCode",
    'input[name*="SubjectCode"]',
    'input[name*="MaMH"]',
    'input[name*="CourseCode"]',
    'input[id*="SubjectCode"]',
    'input[id*="MaMH"]',
  ];

  let targetInput = document.getElementById(
    "ctl00_PlaceHolderMain_txtMaMonHoc",
  );
  if (!targetInput) {
    for (const s of SELECTORS) {
      const el = document.querySelector(s);
      if (el) {
        targetInput = el;
        break;
      }
    }
  }

  if (!targetInput) {
    const allInputs = Array.from(document.querySelectorAll("input[type=text]"));
    targetInput = allInputs.find(
      (input) =>
        (input.name && /mamon|subjectcode|coursecode/i.test(input.name)) ||
        (input.id && /mamon|subjectcode|coursecode/i.test(input.id)),
    );
  }

  if (!targetInput) {
    return {
      success: false,
      message: "Không tìm thấy ô nhập mã môn trên trang này.",
    };
  }

  targetInput.value = code;
  targetInput.dispatchEvent(new Event("input", { bubbles: true }));
  targetInput.dispatchEvent(new Event("change", { bubbles: true }));

  let submitBtn =
    document.getElementById("ctl00_PlaceHolderMain_btnTimKiem") ||
    document.getElementById("ctl00_PlaceHolderMain_btnFilter") ||
    document.getElementById("btnTimKiem") ||
    document.getElementById("btnFilter");

  if (!submitBtn) {
    const buttons = Array.from(
      document.querySelectorAll("input[type=submit], button"),
    );
    submitBtn = buttons.find((b) =>
      /tìm kiếm|filter|search|chọn|đăng ký/i.test(
        b.value || b.textContent || "",
      ),
    );
  }

  if (submitBtn) {
    submitBtn.focus();
  }

  const captchaInput = document.getElementById(
    "ctl00_PlaceHolderMain_txtCaptcha",
  );
  if (captchaInput && submitBtn) {
    function checkAndSubmit() {
      if (captchaInput.value && captchaInput.value.trim().length >= 4) {
        submitBtn.click();
      } else {
        setTimeout(checkAndSubmit, 200);
      }
    }
    checkAndSubmit();
  }

  return { success: true };
}

async function autoQuizScript(rawAnswers, DELAY_MS) {
  function parseAnswers(text) {
    const map = new Map();
    const regex = /(\d+)[\s.:\-_–—\)]*([A-Da-d])/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      map.set(parseInt(match[1], 10), match[2].toUpperCase());
    }
    return map;
  }

  const answerMap = parseAnswers(rawAnswers);
  if (answerMap.size === 0) return null;

  const letterIndex = { A: 0, B: 1, C: 2, D: 3 };
  let matched = 0;
  const questionBlocks = document.querySelectorAll(
    ".que, .question, .form-group, .quiz-question, [class*='question-']",
  );

  if (questionBlocks.length > 0) {
    for (const [qNum, ansChar] of answerMap.entries()) {
      for (const block of questionBlocks) {
        const text = block.textContent || "";
        const numMatch = text.match(/(?:câu|question)\s*(\d+)/i);
        if (numMatch && parseInt(numMatch[1], 10) === qNum) {
          const radios = block.querySelectorAll("input[type=radio]");
          const idx = letterIndex[ansChar];
          if (radios[idx]) {
            radios[idx].click();
            radios[idx].checked = true;
            radios[idx].dispatchEvent(new Event("change", { bubbles: true }));
            matched++;
            if (DELAY_MS > 0) {
              await new Promise((r) => setTimeout(r, DELAY_MS));
            }
          }
          break;
        }
      }
    }
  }

  if (matched === 0) {
    for (const [qNum, ansChar] of answerMap.entries()) {
      const idx = letterIndex[ansChar];
      const directRadio = document.querySelector(
        `input[type=radio][name*="question_${qNum}"][value="${idx}"], input[type=radio][name*="q${qNum}"][value="${idx}"]`,
      );
      if (directRadio) {
        directRadio.click();
        directRadio.checked = true;
        directRadio.dispatchEvent(new Event("change", { bubbles: true }));
        matched++;
        if (DELAY_MS > 0) {
          await new Promise((r) => setTimeout(r, DELAY_MS));
        }
      }
    }
  }

  return { matched, total: answerMap.size };
}

function teacherEvalScript(level) {
  const COMMENTS = {
    1: [
      "Giảng viên dạy rất dễ hiểu, nhiệt tình hỗ trợ sinh viên.",
      "Thầy cô truyền đạt kiến thức rõ ràng, tạo hứng thú học tập.",
      "Phương pháp giảng dạy sinh động, giải đáp thắc mắc kịp thời.",
      "Tài liệu đầy đủ, giảng viên tâm huyết và trách nhiệm.",
      "Rất hài lòng với phương pháp giảng dạy của giảng viên.",
    ],
    2: [
      "Giảng viên dạy tốt, tài liệu đầy đủ.",
      "Thầy cô nhiệt tình, giải thích rõ các nội dung trọng tâm.",
      "Bài giảng chi tiết, tương tác với sinh viên tốt.",
      "Nội dung môn học được truyền tải đầy đủ, đúng tiến độ.",
    ],
    3: [
      "Giảng viên dạy ổn, nắm vững kiến thức chuyên môn.",
      "Truyền đạt kiến thức ở mức khá, đáp ứng yêu cầu môn học.",
      "Giờ học diễn ra đúng giờ, nội dung cơ bản rõ ràng.",
    ],
    4: [
      "Bài giảng còn hơi nhanh, mong thầy cô giảng chậm lại một chút.",
      "Cần tăng cường thêm ví dụ thực tế trong các buổi học.",
      "Nội dung lý thuyết nhiều, mong có thêm thời gian thảo luận.",
    ],
    5: [
      "Giảng viên cần tương tác nhiều hơn với sinh viên trong lớp.",
      "Nội dung truyền đạt hơi khó tiếp thu, cần cải thiện phương pháp.",
      "Mong thầy cô cập nhật thêm tài liệu tham khảo phong phú hơn.",
    ],
    6: [
      "Phương pháp giảng dạy cần được đổi mới để sinh viên dễ hiểu hơn.",
      "Tốc độ dạy quá nhanh, sinh viên khó theo kịp bài học.",
      "Cần hỗ trợ giải đáp thắc mắc của sinh viên nhiều hơn.",
    ],
  };

  const pool = COMMENTS[level] || COMMENTS[1];
  const getRandomComment = () => pool[Math.floor(Math.random() * pool.length)];

  let radioCount = 0;
  const groups = new Map();
  document.querySelectorAll("input[type=radio]").forEach((radio) => {
    const name = radio.name;
    if (!name) return;
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push(radio);
  });

  const radioIndexMap = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 };
  const targetIdx = radioIndexMap[level] ?? 0;

  for (const [, radios] of groups) {
    const targetRadio = radios[targetIdx] || radios[0];
    if (targetRadio && !targetRadio.disabled) {
      targetRadio.click();
      targetRadio.checked = true;
      targetRadio.dispatchEvent(new Event("change", { bubbles: true }));
      radioCount++;
    }
  }

  let textCount = 0;
  document
    .querySelectorAll(
      "textarea, input[type=text]:not([readonly]):not([disabled])",
    )
    .forEach((el) => {
      if (el.offsetParent === null) return;
      if (el.value.trim() !== "") return;
      el.value = getRandomComment();
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      textCount++;
    });

  const dtuTeacherFields = [
    "ctl00_PlaceHolderMain_txtYKienKhac",
    "ctl00_PlaceHolderMain_txtNhanXet",
    "ctl00_PlaceHolderMain_txtGopY",
    "txtYKienKhac",
    "txtNhanXet",
    "txtGopY",
  ];

  function setElementValue(element, value) {
    if (!element) return false;
    element.focus();
    element.value = value;
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
    element.blur();
    return true;
  }

  dtuTeacherFields.forEach((id) => {
    const field =
      document.getElementById(id) || document.querySelector(`[name="${id}"]`);
    if (field && (!field.value || field.value.trim() === "")) {
      const comment = getRandomComment();
      setElementValue(field, comment);
      textCount++;
    }
  });

  return { radioCount, textCount };
}

const colors = ["yellow", "green", "pink", "blue", "purple"];
function renderCustomLinks(links) {
  const existing = document.querySelectorAll(".custom-link-card");
  existing.forEach((el) => el.remove());
  const container = document.getElementById("menuToolList");
  const addBtn = document.getElementById("btnAddCustomLink");
  if (!container || !addBtn) return;
  links.forEach((link, index) => {
    const card = document.createElement("button");
    card.type = "button";
    const color = link.color || colors[index % colors.length];
    card.className = `tool ${color} custom-link-card`;
    card.dataset.url = link.url;
    card.innerHTML = `
      <div class="tool-head">
          <h3 style="word-break: break-all; text-align: left; max-width: 75%;">${link.name}</h3>
          <div class="num">${String(index + 6).padStart(2, "0")}</div>
      </div>
      <p style="word-break: break-all; text-align: left; font-size: 10px; color: var(--text-secondary); padding-right: 32px;">${link.url}</p>
      <button class="delete-link-btn expand-btn expand-red" data-id="${link.id}" type="button" title="Xóa liên kết này">
        <div class="points_wrapper"><i class="point"></i><i class="point"></i><i class="point"></i><i class="point"></i></div>
        <div class="sign">
          <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
          </svg>
        </div>
        <div class="text">Delete</div>
      </button>
    `;
    card.addEventListener("click", (e) => {
      if (e.target.closest(".delete-link-btn")) return;
      openQuickLink(link.url);
    });
    const delBtn = card.querySelector(".delete-link-btn");
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteCustomLink(link.id);
    });
    container.insertBefore(card, addBtn);
  });
}

function initCustomLinks() {
  const addBtn = document.getElementById("btnAddCustomLink");
  const modal = document.getElementById("customLinkModal");
  const cancelBtn = document.getElementById("btnCancelCustomLink");
  const saveBtn = document.getElementById("btnSaveCustomLink");
  const nameInput = document.getElementById("customLinkName");
  const urlInput = document.getElementById("customLinkUrl");
  const statusBox = document.getElementById("menuStatus");
  if (!addBtn) return;
  addBtn.addEventListener("click", () => {
    nameInput.value = "";
    urlInput.value = "";
    modal.style.display = "flex";
    nameInput.focus();
  });
  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
  saveBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    let url = urlInput.value.trim();
    if (!name || !url) {
      if (statusBox) {
        statusBox.textContent = "Vui lòng nhập đầy đủ tên và URL!";
        statusBox.className = "status-box err";
      }
      return;
    }
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
    chrome.storage.local.get(["customLinks"], (data) => {
      const links = data.customLinks || [];
      const newLink = {
        id: "link_" + Date.now(),
        name: name,
        url: url,
        color: colors[links.length % colors.length],
      };
      links.push(newLink);
      chrome.storage.local.set({ customLinks: links }, () => {
        modal.style.display = "none";
        renderCustomLinks(links);
        if (statusBox) {
          statusBox.textContent = `Đã thêm liên kết: ${name}`;
          statusBox.className = "status-box ok";
          setTimeout(() => {
            statusBox.textContent = "Sẵn sàng. Tự động đăng nhập nếu chưa đăng nhập.";
            statusBox.className = "status-box";
          }, 3000);
        }
      });
    });
  });
}

function deleteCustomLink(id) {
  const statusBox = document.getElementById("menuStatus");
  chrome.storage.local.get(["customLinks"], (data) => {
    const links = data.customLinks || [];
    const updated = links.filter((l) => l.id !== id);
    chrome.storage.local.set({ customLinks: updated }, () => {
      renderCustomLinks(updated);
      if (statusBox) {
        statusBox.textContent = "Đã xóa liên kết thành công.";
        statusBox.className = "status-box ok";
        setTimeout(() => {
          statusBox.textContent = "Sẵn sàng. Tự động đăng nhập nếu chưa đăng nhập.";
          statusBox.className = "status-box";
        }, 3000);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindUi();
  loadState();
});
if (document.readyState === "complete" || document.readyState === "interactive") {
  bindUi();
  loadState();
}



// =============================================================================
// TWISTING RIBBON BACKGROUND ENGINE (Fluid Multi-Wave & Dynamic Normals)
// =============================================================================
class TwistingRibbonEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.segments = 400;
    this.waveSpeed = 0.018;
    this.waveAmplitude = 1.0;
    this.twistCycles = 6;

    // Dimensions
    this.RIBBON_HALF_W = 16;
    this.RIBBON_X_SCALE = 1.4;
    this.RIBBON_X_OFFSET = 0.2;

    // Wave / motion
    this.WAVE1_FREQ = 3.5;
    this.WAVE1_TIME_SPEED = 0.7;
    this.WAVE1_AMP = 110 * this.waveAmplitude;
    this.WAVE2_FREQ = 7.0;
    this.WAVE2_TIME_SPEED = 1.1;
    this.WAVE2_AMP = 30 * this.waveAmplitude;

    this.TWIST_TIME_SPEED = 0.5;

    // Color palette
    this.L_COLOR_FACE = [255, 60, 10];      // Vibrant orange-red
    this.L_COLOR_FOLD_A = [180, 255, 0];    // Lime
    this.L_COLOR_FOLD_B = [60, 80, 255];    // Royal blue
    this.L_COLOR_FOLD_C = [0, 220, 255];    // Cyan
    this.L_SHADOW_COLOR = [80, 60, 40];
    this.L_SHADOW_ALPHA = 16 / 255;
    this.L_EDGE_COLOR = [0, 0, 0];
    this.L_EDGE_ALPHA = 22 / 255;

    this.COLOR_CYCLE_FREQ = 2.0;
    this.COLOR_CYCLE_SPEED = 0.3;
    this.FACE_BLEND_GAMMA = 1.2;

    this.SHADOW_OFFSET_X = 4;
    this.SHADOW_OFFSET_Y = 7;
    this.EDGE_MIN_TWIST = 0.08;
    this.EDGE_WEIGHT = 0.5;

    this.t = 0;

    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth || 360;
    this.height = window.innerHeight || 600;
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.height * dpr);
    this.dpr = dpr;
  }

  lerpColor(a, b, f) {
    return [
      Math.round(a[0] + (b[0] - a[0]) * f),
      Math.round(a[1] + (b[1] - a[1]) * f),
      Math.round(a[2] + (b[2] - a[2]) * f),
    ];
  }

  buildSpine(time) {
    const pts = [];
    const segments = this.segments;
    const w = this.width;
    const h = this.height;
    for (let i = 0; i <= segments; i++) {
      const progress = i / segments;
      pts.push({
        x: progress * w * this.RIBBON_X_SCALE - w * this.RIBBON_X_OFFSET,
        y:
          h / 2 +
          Math.sin(progress * Math.PI * this.WAVE1_FREQ + time * this.WAVE1_TIME_SPEED) * this.WAVE1_AMP +
          Math.sin(progress * Math.PI * this.WAVE2_FREQ + time * this.WAVE2_TIME_SPEED) * this.WAVE2_AMP,
      });
    }
    return pts;
  }

  buildNormals(pts) {
    const last = pts.length - 1;
    return pts.map((_, i) => {
      const dx =
        i === 0
          ? pts[1].x - pts[0].x
          : i === last
          ? pts[last].x - pts[last - 1].x
          : pts[i + 1].x - pts[i - 1].x;
      const dy =
        i === 0
          ? pts[1].y - pts[0].y
          : i === last
          ? pts[last].y - pts[last - 1].y
          : pts[i + 1].y - pts[i - 1].y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      return { nx: -dy / len, ny: dx / len };
    });
  }

  buildEdges(pts, normals, time) {
    const tops = [];
    const bots = [];
    const twists = [];
    const segments = this.segments;
    for (let i = 0; i <= segments; i++) {
      const twist = Math.cos(
        (i / segments) * Math.PI * this.twistCycles + time * this.TWIST_TIME_SPEED
      );
      const w = this.RIBBON_HALF_W * Math.abs(twist);
      const sign = twist >= 0 ? 1 : -1;
      twists.push(twist);
      tops.push({
        x: pts[i].x + normals[i].nx * w * sign,
        y: pts[i].y + normals[i].ny * w * sign,
      });
      bots.push({
        x: pts[i].x - normals[i].nx * w * sign,
        y: pts[i].y - normals[i].ny * w * sign,
      });
    }
    return { tops, bots, twists };
  }

  getFoldColor(frac, time) {
    const cycle = (((frac * this.COLOR_CYCLE_FREQ + time * this.COLOR_CYCLE_SPEED) % 1) + 1) % 1;
    const colorA = this.L_COLOR_FOLD_A;
    const colorB = this.L_COLOR_FOLD_B;
    const colorC = this.L_COLOR_FOLD_C;

    if (cycle < 1 / 3) return this.lerpColor(colorA, colorB, cycle * 3);
    if (cycle < 2 / 3) return this.lerpColor(colorB, colorC, (cycle - 1 / 3) * 3);
    return this.lerpColor(colorC, colorA, (cycle - 2 / 3) * 3);
  }

  getRibbonColor(frac, twist, time) {
    const foldColor = this.getFoldColor(frac, time);
    const faceColor = this.L_COLOR_FACE;
    const facedness = Math.pow(Math.abs(twist), this.FACE_BLEND_GAMMA);
    return this.lerpColor(foldColor, faceColor, facedness);
  }

  drawQuad(ctx, dpr, ax, ay, bx, by, cx, cy, dx, dy) {
    ctx.beginPath();
    ctx.moveTo(ax * dpr, ay * dpr);
    ctx.lineTo(bx * dpr, by * dpr);
    ctx.lineTo(cx * dpr, cy * dpr);
    ctx.lineTo(dx * dpr, dy * dpr);
    ctx.closePath();
    ctx.fill();
  }

  drawShadow(ctx, dpr, tops, bots) {
    const color = this.L_SHADOW_COLOR;
    const alpha = this.L_SHADOW_ALPHA;
    ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
    const segs = this.segments;
    for (let i = 0; i < segs; i++) {
      this.drawQuad(
        ctx,
        dpr,
        tops[i].x + this.SHADOW_OFFSET_X,
        tops[i].y + this.SHADOW_OFFSET_Y,
        tops[i + 1].x + this.SHADOW_OFFSET_X,
        tops[i + 1].y + this.SHADOW_OFFSET_Y,
        bots[i + 1].x + this.SHADOW_OFFSET_X,
        bots[i + 1].y + this.SHADOW_OFFSET_Y,
        bots[i].x + this.SHADOW_OFFSET_X,
        bots[i].y + this.SHADOW_OFFSET_Y
      );
    }
  }

  drawRibbon(ctx, dpr, tops, bots, twists, time) {
    const edgeColor = this.L_EDGE_COLOR;
    const edgeAlpha = this.L_EDGE_ALPHA;
    const segs = this.segments;

    for (let i = 0; i < segs; i++) {
      const [r, g, b] = this.getRibbonColor(i / segs, twists[i], time);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      this.drawQuad(
        ctx,
        dpr,
        tops[i].x,
        tops[i].y,
        tops[i + 1].x,
        tops[i + 1].y,
        bots[i + 1].x,
        bots[i + 1].y,
        bots[i].x,
        bots[i].y
      );

      if (Math.abs(twists[i]) > this.EDGE_MIN_TWIST) {
        ctx.strokeStyle = `rgba(${edgeColor[0]}, ${edgeColor[1]}, ${edgeColor[2]}, ${edgeAlpha})`;
        ctx.lineWidth = this.EDGE_WEIGHT * dpr;

        ctx.beginPath();
        ctx.moveTo(tops[i].x * dpr, tops[i].y * dpr);
        ctx.lineTo(tops[i + 1].x * dpr, tops[i + 1].y * dpr);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(bots[i].x * dpr, bots[i].y * dpr);
        ctx.lineTo(bots[i + 1].x * dpr, bots[i + 1].y * dpr);
        ctx.stroke();
      }
    }
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    if (w === 0 || h === 0) return;

    ctx.clearRect(0, 0, w, h);
    this.t += this.waveSpeed;

    const pts = this.buildSpine(this.t);
    const normals = this.buildNormals(pts);
    const { tops, bots, twists } = this.buildEdges(pts, normals, this.t);

    this.drawShadow(ctx, this.dpr, tops, bots);
    this.drawRibbon(ctx, this.dpr, tops, bots, twists, this.t);
  }
}

let ribbonEngine = null;
let ribbonAnimId = null;

function initTwistingRibbon() {
  const canvas = document.getElementById("bgWaveCanvas");
  if (!canvas) return;
  ribbonEngine = new TwistingRibbonEngine(canvas);

  function loop() {
    if (ribbonEngine) ribbonEngine.render();
    ribbonAnimId = requestAnimationFrame(loop);
  }

  if (ribbonAnimId) cancelAnimationFrame(ribbonAnimId);
  ribbonAnimId = requestAnimationFrame(loop);
}
