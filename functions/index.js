const admin = require('firebase-admin');
admin.initializeApp();

exports.db = admin.firestore();
exports.firestore = admin.firestore;

const { createOrderAndSession } = require('./createOrderAndSession');
const { createUserDocument } = require('./createUserDocument');
const { retrieveStripeSession } = require('./retrieveStripeSession');
const { cancelOrder } = require('./cancelOrder');
const { nextServer } = require('./nextServer');

// Exporting our http function
exports.createOrderAndSession = createOrderAndSession;

// Exportinng  createUserDocument
exports.createUserDocument = createUserDocument;

// Exportinng  retrieveStripeSession
exports.retrieveStripeSession = retrieveStripeSession;

// Exportinng  cancelOrder
exports.cancelOrder = cancelOrder;

// Exportinng  nextServer
exports.nextServer = nextServer;
