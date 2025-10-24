document.addEventListener("DOMContentLoaded", function() {
    // Remove any old FB bubble if present
    var old = document.getElementById('fb-chat-bubble');
    if (old) old.remove();

    // Inject styles for the AI chat
    var style = document.createElement('style');
    style.innerHTML = `
      #ai-chat-bubble { position: fixed; right: 20px; bottom: 20px; z-index:10000; }
      .ai-bubble { 
        width: 64px;
        height: 64px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #00b894, #55efc4);
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .ai-logo {
        width: 40px;
        height: 40px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .ai-logo-circle {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 3px solid #fff;
        border-radius: 50%;
        animation: pulse 2s infinite ease-in-out;
      }
      .ai-logo-text {
        color: #fff;
        font-size: 20px;
        font-weight: 700;
        font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        z-index: 1;
      }
      @keyframes pulse {
        0% { transform: scale(0.95); opacity: 0.5; }
        50% { transform: scale(1.05); opacity: 0.8; }
        100% { transform: scale(0.95); opacity: 0.5; }
      }
      .ai-window { position: fixed; right: 20px; bottom: 100px; width: 360px; max-width: calc(100% - 40px);
                   background:#fff;border-radius:12px;box-shadow:0 20px 40px rgba(0,0,0,0.2);overflow:hidden;
                   display:flex;flex-direction:column; font-family:Inter,sans-serif; z-index:10001; }
      .ai-header { background:#00b894;color:#fff;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;font-weight:700;}
      .ai-messages { padding:12px; max-height:320px; overflow:auto; background:#f7fff9; }
      .ai-msg { margin:8px 0; max-width:85%; padding:8px 10px;border-radius:10px; line-height:1.3; }
      .ai-msg.user { background:#e6f7f1; margin-left:auto; text-align:right; }
      .ai-msg.bot { background:#fff; border:1px solid #e6f2ea; }
      .ai-input-row { display:flex; gap:8px; padding:10px; border-top:1px solid #eee; background:#fff; }
      .ai-input { flex:1; padding:10px;border-radius:8px;border:1px solid #ddd; font-size:14px; }
      .ai-send { background:#008f6b;color:#fff;border:none;padding:8px 12px;border-radius:8px;cursor:pointer; }
      .ai-small { font-size:12px; opacity:0.85; }
      @media (max-width:420px){ .ai-window{ right:10px; left:10px; bottom:80px; width:auto; } }
    `;
    document.head.appendChild(style);

    // Create bubble
    var wrapper = document.createElement('div');
    wrapper.id = 'ai-chat-bubble';
    wrapper.innerHTML = `
      <div id="ai-bubble" class="ai-bubble" role="button" title="OIKOS AI Assistant">
        <div class="ai-logo">
          <div class="ai-logo-circle"></div>
          <span class="ai-logo-text">AI</span>
        </div>
      </div>
      <div id="ai-window" class="ai-window" style="display:none" aria-hidden="true">
        <div class="ai-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="ai-logo" style="width: 24px; height: 24px;">
              <div class="ai-logo-circle"></div>
              <span class="ai-logo-text" style="font-size: 12px;">AI</span>
            </div>
            OIKOS AI Assistant
          </div>
          <button id="ai-close" aria-label="Close" style="background:transparent;border:none;color:rgba(255,255,255,0.95);font-size:16px;cursor:pointer">✕</button>
        </div>
        <div id="ai-messages" class="ai-messages" role="log" aria-live="polite"></div>
        <div class="ai-input-row">
          <input id="ai-input" class="ai-input" placeholder="Type an idea prompt (e.g. 'kite festival activities')" aria-label="Message to AI">
          <button id="ai-send" class="ai-send">Send</button>
        </div>
      </div>
    `;
    document.body.appendChild(wrapper);

    var bubble = document.getElementById('ai-bubble');
    var windowEl = document.getElementById('ai-window');
    var closeBtn = document.getElementById('ai-close');
    var messages = document.getElementById('ai-messages');
    var input = document.getElementById('ai-input');
    var send = document.getElementById('ai-send');

    // Load history
    var history = JSON.parse(localStorage.getItem('aiChatHistory') || '[]');
    function renderHistory() {
      messages.innerHTML = '';
      history.forEach(item => appendMessage(item.text, item.sender, false));
      messages.scrollTop = messages.scrollHeight;
    }
    renderHistory();

    bubble.addEventListener('click', function(){
      var open = windowEl.style.display !== 'none';
      windowEl.style.display = open ? 'none' : 'flex';
      windowEl.setAttribute('aria-hidden', open ? 'true' : 'false');
      if (!open) input.focus();
    });
    closeBtn.addEventListener('click', function(){ windowEl.style.display = 'none'; windowEl.setAttribute('aria-hidden','true'); });

    // append message utility
    function appendMessage(text, sender, save) {
      var el = document.createElement('div');
      el.className = 'ai-msg ' + (sender === 'user' ? 'user' : 'bot');
      el.textContent = text;
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
      if (save) {
        history.push({sender: sender, text: text, time: Date.now()});
        localStorage.setItem('aiChatHistory', JSON.stringify(history.slice(-200)));
      }
    }

    // simple AI generator (client-side)
    function generateAIResponse(prompt) {
      // FAQ knowledge base (from user-provided content)
      const faq = {
        "1": "How do I make a reservation?\nYou can book directly through our Facebook page or by contacting us via phone or messenger. Advance booking is recommended, especially on weekends and holidays or access this link to reservation -> https://oikos-orcharandfarm.netlify.app/reserve-form.",
        "2": "What time is check-in and check-out?\nCheck-in time: 2:00 PM\nCheck-out time: 12:00 NN\nEarly check-in or late check-out may be arranged depending on availability.",
        "3": "What amenities are included?\nOur glamping tents include comfortable beds, clean linens, towels, lighting, Air Cooler / Air conditioned, and outdoor seating. Private bathrooms are available.",
        "4": "Are food and drinks provided?\nYou may bring your own food or enjoy our farm-to-table meals available at our Lounge area. Please inform us in advance if you’d like to order.",
        "5": "What activities can we do during our stay?\nGuests can enjoy farm tours, fruit picking, bonfires, tree planting, stargazing, nature walks, or simply relax and unwind in nature.",
        "6": "Is parking available?\nYes! Free and secure parking is available for all guests.",
        "7": "What happens if it rains?\nOur tents are waterproof and securely set up, so you’ll stay comfortable even during light rain. For extreme weather, we’ll contact guests ahead for rescheduling options.",
        "8": "Are pets allowed?\nYes, friendly pets are welcome in designated areas. Please inform us ahead if you plan to bring one.",
        "9": "What activities can we enjoy during our stay?\nThere’s something for everyone!\n- Farm and forest tour\n- Tree planting (see Adopt a Tree Packages)\n- Bonfire night\n- Stargazing\n- Nature walk or picnic\n- Team-building or group activities",
        "10": "What should we bring?\nWe recommend bringing:\n- Personal toiletries\n- Insect repellent and sunscreen\n- Comfortable clothes and shoes\n- Your camera and adventurous spirit!",
        "11": "Is there Wi‑Fi?\nYes.",
        "12": "Is Day Tour available?\nYes! Day Tour is available at Oikos Orchard & Farm! Enjoy the beauty of nature even just for a day — no overnight stay needed! Perfect for families, friends, schools, or teams who want to relax, explore, and connect with nature.",
        "13": "Is Day Tour available?\nWe have an on-going promo of Php 10,000 Family or Big Group Package good for 12 pax.We shall set up 2 glamping tents good for 4pax each and  2 regular tents good for 2pax each. In excess of 12pax: Php 500 add on per pax.SMALL GROUP: 2pax - 1 glamping tent Php 3500 4 pax - 1 glamping tent Php 4200. Do you want to book a reservation now? 😀",
      };


      if (!prompt || !prompt.trim()) {
        return "Please type a question or short idea. Example: \"How do I make a reservation?\" or \"What amenities are included?\"";
      }

      const q = prompt.toLowerCase().trim();

      // If user enters a number like "1" or "1." -> return corresponding FAQ
      const numMatch = q.match(/^\s*(\d{1,2})[\.\)]?\s*$/);
      if (numMatch && faq[numMatch[1]]) {
        return faq[numMatch[1]];
      }

      // direct question matching by keywords / phrases
      const mapping = [
        { keys: ["reservation", "book", "how do i make a reservation", "how to reserve"], id: "1" },
        { keys: ["check-in", "check in", "checkin", "check-out", "check out", "checko ut", "time"], id: "2" },
        { keys: ["amenities", "included", "what amenities"], id: "3" },
        { keys: ["food", "drinks", "meals", "lounge"], id: "4" },
        { keys: ["activities", "what activities", "things to do", "farm tours", "fruit picking"], id: "5" },
        { keys: ["parking"], id: "6" },
        { keys: ["rain", "weather", "reschedule"], id: "7" },
        { keys: ["pet", "pets", "animals"], id: "8" },
        { keys: ["tree planting", "adopt a tree", "team-building", "team building"], id: "9" },
        { keys: ["what should we bring", "bring", "pack"], id: "10" },
        { keys: ["wi-fi", "wifi", "wi fi", "is there a wi"], id: "11" },
        { keys: ["day tour", "daytour", "day tour available"], id: "12" },
        { keys: ["Cost", "Glamping", "Price"], id: "13" }
      ];

      for (let m of mapping) {
        for (let k of m.keys) {
          if (q.indexOf(k) !== -1) {
            return faq[m.id];
          }
        }
      }

      // fallback: if no direct match, provide compact FAQ summary + suggestion
      const summary = [
        faq["1"],
        faq["2"],
        faq["3"],
        "If you want more details, type the question number (1–12) or a short phrase like 'reservation' or 'amenities'."
      ].join("\n\n");

      return summary;
    }

    // simulate typing then show response
    function handleSend() {
      var text = input.value.trim();
      if (!text) return;
      appendMessage(text, 'user', true);
      input.value = '';
      // show a typing indicator
      var typing = document.createElement('div');
      typing.className = 'ai-msg bot';
      typing.textContent = 'OIKOS is thinking...';
      messages.appendChild(typing);
      messages.scrollTop = messages.scrollHeight;

      setTimeout(function(){
        typing.remove();
        var reply = generateAIResponse(text);
        // split into paragraphs -> create multiple message blocks for readability
        reply.split(/\n\n+/).forEach(p => appendMessage(p.trim(), 'bot', true));
      }, 700 + Math.min(1600, text.length * 20));
    }

    send.addEventListener('click', handleSend);
    input.addEventListener('keydown', function(e){
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    });

    // expose a quick reset via double-click on bubble (optional)
    bubble.addEventListener('dblclick', function(){
      if (confirm('Clear AICHAT conversation history?')) {
        history = [];
        localStorage.removeItem('aiChatHistory');
        renderHistory();
      }
    });
  });