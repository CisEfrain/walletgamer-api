module.exports = {
    SERVER: "Development",
    URL: "http://app-dev.walletgamer.com/",
    ADAPTERPORT: 8080,
    LOG: {
      BUSSINESS: "./logs/bussiness/buss.log",
      DEBUG: "./logs/debug/debug.log",
    },
    DATABASE: {
      USER: "wallet_desa",
      PASS: "DF64gOtW",
      DB: "wallet_gamerD",
      HOST: "127.0.0.1"
  },
  STRIPE: { 
    KEY:'sk_test_51DgyAJDdwKvLHaMCFWO0jnWJ6t3pupHKFMCvoFYQNV5IC3u0d9Deur5M8ZdkvIQw8GUTfkUSpMaSIOorDV7hiQ4i00EmZ5udiJ',
    IMG: 'https://i.imgur.com/EHyR2nP.png'
  },
  SUCCESS: 'http://api-dev.walletgamer.com/pago/',
  CANCEL: 'http://app-dev.walletgamer.com/pago-cancelado/',
  PAYPAL: {
    mode: "sandbox", // sandbox or live
    client_id: "ATJ1YeuuF-VQISKcpGSW_0QRsypkszI_rW8-GXD1Sed1tiA4iEyzj0w17-H9xQWMCKIcZQga7SjG5LxP",
    client_secret: "ECsN2NNu5aw4jTG65KT2w_hQsH_Iv2S3JFuXxycuW4xnpTjonbpZuPXT6PJSVYGm8YBdUxF_HBkTAVKp",
  },
  BOTTELEGRAM: '1576008334:AAE60vnOx1j4bwWmJ2W6JtN-giw9cYBxY2Q'
}