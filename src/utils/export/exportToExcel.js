import * as XLSX from "xlsx";

export const exportToExcel = (
  data,
  filename = "export",
  sheetName = "Sheet1",
) => {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("No data available to export.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
