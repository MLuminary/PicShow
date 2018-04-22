(function() {
  $('#header').load('header.html');
  $('#footer').load('footer.html');

  let search = window.location.search;
  //获取图片地址
  let sourceKey = search.split('=')[1];
  let imgName = sourceKey.split('/')[3];

  let img = `<img width="100%" src="${sourceKey}">`;
  $('#content .imgBox').append(img);
  $('#content .imgName').text(imgName);

  $('#content .imgUrl').click(function() {
    download(sourceKey,imgName);
  });


  //获取Blob
  function getBlob(url) {
    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        }
      };
      xhr.send();
    });
  }
  //保存
  function saveAs(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');

      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();

      window.URL.revokeObjectURL(link.href);
    }
  }
  //下载
  function download(url, filename) {
    getBlob(url).then(blob => {
      saveAs(blob, filename);
    });
  }
})();
