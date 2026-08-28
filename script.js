function getLocalDateString(date) {
  return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
}

function getTodayString() {
  return getLocalDateString(new Date());
}

function getYesterdayString() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getLocalDateString(d);
}

console.log(getTodayString(), getYesterdayString());
  
  let habits = JSON.parse(localStorage.getItem("habits")) || [];

  function moveHabit(habit, direction) {
      const isDone = habit.lastCompletedDate === getTodayString();

      const sameGroup = habits.filter(function(h) {
          return (h.lastCompletedDate === getTodayString()) === isDone;
      });

      sameGroup.sort(function(a, b) {
          return a.order - b.order;
      });

      const position = sameGroup.indexOf(habit);
      const swapPosition = position + direction;

      if (swapPosition < 0 || swapPosition >= sameGroup.length) {
          return;
      }

      const otherHabit = sameGroup[swapPosition];
      const tempOrder = habit.order;
      habit.order = otherHabit.order;
      otherHabit.order = tempOrder;

      localStorage.setItem("habits", JSON.stringify(habits));
      renderHabits();
  }
        
        function renderHabits() {
          document.getElementById("habit-list").innerHTML = "";
  
          const doneCount = habits.filter (function(habit){
            return habit.lastCompletedDate === getTodayString();
          }).length;

          let summaryText = doneCount + " of " + habits.length + " done today";

          if (habits.length > 0 && doneCount === habits.length) {
            summaryText = "Look at you, completing all your habits for the day. Nicely done!";
          }
  
          document.getElementById("habit-summary").textContent = summaryText;
          
          if (habits.length === 0) {
            document.getElementById("habit-list").innerHTML = '<p class="empty-state">Nothing to see here. Get started by adding a habit!</p>';
            return;
          }
  
            const sortedHabits = [...habits].sort(function(a,b) {
            const aDone = a.lastCompletedDate === getTodayString();
            const bDone = b.lastCompletedDate === getTodayString();

            if (aDone !== bDone) {
                return aDone - bDone;
            }
            return a.order - b.order;
          });
        
        sortedHabits.forEach (function(habit, index) {
          const button = document.createElement("button");
          const isDone = habit.lastCompletedDate === getTodayString();
          const bestStreakClass = "best-streak";
          
          button.textContent = habit.name;

          if (habit.lastCompletedDate === getTodayString()) {
            button.style.backgroundColor = "#4CAF50";
            button.style.textDecoration = "line-through";
          } else {
            button.style.textDecoration = "none";
          }

          let streakHTML = "";
          if (habit.streak > 0) {
            streakHTML = '<span class="streak-badge">' + "Active: " + habit.streak + "</span>";
          }

          let bestStreakHTML = "";
          if (habit.bestStreak > 0) {
            bestStreakHTML = '<span class="' + bestStreakClass + '">Best: ' + habit.bestStreak + "</span>";
          }

          const streakInfo = document.createElement("div");
            streakInfo.className = "streak-info";
            streakInfo.innerHTML = streakHTML + " " + bestStreakHTML;

          const habitMain = document.createElement("div");
            habitMain.className = "habit-main";
            habitMain.appendChild(button);
            habitMain.appendChild(streakInfo);
  
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

          const upButton = document.createElement("button");
          upButton.className = "move-btn";
          upButton.textContent = "+";
          upButton.addEventListener("click", function() {
              moveHabit(habit, -1);
          });

          const downButton = document.createElement("button");
          downButton.className = "move-btn";
          downButton.textContent = "-"
          downButton.addEventListener("click", function() {
              moveHabit(habit, 1);
          });

          editButton.addEventListener("click", function() {
              const newName = prompt("Edit habit name:", habit.name);

              if (newName !== null && newName.trim() !== "") {
                  habit.name = newName.trim();
                  localStorage.setItem("habits", JSON.stringify(habits));
                  renderHabits();
              }
          });
  
          deleteButton.addEventListener("click", function() {
            let confirmMessage;

            if (habit.streak > 0) {
              confirmMessage = "Delete \"" + habit.name + "\"? Your " + habit.streak + " day streak will be lost too.";
            } else {
              confirmMessage = "Are you sure you want to remove \"" + habit.name + "\"?";
            }
            if (confirm(confirmMessage)) {
            const realIndex = habits.indexOf(habit);
            habits.splice(realIndex, 1);
            localStorage.setItem("habits", JSON.stringify(habits));
            renderHabits();
            }
          });
  
          const row = document.createElement("div");
          row.className = "habit-row";
          if (habit.isNew) {
            row.classList.add("new-habit");
            habit.isNew = false;
          }
          if (habit.lastCompletedDate === getTodayString()) {
            row.style.opacity = "0.6";
          } else {
            row.style.opacity = "1";
          }

          const moveButtons = document.createElement("div");
          moveButtons.className = "move-buttons";
          moveButtons.appendChild(upButton);
          moveButtons.appendChild(downButton);

          row.appendChild(moveButtons);
          row.appendChild(habitMain);
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
  
          habits.push({name: habitName, lastCompletedDate:null, streak: 0, bestStreak: 0, order: habits.length, isNew: true});
          localStorage.setItem("habits", JSON.stringify(habits));
        renderHabits();
  
        input.value = "";
        });
  
        document.getElementById("new-habit-input").addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
              document.getElementById("add-habit-btn").click();
            }
          });

          document.getElementById("export-btn").addEventListener("click", function(){
            const dataString = JSON.stringify(habits);
            prompt("Copy this text and save it somewhere safe:", dataString);
          });

          document.getElementById("import-btn").addEventListener("click", function() {
            const dataString = prompt("Paste your saved habit data here:");

            if (dataString === null || dataString.trim === "") {
              return;
            }

            habits = JSON.parse(dataString);
            localStorage.setItem("habits", JSON.stringify(habits));
            renderHabits();
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