// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [school, setSchool] = useState({
    country: 'Côte d\'Ivoire',
    city: 'Abidjan',
    directionGeneral: '',
    iepp: '',
    epp: '',
    schoolYear: '',
    schoolName: '',
    class: 'CP2',
    teacherName: '',
    directorName: '',
  });

  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    number: 1,
    lastname: '',
    firstname: '',
    gender: 'garcon',
    birthdate: '',
    classScolarity: 1,
    overallScolarity: 1,
  });

  const [isEditing, setIsEditing] = useState(true);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  // Récupérer le code actif
  const activeCode = localStorage.getItem('active-code');

  // Charger les données sauvegardées au démarrage
  useEffect(() => {
    if (!activeCode) {
      window.location.href = '/';
      return;
    }

    const saved = localStorage.getItem(`tableau-${activeCode}`);
    if (saved) {
      const data = JSON.parse(saved);
      setSchool(data.school || school);
      setStudents(data.students || []);
      setNewStudent({
        ...newStudent,
        number: (data.students?.length || 0) + 1,
      });

      if (data.hasDownloaded) {
        setIsEditing(false);
        setHasDownloaded(true);
      }
    }
  }, [activeCode]);

  // Sauvegarder automatiquement dans localStorage
  const saveToLocalStorage = () => {
    const data = {
      school,
      students,
      hasDownloaded: false,
    };
    localStorage.setItem(`tableau-${activeCode}`, JSON.stringify(data));
  };

  // Mettre à jour l'école
  const handleSchoolChange = (e) => {
    const { name, value } = e.target;
    setSchool({ ...school, [name]: value });
    saveToLocalStorage();
  };

  // Ajouter un élève
  const addStudent = () => {
    if (!newStudent.lastname || !newStudent.firstname) {
      alert('Veuillez remplir le nom et prénoms');
      return;
    }
    const updatedStudents = [...students, { ...newStudent }];
    setStudents(updatedStudents);
    setNewStudent({
      number: newStudent.number + 1,
      lastname: '',
      firstname: '',
      gender: 'garcon',
      birthdate: '',
      classScolarity: 1,
      overallScolarity: 1,
    });
    saveToLocalStorage();
  };

  // Supprimer un élève
  const deleteStudent = (index) => {
    if (!isEditing) return;
    if (window.confirm('Supprimer cet élève ?')) {
      const updated = students.filter((_, i) => i !== index);
      setStudents(updated);
      saveToLocalStorage();
    }
  };

  // Passer à l’élève suivant
  const nextStudent = () => {
    if (newStudent.lastname || newStudent.firstname) {
      addStudent();
    }
  };

  // Sauvegarder et fermer (pause)
  const pauseEditing = () => {
    saveToLocalStorage();
    alert('Sauvegardé localement. Vous pouvez revenir plus tard.');
  };

  // Sauvegarder et quitter (fin édition)
  const saveAndQuit = () => {
    if (window.confirm('Terminer l\'édition ? Vous ne pourrez plus modifier après.')) {
      saveToLocalStorage();
      setIsEditing(false);
      setHasDownloaded(true);
      // Marquer le code comme utilisé
      const allCodes = JSON.parse(localStorage.getItem('tableau-recap-codes') || '[]');
      const updatedCodes = allCodes.map(c =>
        c.code === activeCode ? { ...c, used: true, usedAt: new Date().toISOString() } : c
      );
      localStorage.setItem('tableau-recap-codes', JSON.stringify(updatedCodes));
    }
  };

  // Générer le PDF
  const generatePDF = () => {
  if (!isEditing) {
    alert('Le document a déjà été téléchargé. Édition terminée.');
    return;
  }

  // Créer un conteneur temporaire pour le PDF
  const pdfContainer = document.createElement('div');
  pdfContainer.style.position = 'fixed';
  pdfContainer.style.top = '-9999px';
  pdfContainer.style.left = '-9999px';
  pdfContainer.style.width = '29.7cm'; // A3 largeur (paysage)
  pdfContainer.style.height = '21cm'; // A3 hauteur (paysage)
  pdfContainer.style.backgroundColor = 'white';
  pdfContainer.style.fontSize = '10pt';
  pdfContainer.style.fontFamily = 'Arial, sans-serif';
  pdfContainer.style.color = 'black';
  pdfContainer.style.padding = '10mm';
  pdfContainer.style.boxSizing = 'border-box';
  pdfContainer.style.zIndex = '10000';

  // Contenu HTML du PDF (comme dans l'image Recap_CP2.png)
  pdfContainer.innerHTML = `
    <div style="width: 100%; text-align: center; margin-bottom: 10px;">
      <h1 style="margin: 0; font-size: 18pt; font-weight: bold;">TABLEAU RÉCAPITULATIF</h1>
    </div>

    <!-- En-tête -->
    <table style="width: 100%; margin-bottom: 15px; font-size: 10pt;">
      <tr>
        <td><strong>IEPP:</strong> ${school.iepp}</td>
        <td><strong>EPP:</strong> ${school.epp}</td>
      </tr>
      <tr>
        <td><strong>ANNÉE SCOLAIRE:</strong> ${school.schoolYear}</td>
        <td><strong>CLASSE:</strong> ${school.class}</td>
      </tr>
    </table>

    <!-- Tableau principal -->
    <table style="width: 100%; border-collapse: collapse; font-size: 9pt;">
      <thead>
        <tr style="background-color: #D9EAD3;">
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">N°</th>
          <th style="border: 1px solid #000; padding: 4px; width: 25%;">GARÇONS NOM ET PRÉNOMS</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">5</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">6</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">7</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">8</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">9</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">10</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">11</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">SCOL. CLASSE 1</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">SCOL. CLASSE 2</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">SCOL. CLASSE 3</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">SCOLARITÉ TOTALE 2</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">SCOLARITÉ TOTALE 3</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">SCOLARITÉ TOTALE 4</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">SCOLARITÉ TOTALE 5</th>
        </tr>
      </thead>
      <tbody>
        ${students
          .filter(s => s.gender === 'garcon')
          .map(
            (s, i) => `
          <tr>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.number}</td>
            <td style="border: 1px solid #000; padding: 2px; color: black; font-weight: bold;">${s.lastname} ${s.firstname}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.birthdate ? (new Date().getFullYear() - new Date(s.birthdate).getFullYear() === 5 ? '○' : '') : ''}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.birthdate ? (new Date().getFullYear() - new Date(s.birthdate).getFullYear() === 6 ? '○' : '') : ''}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.birthdate ? (new Date().getFullYear() - new Date(s.birthdate).getFullYear() === 7 ? '○' : '') : ''}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.birthdate ? ((new Date().getFullYear() - new Date(s.birthdate).getFullYear()) === 8 ? '○' : '') : ''}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.birthdate ? ((new Date().getFullYear() - new Date(s.birthdate).getFullYear()) === 9 ? '○' : '') : ''}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.birthdate ? ((new Date().getFullYear() - new Date(s.birthdate).getFullYear()) === 10 ? '○' : '') : ''}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.birthdate ? (new Date().getFullYear() - new Date(s.birthdate).getFullYear() === 11 ? '○' : '') : ''}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.classScolarity === 1 ? '○' : ''}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.classScolarity === 2 ? '○' : ''}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.classScolarity === 3 ? '○' : ''}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.overallScolarity === 2 ? '○' : ''}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.overallScolarity === 3 ? '○' : ''}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.overallScolarity === 4 ? '○' : ''}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.overallScolarity === 5 ? '○' : ''}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>

    <!-- Tableau filles -->
    <table style="width: 100%; border-collapse: collapse; font-size: 9pt; margin-top: 10px;">
      <thead>
        <tr style="background-color: #FFF2CC;">
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">N°</th>
          <th style="border: 1px solid #000; padding: 4px; width: 25%;">FILLES NOM ET PRÉNOMS</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">5</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">6</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">7</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">8</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">9</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">10</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">11</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">SCOL. CLASSE 1</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">SCOL. CLASSE 2</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">SCOL. CLASSE 3</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">SCOLARITÉ TOTALE 2</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">SCOLARITÉ TOTALE 3</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">SCOLARITÉ TOTALE 4</th>
          <th style="border: 1px solid #000; padding: 4px; width: 5%;">SCOLARITÉ TOTALE 5</th>
        </tr>
      </thead>
      <tbody>
        ${students
          .filter(s => s.gender === 'fille')
          .map(
            (s, i) => `
          <tr>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.number}</td>
            <td style="border: 1px solid #000; padding: 2px; color: red; font-weight: bold;">${s.lastname} ${s.firstname}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.birthdate && (new Date().getFullYear() - new Date(s.birthdate).getFullYear() === 5 ? '○' : '')}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.birthdate ? ((new Date().getFullYear() - new Date(s.birthdate).getFullYear()) === 6 ? '○' : '') : ''}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.birthdate ? ((new Date().getFullYear() - new Date(s.birthdate).getFullYear()) === 7 ? '○' : '') : ''}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.birthdate ? ((new Date().getFullYear() - new Date(s.birthdate).getFullYear()) === 8 ? '○' : '') : ''}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.birthdate ? ((new Date().getFullYear() - new Date(s.birthdate).getFullYear()) === 9 ? '○' : '') : ''}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.birthdate ? ((new Date().getFullYear() - new Date(s.birthdate).getFullYear()) === 10 ? '○' : '') : ''}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.birthdate ? ((new Date().getFullYear() - new Date(s.birthdate).getFullYear()) === 11 ? '○' : '') : ''}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.classScolarity === 1 ? '○' : ''}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.classScolarity === 2 ? '○' : ''}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.classScolarity === 3 ? '○' : ''}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.overallScolarity === 2 ? '○' : ''}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.overallScolarity === 3 ? '○' : ''}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.overallScolarity === 4 ? '○' : ''}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.overallScolarity === 5 ? '○' : ''}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>

    <!-- Colonnes droites -->
    <div style="display: flex; margin-top: 10px;">
      <div style="flex: 1; margin-right: 10px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 9pt;">
          <tr style="background-color: #FFF2CC;">
            <th style="border: 1px solid #000; padding: 4px;">N°</th>
            <th style="border: 1px solid #000; padding: 4px;">NOM ET PRÉNOMS</th>
            <th style="border: 1px solid #000; padding: 4px;">DATE DE NAISSANCE</th>
          </tr>
          ${students
            .map(
              s => `
            <tr>
              <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.number}</td>
              <td style="border: 1px solid #000; padding: 2px;">${s.lastname} ${s.firstname}</td>
              <td style="border: 1px solid #000; padding: 2px; text-align: center;">${s.birthdate}</td>
            </tr>
          `
            )
            .join('')}
        </table>
      </div>
      <div style="flex: 1;">
        <table style="width: 100%; border-collapse: collapse; font-size: 9pt; margin-bottom: 10px;">
          <tr style="background-color: #FFF2CC;">
            <th style="border: 1px solid #000; padding: 4px; width: 20%;">N°</th>
            <th style="border: 1px solid #000; padding: 4px;">CHANTS</th>
          </tr>
          <tr><td style="border: 1px solid #000; padding: 2px; text-align: center;">1</td><td style="border: 1px solid #000; padding: 2px;">Il est midi.</td></tr>
          <tr><td style="border: 1px solid #000; padding: 2px; text-align: center;">2</td><td style="border: 1px solid #000; padding: 2px;">Papillon.</td></tr>
          <tr><td style="border: 1px solid #000; padding: 2px; text-align: center;">3</td><td style="border: 1px solid #000; padding: 2px;">Amenan.</td></tr>
        </table>
        <table style="width: 100%; border-collapse: collapse; font-size: 9pt; margin-bottom: 10px;">
          <tr style="background-color: #FFF2CC;">
            <th style="border: 1px solid #000; padding: 4px; width: 20%;">N°</th>
            <th style="border: 1px solid #000; padding: 4px;">POEMES</th>
          </tr>
          <tr><td style="border: 1px solid #000; padding: 2px; text-align: center;">1</td><td style="border: 1px solid #000; padding: 2px;">Vive la rentrée.</td></tr>
          <tr><td style="border: 1px solid #000; padding: 2px; text-align: center;">2</td><td style="border: 1px solid #000; padding: 2px;">Un cartable.</td></tr>
          <tr><td style="border: 1px solid #000; padding: 2px; text-align: center;">3</td><td style="border: 1px solid #000; padding: 2px;">Jolie maman.</td></tr>
        </table>
        <table style="width: 100%; border-collapse: collapse; font-size: 9pt;">
          <tr style="background-color: #FFF2CC;">
            <th style="border: 1px solid #000; padding: 4px;">MAÎTRE(SSE) DU COURS</th>
          </tr>
          <tr><td style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold;">${school.teacherName}</td></tr>
        </table>
        <table style="width: 100%; border-collapse: collapse; font-size: 9pt; margin-top: 10px;">
          <tr style="background-color: #FFF2CC;">
            <th style="border: 1px solid #000; padding: 4px;">DESIGNATION</th>
            <th style="border: 1px solid #000; padding: 4px;">NOMBRE</th>
            <th style="border: 1px solid #000; padding: 4px;">TOTAL</th>
          </tr>
          <tr><td style="border: 1px solid #000; padding: 2px;">EFFECTIFS</td><td style="border: 1px solid #000; padding: 2px; text-align: center;">GARÇONS</td><td style="border: 1px solid #000; padding: 2px; text-align: center;">${boys}</td></tr>
          <tr><td style="border: 1px solid #000; padding: 2px;"></td><td style="border: 1px solid #000; padding: 2px; text-align: center;">FILLES</td><td style="border: 1px solid #000; padding: 2px; text-align: center;">${girls}</td></tr>
          <tr><td style="border: 1px solid #000; padding: 2px;"></td><td style="border: 1px solid #000; padding: 2px; text-align: center;">TOTAL</td><td style="border: 1px solid #000; padding: 2px; text-align: center;">${students.length}</td></tr>
          <tr><td style="border: 1px solid #000; padding: 2px;">REDOUBLANTS</td><td style="border: 1px solid #000; padding: 2px; text-align: center;">GARÇONS</td><td style="border: 1px solid #000; padding: 2px; text-align: center;">${students.filter(s => s.classScolarity > s.overallScolarity && s.gender === 'garcon').length}</td></tr>
          <tr><td style="border: 1px solid #000; padding: 2px;"></td><td style="border: 1px solid #000; padding: 2px; text-align: center;">FILLES</td><td style="border: 1px solid #000; padding: 2px; text-align: center;">${students.filter(s => s.classScolarity > s.overallScolarity && s.gender === 'fille').length}</td></tr>
          <tr><td style="border: 1px solid #000; padding: 2px;"></td><td style="border: 1px solid #000; padding: 2px; text-align: center;">TOTAL</td><td style="border: 1px solid #000; padding: 2px; text-align: center;">${students.filter(s => s.classScolarity > s.overallScolarity).length}</td></tr>
          <tr><td style="border: 1px solid #000; padding: 2px;">NON REDOUBLANTS</td><td style="border: 1px solid #000; padding: 2px; text-align: center;">GARÇONS</td><td style="border: 1px solid #000; padding: 2px; text-align: center;">${students.filter(s => s.classScolarity <= s.overallScolarity && s.gender === 'garcon').length}</td></tr>
          <tr><td style="border: 1px solid #000; padding: 2px;"></td><td style="border: 1px solid #000; padding: 2px; text-align: center;">FILLES</td><td style="border: 1px solid #000; padding: 2px; text-align: center;">${students.filter(s => s.classScolarity <= s.overallScolarity && s.gender === 'fille').length}</td></tr>
          <tr><td style="border: 1px solid #000; padding: 2px;"></td><td style="border: 1px solid #000; padding: 2px; text-align: center;">TOTAL</td><td style="border: 1px solid #000; padding: 2px; text-align: center;">${students.filter(s => s.classScolarity <= s.overallScolarity).length}</td></tr>
          <tr style="background-color: #FFF2CC;"><th style="border: 1px solid #000; padding: 4px;">DIRECTRICE DE L'ECOLE</th></tr>
          <tr><td colspan="3" style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold;">${school.directorName}</td></tr>
        </table>
      </div>
    </div>
  `;

  // Ajouter au DOM pour capture
  document.body.appendChild(pdfContainer);

  // Attendre un peu pour que le style soit appliqué
  setTimeout(() => {
    import('jspdf').then(({ jsPDF }) => {
      import('html2canvas').then((html2canvas) => {
        html2canvas.default(pdfContainer, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
        }).then((canvas) => {
          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          const pdf = new jsPDF.default({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a3',
          });

          const imgWidth = 420; // A3 width in mm
          const imgHeight = (canvas.height * 420) / canvas.width;

          pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
          pdf.save('tableau-recapitulatif.pdf');

          // Nettoyer
          document.body.removeChild(pdfContainer);

          // Marquer comme téléchargé
          const data = {
            school,
            students,
            hasDownloaded: true,
          };
          localStorage.setItem(`tableau-${activeCode}`, JSON.stringify(data));
          setIsEditing(false);
          setHasDownloaded(true);

          // Marquer le code comme utilisé
          const allCodes = JSON.parse(localStorage.getItem('tableau-recap-codes') || '[]');
          const updatedCodes = allCodes.map(c =>
            c.code === activeCode ? { ...c, used: true, usedAt: new Date().toISOString() } : c
          );
          localStorage.setItem('tableau-recap-codes', JSON.stringify(updatedCodes));

          // Simuler l'envoi par email
          const mailto = `mailto:?subject=Tableau Récapitulatif - ${school.class}&body=Voici votre tableau récapitulatif en pièce jointe.`;
          window.open(mailto);

          alert('PDF généré, téléchargé, et envoyé par email !');
        });
      });
    });
  }, 500);
};

  // Comptages
  const girls = students.filter(s => s.gender === 'fille').length;
  const boys = students.filter(s => s.gender === 'garcon').length;

  return (
    <div style={styles.container} id="print-area">
      <h1>TABLEAU RÉCAPITULATIF</h1>

      {!isEditing && (
        <div style={styles.lockedBanner}>
          ✅ Édition terminée. Le document a été téléchargé.
        </div>
      )}

      <button onClick={() => {
        if (window.confirm('Se déconnecter ?')) {
          window.location.href = '/';
        }
      }} style={styles.logoutButton}>
        Se déconnecter
      </button>

      {/* Informations de l'école */}
      <h2>🏫 Informations de l'école</h2>
      <div style={styles.form}>
        {Object.keys(school).map((key) => (
          <div key={key} style={styles.formGroup}>
            <label style={styles.label}>
              {key === 'country' && 'Pays'}
              {key === 'city' && 'Ville'}
              {key === 'directionGeneral' && 'DRENA'}
              {key === 'iepp' && 'IEPP'}
              {key === 'epp' && 'EPP'}
              {key === 'schoolYear' && 'Année scolaire'}
              {key === 'schoolName' && 'Nom de l\'école'}
              {key === 'class' && 'Classe'}
              {key === 'teacherName' && 'Nom de l\'enseignant'}
              {key === 'directorName' && 'Nom du directeur(trice)'}
            </label>
            {key === 'class' ? (
              <select
                name={key}
                value={school[key]}
                onChange={handleSchoolChange}
                disabled={!isEditing}
                style={styles.input}
              >
                {['Petite S', 'Moyenne S', 'Grande S', 'CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name={key}
                value={school[key]}
                onChange={handleSchoolChange}
                disabled={!isEditing}
                style={styles.input}
              />
            )}
          </div>
        ))}
      </div>

      {/* Saisie des élèves */}
      {isEditing && (
        <>
          <h2>✏️ Saisie des élèves</h2>
          <div style={styles.form}>
            <div style={styles.formGroup}>
              <label>N°</label>
              <input
                type="number"
                value={newStudent.number}
                onChange={(e) => setNewStudent({ ...newStudent, number: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Nom</label>
              <input
                type="text"
                value={newStudent.lastname}
                onChange={(e) => setNewStudent({ ...newStudent, lastname: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Prénoms</label>
              <input
                type="text"
                value={newStudent.firstname}
                onChange={(e) => setNewStudent({ ...newStudent, firstname: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Sexe</label>
              <select
                value={newStudent.gender}
                onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                style={styles.input}
              >
                <option value="garcon">Garçon</option>
                <option value="fille">Fille</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label>Date de naissance</label>
              <input
                type="text"
                placeholder="jj/mm/aaaa"
                value={newStudent.birthdate}
                onChange={(e) => setNewStudent({ ...newStudent, birthdate: e.target.value })}
                style={styles.input}
              />
            </div>
            <button onClick={addStudent} style={styles.button}>Ajouter</button>
            <button onClick={nextStudent} style={styles.button}>Suivant</button>
          </div>
        </>
      )}

      {/* Liste des élèves */}
      <h2>📋 Liste des élèves ({students.length})</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>N°</th>
            <th>Nom</th>
            <th>Prénoms</th>
            <th>Sexe</th>
            <th>Date de naissance</th>
            {isEditing && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={i}>
              <td>{s.number}</td>
              <td>{s.lastname}</td>
              <td>{s.firstname}</td>
              <td style={{ color: s.gender === 'fille' ? 'red' : 'black', fontWeight: 'bold' }}>
                {s.gender === 'fille' ? 'Fille' : 'Garçon'}
              </td>
              <td>{s.birthdate}</td>
              {isEditing && (
                <td>
                  <button onClick={() => deleteStudent(i)} style={styles.deleteButton}>Supprimer</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Résumé */}
      <div style={styles.summary}>
        <p><strong>Total d'élèves :</strong> {students.length}</p>
        <p><strong>Filles :</strong> {girls}</p>
        <p><strong>Garçons :</strong> {boys}</p>
      </div>

      {/* Boutons d'action */}
      {isEditing ? (
        <div style={styles.actionButtons}>
          <button onClick={pauseEditing} style={styles.warningButton}>Sauvegarder et fermer</button>
          <button onClick={saveAndQuit} style={styles.dangerButton}>Sauvegarder et quitter</button>
          <button onClick={generatePDF} style={styles.pdfButton}>Télécharger le PDF</button>
        </div>
      ) : (
        <div style={styles.downloaded}>
          📄 Le document a été téléchargé. Aucune modification possible.
        </div>
      )}
    </div>
  );
}

// Styles
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    float: 'right',
    cursor: 'pointer',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '10px',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '10px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '5px 0',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  warningButton: {
    backgroundColor: '#ffc107',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  dangerButton: {
    backgroundColor: '#fd7e14',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  pdfButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '18px',
    cursor: 'pointer',
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
  },
  td: {
    border: '1px solid #ddd',
    padding: '10px',
  },
  summary: {
    backgroundColor: '#e7f3ff',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #b8daff',
  },
  actionButtons: {
    marginTop: '30px',
    marginBottom: '20px',
  },
  downloaded: {
    padding: '15px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '4px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  lockedBanner: {
    padding: '15px',
    backgroundColor: '#d1ecf1',
    color: '#0c5460',
    borderRadius: '4px',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
};