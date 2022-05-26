export function getChatWebviewContent(url: any, token: any)
{
  return `
  <!DOCTYPE html>
<html>
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>vsChat</title>
      <style>
         body,
         html, #app {
         width: 100%;
         height: 100%;
         overflow: hidden;
         }
         * {
         padding: 0;
         margin: 0;
         }
         iframe {
         width: 100%;
         height: 100%;
         overflow: hidden;
         border: none;
         }
      </style>
   </head>
   <body onload="loading()">
      <div id="app" style="display:none;">
        <div id="snow"></div>
        <iframe allowtransparency="true" src="${url}?token=${token}"
          frameborder="0"></iframe>
      </div>
      <script>
         // Loading screen
         var loadingScreen;
        function loading() {
          loadingScreen = setTimeout(showPage, 1000);
        }
        function showPage() {
          document.getElementById("app").style.display = "block";  
        }
        document.head.append(script);

      </script>
   </body>
</html>
	`;
}

export function getLogWebviewContent(url: string, token: any)
{
  return `
  <!DOCTYPE html>
<html>
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>vsChat</title>
      <style>
         body,
         html, #app {
         width: 100%;
         height: 100%;
         overflow: hidden;
         }
         * {
         padding: 0;
         margin: 0;
         }
         iframe {
         width: 100%;
         height: 100%;
         overflow: hidden;
         border: none;
         }
      </style>
   </head>
   <body onload="loading()">
      <div id="app" style="display:none;">
        <div id="snow"></div>
        <iframe allowtransparency="true" src="${url}?token=${token}"
          frameborder="0"></iframe>
      </div>
      <script>
         // Loading screen
         var loadingScreen;
        function loading() {
          loadingScreen = setTimeout(showPage, 1000);
        }
        function showPage() {
          document.getElementById("app").style.display = "block";  
        }
        document.head.append(script);
      </script>
   </body>
</html>
	`;
}

export function getFirstWebview(username: any, curr: any) {
    return `<!DOCTYPE html>
    <html>
    <head>
    <title>Welcome To Join CodeLabHub</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <style>
        body,h1,h2,h3,h4,h5,h6 {font-family: "Lato", sans-serif;}
        body, html {
        height: 100%;
        color: #777;
        line-height: 1.8;
    }
    
  /* Create a Parallax Effect */
    .bgimg-1 {
        background-attachment: fixed;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }

  /* First image (Logo. Full height) */
    .bgimg-1 {
        background-image: url('https://cdn.arstechnica.net/wp-content/uploads/2019/03/codersTOP-800x534.jpg');
        height: 100%;
    }
    
    .w3-wide {letter-spacing: 10px;}
    .w3-hover-opacity {cursor: pointer;}
    
  /* Turn off parallax scrolling for tablets and phones */
    @media only screen and (max-device-width: 1600px) {
    .bgimg-1{
        background-attachment: scroll;
        min-height: 400px;
    }
    }
    </style>
    </head>
    <body>
    
    <!-- First Parallax Image with Logo Text -->
    <div class="bgimg-1 w3-display-container w3-opacity-min" id="home">
    <div class="w3-display-middle" style="white-space:nowrap;">
        <div>
            <span class="w3-center w3-padding-large w3-black w3-xlarge w3-wide w3-animate-opacity">WE HAVE <span class="w3-hide-small">${username}</span> USERS</span>
            <div></div>
            <span class="w3-center w3-padding-large w3-black w3-xlarge w3-wide w3-animate-opacity">There are <span class="w3-hide-small">${curr}</span> user(s) sign-in</span>
        </div>
    </div>
    <span class="w3-center w3-padding-large w3-black w3-xlarge w3-wide w3-animate-opacity">WELCOME TO CODELABSTUDIO</span>
    </div>
    
    <script>
  // Modal Image Gallery
    function onClick(element) {
    document.getElementById("img01").src = element.src;
    document.getElementById("modal01").style.display = "block";
    var captionText = document.getElementById("caption");
    captionText.innerHTML = element.alt;
    }
    
    </script>
    
    </body>
    </html>
    `;
}