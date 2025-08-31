// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [codes, setCodes] = useState([]);
  const [codeType, setCodeType] = useState('single');

  useEffect(() => {
    const saved = localStorage.getItem('tableau-recap-codes');
    if (saved) {
      setCodes(JSON.parse(saved));
    }
  }, []);

  // Générer un code sécurisé TAB1752-ABC123
  const generateSecureCode = () => {
    const now = new Date();
    const hours = now.getUTCHours().toString().padStart(2, '0');
    const minutes = now.getUTCMinutes().toString().padStart(2, '0');
    const timeCode = hours + minutes;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const all = chars + nums;
    let suffix = '';
    for (let i = 0; i < 6; i++) {
      suffix += all[Math.floor(Math.random() * all.length)];
    }
    return `TAB${timeCode}-${suffix}`;
  };

  // Générer 1 ou 6 codes
  const handleGenerate = () => {
    const newCodes = [];
    const count = codeType === 'single' ? 1 : 6;

    for (let i = 0; i < count; i++) {
      const code = generateSecureCode();
      newCodes.push({
        id: Date.now() + i,
        code: code,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 jours
        used: false,
        usedAt: null,
        school: null,
      });
    }

    setCodes((prev) => [...prev, ...newCodes]);
    const allCodes = JSON.parse(localStorage.getItem('tableau-recap-codes') || '[]');
    localStorage.setItem('tableau-recap-codes', JSON.stringify([...allCodes, ...newCodes]));
  };

  // Invalider un code
  const handleInvalidate = (id) => {
    if (window.confirm('Marquer ce code comme utilisé ?')) {
      setCodes((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, used: true, usedAt: new Date().toISOString() } : c
        )
      );

      const updated = codes.map((c) =>
        c.id === id ? { ...c, used: true, usedAt: new Date().toISOString() } : c
      );
      localStorage.setItem('tableau-recap-codes', JSON.stringify(updated));
    }
  };

  // Extraire l'heure du code
  const extractTimeFromCode = (code) => {
    const match = code.match(/TAB(\d{4})-/);
    if (match) {
      const time = match[1];
      return `${time.slice(0,2)}:${time.slice(2,4)} UTC`;
    }
    return 'Inconnue';
  };

  // Vérifier expiration
  const isExpired = (expiresAt) => new Date() > new Date(expiresAt);

  // Générer le code actuel du concepteur
  const getCurrentDesignerCode = () => {
    const now = new Date();
    const start = new Date('2025-01-01');
    const diffTime = now - start;
    const twoWeeks = 15 * 24 * 60 * 60 * 1000;
    const period = Math.floor(diffTime / twoWeeks);
    const hours = now.getUTCHours().toString().padStart(2, '0');
    const minutes = now.getUTCMinutes().toString().padStart(2, '0');
    const timeCode = hours + minutes;
    return `DEV${period}-TAB${timeCode}`;
  };

  // Simuler l'envoi du code par email
  const sendCodeByEmail = () => {
    const code = getCurrentDesignerCode();
    const mailto = `mailto:chatherga@gmail.com?subject=Code Concepteur Tableau Recap&body=Bonjour,%0A%0ALe code d'accès du concepteur pour cette période est :%0A%0A${code}%0A%0ACe code est valable 15 jours.%0A%0ACordialement`;
    window.open(mailto);
  };

  const handleLogout = () => {
    if (window.confirm('Se déconnecter du mode concepteur ?')) {
      window.location.href = '/';
    }
  };

  return (
    <div style={styles.container}>
      <h1>🛠️ Tableau de Bord du Concepteur</h1>
      <button onClick={handleLogout} style={styles.logoutButton}>
        Se déconnecter
      </button>

      {/* Code du concepteur */}
      <div style={styles.section}>
        <h2>🔑 Code d'accès du concepteur</h2>
        <p>
          <strong>Code actuel :</strong> <code style={{ fontSize: '1.2em' }}>{getCurrentDesignerCode()}</code>
        </p>
        <button onClick={sendCodeByEmail} style={styles.emailButton}>
          📧 Envoyer par email
        </button>
        <p style={{ fontSize: '0.9em', color: '#666' }}>
          Ce code est renouvelé tous les 15 jours. Il a été envoyé à <strong>chatherga@gmail.com</strong>.
        </p>
      </div>

      {/* Génération de codes enseignants */}
      <div style={styles.section}>
        <h2>🔐 Générer des codes d'accès (15 jours)</h2>
        <p>Format : <code>TAB1752-ABC123</code></p>

        <div style={styles.radioGroup}>
          <label>
            <input
              type="radio"
              checked={codeType === 'single'}
              onChange={() => setCodeType('single')}
            /> 1 code = 1 classe
          </label>
          <label style={{ marginLeft: '20px' }}>
            <input
              type="radio"
              checked={codeType === 'group'}
              onChange={() => setCodeType('group')}
            /> Groupe de 6 codes
          </label>
        </div>
        <button onClick={handleGenerate} style={styles.generateButton}>
          Générer
        </button>
      </div>

      {/* Liste des codes */}
      <div style={styles.section}>
        <h2>📋 Codes générés ({codes.length})</h2>
        {codes.length === 0 ? (
          <p>Aucun code généré.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Code</th>
                <th>Heure (UTC)</th>
                <th>Créé le</th>
                <th>Expire le</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {codes
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((c) => {
                  const expired = isExpired(c.expiresAt);
                  const used = c.used;
                  return (
                    <tr key={c.id}>
                      <td><code>{c.code}</code></td>
                      <td>{extractTimeFromCode(c.code)}</td>
                      <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td>{new Date(c.expiresAt).toLocaleDateString()}</td>
                      <td>
                        {used ? (
                          <span style={{ color: '#dc3545' }}>❌ Utilisé</span>
                        ) : expired ? (
                          <span style={{ color: '#ffc107' }}>🕰️ Expiré</span>
                        ) : (
                          <span style={{ color: '#28a745' }}>✅ Actif</span>
                        )}
                      </td>
                      <td>
                        {!used && !expired && (
                          <button onClick={() => handleInvalidate(c.id)} style={styles.invalidateButton}>
                            Invalider
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    float: 'right',
  },
  section: {
    marginBottom: '40px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  radioGroup: {
    marginBottom: '15px',
  },
  generateButton: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  emailButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginBottom: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  th: {
    border: '1px solid #ddd',
    padding: '10px',
    backgroundColor: '#f2f2f2',
    textAlign: 'left',
    fontSize: '14px',
  },
  td: {
    border: '1px solid #ddd',
    padding: '10px',
    fontSize: '14px',
  },
  invalidateButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
  },
};