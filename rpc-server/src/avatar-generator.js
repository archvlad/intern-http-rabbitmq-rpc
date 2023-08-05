const axios = require('axios');

module.exports.generateAvatar = async ({
  gender = 'all',
  age = 'all',
  etnic = 'all',
}) => {
  let res = await axios(
    `https://this-person-does-not-exist.com/new?time=${new Date().getTime()}&gender=${gender}&age=${age}&etnic=${etnic}`,
    {
      method: 'GET',
    },
  );
  res = await axios.get(
    `https://this-person-does-not-exist.com/${res.data.src}`,
    {
      responseType: 'text',
      responseEncoding: 'base64',
    },
  );
  return res.data;
};
