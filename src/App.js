import "./App.css";
import { useState, useEffect, useCallback } from "react";
import { Bar, Pie } from "react-chartjs-2";
import axios from "axios";
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
  const [selectedUser, setSelectedUser] = useState("total");
  const [data, setInitialData] = useState({});
  const [colorOptions, setColorOptions] = useState({
    openStyle: "",
    mergedStyle: "",
    commitStyle: "",
    reviewedStyle: "",
    commentStyle: "",
    alertStyle: "",
    resolvedStyle: "",
  });
  const [selectedDate, setSelectedDate] = useState("total");
  const [open, setOpen] = useState(0);
  const [merged, setMerged] = useState(0);
  const [reviewed, setReviewed] = useState(0);
  const [comment, setComment] = useState(0);
  const [commit, setCommit] = useState(0);
  const [resolved, setResolved] = useState(0);
  const [alert, setAlert] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/shubhamkanse72/sample-json-data/main/sample-data.json"
        );
        let [open, merged, commit, reviewed, comment, alert, resolved] =
          response.data.data.AuthorWorklog.activityMeta;

        setInitialData(response.data.data.AuthorWorklog.rows);
        setColorOptions({
          openStyle: open,
          mergedStyle: merged,
          commitStyle: commit,
          reviewedStyle: reviewed,
          commentStyle: comment,
          alertStyle: alert,
          resolvedStyle: resolved,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          colorOptions.openStyle.fillColor,
          colorOptions.mergedStyle.fillColor,
          colorOptions.commitStyle.fillColor,
          colorOptions.reviewedStyle.fillColor,
          colorOptions.commentStyle.fillColor,
          colorOptions.alertStyle.fillColor,
          colorOptions.resolvedStyle.fillColor,
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
          colorOptions.openStyle.fillColor,
          colorOptions.mergedStyle.fillColor,
          colorOptions.commitStyle.fillColor,
          colorOptions.reviewedStyle.fillColor,
          colorOptions.commentStyle.fillColor,
          colorOptions.alertStyle.fillColor,
          colorOptions.resolvedStyle.fillColor,
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
  if (loading) {
    return <div className="loading"><h3>Loading...</h3></div>;
  }

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
            <label htmlFor="dropdown">Select User: </label>
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
            <label htmlFor="dropdown">Select Date: </label>
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
              style={{ backgroundColor: colorOptions.openStyle.fillColor }}
            >
              <span>PR Open</span>
              <span>{open}</span>
            </div>
            <div
              className="data_count"
              style={{ backgroundColor: colorOptions.mergedStyle.fillColor }}
            >
              <span>PR Merged</span>
              <span>{merged}</span>
            </div>
            <div
              className="data_count"
              style={{ backgroundColor: colorOptions.reviewedStyle.fillColor }}
            >
              <span>PR Reviewed</span>
              <span>{reviewed}</span>
            </div>
            <div
              className="data_count"
              style={{ backgroundColor: colorOptions.commentStyle.fillColor }}
            >
              <span>PR Comments</span>
              <span>{comment}</span>
            </div>
          </div>
          <div>
            <div
              className="data_count"
              style={{ backgroundColor: colorOptions.commitStyle.fillColor }}
            >
              <span>Commits</span>
              <span>{commit}</span>
            </div>
            <div
              className="data_count"
              style={{ backgroundColor: colorOptions.resolvedStyle.fillColor }}
            >
              <span>Incidents Resolved</span>
              <span>{resolved}</span>
            </div>
            <div
              className="data_count"
              style={{ backgroundColor: colorOptions.alertStyle.fillColor }}
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
