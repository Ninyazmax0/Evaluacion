// ==========================================
// SISTEMA DE QUIZSCORES Y CHALLENGEMAP
// Sistema Universal para todos los cursos
// ==========================================

// Guardar puntuación del quiz en Firestore (Historial por intento)
async function saveQuizScore(score, total, courseId, levelNumber) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.id) return;

    const newEntry = {
        courseId: courseId,
        level: levelNumber,
        score: score,
        total: total,
        percentage: Math.round((score / total) * 100),
        date: new Date().toISOString()
    };

    // Intentar usar las funciones globales de Firebase si están disponibles
    if (window.getUserFromFirestore && window.updateCourseProgress) {
        try {
            const userDoc = await window.getUserFromFirestore(currentUser.id);
            let history = userDoc.quizHistory || [];
            history.push(newEntry);
            await window.updateCourseProgress(currentUser.id, 'quizHistory', history);
            console.log(`✅ Quiz Score saved for ${courseId} Lvl ${levelNumber}`);
        } catch (e) {
            console.error('❌ Error saving quiz history:', e);
        }
    }
}

// Mostrar botón de challenge
function showChallengeButton(challengeData, resultsMessageElement) {
    // Si challengeData es un string, lo tratamos como ID. Si es objeto, extraemos id y title.
    const challengeId = typeof challengeData === 'string' ? challengeData : challengeData.id;
    const challengeTitle = (typeof challengeData === 'object' && challengeData.title) ? challengeData.title : "¡Ir al Desafío!";

    // Verificar si ya existe un botón
    const existingBtn = document.querySelector('.challenge-btn');
    if (existingBtn) existingBtn.remove();
    
    // Detectar el curso actual
    const currentPage = window.location.pathname;
    let courseParam = 'web';
    let engineFile = 'engine.html';
    
    if (currentPage.includes('python_course')) {
        courseParam = 'python';
        engineFile = 'python_engine.html';
    } else if (currentPage.includes('ruby_course')) {
        courseParam = 'ruby';
        engineFile = 'engine.html'; // Usamos el engine estándar para Ruby/Web/DB
    } else if (currentPage.includes('database_course')) {
        courseParam = 'database';
        engineFile = 'engine.html';
    }
    
    const challengeBtn = document.createElement('button');
    challengeBtn.className = 'btn-primary mt-4 challenge-btn flex items-center gap-2 mx-auto justify-center';
    challengeBtn.innerHTML = `<i data-lucide="zap"></i> ${challengeTitle}`;
    challengeBtn.onclick = () => {
        window.location.href = `challenges/${engineFile}?id=${challengeId}&course=${courseParam}`;
    };
    
    // Si el elemento es un botón de ID 'code-challenge-btn' (el original), lo usamos o lo reemplazamos
    const originalBtn = document.getElementById('code-challenge-btn');
    if (originalBtn) {
        originalBtn.classList.remove('hidden');
        originalBtn.innerHTML = `<i data-lucide="zap"></i> ${challengeTitle}`;
        originalBtn.onclick = challengeBtn.onclick;
        // Si hay nextLevelBtn, lo ocultamos
        const nextBtn = document.getElementById('next-level-btn');
        if (nextBtn) nextBtn.classList.add('hidden');
    } else {
        resultsMessageElement.insertAdjacentElement('afterend', challengeBtn);
    }
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Verificar y mostrar challenge si corresponde
function checkAndShowChallenge(levelIndex, challengeMap) {
    const challenge = challengeMap[levelIndex];
    if (challenge) {
        const resultsMessage = document.getElementById('results-message');
        if (resultsMessage) {
            showChallengeButton(challenge, resultsMessage);
        }
    }
}
