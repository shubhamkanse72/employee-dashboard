import "./App.css";
import { useState, useEffect, useCallback } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import sampleData from "./sample-data.json";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function App() {
  const data = sampleData.data.AuthorWorklog.rows;
  const [selectedUser, setSelectedUser] = useState("total");
  const [selectedDate, setSelectedDate] = useState("total");
  const [open, setOpen] = useState(0);
  const [merged, setMerged] = useState(0);
  const [reviewed, setReviewed] = useState(0);
  const [comment, setComment] = useState(0);
  const [commit, setCommit] = useState(0);
  const [resolved, setResolved] = useState(0);
  const [alert, setAlert] = useState(0);

  const [
    openStyle,
    mergedStyle,
    commitStyle,
    reviewedStyle,
    commentStyle,
    alertStyle,
    resolvedStyle,
  ] = sampleData.data.AuthorWorklog.activityMeta;

  const barData = {
    labels: [
      "PR Open",
      "PR Merged",
      "Commit",
      "PR Reviewed",
      "PR Comment",
      "Incidents Resolved",
      "Incidents Alerts",
    ],
    datasets: [
      {
        label: "",
        data: [open, merged, commit, reviewed, comment, alert, resolved],
        backgroundColor: [
          openStyle.fillColor,
          mergedStyle.fillColor,
          commitStyle.fillColor,
          reviewedStyle.fillColor,
          commentStyle.fillColor,
          alertStyle.fillColor,
          resolvedStyle.fillColor,
        ],
        borderColor: [
          "#000000",
          "#000000",
          "#000000",
          "#000000",
          "#000000",
          "#000000",
          "#000000",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieData = {
    labels: [
      "PR Open",
      "PR Merged",
      "Commit",
      "PR Reviewed",
      "PR Comment",
      "Incidents Resolved",
      "Incidents Alerts",
    ],
    datasets: [
      {
        label: "",
        data: [open, merged, commit, reviewed, comment, alert, resolved],
        backgroundColor: [
          openStyle.fillColor,
          mergedStyle.fillColor,
          commitStyle.fillColor,
          reviewedStyle.fillColor,
          commentStyle.fillColor,
          alertStyle.fillColor,
          resolvedStyle.fillColor,
        ],
        borderColor: [
          "#000000",
          "#000000",
          "#000000",
          "#000000",
          "#000000",
          "#000000",
          "#000000",
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };
  const setData = (
    open,
    merged,
    commit,
    reviewed,
    comment,
    alert,
    resolved
  ) => {
    setOpen(open);
    setMerged(merged);
    setCommit(commit);
    setReviewed(reviewed);
    setComment(comment);
    setAlert(alert);
    setResolved(resolved);
  };
  const sortData = useCallback(
    (user, date) => {
      if (user === "total") {
        if (date === "total") {
          let newData = {
            open: 0,
            merged: 0,
            commit: 0,
            reviewed: 0,
            comment: 0,
            alert: 0,
            resolved: 0,
          };
          for (let i = 0; i < data.length; i++) {
            let [open, merged, commit, reviewed, comment, alert, resolved] =
              data[i].totalActivity;

            newData.open = newData.open + parseInt(open.value);
            newData.merged = newData.merged + parseInt(merged.value);
            newData.commit = newData.commit + parseInt(commit.value);
            newData.reviewed = newData.reviewed + parseInt(reviewed.value);
            newData.comment = newData.comment + parseInt(comment.value);
            newData.alert = newData.alert + parseInt(alert.value);
            newData.resolved = newData.resolved + parseInt(resolved.value);
          }
          setData(
            newData.open,
            newData.merged,
            newData.commit,
            newData.reviewed,
            newData.comment,
            newData.alert,
            newData.resolved
          );
        } else {
          let newData = {
            open: 0,
            merged: 0,
            commit: 0,
            reviewed: 0,
            comment: 0,
            alert: 0,
            resolved: 0,
          };
          for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].dayWiseActivity.length; j++) {
              if (data[i].dayWiseActivity[j].date === date) {
                let items = data[i].dayWiseActivity[j].items;
                let [open, merged, commit, reviewed, comment, alert, resolved] =
                  items.children;
                newData.open = newData.open + parseInt(open.count);
                newData.merged = newData.merged + parseInt(merged.count);
                newData.commit = newData.commit + parseInt(commit.count);
                newData.reviewed = newData.reviewed + parseInt(reviewed.count);
                newData.comment = newData.comment + parseInt(comment.count);
                newData.alert = newData.alert + parseInt(alert.count);
                newData.resolved = newData.resolved + parseInt(resolved.count);
              }
            }
          }
          setData(
            newData.open,
            newData.merged,
            newData.commit,
            newData.reviewed,
            newData.comment,
            newData.alert,
            newData.resolved
          );
        }
      } else {
        if (date === "total") {
          for (let i = 0; i < data.length; i++) {
            if (data[i].name === user) {
              let [open, merged, commit, reviewed, comment, alert, resolved] =
                data[i].totalActivity;
              setData(
                parseInt(open.value),
                parseInt(merged.value),
                parseInt(commit.value),
                parseInt(reviewed.value),
                parseInt(comment.value),
                parseInt(alert.value),
                parseInt(resolved.value)
              );
            }
          }
        } else {
          for (let i = 0; i < data.length; i++) {
            if (data[i].name === user) {
              for (let j = 0; j < data[i].dayWiseActivity.length; j++) {
                if (data[i].dayWiseActivity[j].date === date) {
                  let newData = data[i].dayWiseActivity[j].items;
                  let [
                    open,
                    merged,
                    commit,
                    reviewed,
                    comment,
                    alert,
                    resolved,
                  ] = newData.children;
                  setData(
                    parseInt(open.count),
                    parseInt(merged.count),
                    parseInt(commit.count),
                    parseInt(reviewed.count),
                    parseInt(comment.count),
                    parseInt(alert.count),
                    parseInt(resolved.count)
                  );
                }
              }
            }
          }
        }
      }
    },
    [data]
  );
  useEffect(() => {
    sortData(selectedUser, selectedDate);
  }, [selectedUser, selectedDate, sortData]);

  return (
    <div className="App">
      <div className="dashboard">
        <section className="title">
          <div>
            <h3>Employee Dashboard</h3>
          </div>
        </section>
        <section className="filters">
          <div>
            <label htmlFor="dropdown">Select User:</label>
            <select
              className="select-dropdown"
              value={selectedUser}
              onChange={handleUserChange}
            >
              <option value="total">All</option>
              {data.map((option, index) => (
                <option key={index} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="dropdown">Select Date:</label>
            <select value={selectedDate} onChange={handleDateChange}>
              <option value="total">All</option>
              {data.map((item) =>
                item.dayWiseActivity.map((option, optionIndex) => (
                  <option key={optionIndex} value={option.date}>
                    {option.date}
                  </option>
                ))
              )}
            </select>
          </div>
        </section>
        <section className="data">
          <div>
            <div
              className="data_count"
              style={{ backgroundColor: openStyle.fillColor }}
            >
              <span>PR Open</span>
              <span>{open}</span>
            </div>
            <div
              className="data_count"
              style={{ backgroundColor: mergedStyle.fillColor }}
            >
              <span>PR Merged</span>
              <span>{merged}</span>
            </div>
            <div
              className="data_count"
              style={{ backgroundColor: reviewedStyle.fillColor }}
            >
              <span>PR Reviewed</span>
              <span>{reviewed}</span>
            </div>
            <div
              className="data_count"
              style={{ backgroundColor: commentStyle.fillColor }}
            >
              <span>PR Comments</span>
              <span>{comment}</span>
            </div>
          </div>
          <div>
            <div
              className="data_count"
              style={{ backgroundColor: commitStyle.fillColor }}
            >
              <span>Commits</span>
              <span>{commit}</span>
            </div>
            <div
              className="data_count"
              style={{ backgroundColor: resolvedStyle.fillColor }}
            >
              <span>Incidents Resolved</span>
              <span>{resolved}</span>
            </div>
            <div
              className="data_count"
              style={{ backgroundColor: alertStyle.fillColor }}
            >
              <span>Incident Alerts</span>
              <span>{alert}</span>
            </div>
          </div>
        </section>
        <section className="chart-data">
          <div>
            <Pie data={pieData} />
          </div>
          <div>
            <Bar data={barData} options={barOptions} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
