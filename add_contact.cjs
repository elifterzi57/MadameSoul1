const fs = require('fs');
const yaml = require('yaml');

const translations = {
  en: {
    title: "Contact Us",
    subtitle: "You can fill out the form below to contact us.",
    successTitle: "Message Received",
    successSubtitle: "We will get back to you as soon as possible.",
    fullName: "Full Name",
    email: "Email",
    subject: "Subject",
    message: "Message",
    send: "Send",
    footerText: "Contact Us"
  },
  tr: {
    title: "Bize Ulaşın",
    subtitle: "Bizimle iletişime geçmek için aşağıdaki formu doldurabilirsiniz.",
    successTitle: "Mesajınız Alındı",
    successSubtitle: "En kısa sürede size dönüş yapacağız.",
    fullName: "Ad Soyad",
    email: "E-posta",
    subject: "Konu",
    message: "Mesaj",
    send: "Gönder",
    footerText: "Bize Ulaşın"
  },
  es: {
    title: "Contáctenos",
    subtitle: "Puede completar el formulario a continuación para contactarnos.",
    successTitle: "Mensaje Recibido",
    successSubtitle: "Nos pondremos en contacto con usted lo antes posible.",
    fullName: "Nombre Completo",
    email: "Correo Electrónico",
    subject: "Asunto",
    message: "Mensaje",
    send: "Enviar",
    footerText: "Contáctenos"
  },
  fr: {
    title: "Nous Contacter",
    subtitle: "Vous pouvez remplir le formulaire ci-dessous pour nous contacter.",
    successTitle: "Message Reçu",
    successSubtitle: "Nous vous répondrons dans les plus brefs délais.",
    fullName: "Nom Complet",
    email: "E-mail",
    subject: "Sujet",
    message: "Message",
    send: "Envoyer",
    footerText: "Nous Contacter"
  },
  zh: {
    title: "联系我们",
    subtitle: "您可以填写下表联系我们。",
    successTitle: "收到消息",
    successSubtitle: "我们将尽快回复您。",
    fullName: "全名",
    email: "电子邮件",
    subject: "主题",
    message: "消息",
    send: "发送",
    footerText: "联系我们"
  },
  ko: {
    title: "문의하기",
    subtitle: "아래 양식을 작성하여 문의하실 수 있습니다.",
    successTitle: "메시지 수신됨",
    successSubtitle: "가능한 한 빨리 답변해 드리겠습니다.",
    fullName: "성명",
    email: "이메일",
    subject: "주제",
    message: "메시지",
    send: "보내기",
    footerText: "문의하기"
  }
};

for (const lang of Object.keys(translations)) {
  const fileContent = fs.readFileSync(`src/locales/${lang}.yaml`, 'utf8');
  const data = yaml.parse(fileContent);
  data.contact = translations[lang];
  fs.writeFileSync(`src/locales/${lang}.yaml`, yaml.stringify(data));
  console.log(`Updated ${lang}.yaml`);
}
