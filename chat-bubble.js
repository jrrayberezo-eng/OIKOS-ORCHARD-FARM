document.addEventListener("DOMContentLoaded", function() {
    // Create the chat bubble element
    var chatBubble = document.createElement("div");
    chatBubble.id = "fb-customer-chat";
    chatBubble.className = "fb-customerchat";
    chatBubble.setAttribute("page_id", "YOUR_PAGE_ID"); // Replace with your Facebook Page ID
    chatBubble.setAttribute("attribution", "setup_tool");

    // Append the chat bubble to the body
    document.body.appendChild(chatBubble);

    // Load the Facebook SDK for JavaScript
    window.fbAsyncInit = function() {
        FB.init({
            xfbml: true,
            version: 'v12.0' // Use the latest version
        });
    };

    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); 
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    // Simple floating FB chat bubble — opens Messenger (m.me) or FB page as fallback.
    (function(){
      function createBubble(){
        var wrap = document.getElementById('fb-chat-bubble') || document.createElement('div');
        wrap.id = 'fb-chat-bubble';

        var link = document.createElement('a');
        link.href = 'https://m.me/OikosOrchard';
        link.target = '_blank';
        link.rel = 'noopener';
        link.title = 'Chat with us on Facebook Messenger';

        var bubble = document.createElement('div');
        bubble.style.width = '56px';
        bubble.style.height = '56px';
        bubble.style.borderRadius = '50%';
        bubble.style.display = 'flex';
        bubble.style.alignItems = 'center';
        bubble.style.justifyContent = 'center';
        bubble.style.background = 'linear-gradient(135deg,#4caf50,#8ccf7b)';
        bubble.style.boxShadow = '0 10px 30px rgba(76,175,80,0.18)';
        bubble.style.cursor = 'pointer';
        bubble.className = 'float-slow pulse-slow';

        bubble.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M12 3C7 3 3 6.9 3 11.5 3 14 4.2 16 6 17.5V21l3.1-1.7c.9.2 1.9.3 2.9.3 5 0 9-3.9 9-8.6S17 3 12 3z"></path></svg>';

        link.appendChild(bubble);
        wrap.appendChild(link);

        if(!document.getElementById('fb-chat-bubble'))
          document.body.appendChild(wrap);
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createBubble);
      } else {
        createBubble();
      }
    })();
});