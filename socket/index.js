 

const socket = (server) => {
  const io = require('socket.io')(server,  
    {
      cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
      }
    }
    );
  io.on('connect', socket => {
    socket.send('Hello!');
  
    // or with emit() and custom event names
    socket.emit('greetings', 'Hey!', { 'ms': 'jane' }, Buffer.from([4, 3, 3, 1]));
  
    // handle the event sent with socket.send()
    socket.on('message', (data) => {
      console.log(data);
    });
  
    // handle the event sent with socket.emit()
    socket.on('salutations', (elem1, elem2, elem3) => {
      console.log(elem1, elem2, elem3);
    });
  });

}




module.exports = socket 