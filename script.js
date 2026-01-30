// Wait for page to fully load
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 1000);
    }
    
    // Initialize all functions
    initNavigation();
    initForms();
    initFAQs();
    initTestimonialSlider();
    initReflectionHistory();
    initDailyTips();
    initThemeToggle();
    initScrollToTop();
    initChatButton();
});

// Initialize navigation menu
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking links
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Sticky navbar on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
}

// Initialize all forms
function initForms() {
    // Reflection Form
    const reflectionForm = document.getElementById('reflection-form');
    if (reflectionForm) {
        let selectedMood = null;
        const moodButtons = document.querySelectorAll('.mood-btn');
        
        // Mood selection
        moodButtons.forEach(button => {
            button.addEventListener('click', function() {
                moodButtons.forEach(btn => btn.classList.remove('selected'));
                this.classList.add('selected');
                selectedMood = this.dataset.mood;
            });
        });
        
        // Form submission
        reflectionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const thoughts = document.getElementById('thoughts').value.trim();
            
            if (!thoughts) {
                showNotification('Please enter your thoughts');
                return;
            }
            
            if (!selectedMood) {
                showNotification('Please select your mood');
                return;
            }
            
            // Create reflection object
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
                mood: selectedMood
            };
            
            // Save to localStorage
            let reflections = JSON.parse(localStorage.getItem('reflections') || '[]');
            reflections.unshift(reflection);
            localStorage.setItem('reflections', JSON.stringify(reflections));
            
            // Reset form and update display
            showNotification('Reflection saved successfully!');
            reflectionForm.reset();
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            selectedMood = null;
            
            updateReflectionHistory();
        });
    }
    
    // Activity Form
    const activityForm = document.getElementById('activity-form');
    if (activityForm) {
        activityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const type = document.getElementById('activity-type').value;
            const duration = document.getElementById('duration').value;
            const notes = document.getElementById('activity-notes').value;
            
            if (!type) {
                showNotification('Please select an activity type');
                return;
            }
            
            const activity = {
                id: Date.now(),
                date: new Date().toLocaleDateString(),
                type: type,
                duration: parseInt(duration) || 0,
                notes: notes
            };
            
            let activities = JSON.parse(localStorage.getItem('activities') || '[]');
            activities.unshift(activity);
            localStorage.setItem('activities', JSON.stringify(activities));
            
            showNotification('Activity logged successfully!');
            activityForm.reset();
            updateStats();
        });
    }
    
    // Medication Form
    const medicalForm = document.getElementById('medical-form');
    if (medicalForm) {
        medicalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const medicine = document.getElementById('medicine').value.trim();
            const time = document.getElementById('medicine-time').value;
            
            if (!medicine || !time) {
                showNotification('Please fill in all fields');
                return;
            }
            
            const reminder = {
                id: Date.now(),
                medicine: medicine,
                time: time,
                date: new Date().toLocaleDateString()
            };
            
            let reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
            reminders.unshift(reminder);
            localStorage.setItem('reminders', JSON.stringify(reminders));
            
            showNotification('Reminder added successfully!');
            medicalForm.reset();
            displayReminders();
            updateStats();
        });
    }
    
    // Goals Form
    const goalsForm = document.getElementById('goals-form');
    if (goalsForm) {
        // Load saved goals
        const savedGoals = JSON.parse(localStorage.getItem('goals') || '{}');
        if (savedGoals.short) {
            document.getElementById('short-goal').value = savedGoals.short;
        }
        if (savedGoals.long) {
            document.getElementById('long-goal').value = savedGoals.long;
        }
        
        goalsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const shortGoal = document.getElementById('short-goal').value;
            const longGoal = document.getElementById('long-goal').value;
            
            const goals = {
                short: shortGoal,
                long: longGoal,
                updated: new Date().toLocaleDateString()
            };
            
            localStorage.setItem('goals', JSON.stringify(goals));
            showNotification('Goals updated successfully!');
        });
    }
    
    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value.trim();
            
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all required fields');
                return;
            }
            
            showNotification('Message sent successfully! We will get back to you within 24 hours.');
            contactForm.reset();
        });
    }
    
    // Success Story Form
    const successStoryForm = document.getElementById('success-story-form');
    if (successStoryForm) {
        const ratingStars = document.querySelectorAll('.stars i');
        const ratingInput = document.getElementById('story-rating');
        const storySuccess = document.getElementById('story-success');
        
        if (ratingStars.length > 0 && ratingInput) {
            ratingStars.forEach(star => {
                star.addEventListener('click', function() {
                    const rating = this.dataset.rating;
                    ratingInput.value = rating;
                    
                    ratingStars.forEach(s => {
                        if (s.dataset.rating <= rating) {
                            s.classList.remove('far');
                            s.classList.add('fas');
                            s.classList.add('active');
                        } else {
                            s.classList.remove('fas');
                            s.classList.add('far');
                            s.classList.remove('active');
                        }
                    });
                });
            });
        }
        
        successStoryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (ratingInput && ratingInput.value === '0') {
                showNotification('Please rate your experience');
                return;
            }
            
            successStoryForm.style.display = 'none';
            if (storySuccess) {
                storySuccess.style.display = 'block';
            }
            showNotification('Thank you for sharing your success story!');
        });
    }
}

// Initialize FAQ functionality
function initFAQs() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Close all other FAQs
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            });
            
            // Toggle current FAQ
            if (!isActive) {
                this.classList.add('active');
                answer.classList.add('active');
            }
        });
    });
}

// Initialize testimonial slider
function initTestimonialSlider() {
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    if (!testimonialsSlider) return;
    
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const sliderPrev = document.querySelector('.slider-prev');
    const sliderNext = document.querySelector('.slider-next');
    const sliderDots = document.querySelectorAll('.dot');
    
    if (testimonialCards.length === 0) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        testimonialCards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });
        
        sliderDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
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
    
    if (sliderDots.length > 0) {
        sliderDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                showSlide(index);
            });
        });
    }
    
    // Auto slide every 5 seconds
    setInterval(() => {
        let newIndex = currentSlide + 1;
        if (newIndex >= testimonialCards.length) newIndex = 0;
        showSlide(newIndex);
    }, 5000);
}

// Initialize reflection history
function initReflectionHistory() {
    // Load and display reflections on page load
    updateReflectionHistory();
    displayReminders();
    updateStats();
    
    // Clear history button
    const clearHistoryBtn = document.getElementById('clear-history');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all your reflection history? This cannot be undone.')) {
                localStorage.removeItem('reflections');
                updateReflectionHistory();
                showNotification('All reflections cleared!');
            }
        });
    }
    
    // Add sample reflections if none exist
    if (!localStorage.getItem('reflections')) {
        const sampleReflections = [
            {
                id: 1,
                date: 'Mon, Jan 15, 2024, 09:30 AM',
                thoughts: 'Feeling positive about my recovery journey today. Made progress with my exercises!',
                mood: 'happy'
            },
            {
                id: 2,
                date: 'Sun, Jan 14, 2024, 07:45 PM',
                thoughts: 'Challenging day but stayed committed to my goals. Tomorrow will be better.',
                mood: 'neutral'
            }
        ];
        localStorage.setItem('reflections', JSON.stringify(sampleReflections));
        updateReflectionHistory();
    }
}

// Update reflection history display
function updateReflectionHistory() {
    const historyContainer = document.getElementById('reflection-history');
    if (!historyContainer) return;
    
    const reflections = JSON.parse(localStorage.getItem('reflections') || '[]');
    
    if (reflections.length === 0) {
        historyContainer.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-book-open"></i>
                <p>No reflections yet. Write your first reflection above!</p>
            </div>
        `;
        return;
    }
    
    const moodEmojis = {
        'happy': '😊',
        'neutral': '😐',
        'sad': '😔',
        'anxious': '😰',
        'energetic': '💪'
    };
    
    historyContainer.innerHTML = reflections.map(reflection => `
        <div class="reflection-item">
            <div class="reflection-item-header">
                <div class="reflection-date">${reflection.date}</div>
                <div class="reflection-mood">${moodEmojis[reflection.mood] || '😐'}</div>
            </div>
            <div class="reflection-text">${reflection.thoughts}</div>
            <button onclick="deleteReflection(${reflection.id})" class="delete-reflection" title="Delete reflection">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// Delete a single reflection
function deleteReflection(id) {
    if (!confirm('Delete this reflection?')) return;
    
    let reflections = JSON.parse(localStorage.getItem('reflections') || '[]');
    reflections = reflections.filter(reflection => reflection.id !== id);
    localStorage.setItem('reflections', JSON.stringify(reflections));
    updateReflectionHistory();
    showNotification('Reflection deleted!');
}

// Display medication reminders
function displayReminders() {
    const remindersContainer = document.getElementById('reminders-container');
    if (!remindersContainer) return;
    
    const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    
    if (reminders.length === 0) {
        remindersContainer.innerHTML = '<li>No reminders set</li>';
        return;
    }
    
    remindersContainer.innerHTML = reminders.slice(0, 5).map(reminder => `
        <li>
            <div>
                <strong>${reminder.medicine}</strong>
                <small>${reminder.time}</small>
            </div>
            <button onclick="deleteReminder(${reminder.id})" class="delete-btn">×</button>
        </li>
    `).join('');
}

// Delete a reminder
function deleteReminder(id) {
    let reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    reminders = reminders.filter(reminder => reminder.id !== id);
    localStorage.setItem('reminders', JSON.stringify(reminders));
    displayReminders();
    showNotification('Reminder deleted!');
}

// Update activity stats
function updateStats() {
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    const totalActivities = document.getElementById('total-activities');
    const daysTracked = document.getElementById('days-tracked');
    
    if (totalActivities) {
        totalActivities.textContent = activities.length;
    }
    
    if (daysTracked) {
        const uniqueDates = [...new Set(activities.map(a => a.date))];
        daysTracked.textContent = uniqueDates.length;
    }
}

// Initialize daily tips
function initDailyTips() {
    const dailyTips = [
        "Start your day with positive affirmations and set realistic goals.",
        "Take regular breaks to stretch and breathe deeply.",
        "Practice gratitude by writing down three things you're thankful for.",
        "Stay hydrated - drink at least 8 glasses of water daily.",
        "Connect with supportive people in your life regularly.",
        "Take short walks outside to refresh your mind.",
        "Listen to calming music during breaks to reduce stress.",
        "Celebrate small victories - every step forward counts!",
        "Practice deep breathing for 5 minutes to calm your mind.",
        "Set reminders to take your medications on time.",
        "Maintain a consistent sleep schedule for better recovery.",
        "Engage in light physical activity daily.",
        "Keep a journal to track your progress and feelings.",
        "Focus on what you can do today, not what you can't.",
        "Be patient with yourself - recovery takes time."
    ];
    
    const dailyTipElement = document.getElementById('daily-tip-text');
    const newTipBtn = document.getElementById('new-tip-btn');
    
    function getRandomTip() {
        return dailyTips[Math.floor(Math.random() * dailyTips.length)];
    }
    
    if (dailyTipElement) {
        dailyTipElement.textContent = getRandomTip();
    }
    
    if (newTipBtn) {
        newTipBtn.addEventListener('click', function() {
            if (dailyTipElement) {
                dailyTipElement.textContent = getRandomTip();
            }
        });
    }
}

// Initialize theme toggle
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
}

// Initialize scroll to top button
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scroll-top');
    if (!scrollTopBtn) return;
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
}

// Initialize chat button
function initChatButton() {
    const chatBtn = document.getElementById('chat-btn');
    if (chatBtn) {
        chatBtn.addEventListener('click', function() {
            showNotification('Live chat coming soon! Support available via email and phone.');
        });
    }
}

// Show notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    if (!notification || !notificationMessage) return;
    
    notificationMessage.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
// Reflection Journal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mood selection
    initializeMoodButtons();
    
    // Load saved data
    loadReflections();
    loadGoals();
    loadActivities();
    
    // Reflection form submission
    const reflectionForm = document.getElementById('reflection-form');
    if (reflectionForm) {
        reflectionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveReflection();
        });
    }
    
    // Clear reflection history
    const clearHistoryBtn = document.getElementById('clear-reflection-history');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', clearReflectionHistory);
    }
    
    // Goal form submission
    const goalsForm = document.getElementById('goals-form');
    if (goalsForm) {
        goalsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveGoal();
        });
    }
    
    // Activity form submission
    const activityForm = document.getElementById('activity-form');
    if (activityForm) {
        activityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveActivity();
        });
    }
});

function initializeMoodButtons() {
    const moodButtons = document.querySelectorAll('.mood-btn');
    const selectedMoodInput = document.getElementById('selected-mood');
    
    moodButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            moodButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Set the hidden input value
            selectedMoodInput.value = this.getAttribute('data-mood');
        });
    });
}

function saveReflection() {
    const thoughts = document.getElementById('thoughts').value.trim();
    const mood = document.getElementById('selected-mood').value;
    
    // Validate inputs
    if (!thoughts) {
        alert('Please enter your thoughts');
        return;
    }
    
    if (!mood) {
        alert('Please select a mood');
        return;
    }
    
    // Create reflection object
    const reflection = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        text: thoughts,
        mood: mood,
        moodEmoji: getMoodEmoji(mood)
    };
    
    // Get existing reflections from localStorage
    let reflections = JSON.parse(localStorage.getItem('rehabGrowthReflections')) || [];
    
    // Add new reflection
    reflections.unshift(reflection); // Add to beginning
    
    // Save to localStorage
    localStorage.setItem('rehabGrowthReflections', JSON.stringify(reflections));
    
    // Update display
    displayReflections();
    
    // Reset form
    document.getElementById('reflection-form').reset();
    document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('selected-mood').value = '';
    
    // Show success message
    showNotification('Reflection saved successfully!');
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

function displayReflections() {
    const historyContainer = document.getElementById('reflection-history');
    let reflections = JSON.parse(localStorage.getItem('rehabGrowthReflections')) || [];
    
    if (reflections.length === 0) {
        historyContainer.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-book-open"></i>
                <p>No reflections yet. Start by saving your first reflection above!</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    reflections.forEach(reflection => {
        html += `
            <div class="history-item" data-id="${reflection.id}">
                <div class="reflection-date">${reflection.date}</div>
                <div class="reflection-mood">${reflection.moodEmoji} ${reflection.mood.charAt(0).toUpperCase() + reflection.mood.slice(1)}</div>
                <div class="reflection-text">${reflection.text}</div>
            </div>
        `;
    });
    
    historyContainer.innerHTML = html;
}

function clearReflectionHistory() {
    if (confirm('Are you sure you want to clear all your reflection history? This action cannot be undone.')) {
        localStorage.removeItem('rehabGrowthReflections');
        displayReflections();
        showNotification('Reflection history cleared');
    }
}

function loadReflections() {
    displayReflections();
}

// Goal Setting functionality
function saveGoal() {
    const shortGoal = document.getElementById('short-goal').value.trim();
    const longGoal = document.getElementById('long-goal').value.trim();
    
    // Validate inputs
    if (!shortGoal && !longGoal) {
        alert('Please enter at least one goal');
        return;
    }
    
    // Create goal object
    const goal = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }),
        shortTerm: shortGoal,
        longTerm: longGoal
    };
    
    // Get existing goals from localStorage
    let goals = JSON.parse(localStorage.getItem('rehabGrowthGoals')) || [];
    
    // Add new goal
    goals.unshift(goal); // Add to beginning
    
    // Save to localStorage
    localStorage.setItem('rehabGrowthGoals', JSON.stringify(goals));
    
    // Update display
    displayGoals();
    
    // Reset form
    document.getElementById('goals-form').reset();
    
    // Show success message
    showNotification('Goals saved successfully!');
}

function displayGoals() {
    const goalsList = document.getElementById('goals-list');
    let goals = JSON.parse(localStorage.getItem('rehabGrowthGoals')) || [];
    
    if (goals.length === 0) {
        goalsList.innerHTML = '<li>No goals set yet. Set your first goal above!</li>';
        return;
    }
    
    let html = '';
    goals.forEach(goal => {
        html += `
            <li data-id="${goal.id}">
                <div class="goal-item">
                    ${goal.shortTerm ? `
                        <div class="goal-type">Short-term Goal:</div>
                        <div class="goal-text">${goal.shortTerm}</div>
                    ` : ''}
                    ${goal.longTerm ? `
                        <div class="goal-type">Long-term Goal:</div>
                        <div class="goal-text">${goal.longTerm}</div>
                    ` : ''}
                    <div class="goal-date">Set on: ${goal.date}</div>
                </div>
            </li>
        `;
    });
    
    goalsList.innerHTML = html;
}

function loadGoals() {
    displayGoals();
}

// Activity Tracker functionality
function saveActivity() {
    const activityType = document.getElementById('activity-type').value;
    const duration = document.getElementById('duration').value;
    const notes = document.getElementById('activity-notes').value.trim();
    
    // Validate inputs
    if (!activityType) {
        alert('Please select an activity type');
        return;
    }
    
    if (!duration || duration < 1 || duration > 240) {
        alert('Please enter a valid duration (1-240 minutes)');
        return;
    }
    
    // Create activity object
    const activity = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        type: activityType,
        duration: duration,
        notes: notes
    };
    
    // Get existing activities from localStorage
    let activities = JSON.parse(localStorage.getItem('rehabGrowthActivities')) || [];
    
    // Add new activity
    activities.unshift(activity);
    
    // Save to localStorage
    localStorage.setItem('rehabGrowthActivities', JSON.stringify(activities));
    
    // Update display and stats
    updateActivityStats();
    displayActivities();
    
    // Reset form
    document.getElementById('activity-form').reset();
    
    // Show success message
    showNotification('Activity logged successfully!');
}

function displayActivities() {
    const activityList = document.getElementById('activity-history-list');
    let activities = JSON.parse(localStorage.getItem('rehabGrowthActivities')) || [];
    
    if (activities.length === 0) {
        activityList.innerHTML = '<li>No activities logged yet</li>';
        return;
    }
    
    // Show only last 5 activities
    const recentActivities = activities.slice(0, 5);
    
    let html = '';
    recentActivities.forEach(activity => {
        html += `
            <li>
                <strong>${activity.type}</strong> - ${activity.duration} minutes
                <br>
                <small>${activity.date}${activity.notes ? ` - ${activity.notes}` : ''}</small>
            </li>
        `;
    });
    
    activityList.innerHTML = html;
}

function updateActivityStats() {
    const activities = JSON.parse(localStorage.getItem('rehabGrowthActivities')) || [];
    const totalActivities = document.getElementById('total-activities');
    const daysTracked = document.getElementById('days-tracked');
    
    // Calculate unique days
    const uniqueDays = new Set(activities.map(activity => {
        const date = new Date(activity.id);
        return date.toDateString();
    })).size;
    
    totalActivities.textContent = activities.length;
    daysTracked.textContent = uniqueDays;
}

function loadActivities() {
    updateActivityStats();
    displayActivities();
}

// Utility function for notifications
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add keyframe animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 300);
    }, 3000);
}
// Chat functionality for About page
document.addEventListener('DOMContentLoaded', function() {
    // Chat functionality
    const chatBtn = document.getElementById('chat-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatSend = document.getElementById('chat-send');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    
    // Notification functionality
    const notification = document.getElementById('notification');
    const notificationClose = document.getElementById('notification-close');
    const notificationMessage = document.getElementById('notification-message');
    
    // Success story form
    const storyForm = document.getElementById('success-story-form');
    const successMessage = document.getElementById('story-success');
    
    // Testimonial slider
    const sliderPrev = document.querySelector('.slider-prev');
    const sliderNext = document.querySelector('.slider-next');
    const dots = document.querySelectorAll('.dot');
    const testimonialCards = document.querySelectorAll('.testimonials-slider .testimonial-card');
    let currentSlide = 0;
    
    // Star rating for story form
    const stars = document.querySelectorAll('.stars i');
    const ratingInput = document.getElementById('story-rating');
    
    // ========== CHAT FUNCTIONALITY ==========
    if (chatBtn && chatWindow) {
        chatBtn.addEventListener('click', function() {
            chatWindow.style.display = 'flex';
            chatInput.focus();
        });
        
        chatClose.addEventListener('click', function() {
            chatWindow.style.display = 'none';
        });
        
        chatSend.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        function sendMessage() {
            const message = chatInput.value.trim();
            if (message) {
                // Add user message
                addMessage(message, 'user');
                chatInput.value = '';
                
                // Simulate bot response after delay
                setTimeout(() => {
                    const responses = [
                        "I understand. How can I assist you further with your rehabilitation journey?",
                        "That's great to hear! Our team is here to support you every step of the way.",
                        "Thank you for sharing. Would you like me to connect you with a specialist?",
                        "I can help with medication reminders, progress tracking, or goal setting. What would you like to know more about?",
                        "Your dedication to recovery is inspiring! Remember, progress takes time."
                    ];
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    addMessage(randomResponse, 'bot');
                }, 1000);
            }
        }
        
        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${sender}-message`;
            
            const now = new Date();
            const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p>${text}</p>
                </div>
                <div class="message-time">${timeString}</div>
            `;
            
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    // ========== NOTIFICATION FUNCTIONALITY ==========
    function showNotification(message) {
        if (notification && notificationMessage) {
            notificationMessage.textContent = message;
            notification.style.display = 'block';
            notification.classList.add('show');
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                hideNotification();
            }, 5000);
        }
    }
    
    function hideNotification() {
        if (notification) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.style.display = 'none';
            }, 300);
        }
    }
    
    if (notificationClose) {
        notificationClose.addEventListener('click', hideNotification);
    }
    
    // ========== TESTIMONIAL SLIDER ==========
    function updateSlider() {
        testimonialCards.forEach((card, index) => {
            card.classList.remove('active');
            if (dots[index]) dots[index].classList.remove('active');
        });
        
        testimonialCards[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }
    
    if (sliderNext) {
        sliderNext.addEventListener('click', function() {
            currentSlide = (currentSlide + 1) % testimonialCards.length;
            updateSlider();
        });
    }
    
    if (sliderPrev) {
        sliderPrev.addEventListener('click', function() {
            currentSlide = (currentSlide - 1 + testimonialCards.length) % testimonialCards.length;
            updateSlider();
        });
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentSlide = index;
            updateSlider();
        });
    });
    
    // Auto slide every 5 seconds
    setInterval(() => {
        currentSlide = (currentSlide + 1) % testimonialCards.length;
        updateSlider();
    }, 5000);
    
    // ========== STAR RATING ==========
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
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
            const rating = parseInt(this.getAttribute('data-rating'));
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.style.color = '#f6ad55';
                } else {
                    s.style.color = '';
                }
            });
        });
        
        star.addEventListener('mouseout', function() {
            stars.forEach((s, index) => {
                if (!s.classList.contains('active')) {
                    s.style.color = '';
                }
            });
        });
    });
    
    // ========== SUCCESS STORY FORM ==========
    if (storyForm) {
        storyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const name = document.getElementById('story-name').value.trim();
            const email = document.getElementById('story-email').value.trim();
            const storyType = document.getElementById('story-type').value;
            const rating = document.getElementById('story-rating').value;
            const title = document.getElementById('story-title').value.trim();
            const content = document.getElementById('story-content').value.trim();
            const consent = document.getElementById('story-consent').checked;
            
            if (!name || !email || !storyType || rating === '0' || !title || !content || !consent) {
                showNotification('Please fill in all required fields and select a rating.');
                return;
            }
            
            // In a real application, you would send this data to a server
            // For demo purposes, we'll just show success
            
            // Hide form and show success message
            storyForm.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Show notification
            showNotification('Thank you for sharing your success story! Our team will review it and may contact you for more details.');
            
            // Reset form
            storyForm.reset();
            stars.forEach(star => {
                star.classList.remove('fas', 'active');
                star.classList.add('far');
            });
            ratingInput.value = '0';
        });
    }
    
    // ========== SCROLL TO TOP ==========
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.visibility = 'visible';
            } else {
                scrollTopBtn.style.opacity = '0';
                scrollTopBtn.style.visibility = 'hidden';
            }
        });
    }
    
    // Preloader
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 1000);
        }
    });
});
