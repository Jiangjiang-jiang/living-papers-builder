import React, { useRef, useState } from 'react';
import JSZip from 'jszip';
import './App.css';

export default function App() {
    const mainFileInputRef = useRef(null);
    const supportFileInputRef = useRef(null);

    const [mainFile, setMainFile] = useState(null);
    const [supportFiles, setSupportFiles] = useState([]);
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');
    const [buildResult, setBuildResult] = useState(null);

    const processMainFile = (file) => {
        if (!file) return;

        if (!file.name.endsWith('.md')) {
            setMessage('Main file must be .md format');
            return;
        }

        setMainFile(file);
        setMessage('Files added successfully');
    };

    const handleMainFileDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        processMainFile(file);
    };

    const handleMainFileSelect = () => {
        mainFileInputRef.current?.click();
    };

    const onMainFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            processMainFile(file);
        }
        e.target.value = '';
    };

    const processSupportFiles = async (files) => {
        try {
            let newSupportFiles = [...supportFiles];

            for (const file of files) {
                if (file.name.endsWith('.zip')) {
                    const zip = new JSZip();
                    const contents = await zip.loadAsync(file);

                    await Promise.all(
                        Object.keys(contents.files).map(async (filename) => {
                            if (!contents.files[filename].dir) {
                                const ext = filename.toLowerCase().split('.').pop();
                                if (['png', 'jpg', 'jpeg', 'pdf', 'svg'].includes(ext)) {
                                    const blob = await contents.files[filename].async('blob');
                                    const extractedFile = new File([blob], filename, { type: `image/${ext}` });
                                    newSupportFiles.push(extractedFile);
                                }
                            }
                        })
                    );
                } else if (['png', 'jpg', 'jpeg', 'pdf', 'svg'].includes(file.name.toLowerCase().split('.').pop())) {
                    newSupportFiles.push(file);
                }
            }

            setSupportFiles(newSupportFiles);
            setMessage('Files added successfully');
        } catch (error) {
            setMessage('Error processing files: ' + error.message);
        }
    };

    const handleSupportFilesDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        processSupportFiles(files);
    };

    const handleSupportFilesSelect = () => {
        supportFileInputRef.current?.click();
    };

    const onSupportFilesChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            processSupportFiles(files);
        }
        e.target.value = '';
    };

    const handleBuild = async () => {
        if (!mainFile) {
            setMessage('Please upload main .md file first');
            return;
        }

        setStatus('building');
        setMessage('Building...');
        setBuildResult(null);

        const formData = new FormData();
        formData.append('mainFile', mainFile);
        supportFiles.forEach(file => formData.append('supportFiles', file));

        try {
            const response = await fetch('http://localhost:3000/api/build', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Build failed');

            setStatus('success');
            setMessage('Build successful!');
            setBuildResult(data);
        } catch (error) {
            setStatus('error');
            setMessage(`Build failed: ${error.message}`);
        }
    };

    const handleReset = () => {
        setMainFile(null);
        setSupportFiles([]);
        setStatus('idle');
        setMessage('');
        setBuildResult(null);
    };

    return (
        <div className="app-wrapper">
            <div className="app-container">
                <div className="app-card">
                    <h1 className="app-title">Living Papers Builder</h1>

                    {/* Hidden file inputs */}
                    <input
                        ref={mainFileInputRef}
                        type="file"
                        accept=".md"
                        onChange={onMainFileChange}
                        style={{ display: 'none' }}
                    />
                    <input
                        ref={supportFileInputRef}
                        type="file"
                        accept=".png,.jpg,.jpeg,.pdf,.svg,.zip"
                        onChange={onSupportFilesChange}
                        multiple
                        style={{ display: 'none' }}
                    />

                    <div className="upload-zone main"
                         onDragOver={(e) => e.preventDefault()}
                         onDrop={handleMainFileDrop}>
                        <h3>Main File (.md)</h3>
                        {mainFile ? (
                            <div className="file-item">
                                <span>{mainFile.name}</span>
                                <button className="remove-button" onClick={() => setMainFile(null)}>
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <div className="upload-content">
                                <p>Drag and drop Markdown file here</p>
                                <button
                                    className="select-button"
                                    onClick={handleMainFileSelect}
                                    type="button">
                                    Select File
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="upload-zone support"
                         onDragOver={(e) => e.preventDefault()}
                         onDrop={handleSupportFilesDrop}>
                        <h3>Support Files (.png, .jpg, .pdf, .svg, .zip)</h3>
                        <div className="upload-content">
                            <p>Drag and drop files here</p>
                            <button
                                className="select-button"
                                onClick={handleSupportFilesSelect}
                                type="button">
                                Select Files
                            </button>
                        </div>

                        {supportFiles.length > 0 && (
                            <div className="file-list">
                                {supportFiles.map((file, index) => (
                                    <div key={index} className="file-item">
                                        <span>{file.name}</span>
                                        <button
                                            className="remove-button"
                                            onClick={() => setSupportFiles(files => files.filter((_, i) => i !== index))}>
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="button-group">
                        <button
                            className={`build-button ${status === 'building' ? 'disabled' : ''}`}
                            onClick={handleBuild}
                            disabled={status === 'building' || !mainFile}>
                            Build
                        </button>

                        <button
                            className="reset-button"
                            onClick={handleReset}
                            disabled={status === 'building'}>
                            Reset
                        </button>
                    </div>

                    {message && (
                        <div className={`message ${status}`}>
                            {message}
                        </div>
                    )}

                    {buildResult && buildResult.downloadUrl && (
                        <div className="download-section">
                            <p>Build completed successfully!</p>
                            <a
                                href={`http://localhost:3000${buildResult.downloadUrl}`}
                                className="download-button"
                                download>
                                Download Build Files
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}