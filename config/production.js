module.exports = {
  SERVER: "Production",
  URL: "http://app.walletgamer.com/",
  ADAPTERPORT: 8081,
  LOG: {
    BUSSINESS: "./logs/bussiness/buss.log",
    DEBUG: "./logs/debug/debug.log",
  },
  DATABASE: {
    USER: "wallet_produ",
    PASS: "gQcOG4mr",
    DB: "wallet_gamerP",
    HOST: "127.0.0.1"
},
STRIPE: { 
  KEY:'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',
  IMG: 'https://walletgamer.com/wp-content/uploads/elementor/thumbs/Logo-Wallet-Gamer-ouoqpulxvgt5yddoirsf9tadlqm3l02q33qwakqxjk.png'
},
SUCCESS: 'http://api.walletgamer.com/pago/',
CANCEL: 'http://api.walletgamer.com/pago-cancelado/',
PAYPAL: {
  mode: "live", // sandbox or live
  client_id: "AfaD66lrklatcJ_OPGjWXBqfZXp_AnZNF-754De4btrGpmEz4A7QLT3jCjj1garttASgbF_KfSr9nUIX",
  client_secret: "EDAt74c7xoBKmWa2OPFua4U5ZZqBlEeg2dI56lEi8x93xGicl_pMvfRFOw7IJch4wmVzLgC4ZegD-8LA",
},
BOTTELEGRAM: '1561605118:AAGb3L-XrmwWhdaACzZ1Jqxkx7fkRiKYdbU'
}