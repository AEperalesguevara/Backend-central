const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail", // O usa otro proveedor (Outlook, Yahoo, etc.)
  auth: {
    user: process.env.EMAIL_USER, // Usar variables de entorno
    pass: process.env.EMAIL_PASS, // Nunca guardes credenciales directamente en el código
  },
});

const sendReservationEmail = async (email, reservationDetails) => {
  const { name, date, time, guests } = reservationDetails;
  try {
    await transporter.sendMail({
      from: "tu-correo@gmail.com",
      to: email,
      subject: "Confirmación de Reserva",
      text: `Hola ${name}, tu reserva ha sido confirmada para el día ${date} a las ${time} con ${guests} invitados.`,
      html: `<h1>Confirmación de Reserva</h1>
             <p>Hola ${name},</p>
             <p>Tu reserva ha sido confirmada para:</p>
             <ul>
               <li><b>Fecha:</b> ${date}</li>
               <li><b>Hora:</b> ${time}</li>
               <li><b>Invitados:</b> ${guests}</li>
             </ul>
             <p>¡Gracias por elegirnos!</p>`,
    });
    console.log("Correo enviado con éxito");
  } catch (error) {
    console.error("Error enviando el correo:", error);
  }
};

module.exports = { sendReservationEmail };
