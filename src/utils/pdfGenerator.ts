import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { robotoFontBase64 } from '../lib/pdfFont';
import { convertToLocaleUppercase } from './textUtils';

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
    const dateStr = new Date().toLocaleDateString(
      userInfo.language === 'en' ? 'en-US' : userInfo.language === 'tr' ? 'tr-TR' : undefined
    );

    // Format reading markdown text into clean HTML structure
    const formatReading = (text: string) => {
      let formatted = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
      formatted = formatted.replace(/^### (.*$)/gim, '<h3 style="margin: 20px 0 10px; color: #ecd8a6; font-family: \'Playfair Display\', serif; font-size: 20px; font-weight: bold; text-align: left;">$1</h3>');
      formatted = formatted.replace(/^## (.*$)/gim, '<h2 style="margin: 25px 0 12px; color: #ecd8a6; font-family: \'Playfair Display\', serif; font-size: 24px; font-weight: bold; text-align: left;">$1</h2>');
      formatted = formatted.replace(/^# (.*$)/gim, '<h1 style="margin: 30px 0 15px; color: #ecd8a6; font-family: \'Playfair Display\', serif; font-size: 28px; font-weight: bold; text-align: left;">$1</h1>');
      
      let paragraphs = formatted.split(/\n\s*\n/);
      return paragraphs.map(p => {
        if (p.trim().startsWith('<h')) return p;
        
        let pFormatted = p.split('\n').map(l => {
           if (l.trim().startsWith('- ') || l.trim().startsWith('* ')) {
               return `<div style="margin-left: 20px; display: block; text-align: left;">&bull; ${l.trim().substring(2)}</div>`;
           }
           return l;
        }).join(' '); 
        
        return `<p style="margin: 0 0 15px 0; line-height: 1.9; text-align: justify;">${pFormatted}</p>`;
      }).join('');
    };
    
    const cleanReading = formatReading(readingText);

    const cardsHtml = `
      <div style="display: flex; justify-content: center; gap: 40px; margin: 30px 0 40px 0; position: relative;">
        ${drawnCards.map((c: any) => `
          <div style="text-align: center; width: 140px; position: relative; z-index: 2;">
            <div style="border-radius: 12px; overflow: hidden; border: 2px solid rgba(236,216,166,0.4); box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(236,216,166,0.15); background-color: #1a1025; height: 210px; display: flex; align-items: center; justify-content: center;">
               <img src="${window.location.origin}/cards/${c.id}.webp" style="width: 100%; height: 100%; object-fit: cover;" crossorigin="anonymous" />
            </div>
            <div style="margin-top: 12px; font-family: 'Playfair Display', serif; font-size: 13px; color: #ecd8a6; text-transform: uppercase; letter-spacing: 1.5px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
              ${locales[userInfo.language]?.cards?.[c.locKey]?.name || c.name}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Render ad1 banner html if enabled
    const ad1Html = adsConfig?.ad1?.enabled ? `
      <div id="pdf-ad1" style="margin-top: 25px; padding: 25px; border-radius: 20px; text-align: center; position: relative; overflow: hidden; border: 1px solid rgba(236,216,166,0.3); background: linear-gradient(135deg, rgba(236,216,166,0.05) 0%, rgba(10,5,18,0.8) 100%); width: 100%; box-sizing: border-box;">
         <h3 style="margin: 0 0 10px 0; color: #ecd8a6; font-family: 'Playfair Display', serif; text-transform: uppercase; letter-spacing: 4px; font-size: 12px; opacity: 0.8;">✦ ${(adsConfig.ad1.sponsored?.[userInfo.language] || adsConfig.ad1.sponsored?.en || "Sponsored")} ✦</h3>
         <p style="margin: 0 0 15px 0; color: #f5eedc; font-size: 18px; font-family: 'Playfair Display', serif; font-weight: bold; line-height: 1.4;">${(adsConfig.ad1.text?.[userInfo.language] || adsConfig.ad1.text?.en || "Get 20% off Katina Tarot Cards on Amazon!")}</p>
         ${adsConfig.ad1.mediaSrc ? `
           <div style="width: 100%; height: 320px; border-radius: 12px; overflow: hidden; margin-bottom: 20px; border: 1px solid rgba(236,216,166,0.2); background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
             <img src="${adsConfig.ad1.mediaSrc}" style="width: 100%; height: 100%; object-fit: cover;" crossorigin="anonymous" />
           </div>
         ` : ''}
         ${adsConfig.ad1.promoCode ? `
           <div style="display: inline-block; background-color: #05000a; padding: 12px 24px; border-radius: 10px; font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: bold; color: #ecd8a6; border: 1px dashed rgba(236,216,166,0.5); margin-bottom: 20px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); line-height: 1;">
             ${adsConfig.ad1.promoCode}
           </div>
           <br/>
         ` : ''}
         <div style="display: inline-block; color: #ecd8a6; font-family: 'Playfair Display', serif; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid rgba(236,216,166,0.4); padding-bottom: 4px;">${(adsConfig.ad1.buttonText?.[userInfo.language] || adsConfig.ad1.buttonText?.en || "Shop Now")}</div>
      </div>
    ` : '';

    // Render ad2 banner html if enabled
    const ad2Html = adsConfig?.ad2?.enabled ? `
      <div id="pdf-ad2" style="margin-top: 25px; padding: 25px; border-radius: 20px; text-align: center; position: relative; overflow: hidden; border: 1px solid rgba(236,216,166,0.3); background: linear-gradient(135deg, rgba(236,216,166,0.05) 0%, rgba(10,5,18,0.8) 100%); width: 100%; box-sizing: border-box;">
         <h3 style="margin: 0 0 10px 0; color: #ecd8a6; font-family: 'Playfair Display', serif; text-transform: uppercase; letter-spacing: 4px; font-size: 12px; opacity: 0.8;">✦ ${(adsConfig.ad2.sponsored?.[userInfo.language] || adsConfig.ad2.sponsored?.en || "Sponsored")} ✦</h3>
         <p style="margin: 0 0 8px 0; color: #ecd8a6; font-size: 11px; font-family: 'Playfair Display', serif; text-transform: uppercase; letter-spacing: 2px; opacity: 0.7;">${(adsConfig.ad2.title?.[userInfo.language] || adsConfig.ad2.title?.en || "Live Session")}</p>
         <p style="margin: 0 0 15px 0; color: #f5eedc; font-size: 17px; font-family: 'Playfair Display', serif; font-weight: bold; line-height: 1.4;">${(adsConfig.ad2.text?.[userInfo.language] || adsConfig.ad2.text?.en || "")}</p>
         ${adsConfig.ad2.mediaSrc ? `
           <div style="width: 100%; height: 320px; border-radius: 12px; overflow: hidden; margin-bottom: 20px; border: 1px solid rgba(236,216,166,0.2); background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
             <img src="${adsConfig.ad2.mediaSrc}" style="width: 100%; height: 100%; object-fit: cover;" crossorigin="anonymous" />
           </div>
         ` : ''}
         <div style="display: inline-block; color: #ecd8a6; font-family: 'Playfair Display', serif; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid rgba(236,216,166,0.4); padding-bottom: 4px;">${(adsConfig.ad2.buttonText?.[userInfo.language] || adsConfig.ad2.buttonText?.en || "Shop on Etsy")}</div>
      </div>
    ` : '';

    // Render footer html
    const footerHtml = `
      <div id="pdf-footer" style="margin-top: 50px; text-align: center; width: 100%;">
        <div style="height: 1px; width: 300px; background: linear-gradient(90deg, transparent, rgba(236,216,166,0.4), transparent); margin: 0 auto 25px auto;"></div>
        <div style="font-family: 'Playfair Display', serif; font-size: 15px; color: #ecd8a6; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px;">
          <a href="https://www.instagram.com/madamesoulstudio/" style="color: #ecd8a6; text-decoration: none;" target="_blank">Instagram: @madamesoulstudio</a>
        </div>
        <div style="font-family: 'Playfair Display', serif; font-size: 15px; color: #ecd8a6; letter-spacing: 2px; text-transform: uppercase;">
          <a href="https://www.etsy.com/shop/MadameSoulStudio?ref=sh-carousel-1" style="color: #ecd8a6; text-decoration: none;" target="_blank">Etsy: madamesoulstudio</a>
        </div>
      </div>
    `;

    const PAGE_WIDTH = 800;

    const singlePageHtml = `
      <div id="pdf-single-page" style="width: 800px; box-sizing: border-box; padding: 75px 80px; position: relative; overflow: hidden; background: radial-gradient(circle at top center, rgba(30,19,50,0.4) 0%, rgba(5,0,10,1) 50%); border: 1px solid rgba(236,216,166,0.2); display: flex; flex-direction: column; justify-content: flex-start; gap: 20px; font-size: 18px; line-height: 1.9; font-family: sans-serif; color: rgba(236, 216, 166, 0.95); text-align: justify;">
        <!-- Corner decorations -->
        <div style="position: absolute; top: 30px; left: 30px; width: 40px; height: 40px; border-top: 2px solid rgba(236,216,166,0.4); border-left: 2px solid rgba(236,216,166,0.4);"></div>
        <div style="position: absolute; top: 30px; right: 30px; width: 40px; height: 40px; border-top: 2px solid rgba(236,216,166,0.4); border-right: 2px solid rgba(236,216,166,0.4);"></div>
        <div style="position: absolute; bottom: 30px; left: 30px; width: 40px; height: 40px; border-bottom: 2px solid rgba(236,216,166,0.4); border-left: 2px solid rgba(236,216,166,0.4);"></div>
        <div style="position: absolute; bottom: 30px; right: 30px; width: 40px; height: 40px; border-bottom: 2px solid rgba(236,216,166,0.4); border-right: 2px solid rgba(236,216,166,0.4);"></div>
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 20px; width: 100%;">
          <h1 style="font-size: 42px; letter-spacing: 4px; margin: 0 0 10px 0; color: #ecd8a6; font-family: 'Playfair Display', serif; font-weight: bold; text-shadow: 0 4px 20px rgba(236,216,166,0.2);">MADAME SOUL</h1>
          <div style="display: flex; align-items: center; justify-content: center; gap: 20px;">
            <div style="height: 1px; width: 60px; background: linear-gradient(90deg, transparent, rgba(236,216,166,0.5));"></div>
            <h2 style="font-size: 13px; letter-spacing: 6px; margin: 0; color: rgba(236,216,166,0.8); text-transform: uppercase; font-family: 'Playfair Display', serif;">Destiny Reading</h2>
            <div style="height: 1px; width: 60px; background: linear-gradient(-90deg, transparent, rgba(236,216,166,0.5));"></div>
          </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(236,216,166,0.2); border-top: 1px solid rgba(236,216,166,0.2); padding: 12px 0; margin-bottom: 15px; color: rgba(236,216,166,0.7); font-family: sans-serif; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; width: 100%;">
          <div>Prepared For: <strong style="color: #ecd8a6;">${userInfo.name}</strong></div>
          <div>Date: <strong style="color: #ecd8a6;">${dateStr}</strong></div>
        </div>

        <!-- Cards -->
        ${cardsHtml}

        <!-- Reading Text -->
        <div style="width: 100%; box-sizing: border-box; text-align: justify;">
          ${cleanReading}
        </div>

        <!-- Ad 1 -->
        ${ad1Html ? `<div id="pdf-single-ad1" style="width: 100%; box-sizing: border-box;">${ad1Html}</div>` : ''}

        <!-- Ad 2 -->
        ${ad2Html ? `<div id="pdf-single-ad2" style="width: 100%; box-sizing: border-box;">${ad2Html}</div>` : ''}

        <!-- Footer -->
        <div id="pdf-single-footer" style="width: 100%; box-sizing: border-box;">
          ${footerHtml}
        </div>
      </div>
    `;

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    container.style.left = '0';
    container.style.width = '800px';
    container.style.zIndex = '-9999';
    container.innerHTML = singlePageHtml;
    document.body.appendChild(container);
    
    // Wait for images to load completely
    const images = Array.from(container.querySelectorAll('img'));
    await Promise.all(images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));

    const singlePageEl = container.querySelector('#pdf-single-page') as HTMLElement;
    const totalHeight = singlePageEl.getBoundingClientRect().height;

    // Calculate coordinate map for clickable regions relative to singlePageEl wrapper
    interface ClickableLink {
      url: string;
      x: number;
      y: number;
      w: number;
      h: number;
    }
    const clickableLinks: ClickableLink[] = [];
    const pageRect = singlePageEl.getBoundingClientRect();

    // Ad 1 Click Box
    if (adsConfig?.ad1?.enabled && adsConfig?.ad1?.link) {
      const adEl = singlePageEl.querySelector(`#pdf-single-ad1`);
      if (adEl) {
        const rect = adEl.getBoundingClientRect();
        clickableLinks.push({
          url: adsConfig.ad1.link,
          x: rect.left - pageRect.left,
          y: rect.top - pageRect.top,
          w: rect.width,
          h: rect.height
        });
      }
    }

    // Ad 2 Click Box
    if (adsConfig?.ad2?.enabled && adsConfig?.ad2?.link) {
      const adEl = singlePageEl.querySelector(`#pdf-single-ad2`);
      if (adEl) {
        const rect = adEl.getBoundingClientRect();
        clickableLinks.push({
          url: adsConfig.ad2.link,
          x: rect.left - pageRect.left,
          y: rect.top - pageRect.top,
          w: rect.width,
          h: rect.height
        });
      }
    }

    // Footer Links Click Boxes
    const footerEl = singlePageEl.querySelector(`#pdf-footer`);
    if (footerEl) {
      const links = Array.from(footerEl.querySelectorAll('a'));
      links.forEach(link => {
        const rect = link.getBoundingClientRect();
        clickableLinks.push({
          url: link.href,
          x: rect.left - pageRect.left,
          y: rect.top - pageRect.top,
          w: rect.width,
          h: rect.height
        });
      });
    }

    // Generate Single Page jsPDF Document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [PAGE_WIDTH, totalHeight]
    });

    // Register and set Roboto font for Turkish character support
    pdf.addFileToVFS('Roboto-Regular.ttf', robotoFontBase64);
    pdf.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    pdf.setFont('Roboto');

    const canvas = await html2canvas(singlePageEl, {
      scale: 2, // retina quality sharpness
      backgroundColor: '#05000a',
      useCORS: true,
      allowTaint: false,
      logging: false
    });

    const imgData = canvas.toDataURL('image/png', 1.0);

    // Reset fill and draw page backdrop
    pdf.setFillColor('#05000a');
    pdf.rect(0, 0, PAGE_WIDTH, totalHeight, 'F');
    pdf.addImage(imgData, 'PNG', 0, 0, PAGE_WIDTH, totalHeight);

    // Inject clickable area boxes
    clickableLinks.forEach(link => {
      pdf.link(link.x, link.y, link.w, link.h, { url: link.url });
    });

    // Remove hidden measuring container
    document.body.removeChild(container);

    // Save output
    const cleanName = convertToLocaleUppercase(userInfo.name, userInfo.language as any).replace(/\s+/g, '_');
    pdf.save(`Katina_Reading_${cleanName}.pdf`);

    // Update Firebase tracking transaction download status
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
