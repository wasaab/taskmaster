import { AsyncStorage } from 'react-native';

export default class TaskManager {
    constructor() {
        if (TaskManager.instance) {
            return TaskManager.instance;
        }

        this.tasks = [];
        TaskManager.instance = this;
        return TaskManager.instance;
    }

    updateTask(updatedTask) {
        const taskIdx = this.tasks.findIndex((task) => task.key === updatedTask.key);

        // console.log('old task:', this.tasks[taskIdx]);
        // console.log('updated task:', updatedTask);
        this.tasks.splice(taskIdx, 1, updatedTask);
        // console.log('tasks after update:', this.tasks);
    }

    storeTasks() {
        console.log('------------------------- STORING TASKS ------------------------');
        AsyncStorage.setItem('tasks', JSON.stringify(this.tasks))
            .catch((error) => {
                console.error(error);
            });
    }

    updateTasksFromStorage() {
        AsyncStorage.getItem('tasks')
            .then((tasks) => {
                if (!tasks) {
                    this.tasks = [
                        {
                          "day": "5/28/2019",
                          "data": [
                            {
                              "key": "193685690",
                              "title": "Finish the application1",
                              "blocker": "React is tricky",
                              "completionPercentage": 35,
                              "hoursLogged": 0,
                              "date": 1559013078927
                            },
                            {
                              "key": "-311872935",
                              "title": "Finish the application2",
                              "blocker": "React is tricky",
                              "completionPercentage": 15,
                              "hoursLogged": 0,
                              "date": 1559013078927
                            },
                            {
                              "key": "-817431560",
                              "title": "Finish the application3",
                              "blocker": "React is tricky",
                              "completionPercentage": 25,
                              "hoursLogged": 0,
                              "date": 1559013078927
                            }
                          ]
                        },
                        {
                          "day": "5/29/2019",
                          "data": [
                            {
                              "key": "-1314165795",
                              "title": "Make a create task screen",
                              "blocker": "Clarification needed",
                              "completionPercentage": 40,
                              "hoursLogged": 0,
                              "date": 1559099478927
                            },
                            {
                              "key": "694757902",
                              "title": "Improve the reminder screen",
                              "blocker": "Need mockup from Collin",
                              "completionPercentage": 70,
                              "hoursLogged": 0,
                              "date": 1559099478927
                            },
                            {
                              "key": "-395792986",
                              "title": "Make a timesheet screen",
                              "blocker": "Clarification needed",
                              "completionPercentage": 83,
                              "hoursLogged": 0,
                              "date": 1559099478927
                            },
                            {
                              "key": "513648197",
                              "title": "Make the task title wrap",
                              "blocker": "Lots of static padding",
                              "completionPercentage": 0,
                              "hoursLogged": 0,
                              "date": 1559099478927
                            },
                            {
                              "key": "-1784365333",
                              "title": "Improve styling",
                              "blocker": "I can't see",
                              "completionPercentage": 27,
                              "hoursLogged": 0,
                              "date": 1559099478927
                            }
                          ]
                        },
                        {
                          "day": "5/30/2019",
                          "data": [
                            {
                              "key": "-1811633621",
                              "title": "Finish the application4",
                              "blocker": "React is tricky",
                              "completionPercentage": 95,
                              "hoursLogged": 0,
                              "date": 1559185878927
                            },
                            {
                              "key": "1977775050",
                              "title": "Finish the application5",
                              "blocker": "React is tricky",
                              "completionPercentage": 15,
                              "hoursLogged": 0,
                              "date": 1559185878927
                            },
                            {
                              "key": "1472216425",
                              "title": "Finish the application6",
                              "blocker": "React is tricky",
                              "completionPercentage": 46,
                              "hoursLogged": 0,
                              "date": 1559185878927
                            },
                            {
                              "key": "966657800",
                              "title": "Finish the application7",
                              "blocker": "React is tricky",
                              "completionPercentage": 25,
                              "hoursLogged": 0,
                              "date": 1559185878927
                            }
                          ]
                        }
                      ];
                } else {
                    // Pop so you just get 3 most recent or something .slice(-3)
                    this.tasks = JSON.parse(tasks);
                    // console.log('tasks from storage:', this.tasks);
                }
            })
            .catch((error) => {
                console.error(error);
            });
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
}

