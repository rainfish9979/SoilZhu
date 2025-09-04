function checkMookeData() {
    clearerrmsg(); 
    QryData();

    setTimeout(() => {
        const iframe = document.querySelector('iframe');

        if (iframe) {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const kcCells = iframeDoc.querySelectorAll('#keywords tr td[name="kc"]');
                const kxrsCells = iframeDoc.querySelectorAll('#keywords tr td[name="kxrs"]');

                if (kcCells.length === 0 || kxrsCells.length === 0) {
                    console.log('未找到匹配的元素');
                    setTimeout(checkMookeData, 4000);
                    return;
                }

                let sum = 0;
                const titles = [];

                kcCells.forEach((kcCell, index) => {
                    const title = kcCell.getAttribute('title');
                    if (title && (title.includes('(') || title.includes('（') || title.includes('慕'))) {
                        console.log('找到慕课:', title);
                        if (kxrsCells[index]) {
                            const kxrsTitle = kxrsCells[index].getAttribute('title');
                            if (kxrsTitle) {
                                const numMatch = kxrsTitle.match(/(\d+(?:\.\d+)?)/);
                                if (numMatch) {
                                    const numValue = parseFloat(numMatch[0]);
                                    sum += numValue;
                                    titles.push(kxrsTitle);
                                }
                            }
                        }
                    }
                });
                
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();

                const oscillator1 = audioContext.createOscillator();
                oscillator1.type = 'sine';
                oscillator1.frequency.setValueAtTime(440, audioContext.currentTime);
                
                const gainNode1 = audioContext.createGain();
                gainNode1.gain.setValueAtTime(0.5, audioContext.currentTime);
                
                oscillator1.connect(gainNode1);
                gainNode1.connect(audioContext.destination);
                oscillator1.start();
                oscillator1.stop(audioContext.currentTime + 0.1);

                console.log('找到的符合条件的kxrs title值:', titles);
                console.log('慕课还有:', sum);
                console.log('慕课还有:', sum);
                console.log('慕课还有:', sum);
                
                if (sum > 0) {
                    console.log(
                        "$$$$$$$\\   $$$$$$\\  \n" +
                        "$$  __$$\\ $$  __$$\\ \n" +
                        "$$ |  $$ |$$ /  $$ |\n" +
                        "$$ |  $$ |$$ |  $$ |\n" +
                        "$$ |  $$ |$$ |  $$ |\n" +
                        "$$ |  $$ |$$ |  $$ |\n" +
                        "$$$$$$$  | $$$$$$  |\n" +
                        "\\_______/  \\______/ \n" +
                        "                    \n" +
                        "                    "
                    );
                    
                    const oscillator2 = audioContext.createOscillator();
                    oscillator2.type = 'sine';
                    oscillator2.frequency.setValueAtTime(600, audioContext.currentTime);
                    
                    const gainNode2 = audioContext.createGain();
                    gainNode2.gain.setValueAtTime(1, audioContext.currentTime);
                    
                    oscillator2.connect(gainNode2);
                    gainNode2.connect(audioContext.destination);
                    oscillator2.start();
                    oscillator2.stop(audioContext.currentTime + 1);
                    
                    return;
                } else {
                    setTimeout(checkMookeData, 4000);
                }
            } catch (e) {
                console.error('访问iframe内容时出错:', e);
                console.log('这可能是因为跨域限制导致的');
                setTimeout(checkMookeData, 4000);
            }
        } else {
            console.log('页面中未找到iframe元素');
            setTimeout(checkMookeData, 4000);
        }
    }, 800);
}

checkMookeData();
