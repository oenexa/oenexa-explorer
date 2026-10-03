import React, { useEffect, useState, useRef } from 'react';
import './LiveTerminal.css';

export const LiveTerminal: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const commands = [
      "Connecting to Oenexa Core (localhost:8545)...",
      "Handshake OK: Peer [OEN-992-X] verified.",
      "Initializing ML-DSA-65 Verification Engine...",
      "Quantum-Resistant state initialized.",
      "Mempool synchronization started.",
      "Syncing blocks... 0/100%",
    ];
    setLogs(commands);
  }, []);

  useEffect(() => {
    const logPool = [
      () => `[${new Date().toISOString()}] DEBUG: Received transaction from peer...`,
      () => `[${new Date().toISOString()}] INFO: Validating ML-DSA-65 signature on tx_hash=${Math.random().toString(36).substring(2, 10)}... OK`,
      () => `[${new Date().toISOString()}] INFO: Appending to priority queue. Gas=21000`,
      () => `[${new Date().toISOString()}] DEBUG: Evaluated contract state root: 0x${Math.random().toString(16).substring(2, 64)}`,
      () => `[${new Date().toISOString()}] WARN: EIP-1559 BaseFee updated to ${Math.floor(Math.random() * 20)} nanoOEN`,
      () => `[${new Date().toISOString()}] INFO: Proposing block... Quorum reached.`,
      () => `[${new Date().toISOString()}] SUCCESS: Block committed to Ledger.`,
      () => `[${new Date().toISOString()}] SYNC: P2P Broadcast successful.`,
    ];

    const interval = setInterval(() => {
      const newLog = logPool[Math.floor(Math.random() * logPool.length)]();
      setLogs((prev) => {
        const next = [...prev, newLog];
        if (next.length > 50) return next.slice(next.length - 50);
        return next;
      });
    }, 800); // Add a new log every 800ms

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const renderColoredLog = (log: string) => {
    let colorClass = 'log-default';
    if (log.includes('DEBUG:')) colorClass = 'log-debug';
    if (log.includes('INFO:')) colorClass = 'log-info';
    if (log.includes('WARN:')) colorClass = 'log-warn';
    if (log.includes('SUCCESS:') || log.includes('SYNC:')) colorClass = 'log-success';
    if (log.includes('ERROR:')) colorClass = 'log-error';

    return <span className={colorClass}>{log}</span>;
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <span className="terminal-title">OENEXA VM - CORE LOGS</span>
        <div className="terminal-dots">
          <div className="dot red"></div>
          <div className="dot yellow"></div>
          <div className="dot green"></div>
        </div>
      </div>
      <div className="terminal-body">
        {logs.map((log, i) => (
          <div key={i} className="terminal-line">
            <span className="terminal-prompt">&gt;</span> {renderColoredLog(log)}
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
};
