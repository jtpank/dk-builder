import { Bar } from "react-chartjs-2";
export const BarChart = ({ chartData, labelName }) => {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>{labelName} exposures per player</h2>
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Exposures per player (percentage)"
            },
            legend: {
              display: false
            }
          }
        }}
      />
    </div>
  );
};