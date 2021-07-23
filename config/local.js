module.exports = {
    SERVER: "Local",
    URL: "http://localhost:3001",
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
  SUCCESS: 'http://localhost:8080/pago/',
  CANCEL: 'http://localhost:8080/pago-cancelado/',
  PAYPAL: {
    mode: "sandbox", // sandbox or live
    client_id: "ATJ1YeuuF-VQISKcpGSW_0QRsypkszI_rW8-GXD1Sed1tiA4iEyzj0w17-H9xQWMCKIcZQga7SjG5LxP",
    client_secret: "ECsN2NNu5aw4jTG65KT2w_hQsH_Iv2S3JFuXxycuW4xnpTjonbpZuPXT6PJSVYGm8YBdUxF_HBkTAVKp",
  },
  BOTTELEGRAM: '1582500408:AAGXxlBBbfTiN9NYNKLThg1xaStCeaaKRrI'
  
}
