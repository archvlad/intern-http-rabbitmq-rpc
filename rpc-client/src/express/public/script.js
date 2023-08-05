function generateImage() {
  const params = new URLSearchParams({
    gender: document.querySelector('[name=gender]').value,
    age: document.querySelector('[name=age]').value,
    etnic: document.querySelector('[name=etnic]').value,
  });

  document.querySelector('img').src =
    `http://${window.location.hostname}:3000/avatar?` +
    params +
    '&t=' +
    new Date().getTime();
}

generateImage();
