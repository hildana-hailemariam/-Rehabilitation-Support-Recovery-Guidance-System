document.addEventListener('DOMContentLoaded', function() {
    
    initializeTheme();
    initializePreloader();
    initializeNavigation();
    initializeAllForms();
    initializeReflections();
    initializeActivities();
    initializeReminders();
    initializeGoals();
    initializeTips();
    initializeTestimonialSlider();
    initializeFAQs();
    initializeScrollToTop();
    initializeNotifications();
    
    console.log('RehabGrowth initialized successfully!');
});

function initializeTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle?.querySelector('i');
    
    if (!themeToggle || !themeIcon) return;
    
    const savedTheme = localStorage.getItem('rehabGrowthTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('rehabGrowthTheme', newTheme);
        
        updateThemeIcon(newTheme);
        
        showNotification(`Switched to ${newTheme} mode`, 'success');
    });
    
    function updateThemeIcon(theme) {
        const themeIcon = document.querySelector('.theme-toggle i');
        if (!themeIcon) return;
        
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
}
function initializePreloader() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 800);
        });
    }
}
function initializeNavigation() {
    
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    });
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    const chatBtn = document.getElementById('chat-btn');
    if (chatBtn) {
        chatBtn.removeEventListener('click', () => {});
        chatBtn.style.display = 'none'; 
    }
}

function initializeAllForms() {
    initializeReflectionForm();
    initializeActivityForm();
    initializeMedicationForm();
    initializeGoalsForm();
    initializeContactForm();
    initializeSuccessStoryForm();
}

function initializeReflectionForm() {
    const reflectionForm = document.getElementById('reflection-form');
    if (!reflectionForm) return;
    
    let selectedMood = null;
    
    document.querySelectorAll('.mood-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            selectedMood = this.dataset.mood;
            document.getElementById('selected-mood').value = selectedMood;
        });
    });
    
    reflectionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const thoughts = document.getElementById('thoughts').value.trim();
        const mood = selectedMood;
        
        if (!thoughts) {
            showNotification('Please enter your thoughts', 'warning');
            return;
        }
        
        if (!mood) {
            showNotification('Please select your mood', 'warning');
            return;
        }
        
        const reflection = {
            id: Date.now(),
            date: new Date().toLocaleDateString('en-US', { 
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            thoughts: thoughts,
            mood: mood,
            moodEmoji: getMoodEmoji(mood)
        };
        
        saveReflection(reflection);
        updateReflectionHistory();
        
        reflectionForm.reset();
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
        selectedMood = null;
        
        showNotification('Reflection saved successfully!', 'success');
    });
    
    const clearBtn = document.getElementById('clear-reflection-history');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all your reflection history? This cannot be undone.')) {
                localStorage.removeItem('rehabGrowthReflections');
                updateReflectionHistory();
                showNotification('Reflection history cleared', 'info');
            }
        });
    }
}

function initializeActivityForm() {
    const activityForm = document.getElementById('activity-form');
    if (!activityForm) return;
    
    activityForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const type = document.getElementById('activity-type').value;
        const duration = document.getElementById('duration').value;
        const notes = document.getElementById('activity-notes').value.trim();
        
        if (!type) {
            showNotification('Please select an activity type', 'warning');
            return;
        }
        
        if (!duration || duration < 1 || duration > 240) {
            showNotification('Please enter a valid duration (1-240 minutes)', 'warning');
            return;
        }
        const activity = {
            id: Date.now(),
            date: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            type: type,
            duration: parseInt(duration),
            notes: notes
        };
        
        saveActivity(activity);
        updateActivityStats();
        displayActivities();
        activityForm.reset();
        
        showNotification('Activity logged successfully!', 'success');
    });
}
function initializeMedicationForm() {
    const medicationForm = document.getElementById('medical-form');
    if (!medicationForm) return;
    
    medicationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const medicine = document.getElementById('medicine').value.trim();
        const time = document.getElementById('medicine-time').value;
        
        if (!medicine || !time) {
            showNotification('Please fill in all fields', 'warning');
            return;
        }
        
        const reminder = {
            id: Date.now(),
            medicine: medicine,
            time: time,
            date: new Date().toLocaleDateString(),
            completed: false
        };
        
        saveReminder(reminder);
        displayReminders();
        
        medicationForm.reset();
        
        showNotification('Medication reminder added!', 'success');
    });
}
function initializeGoalsForm() {
    const goalsForm = document.getElementById('goals-form');
    if (!goalsForm) return;
    
    const savedGoals = JSON.parse(localStorage.getItem('rehabGrowthGoals') || '{}');
    if (savedGoals.short) {
        document.getElementById('short-goal').value = savedGoals.short;
    }
    if (savedGoals.long) {
        document.getElementById('long-goal').value = savedGoals.long;
    }
    
    goalsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const shortGoal = document.getElementById('short-goal').value.trim();
        const longGoal = document.getElementById('long-goal').value.trim();
        
        const goals = {
            short: shortGoal,
            long: longGoal,
            updated: new Date().toLocaleDateString()
        };
        
        localStorage.setItem('rehabGrowthGoals', JSON.stringify(goals));
        updateGoalsDisplay();
        
        showNotification('Goals updated successfully!', 'success');
    });
}

function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();
        
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all required fields', 'warning');
            return;
        }
        
        if (!validateEmail(email)) {
            showNotification('Please enter a valid email address', 'warning');
            return;
        }
        showNotification('Message sent successfully! We\'ll respond within 24 hours.', 'success');
        
        contactForm.reset();
    });
}
function initializeSuccessStoryForm() {
    const storyForm = document.getElementById('success-story-form');
    if (!storyForm) return;
    const stars = document.querySelectorAll('.stars i');
    const ratingInput = document.getElementById('story-rating');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.dataset.rating;
            ratingInput.value = rating;
            
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.remove('far');
                    s.classList.add('fas', 'active');
                } else {
                    s.classList.remove('fas', 'active');
                    s.classList.add('far');
                }
            });
        });
        star.addEventListener('mouseover', function() {
            const rating = this.dataset.rating;
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.style.color = '#ffc107';
                }
            });
        });
        
        star.addEventListener('mouseout', function() {
            stars.forEach(s => {
                if (!s.classList.contains('active')) {
                    s.style.color = '';
                }
            });
        });
    });
    storyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (ratingInput.value === '0') {
            showNotification('Please rate your experience', 'warning');
            return;
        }
        
        storyForm.style.display = 'none';
        const successMessage = document.getElementById('story-success');
        if (successMessage) {
            successMessage.style.display = 'block';
        }
        
        showNotification('Thank you for sharing your story! We may contact you for more details.', 'success');
    });
}
function initializeReflections() {
    
    if (!localStorage.getItem('rehabGrowthReflections')) {
        const sampleReflections = [
            {
                id: 1,
                date: 'Mon, Jan 15, 2024, 09:30 AM',
                thoughts: 'Feeling positive about my recovery journey today. Made progress with my exercises!',
                mood: 'happy',
                moodEmoji: '😊'
            },
            {
                id: 2,
                date: 'Sun, Jan 14, 2024, 07:45 PM',
                thoughts: 'Challenging day but stayed committed to my goals. Tomorrow will be better.',
                mood: 'neutral',
                moodEmoji: '😐'
            }
        ];
        localStorage.setItem('rehabGrowthReflections', JSON.stringify(sampleReflections));
    }
    
    updateReflectionHistory();
}

function saveReflection(reflection) {
    let reflections = JSON.parse(localStorage.getItem('rehabGrowthReflections') || '[]');
    reflections.unshift(reflection); 
    localStorage.setItem('rehabGrowthReflections', JSON.stringify(reflections));
}
function updateReflectionHistory() {
    const historyContainer = document.getElementById('reflection-history');
    if (!historyContainer) return;
    
    const reflections = JSON.parse(localStorage.getItem('rehabGrowthReflections') || '[]');
    
    if (reflections.length === 0) {
        historyContainer.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-book-open"></i>
                <p>No reflections yet. Start by saving your first reflection above!</p>
            </div>
        `;
        return;
    }
    const recentReflections = reflections.slice(0, 10);
    
    historyContainer.innerHTML = recentReflections.map(reflection => `
        <div class="history-item" data-id="${reflection.id}">
            <div class="reflection-header">
                <div class="reflection-date">${reflection.date}</div>
                <div class="reflection-mood">${reflection.moodEmoji} ${reflection.mood}</div>
            </div>
            <div class="reflection-text">${reflection.thoughts}</div>
            <button onclick="deleteReflection(${reflection.id})" class="delete-btn" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function deleteReflection(id) {
    if (!confirm('Are you sure you want to delete this reflection?')) return;
    
    let reflections = JSON.parse(localStorage.getItem('rehabGrowthReflections') || '[]');
    reflections = reflections.filter(r => r.id !== id);
    localStorage.setItem('rehabGrowthReflections', JSON.stringify(reflections));
    updateReflectionHistory();
    showNotification('Reflection deleted', 'info');
}

function getMoodEmoji(mood) {
    const emojis = {
        'happy': '😊',
        'neutral': '😐',
        'sad': '😔',
        'anxious': '😰',
        'energetic': '💪'
    };
    return emojis[mood] || '😐';
}
function initializeActivities() {
    if (!localStorage.getItem('rehabGrowthActivities')) {
        const sampleActivities = [
            {
                id: 1,
                date: 'Jan 15, 9:00 AM',
                type: 'Walking',
                duration: 30,
                notes: 'Morning walk in the park'
            },
            {
                id: 2,
                date: 'Jan 14, 3:00 PM',
                type: 'Stretching',
                duration: 20,
                notes: 'Focused on back stretches'
            }
        ];
        localStorage.setItem('rehabGrowthActivities', JSON.stringify(sampleActivities));
    }
    
    updateActivityStats();
    displayActivities();
}

function saveActivity(activity) {
    let activities = JSON.parse(localStorage.getItem('rehabGrowthActivities') || '[]');
    activities.unshift(activity);
    localStorage.setItem('rehabGrowthActivities', JSON.stringify(activities));
}

function updateActivityStats() {
    const activities = JSON.parse(localStorage.getItem('rehabGrowthActivities') || '[]');
    
    const totalActivities = document.getElementById('total-activities');
    const daysTracked = document.getElementById('days-tracked');
    
    if (totalActivities) {
        totalActivities.textContent = activities.length;
    }
    
    if (daysTracked) {
        const uniqueDays = new Set(activities.map(a => {
            const date = new Date(a.id);
            return date.toDateString();
        })).size;
        daysTracked.textContent = uniqueDays;
    }
}

function displayActivities() {
    const activityList = document.getElementById('activity-history-list');
    if (!activityList) return;
    
    const activities = JSON.parse(localStorage.getItem('rehabGrowthActivities') || '[]');
    
    if (activities.length === 0) {
        activityList.innerHTML = '<li>No activities logged yet</li>';
        return;
    }
    const recentActivities = activities.slice(0, 5);
    
    activityList.innerHTML = recentActivities.map(activity => `
        <li>
            <div class="activity-item">
                <div class="activity-header">
                    <strong>${activity.type}</strong>
                    <span class="activity-duration">${activity.duration} min</span>
                </div>
                <div class="activity-details">
                    <small>${activity.date}</small>
                    ${activity.notes ? `<p class="activity-notes">${activity.notes}</p>` : ''}
                </div>
            </div>
        </li>
    `).join('');
}
function initializeReminders() {
    displayReminders();
}

function saveReminder(reminder) {
    let reminders = JSON.parse(localStorage.getItem('rehabGrowthReminders') || '[]');
    reminders.unshift(reminder);
    localStorage.setItem('rehabGrowthReminders', JSON.stringify(reminders));
}

function displayReminders() {
    const remindersContainer = document.getElementById('reminders-container');
    if (!remindersContainer) return;
    
    const reminders = JSON.parse(localStorage.getItem('rehabGrowthReminders') || '[]');
    
    if (reminders.length === 0) {
        remindersContainer.innerHTML = '<li class="no-reminders">No reminders set for today</li>';
        return;
    }
    const today = new Date().toLocaleDateString();
    const todayReminders = reminders.filter(r => r.date === today);
    
    if (todayReminders.length === 0) {
        remindersContainer.innerHTML = '<li class="no-reminders">No reminders set for today</li>';
        return;
    }
    
    remindersContainer.innerHTML = todayReminders.map(reminder => `
        <li data-id="${reminder.id}">
            <div class="reminder-info">
                <strong>${reminder.medicine}</strong>
                <small>${reminder.time}</small>
            </div>
            <button onclick="toggleReminder(${reminder.id})" class="reminder-toggle ${reminder.completed ? 'completed' : ''}" title="${reminder.completed ? 'Mark as pending' : 'Mark as taken'}">
                <i class="fas fa-${reminder.completed ? 'check-circle' : 'circle'}"></i>
            </button>
            <button onclick="deleteReminder(${reminder.id})" class="delete-btn" title="Delete">
                ×
            </button>
        </li>
    `).join('');
}

function toggleReminder(id) {
    let reminders = JSON.parse(localStorage.getItem('rehabGrowthReminders') || '[]');
    reminders = reminders.map(reminder => {
        if (reminder.id === id) {
            reminder.completed = !reminder.completed;
        }
        return reminder;
    });
    localStorage.setItem('rehabGrowthReminders', JSON.stringify(reminders));
    displayReminders();
    showNotification('Reminder updated', 'info');
}

function deleteReminder(id) {
    if (!confirm('Delete this reminder?')) return;
    
    let reminders = JSON.parse(localStorage.getItem('rehabGrowthReminders') || '[]');
    reminders = reminders.filter(r => r.id !== id);
    localStorage.setItem('rehabGrowthReminders', JSON.stringify(reminders));
    displayReminders();
    showNotification('Reminder deleted', 'info');
}
function initializeGoals() {
    if (!localStorage.getItem('rehabGrowthGoals')) {
        const sampleGoals = {
            short: 'Walk 30 minutes daily',
            long: 'Reduce pain by 50% this month',
            updated: new Date().toLocaleDateString()
        };
        localStorage.setItem('rehabGrowthGoals', JSON.stringify(sampleGoals));
    }
    
    updateGoalsDisplay();
    updateProgress();
}

function updateGoalsDisplay() {
    const goalsList = document.getElementById('goals-list');
    if (!goalsList) return;
    
    const goals = JSON.parse(localStorage.getItem('rehabGrowthGoals') || '{}');
    
    if (!goals.short && !goals.long) {
        goalsList.innerHTML = '<li class="no-goals">No goals set yet. Set your first goal above!</li>';
        return;
    }
    
    let html = '';
    if (goals.short) {
        html += `
            <li class="goal-item">
                <div class="goal-type">Short-term Goal:</div>
                <div class="goal-text">${goals.short}</div>
            </li>
        `;
    }
    if (goals.long) {
        html += `
            <li class="goal-item">
                <div class="goal-type">Long-term Goal:</div>
                <div class="goal-text">${goals.long}</div>
            </li>
        `;
    }
    
    goalsList.innerHTML = html;
}

function updateProgress() {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (!progressFill || !progressText) return;
    
    const activities = JSON.parse(localStorage.getItem('rehabGrowthActivities') || '[]');
    const completedCount = activities.length;
    const targetCount = 7; 
    
    let progress = Math.min((completedCount / targetCount) * 100, 100);
    if (isNaN(progress)) progress = 0;
    
    setTimeout(() => {
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}% of weekly goal completed`;
        if (progress >= 100) {
            progressFill.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
        } else if (progress >= 50) {
            progressFill.style.background = 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)';
        } else {
            progressFill.style.background = 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)';
        }
    }, 100);
}
function initializeTips() {
    const tipButton = document.getElementById('new-tip-btn');
    if (!tipButton) return;
    const wellnessTips = [
        {
            text: "Start your day with 5 minutes of deep breathing to reduce stress and increase focus.",
            author: "Dr. Sarah Johnson",
            role: "Rehabilitation Specialist",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&q=80"
        },
        {
            text: "Stay hydrated throughout the day. Drink at least 8 glasses of water to maintain energy levels.",
            author: "Dr. Michael Chen",
            role: "Nutrition Specialist",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
        },
        {
            text: "Take short breaks every hour to stretch and prevent muscle stiffness.",
            author: "Emma Wilson",
            role: "Physical Therapist",
            image: "https://images.unsplash.com/photo-1494790108755-2616b786d4d9?auto=format&fit=crop&w=100&q=80"
        },
        {
            text: "Practice gratitude by writing down 3 things you're thankful for each day.",
            author: "Dr. Alex Rodriguez",
            role: "Mental Health Counselor",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
        },
        {
            text: "Get 7-8 hours of quality sleep each night for optimal recovery and mental clarity.",
            author: "Dr. Lisa Wang",
            role: "Sleep Specialist",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
        }
    ];
    function getRandomTip() {
        const currentTip = document.getElementById('daily-tip-text')?.textContent;
        const availableTips = wellnessTips.filter(tip => tip.text !== currentTip);
        return availableTips[Math.floor(Math.random() * availableTips.length)] || wellnessTips[0];
    }
    
    tipButton.addEventListener('click', function() {
        const tip = getRandomTip();
        const tipText = document.getElementById('daily-tip-text');
        const tipAuthor = document.getElementById('tip-author-name');
        const tipRole = document.getElementById('tip-author-role');
        const tipImage = document.querySelector('.tip-author img');
        
        if (tipText) {
            tipText.style.opacity = '0';
            setTimeout(() => {
                tipText.textContent = tip.text;
                tipText.style.opacity = '1';
            }, 300);
        }
        
        if (tipAuthor) tipAuthor.textContent = tip.author;
        if (tipRole) tipRole.textContent = tip.role;
        if (tipImage) {
            tipImage.style.opacity = '0';
            setTimeout(() => {
                tipImage.src = tip.image;
                tipImage.style.opacity = '1';
            }, 300);
        }
        
        showNotification('New wellness tip loaded!', 'info');
    });
    const initialTip = getRandomTip();
    document.getElementById('daily-tip-text').textContent = initialTip.text;
    document.getElementById('tip-author-name').textContent = initialTip.author;
    document.getElementById('tip-author-role').textContent = initialTip.role;
    document.querySelector('.tip-author img').src = initialTip.image;
}
function initializeTestimonialSlider() {
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    if (!testimonialsSlider) return;
    
    const testimonialCards = document.querySelectorAll('.testimonials-slider .testimonial-card');
    const sliderPrev = document.querySelector('.slider-prev');
    const sliderNext = document.querySelector('.slider-next');
    const sliderDots = document.querySelectorAll('.dot');
    
    if (testimonialCards.length === 0) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        testimonialCards.forEach(card => {
            card.classList.remove('active');
        });
        sliderDots.forEach(dot => {
            dot.classList.remove('active');
        });
        testimonialCards[index].classList.add('active');
        sliderDots[index].classList.add('active');
        currentSlide = index;
    }
    if (sliderPrev) {
        sliderPrev.addEventListener('click', function() {
            let newIndex = currentSlide - 1;
            if (newIndex < 0) newIndex = testimonialCards.length - 1;
            showSlide(newIndex);
        });
    }
    if (sliderNext) {
        sliderNext.addEventListener('click', function() {
            let newIndex = currentSlide + 1;
            if (newIndex >= testimonialCards.length) newIndex = 0;
            showSlide(newIndex);
        });
    }
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
        });
    });
    let slideInterval = setInterval(() => {
        let newIndex = currentSlide + 1;
        if (newIndex >= testimonialCards.length) newIndex = 0;
        showSlide(newIndex);
    }, 5000);
    testimonialsSlider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    testimonialsSlider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
            let newIndex = currentSlide + 1;
            if (newIndex >= testimonialCards.length) newIndex = 0;
            showSlide(newIndex);
        }, 5000);
    });
    showSlide(0);
}

function initializeFAQs() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                answer.classList.remove('active');
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
            } else {
                faqQuestions.forEach(q => {
                    q.classList.remove('active');
                    q.nextElementSibling.classList.remove('active');
                    const qIcon = q.querySelector('i');
                    if (qIcon) {
                        qIcon.style.transform = 'rotate(0deg)';
                    }
                });
                this.classList.add('active');
                answer.classList.add('active');
                if (icon) {
                    icon.style.transform = 'rotate(180deg)';
                }
            }
        });
    });
}
function initializeScrollToTop() {
    const scrollTopBtn = document.getElementById('scroll-top');
    if (!scrollTopBtn) return;
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
function initializeNotifications() {
    const notificationClose = document.getElementById('notification-close');
    if (notificationClose) {
        notificationClose.addEventListener('click', function() {
            const notification = document.getElementById('notification');
            if (notification) {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 300);
            }
        });
    }
}
function showNotification(message, type = 'info') {
    let notification = document.getElementById('notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        document.body.appendChild(notification);
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--card-bg);
            color: var(--text-color);
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            display: none;
            align-items: center;
            gap: 10px;
            max-width: 350px;
            border-left: 4px solid var(--primary);
        `;
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-info-circle"></i>
                <div class="notification-text">
                    <p>${message}</p>
                </div>
                <button class="notification-close" id="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        const newCloseBtn = notification.querySelector('#notification-close');
        if (newCloseBtn) {
            newCloseBtn.addEventListener('click', function() {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 300);
            });
        }
    }
    const icon = notification.querySelector('i');
    if (icon) {
        if (type === 'success') {
            icon.className = 'fas fa-check-circle';
            notification.style.borderLeftColor = '#48bb78';
            icon.style.color = '#48bb78';
        } else if (type === 'warning') {
            icon.className = 'fas fa-exclamation-triangle';
            notification.style.borderLeftColor = '#ed8936';
            icon.style.color = '#ed8936';
        } else if (type === 'error') {
            icon.className = 'fas fa-exclamation-circle';
            notification.style.borderLeftColor = '#f56565';
            icon.style.color = '#f56565';
        } else {
            icon.className = 'fas fa-info-circle';
            notification.style.borderLeftColor = 'var(--primary)';
            icon.style.color = 'var(--primary)';
        }
    }
    const messageElement = notification.querySelector('.notification-text p');
    if (messageElement) {
        messageElement.textContent = message;
    }
    notification.style.display = 'flex';
    notification.classList.remove('show');
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.style.display = 'none';
        }, 300);
    }, 5000);
}
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
setInterval(() => {
    updateActivityStats();
    updateProgress();
}, 30000);
setInterval(() => {
    displayReminders();
}, 60000);
window.addEventListener('beforeunload', function() {
    const thoughts = document.getElementById('thoughts');
    if (thoughts && thoughts.value.trim()) {
        localStorage.setItem('rehabGrowthDraft', thoughts.value);
    }
});
window.addEventListener('load', function() {
    const draft = localStorage.getItem('rehabGrowthDraft');
    if (draft) {
        const thoughts = document.getElementById('thoughts');
        if (thoughts) {
            thoughts.value = draft;
        }
    }
});
