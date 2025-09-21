const questions = [
    { type: "mcq", question: "What is the capital of France?", options: {a:"Berlin", b:"Madrid", c:"Paris", d:"Rome"}, answer: "c" },
    { type: "mcq", question: "Which planet is known as the Red Planet?", options: {a:"Earth", b:"Mars", c:"Jupiter", d:"Venus"}, answer: "b" },
    { type: "mcq", question: "What is 5 + 7?", options: {a:"10", b:"11", c:"12", d:"13"}, answer: "c" },
    { type: "multiple", question: "Select all prime numbers:", options: {a:"2", b:"3", c:"4", d:"5"}, answer: ["2","3","5"] },
    { type: "multiple", question: "Select all programming languages:", options: {a:"Python", b:"HTML", c:"JavaScript", d:"CSS"}, answer: ["Python","JavaScript"] },
    { type: "multiple", question: "Select all fruits:", options: {a:"Apple", b:"Carrot", c:"Banana", d:"Potato"}, answer: ["Apple","Banana"] },
    { type: "fill", question: "Fill in the blank: The chemical symbol of water is _______?", answer: "h2o" },
    { type: "fill", question: "Fill in the blank: The largest mammal on Earth is _______?", answer: "blue whale" },
    { type: "fill", question: "Fill in the blank: The first president of the USA was _______?", answer: "george washington" },
    { type: "mcq", question: `Identify the technologies shown in this image: <br>
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg" width="80">
        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg" width="80">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" width="80">`,
        options: {a: "Frontend Development", b: "Backend Development", c: "Database Management", d: "Networking"}, answer: "a" },
    { type: "mcq", question: `Identify the technology shown in this image: <br>
        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" width="100">`,
        options: {a: "Frontend Development", b: "Backend Development", c: "CSS Framework", d: "Database"}, answer: "b" },
    { type: "mcq", question: `Identify this logo: <br>
        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg" width="100">`,
        options: {a: "HTML", b: "JavaScript", c: "CSS", d: "React"}, answer: "c" },
    { type: "fill", question: "Name the process by which plants make food using sunlight.", answer: "photosynthesis" },
    { type: "fill", question: "What is the boiling point of water in Celsius?", answer: "100" },
    { type: "fill", question: "Name the programming language that starts with 'J' and is used for web development.", answer: "javascript" }
];

// Shuffle questions
function shuffleArray(array) {
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
const shuffledQuestions = shuffleArray(questions);

let currentQuestion = 0;
let score = 0;
let timeLeft = 120;
let timer;
const quizForm = document.getElementById("quizForm");
const timeDisplay = document.getElementById("time");
let shownSections = { mcq:false, multiple:false, fill:false, image:false };

function showQuestion() {
    quizForm.innerHTML = "";
    if(currentQuestion >= shuffledQuestions.length){
        clearInterval(timer);
        showResult();
        return;
    }

    const q = shuffledQuestions[currentQuestion];
    let sectionTitle = "";
    if(q.type==="mcq" && !shownSections.mcq){ sectionTitle="<h2>Multiple Choice Questions</h2>"; shownSections.mcq=true; }
    else if(q.type==="multiple" && !shownSections.multiple){ sectionTitle="<h2>Multiple Select Questions</h2>"; shownSections.multiple=true; }
    else if(q.type==="fill" && !shownSections.fill){ sectionTitle="<h2>Fill in the Blanks</h2>"; shownSections.fill=true; }
    else if(q.type==="mcq" && !shownSections.image && currentQuestion>=9){ sectionTitle="<h2>Image-based Questions</h2>"; shownSections.image=true; }

    const div = document.createElement("div");
    div.classList.add("question");

    let html = sectionTitle + `<h3>${q.question}</h3>`;

    if(q.type === "mcq" || q.type === "multiple") {
        html += `<h4>Options:</h4>`;
        if(q.type === "mcq") {
            for(let key in q.options){
                html += `<div><label><input type="radio" name="q" value="${key}"> ${q.options[key]}</label></div>`;
            }
        } else if(q.type === "multiple") {
            for(let key in q.options){
                html += `<div><label><input type="checkbox" name="q" value="${q.options[key]}"> ${q.options[key]}</label></div>`;
            }
        }
    } else if(q.type === "fill"){
        html += `<input type="text" name="q">`;
    }

    div.innerHTML = html;
    quizForm.appendChild(div);

    timeLeft = 120;
    timeDisplay.textContent = formatTime(timeLeft);
    clearInterval(timer);
    timer = setInterval(()=>{ 
        timeLeft--; 
        timeDisplay.textContent = formatTime(timeLeft); 
        if(timeLeft<=0){ 
            clearInterval(timer); 
            checkAnswer(); 
        } 
    },1000);
}

function formatTime(seconds){ 
    const min=Math.floor(seconds/60); 
    const sec=seconds%60; 
    return `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`; 
}

function checkAnswer(){
    const q = shuffledQuestions[currentQuestion]; 
    let userAnswer;
    if(q.type==="mcq"){ 
        const selected=document.querySelector('input[name="q"]:checked'); 
        userAnswer=selected?selected.value:null; 
        if(userAnswer===q.answer) score++; 
    } else if(q.type==="multiple"){ 
        const selected=document.querySelectorAll('input[name="q"]:checked'); 
        const userValues=Array.from(selected).map(el=>el.value); 
        if(userValues.length===q.answer.length && q.answer.every(val=>userValues.includes(val))) score++; 
    } else if(q.type==="fill"){ 
        userAnswer=document.querySelector('input[name="q"]').value.trim().toLowerCase(); 
        if(userAnswer===q.answer) score++; 
    }

    currentQuestion++;
    showQuestion();
}

function submitQuiz(){ 
    clearInterval(timer); 
    if(currentQuestion<shuffledQuestions.length){ 
        checkAnswer(); 
    } else { 
        showResult(); 
    } 
}

function showResult(){ 
    quizForm.innerHTML="";
    document.getElementById("submitBtn").style.display="none";
    document.getElementById("timer").style.display="none";
    document.getElementById("result").innerHTML=`You scored ${score} out of ${shuffledQuestions.length}`;
}

showQuestion();
