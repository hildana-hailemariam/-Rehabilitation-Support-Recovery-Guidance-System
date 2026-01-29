document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pageSections = document.querySelectorAll('.page-section');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const reflectionForm = document.getElementById('reflectionForm');
    const medicalForm = document.getElementById('medicalForm');
    const taskForm = document.getElementById('taskForm');
    const growthForm = document.getElementById('growthForm');
    const contactForm = document.getElementById('contactForm');
    const weeklyViewBtn = document.getElementById('weeklyView');
    const monthlyViewBtn = document.getElementById('monthlyView');
    const exportTasksBtn = document.getElementById('exportTasks');
    const viewAllGrowthBtn = document.getElementById('viewAllGrowth');
    const fullGrowthData = document.getElementById('fullGrowthData');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    let taskHistory = JSON.parse(localStorage.getItem('taskHistory')) || [];
    let medicalReminders = JSON.parse(localStorage.getItem('medicalReminders')) || [];
    let reflections = JSON.parse(localStorage.getItem('reflections')) || [];
    let growthData = JSON.parse(localStorage.getItem('growthData')) || {};
    
    function updateGuidanceMessage() {
        const now = new Date();
        const hour = now.getHours();
        let message = "";
        
        if (hour < 12) {
            message = "Good morning! Start your day with a healthy breakfast and some light exercise.";
        } else if (hour < 17) {
            message = "Good afternoon! Remember to stay hydrated and take short breaks if you're working.";
        } else {
            message = "Good evening! Reflect on your day and prepare for a restful night's sleep.";
        }
        
        const guidanceMessage = document.getElementById('guidanceMessage');
        if (guidanceMessage) guidanceMessage.textContent = message;
    }
    
    function initializeNavigation() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
                
                pageSections.forEach(section => {
                    section.classList.remove('active-section');
                    if (section.id === targetId) {
                        section.classList.add('active-section');
                    }
                });
                
                navMenu.classList.remove('active');
            });
        });
        
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    function initializeReflectionForm() {
        if (reflectionForm) {
            reflectionForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const todayThoughts = document.getElementById('todayThoughts').value;
                const todayGoal = document.getElementById('todayGoal').value;
                const twoMonthsGoal = document.getElementById('twoMonthsGoal').value;
                const challenges = document.getElementById('challenges').value;
                
                const reflectionEntry = {
                    id: Date.now(),
                    date: new Date().toLocaleDateString(),
                    timestamp: new Date().toISOString(),
                    todayThoughts,
                    todayGoal,
                    twoMonthsGoal,
                    challenges
                };
                
                reflections.unshift(reflectionEntry);
                localStorage.setItem('reflections', JSON.stringify(reflections));
                
                alert('Your reflections and goals have been saved successfully!');
                reflectionForm.reset();
                updateReflectionsDisplay();
                updateDataSummary();
            });
        }
    }
    
    function initializeMedicalForm() {
        if (medicalForm) {
            medicalForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const medicineName = document.getElementById('medicineName').value;
                const medicineTime = document.getElementById('medicineTime').value;
                
                if (!medicineName || !medicineTime) {
                    const medicalNotice = document.getElementById('medicalNotice');
                    medicalNotice.textContent = "Please fill in all fields.";
                    medicalNotice.style.color = "red";
                    return;
                }
                
                const reminder = {
                    id: Date.now(),
                    name: medicineName,
                    time: medicineTime,
                    date: new Date().toLocaleDateString()
                };
                
                medicalReminders.push(reminder);
                localStorage.setItem('medicalReminders', JSON.stringify(medicalReminders));
                
                updateMedicalDisplay();
                medicalForm.reset();
                
                const medicalNotice = document.getElementById('medicalNotice');
                medicalNotice.textContent = "Medical reminder saved successfully!";
                medicalNotice.style.color = "green";
                
                setTimeout(() => {
                    medicalNotice.textContent = "";
                }, 3000);
                
                updateDataSummary();
            });
        }
    }
    
    function updateReflectionsDisplay() {
        const reflectionsList = document.getElementById('reflectionsList');
        if (!reflectionsList) return;
        
        if (reflections.length === 0) {
            reflectionsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comment-dots"></i>
                    <h3>No reflections saved yet</h3>
                    <p>Add your first reflection using the form above.</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        reflections.slice(0, 10).forEach(reflection => {
            html += `
                <div class="reflection-item">
                    <h4>Daily Reflection <span class="reflection-date">${reflection.date}</span></h4>
                    <div class="reflection-content">
                        <div class="reflection-field">
                            <strong>Today's Thoughts:</strong>
                            <p>${reflection.todayThoughts}</p>
                        </div>
                        <div class="reflection-field">
                            <strong>Today's Goal:</strong>
                            <p>${reflection.todayGoal}</p>
                        </div>
                        <div class="reflection-field">
                            <strong>2-Month Vision:</strong>
                            <p>${reflection.twoMonthsGoal}</p>
                        </div>
                        <div class="reflection-field">
                            <strong>Anticipated Challenges:</strong>
                            <p>${reflection.challenges}</p>
                        </div>
                    </div>
                </div>
            `;
        });
        
        reflectionsList.innerHTML = html;
    }
    
    function updateMedicalDisplay() {
        const medicalList = document.getElementById('medicalList');
        if (!medicalList) return;
        
        if (medicalReminders.length === 0) {
            medicalList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-pills"></i>
                    <h3>No medical reminders</h3>
                    <p>Add your first medical reminder using the form above.</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        medicalReminders.forEach(reminder => {
            html += `
                <div class="medical-item">
                    <div class="medicine-info">
                        <div class="medicine-name">${reminder.name}</div>
                        <div class="medicine-time">${reminder.time} - ${reminder.date}</div>
                    </div>
                    <div class="medicine-actions">
                        <button class="delete-medicine" data-id="${reminder.id}">Delete</button>
                    </div>
                </div>
            `;
        });
        
        medicalList.innerHTML = html;
        
        document.querySelectorAll('.delete-medicine').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                medicalReminders = medicalReminders.filter(reminder => reminder.id !== id);
                localStorage.setItem('medicalReminders', JSON.stringify(medicalReminders));
                updateMedicalDisplay();
                updateDataSummary();
            });
        });
    }
    
    function updateGrowthInsights() {
        if (Object.keys(growthData).length === 0) {
            document.getElementById('insight-time').textContent = 'Not recorded yet';
            document.getElementById('insight-motivation').textContent = 'Not recorded yet';
            document.getElementById('insight-achievement').textContent = 'Not recorded yet';
            document.getElementById('insight-goal').textContent = 'Not recorded yet';
            return;
        }
        
        if (growthData.timeInRehab) {
            document.getElementById('insight-time').textContent = growthData.timeInRehab;
        }
        if (growthData.motivation) {
            const shortMotivation = growthData.motivation.length > 100 
                ? growthData.motivation.substring(0, 100) + '...' 
                : growthData.motivation;
            document.getElementById('insight-motivation').textContent = shortMotivation;
        }
        if (growthData.achievementSoFar) {
            const shortAchievement = growthData.achievementSoFar.length > 100 
                ? growthData.achievementSoFar.substring(0, 100) + '...' 
                : growthData.achievementSoFar;
            document.getElementById('insight-achievement').textContent = shortAchievement;
        }
        if (growthData.sixMonthsGoal) {
            const shortGoal = growthData.sixMonthsGoal.length > 100 
                ? growthData.sixMonthsGoal.substring(0, 100) + '...' 
                : growthData.sixMonthsGoal;
            document.getElementById('insight-goal').textContent = shortGoal;
        }
        
        updateFullGrowthData();
    }
    
    function updateFullGrowthData() {
        const fullGrowthDataDiv = document.getElementById('fullGrowthData');
        if (!fullGrowthDataDiv) return;
        
        if (Object.keys(growthData).length === 0) {
            fullGrowthDataDiv.innerHTML = '<div class="empty-state"><i class="fas fa-chart-line"></i><h3>No growth data saved yet</h3><p>Add your growth reflection using the form above.</p></div>';
            return;
        }
        
        const growthFieldLabels = {
            timeInRehab: 'Time in Rehabilitation',
            whyGoal: 'Why This Goal Matters',
            motivation: 'Motivation to Stay Sober',
            challengesFaced: 'Challenges Faced',
            habitsToBuild: 'Habits to Build',
            habitsToStop: 'Habits to Stop',
            feelToday: 'How I Feel Today',
            supportSystem: 'My Support System',
            achievementSoFar: 'Biggest Achievement',
            fear: 'Biggest Fear',
            futureAchievement: '2-Month Goal',
            successMeasure: 'How I Measure Success',
            lessonsLearned: 'Lessons Learned',
            rewardSystem: 'Reward System',
            sixMonthsGoal: '6-Month Goal',
            lastUpdated: 'Last Updated'
        };
        
        let html = '';
        for (const [key, value] of Object.entries(growthData)) {
            if (key === 'lastUpdated') continue;
            if (value) {
                html += `
                    <div class="growth-field">
                        <strong>${growthFieldLabels[key] || key}:</strong>
                        <p>${value}</p>
                    </div>
                `;
            }
        }
        
        if (growthData.lastUpdated) {
            html += `<p><em>Last updated: ${growthData.lastUpdated}</em></p>`;
        }
        
        fullGrowthDataDiv.innerHTML = html;
    }
    
    function initializeTaskForm() {
        if (taskForm) {
            taskForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const taskName = document.getElementById('taskName').value;
                const taskQuality = document.getElementById('taskQuality').value;
                const taskReflection = document.getElementById('taskReflection').value;
                
                const taskEntry = {
                    id: Date.now(),
                    date: new Date().toLocaleDateString(),
                    timestamp: new Date().toISOString(),
                    activity: taskName,
                    quality: taskQuality,
                    reflection: taskReflection
                };
                
                taskHistory.unshift(taskEntry);
                localStorage.setItem('taskHistory', JSON.stringify(taskHistory));
                
                updateTaskHistoryTable();
                updateDataSummary();
                taskForm.reset();
                
                alert('Task and reflection saved successfully!');
            });
        }
    }
    
    function updateTaskHistoryTable() {
        const taskHistoryTable = document.getElementById('taskHistoryTable');
        if (!taskHistoryTable) return;
        
        if (taskHistory.length === 0) {
            taskHistoryTable.innerHTML = `
                <tr>
                    <td colspan="4" class="empty-state">
                        <i class="fas fa-clipboard-list"></i>
                        <h3>No tasks recorded yet</h3>
                        <p>Add your first task using the form above.</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        const displayCount = weeklyViewBtn.classList.contains('active') ? 7 : 30;
        const displayTasks = taskHistory.slice(0, displayCount);
        
        let html = '';
        displayTasks.forEach(entry => {
            const qualityBadge = entry.quality === 'good' 
                ? '<span class="quality-badge good">Good Day</span>'
                : '<span class="quality-badge weak">Weak Day</span>';
            
            html += `
                <tr>
                    <td>${entry.date}</td>
                    <td>${entry.activity}</td>
                    <td>${qualityBadge}</td>
                    <td>${entry.reflection}</td>
                </tr>
            `;
        });
        
        taskHistoryTable.innerHTML = html;
    }
    
    function updateDataSummary() {
        document.getElementById('tasksCount').textContent = taskHistory.length;
        
        const uniqueDates = [...new Set(taskHistory.map(item => item.date))];
        document.getElementById('daysTracked').textContent = uniqueDates.length;
        
        document.getElementById('medicalCount').textContent = medicalReminders.length;
        
        if (taskHistory.length > 0) {
            const goodDays = taskHistory.filter(entry => entry.quality === 'good').length;
            const percentage = Math.round((goodDays / taskHistory.length) * 100);
            document.getElementById('goodDays').textContent = `${percentage}%`;
            
            const motivationMessage = document.getElementById('motivationMessage');
            if (motivationMessage) {
                let message = `You've recorded ${taskHistory.length} activities. `;
                
                if (percentage >= 80) {
                    message += `Excellent! You're doing great with ${percentage}% good days.`;
                } else if (percentage >= 60) {
                    message += `Good job! You have ${percentage}% good days.`;
                } else if (percentage >= 40) {
                    message += `You have ${percentage}% good days. Keep going!`;
                } else {
                    message += `You have ${percentage}% good days. Every day is a new opportunity.`;
                }
                
                motivationMessage.textContent = message;
            }
        } else {
            document.getElementById('goodDays').textContent = "0%";
        }
    }
    
    function initializeGrowthForm() {
        if (growthForm) {
            growthForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = {};
                const formElements = growthForm.querySelectorAll('input, textarea, select');
                
                formElements.forEach(element => {
                    if (element.id) {
                        formData[element.id] = element.value;
                    }
                });
                
                formData.lastUpdated = new Date().toLocaleString();
                growthData = formData;
                
                localStorage.setItem('growthData', JSON.stringify(growthData));
                
                alert('Growth reflection saved successfully!');
                updateGrowthInsights();
                updateDataSummary();
            });
        }
    }
    
    function initializeContactForm() {
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const contactName = document.getElementById('contactName').value;
                const contactEmail = document.getElementById('contactEmail').value;
                const contactSubject = document.getElementById('contactSubject').value;
                const contactMessage = document.getElementById('contactMessage').value;
                
                console.log('Contact form submitted:', { contactName, contactEmail, contactSubject, contactMessage });
                
                alert('Thank you for your message! We will respond within 24 hours.');
                contactForm.reset();
            });
        }
    }
    
    function initializeTabSystem() {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tabId}-tab`) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }
    
    function initializeFilterButtons() {
        if (weeklyViewBtn && monthlyViewBtn) {
            weeklyViewBtn.addEventListener('click', function() {
                weeklyViewBtn.classList.add('active');
                monthlyViewBtn.classList.remove('active');
                updateTaskHistoryTable();
            });
            
            monthlyViewBtn.addEventListener('click', function() {
                monthlyViewBtn.classList.add('active');
                weeklyViewBtn.classList.remove('active');
                updateTaskHistoryTable();
            });
        }
    }
    
    function initializeExportButton() {
        if (exportTasksBtn) {
            exportTasksBtn.addEventListener('click', function() {
                if (taskHistory.length === 0) {
                    alert('No data to export.');
                    return;
                }
                
                const dataStr = JSON.stringify(taskHistory, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                
                const exportFileDefaultName = 'rehab-tasks-data.json';
                
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
            });
        }
    }
    
    function initializeViewAllGrowth() {
        if (viewAllGrowthBtn) {
            viewAllGrowthBtn.addEventListener('click', function() {
                if (fullGrowthData.style.display === 'none' || fullGrowthData.style.display === '') {
                    fullGrowthData.style.display = 'block';
                    viewAllGrowthBtn.textContent = 'Hide Full Data';
                } else {
                    fullGrowthData.style.display = 'none';
                    viewAllGrowthBtn.textContent = 'View All Growth Data';
                }
            });
        }
    }
    
    function loadStoredData() {
        updateReflectionsDisplay();
        updateMedicalDisplay();
        updateTaskHistoryTable();
        updateGrowthInsights();
        updateDataSummary();
        updateGuidanceMessage();
        
        if (reflections.length > 0 && document.getElementById('todayThoughts')) {
            const latestReflection = reflections[0];
            document.getElementById('todayThoughts').value = latestReflection.todayThoughts || '';
            document.getElementById('todayGoal').value = latestReflection.todayGoal || '';
            document.getElementById('twoMonthsGoal').value = latestReflection.twoMonthsGoal || '';
            document.getElementById('challenges').value = latestReflection.challenges || '';
        }
        
        if (Object.keys(growthData).length > 0) {
            Object.keys(growthData).forEach(key => {
                const element = document.getElementById(key);
                if (element && growthData[key] && key !== 'lastUpdated') {
                    element.value = growthData[key];
                }
            });
        }
    }
    
    function initializeSystem() {
        initializeNavigation();
        initializeReflectionForm();
        initializeMedicalForm();
        initializeTaskForm();
        initializeGrowthForm();
        initializeContactForm();
        initializeTabSystem();
        initializeFilterButtons();
        initializeExportButton();
        initializeViewAllGrowth();
        loadStoredData();
        
        setInterval(updateGuidanceMessage, 60000);
    }
    
    initializeSystem();
});
