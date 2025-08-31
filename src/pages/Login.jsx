// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  // Fonction pour générer le code actuel du concepteur
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

  const handleLogin = () => {
    const trimmedCode = code.trim();

    // Vérifie si c'est le code du concepteur (renouvelé tous les 15 jours)
    const currentDesignerCode = getCurrentDesignerCode();
    if (trimmedCode === currentDesignerCode) {
      navigate('/admin');
      return;
    }

    // Vérifie si c'est un code d'enseignant valide
    if (!trimmedCode.startsWith('TAB')) {
      alert('Code d’accès invalide. Contactez le concepteur.');
      return;
    }

    const allCodes = JSON.parse(localStorage.getItem('tableau-recap-codes') || '[]');
    const foundCode = allCodes.find(c => c.code === trimmedCode);

    if (!foundCode) {
      alert('Ce code n’existe pas.');
      return;
    }

    if (foundCode.used) {
      alert('Ce code a déjà été utilisé.');
      return;
    }

    const isExpired = new Date() > new Date(foundCode.expiresAt);
    if (isExpired) {
      alert('Ce code a expiré.');
      return;
    }

    // Code valide → sauvegarde temporaire et redirection
    localStorage.setItem('active-code', trimmedCode);
    navigate('/dashboard');
  };

  return (
    <div style={styles.container}>
      <h1>🔐 Tableau Récapitulatif</h1>
      <h2>Accès à l'application</h2>
      <p>Entrez votre code d'accès ci-dessous.</p>

      <input
        type="text"
        placeholder="Entrez votre code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleLogin} style={styles.button}>
        Se connecter
      </button>

      <p style={{ fontSize: '0.9em', color: '#666', marginTop: '20px' }}>
        <strong>💡 Astuce :</strong> Le code du concepteur change tous les 15 jours.<br />
        Exemple actuel : <code>{getCurrentDesignerCode()}</code>
      </p>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px 20px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '500px',
    margin: '0 auto',
  },
  input: {
    padding: '10px',
    width: '100%',
    maxWidth: '300px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};