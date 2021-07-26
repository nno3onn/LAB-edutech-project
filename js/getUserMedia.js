let video = document.querySelector("#videoElement");
let constraints = {
    audio: true,
    video: true
};

let context = new AudioContext();

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        // let videoTracks = stream.getVideoTracks();
        // let audioTracks = stream.getAudioTracks();
        // console.log('Got stream with constraints:', constraints);
        // console.log(videoTracks, audioTracks)
        // console.log('Using video device: ' + videoTracks[0].label);
        // console.log('Using audio device: ' + audioTracks[0].label);

        stream.onremovetrack = () => {
            console.log('Stream ended');
        };
        video.srcObject = stream;
    })
    .catch((err) => {
        console.error(err);
    });
}

function stop(e) {
    var stream = video.srcObject;
    var tracks = stream.getTracks();
  
    for (var i = 0; i < tracks.length; i++) {
      var track = tracks[i];
      track.stop();
    }
  
    video.srcObject = null;
}
