import React, { useEffect, useState } from "react";
import axios from "axios";
import Papa from "papaparse";
import Highcharts, { type Options, type SeriesOptionsType } from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface Post {
  video_id: string;
  account_name: string;
  video_type: string;
}

interface Stat {
  video_id: string;
  data_date: string;
  views: string;
}

const defaultChannels = [
    "GCN",
    "GMBN",
    "GCN TECH"
];

type GroupMode = "video_type" | "account_name";

const StackedViewsChart: React.FC = () => {
  const [options, setOptions] = useState<Options | null>(null);
  const [groupMode, setGroupMode] = useState<GroupMode>("video_type");
  const [startDate, setStartDate] = useState<string>("2025-01-01");
  const [endDate, setEndDate] = useState<string>("2025-12-31");

  useEffect(() => {
    
    const loadData = async () => {
      const [postsRes, statsRes] = await Promise.all([
        axios.get<string>("/posts.csv"),
        axios.get<string>("/stats.csv"),
      ]);

      const posts = Papa.parse<Post>(postsRes.data, { header: true }).data;
      const stats = Papa.parse<Stat>(statsRes.data, { header: true }).data;
      console.log('stats is ,', stats);

      const postMap = new Map<string, Post>();
      posts.forEach((p) => postMap.set(p.video_id, p));

      const grouped: Record<string, Record<string, number>> = {};
      const groups = new Set<string>();

      stats.forEach((row) => {
        // date filter
        if (row.data_date < startDate || row.data_date > endDate) return;

        const post = postMap.get(row.video_id);
        if (!post) return;

        const groupKey =
          groupMode === "video_type" ? post.video_type : post.account_name;
        console.log('group key is', groupKey);
        const views = Number(row.views) || 0;

        groups.add(groupKey);

        if (!grouped[row.data_date]) grouped[row.data_date] = {};
        grouped[row.data_date][groupKey] =
          (grouped[row.data_date][groupKey] || 0) + views;
      });

      const sortedDates = Object.keys(grouped).sort();
      const groupArray = Array.from(groups);

      const series: SeriesOptionsType[] = groupArray.map((group) => ({
        type: "column",
        name: group,
        data: sortedDates.map((date) => grouped[date][group] || 0),
        visible:
        groupMode === "account_name"
        ? defaultChannels.includes(group)
        : true
      }));

      const chartOptions: Options = {
        chart: { type: "column" },
        title: {
          text:
            groupMode === "video_type"
              ? "Views by Video Type"
              : "Views by Channel",
        },
        xAxis: { categories: sortedDates },
        yAxis: { min: 0, title: { text: "Views" } },
        plotOptions: { column: { stacking: "normal" } },
        tooltip: { shared: false },
        series,
      };

      setOptions(chartOptions);
    };

    loadData().catch(console.error);
  }, [groupMode, startDate, endDate]); 

  if (!options) return <p>Loading chart...</p>;

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setGroupMode("video_type")}>Views by Video Type</button>
        <button onClick={() => setGroupMode("account_name")} style={{ marginLeft: 8 }}>
         Views by Channel
        </button>

        <div style={{ marginTop: 12 }}>
          <label>
            Start:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ marginLeft: 6 }}
            />
          </label>

          <label style={{ marginLeft: 12 }}>
            End:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ marginLeft: 6 }}
            />
          </label>
        </div>
      </div>

      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default StackedViewsChart;
