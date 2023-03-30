const fs = require("fs");
const axios = require("axios");

var data = fs.readFileSync("sampledata.csv");

const s = data.toString().split('"');
let i = 0;

while (i < s.length) {
  if (s[i].length < 5) {
    s.splice(i, 1);
  }
  i++;
}

console.log(s.length);

let a = new Array(3);
a[0] = {
  userId:"64232d5d94f0e8a170be11f3",token:"JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MjMyZDVkOTRmMGU4YTE3MGJlMTFmMyIsImVtYWlsIjoidXNlcjEwMEBtYWlsLmNvbSIsImlhdCI6MTY4MDAyNjk4M30.AS3UfruZ_AHnk6pf5Bje-RysC3pK8YzlRH-dqQ2YhKA"
};
a[1] = {
  userId:"64232dbbfa99859d90deb56d",token:"JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MjMyZGJiZmE5OTg1OWQ5MGRlYjU2ZCIsImVtYWlsIjoidXNlcjEwMUBtYWlsLmNvbSIsImlhdCI6MTY4MDAyNzA3NX0.E9IfWGYK0FFThoEGvSQoEXoXcK60iaBP4yXgD32B-Mk"
};
a[2] = {
  userId:"64232decd8a7d26618e2c897",token:"JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MjMyZGVjZDhhN2QyNjYxOGUyYzg5NyIsImVtYWlsIjoidXNlcjEwMkBtYWlsLmNvbSIsImlhdCI6MTY4MDAyNzEyM30.oN35zeGF_FUeORGIWZXX0CMNN8_WO9rVua_6DIfXP-k"
};

// for (i = 0; i < s.length; i++) {
//   if (i < 10) {
//     console.log(s[i]);
//   }
// }

for (i = 0; i < s.length; i++) {
  let data = s[i];
  let token = a[i % 3].token;
  let id = a[i % 3].userId;

  setTimeout(function() {
    axios({
      method: "post",
      url: `http://localhost:4350/api/post/create`,
      headers: {
        Authorization: token,
        withCredentials: true,
      },
      data: {
        user_id: id,
        content: data,
      },
    }).then(() => {
      console.log("Finished creating post");
    })
  }, i * 6000);
}
