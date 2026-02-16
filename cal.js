const classSelector = document.getElementById("classSelector");
const periodSelector = document.getElementById("periodSelector");
const baseVal = document.getElementById("baseVal");
const taxVal = document.getElementById("taxVal");
const totalVal = document.getElementById("totalVal");
const btnAmount = document.getElementById("btnAmount");
const promoLine = document.getElementById("promoLine");
const promoVal = document.getElementById("promoVal");

// Calcul du total / acompte
function calculateTotal() {
    let basePrice = parseFloat(classSelector.value) || 0;
    let serviceFee = basePrice * 0.02;
    let discount = 0;
    let period = periodSelector.value.toLowerCase();

    if (period === "total") {
        discount = basePrice * 0.05;
        promoLine.style.display = "flex";
        promoVal.textContent = "- " + discount.toFixed(2) + " $";
    } else if (period === "trim") {
        promoLine.style.display = "none";
    }

    let fullTotal = basePrice + serviceFee - discount;
    let amountToPay = (period === "trim") ? fullTotal / 2 : fullTotal;

    baseVal.textContent = basePrice.toFixed(2) + " $";
    taxVal.textContent = serviceFee.toFixed(2) + " $";
    totalVal.textContent = amountToPay.toFixed(2) + " $";
    btnAmount.textContent = amountToPay.toFixed(2) + " $";
}

classSelector.addEventListener("change", calculateTotal);
periodSelector.addEventListener("change", calculateTotal);
calculateTotal();

document.getElementById("feeForm").addEventListener("submit", function(e){
    e.preventDefault();
    alert("Paiement effectué avec succès !");
});

// Générer PDF facture ultra pro
document.getElementById("generateInvoiceBtn")?.addEventListener("click", function(){
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

    let clientName = document.querySelector('#feeForm input[type="text"]').value || "Nom non renseigné";
    let persons = document.querySelector('#feeForm input[type="number"]').value || 1;
    let clientPhone = document.querySelector('#feeForm input[type="number"]:nth-of-type(2)')?.value || "Numéro non renseigné";
    let clientEmail = document.querySelector('#feeForm input[type="email"]')?.value || "Email non renseigné";
    let basePrice = parseFloat(classSelector.value) || 0;
    let serviceFee = basePrice * 0.02;
    let period = periodSelector.value.toLowerCase();
    let discount = (period === "total") ? basePrice * 0.05 : 0;
    let fullTotal = basePrice + serviceFee - discount;
    let amountToPay = (period === "trim") ? fullTotal / 2 : fullTotal;

    // Logo
    let img = new Image();
    img.src = "grand palace.png"; // chemin vers ton logo
    img.onload = function() {
        // Header
        doc.setFontSize(24);
        doc.setTextColor(139,0,0);
        doc.text("Grand Palace - Facture", 297, 50, { align: "center" });
        doc.addImage(img, 'PNG', 250, 60, 100, 100);

        // Infos client
        doc.setFontSize(12);
        doc.setTextColor(0,0,0);
        doc.text(`Client: ${clientName}`, 40, 200);
        doc.text(`Email: ${clientEmail}`, 40, 220);
        doc.text(`Téléphone: ${clientPhone}`, 40, 240);
        doc.text(`Nombre de personnes: ${persons}`, 40, 260);
        doc.text(`Classe choisie: ${classSelector.options[classSelector.selectedIndex].text}`, 40, 280);

        // Tableau des frais
        const startY = 320;
        doc.setFillColor(235,235,235);
        doc.rect(40, startY-15, 515, 130, 'F'); // fond gris tableau

        doc.setDrawColor(139,0,0);
        doc.rect(40, startY-15, 515, 130); // bordure rouge tableau

        doc.setFontSize(12);
        doc.text("Description", 60, startY);
        doc.text("Montant ($)", 450, startY);

        doc.text("Frais de paiement", 60, startY+25);
        doc.text(`${basePrice.toFixed(2)}`, 450, startY+25, {align: "right"});
        doc.text("Frais de service (2%)", 60, startY+50);
        doc.text(`${serviceFee.toFixed(2)}`, 450, startY+50, {align: "right"});
        if(discount > 0){
            doc.text("Remise", 60, startY+75);
            doc.text(`-${discount.toFixed(2)}`, 450, startY+75, {align: "right"});
        }
        doc.setFontSize(16);
        doc.text("Total à payer", 60, startY+110);
        doc.text(`${amountToPay.toFixed(2)} $`, 450, startY+110, {align: "right"});

        // Paiement
        doc.setFontSize(12);
        doc.text(`Paiement: ${period === "trim" ? "Acompte" : "Total"}`, 40, startY+150);

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(100,100,100);
        doc.text("Merci pour votre réservation. Grand Palace vous souhaite un agréable séjour !", 297, 780, {align: "center"});

        // Télécharger PDF
        doc.save(`Facture_${clientName}.pdf`);
    };
});
