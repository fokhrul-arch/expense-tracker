import React from 'react';
import { downloadCsv } from '../api';

export default function ExportButton() {
  return (
    <button className="btn-outline" onClick={downloadCsv}>
      Export CSV
    </button>
  );
}
