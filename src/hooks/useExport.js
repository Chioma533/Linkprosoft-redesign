import { exportToExcel, exportToPDF } from "../utils/export";

export const useExport = () => {
  const exportData = ({
    type,
    data,
    formatter,
    filename = "export",
    sheetName = "Sheet 1",
    pdfTitle = "Export Report",
  }) => {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn("No data available to export.");
      return;
    }

    const formattedData = formatter ? formatter(data) : data;

    switch (type) {
      case "excel":
        exportToExcel(formattedData, filename, sheetName);
        break;

      case "pdf":
        exportToPDF(
          pdfTitle,
          Object.keys(formattedData[0]),
          formattedData.map(Object.values),
          filename,
        );
        break;

      default:
        console.warn(`Unsupported export type: ${type}`);
    }
  };

  return { exportData };
};
