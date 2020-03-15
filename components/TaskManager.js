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

  storeTasks() {
    AsyncStorage.setItem('tasks', this.getPopulatedTasksJSON())
      .catch((error) => {
        console.error(error);
      });
  }

  getPopulatedTasksJSON() {
    return JSON.stringify(this.tasks.reduce((populatedDays, day) => {
      day.data = day.data.filter(isPopulatedTask);

      return getUpdatedDays(day, populatedDays);
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
    const todaysTasks = this.tasks.find((day) => day.day === today);

    if (todaysTasks && todaysTasks.isRolledFromPreviousDays) { return; }

    this.rolloverIncompleteTasks(today);
  }

  rolloverIncompleteTasks(today) {
    var incompleteTasks = [];

    this.tasks = this.tasks.reduce((days, day) => {
      if (day.day < today) {
        this.maybeAddIncompleteTasks(day.data, incompleteTasks);
      } else if (day.day === today) {
        this.rolloverTasks(day, incompleteTasks);
        incompleteTasks = [];
      }

      return getUpdatedDays(day, days);
    }, []);

    if (0 === incompleteTasks.length) { return; }

    this.rolloverTasks(today, incompleteTasks);
  }

  maybeAddIncompleteTasks(tasks, incompleteTasks) {
    tasks.forEach((task) => {
      if (task.isComplete) { return; }

      incompleteTasks.push(
        this.buildTask(task.title, task.blocker, new Date(), task.completionPercentage));
    });
  }

  rolloverTasks(today, incompleteTasks, day) {
    const rolledDay = day || this.buildDay(today, ...incompleteTasks);

    rolledDay.isRolledFromPreviousDays = true;

    if (day) {
      day.data.push(...incompleteTasks);
    } else {
      this.tasks.push(rolledDay);
    }

    this.storeTasks();
  }

  getTodayPlusOffset(offset = 0) {
    var day = new Date();
    day.setDate(day.getDate() + offset);

    return day;
  }
}

function getUpdatedDays(day, days) {
  if (0 !== day.data.length) {
    days.push(day);
  }

  return days;
}

function isPopulatedTask(task) {
  return task.title || task.blocker
    || task.completionPercentage !== 0 || task.hoursLogged !== 0;
}