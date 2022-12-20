import React from 'react';
import TaskList from './components/TaskList.js';
import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

const TASKS = [
  {
    id: 1,
    title: 'Mow the lawn',
    isComplete: false,
  },
  {
    id: 2,
    title: 'Cook Pasta',
    isComplete: true,
  },
];
const kBaseUrl = 'http://localhost:3000';

const convertFromApi = (apiTask) => {
  const {...rest} = apiTask;
  const newTask = {...rest};
  return newTask;
};

const getAllTasksApi = () => {
  return axios.get(`${kBaseUrl}/tasks`)
  .then(response => {
    return response.data.map(convertFromApi);
  })
  .catch(err => {
    console.log(err);
  });
};

const completeTaskApi = (id) => {
  return axios.patch(`${kBaseUrl}/tasks/${id}/mark-complete`)
  .then(response => {
    return convertFromApi(response.data);
  })
  .catch(error => {
    console.log(error);
  });
};

const unregisterTaskApi = (id) => {
  return axios.delete(`${kBaseUrl}/tasks/${id}`)
  .then(response => {
    return convertFromApi(response.data);
  })
  .catch(error => {
    console.log(error);
  });
};

const App = () => {
  const [taskData, setTaskData] = useState([]); 

  const getAllTasks = () => {
    return getAllTasksApi()
    .then(tasks => {
      setTaskData(tasks);
    });
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  const completeTask = (id) => {
    return completeTaskApi(id)
    .then(taskResult => {
      setTaskData(taskData => taskData.map(task => {
        if(task.id === taskResult.id) {
          return {...task, isComplete: task.isComplete === true};
        } else {
          return task;
        }
    }));
  });
  };
  const deleteTask = (id) => {
    return unregisterTaskApi(id)
    .then(taskResult => {
      return getAllTasks();
    });
    // setTaskData(taskData => taskData.filter(task => {
    //   return task.id !== taskResult.id;
    // }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ada&apos;s Task List</h1>
      </header>
      <main>
        <div>{<TaskList taskData={taskData} onCompleteTask={completeTask} onDeleteTask={deleteTask} />}</div>
      </main>
    </div>
  );
};

export default App;
