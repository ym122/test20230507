var video = document.createElement("video");
    var canvasElement = document.getElementById("canvas");
    var canvas = canvasElement.getContext("2d");
    var loadingMessage = document.getElementById("loadingMessage");
    //var outputContainer = document.getElementById("output");
    //var outputMessage = document.getElementById("outputMessage");
    //var outputData = document.getElementById("outputData");
    var isReadQR = false;


$('#qrON').on('click',function(){       //ボタンクリックにてQRコードリーダーを起動する
               qrRead();
               //$('#canvas_wrapper').html('<button id="qrON" class="customButton">戻る</button>');
               setTimeout($('#qrON').prop('disabled',true), 6000); 
           });
    
//QRコードを読む
           function qrRead() {

    isReadQR = false;

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
      video.srcObject = stream;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.play();
      requestAnimationFrame(tick);
    });

}

    function tick() {
      loadingMessage.innerText = "⌛ Loading video..."
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        loadingMessage.hidden = true;
        canvasElement.hidden = false;
        //outputContainer.hidden = false;

        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        if (code && !isReadQR) {
            $('#canvas_wrapper').remove();
            $('#frame_area').html('<iframe src="' + code.data + '" width="100%" height="300"></iframe>');
            setTimeout("location.reload()",8000);
            //location.href = code.data;
            //window.open(code.data, '_blank');
            isReadQR = true;

           
        }
      }
       if(!isReadQR){
               requestAnimationFrame(tick);
             }
    }