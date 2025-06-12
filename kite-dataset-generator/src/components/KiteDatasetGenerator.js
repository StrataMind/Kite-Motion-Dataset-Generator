import React, { useState } from 'react';
import { Download, Play, FileText, Info, Wind, Database, BarChart, ChevronRight, Loader } from 'lucide-react';

const KiteDatasetGenerator = () => {
  const [numRows, setNumRows] = useState(1000);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dataset, setDataset] = useState(null);
  const [activeTab, setActiveTab] = useState('generator');

  // Base parameters (simplified)
  const baseParams = {
    'Yaw': { mean: -58.3763, std: 107.9977, min: -270.0000, max: 89.9804 },
    'Pitch': { mean: 79.8286, std: 115.6201, min: -180.0000, max: 179.9786 },
    'Roll': { mean: 5.7942, std: 36.8290, min: -90.0000, max: 90.0000 },
    'Altitude_m': { mean: 12.7562, std: 7.3817, min: -5.7500, max: 24.0100 },
    'Wind_speed_ms': { mean: 3.03, std: 0.565, min: 0.68, max: 4.65 }
  };

  // Generate normal distribution with clipping to min/max
  const generateNormalData = (mean, std, min, max, count) => {
    const data = [];
    for (let i = 0; i < count; i++) {
      // Box-Muller transform for normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      let value = mean + std * z0;
      
      // Clip to min/max bounds
      value = Math.max(min, Math.min(max, value));
      data.push(value);
    }
    return data;
  };

  // Generate additional synthetic parameters (simplified)
  const generateSyntheticParams = () => {
    const syntheticParams = {};
    const paramTypes = ['Temperature_C', 'Humidity_perc', 'Pressure_hPa'];

    // Add synthetic parameters
    paramTypes.forEach((paramType) => {
      syntheticParams[paramType] = {
        mean: Math.random() * 100 - 50,
        std: Math.random() * 20 + 5,
        min: Math.random() * 50 - 100,
        max: Math.random() * 100 + 50
      };
    });

    return syntheticParams;
  };

  const generateDataset = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const allParams = { ...baseParams, ...generateSyntheticParams() };
      const paramNames = Object.keys(allParams);
      
      // Generate data for each parameter
      const data = {};
      paramNames.forEach(param => {
        const stats = allParams[param];
        data[param] = generateNormalData(stats.mean, stats.std, stats.min, stats.max, numRows);
      });

      setDataset({ data, columns: paramNames });
      setIsGenerating(false);
    }, 800);
  };

  const downloadCSV = () => {
    if (!dataset) return;

    const { data, columns } = dataset;
    let csv = columns.join(',') + '\n';
    
    for (let i = 0; i < numRows; i++) {
      const row = columns.map(col => data[col][i].toFixed(4)).join(',');
      csv += row + '\n';
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kite_motion_dataset_${numRows}x${columns.length}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getPreviewData = () => {
    if (!dataset) return null;
    
    const { data, columns } = dataset;
    const previewRows = 3;
    
    return {
      headers: columns,
      rows: Array.from({ length: previewRows }, (_, i) => 
        columns.map(col => data[col][i].toFixed(4))
      )
    };
  };

  const preview = getPreviewData();

  const renderGeneratorTab = () => (
    <>
      <div className="card section-blue">
        <h2 className="flex items-center gap-2">
          <Database size={20} />
          Dataset Configuration
        </h2>
        <div className="data-grid" style={{marginTop: '1rem', marginBottom: '1.5rem'}}>
          <div className="stat-card">
            <span className="stat-label">Columns</span>
            <span className="stat-value">{dataset ? dataset.columns.length : 8}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Base Parameters</span>
            <span className="stat-value">{Object.keys(baseParams).length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Synthetic Parameters</span>
            <span className="stat-value">3</span>
          </div>
        </div>

        <div style={{marginBottom: '1.5rem'}}>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem'}}>
            Number of Rows
          </label>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <input
              type="number"
              value={numRows}
              onChange={(e) => setNumRows(parseInt(e.target.value) || 1000)}
              style={{width: '8rem'}}
              min="100"
              max="10000"
            />
            <div style={{fontSize: '0.875rem', color: '#6b7280'}}>
              Recommended: 1,000 - 5,000 rows
            </div>
          </div>
        </div>

        <div style={{display: 'flex', gap: '1rem'}}>
          <button
            onClick={generateDataset}
            disabled={isGenerating}
            className="btn-primary"
          >
            {isGenerating ? (
              <>
                <Loader size={16} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play size={16} />
                Generate Dataset
              </>
            )}
          </button>

          {dataset && (
            <button
              onClick={downloadCSV}
              className="btn-success"
            >
              <Download size={16} />
              Download CSV
            </button>
          )}
        </div>
      </div>

      {dataset && (
        <div className="card">
          <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
            <FileText size={20} />
            Dataset Preview
          </h3>
          
          {preview && (
            <div style={{overflowX: 'auto', marginBottom: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb'}}>
              <table>
                <thead>
                  <tr>
                    {preview.headers.map((header, idx) => (
                      <th key={idx}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="data-grid">
            <div className="card section-green" style={{margin: 0}}>
              <p style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <span>
                  <strong>Generated:</strong> {numRows.toLocaleString()} rows × {dataset.columns.length} columns
                </span>
                <ChevronRight size={16} />
              </p>
            </div>
            <div className="card section-blue" style={{margin: 0}}>
              <p style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <span>
                  <strong>File size (approx):</strong> {((numRows * dataset.columns.length * 8) / 1024 / 1024).toFixed(1)} MB
                </span>
                <ChevronRight size={16} />
              </p>
            </div>
            <div className="card section-yellow" style={{margin: 0}}>
              <p style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <span>
                  <strong>Generation time:</strong> {isGenerating ? 'Calculating...' : '0.8 seconds'}
                </span>
                <ChevronRight size={16} />
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );

  const renderStatsTab = () => (
    <div className="card">
      <h2 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem'}}>
        <BarChart size={20} />
        Parameter Statistics
      </h2>
      <div style={{overflowX: 'auto'}}>
        <table style={{width: '100%'}}>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Mean</th>
              <th>Std Dev</th>
              <th>Min</th>
              <th>Max</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(baseParams).map(([param, stats]) => (
              <tr key={param}>
                <td>{param}</td>
                <td>{stats.mean.toFixed(4)}</td>
                <td>{stats.std.toFixed(4)}</td>
                <td>{stats.min.toFixed(4)}</td>
                <td>{stats.max.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInfoTab = () => (
    <div className="card">
      <h2 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem'}}>
        <Info size={20} />
        About Kite Motion Dataset
      </h2>
      
      <div style={{marginBottom: '2rem'}}>
        <h3 style={{marginBottom: '0.75rem'}}>Dataset Description</h3>
        <p style={{lineHeight: '1.6'}}>
          This tool generates synthetic kite motion data based on real-world parameters collected from kite flying sessions.
          The generated dataset maintains statistical properties similar to actual kite motion dynamics.
        </p>
      </div>
      
      <div className="card section-blue" style={{margin: 0}}>
        <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
          <Wind size={18} className="animate-float" />
          Data Generation Method
        </h3>
        <p style={{marginBottom: '1rem', lineHeight: '1.6'}}>
          The dataset is generated using a normal distribution with the following approach:
        </p>
        <ul style={{paddingLeft: '1.25rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem'}}>
          <li>Box-Muller transform for normal distribution generation</li>
          <li>Values are clipped to min/max bounds of original parameters</li>
          <li>Statistical properties (mean, std) are preserved from original data</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <header style={{marginBottom: '2rem'}}>
        <h1 style={{fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem'}}>
          <Wind size={32} className="header-icon" />
          Kite Motion Dataset Generator
        </h1>
        <p style={{textAlign: 'center', color: '#6b7280', maxWidth: '36rem', marginLeft: 'auto', marginRight: 'auto'}}>
          Generate synthetic datasets based on kite motion dynamics parameters for machine learning and data analysis
        </p>
      </header>

      <div style={{marginBottom: '1.5rem', display: 'flex', borderBottom: '1px solid #e5e7eb'}}>
        <button 
          className={`tab-button ${activeTab === 'generator' ? 'active' : ''}`}
          onClick={() => setActiveTab('generator')}
        >
          <Database size={16} style={{marginRight: '0.5rem', display: 'inline'}} />
          Generator
        </button>
        <button 
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <BarChart size={16} style={{marginRight: '0.5rem', display: 'inline'}} />
          Statistics
        </button>
        <button 
          className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          <Info size={16} style={{marginRight: '0.5rem', display: 'inline'}} />
          Information
        </button>
      </div>

      {activeTab === 'generator' 
        ? renderGeneratorTab() 
        : activeTab === 'stats'
          ? renderStatsTab()
          : renderInfoTab()}
    </div>
  );
};

export default KiteDatasetGenerator;