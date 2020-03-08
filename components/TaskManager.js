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

  storeTasks() {
    AsyncStorage.setItem('tasks', JSON.stringify(this.tasks))
      .catch((error) => {
        console.error(error);
      });
  }

  updateTasksFromStorage() {
    AsyncStorage.getItem('tasks')
      .then((tasks) => {
        this.tasks = !tasks ? this.createDemoTasks() : JSON.parse(tasks);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getTodayPlusOffset(offset = 0) {
    var day = new Date();
    day.setDate(day.getDate() + offset);

    return day;
  }

  createDemoTasks() {
    return [
      {
        "day": this.getTodayPlusOffset(-1).toLocaleDateString(),
        "hoursLogged": 0,
        "data": [
          {
            "key": "193685690",
            "title": "Task from yesterday",
            "blocker": "This is a blocker",
            "completionPercentage": 35,
            "hoursLogged": 0,
            "date": 1559013078927,
            "isComplete": false,
            "reminder": {
              "time": this.getTodayPlusOffset(1).getTime(),
              "repeat": "never",
              "enabled": true
            }
          },
          {
            "key": "-311872935",
            "title": "Another task from yesterday",
            "blocker": "",
            "completionPercentage": 15,
            "hoursLogged": 0,
            "date": 1559013078927,
            "isComplete": false,
            "reminder": {
              "time": this.getTodayPlusOffset(4).getTime(),
              "repeat": "daily",
              "enabled": false
            }
          },
          {
            "key": "-817431560",
            "title": "Final task from yesterday",
            "blocker": "This is a blocker",
            "completionPercentage": 25,
            "hoursLogged": 0,
            "date": 1559013078927,
            "isComplete": false,
            "reminder": {
              "time": this.getTodayPlusOffset().getTime(),
              "repeat": "weekly",
              "enabled": true
            }
          }
        ]
      },
      {
        "day": this.getTodayPlusOffset().toLocaleDateString(),
        "hoursLogged": 0,
        "data": [
          {
            "key": "-1314165795",
            "title": "Improve animations",
            "blocker": "Need to upgrade react-native version",
            "completionPercentage": 40,
            "hoursLogged": 0,
            "date": 1559099478927,
            "isComplete": false,
            "reminder": {
              "time": null,
              "repeat": "never",
              "enabled": false
            }
          },
          {
            "key": "694757902",
            "title": "Improve the reminder screen",
            "blocker": "Need mockup",
            "completionPercentage": 70,
            "hoursLogged": 0,
            "date": 1559099478927,
            "isComplete": false,
            "reminder": {
              "time": this.getTodayPlusOffset(2).getTime(),
              "repeat": "never",
              "enabled": true
            }
          },
          {
            "key": "-395792986",
            "title": "Implement task pruning",
            "blocker": "Clarification needed",
            "completionPercentage": 83,
            "hoursLogged": 0,
            "date": 1559099478927,
            "isComplete": false,
            "reminder": {
              "time": this.getTodayPlusOffset(2).getTime(),
              "repeat": "never",
              "enabled": false
            }
          },
          {
            "key": "513648197",
            "title": "Make the task title wrap",
            "blocker": "Container not flexible",
            "completionPercentage": 0,
            "hoursLogged": 0,
            "date": 1559099478927,
            "isComplete": false,
            "reminder": {
              "time": this.getTodayPlusOffset(2).getTime(),
              "repeat": "never",
              "enabled": true
            }
          },
          {
            "key": "-1784365333",
            "title": "Add extended task details",
            "blocker": "",
            "completionPercentage": 27,
            "hoursLogged": 0,
            "date": 1559099478927,
            "isComplete": false,
            "reminder": {
              "time": this.getTodayPlusOffset(3).getTime(),
              "repeat": "daily",
              "enabled": false
            }
          }
        ]
      },
      {
        "day": this.getTodayPlusOffset(1).toLocaleDateString(),
        "hoursLogged": 0,
        "data": [
          {
            "key": "-1811633621",
            "title": "Tomorrow's task",
            "blocker": "This is a blocker",
            "completionPercentage": 95,
            "hoursLogged": 0,
            "date": 1559185878927,
            "isComplete": false,
            "reminder": {
              "time": this.getTodayPlusOffset(2).getTime(),
              "repeat": "never",
              "enabled": true
            }
          },
          {
            "key": "1977775050",
            "title": "Task for tomorrow",
            "blocker": "This is a blocker",
            "completionPercentage": 15,
            "hoursLogged": 0,
            "date": 1559185878927,
            "isComplete": false,
            "reminder": {
              "time": this.getTodayPlusOffset(2).getTime(),
              "repeat": "never",
              "enabled": false
            }
          },
          {
            "key": "1472216425",
            "title": "Another task for tomorrow",
            "blocker": "",
            "completionPercentage": 46,
            "hoursLogged": 0,
            "date": 1559185878927,
            "isComplete": false,
            "reminder": {
              "time": this.getTodayPlusOffset(2).getTime(),
              "repeat": "never",
              "enabled": true
            }
          },
          {
            "key": "966657800",
            "title": "Yet another task for tomorrow",
            "blocker": "",
            "completionPercentage": 25,
            "hoursLogged": 0,
            "date": 1559185878927,
            "isComplete": false,
            "reminder": {
              "time": this.getTodayPlusOffset(2).getTime(),
              "repeat": "never",
              "enabled": false
            }
          }
        ]
      }
    ];
  }
}

