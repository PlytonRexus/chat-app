const usersUrl = '/users';

const fetchURLnew = async (obj) => {
  const token = obj.token;
  var path = location.protocol + '//' + location.hostname + ':' + location.port + '/chat/' + token + '/' + '?room=' + obj.newroom;
  console.log(path);
  return path;
}


const getURL = async (roomName) => {

    username = username.toLowerCase();
    roomName = roomName.toLowerCase();

    const user = {
      username: username.value,
      password: password.value,
      rooms: []
    };

    const body = JSON.stringify({user, room: room.value});

    console.log(body);

    console.log('This should always load.', usersUrl);

  var response = await fetch(usersUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body
  });

  console.log('This should load after the request is sent.', response);

  if (response.ok) {
      let obj = await response.json();

      console.log('This should load after a response is received.');
      console.log(obj);

      if (obj.createdUser){
        var url = await fetchURLnew(obj);
        console.log('A new user was created.');
        return url;
      }

      else {
        console.log(obj.message);
        var url = await fetchURLnew(obj);
        console.log('The user already existed.');
        return url;
      }
  }

  else console.log('HTTP-Error: ' + response.status);
};