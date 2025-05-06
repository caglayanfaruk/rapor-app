import React from 'react';
import dynamic from 'next/dynamic';

// ApexCharts dinamik olarak yüklensin
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ReportChart = ({ data, type = 'bar', title = 'Rapor Grafiği' }) => {
  // Grafik için verileri hazırla
  const prepareChartData = () => {
    if (!data || data.length === 0) return { categories: [], series: [] };

    const columns = Object.keys(data[0]);
    const numericColumns = columns.filter(col => 
      typeof data[0][col] === 'number'
    );

    const categories = data.map(row => row[columns[0]]);
    
    const series = numericColumns.map(col => ({
      name: col,
      data: data.map(row => row[col])
    }));

    return { categories, series };
  };

  const { categories, series } = prepareChartData();

  const chartOptions = {
    chart: {
      type: type,
      height: 350
    },
    title: {
      text: title,
      align: 'left'
    },
    xaxis: {
      categories: categories
    },
    plotOptions: {
      bar: {
        horizontal: type === 'bar' ? false : true
      }
    }
  };

  // Veri yoksa null döndür
  if (series.length === 0) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Chart 
        options={chartOptions} 
        series={series} 
        type={type} 
        height={350} 
      />
    </div>
  );
};

export default ReportChart;
