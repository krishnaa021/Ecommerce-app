const{ Worker } = require('bullmq');
const { connection } = require('../config/queue');
const Order = require('../models/Order');
const transporter = require('../config/mailer');
const PDFDocument = require('pdfkit');

const generateInvoiceBuffer = (order) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`Customer Name: ${order.user?.name || 'Customer'}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.moveDown();

    doc.text('--------------------------------------------------');
    doc.text('Items:');
    if (order.items && order.items.length > 0) {
      order.items.forEach((item) => {
        doc.text(`- ${item.name || 'Product'} x ${item.quantity || 1} — $${item.price || 0}`);
      });
    }
    doc.text('--------------------------------------------------');
    doc.moveDown();
    doc.fontSize(14).text(`Total Amount: $${order.totalAmount}`, { bold: true });

    doc.end();
  });
};

const orderWorker = new Worker(
    'order-tasks',
    async (job) => {
    console.log(`\n📦 [Worker] Processing task: "${job.name}" (Job ID: ${job.id})`);

    if (job.name === 'process-order-confirmation') {
      const { orderId } = job.data;

      const order = await Order.findById(orderId).populate('user', 'name email');
      if (!order) {
        throw new Error(`Order ${orderId} not found in database.`);
      }

      const recipientEmail = order.user?.email || job.data.customerEmail;
      console.log(`Generating PDF invoice for Order ${orderId}...`);
      const pdfBuffer = await generateInvoiceBuffer(order);

      console.log(`Sending confirmation email to: ${recipientEmail}...`);
      await transporter.sendMail({
        from: `"Store Checkout" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: `Your Order Confirmation #${order._id}`,
        text: `Thank you for your purchase! Attached is your official invoice.`,
        attachments: [
          {
            filename: `invoice-${order._id}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      });

        console.log(`[Worker] Finished job ${job.id}`);
        return { status: 'success', processedAt: new Date() };
    }
  },
    { connection}
);

orderWorker.on('completed', (job) => {
    console.log(`job ${job.id} completed!`);
});

orderWorker.on('failed', (job, err) => {
    console.error(`job ${job?.id} failed: ${err.message}`);
});

module.exports = orderWorker;