import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { useEffect, useState, useMemo } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import useFetch from "../useFetch";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartDataLabels,
);
export default function Report() {
  const { data, loading, error } = useFetch(
    "https://anvaya-crm-backend-puce.vercel.app/report/last-week",
  );
  const {
    data: totalLeadsData,
    loading: totalLeadsLoading,
    error: totalLeadsError,
  } = useFetch("https://anvaya-crm-backend-puce.vercel.app/report/pipeline");
  const {
    data: leadData,
    loading: leadLoading,
    error: leadError,
  } = useFetch("https://anvaya-crm-backend-puce.vercel.app/leads");

  const totalLeads = totalLeadsData?.totalLeadsInPipeline || 0;
  const [report, setReport] = useState([]);
  const [displayReport, setDisplayReport] = useState([]);
  const [leadsData, setLeadsData] = useState({});
  useEffect(() => {
    if (data && data.length > 0) {
      setReport(data);
      setDisplayReport(data);
    }
    if (leadData && leadData.length > 0) {
      setLeadsData(leadData);
    }
  }, [data, leadData]);

  /* pie Chart sales Agent vs Leads */
  const stats = {
    closedDeals: 10,
    totalDeals: 45,
  };

  const openDeals = stats.totalDeals - stats.closedDeals;

  const [chartSize, setChartSize] = useState(400);
  const [containerPadding, setContainerPadding] = useState(20);

  const chartData = {
    labels: ["Closed Deals", "Open Deals"],
    datasets: [
      {
        data: [stats.closedDeals, openDeals],
        backgroundColor: [
          "#00c07f", // Emerald Mint (Greener & more vibrant than #198754, pops on Dark/Purple)
          "#3a94ff", // Electric Sky Blue (Slightly richer than #64aef9, excellent light/dark contrast)
          "#ff9f0a", // Amber Orange (Universal accent, works everywhere)
          "#f14668", // Crimson Rose (For errors/destructive items)
        ],
        hoverBackgroundColor: ["#157347", "#64aef9"],
        borderColor: "transparent",
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  /* Bar Chart sales Agent vs Leads */

  const [barChartWidth, setBarChartWidth] = useState(105); // In percentage
  const [barCardPadding, setBarCardPadding] = useState(20);

  const processedData = useMemo(() => {
    console.log(leadData)
    const counts = {};
    leadsData.length > 0 &&
      leadsData
        .filter((l) => l.salesAgent !== null && l.salesAgent.name && l.status === "Closed")
        .forEach((leads) => {
          counts[leads.salesAgent.name] =
            (counts[leads.salesAgent.name] || 0) + 1;
        });
    return counts;
  }, [leadsData]);

  const barChartData = {
    labels: Object.keys(processedData),
    datasets: [
      {
        label: "Deals Closed",
        data: Object.values(processedData),
        backgroundColor: "rgb(34,60,90)",
        borderColor: "rgb(34,60,90)",
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        grace: "20%",
        ticks: {
          stepSize: 1,
          font: {
            size: 14,
            weight: "600",
          },
        },
        title: {
          display: true,
          text: "Number of Leads",
          font: {
            size: 14,
            weight: "600",
          },
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      x: {
        title: {
          display: true,
          text: "Sales Agents",
          font: {
            size: 14,
            weight: "600",
          },
        },
        ticks: {
          font: {
            size: 16,
            weight: "400",
          },
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
    plugins: {
      datalabels: {
        display: true,
        align: "end",
        anchor: "end",
        offset: 4,
        font: {
          size: 14,
          weight: "bold",
        },
        formatter: (value) => value,
      },
      legend: { display: false },
    },
  };
  // Bar Chart status vs Leads

  // 2. Layout State
  const [statusChartWidth, setStatusChartWidth] = useState(100); // In percentage
  const [statusCardPadding, setStatusCardPadding] = useState(20);

  // 3. Process Data: Group deals by Sales Agent
  const statusArr = [
    {
      label: "New",
      count: 0,
      color: "#0dcaf0",
      icon: "bi-lightning-charge-fill",
    },
    {
      label: "Contacted",
      count: 0,
      color: "#0d6efd",
      icon: "bi-telephone-fill",
    },
    {
      label: "Closed",
      count: 0,
      color: "#198754",
      icon: "bi-check-circle-fill",
    },
    {
      label: "Proposal Sent",
      count: 0,
      color: "#ffc107",
      icon: "bi-file-earmark-text-fill",
    },
    {
      label: "Qualified",
      count: 0,
      color: "#dc3545",
      icon: "bi-gem",
    },
  ];
  const statusData = useMemo(() => {
    const counts = {};
    leadsData.length > 0 &&
      leadsData.forEach((lead) => {
        counts[lead.status] = (counts[lead.status] || 0) + 1;
      });
    return statusArr.map((statusItem) => ({
      ...statusItem,
      count: counts[statusItem.label] || 0,
    }));
  }, [leadsData, statusArr]);

  const statusChartData = {
    labels: statusData.map((items) => items.label),
    datasets: [
      {
        data: statusData.map((items) => items.count),
        backgroundColor: statusData.map((item) => item.color),
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        borderRadius: 5,
        barPercentage: 0.9,
        categoryPercentage: 0.8,
      },
    ],
  };

  const statusChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grace: "20%",
        ticks: { stepSize: 1 },
        title: { display: true, text: "Number of Leads" },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      x: {
        ticks: {
          font: {
            size: 13,
            weight: "600",
          },
          padding: 15,
        },
        title: { display: true, text: "Leads Status" },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
    plugins: {
      datalabels: {
        display: true,
        align: "end",
        anchor: "end",
        offset: 4,
        font: {
          size: 14,
          weight: "bold",
        },
        formatter: (value) => value,
      },
      legend: { display: false },
    },
  };
  return (
    <>
      <main>
        <div className="row ">
          <div className="col" style={{ minheight: "90vh", overflowY: "auto" }}>
            <h1 className="mb-4">Reports</h1>
            <div className="py-1">
              <div className="row ">
                <div className="col-lg-6 mb-4">
                  {/* Controls Card */}
                  <div className="card shadow mb-4 border-0 bg-white">
                    <div className="card-body d-flex flex-wrap align-items-center justify-content-between gap-3">
                      <div>
                        <h5 className="mb-0 text-dark">
                          <i className="bi bi-gear-wide-connected me-2 text-primary"></i>
                          Leads closed and Leads in pipeline
                        </h5>
                      </div>
                    </div>
                  </div>

                  {/* Chart Wrapper: Upgraded to be responsive */}
                  <div className="card shadow border-0 bg-white">
                    <div className="card-body d-flex justify-content-center align-items-center">
                      <div
                        className="w-100 rounded shadow-sm bg-white"
                        style={{
                          maxWidth: "400px",
                          width: "100%",
                          height: "320px",
                          padding: "20px",
                          transition: "0.3s all ease-in-out",
                          borderRadius: "15px",
                          position: "relative",
                        }}
                      >
                        <Pie data={chartData} options={options} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 mb-4"> 
                  <div className="card shadow border-0 bg-white h-100">
                    <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 fw-bold">
                        <i className="bi bi-bar-chart-line-fill me-2 text-primary"></i>
                        Leads Closed by the sales agents
                      </h5>
                    </div>
                    <div className="card-body overflow-hidden pt-4">
                      <div
                        className="mx-auto bg-white shadow-sm rounded"
                        style={{
                          width: `${barChartWidth || 100}%`,
                          padding: `${barCardPadding || 20}px`,
                          transition: "all 0.3s ease",
                        }}
                      >
                        <Bar data={barChartData} options={barOptions} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col">
                  <div className="card shadow border-0 bg-white">
                    <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 fw-bold">
                        <i className="bi bi-bar-chart-line-fill me-2 text-primary"></i>
                        Lead Status Distribution
                      </h5>
                    </div>
                    <div className="card-body overflow-hidden pt-4">
                      <div
                        className="bg-white shadow-sm rounded"
                        style={{
                          width: `${statusChartWidth || 100}%`,
                          padding: `${statusCardPadding || 20}px`,
                          height: "280px",
                          position: "relative",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <Bar
                          data={statusChartData}
                          options={statusChartOptions}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
