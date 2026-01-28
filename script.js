document.getElementById("reflectionForm").addEventListener("submit", function(e){
    e.preventDefault()
    const reflections={
        todayThoughts: document.getElementById("todayThoughts").value,
        todayGoal: document.getElementById("todayGoal").value,
        twoMonthsGoal: document.getElementById("twoMonthsGoal").value,
        challenges: document.getElementById("challenges").value,
        timestamp: new Date().toISOString()
    }
    localStorage.setItem("reflectionForm", JSON.stringify(reflections))
    alert("Reflections & Goals Saved!")
    this.reset()
})

document.getElementById("growthForm").addEventListener("submit", function(e){
    e.preventDefault()
    const growth={
        timeInRehab: document.getElementById("timeInRehab").value,
        whyGoal: document.getElementById("whyGoal").value,
        motivation: document.getElementById("motivation").value,
        challengesFaced: document.getElementById("challengesFaced").value,
        habitsToBuild: document.getElementById("habitsToBuild").value,
        habitsToStop: document.getElementById("habitsToStop").value,
        feelToday: document.getElementById("feelToday").value,
        supportSystem: document.getElementById("supportSystem").value,
        achievementSoFar: document.getElementById("achievementSoFar").value,
        fear: document.getElementById("fear").value,
        futureAchievement: document.getElementById("futureAchievement").value,
        successMeasure: document.getElementById("successMeasure").value,
        lessonsLearned: document.getElementById("lessonsLearned").value,
        rewardSystem: document.getElementById("rewardSystem").value,
        sixMonthsGoal: document.getElementById("sixMonthsGoal").value,
        timestamp: new Date().toISOString()
    }
    localStorage.setItem("growthForm", JSON.stringify(growth))
    alert("Growth & Product Saved!")
    this.reset()
})

document.getElementById("taskForm").addEventListener("submit", function(e){
    e.preventDefault()
    const task={
        date: new Date().toLocaleDateString(),
        taskName: document.getElementById("taskName").value,
        taskQuality: document.getElementById("taskQuality").value,
        taskReflection: document.getElementById("taskReflection").value
    }
    let tasks=JSON.parse(localStorage.getItem("tasks"))||[]
    tasks.push(task)
    localStorage.setItem("tasks", JSON.stringify(tasks))
    alert("Task Saved!")
    this.reset()
    loadTasks()
})

function loadTasks(){
    const tableBody=document.getElementById("taskHistoryTable")
    tableBody.innerHTML=""
    let tasks=JSON.parse(localStorage.getItem("tasks"))||[]
    tasks.forEach(task=>{
        const row=document.createElement("tr")
        row.innerHTML=`
            <td>${task.date}</td>
            <td>${task.taskName}</td>
            <td>${task.taskQuality}</td>
            <td>${task.taskReflection}</td>
        `
        tableBody.appendChild(row)
    })
}

document.getElementById("weeklyView").addEventListener("click", function(){
    filterTasks(7)
})

document.getElementById("monthlyView").addEventListener("click", function(){
    filterTasks(30)
})

function filterTasks(days){
    const tableBody=document.getElementById("taskHistoryTable")
    tableBody.innerHTML=""
    let tasks=JSON.parse(localStorage.getItem("tasks"))||[]
    let now=new Date()
    tasks.forEach(task=>{
        let taskDate=new Date(task.date)
        let diffDays=(now-taskDate)/(1000*60*60*24)
        if(diffDays<=days){
            const row=document.createElement("tr")
            row.innerHTML=`
                <td>${task.date}</td>
                <td>${task.taskName}</td>
                <td>${task.taskQuality}</td>
                <td>${task.taskReflection}</td>
            `
            tableBody.appendChild(row)
        }
    })
}

document.getElementById("medicalForm").addEventListener("submit", function(e){
    e.preventDefault()
    const med={
        name: document.getElementById("medicineName").value,
        time: document.getElementById("medicineTime").value
    }
    localStorage.setItem("medicalReminder", JSON.stringify(med))
    alert("Medical Reminder Saved!")
    this.reset()
})

function checkMedicalReminder(){
    const med=JSON.parse(localStorage.getItem("medicalReminder"))
    if(med && med.time){
        let now=new Date()
        let [hours,minutes]=med.time.split(":")
        if(now.getHours()==parseInt(hours)&&now.getMinutes()==parseInt(minutes)){
            alert(`Time to take your medicine: ${med.name}`)
        }
    }
}

setInterval(checkMedicalReminder,60000)

function checkInactivity(){
    const lastVisit=localStorage.getItem("lastVisit")
    const now=new Date().getTime()
    if(lastVisit){
        const diff=(now-parseInt(lastVisit))/(1000*60*60*24)
        if(diff>=2){
            localStorage.clear()
            alert("2 days inactivity detected. Progress reset!")
        }
    }
    localStorage.setItem("lastVisit",now)
}

checkInactivity()
loadTasks()
