document.addEventListener('DOMContentLoaded', () => {
    const envelopeWrapper = document.getElementById('envelope-step');
    const questionStep = document.getElementById('question-step');
    const typewriterElement = document.getElementById('typewriter-text');
    const interactiveInput = document.getElementById('interactive-input');
    const gateAction = document.getElementById('gate-action');
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const btnOpen = document.getElementById('btn-open');
    const gateSection = document.getElementById('gate-section');
    const mainContent = document.getElementById('main-content');
    const introMusic = document.getElementById('intro-music');
    const bgMusic = document.getElementById('bg-music');

    const mainPlayBtn = document.getElementById('main-play-btn');
    const playIcon = document.getElementById('play-icon');
    const currentSongTitle = document.getElementById('current-song-title');
    const playerStatus = document.getElementById('player-status');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const tracks = document.querySelectorAll('.track');

    const btnHeart = document.getElementById('btn-heart');
    const popupModal = document.getElementById('popup-modal');
    const closeModal = document.getElementById('close-modal');
    const cardFooter = document.querySelector('.card-footer');

    const textToType = "Di antara banyaknya cerita yang tak sempat dimulai, izinkan aku menuliskan satu di antaranya.";
    let typeIndex = 0;
    let isEnvelopeOpened = false;

    if (envelopeWrapper) {
        envelopeWrapper.addEventListener('click', () => {
            if (isEnvelopeOpened) return;
            isEnvelopeOpened = true;

            if (tracks.length > 0) {
                playSelectedTrack(tracks[0]);
            }

            envelopeWrapper.classList.add('open');

            setTimeout(() => {
                envelopeWrapper.style.opacity = '0';
                envelopeWrapper.style.transition = 'opacity 0.8s ease';
                
                setTimeout(() => {
                    envelopeWrapper.style.display = 'none';
                    questionStep.style.display = 'block';
                    
                    setTimeout(() => {
                        questionStep.style.opacity = '1';
                        questionStep.style.transition = 'opacity 0.8s ease';
                        startTypewriter();
                    }, 100);
                }, 800);
            }, 1600);
        });
    }

    function startTypewriter() {
        if (typeIndex < textToType.length) {
            typewriterElement.innerHTML += textToType.charAt(typeIndex);
            typeIndex++;
            setTimeout(startTypewriter, 45);
        } else {
            typewriterElement.classList.add('finished');
            setTimeout(() => {
                if (interactiveInput) {
                    interactiveInput.style.display = 'block';
                }
            }, 400);
        }
    }

    if (btnYes) {
        btnYes.addEventListener('click', () => {
            interactiveInput.style.display = 'none';
            typewriterElement.innerHTML = "Welcome, Panji. Terima kasih sudah mau menyempatkan waktu ke sini.";
            gateAction.style.display = 'block';
        });
    }

    if (btnNo) {
        btnNo.addEventListener('click', () => {
            interactiveInput.style.display = 'none';
            typewriterElement.innerHTML = "Tetap welcome, Semoga isi di dalamnya tetap menyenangkan untuk dibaca.";
            gateAction.style.display = 'block';
        });
    }

    if (btnOpen) {
        btnOpen.addEventListener('click', () => {
            gateSection.style.opacity = '0';
            gateSection.style.transition = 'opacity 0.8s ease';

            setTimeout(() => {
                gateSection.style.display = 'none';
                
                mainContent.style.display = 'block';
                
                setTimeout(() => {
                    mainContent.classList.remove('content-hidden');
                    mainContent.classList.add('content-visible');
                    mainContent.style.opacity = '1';
                    mainContent.style.transition = 'opacity 0.8s ease';
                }, 50);
            }, 800);
        });
    }

    function updateFooterVisibility(tabId){
        if (!cardFooter) return;
        if (tabId === 'tab-playlist'){
            cardFooter.style.display = 'none';
        } else { 
            cardFooter.style.display = 'flex';
        }
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            updateFooterVisibility(targetTab);
        });
    });

    function updatePlayerUI(isPlaying) {
        if (!playIcon || !playerStatus) return;
        if (isPlaying) {
            playIcon.textContent = '⏸';
            playerStatus.textContent = 'Playing...';
        } else {
            playIcon.textContent = '▶';
            playerStatus.textContent = 'Not Playing';
        }
    }

    if (mainPlayBtn) {
        mainPlayBtn.addEventListener('click', () => {
            if (introMusic && !introMusic.paused) {
                introMusic.pause();
            }

            if (bgMusic.paused) {
                bgMusic.play().then(() => {
                    updatePlayerUI(true);
                }).catch(err => console.log("Playback error:", err));
            } else {
                bgMusic.pause();
                updatePlayerUI(false);
            }
        });
    }

    tracks.forEach(track => {
        track.addEventListener('click', () => {
            playSelectedTrack(track);
        });
    });

    function playSelectedTrack(trackElement) {
        tracks.forEach(t => t.classList.remove('active'));
        trackElement.classList.add('active');
        
        const newSrc = trackElement.getAttribute('data-src');
        const songName = trackElement.getAttribute('data-name') || trackElement.querySelector('.track-name').textContent;

        if (currentSongTitle) {
            currentSongTitle.textContent = songName;
        }

        if (introMusic && !introMusic.paused) {
            introMusic.pause();
        }

        bgMusic.src = newSrc;
        bgMusic.load();
        bgMusic.play().then(() => {
            updatePlayerUI(true);
        }).catch(err => console.log("Playback error:", err));
    }

    if (bgMusic) {
        bgMusic.addEventListener('ended', () => {
            const trackArray = Array.from(tracks);
            const currentIndex = trackArray.findIndex(t => t.classList.contains('active'));

            if (currentIndex !== -1) {
                const nextIndex = (currentIndex + 1) % trackArray.length;
                const nextTrack = trackArray[nextIndex];

                if (nextTrack) {
                    setTimeout(() => {
                        playSelectedTrack(nextTrack);
                    }, 100);
                }
            } else {
                updatePlayerUI(false);
            }
        });
    }

    if (btnHeart) {
        btnHeart.addEventListener('click', () => {
            for (let i = 0; i < 15; i++) {
                createHeartParticle();
            }
            
            btnHeart.style.transform = 'scale(1.4)';
            setTimeout(() => btnHeart.style.transform = 'scale(1)', 200);
            
            setTimeout(() => {
                popupModal.classList.remove('modal-hidden');
                popupModal.classList.add('modal-visible');
            }, 1000);
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            popupModal.classList.remove('modal-visible');
            popupModal.classList.add('modal-hidden');
        });
    }

    function createHeartParticle() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerHTML = '❤';
        heart.style.left = Math.random() * 100 + 'vw';
        
        const size = Math.random() * 1.5 + 0.5;
        heart.style.transform = `scale(${size})`;
        
        const duration = Math.random() * 2 + 2; 
        heart.style.animationDuration = duration + 's';
        
        const randomX = (Math.random() - 0.5) * 200; 
        heart.style.setProperty('--random-x', `${randomX}px`);
        
        const blues = ['rgba(143, 169, 196, 0.7)', 'rgba(98, 125, 152, 0.6)', 'rgba(176, 196, 222, 0.8)'];
        heart.style.color = blues[Math.floor(Math.random() * blues.length)];

        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), duration * 1000);
    }
});