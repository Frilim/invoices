import Papa from 'papaparse';

export function handleCSVFile(file, onDataImported) {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      if (typeof onDataImported === 'function') {
        onDataImported(results.data);
      }
    }
  });
}