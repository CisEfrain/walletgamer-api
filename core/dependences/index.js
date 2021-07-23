const axios = require('axios');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const fs = require('fs');

module.exports = { axios, joi, fs, jwt, crypto }