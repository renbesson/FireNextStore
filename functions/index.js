const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.db = admin.firestore();

const { createOrderAndSession } = require('./createOrderAndSession');
const { createUserDocument } = require('./createUserDocument');

// Exporting our http function
exports.createOrderAndSession = createOrderAndSession;

// Exportinng  createUserDocument
exports.createUserDocument = createUserDocument;
