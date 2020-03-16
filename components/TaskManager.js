import { AsyncStorage } from 'react-native';

export default class TaskManager {
  constructor() {
    if (TaskManager.instance) {
      return TaskManager.instance;
    }

    this.tasks = []
    TaskManager.instance = this;

    return TaskManager.instance;
  }

  setTasks(tasks) {
    this.tasks = tasks;
  }

  getTasks() {
    return this.tasks;
  }

  getTask(taskID) {
    var targetTask;

    this.tasks.some((section, dayIndex) => {
      return section.data.some((task, taskIndex) => {
        if (task.key !== taskID) { return false; }

        targetTask = {
          task: task,
          dayIdx: dayIndex,
          taskIdx: taskIndex
        };

        return true;
      });
    });

    return targetTask;
  }

  getTaskId(task) {
    var hash = 0;

    const compositeKey = task.title + task.date;

    for (i = 0; i < compositeKey.length; i++) {
      hash = ((hash << 5) - hash) + compositeKey.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }

    return `${hash}`;
  }

  buildTask(title='', blocker='', date=new Date(), completionPercentage=0) {
    return {
      key: this.getTaskId({ title: title, date: date.valueOf() }),
      title: title,
      blocker: blocker,
      completionPercentage: completionPercentage,
      hoursLogged: 0,
      isComplete: false,
      date: date.valueOf(),
      reminder: {
        time: null,
        repeat: 'never',
        enabled: false
      }
    };
  }

  buildDay(day, ...tasks) {
    return {
      day: day,
      hoursLogged: 0,
      data: tasks
    };
  }

  findMostRecentDay() {
    const today = new Date().toLocaleDateString();
    const days = this.tasks;

    for (let dayIdx = days.length - 1; dayIdx >= 0; dayIdx--) {
      const dayTasks = days[dayIdx];

      if (dayTasks.day > today) { continue; }

      return {
        day: dayTasks,
        dayIdx: dayIdx,
        isToday: dayTasks.day === today
      };
    }

    return {};
  }

  storeTasks() {
    AsyncStorage.setItem('tasks', this.getPopulatedTasksJSON())
      .catch((error) => {
        console.error(error);
      });
  }

  createTipDay(date) {
    const tipDay = this.buildDay(date);

    tipDay.isRolledFromPreviousDays = true;

    return tipDay;
  }

  getPopulatedTasksJSON() {
    return JSON.stringify(this.tasks.reduce((populatedDays, day) => {
      const isCreateTaskTipFound = filterPopulatedAndIsTipFound(day);

      if (0 !== day.data.length) {
        populatedDays.push(isCreateTaskTipFound ? this.createTipDay(day.day) : day);
      }

      return populatedDays;
    }, []));
  }

  updateTasksFromStorage() {
    AsyncStorage.getItem('tasks')
      .then((tasks) => {
        this.tasks = !tasks ? [] : JSON.parse(tasks);
        this.maybeRolloverTasksToToday();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  maybeRolloverTasksToToday() {
    const today = new Date().toLocaleDateString();
    const { day, dayIdx, isToday } = this.findMostRecentDay();

    if (isToday && day.isRolledFromPreviousDays) { return; }

    const { incompleteTasks, rolloverDayIdx } = this.getIncompleteTasksFromPreviousDays(dayIdx, isToday);

    this.rolloverTasks(incompleteTasks, rolloverDayIdx, isToday);
  }

  getIncompleteTasksFromPreviousDays(mostRecentDayIdx, isToday) {
    var rolloverDayIdx = isToday ? mostRecentDayIdx : mostRecentDayIdx + 1;
    var incompleteTasks = [];

    for (let dayIdx = rolloverDayIdx - 1; dayIdx >= 0; dayIdx--) {
      const day = this.tasks[dayIdx];

      this.maybeAddIncompleteTasks(day.data, incompleteTasks);

      if (day.isRolledFromPreviousDays) {
        // If previously rolled day has no tasks, remove it
        if (0 === day.data.length) {
          this.tasks.splice(dayIdx, 1);
          rolloverDayIdx--;
        }

        break;
      }
    }

    return { incompleteTasks, rolloverDayIdx };
  }

  rolloverTasks(incompleteTasks, rolloverDayIdx, isToday) {
    const rolledDay = isToday ? this.tasks[rolloverDayIdx] :
      this.buildDay(new Date().toLocaleDateString(), ...incompleteTasks);

    rolledDay.isRolledFromPreviousDays = true;

    if (isToday) {
      this.tasks[rolloverDayIdx].data.unshift(...incompleteTasks);
    } else {
      this.tasks.splice(rolloverDayIdx, 0, rolledDay);
    }

    this.storeTasks();
  }

  maybeAddIncompleteTasks(tasks, incompleteTasks) {
    tasks.forEach((task) => {
      if (task.isComplete) { return; }

      incompleteTasks.push(
        this.buildTask(task.title, task.blocker, new Date(), task.completionPercentage));
    });
  }

  getTodayPlusOffset(offset = 0) {
    var day = new Date();
    day.setDate(day.getDate() + offset);

    return day;
  }
}

function filterPopulatedAndIsTipFound(day) {
  var isCreateTaskTipFound = false;

  day.data = day.data.filter((task) => {
    if (isPopulatedTask(task)) {
      return true;
    }
    if (task.isCreateTaskTip) {
      isCreateTaskTipFound = true;
      return true;
    }
  });

  return isCreateTaskTipFound;
}

function isPopulatedTask(task) {
  return task.title || task.blocker
    || task.completionPercentage !== 0 || task.hoursLogged !== 0;
}