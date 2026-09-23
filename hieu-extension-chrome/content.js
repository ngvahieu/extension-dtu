(function() {
    'use strict';

    console.log('[Hieu Captcha] Content script đã bắt đầu hoạt động trên trang.');

    // Mã nguồn đánh giá giảng viên (đồng bộ với v.js)
    function teacherEvalScript(level) {
        if (!Number.isInteger(level) || level < 1 || level > 6) {
            return { ok: false, message: 'Mức đánh giá phải là số từ 1 đến 6.' };
        }
        const randomPick = arr => arr[Math.floor(Math.random() * arr.length)];
        const textBank = {
            R48: {
                1: ['Giảng viên dạy dễ hiểu, tương tác ổn, học không bị áp lực quá.', 'Thầy/cô truyền đạt rõ, ví dụ thực tế nên em tiếp thu khá nhanh.', 'Giảng viên nhiệt tình, hỗ trợ sinh viên tốt, vibe lớp học khá thoải mái.'],
                2: ['Giảng viên dạy ổn, nội dung dễ nắm nhưng đôi lúc hơi nhanh.', 'Cách dạy khá dễ hiểu, nếu thêm nhiều ví dụ thực tế hơn sẽ tốt hơn.', 'Nhìn chung giảng viên ổn áp, có trách nhiệm với môn học.'],
                3: ['Giảng viên dạy ở mức ổn, nhưng một số phần em thấy hơi khó theo kịp.', 'Nội dung truyền đạt đủ ý, nhưng tiết học đôi lúc chưa cuốn lắm.', 'Em hiểu được bài cơ bản, nhưng mong giảng viên giải thích chậm hơn ở phần khó.'],
                4: ['Một số buổi học em thấy hơi khó hiểu, cần giảng kỹ hơn.', 'Giảng viên có dạy đầy đủ nhưng cách truyền đạt chưa thật sự dễ tiếp thu.', 'Em mong giảng viên tương tác nhiều hơn để lớp dễ theo bài hơn.'],
                5: ['Em thấy cách giảng còn hơi khó nắm, nhiều phần cần tự tìm hiểu thêm.', 'Tiết học chưa tạo được nhiều hứng thú, mong cải thiện cách truyền đạt.', 'Em hơi khó theo kịp bài, nhất là các phần kiến thức trọng tâm.'],
                6: ['Em cảm thấy môn học chưa được truyền đạt rõ ràng, cần cải thiện nhiều hơn.', 'Cách dạy hiện tại khiến sinh viên khá khó tiếp thu nội dung.', 'Em mong giảng viên chuẩn bị bài và hỗ trợ sinh viên tốt hơn trong quá trình học.']
            },
            R49: {
                1: ['Các phòng ban hỗ trợ sinh viên khá nhanh, thái độ thân thiện và rõ ràng.', 'Em thấy các đơn vị làm việc chuyên nghiệp, giải quyết vấn đề ổn.', 'Nhân viên các phòng ban nhiệt tình, hướng dẫn dễ hiểu, không bị rối.'],
                2: ['Nhìn chung các đơn vị hỗ trợ tốt, đôi lúc hơi đông nên chờ lâu.', 'Các phòng ban làm việc khá ổn, nếu phản hồi nhanh hơn thì perfect hơn.', 'Em thấy dịch vụ khá tốt, thủ tục tương đối rõ ràng.'],
                3: ['Các đơn vị hỗ trợ ở mức ổn, nhưng có lúc thông tin chưa thật sự thống nhất.', 'Thái độ phục vụ bình thường, thủ tục đôi khi còn hơi mất thời gian.', 'Em được hỗ trợ khi cần, nhưng quy trình nên đơn giản hơn.'],
                4: ['Một số phòng ban phản hồi còn chậm, sinh viên phải hỏi lại nhiều lần.', 'Thủ tục đôi khi hơi rườm rà, mong được hướng dẫn rõ hơn.', 'Em thấy việc hỗ trợ chưa đồng đều giữa các bộ phận.'],
                5: ['Quá trình xử lý vấn đề còn chậm, gây mất thời gian cho sinh viên.', 'Một số bộ phận hướng dẫn chưa rõ, sinh viên dễ bị nhầm.', 'Em mong các đơn vị cải thiện thái độ và tốc độ hỗ trợ.'],
                6: ['Em thấy việc hỗ trợ sinh viên chưa tốt, cần cải thiện nhiều về quy trình.', 'Một số trải nghiệm chưa ổn, phản hồi chậm và chưa thật sự nhiệt tình.', 'Các đơn vị nên cải thiện cách giao tiếp và xử lý yêu cầu cho sinh viên.']
            },
            R50: {
                1: ['Phòng học và phòng thực hành khá sạch, thiết bị ổn, học tập thoải mái.', 'Cơ sở vật chất tốt, máy móc đáp ứng được nhu cầu học tập.', 'Không gian học ổn áp, ánh sáng và thiết bị nhìn chung rất ok.'],
                2: ['Phòng học khá ổn, chỉ cần nâng cấp thêm một số thiết bị cũ.', 'Cơ sở vật chất đáp ứng được việc học, đôi lúc máy hơi chậm.', 'Phòng thực hành dùng được tốt, nếu bảo trì thường xuyên hơn sẽ ngon hơn.'],
                3: ['Phòng học ở mức tạm ổn, nhưng một số thiết bị chưa thật sự tốt.', 'Máy móc phục vụ học tập được, nhưng đôi khi hoạt động chưa mượt.', 'Không gian học bình thường, cần cải thiện thêm về thiết bị và mạng.'],
                4: ['Một số phòng thực hành còn thiếu thiết bị hoặc máy chạy khá chậm.', 'Cơ sở vật chất chưa đồng đều, có phòng học ổn nhưng có phòng còn hạn chế.', 'Em mong trường nâng cấp phòng thực hành để học hiệu quả hơn.'],
                5: ['Nhiều thiết bị chưa đáp ứng tốt nhu cầu học tập, nhất là giờ thực hành.', 'Phòng học cần được bảo trì thường xuyên hơn vì có thiết bị hay lỗi.', 'Điều kiện thực hành còn hạn chế, làm bài đôi lúc bị gián đoạn.'],
                6: ['Phòng học và thiết bị chưa đảm bảo tốt cho việc học, cần nâng cấp nhiều.', 'Máy móc hoạt động không ổn định, ảnh hưởng đến trải nghiệm học tập.', 'Cơ sở vật chất hiện tại chưa đáp ứng tốt, mong nhà trường cải thiện sớm.']
            },
            R51: {
                1: ['Các môn học khá sát ngành, có tính ứng dụng và giúp em định hướng nghề nghiệp.', 'Chương trình đào tạo ổn, kiến thức nền và chuyên ngành được phân bổ hợp lý.', 'Môn học thực tế, hỗ trợ tốt cho kỹ năng và công việc sau này.'],
                2: ['Các môn học khá phù hợp, nhưng nên tăng thêm phần thực hành thực tế.', 'Chương trình học ổn, nếu cập nhật thêm công nghệ mới sẽ xịn hơn.', 'Kiến thức ngành khá đầy đủ, một số môn cần liên hệ thực tế nhiều hơn.'],
                3: ['Các môn học ở mức ổn, nhưng có môn còn hơi lý thuyết.', 'Chương trình đào tạo đáp ứng cơ bản, nhưng cần tối ưu lại một số học phần.', 'Em học được kiến thức nền, nhưng mong có thêm bài tập thực tế hơn.'],
                4: ['Một số môn học chưa thật sự sát với nhu cầu thực tế của ngành.', 'Chương trình còn hơi nặng lý thuyết, phần thực hành chưa đủ sâu.', 'Em mong các môn chuyên ngành được cập nhật mới và dễ áp dụng hơn.'],
                5: ['Nhiều môn học còn khô và khó áp dụng vào thực tế công việc.', 'Chương trình cần cải thiện vì một số nội dung chưa phù hợp với ngành hiện nay.', 'Em thấy cần tăng thực hành, dự án và kỹ năng nghề nhiều hơn.'],
                6: ['Chương trình học chưa đáp ứng tốt nhu cầu ngành, cần thay đổi nhiều hơn.', 'Một số môn chưa thực sự hữu ích, nội dung còn xa thực tế.', 'Em mong chương trình đào tạo được cập nhật lại để phù hợp với xu hướng nghề nghiệp.']
            }
        };

        function setElementValue(element, value) {
            const proto = element.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
            const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
            if (setter) setter.call(element, value);
            else element.value = value;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
        }

        let textFilled = 0;
        const textReport = [];
        Object.entries(textBank).forEach(([id, bank]) => {
            const field = document.getElementById(id) || document.querySelector(`[name="${id}"]`);
            if (!field) {
                textReport.push({ id, status: 'Không tìm thấy ô nhập' });
                return;
            }
            const value = randomPick(bank[level]);
            setElementValue(field, value);
            textFilled++;
            textReport.push({ id, status: 'Đã nhập', value });
        });

        const letterOrder = ['A', 'B', 'C', 'D', 'E', 'F'];
        const bottomReverseMap = { 1: 5, 2: 4, 3: 3, 4: 2, 5: 1, 6: 1 };
        const groups = [...document.querySelectorAll('input[type="radio"][name^="R"]')].reduce((map, radio) => {
            if (!/^R\d+$/.test(radio.name)) return map;
            if (!map.has(radio.name)) map.set(radio.name, []);
            map.get(radio.name).push(radio);
            return map;
        }, new Map());

        const sortedGroups = [...groups.entries()].sort((a, b) => Number(a[0].slice(1)) - Number(b[0].slice(1)));
        let selected = 0;
        const radioReport = [];

        sortedGroups.forEach(([groupName, radios]) => {
            const sortedRadios = radios.sort((a, b) => {
                const aLetter = a.id.replace(groupName, '');
                const bLetter = b.id.replace(groupName, '');
                return letterOrder.indexOf(aLetter) - letterOrder.indexOf(bLetter);
            });
            const maxOption = sortedRadios.length;
            let finalChoice = groupName === 'R52' ? bottomReverseMap[level] : level;
            finalChoice = Math.min(finalChoice, maxOption);
            const radio = sortedRadios[finalChoice - 1];
            if (!radio) {
                radioReport.push({ group: groupName, status: 'Không tìm thấy lựa chọn' });
                return;
            }
            radio.scrollIntoView({ behavior: 'smooth', block: 'center' });
            radio.checked = true;
            const label = radio.id ? document.querySelector(`label[for="${radio.id}"]`) : null;
            if (label) label.click();
            else radio.click();
            if (typeof window.checkOption === 'function') {
                try {
                    window.checkOption(radio.id);
                } catch (error) {}
            }
            radio.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            radio.dispatchEvent(new Event('input', { bubbles: true }));
            radio.dispatchEvent(new Event('change', { bubbles: true }));
            selected++;
            radioReport.push({ group: groupName, selected: finalChoice, id: radio.id, status: 'Đã chọn' });
        });

        console.log(`[Hieu Captcha - Main World] Đã tự động đánh giá mức ${level}`);
        try {
            sessionStorage.setItem('hieu_eval_active', 'true');
            sessionStorage.setItem('hieu_eval_level', level.toString());
            window.dispatchEvent(new CustomEvent('hieu_eval_triggered', { detail: level }));
        } catch (e) {}
        return { ok: true, textFilled, selected, totalGroups: sortedGroups.length };
    }

    // Hàm chuyển đổi hình ảnh captcha sang Base64 dùng Fetch hoặc Canvas
    async function getBase64Image(imgEl) {
        // Cách 1: Thử dùng Canvas trực tiếp
        try {
            const canvas = document.createElement('canvas');
            canvas.width = imgEl.naturalWidth || imgEl.width || 120;
            canvas.height = imgEl.naturalHeight || imgEl.height || 32;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(imgEl, 0, 0);
            
            const base64 = canvas.toDataURL('image/png');
            if (base64 && base64.startsWith('data:image') && base64.length > 100) {
                console.log('[Hieu Captcha] Trích xuất Base64 thành công từ canvas (Độ dài chuỗi:', base64.length, ')');
                return base64;
            }
        } catch (e) {
            console.warn('[Hieu Captcha] Canvas không lấy được ảnh (có thể do CORS), thử dùng fetch:', e);
        }

        // Cách 2: Thử dùng fetch trực tiếp
        try {
            console.log('[Hieu Captcha] Đang thử tải ảnh qua fetch...', imgEl.src);
            const response = await fetch(imgEl.src, { cache: 'no-cache' });
            if (response.ok) {
                const blob = await response.blob();
                const base64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
                if (base64 && base64.startsWith('data:image')) {
                    console.log('[Hieu Captcha] Trích xuất Base64 thành công bằng fetch (Độ dài chuỗi:', base64.length, ')');
                    return base64;
                }
            }
        } catch (e) {
            console.error('[Hieu Captcha] Lỗi trích xuất Base64 từ ảnh:', e);
            return null;
        }
        return null;
    }

    // Hàm gửi tin nhắn tới Background để giải captcha
    async function solveCaptcha(base64Data) {
        console.log('[Hieu Captcha] Đang gửi yêu cầu giải sang Background Service Worker...');
        const message = {
            action: 'solveCaptcha',
            image: base64Data
        };

        // Thử dùng browser.runtime.sendMessage (Promise-based, chuẩn và ổn định hơn trên Safari)
        if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.sendMessage) {
            try {
                const response = await browser.runtime.sendMessage(message);
                if (response && response.success && response.data && response.data.status === 'success') {
                    return response.data.captcha;
                } else {
                    const errMsg = response ? (response.error || JSON.stringify(response.data)) : 'Không nhận được phản hồi từ background';
                    if (response && response.data && (response.data.status === 'retry' || response.data.status === 'error')) {
                        console.log('[Hieu Captcha] API chưa giải được ảnh captcha, sẽ tải ảnh mới và thử lại.');
                    } else {
                        console.error('[Hieu Captcha] Background báo lỗi giải Captcha (browser):', errMsg);
                    }
                    return null;
                }
            } catch (e) {
                console.warn('[Hieu Captcha] Gửi bằng browser.runtime.sendMessage lỗi, chuyển sang chrome.runtime.sendMessage:', e);
            }
        }

        // Fallback dùng chrome.runtime.sendMessage callback
        return new Promise((resolve) => {
            try {
                chrome.runtime.sendMessage(message, response => {
                    if (chrome.runtime.lastError) {
                        console.error('[Hieu Captcha] Lỗi kết nối Extension Background (chrome):', chrome.runtime.lastError.message);
                        resolve(null);
                        return;
                    }
                    
                    if (response && response.success && response.data && response.data.status === 'success') {
                        resolve(response.data.captcha);
                    } else {
                        const errMsg = response ? (response.error || JSON.stringify(response.data)) : 'Không nhận được phản hồi từ background';
                        if (response && response.data && (response.data.status === 'retry' || response.data.status === 'error')) {
                            console.log('[Hieu Captcha] API chưa giải được ảnh captcha, sẽ tải ảnh mới và thử lại.');
                        } else {
                            console.error('[Hieu Captcha] Background báo lỗi giải Captcha (chrome):', errMsg);
                        }
                        resolve(null);
                    }
                });
            } catch (e) {
                console.error('[Hieu Captcha] Lỗi khi gọi chrome.runtime.sendMessage:', e);
                resolve(null);
            }
        });
    }

    let lastSolvedSrc = '';

    async function refreshCaptchaForRetry() {
        const captchaInput = document.querySelector('input[name="txtCaptcha"], input#txtCaptcha, .txtcaptcha, input[name*="txtCaptcha" i], input[id*="txtCaptcha" i], input[id*="txtCaptchar" i], .textCaptcha');
        const captchaImage = document.querySelector('img[src*="CaptchaImage.axd"], img[id*="CaptchaImage" i], img[src*="captcha" i], #loadCaptchaHere img');
        const oldSrc = captchaImage ? captchaImage.src : '';

        lastSolvedSrc = '';
        if (captchaInput) {
            captchaInput.value = '';
            captchaInput.dispatchEvent(new Event('input', { bubbles: true }));
            captchaInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        if (!captchaImage) {
            await new Promise(resolve => setTimeout(resolve, 800));
            return;
        }

        captchaImage.dataset.solving = 'false';
        try {
            captchaImage.click();
        } catch (error) {}

        await new Promise(resolve => setTimeout(resolve, 700));

        const nextCaptchaImage = document.querySelector('img[src*="CaptchaImage.axd"], img[id*="CaptchaImage" i], img[src*="captcha" i], #loadCaptchaHere img');
        if (nextCaptchaImage && nextCaptchaImage.src === oldSrc) {
            try {
                const retryUrl = new URL(oldSrc, window.location.href);
                retryUrl.searchParams.set('_hieu_captcha_retry', Date.now().toString());
                nextCaptchaImage.src = retryUrl.toString();
            } catch (error) {}
        }

        await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Hàm chính xử lý giải captcha và điền vào form
    async function processCaptcha(force = false) {
        if (window.location.href.toLowerCase().includes('/signin.aspx') && !loginFormPrepared) {
            console.log('[Hieu Captcha] Chờ chọn loại đăng nhập trước khi xử lý captcha...');
            return null;
        }

        const imgCaptcha = document.querySelector('img[src*="CaptchaImage.axd"], img[id*="CaptchaImage" i], img[src*="captcha" i], #loadCaptchaHere img');
        const inputCaptcha = document.querySelector('input[name="txtCaptcha"], input#txtCaptcha, .txtcaptcha, input[name*="txtCaptcha" i], input[id*="txtCaptcha" i], input[id*="txtCaptchar" i], .textCaptcha');

        console.log('[Hieu Captcha] Đang quét phần tử... imgCaptcha:', imgCaptcha ? 'Tìm thấy' : 'Không tìm thấy', '| inputCaptcha:', inputCaptcha ? 'Tìm thấy' : 'Không tìm thấy');

        if (!imgCaptcha || !inputCaptcha) {
            return null;
        }

        if (!imgCaptcha.complete || imgCaptcha.naturalWidth === 0) {
            console.log('[Hieu Captcha] Ảnh captcha chưa tải xong, đợi sự kiện load...');
            imgCaptcha.addEventListener('load', () => processCaptcha(force), { once: true });
            return null;
        }

        if (imgCaptcha.dataset.solving === 'true') {
            console.log('[Hieu Captcha] Tiến trình giải trước đó đang chạy, bỏ qua.');
            return null;
        }
        if (!force && lastSolvedSrc === imgCaptcha.src && inputCaptcha.value.trim().length === 4) {
            console.log('[Hieu Captcha] Ảnh này đã được giải thành công trước đó, bỏ qua.');
            return inputCaptcha.value.trim();
        }

        imgCaptcha.dataset.solving = 'true';
        console.log('[Hieu Captcha] Bắt đầu xử lý giải Captcha cho ảnh:', imgCaptcha.src);

        const base64Image = await getBase64Image(imgCaptcha);
        if (!base64Image) {
            imgCaptcha.dataset.solving = 'false';
            console.log('[Hieu Captcha] Chưa lấy được ảnh captcha, sẽ thử lại bằng ảnh mới.');
            return null;
        }

        const originalPlaceholder = inputCaptcha.placeholder;
        inputCaptcha.placeholder = 'Đang giải captcha...';
        inputCaptcha.disabled = true;

        const captchaResult = await solveCaptcha(base64Image);

        inputCaptcha.disabled = false;
        inputCaptcha.placeholder = originalPlaceholder;
        imgCaptcha.dataset.solving = 'false';

        const normalizedCaptcha = captchaResult
            ? String(captchaResult).replace(/\s+/g, '').toUpperCase()
            : '';

        if (/^[A-Z0-9]{4}$/.test(normalizedCaptcha)) {
            console.log('[Hieu Captcha] Nhận kết quả từ API:', normalizedCaptcha);
            lastSolvedSrc = imgCaptcha.src;
            inputCaptcha.value = normalizedCaptcha;
            inputCaptcha.dispatchEvent(new Event('input', { bubbles: true }));
            inputCaptcha.dispatchEvent(new Event('change', { bubbles: true }));
            if (window.location.href.toLowerCase().includes('/signin.aspx')) {
                captchaRefreshRequired = false;
            }
            console.log('[Hieu Captcha] Đã điền kết quả vào ô nhập.');

            setTimeout(() => {
                const autoCode = document.body.getAttribute('data-auto-registering-code');
                const classIdInput = document.getElementById('ctl00_PlaceHolderContentArea_ctl00_ctl01_txt_ClassID');
                if (autoCode && classIdInput && classIdInput.value.trim() === autoCode) {
                    const regBtn = Array.from(document.querySelectorAll('[onclick]')).find(el => el.getAttribute('onclick')?.includes('Add_Click'))
                      || document.querySelector('input[type="button"][onclick*="Add_Click"]')
                      || document.querySelector('input[type="submit"][value*="Đăng ký" i]')
                      || document.querySelector('input[type="button"][value*="Đăng ký" i]');
                    if (regBtn) {
                        console.log('[Hieu Pro] Phát hiện chế độ auto-retry, tự động gửi lại đăng ký.');
                        regBtn.click();
                    }
                }
            }, 300);

            return normalizedCaptcha;
        } else {
            console.log('[Hieu Captcha] Kết quả captcha chưa hợp lệ, sẽ yêu cầu ảnh mới.');
            inputCaptcha.placeholder = 'Lỗi giải Captcha';
            return null;
        }
    }

    // Tự động kích hoạt đánh giá nếu BẬT cấu hình autoEvalEnabled
    let isSubmittingEval = false;

    function waitAndSubmitEval() {
        if (isSubmittingEval) return;
        
        const btnSend = document.getElementById('btnsend');
        const txtCaptcha = document.querySelector('input[name="txtCaptcha"], input#txtCaptcha, .txtcaptcha, input[name*="txtCaptcha" i], input[id*="txtCaptcha" i], input[id*="txtCaptchar" i], .textCaptcha');
        
        if (!btnSend || !txtCaptcha) {
            console.log('[Hieu Pro] Không tìm thấy nút gửi hoặc ô captcha để tự động submit.');
            return;
        }
        
        if (txtCaptcha.value.trim().length < 4) {
            setTimeout(waitAndSubmitEval, 300);
            return;
        }
        
        console.log('[Hieu Pro] Đã có captcha, tự động click nút gửi đánh giá...');
        isSubmittingEval = true;
        btnSend.click();
    }

    function checkAndAutoEvaluate() {
        const currentUrl = window.location.href.toLowerCase();
        if (!currentUrl.includes('mydtu.duytan.edu.vn/sites/index.aspx?p=home_ratingform&stidnumber=')) {
            sessionStorage.removeItem('hieu_eval_active');
            sessionStorage.removeItem('hieu_eval_level');
            return;
        }
        
        console.log('[Hieu Captcha] Đang kiểm tra cấu hình tự động đánh giá...');
        chrome.storage.local.get(['autoEvalEnabled'], data => {
            let active = sessionStorage.getItem('hieu_eval_active') === 'true';
            let level = sessionStorage.getItem('hieu_eval_level') || '1';
            
            if (!active && data.autoEvalEnabled) {
                active = true;
                level = '1';
                sessionStorage.setItem('hieu_eval_active', 'true');
                sessionStorage.setItem('hieu_eval_level', '1');
            }
            
            if (active) {
                console.log(`[Hieu Captcha] Tiến hành tự động điền đánh giá mức ${level}...`);
                try {
                    teacherEvalScript(parseInt(level, 10) || 1);
                    
                    // Chờ captcha giải xong để click gửi
                    setTimeout(waitAndSubmitEval, 500);
                } catch (err) {
                    console.error('[Hieu Captcha] Lỗi khi thực thi đánh giá:', err);
                }
            }
        });
    }

    let selectionAttempts = 0;
    function autoSelectSemester() {
        const currentUrl = window.location.href.toLowerCase();
        if (!currentUrl.includes('p=home_semester')) {
            return;
        }
        
        if (selectionAttempts > 30) {
            console.log('[Hieu Pro] Đã thử chọn học kỳ quá 30 lần, dừng lại.');
            return;
        }
        selectionAttempts++;

        const selects = Array.from(document.querySelectorAll('select'));
        let yearSelect = selects.find(select => 
            Array.from(select.options).some(opt => /\b20\d{2}\b/.test(opt.text))
        );
        
        let semesterSelect = selects.find(select => 
            select !== yearSelect && 
            (
                /semester|hocky|hk/i.test(select.id) || 
                /semester|hocky|hk/i.test(select.name) ||
                Array.from(select.options).some(opt => /học kỳ|hoc ky|kỳ|ky/i.test(opt.text))
            )
        );
        
        if (!yearSelect) {
            console.log('[Hieu Pro] Không tìm thấy select năm học, thử lại sau...');
            setTimeout(autoSelectSemester, 300);
            return;
        }
        
        const latestYearOpt = getLatestYearOption(yearSelect);
        if (latestYearOpt) {
            if (yearSelect.value !== latestYearOpt.value) {
                console.log('[Hieu Pro] Chọn năm học mới nhất:', latestYearOpt.text);
                yearSelect.value = latestYearOpt.value;
                yearSelect.dispatchEvent(new Event('input', { bubbles: true }));
                yearSelect.dispatchEvent(new Event('change', { bubbles: true }));
                if (yearSelect.onchange) {
                    try { yearSelect.onchange(); } catch (e) {}
                }
                setTimeout(autoSelectSemester, 500);
                return;
            }
        }
        
        if (!semesterSelect) {
            console.log('[Hieu Pro] Chưa tìm thấy dropdown học kỳ, đang đợi...');
            setTimeout(autoSelectSemester, 300);
            return;
        }
        
        const latestSemOpt = getLatestSemesterOption(semesterSelect);
        if (!latestSemOpt) {
            console.log('[Hieu Pro] Dropdown học kỳ chưa tải xong danh sách học kỳ, đang đợi...');
            setTimeout(autoSelectSemester, 300);
            return;
        }
        
        if (semesterSelect.value !== latestSemOpt.value) {
            console.log('[Hieu Pro] Chọn học kỳ mới nhất:', latestSemOpt.text);
            semesterSelect.value = latestSemOpt.value;
            semesterSelect.dispatchEvent(new Event('input', { bubbles: true }));
            semesterSelect.dispatchEvent(new Event('change', { bubbles: true }));
            if (semesterSelect.onchange) {
                try { semesterSelect.onchange(); } catch (e) {}
            }
            setTimeout(autoSelectSemester, 500);
            return;
        }
        
        setTimeout(() => {
            const continueBtn = Array.from(document.querySelectorAll('input, button, a')).find(el => {
                const text = (el.value || el.textContent || '').trim().toLowerCase();
                return text === 'tiếp tục' || text === 'tiếp theo' || text === 'continue';
            });
            
            if (continueBtn) {
                console.log('[Hieu Pro] Bấm nút Tiếp tục...');
                continueBtn.click();
            } else {
                console.log('[Hieu Pro] Không tìm thấy nút Tiếp tục.');
            }
        }, 500);
    }
    
    function getLatestYearOption(selectEl) {
        const options = Array.from(selectEl.options).filter(opt => {
            const val = opt.value;
            return val && val !== '0' && val !== '-1' && !opt.disabled;
        });
        if (!options.length) return null;
        
        let maxYear = -1;
        let bestOpt = null;
        options.forEach(opt => {
            const match = opt.text.match(/\b20\d{2}\b/);
            if (match) {
                const year = parseInt(match[0], 10);
                if (year > maxYear) {
                    maxYear = year;
                    bestOpt = opt;
                }
            }
        });
        return bestOpt;
    }
    
    function getLatestSemesterOption(selectEl) {
        const options = Array.from(selectEl.options).filter(opt => {
            const val = opt.value;
            return val && val !== '0' && val !== '-1' && !opt.disabled;
        });
        if (!options.length) return null;
        
        let maxWeight = -1;
        let bestOpt = null;
        
        options.forEach((opt, index) => {
            let weight = index;
            const text = opt.text.toLowerCase();
            
            if (text.includes('học kỳ 3') || text.includes('học kỳ iii') || text.includes('hk3') || text.includes('hk 3')) {
                weight = 30;
            } else if (text.includes('hè') || text.includes('summer') || text.includes('phụ') || text.includes('hk phụ') || text.includes('hk he')) {
                weight = 25;
            } else if (text.includes('học kỳ 2') || text.includes('học kỳ ii') || text.includes('hk2') || text.includes('hk 2')) {
                weight = 20;
            } else if (text.includes('học kỳ 1') || text.includes('học kỳ i') || text.includes('hk1') || text.includes('hk 1')) {
                weight = 10;
            } else {
                const numMatch = text.match(/\d+/);
                if (numMatch) {
                    weight = parseInt(numMatch[0], 10) * 10;
                }
            }
            
            if (weight > maxWeight) {
                maxWeight = weight;
                bestOpt = opt;
            }
        });
        return bestOpt;
    }

    function isAutomaticReloadDisabledPage() {
        const currentUrl = new URL(window.location.href);
        const host = currentUrl.hostname.toLowerCase();
        const path = currentUrl.pathname.toLowerCase();

        const isMyDtuInfoPage = host === 'mydtu.duytan.edu.vn' &&
            path === '/sites/index.aspx' &&
            currentUrl.searchParams.get('p')?.toLowerCase() === 'home_infowebpart' &&
            currentUrl.searchParams.get('functionid') === '88';

        const isSakaiPortalPage = host === 'studyresource.duytan.edu.vn' &&
            (path === '/portal' || path.startsWith('/portal/'));

        const isMydtuHomePage = host === 'mydtu.duytan.edu.vn' &&
            !path.includes('/signin.aspx') &&
            Boolean(document.querySelector('.welcome .hello.man, .welcome .hello'));

        return isMyDtuInfoPage || isMydtuHomePage || isSakaiPortalPage;
    }

    function stopAutomaticReloadForProtectedPage() {
        if (!isAutomaticReloadDisabledPage()) {
            return false;
        }

        if (loginReloadCountdownInterval) {
            clearInterval(loginReloadCountdownInterval);
            loginReloadCountdownInterval = null;
        }
        if (loginReloadTimerId) {
            clearTimeout(loginReloadTimerId);
            loginReloadTimerId = null;
        }
        // Chỉ dừng các timer/watchdog reload. Extension vẫn tiếp tục chạy
        // các chức năng khác trên trang MyDTU/Sakai đã đăng nhập.
        automaticReloadDisabled = true;
        sessionStorage.removeItem('hieu_login_attempt');
        sessionStorage.removeItem('hieu_login_retry_pending');
        cancelBackgroundLoginWatchdog();
        console.log('[Hieu Pro] Đã tắt riêng tính năng tự động reload tại trang đã đăng nhập:', window.location.href);
        return true;
    }

    function checkServerErrorAndReload() {
        if (isAutomaticReloadDisabledPage()) {
            return false;
        }

        // Không can thiệp vào Sakai hoặc các hệ thống DTU khác sau khi đăng nhập.
        // Việc reload tự động chỉ dành cho máy chủ MyDTU.
        const currentLocation = new URL(window.location.href);
        if (currentLocation.hostname.toLowerCase() !== 'mydtu.duytan.edu.vn' ||
            !currentLocation.pathname.toLowerCase().includes('/signin.aspx')) {
            return false;
        }

        const docText = document.body ? document.body.textContent || '' : '';
        const docTitle = document.title || '';
        
        const errorKeywords = [
            '502 bad gateway',
            '503 service unavailable',
            '504 gateway timeout',
            '500 internal server error',
            'server error in',
            'runtime error',
            'the service is unavailable',
            'connection timed out',
            'hệ thống đang bận',
            'quá tải',
            'đang bảo trì'
        ];
        
        const isErrorPage = errorKeywords.some(keyword => 
            docTitle.toLowerCase().includes(keyword) || 
            docText.toLowerCase().includes(keyword)
        );
        
        const isBlankPage = document.body && 
                            document.body.children.length === 0 && 
                            docText.trim() === '' && 
                            (docTitle === '' || docTitle.toLowerCase().includes('signin') || docTitle.toLowerCase().includes('duytan'));
        
        if (isErrorPage || isBlankPage) {
            console.log('[Hieu Pro] Phát hiện trang lỗi hoặc trang trống. Sẽ tải lại sau 2 giây...');
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            return true;
        }
        return false;
    }

    const LOGIN_TIMEOUT_MS = 25000;
    let loginPageWatchdogTimer = null;

    function getLoggedInUserName() {
        const userName = document.querySelector('.welcome .hello.man, .welcome .hello');
        return userName ? userName.textContent.trim() : '';
    }

    function getLoginPageUrl() {
        const currentUrl = new URL(window.location.href);
        const loginUrl = currentUrl.pathname.toLowerCase().includes('/signin.aspx')
            ? currentUrl
            : new URL('/Signin.aspx', currentUrl.origin);
        loginUrl.hash = '';
        loginUrl.searchParams.delete('_hieu_retry');
        return loginUrl.toString();
    }

    function sendLoginWatchdogMessage(action, timeoutMs) {
        try {
            chrome.runtime.sendMessage({
                action,
                timeoutMs,
                loginUrl: getLoginPageUrl()
            }, () => {
                if (chrome.runtime.lastError) {
                    console.warn('[Hieu Pro] Không thể liên lạc với background watchdog:', chrome.runtime.lastError.message);
                }
            });
        } catch (error) {
            console.error('[Hieu Pro] Lỗi gửi yêu cầu tới background watchdog:', error);
        }
    }

    function cancelBackgroundLoginWatchdog() {
        if (loginPageWatchdogTimer !== null) {
            clearTimeout(loginPageWatchdogTimer);
            loginPageWatchdogTimer = null;
        }
        sendLoginWatchdogMessage('cancelLoginWatchdog');
    }

    function armLoginWatchdog(timeoutMs, reason) {
        // Hủy bỏ cơ chế watchdog tự động reload trang khi ở trang đăng nhập
        cancelBackgroundLoginWatchdog();
    }

    function checkLoginWatchdog() {
        const currentUrl = new URL(window.location.href);
        if (stopAutomaticReloadForProtectedPage()) {
            return false;
        }

        if (!currentUrl.pathname.toLowerCase().includes('/signin.aspx')) {
            sessionStorage.removeItem('hieu_login_attempt');
            sessionStorage.removeItem('hieu_login_retry_pending');
            cancelBackgroundLoginWatchdog();
            return true;
        }

        if (currentUrl.searchParams.has('_hieu_retry')) {
            sessionStorage.removeItem('hieu_login_attempt');
            cancelBackgroundLoginWatchdog();
            return false;
        }

        const loggedInUserName = getLoggedInUserName();
        if (loggedInUserName) {
            sessionStorage.removeItem('hieu_login_attempt');
            sessionStorage.removeItem('hieu_login_retry_pending');
            cancelBackgroundLoginWatchdog();
            console.log('[Hieu Pro] Đăng nhập thành công:', loggedInUserName);
            return true;
        }

        return false;
    }

    let loginFlowRunning = false;
    let loginSubmitPending = false;
    let captchaRefreshRequired = false;
    let loginFormPrepared = !window.location.href.toLowerCase().includes('/signin.aspx');

    function normalizeLoginMessage(text) {
        return (text || '')
            .normalize('NFC')
            .replace(/\s+/g, ' ')
            .trim()
            .toLocaleLowerCase('vi-VN');
    }

    const loginErrorPatterns = [
        'tên đăng nhập hoặc mật khẩu không chính xác',
        'mã xác nhận không hợp lệ',
        'mã xác nhận không chính xác',
        'mã xác thực không hợp lệ',
        'chưa nhập mật khẩu',
        'chưa nhập tên đăng nhập'
    ];

    function isLoginFailureText(text) {
        if (!text) return false;
        const norm = normalizeLoginMessage(text);
        return loginErrorPatterns.some(pattern => norm.includes(pattern));
    }

    function setLoginFieldValue(field, value) {
        if (!field) return;
        field.value = value;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const LOGIN_RELOAD_DELAY_MS = 5000;
    let loginErrorReloading = false;
    let automaticReloadDisabled = false;
    let loginReloadCountdownInterval = null;
    let loginReloadTimerId = null;

    function initLoginReloadTimer() {
        if (!window.location.href.toLowerCase().includes('/signin.aspx')) {
            return;
        }

        loginErrorReloading = false;
        console.log('[Hieu Pro] ⏳ Cơ chế đếm 5 giây sẵn sàng: Khi đăng nhập thất bại, sẽ giữ thông báo lỗi, đếm 5 giây rồi reload trang và tiếp tục đếm tiếp 5 giây ở lần thử sau.');
    }

    function reloadLoginPageForRetry(reason) {
        if (loginErrorReloading) {
            return;
        }

        loginErrorReloading = true;
        loginFlowRunning = false;
        loginSubmitPending = false;
        sessionStorage.removeItem('hieu_login_attempt');
        sessionStorage.setItem('hieu_login_retry_pending', 'true');
        cancelBackgroundLoginWatchdog();

        let remainingSeconds = 5;
        console.log(`[Hieu Pro] ⏳ Đăng nhập không thành công (${reason}). Giữ nguyên thông báo lỗi trên màn hình, bắt đầu đếm 5 giây trước khi reload lại trang...`);

        if (loginReloadCountdownInterval) {
            clearInterval(loginReloadCountdownInterval);
        }
        if (loginReloadTimerId) {
            clearTimeout(loginReloadTimerId);
        }

        loginReloadCountdownInterval = setInterval(() => {
            remainingSeconds--;
            if (remainingSeconds > 0) {
                console.log(`[Hieu Pro] ⏳ Đếm ngược: Sẽ tự động reload trang sau ${remainingSeconds}s...`);
            } else {
                clearInterval(loginReloadCountdownInterval);
                loginReloadCountdownInterval = null;
            }
        }, 1000);

        loginReloadTimerId = setTimeout(() => {
            if (loginReloadCountdownInterval) {
                clearInterval(loginReloadCountdownInterval);
                loginReloadCountdownInterval = null;
            }
            console.log('[Hieu Pro] 🔄 Đã đếm đủ 5 giây! Tiến hành reload lại trang để bắt đầu đếm tiếp cho lần thử sau...');
            const currentUrl = new URL(window.location.href);
            const cleanLoginUrl = currentUrl.pathname.toLowerCase().includes('/signin.aspx')
                ? currentUrl
                : new URL('/Signin.aspx', currentUrl.origin);
            cleanLoginUrl.hash = '';
            cleanLoginUrl.searchParams.set('_hieu_retry', Date.now().toString());
            window.location.replace(cleanLoginUrl.toString());
        }, LOGIN_RELOAD_DELAY_MS);
    }

    function handleLoginError(source, errorText) {
        loginFlowRunning = false;
        loginSubmitPending = false;
        cancelBackgroundLoginWatchdog();

        console.log(`[Hieu Pro] Phát hiện thông báo đăng nhập không thành công (${source}): "${errorText}".`);
        console.log('[Hieu Pro] ⏳ Bắt đầu đếm 5 giây, giữ thông báo lỗi trên màn hình trước khi reload trang...');
        reloadLoginPageForRetry(source + ': ' + errorText);
        return true;
    }

    const handleLoginFailure = handleLoginError;

    function checkLoginError() {
        if (!window.location.href.toLowerCase().includes('/signin.aspx') || loginErrorReloading) {
            return false;
        }

        const lbMessage = document.getElementById('lbMessage');
        const errorText = lbMessage ? lbMessage.textContent.trim() : '';

        if (isLoginFailureText(errorText)) {
            return handleLoginError('lbMessage', errorText);
        }

        return false;
    }

    function watchLoginErrors() {
        if (!window.location.href.toLowerCase().includes('/signin.aspx')) {
            return;
        }

        // Nếu vừa submit đăng nhập từ trang trước dẫn đến postback có lỗi
        if (sessionStorage.getItem('hieu_login_attempt')) {
            checkLoginError();
        }

        const target = document.body || document.documentElement;
        if (target) {
            const observer = new MutationObserver(() => {
                if (loginSubmitPending || sessionStorage.getItem('hieu_login_attempt')) {
                    checkLoginError();
                }
            });
            observer.observe(target, { childList: true, characterData: true, subtree: true });
        }

        const intervalId = setInterval(() => {
            if (!window.location.href.toLowerCase().includes('/signin.aspx') || loginErrorReloading) {
                clearInterval(intervalId);
                return;
            }
            if (loginSubmitPending || sessionStorage.getItem('hieu_login_attempt')) {
                checkLoginError();
            }
        }, 1000);
    }

    function isSakaiPendingUrl(pendingUrl) {
        if (!pendingUrl) return false;
        try {
            return new URL(pendingUrl).pathname.toLowerCase().endsWith('/elearning.aspx');
        } catch (error) {
            return false;
        }
    }

    function selectLoginType(loginType) {
        const isLearning = loginType === 'learning';
        const radioValue = isLearning ? '3' : '1';
        const radioId = isLearning ? 'Radio3' : 'Radio1';
        const spanId = isLearning ? 'Span3' : 'Span1';
        const label = isLearning ? 'Learning' : 'Portal';
        const loginRadio = document.getElementById(radioId) ||
                           document.querySelector(`input[name="radType"][value="${radioValue}"]`);
        if (!loginRadio) {
            console.log(`[Hieu Pro] Chưa tìm thấy lựa chọn ${label} trên trang đăng nhập.`);
            return false;
        }

        const valChecked = document.getElementById('valChecked');
        const alreadySelected = loginRadio.checked && (!valChecked || valChecked.value === radioValue);
        // click() kích hoạt inline handler setValueChecked(...) của trang.
        if (!alreadySelected) {
            loginRadio.click();
        }
        document.querySelectorAll('input[name="radType"]').forEach(radio => {
            radio.checked = radio === loginRadio;
        });

        document.querySelectorAll('span[id^="Span"]').forEach(span => {
            span.classList.toggle('active', span.id === spanId);
        });

        if (valChecked) {
            setLoginFieldValue(valChecked, radioValue);
        }

        console.log(`[Hieu Pro] Đã chọn đăng nhập bằng ${label} trước khi nhập form.`);
        return true;
    }

    function selectLearningLoginType() {
        return selectLoginType('learning');
    }

    function selectPortalLoginType() {
        return selectLoginType('portal');
    }

    let loginTypeSelectionGuardTimer = null;

    function startLoginTypeSelectionGuard() {
        if (!window.location.href.toLowerCase().includes('/signin.aspx') || loginTypeSelectionGuardTimer !== null) {
            return;
        }

        const requestedType = new URL(window.location.href).searchParams.get('_hieu_login_type') === 'learning'
            ? 'learning'
            : 'portal';
        let attempts = 0;

        const applySelection = () => {
            if (!window.location.href.toLowerCase().includes('/signin.aspx')) {
                clearInterval(loginTypeSelectionGuardTimer);
                loginTypeSelectionGuardTimer = null;
                return;
            }

            if (selectLoginType(requestedType) || attempts >= 100) {
                clearInterval(loginTypeSelectionGuardTimer);
                loginTypeSelectionGuardTimer = null;
                return;
            }
            attempts++;
        };

        applySelection();
        if (loginTypeSelectionGuardTimer === null) {
            loginTypeSelectionGuardTimer = setInterval(applySelection, 100);
        }
    }

    async function autoLogin() {
        const currentUrl = window.location.href.toLowerCase();
        if (!currentUrl.includes('/signin.aspx')) {
            return;
        }

        const hasBackgroundRetry = new URL(window.location.href).searchParams.has('_hieu_retry');
        if (sessionStorage.getItem('hieu_login_retry_pending') === 'true' || hasBackgroundRetry) {
            sessionStorage.removeItem('hieu_login_retry_pending');
            sessionStorage.removeItem('hieu_login_attempt');
            console.log('[Hieu Pro] Trang đăng nhập đã tải lại, chuẩn bị tiến hành đăng nhập.');
        }

        if (loginFlowRunning || loginSubmitPending) {
            return;
        }
        
        const loginTypeFromUrl = new URL(window.location.href).searchParams.get('_hieu_login_type');
        chrome.storage.local.get(['myDtuUser', 'myDtuPass', 'pendingRedirectUrl', 'pendingLoginType'], async data => {
            const user = data.myDtuUser;
            const pass = data.myDtuPass;
            const shouldUseLearning = loginTypeFromUrl === 'learning' ||
                                      (!loginTypeFromUrl &&
                                       data.pendingLoginType === 'learning' &&
                                       isSakaiPendingUrl(data.pendingRedirectUrl));
            const requestedLoginType = shouldUseLearning ? 'learning' : 'portal';

            // Nếu website chuyển một mục menu về Signin.aspx mà không giữ
            // query _hieu_login_type, vẫn phải giữ trang đích đang chờ.
            // Chỉ xoá storage khi thật sự không có tác vụ menu nào đang chờ.
            const hasPendingMenuRedirect = typeof data.pendingRedirectUrl === 'string' &&
                data.pendingRedirectUrl.trim() !== '';
            if (!loginTypeFromUrl && !hasPendingMenuRedirect) {
                chrome.storage.local.remove(['pendingRedirectUrl', 'pendingLoginType']);
            }

            if (!selectLoginType(requestedLoginType)) {
                loginFormPrepared = false;
                console.log(`[Hieu Pro] Phải chọn ${requestedLoginType === 'learning' ? 'Learning' : 'Portal'} trước khi nhập form, sẽ thử lại...`);
                setTimeout(autoLogin, 300);
                return;
            }
            loginFormPrepared = true;
            
            if (!user || !pass) {
                console.log('[Hieu Pro] Chưa cấu hình thông tin đăng nhập trong cài đặt.');
                return;
            }
            
            const txtUser = document.getElementById('txtUser');
            const txtPass = document.getElementById('txtPass');
            const txtCaptcha = document.getElementById('txtCaptcha') ||
                               document.querySelector('input[name="txtCaptcha"], .txtcaptcha');
            const btnLogin = document.getElementById('btnLogin1') || document.getElementById('btnLogin');
            
            if (!txtUser || !txtPass || !txtCaptcha || !btnLogin) {
                console.log('[Hieu Pro] Chưa tìm thấy đủ các phần tử đăng nhập, sẽ thử lại sau...');
                setTimeout(autoLogin, 500);
                return;
            }

            loginFlowRunning = true;
            console.log('[Hieu Pro] Bắt đầu quy trình đăng nhập tuần tự: Tên đăng nhập -> Mật khẩu -> Captcha -> Ấn đăng nhập');

            // Bước 1: Nhập Tên đăng nhập
            console.log('[Hieu Pro] Bước 1: Nhập Tên đăng nhập');
            setLoginFieldValue(txtUser, user);

            await new Promise(resolve => setTimeout(resolve, 300));

            // Bước 2: Nhập Mật khẩu
            console.log('[Hieu Pro] Bước 2: Nhập Mật khẩu');
            txtPass.removeAttribute('onfocus');
            txtPass.onfocus = null;
            setLoginFieldValue(txtPass, pass);

            await new Promise(resolve => setTimeout(resolve, 300));

            // Bước 3: Giải và nhập Captcha
            console.log('[Hieu Pro] Bước 3: Đang giải và nhập Mã xác nhận (Captcha)...');
            const imgCaptcha = document.querySelector('img[src*="CaptchaImage.axd"], img[id*="CaptchaImage" i], img[src*="captcha" i], #loadCaptchaHere img');
            if (imgCaptcha && (!imgCaptcha.complete || imgCaptcha.naturalWidth === 0)) {
                await new Promise(resolve => {
                    imgCaptcha.addEventListener('load', resolve, { once: true });
                    setTimeout(resolve, 3000);
                });
            }

            let captchaAttempts = 0;
            while (txtCaptcha.value.trim().length !== 4 && captchaAttempts < 3) {
                captchaAttempts++;
                await processCaptcha(true);
                if (txtCaptcha.value.trim().length === 4) break;
                if (captchaAttempts < 3) {
                    await refreshCaptchaForRetry();
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

            if (txtCaptcha.value.trim().length !== 4) {
                console.log('[Hieu Pro] Chưa có mã captcha hợp lệ, sẽ tải ảnh mới và thử lại tự động.');
                loginFlowRunning = false;
                await refreshCaptchaForRetry();
                setTimeout(autoLogin, 1200);
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 300));

            // Bước 4: Kiểm tra lại toàn bộ và Ấn Đăng nhập
            console.log('[Hieu Pro] Bước 4: Kiểm tra lại các trường và ấn Đăng nhập');
            selectLoginType(requestedLoginType);

            if (!txtUser.value || txtUser.value.trim() === '') {
                setLoginFieldValue(txtUser, user);
            }
            if (!txtPass.value || txtPass.value === 'Nhập mật khẩu') {
                txtPass.removeAttribute('onfocus');
                txtPass.onfocus = null;
                setLoginFieldValue(txtPass, pass);
            }

            if (txtUser.value.trim() === '' || txtPass.value === '' || txtCaptcha.value.trim().length !== 4) {
                console.warn('[Hieu Pro] Không thể đăng nhập vì có trường bị thiếu:', {
                    hasUser: Boolean(txtUser.value.trim()),
                    hasPass: Boolean(txtPass.value),
                    captchaLen: txtCaptcha.value.trim().length
                });
                loginFlowRunning = false;
                return;
            }

            loginSubmitPending = true;
            sessionStorage.setItem('hieu_login_attempt', Date.now().toString());

            console.log('[Hieu Pro] Đã hoàn tất 4 bước theo đúng thứ tự. Tiến hành đăng nhập!');
            btnLogin.click();
        });
    }

    function checkPendingRedirect() {
        if (window !== window.top) return;
        // Dừng riêng auto-reload nhưng vẫn phải xử lý pendingRedirectUrl
        // để tác vụ menu tiếp tục đi tới đúng trang đích sau đăng nhập.
        stopAutomaticReloadForProtectedPage();

        chrome.storage.local.get(['pendingRedirectUrl', 'pendingLoginType'], data => {
            const pendingUrl = data.pendingRedirectUrl;
            if (!pendingUrl) return;

            try {
                const currentUrl = window.location.href;
                const currentObj = new URL(currentUrl);
                const pendingObj = new URL(pendingUrl);

                const currentPath = currentObj.pathname.toLowerCase();
                const pendingPath = pendingObj.pathname.toLowerCase();
                const currentHost = currentObj.hostname.toLowerCase();

                const isMydtuRootTarget = data.pendingLoginType === 'portal' &&
                    pendingObj.hostname.toLowerCase() === 'mydtu.duytan.edu.vn' &&
                    pendingPath === '/' &&
                    currentHost === 'mydtu.duytan.edu.vn' &&
                    !currentPath.includes('/signin.aspx');

                if (isMydtuRootTarget) {
                    chrome.storage.local.remove(['pendingRedirectUrl', 'pendingLoginType']);
                    cancelBackgroundLoginWatchdog();
                    console.log('[Hieu Pro] Đã vào trang MyDTU sau đăng nhập, xóa đích gốc để tránh chuyển hướng lặp.');
                    return;
                }

                const reachedSakai = data.pendingLoginType === 'learning' && (
                    currentHost.includes('sakai') ||
                    currentHost.includes('elearning') ||
                    currentPath === '/portal' ||
                    currentPath.startsWith('/portal/')
                );

                if (reachedSakai) {
                    chrome.storage.local.remove(['pendingRedirectUrl', 'pendingLoginType']);
                    cancelBackgroundLoginWatchdog();
                    console.log('[Hieu Pro] Đã vào Sakai, xóa trạng thái chuyển hướng và không reload lại trang.');
                    return;
                }

                let isMatch = false;
                if (currentPath === pendingPath) {
                    if (pendingPath.includes('index.aspx')) {
                        const pendingP = pendingObj.searchParams.get('p');
                        const currentP = currentObj.searchParams.get('p');
                        if (pendingP && currentP && pendingP.toLowerCase() === currentP.toLowerCase()) {
                            isMatch = true;
                        }
                    } else {
                        isMatch = true;
                    }
                }

                if (isMatch) {
                    chrome.storage.local.remove(['pendingRedirectUrl', 'pendingLoginType']);
                    console.log('[Hieu Pro] Đang ở đúng trang đích, xóa trạng thái chuyển hướng đăng nhập.');
                    return;
                }

                // Nếu đang ở trang đăng nhập, không chuyển hướng để đợi đăng nhập tự động chạy
                if (currentPath.includes('/signin.aspx')) {
                    return;
                }

                // Xóa trước khi chuyển hướng để không lặp lại khi đích tự chuyển tiếp
                // sang một URL khác (đặc biệt là luồng Sakai).
                console.log('[Hieu Pro] Chuyển hướng tab đến trang đích:', pendingUrl);
                chrome.storage.local.remove(['pendingRedirectUrl', 'pendingLoginType'], () => {
                    window.location.replace(pendingUrl);
                });
            } catch (err) {
                console.error('[Hieu Pro] Lỗi khi xử lý pendingRedirectUrl:', err);
                chrome.storage.local.remove(['pendingRedirectUrl', 'pendingLoginType']);
            }
        });
    }

    // Lắng nghe sự kiện để kích hoạt
    function init() {
        console.log('[Hieu Captcha] Đang khởi tạo...');

        // Khởi tạo cơ chế đếm 5 giây kể từ khi vào trang đăng nhập
        initLoginReloadTimer();
        
        // Kiểm tra chuyển hướng pending
        checkPendingRedirect();
        
        // Đăng ký lắng nghe sự kiện alert và triggered từ Main World
        window.addEventListener('hieu_alert_event', event => {
            const alertMsg = event.detail || '';
            console.log('[Hieu Pro] Nhận thông báo từ trang:', alertMsg);

            if (window.location.href.toLowerCase().includes('/signin.aspx') && isLoginFailureText(alertMsg)) {
                handleLoginError('alert', alertMsg);
                return;
            }

            isSubmittingEval = false;
            
            if (alertMsg.includes('xác thực') || alertMsg.includes('xác nhận') || alertMsg.includes('captcha') || alertMsg.includes('không chính xác') || alertMsg.includes('không hợp lệ')) {
                const imgCaptcha = document.querySelector('img[src*="CaptchaImage.axd"], img[id*="CaptchaImage" i], img[src*="captcha" i], #loadCaptchaHere img');
                if (imgCaptcha) {
                    console.log('[Hieu Pro] Đăng ký/Đánh giá lỗi captcha, đang yêu cầu tải ảnh mới...');
                    imgCaptcha.click();
                    setTimeout(waitAndSubmitEval, 500);
                }
            } else if (alertMsg.includes('thành công') || alertMsg.includes('hoàn thành')) {
                console.log('[Hieu Pro] Đánh giá thành công! Dừng tiến trình.');
                sessionStorage.removeItem('hieu_eval_active');
                sessionStorage.removeItem('hieu_eval_level');
            }
        });

        window.addEventListener('hieu_eval_triggered', event => {
            const level = event.detail;
            console.log('[Hieu Pro] Nhận sự kiện đánh giá giảng viên mức:', level);
            setTimeout(waitAndSubmitEval, 500);
        });
        
        // Watchdog đăng nhập tiếp tục hoạt động sau khi đã submit form.
        checkLoginWatchdog();

        // Kiểm tra tự động tải lại nếu gặp lỗi Server.
        chrome.storage.local.get(['autoReloadEnabled'], data => {
            const autoReloadEnabled = data.autoReloadEnabled !== false; // Mặc định là true
            if (autoReloadEnabled) {
                if (checkServerErrorAndReload()) {
                    return; // Dừng khởi tạo nếu đang reload trang
                }
            }
        });
        
        // Tự động đăng nhập & theo dõi lỗi đăng nhập (đếm 5 giây rồi reload lại trang, tiếp tục lặp lại)
        watchLoginErrors();
        startLoginTypeSelectionGuard();
        autoLogin();
        
        // Tự động chọn năm học và học kỳ nếu đang ở trang chọn học kỳ
        autoSelectSemester();

        // Tự động đánh giá trước (nếu được bật)
        checkAndAutoEvaluate();

        // Tự động giải captcha trên các trang khác (trên trang Signin thì autoLogin giải tuần tự ở Bước 3)
        if (!window.location.href.toLowerCase().includes('/signin.aspx')) {
            processCaptcha();

            const imgCaptcha = document.querySelector('img[src*="CaptchaImage.axd"], img[id*="CaptchaImage" i], img[src*="captcha" i], #loadCaptchaHere img');
            if (imgCaptcha) {
                imgCaptcha.addEventListener('load', () => {
                    console.log('[Hieu Captcha] Captcha reload phát hiện được. Giải ảnh mới...');
                    processCaptcha();
                });
            }

            const observer = new MutationObserver((mutations) => {
                let shouldProcess = false;
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length) {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.querySelector('img[src*="CaptchaImage.axd"], img[id*="CaptchaImage" i], img[src*="captcha" i], #loadCaptchaHere img') || 
                                    node.matches('img[src*="CaptchaImage.axd"], img[id*="CaptchaImage" i], img[src*="captcha" i], #loadCaptchaHere img')) {
                                    shouldProcess = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (shouldProcess) {
                    console.log('[Hieu Captcha] Phát hiện phần tử Captcha mới xuất hiện động trong DOM.');
                    processCaptcha();
                }
            });
            
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    function watchRegistrationStatus() {
        let target = document.getElementById('displayThongBao');
        if (!target) {
            setTimeout(watchRegistrationStatus, 1000);
            return;
        }
        const observer = new MutationObserver(() => {
            const text = target.textContent.trim();
            if (text === 'Đăng ký Thành công') {
                document.body.removeAttribute('data-auto-registering-code');
                const classIdInput = document.getElementById('ctl00_PlaceHolderContentArea_ctl00_ctl01_txt_ClassID');
                const code = classIdInput ? classIdInput.value.trim() : '';
                if (code) {
                    chrome.storage.local.get(['successCourses'], data => {
                        const successList = data.successCourses || [];
                        if (!successList.includes(code)) {
                            successList.push(code);
                            chrome.storage.local.set({ successCourses: successList }, () => {
                                console.log('[Hieu Pro] Đăng ký thành công môn:', code);
                            });
                        }
                    });
                }
            } else if (text !== '' && text !== 'MÃ XÁC NHẬN không chính xác. Vui lòng nhập lại!') {
                console.log('[Hieu Pro] Dừng tự động đăng ký do lỗi khác:', text);
                document.body.removeAttribute('data-auto-registering-code');
            }
        });
        observer.observe(target, { childList: true, characterData: true, subtree: true });
    }

    let isInitialized = false;

    function startExtension() {
        chrome.storage.local.get({ extensionEnabled: true }, (res) => {
            if (res.extensionEnabled === false) {
                // Điều hướng tác vụ menu phải hoạt động độc lập với các tính
                // năng tự động khác của extension.
                checkPendingRedirect();
                console.log('[Hieu Pro] Extension đang ở trạng thái TẮT (OFF).');
                return;
            }
            if (!isInitialized) {
                isInitialized = true;
                init();
                watchRegistrationStatus();
            }
        });
    }

    chrome.runtime.onMessage.addListener((msg) => {
        if (msg.action === 'toggleExtension') {
            if (msg.enabled) {
                console.log('[Hieu Pro] Extension đã được BẬT (ON).');
                if (!isInitialized) {
                    isInitialized = true;
                    init();
                    watchRegistrationStatus();
                }
            } else {
                console.log('[Hieu Pro] Extension đã được TẮT (OFF).');
            }
        }
    });

    // Đợi DOM sẵn sàng
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startExtension);
    } else {
        startExtension();
    }
})();
