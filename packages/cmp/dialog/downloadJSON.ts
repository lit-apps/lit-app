export default function downloadJSON(data: any[], filename: string) {
  const jsonData = JSON.stringify(data, null, 2); 
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}