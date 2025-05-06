import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Kullanıcı oturumu kontrolü
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(storedUser));

    // Raporları getir
    fetchReports(token);
  }, []);

  const fetchReports = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/reports', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        console.error('Raporlar getirilemedi');
      }
    } catch (err) {
      console.error('Sunucu bağlantısında hata', err);
    }
  };

  const runReport = async (reportId) => {
    const token = localStorage.getItem('token');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/reports/${reportId}/run`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Rapor çalıştırılamadı');
      }
    } catch (err) {
      setError('Sunucu bağlantısında hata');
      console.error('Rapor çalıştırma hatası', err);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (!reportData) return;

    // CSV olarak dışa aktar
    const csvContent = generateCSV(reportData.data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedReport.title}_raporu.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSV = (data) => {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        `"${value}"` // Her değeri tırnak içine al
      ).join(',')
    );

    return [headers, ...rows].join('\n');
  };

  const handleReportSelect = (report) => {
    setSelectedReport(report);
    runReport(report.id);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Yan Menü */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Rapor Sistemi</h2>
          <p className="text-gray-600">Hoş geldin, {user.username}</p>
        </div>
        
        <nav className="p-4">
          <h3 className="text-lg font-semibold mb-4">Raporlar</h3>
          {reports.map(report => (
            <button
              key={report.id}
              onClick={() => handleReportSelect(report)}
              className={`w-full text-left px-4 py-2 rounded mb-2 ${
                selectedReport?.id === report.id 
                  ? 'bg-blue-500 text-white' 
                  : 'hover:bg-gray-200'
              }`}
            >
              {report.title}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* İçerik Alanı */}
      <div className="flex-grow p-8">
        {selectedReport ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedReport.title}</h2>
                <p className="text-gray-600">{selectedReport.description}</p>
              </div>
              {reportData && (
                <button 
                  onClick={exportToExcel}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Excel'e Aktar
                </button>
              )}
            </div>
            
            {loading ? (
              <div className="text-center text-gray-500">Rapor yükleniyor...</div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            ) : reportData ? (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        {Object.keys(reportData.data[0] || {}).map(key => (
                          <th key={key} className="border p-2 text-left">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.data.map((row, index) => (
                        <tr key={index} className="border-b">
                          {Object.values(row).map((value, colIndex) => (
                            <td key={colIndex} className="border p-2">{value}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-gray-600 flex justify-between">
                  <span>Toplam Satır: {reportData.rowCount}</span>
                  <span>Sorgu Zamanı: {new Date(reportData.queryTime).toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">Bir rapor seçin</div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-xl text-gray-600">Bir rapor seçerek başlayın</h3>
          </div>
        )}
      </div>
    </div>
  );
}
