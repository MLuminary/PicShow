(function() {
  //引入头部和尾部
  $('#header').load('header.html');
  $('#footer').load('footer.html');

  let domain = 'p7hgnuu8t.bkt.clouddn.com';

  $.ajax({
    type: 'get',
    url: '/api/token',
    success: function(req) {
      var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4', //上传模式,依次退化
        browse_button: 'add', //上传选择的点选按钮，**必需**
        uptoken: req, //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        // unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
        // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
        domain: domain, //bucket 域名，下载资源时用到，**必需**
        get_new_uptoken: false, //设置上传文件的时候是否每次都重新获取新的token
        max_file_size: '4mb', //最大文件体积限制
        max_retries: 0, //上传失败最大重试次数
        multi_selection: true,
        flash_swf_url: '../static/Moxie.swf',
        silverlight_xap_url: '../static/Moxie.xap',
        chunk_size: '4mb', //分块上传时，每片的体积
        auto_start: false, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        filters: {
          // 限制上传的文件类型
          mime_types: [{ title: 'Image files', extensions: 'jpg,gif,png' }]
        },
        init: {
          FilesAdded: function(up, files) {
            let index = 0;
            $('.dialog').addClass('show');
            plupload.each(files, function(file) {
              var trCont = `<tr><td>${++index}</td><td>${
                file.name
              }</td><td class="${file.id}"></td><td>${ToMBorKB(file.size).size} ${ToMBorKB(file.size).sig}</td>
              <td>
                <div class="progress">
                  <div class="progress-bar file-${file.id}" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    0%
                  </div>
                </div>
              </td></tr>`;
              $('.table tbody').append(trCont);
            });
          },
          BeforeUpload: function(up, file) {
            // 每个文件上传前,处理相关的事情
          },
          UploadProgress: function(up, file) {
            // 每个文件上传时,处理相关的事情
            var percent = file.percent;
            $(".progress .file-" + file.id).css('width',percent + '%');
            $(".progress .file-" + file.id).text(percent + '%');
          },
          FileUploaded: function(up, file, info) {
            // 每个文件上传成功后,处理相关的事情
            // 其中 info.response 是文件上传成功后，服务端返回的json，形式如
            // {
            //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
            //    "key": "gogopher.jpg"
            //  }
            // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
            var domain = up.getOption('domain');
            var res = JSON.parse(info.response);
            var sourceLink = 'http://' + domain + '/' + res.key;
            //添加缩略图
            var img = new Image();
            img.src = sourceLink;
            img.height = 50;
            img.width = 50;
            $('.'+file.id).append(img);

          },
          Error: function(up, err, errTip) {
            //上传出错时,处理相关的事情
          },
          UploadComplete: function() {
            //队列文件处理完毕后,处理相关的事情
          },
          Key: function(up, file) {
            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
            // 该配置必须要在 unique_names: false , save_key: false 时才生效

            var key = file.name;
            // do something with key here
            return key;
          }
        }
      });

      $('.start-upload').click(function() {
        uploader.start();
      });
    }
  });

  //点击隐藏上传表
  $('.dialog-control').click(function() {
    $('.dialog').removeClass('show');
  });

  function ToMBorKB(size){
    if(size / 1024 > 500){
      return {size:Math.ceil(size / 1024 / 1024),sig:'mb'}
    }else{
      return {size:Math.ceil(size / 1024),sig:'kb'}
    }
  }

})();

// domain 为七牛空间（bucket)对应的域名，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取

// uploader 为一个plupload对象，继承了所有plupload的方法，参考http://plupload.com/docs

