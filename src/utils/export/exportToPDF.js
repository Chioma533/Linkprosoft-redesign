// utils/export/exportToPDF.js

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToPDF = (title, columns, rows, filename = "report") => {
  const doc = new jsPDF();

  doc.text(title, 14, 20);

  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 30,
  });

  doc.save(`${filename}.pdf`);
};
