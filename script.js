document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
    
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            answer.classList.toggle('active');
            
            if (answer.classList.contains('active')) {
                icon.className = 'fas fa-chevron-up';
            } else {
                icon.className = 'fas fa-chevron-down';
            }
            
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    const otherAnswer = otherQuestion.nextElementSibling;
                    const otherIcon = otherQuestion.querySelector('i');
                    otherAnswer.classList.remove('active');
                    otherIcon.className = 'fas fa-chevron-down';
                }
            });
        });
    });
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId + '-tab') {
                    content.classList.add('active');
                }
            });
        });
    });
    
    let activities = JSON.parse(localStorage.getItem('activities')) || [];
    let reflections = JSON.parse(localStorage.getItem('reflections')) || [];
    let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    let goals = JSON.parse(localStorage.getItem('goals')) || {};
    
    const dailyTips = [
        "Start your day with positive affirmations and set realistic goals.",
        "Take a 5-minute break every hour to stretch and breathe deeply.",
        "Practice gratitude by writing down three things you're thankful for.",
        "Stay hydrated - drink at least 8 glasses of water today.",
        "Connect with someone supportive in your life.",
        "Take a short walk outside to refresh your mind.",
        "Listen to calming music during breaks to reduce stress.",
        "Celebrate small victories - every step forward counts!",
        "Practice deep breathing for 5 minutes to calm your mind.",
        "Set a reminder to take your medications on time."
    ];
    
    const dailyTipElement = document.getElementById('daily-tip');
    const newTipButton = document.getElementById('new-tip');
    
    if (dailyTipElement) {
        const randomTip = dailyTips[Math.floor(Math.random() * dailyTips.length)];
        dailyTipElement.textContent = randomTip;
    }
    
    if (newTipButton) {
        newTipButton.addEventListener('click', function() {
            const randomTip = dailyTips[Math.floor(Math.random() * dailyTips.length)];
            dailyTipElement.textContent = randomTip;
        });
    }
    
    const reflectionForm = document.getElementById('reflection-form');
    if (reflectionForm) {
        reflectionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const thoughts = document.getElementById('thoughts').value;
            const goal = document.getElementById('goal').value;
            
            const reflection = {
                id: Date.now(),
                date: new Date().toLocaleDateString(),
                thoughts: thoughts,
                goal: goal
            };
            
            reflections.unshift(reflection);
            localStorage.setItem('reflections', JSON.stringify(reflections));
            
            alert('Reflection saved successfully!');
            reflectionForm.reset();
            updateReflectionsDisplay();
            updateStats();
        });
    }
    
    const activityForm = document.getElementById('activity-form');
    if (activityForm) {
        activityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const activity = document.getElementById('activity').value;
            const quality = document.getElementById('quality').value;
            const reflection = document.getElementById('reflection').value;
            
            const activityEntry = {
                id: Date.now(),
                date: new Date().toLocaleDateString(),
                activity: activity,
                quality: quality,
                reflection: reflection
            };
            
            activities.unshift(activityEntry);
            localStorage.setItem('activities', JSON.stringify(activities));
            
            alert('Activity saved successfully!');
            activityForm.reset();
            updateActivitiesDisplay();
            updateStats();
        });
    }
    
    const medicalForm = document.getElementById('medical-form');
    if (medicalForm) {
        medicalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const medicine = document.getElementById('medicine').value;
            const time = document.getElementById('time').value;
            
            if (!medicine || !time) {
                alert('Please fill in all fields');
                return;
            }
            
            const reminder = {
                id: Date.now(),
                medicine: medicine,
                time: time,
                date: new Date().toLocaleDateString()
            };
            
            reminders.unshift(reminder);
            localStorage.setItem('reminders', JSON.stringify(reminders));
            
            medicalForm.reset();
            updateRemindersDisplay();
            updateStats();
        });
    }
    
    const goalsForm = document.getElementById('goals-form');
    if (goalsForm) {
        goalsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const shortGoal = document.getElementById('short-goal').value;
            const longGoal = document.getElementById('long-goal').value;
            const motivation = document.getElementById('motivation').value;
            
            goals = {
                shortTerm: shortGoal,
                longTerm: longGoal,
                motivation: motivation,
                lastUpdated: new Date().toLocaleDateString()
            };
            
            localStorage.setItem('goals', JSON.stringify(goals));
            
            alert('Goals saved successfully!');
        });
        
        if (goals.shortTerm) {
            document.getElementById('short-goal').value = goals.shortTerm;
        }
        if (goals.longTerm) {
            document.getElementById('long-goal').value = goals.longTerm;
        }
        if (goals.motivation) {
            document.getElementById('motivation').value = goals.motivation;
        }
    }
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !subject || !message) {
                showMessage('Please fill in all fields', 'error');
                return;
            }
            
            showMessage('Thank you for your message! We will respond within 24 hours.', 'success');
            
            contactForm.reset();
            
            setTimeout(() => {
                const messageDiv = document.getElementById('form-message');
                messageDiv.style.display = 'none';
            }, 5000);
        });
    }
    
    function showMessage(text, type) {
        const messageDiv = document.getElementById('form-message');
        messageDiv.textContent = text;
        messageDiv.className = '';
        messageDiv.classList.add(type);
    }
    
    function updateActivitiesDisplay() {
        const table = document.getElementById('activities-table');
        if (!table) return;
        
        if (activities.length === 0) {
            table.innerHTML = '<tr><td colspan="3" class="empty">No activities recorded yet</td></tr>';
            return;
        }
        
        let html = '';
        activities.slice(0, 10).forEach(activity => {
            let qualityColor = '#95a5a6';
            switch(activity.quality) {
                case 'good': qualityColor = '#27ae60'; break;
                case 'average': qualityColor = '#f39c12'; break;
                case 'challenging': qualityColor = '#e74c3c'; break;
            }
            
            html += `
                <tr>
                    <td>${activity.date}</td>
                    <td>${activity.activity}</td>
                    <td style="color: ${qualityColor}; font-weight: bold;">
                        ${activity.quality.charAt(0).toUpperCase() + activity.quality.slice(1)}
                    </td>
                </tr>
            `;
        });
        
        table.innerHTML = html;
    }
    
    function updateReflectionsDisplay() {
        const list = document.getElementById('reflections-list');
        if (!list) return;
        
        if (reflections.length === 0) {
            list.innerHTML = '<p class="empty">No reflections yet</p>';
            return;
        }
        
        let html = '';
        reflections.slice(0, 5).forEach(reflection => {
            html += `
                <div class="reflection-item" style="margin-bottom: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 5px;">
                    <strong style="color: #2c3e50;">${reflection.date}</strong>
                    <p style="margin: 0.5rem 0;"><strong>Thoughts:</strong> ${reflection.thoughts}</p>
                    <p style="margin: 0.5rem 0;"><strong>Goal:</strong> ${reflection.goal}</p>
                </div>
            `;
        });
        
        list.innerHTML = html;
    }
    
    function updateRemindersDisplay() {
        const list = document.getElementById('reminders-list');
        if (!list) return;
        
        if (reminders.length === 0) {
            list.innerHTML = '<li class="empty">No reminders set</li>';
            return;
        }
        
        let html = '';
        reminders.slice(0, 5).forEach(reminder => {
            html += `
                <li>
                    <div>
                        <strong>${reminder.medicine}</strong>
                        <div>${reminder.time} - ${reminder.date}</div>
                    </div>
                    <button onclick="deleteReminder(${reminder.id})" style="background: #e74c3c; color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 3px; cursor: pointer;">×</button>
                </li>
            `;
        });
        
        list.innerHTML = html;
    }
    
    function updateStats() {
        const totalActivities = document.getElementById('total-activities');
        if (totalActivities) {
            totalActivities.textContent = activities.length;
        }
        
        const daysTracked = document.getElementById('days-tracked');
        if (daysTracked) {
            const uniqueDates = [...new Set(activities.map(a => a.date))];
            daysTracked.textContent = uniqueDates.length;
        }
        
        const totalReminders = document.getElementById('total-reminders');
        if (totalReminders) {
            totalReminders.textContent = reminders.length;
        }
        
        const goodDays = document.getElementById('good-days');
        if (goodDays) {
            if (activities.length > 0) {
                const goodCount = activities.filter(a => a.quality === 'good').length;
                const percentage = Math.round((goodCount / activities.length) * 100);
                goodDays.textContent = percentage + '%';
            } else {
                goodDays.textContent = '0%';
            }
        }
    }
    
    updateActivitiesDisplay();
    updateReflectionsDisplay();
    updateRemindersDisplay();
    updateStats();
});

function deleteReminder(id) {
    let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    reminders = reminders.filter(reminder => reminder.id !== id);
    localStorage.setItem('reminders', JSON.stringify(reminders));
    
    const list = document.getElementById('reminders-list');
    if (list) {
        if (reminders.length === 0) {
            list.innerHTML = '<li class="empty">No reminders set</li>';
        } else {
            let html = '';
            reminders.slice(0, 5).forEach(reminder => {
                html += `
                    <li>
                        <div>
                            <strong>${reminder.medicine}</strong>
                            <div>${reminder.time} - ${reminder.date}</div>
                        </div>
                        <button onclick="deleteReminder(${reminder.id})" style="background: #e74c3c; color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 3px; cursor: pointer;">×</button>
                    </li>
                `;
            });
            list.innerHTML = html;
        }
    }
    
    const totalReminders = document.getElementById('total-reminders');
    if (totalReminders) {
        totalReminders.textContent = reminders.length;
    }
}
