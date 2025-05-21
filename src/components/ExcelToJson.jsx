import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelToJson = () => {
  const [jsonResult, setJsonResult] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Convertir a objetos
      const datos = rows.slice(1).map((row) => ({
        cp: row[0],
        colonia: row[1],
        municipio: row[2],
        estado: row[3],
      }));

      // Agrupación
      const agrupado = {};

      datos.forEach(({ cp, colonia, municipio, estado }) => {
        if (!agrupado[cp]) {
          agrupado[cp] = {
            cp,
            municipio,
            estado,
            colonias: new Set(),
          };
        }
        agrupado[cp].colonias.add(colonia);
      });

      const codigos = Object.values(agrupado).map((entry) => ({
        cp: entry.cp,
        municipio: entry.municipio,
        estado: entry.estado,
        colonias: Array.from(entry.colonias),
      }));

      setJsonResult(codigos);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(jsonResult, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'codigos_postales.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial' }}>
      <h2>Conversor de Excel a JSON</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      {jsonResult && (
        <>
          <button onClick={handleDownload} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Descargar JSON
          </button>

          <pre style={{ marginTop: '1rem', background: '#f4f4f4', padding: '1rem' }}>
            {JSON.stringify(jsonResult, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
};

export default ExcelToJson;
