import React, { useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import RequestVolume from "./RequestVolume";
import SuccessRateTrends from "./SuccessRateTrends";
import LatencyDistribution from "./LatencyDistribution";
import PerformanceAnalytics from "./PerformanceAnalytics";
import ProcessingDistributionChart from "./ProcessingDistributionChart";

const HandleExport = ({ exportRef, metrics }) => {
  const printRef = useRef();

  useEffect(() => {
    if (exportRef) {
      exportRef.current = handleDownload;
    }
  }, [exportRef]);

  const handleDownload = async () => {
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        scrollY: -window.scrollY,
        backgroundColor: "#fff",
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const dateStr = new Date().toLocaleDateString();
      pdf.setFontSize(10);
      pdf.setTextColor(150);
      pdf.text(
        `Generated on ${dateStr}`,
        pdf.internal.pageSize.getWidth() / 2,
        pdf.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );

      pdf.save(`face-dashboard-report-${new Date().toISOString().slice(0, 10)}.pdf`);

      // ✅ Show toast after successful download
      toast.success("successfully downloaded!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          backgroundColor: "#d4edda",
          color: "#155724",
          fontWeight: "bold",
        },
      });

    } catch (err) {
      console.error("PDF export error:", err);
      toast.error("❌ Failed to download PDF.", {
        position: "top-right",
      });
    }
  };

  return (
    <>
      {/* Toast container */}
      <ToastContainer />

      {/* Hidden Export Area */}
      <div
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          width: "794px",
          padding: "40px",
          backgroundColor: "#ffffff",
          boxSizing: "border-box",
        }}
        ref={printRef}
      >
        {/* ... your export content ... */}
        <div
          style={{
            border: "1px solid #e0e0e0",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "30px",
              borderBottom: "1px solid #eee",
              paddingBottom: "20px",
            }}
          >
            <h1
              style={{
                color: "#2c3e50",
                margin: 0,
                fontSize: "28px",
                fontWeight: "600",
              }}
            >
              Face Recognition Dashboard Report
            </h1>
            <p
              style={{
                color: "#7f8c8d",
                margin: "5px 0 0",
                fontSize: "14px",
              }}
            >
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div style={{ marginBottom: "30px" }}>
            <h2 style={sectionTitleStyle}>Request Volume Metrics</h2>
            <RequestVolume metrics={metrics} />
          </div>

          <div style={{ marginBottom: "30px" }}>
            <h2 style={sectionTitleStyle}>Processing Distribution Chart</h2>
            <ProcessingDistributionChart metrics={metrics} />
          </div>

          <div style={{ marginBottom: "30px" }}>
            <h2 style={sectionTitleStyle}>Success Rate Trends</h2>
            <SuccessRateTrends metrics={metrics?.success_trends || []} />
          </div>

          <div style={{ marginBottom: "30px" }}>
            <h2 style={sectionTitleStyle}>Latency Distribution</h2>
            <LatencyDistribution metrics={metrics?.latency_distribution || []} />
          </div>

          

          <div
            style={{
              marginTop: "30px",
              paddingTop: "20px",
              borderTop: "1px solid #eee",
              textAlign: "center",
              color: "#95a5a6",
              fontSize: "12px",
            }}
          >
            <p>Generated by Face Recognition Dashboard</p>
          </div>
        </div>
      </div>
    </>
  );
};

const sectionTitleStyle = {
  color: "#34495e",
  fontSize: "20px",
  borderBottom: "1px solid #eee",
  paddingBottom: "8px",
  marginBottom: "15px",
};

export default HandleExport;
