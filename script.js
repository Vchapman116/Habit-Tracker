function getTodayString () {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }
  
  function getYesterdayString() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
  }
  
  let habits = JSON.parse(localStorage.getItem("habits")) || [];
        
        function renderHabits() {
          document.getElementById("habit-list").innerHTML = "";
  
          const doneCount = habits.filter (function(habit){
            return habit.lastCompletedDate === getTodayString();
          }).length;
  
          document.getElementById("habit-summary").textContent = doneCount + " of " + habits.length + " done today";
          
          if (habits.length === 0) {
            document.getElementById("habit-list").innerHTML = '<p class="empty-state">No habits yet - add one above!</p>';
            return;
          }
  
          const sortedHabits = [...habits].sort(function(a,b) {
            const aDone = a.lastCompletedDate === getTodayString();
            const bDone = b.lastCompletedDate === getTodayString();
            return aDone - bDone;
          });
        
        sortedHabits.forEach (function(habit, index) {
          const button = document.createElement("button");
          const isDone = habit.lastCompletedDate === getTodayString();
          const bestStreakClass = isDone ? "best-streak-on-green" : "best-streak";
          button.innerHTML = '<span class="habit-name">' + habit.name + '</span> <span class="streak-badge">' + habit.streak + '</span> <span class="' + bestStreakClass + '">Best: ' + habit.bestStreak + "</span>";
  
          const nameSpan = button.querySelector(".habit-name");
  
          if (habit.lastCompletedDate === getTodayString()) {
            button.style.backgroundColor = "#4CAF50";
            nameSpan.style.textDecoration = "line-through";
          } else {
            nameSpan.style.textDecoration = "none";
          }
  
          button.addEventListener("click", function() {
            if (habit.lastCompletedDate === getTodayString()) {
              habit.lastCompletedDate = null;
              habit.streak = habit.streak - 1;
            } else {
              if (habit.lastCompletedDate === getYesterdayString()) {
                habit.streak = habit.streak +1;
              } else {
                habit.streak = 1;
              }

              if (habit.streak > habit.bestStreak) {
                  habit.bestStreak = habit.streak;
              }

              habit.lastCompletedDate = getTodayString();
            }
            localStorage.setItem("habits", JSON. stringify(habits));
            renderHabits();
          });
  
          const deleteButton = document.createElement("button");
          deleteButton.className = "delete-btn";
          deleteButton.textContent = "Delete";

          const editButton = document.createElement("button");
          editButton.className = "edit-btn";
          editButton.textContent = "Edit";

          editButton.addEventListener("click", function() {
              const newName = prompt("Edit habit name:", habit.name);

              if (newName !== null && newName.trim() !== "") {
                  habit.name = newName.trim();
                  localStorage.setItem("habits", JSON.stringify(habits));
                  renderHabits();
              }
          });
  
          deleteButton.addEventListener("click", function() {
            if (confirm("Delete \"" + habit.name + "\"? This can't be undone.")) {
            const realIndex = habits.indexOf(habit);
            habits.splice(realIndex, 1);
            localStorage.setItem("habits", JSON.stringify(habits));
            renderHabits();
            }
          });
  
          const row = document.createElement("div");
          row.className = "habit-row";
          if (habit.lastCompletedDate === getTodayString()) {
            row.style.opacity = "0.6";
          } else {
            row.style.opacity = "1";
          }
          row.appendChild(button);
          row.appendChild(editButton);
          row.appendChild(deleteButton);
          document.getElementById("habit-list").appendChild(row);
        });
        }
  
        document.getElementById("add-habit-btn").addEventListener("click", function() {
          const input = document.getElementById("new-habit-input");
          const habitName = input.value;
  
          if(habitName === "") {
            return;
          }
  
          habits.push({name: habitName, lastCompletedDate:null, streak: 0, bestStreak: 0});
          localStorage.setItem("habits", JSON.stringify(habits));
        renderHabits();
  
        input.value = "";
        });
  
        document.getElementById("new-habit-input").addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
              document.getElementById("add-habit-btn").click();
            }
          });
  
        renderHabits();

        document.addEventListener("visibilitychange", function() {
            if (document.visibilityState === "visible") {
                renderHabits();
            }
        });

        window.addEventListener("pageshow", function(event) {
            renderHabits();
        });