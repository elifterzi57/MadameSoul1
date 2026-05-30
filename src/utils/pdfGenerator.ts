import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { robotoFontBase64 } from '../lib/pdfFont';

export const generatePDF = async ({
  readingText,
  drawnCards,
  userInfo,
  locales,
  adsConfig,
  currentTransactionId,
  user,
  showToast,
  setIsExportingPDF
}: {
  readingText: string;
  drawnCards: any[];
  userInfo: {
    name: string;
    dob: string;
    birthplace: string;
    relationship: string;
    language: string;
  };
  locales: Record<string, any>;
  adsConfig: any;
  currentTransactionId: string | null;
  user: any;
  showToast: (msg: string, type: 'info' | 'error' | 'success') => void;
  setIsExportingPDF: (val: boolean) => void;
}) => {
  setIsExportingPDF(true);

  try {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    container.style.left = '0';
    container.style.width = '800px';
    container.style.zIndex = '-9999';
    
    const dateStr = new Date().toLocaleDateString(
      userInfo.language === 'en' ? 'en-US' : userInfo.language === 'tr' ? 'tr-TR' : undefined
    );
    
    const formatReading = (text: string) => {
      let formatted = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
      formatted = formatted.replace(/^### (.*$)/gim, '<h3 style="margin: 20px 0 10px; color: #ecd8a6; font-family: \'Playfair Display\', serif;">$1</h3>');
      formatted = formatted.replace(/^## (.*$)/gim, '<h2 style="margin: 25px 0 12px; color: #ecd8a6; font-family: \'Playfair Display\', serif;">$1</h2>');
      formatted = formatted.replace(/^# (.*$)/gim, '<h1 style="margin: 30px 0 15px; color: #ecd8a6; font-family: \'Playfair Display\', serif;">$1</h1>');
      
      let paragraphs = formatted.split(/\n\s*\n/);
      return paragraphs.map(p => {
        if (p.trim().startsWith('<h')) return p;
        
        let pFormatted = p.split('\n').map(l => {
           if (l.trim().startsWith('- ') || l.trim().startsWith('* ')) {
               return `<div style="margin-left: 20px; display: block;">&bull; ${l.trim().substring(2)}</div>`;
           }
           return l;
        }).join(' '); 
        
        return `<p style="margin: 0 0 15px 0; line-height: 1.6;">${pFormatted}</p>`;
      }).join('');
    };
    
    const cleanReading = formatReading(readingText);

    const cardsHtml = `
      <div style="display: flex; justify-content: center; gap: 40px; margin: 50px 0 60px 0; position: relative;">
        ${drawnCards.map((c: any) => `
          <div style="text-align: center; width: 160px; position: relative; z-index: 2;">
            <div style="border-radius: 12px; overflow: hidden; border: 2px solid rgba(236,216,166,0.4); box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(236,216,166,0.15); background-color: #1a1025; height: 240px; display: flex; align-items: center; justify-content: center;">
               <img src="${window.location.origin}/cards/${c.id}.png" style="width: 100%; height: 100%; object-fit: cover;" crossorigin="anonymous" />
            </div>
            <div style="margin-top: 16px; font-family: 'Playfair Display', serif; font-size: 16px; color: #ecd8a6; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
              ${locales[userInfo.language]?.cards?.[c.locKey]?.name || c.name}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Render ad1 banner html if enabled
    const ad1Html = adsConfig?.ad1?.enabled ? `
      <div id="pdf-ad1" style="margin-top: 60px; padding: 40px; border-radius: 20px; text-align: center; position: relative; overflow: hidden; border: 1px solid rgba(236,216,166,0.3); background: linear-gradient(135deg, rgba(236,216,166,0.05) 0%, rgba(10,5,18,0.8) 100%);">
         <h3 style="margin: 0 0 15px 0; color: #ecd8a6; font-family: 'Playfair Display', serif; text-transform: uppercase; letter-spacing: 4px; font-size: 14px; opacity: 0.8;">✦ ${(adsConfig.ad1.sponsored?.[userInfo.language] || adsConfig.ad1.sponsored?.en || "Sponsored")} ✦</h3>
         <p style="margin: 0 0 25px 0; color: #f5eedc; font-size: 20px; font-family: 'Playfair Display', serif; font-weight: bold;">${(adsConfig.ad1.text?.[userInfo.language] || adsConfig.ad1.text?.en || "Get 20% off Katina Tarot Cards on Amazon!")}</p>
         
         <div style="display: inline-block; background-color: #05000a; padding: 16px 32px; border-radius: 12px; font-family: 'JetBrains Mono', monospace; font-size: 24px; font-weight: bold; color: #ecd8a6; border: 1px dashed rgba(236,216,166,0.5); margin-bottom: 25px; box-shadow: 0 5px 15px rgba(0,0,0,0.5);">
           ${adsConfig.ad1.promoCode || "KATINA20"}
         </div>
         <br/>
         <div style="display: inline-block; color: #ecd8a6; font-family: 'Playfair Display', serif; font-size: 15px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid rgba(236,216,166,0.4); padding-bottom: 4px;">${(adsConfig.ad1.buttonText?.[userInfo.language] || adsConfig.ad1.buttonText?.en || "Shop Now")}</div>
      </div>
    ` : '';

    // Render ad2 banner html if enabled
    const ad2Html = adsConfig?.ad2?.enabled ? `
      <div id="pdf-ad2" style="margin-top: 40px; padding: 40px; border-radius: 20px; text-align: center; position: relative; overflow: hidden; border: 1px solid rgba(236,216,166,0.3); background: linear-gradient(135deg, rgba(236,216,166,0.05) 0%, rgba(10,5,18,0.8) 100%);">
         <h3 style="margin: 0 0 15px 0; color: #ecd8a6; font-family: 'Playfair Display', serif; text-transform: uppercase; letter-spacing: 4px; font-size: 14px; opacity: 0.8;">✦ ${(adsConfig.ad2.sponsored?.[userInfo.language] || adsConfig.ad2.sponsored?.en || "Sponsored")} ✦</h3>
         <p style="margin: 0 0 10px 0; color: #ecd8a6; font-size: 12px; font-family: 'Playfair Display', serif; text-transform: uppercase; letter-spacing: 2px; opacity: 0.7;">${(adsConfig.ad2.title?.[userInfo.language] || adsConfig.ad2.title?.en || "Live Session")}</p>
         <p style="margin: 0 0 25px 0; color: #f5eedc; font-size: 18px; font-family: 'Playfair Display', serif; font-weight: bold; line-height: 1.5;">${(adsConfig.ad2.text?.[userInfo.language] || adsConfig.ad2.text?.en || "")}</p>
         
         <div style="display: inline-block; color: #ecd8a6; font-family: 'Playfair Display', serif; font-size: 15px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid rgba(236,216,166,0.4); padding-bottom: 4px;">${(adsConfig.ad2.buttonText?.[userInfo.language] || adsConfig.ad2.buttonText?.en || "Shop on Etsy")}</div>
      </div>
    ` : '';

    container.innerHTML = `
      <div style="padding: 20px; background-color: #05000a; min-height: 1000px; box-sizing: border-box;">
        <div style="border: 1px solid rgba(236,216,166,0.2); border-radius: 24px; padding: 60px 80px; background: radial-gradient(circle at top center, rgba(30,19,50,0.4) 0%, rgba(5,0,10,1) 50%); position: relative; overflow: hidden;">
          
          <div style="position: absolute; top: 30px; left: 30px; width: 40px; height: 40px; border-top: 2px solid rgba(236,216,166,0.4); border-left: 2px solid rgba(236,216,166,0.4);"></div>
          <div style="position: absolute; top: 30px; right: 30px; width: 40px; height: 40px; border-top: 2px solid rgba(236,216,166,0.4); border-right: 2px solid rgba(236,216,166,0.4);"></div>
          <div style="position: absolute; bottom: 30px; left: 30px; width: 40px; height: 40px; border-bottom: 2px solid rgba(236,216,166,0.4); border-left: 2px solid rgba(236,216,166,0.4);"></div>
          <div style="position: absolute; bottom: 30px; right: 30px; width: 40px; height: 40px; border-bottom: 2px solid rgba(236,216,166,0.4); border-right: 2px solid rgba(236,216,166,0.4);"></div>

          <div style="text-align: center; margin-bottom: 50px;">
            <h1 style="font-size: 48px; letter-spacing: 4px; margin: 0 0 10px 0; color: #ecd8a6; font-family: 'Playfair Display', serif; font-weight: bold; text-shadow: 0 4px 20px rgba(236,216,166,0.2);">MADAME SOUL</h1>
            <div style="display: flex; align-items: center; justify-content: center; gap: 20px;">
              <div style="height: 1px; width: 60px; background: linear-gradient(90deg, transparent, rgba(236,216,166,0.5));"></div>
              <h2 style="font-size: 14px; letter-spacing: 6px; margin: 0; color: rgba(236,216,166,0.8); text-transform: uppercase; font-family: 'Playfair Display', serif;">Destiny Reading</h2>
              <div style="height: 1px; width: 60px; background: linear-gradient(-90deg, transparent, rgba(236,216,166,0.5));"></div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(236,216,166,0.2); border-top: 1px solid rgba(236,216,166,0.2); padding: 15px 0; margin-bottom: 30px; color: rgba(236,216,166,0.7); font-family: sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
            <div>Prepared For: <strong style="color: #ecd8a6;">${userInfo.name}</strong></div>
            <div>Date: <strong style="color: #ecd8a6;">${dateStr}</strong></div>
          </div>
          
          ${cardsHtml}

          <div style="font-size: 18px; line-height: 1.9; font-family: sans-serif; color: rgba(236, 216, 166, 0.95); padding: 0 20px; text-align: justify;">
            ${cleanReading}
          </div>

          ${ad1Html}
          ${ad2Html}
          
          <div style="margin-top: 100px;"></div>
        </div>
      </div>
    `;
    
    document.body.appendChild(container);
    
    // Wait for images to load
    const images = Array.from(container.querySelectorAll('img'));
    await Promise.all(images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));

    // Calculate coordinate map for clickable ads (MS-143)
    const containerRect = container.getBoundingClientRect();
    let ad1Coords = null;
    let ad2Coords = null;

    if (adsConfig?.ad1?.enabled) {
      const el = container.querySelector('#pdf-ad1');
      if (el) {
        const rect = el.getBoundingClientRect();
        ad1Coords = {
          x: (rect.left - containerRect.left) * 2,
          y: (rect.top - containerRect.top) * 2,
          w: rect.width * 2,
          h: rect.height * 2
        };
      }
    }

    if (adsConfig?.ad2?.enabled) {
      const el = container.querySelector('#pdf-ad2');
      if (el) {
        const rect = el.getBoundingClientRect();
        ad2Coords = {
          x: (rect.left - containerRect.left) * 2,
          y: (rect.top - containerRect.top) * 2,
          w: rect.width * 2,
          h: rect.height * 2
        };
      }
    }

    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: '#05000a',
      useCORS: true,
      allowTaint: false,
      logging: false
    });
    
    document.body.removeChild(container);
    
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    // Register and set Roboto font for Turkish character support
    pdf.addFileToVFS('Roboto-Regular.ttf', robotoFontBase64);
    pdf.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    pdf.setFont('Roboto');
    
    pdf.setFillColor('#05000a');
    pdf.rect(0, 0, canvas.width, canvas.height, 'F');
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

    pdf.setDrawColor(236, 216, 166);
    pdf.setLineWidth(1);
    pdf.line(canvas.width / 2 - 200, canvas.height - 150, canvas.width / 2 + 200, canvas.height - 150);
    
    pdf.setFontSize(20);
    pdf.setTextColor(236, 216, 166);
    
    const t1 = "Instagram: @madamesoulstudio";
    const w1 = pdf.getTextWidth(t1);
    pdf.text(t1, (canvas.width - w1) / 2, canvas.height - 100);
    pdf.link((canvas.width - w1) / 2, canvas.height - 120, w1, 24, { url: 'https://www.instagram.com/madamesoulstudio/' });

    const t2 = "Etsy: madamesoulstudio";
    const w2 = pdf.getTextWidth(t2);
    pdf.text(t2, (canvas.width - w2) / 2, canvas.height - 70);
    pdf.link((canvas.width - w2) / 2, canvas.height - 90, w2, 24, { url: 'https://www.etsy.com/shop/MadameSoulStudio?ref=sh-carousel-1' });

    // Inject double clickable ad redirect links into PDF (MS-143)
    if (ad1Coords && adsConfig?.ad1?.link) {
      pdf.link(ad1Coords.x, ad1Coords.y, ad1Coords.w, ad1Coords.h, { url: adsConfig.ad1.link });
    }
    if (ad2Coords && adsConfig?.ad2?.link) {
      pdf.link(ad2Coords.x, ad2Coords.y, ad2Coords.w, ad2Coords.h, { url: adsConfig.ad2.link });
    }

    pdf.save(`Katina_Reading_${userInfo.name.replace(/\s+/g, '_')}.pdf`);

    // Mark PDF as downloaded in transaction record
    if (currentTransactionId) {
      try {
        await updateDoc(doc(db, 'moon_transactions', currentTransactionId), {
          pdfDownloaded: 1
        });
      } catch (error) {
        console.error("PDF download update error:", error);
      }
    }
  } catch (err) {
    console.error('PDF Export Error:', err);
    showToast(userInfo.language === 'tr' ? "PDF indirilirken bir hata oluştu." : "Error downloading PDF.", 'error');
  } finally {
    setIsExportingPDF(false);
  }
};
